import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { Section, Divider, ChapterLabel, ChartCard, FadeIn, colors } from './shared';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function useData3() {
    const [data, setData] = useState(null);
    useEffect(() => {
        fetch('/data3.xlsx')
            .then(r => r.arrayBuffer())
            .then(buf => {
                const wb = XLSX.read(buf, { type: 'array' });
                const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
                setData(rows);
            });
    }, []);
    return data;
}

function BgDecor() {
    return (
        <>
            <style>{`
                @keyframes rotateSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes pulse3 { 0%,100%{opacity:0.15} 50%{opacity:0.3} }
            `}</style>
            <div style={{ position: 'absolute', width: 600, height: 600, top: '50%', left: '-15%', transform: 'translateY(-50%)', border: '1.5px solid rgba(212,120,138,0.2)', borderRadius: '50%', animation: 'rotateSlow 40s linear infinite', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', width: 400, height: 400, top: '50%', left: '-8%', transform: 'translateY(-50%)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '50%', animation: 'rotateSlow 28s linear infinite reverse', pointerEvents: 'none' }} />
            {[{ w: 350, h: 350, top: '-5%', right: '-5%', color: 'rgba(212,120,138,0.12)' }, { w: 280, h: 280, bottom: '5%', left: '40%', color: 'rgba(201,168,76,0.1)' }].map((b, i) => (
                <div key={i} style={{ position: 'absolute', width: b.w, height: b.h, top: b.top, bottom: b.bottom, left: b.left, right: b.right, background: `radial-gradient(circle, ${b.color} 0%, transparent 70%)`, borderRadius: '50%', pointerEvents: 'none', animation: `pulse3 ${6 + i * 2}s ease-in-out infinite` }} />
            ))}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'radial-gradient(circle, rgba(212,120,138,0.12) 1px, transparent 1px)', backgroundSize: '32px 32px', opacity: 0.6 }} />
        </>
    );
}

const AGE_ORDER = ['15-19 years','20-24 years','25-34 years','35-44 years','45-54 years','55-64 years','65-74 years','75-84 years','85 years and over'];

export default function Chapter3({ index }) {
    const rawData = useData3();


    const [status, setStatus] = useState('registered marriage');

    let registeredTotal = 0, defactoTotal = 0;
    if (rawData) {
        rawData.forEach(r => {
            if (r.status === 'registered marriage') registeredTotal += r.total;
            else if (r.status === 'de facto marriage') defactoTotal += r.total;
        });
    }
    const grandTotal = registeredTotal + defactoTotal;
    const registeredPct = grandTotal ? ((registeredTotal / grandTotal) * 100).toFixed(1) : 0;
    const defactoPct    = grandTotal ? ((defactoTotal    / grandTotal) * 100).toFixed(1) : 0;

    const barOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            tooltip: { callbacks: { label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y.toLocaleString()}` } },
        },
        scales: {
            x: { ticks: { font: { size: 10 } }, grid: { display: false } },
            y: { beginAtZero: true, ticks: { callback: v => v >= 1000 ? (v/1000)+'k' : v, font: { size: 10 } }, grid: { color: 'rgba(0,0,0,0.05)' } },
        },
    };

    const barMaleData   = AGE_ORDER.map(age => rawData ? (rawData.find(r => r.gender==='male'   && r.age===age && r.status===status)?.total ?? 0) : 0);
    const barFemaleData = AGE_ORDER.map(age => rawData ? (rawData.find(r => r.gender==='female' && r.age===age && r.status===status)?.total ?? 0) : 0);

    const barAgeData = {
        labels: AGE_ORDER.map(a => a.replace(' years', '').replace(' and over', '+')),
        datasets: [
            { label: 'Male',   data: barMaleData,   backgroundColor: '#6495ed', borderRadius: 4 },
            { label: 'Female', data: barFemaleData, backgroundColor: colors.rose, borderRadius: 4 },
        ],
    };

    const barTotalData = {
        labels: AGE_ORDER.map(a => a.replace(' years', '').replace(' and over', '+')),
        datasets: [
            { label: 'Registered Marriage', data: AGE_ORDER.map(age => rawData ? rawData.filter(r => r.age===age && r.status==='registered marriage').reduce((a,r)=>a+r.total,0) : 0), backgroundColor: colors.rose, borderRadius: 4 },
            { label: 'De Facto Marriage',   data: AGE_ORDER.map(age => rawData ? rawData.filter(r => r.age===age && r.status==='de facto marriage').reduce((a,r)=>a+r.total,0)   : 0), backgroundColor: colors.gold, borderRadius: 4 },
        ],
    };

    const barHorizOptions = {
        ...barOptions,
        indexAxis: 'y',
        plugins: {
            ...barOptions.plugins,
            tooltip: { callbacks: { label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.x.toLocaleString()}` } },
        },
        scales: {
            x: { beginAtZero: true, ticks: { callback: v => v >= 1000 ? (v/1000)+'k' : v, font: { size: 10 } }, grid: { color: 'rgba(0,0,0,0.05)' } },
            y: { ticks: { font: { size: 10 } }, grid: { display: false } },
        },
    };

    const pieData = {
        labels: ['Registered Marriage', 'De Facto Marriage'],
        datasets: [{
            data: [registeredTotal, defactoTotal],
            backgroundColor: [colors.rose, colors.gold],
            borderColor: ['#fff', '#fff'],
            borderWidth: 3,
        }],
    };

    const pieOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'bottom', labels: { font: { size: 13 }, padding: 20 } },
            tooltip: {
                callbacks: {
                    label: ctx => {
                        const pct = ((ctx.parsed / grandTotal) * 100).toFixed(1);
                        return ` ${ctx.label}: ${ctx.parsed.toLocaleString()} (${pct}%)`;
                    },
                },
            },
        },
    };

    return (
        <Section index={index} bg="linear-gradient(145deg, #fff5f8 0%, #fef0f5 40%, #f5f0ff 100%)">
            <BgDecor />
            <div style={{ position: 'relative', zIndex: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                {/* Top section: 2-column grid — left: text, right: pie chart */}
                {!rawData ? (
                    <div style={{ color: '#aaa' }}>Memuat data...</div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, width: '100%', maxWidth: 1100, boxSizing: 'border-box', alignItems: 'center', marginBottom: 24 }}>
                        <FadeIn>
                            <div>
                                <ChapterLabel num={3} title="🏠 De Facto vs Pernikahan Resmi" />
                                <Divider />
                                <p style={{ fontSize: '0.95rem', color: '#9a7a7a', lineHeight: 1.8, marginBottom: 24 }}>
                                    Berdasarkan Sensus Penduduk Australia 2021, terdapat perbedaan signifikan antara
                                    pasangan yang menikah secara resmi dan yang hidup bersama (de facto).
                                </p>
                                <div style={{ display: 'flex', gap: 24 }}>
                                    <div style={{ textAlign: 'left' }}>
                                        <div style={{ fontSize: '1.6rem', fontFamily: "'Playfair Display', serif", color: colors.rose, fontWeight: 700 }}>{registeredPct}%</div>
                                        <div style={{ fontSize: '0.78rem', color: '#999' }}>Registered Marriage</div>
                                    </div>
                                    <div style={{ textAlign: 'left' }}>
                                        <div style={{ fontSize: '1.6rem', fontFamily: "'Playfair Display', serif", color: colors.gold, fontWeight: 700 }}>{defactoPct}%</div>
                                        <div style={{ fontSize: '0.78rem', color: '#999' }}>De Facto Marriage</div>
                                    </div>
                                </div>
                            </div>
                        </FadeIn>

                        <FadeIn delay={0.1}>
                            <ChartCard title="Komposisi Pasangan: Registered vs De Facto" style={{ width: '100%' }}>
                                <div style={{ maxWidth: 260, margin: '0 auto' }}>
                                    <Pie data={pieData} options={pieOptions} />
                                </div>
                                <p style={{ fontSize: '0.75rem', color: '#aaa', textAlign: 'center', marginTop: 12 }}>Sumber: ABS Census 2021</p>
                            </ChartCard>
                        </FadeIn>
                    </div>
                )}

                {rawData && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, width: '100%', maxWidth: 1100, boxSizing: 'border-box' }}>

                        <FadeIn delay={0.2} style={{ width: '100%' }}>
                            <ChartCard title="Male vs Female per Kelompok Umur" style={{ width: '100%' }}>
                                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 14 }}>
                                    {['registered marriage', 'de facto marriage'].map(s => (
                                        <button key={s} onClick={() => setStatus(s)} style={{
                                            padding: '5px 18px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600,
                                            background: status === s ? (s === 'registered marriage' ? colors.rose : colors.gold) : '#f0f0f0',
                                            color: status === s ? '#fff' : '#888',
                                            transition: 'all 0.2s',
                                        }}>
                                            {s === 'registered marriage' ? '💍 Registered' : '🏠 De Facto'}
                                        </button>
                                    ))}
                                </div>
                                <Bar data={barAgeData} options={barOptions} />
                                <p style={{ fontSize: '0.75rem', color: '#aaa', textAlign: 'center', marginTop: 10 }}>Sumber: ABS Census 2021</p>
                            </ChartCard>
                        </FadeIn>

                        <FadeIn delay={0.3} style={{ width: '100%' }}>
                            <ChartCard title="Total Registered vs De Facto per Kelompok Umur" style={{ width: '100%' }}>
                                <Bar data={barTotalData} options={barHorizOptions} />
                                <p style={{ fontSize: '0.75rem', color: '#aaa', textAlign: 'center', marginTop: 10 }}>Sumber: ABS Census 2021</p>
                            </ChartCard>
                        </FadeIn>
                    </div>
                )}
            </div>
        </Section>
    );
}
