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
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
            <style>{`
                @keyframes floatUp3 { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-20px) rotate(5deg)} }
                @keyframes pulse3 { 0%,100%{opacity:0.1} 50%{opacity:0.25} }
            `}</style>
            
            {/* Latar Belakang Selaras dengan Chapter Lain (Soft Orbs) */}
            <div style={{ position: 'absolute', width: 500, height: 500, top: '-10%', left: '-10%', background: 'radial-gradient(circle, rgba(212,120,138,0.15) 0%, transparent 70%)', borderRadius: '50%', animation: 'pulse3 8s infinite' }} />
            <div style={{ position: 'absolute', width: 400, height: 400, bottom: '-5%', right: '-5%', background: 'radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%)', borderRadius: '50%', animation: 'pulse3 10s infinite reverse' }} />
            
            {/* Elemen melayang ringan */}
            {[
                { size: 120, top: '20%', right: '10%', color: 'rgba(212,120,138,0.15)' },
                { size: 80, bottom: '30%', left: '8%', color: 'rgba(201,168,76,0.2)' }
            ].map((r, i) => (
                <div key={i} style={{
                    position: 'absolute', width: r.size, height: r.size,
                    top: r.top, bottom: r.bottom, left: r.left, right: r.right,
                    border: `2px solid ${r.color}`, borderRadius: '50%',
                    animation: `floatUp3 ${6 + i * 2}s ease-in-out infinite`
                }} />
            ))}

            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(212,120,138,0.08) 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }} />
        </div>
    );
}

const AGE_ORDER = ['15-19 years','20-24 years','25-34 years','35-44 years','45-54 years','55-64 years','65-74 years','75-84 years','85 years and over'];

const flatTooltip = {
    backgroundColor: '#ffffff', 
    titleColor: colors.dark,
    bodyColor: '#555',
    borderColor: 'rgba(212,120,138,0.3)',
    borderWidth: 1,
    padding: 12,
    boxPadding: 6,
    usePointStyle: true,
    titleFont: { size: 13, family: "'Playfair Display', serif", weight: 'bold' },
    bodyFont: { size: 12, family: "'Nunito', sans-serif" },
    boxShadow: '0 4px 15px rgba(0,0,0,0.08)', 
};

// Helper untuk format umur agar tetap ada "years" tapi yang 85 ke atas jadi "85+ years"
const formatAge = (a) => a === '85 years and over' ? '85+ years' : a;

export default function Chapter3({ index }) {
    const rawData = useData3();

    let regTotal = 0, defactoTotal = 0;
    let regMale = 0, regFemale = 0, defactoMale = 0, defactoFemale = 0;

    if (rawData) {
        rawData.forEach(r => {
            if (r.status === 'registered marriage') {
                regTotal += r.total;
                if (r.gender === 'male') regMale += r.total;
                else regFemale += r.total;
            } else if (r.status === 'de facto marriage') {
                defactoTotal += r.total;
                if (r.gender === 'male') defactoMale += r.total;
                else defactoFemale += r.total;
            }
        });
    }

    const grandTotal = regTotal + defactoTotal;
    const registeredPct = grandTotal ? ((regTotal / grandTotal) * 100).toFixed(1) : 0;
    const defactoPct    = grandTotal ? ((defactoTotal / grandTotal) * 100).toFixed(1) : 0;

    // --- CHART DATA & OPTIONS ---

    const pieData = {
        labels: ['Registered Marriage', 'De Facto Marriage'],
        datasets: [{
            data: [regTotal, defactoTotal],
            backgroundColor: [colors.rose, colors.gold], 
            borderColor: ['#fff', '#fff'],
            borderWidth: 3,
            hoverOffset: 6,
        }],
    };

    const pieOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
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

    const barGenderData = {
        labels: ['Female', 'Male'],
        datasets: [
            { 
                label: 'De Facto', 
                data: [defactoFemale, defactoMale], 
                backgroundColor: colors.gold, 
                borderRadius: 6,
                barPercentage: 0.6,      
                categoryPercentage: 0.7 
            },
            { 
                label: 'Registered', 
                data: [regFemale, regMale], 
                backgroundColor: colors.rose, 
                borderRadius: 6,
                barPercentage: 0.6,
                categoryPercentage: 0.7
            },
        ],
    };

    const barTotalData = {
        labels: AGE_ORDER.map(formatAge),
        datasets: [
            { label: 'De Facto',   data: AGE_ORDER.map(age => rawData ? rawData.filter(r => r.age===age && r.status==='de facto marriage').reduce((a,r)=>a+r.total,0)   : 0), backgroundColor: colors.gold, borderRadius: 4 },
            { label: 'Registered', data: AGE_ORDER.map(age => rawData ? rawData.filter(r => r.age===age && r.status==='registered marriage').reduce((a,r)=>a+r.total,0) : 0), backgroundColor: colors.rose, borderRadius: 4 },
        ],
    };

    const barHorizOptions = {
        responsive: true,
        indexAxis: 'y',
        plugins: {
            legend: { position: 'top', align: 'end', labels: { usePointStyle: true, boxWidth: 8 } },
            tooltip: { callbacks: { label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.x.toLocaleString()}` } },
        },
        scales: {
            x: { title: { display: true, text: 'Total', align: 'center' }, beginAtZero: true, ticks: { callback: v => v >= 1000 ? (v/1000)+'K' : v, font: { size: 10 } }, grid: { color: 'rgba(0,0,0,0.05)', drawBorder: false } },
            y: { title: { display: true, text: 'Age', align: 'center' }, ticks: { font: { size: 10 } }, grid: { display: false } },
        },
    };

    const barDefactoData = {
        labels: AGE_ORDER.map(formatAge),
        datasets: [{ 
            label: 'Total De Facto', 
            data: AGE_ORDER.map(age => rawData ? rawData.filter(r => r.age===age && r.status==='de facto marriage').reduce((a,r)=>a+r.total,0) : 0), 
            backgroundColor: AGE_ORDER.map(a => a === '25-34 years' ? colors.rose : 'rgba(201,168,76, 0.5)'), 
            borderRadius: 6 
        }],
    };

    const barVertOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: ctx => ` ${ctx.parsed.y.toLocaleString()} pasangan` } },
        },
        scales: {
            x: { title: { display: true, text: 'Age', align: 'center' }, ticks: { font: { size: 10 } }, grid: { display: false } },
            y: { title: { display: true, text: 'Total', align: 'center' }, beginAtZero: true, ticks: { callback: v => v >= 1000 ? (v/1000)+'K' : v, font: { size: 10 } }, grid: { color: 'rgba(0,0,0,0.05)', drawBorder: false } },
        },
    };

    const barGenderVertOptions = {
        ...barVertOptions,
        layout: {
            padding: { top: 10 } 
        },
        plugins: {
            legend: { 
                position: 'top', 
                align: 'center', 
                labels: { 
                    usePointStyle: true, 
                    boxWidth: 8, 
                    padding: 10, 
                    font: { size: 12, family: "'Nunito', sans-serif" },
                    color: '#666'
                } 
            },
            tooltip: { ...flatTooltip }
        },
        scales: {
            x: { 
                ticks: { font: { size: 11 }, color: '#888' }, 
                grid: { display: false } 
            },
            y: { 
                title: { display: true, text: 'Total', align: 'center', color: '#999', font: { size: 11 } }, 
                beginAtZero: true, 
                ticks: { callback: v => v >= 1000 ? (v/1000)+'K' : v, font: { size: 11 }, color: '#888' }, 
                grid: { color: 'rgba(0,0,0,0.04)', drawBorder: false } 
            }
        }
    }

    // --- TYPOGRAPHY STYLES ---

    const storyTitleStyle = { 
        fontFamily: "'Caveat', cursive", 
        fontSize: 'clamp(2.4rem, 4vw, 3.4rem)', 
        color: colors.dark, 
        lineHeight: 1.1,
    };

    const storyTextStyle  = { 
        fontSize: '1rem', 
        color: '#666', 
        lineHeight: 1.8, 
        marginBottom: 16 
    };

    const highlightText = {
        color: colors.rose,
        fontWeight: 600
    };

    return (
        <Section index={index} bg="linear-gradient(150deg, #fff8fa 0%, #fef0f5 50%, #fff8f0 100%)" style={{ overflow: 'hidden' }}>
            <BgDecor />
            <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 1120, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 'clamp(50px, 8vw, 80px)' }}>

                {!rawData ? (
                    <div style={{ color: '#aaa', textAlign: 'center', fontStyle: 'italic' }}>Menyeduh data...</div>
                ) : (
                    <>
                        {/* ROW 1 */}
                        <FadeIn>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(32px, 5vw, 60px)', alignItems: 'center' }}>
                                
                                <div style={{ flex: 1.2, minWidth: 320, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <ChapterLabel num={3} />
                                    <Divider style={{ margin: '0 0 24px 0' }} />
                                    <h3 style={{...storyTitleStyle, marginBottom: 16}}>Tapi Tau Gak Sih?</h3>
                                    <p style={storyTextStyle}>
                                        Kalau tidak semua orang Australia memaknai suatu hubungan dengan cara menikah. Mereka memilih <span style={highlightText}>tinggal bersama dahulu</span> sebelum menikah sebagai bentuk komitmen yang sama kuatnya. Dan hal tersebut bukan suatu hal yang tabu di Australia. Hubungan tanpa ikatan pernikahan ini pun secara resmi terdokumentasi oleh negara.
                                    </p>
                                </div>

                                <div style={{ flex: 0.8, minWidth: 300 }}>
                                    <ChartCard title="Proporsi Status Pasangan" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 16 }}>
                                            
                                            <div style={{ alignSelf: 'flex-start', marginLeft: '10%', marginBottom: '-10px', position: 'relative', zIndex: 10, textAlign: 'left' }}>
                                                <div style={{ fontSize: '1rem', color: colors.gold }}>De Facto</div>
                                                <div style={{ fontSize: '1.6rem', color: colors.gold, fontWeight: 'bold' }}>{defactoPct}%</div>
                                            </div>
                                            
                                            <div style={{ maxWidth: 220, width: '100%', position: 'relative' }}>
                                                <Pie data={pieData} options={pieOptions} />
                                            </div>
                                            
                                            <div style={{ marginTop: '16px', textAlign: 'center' }}>
                                                <div style={{ fontSize: '1rem', color: colors.rose }}>Registered</div>
                                                <div style={{ fontSize: '1.6rem', color: colors.rose, fontWeight: 'bold' }}>{registeredPct}%</div>
                                            </div>
                                        </div>
                                        <p style={{ fontSize: '0.85rem', color: '#999', textAlign: 'center', marginTop: 32, lineHeight: 1.6 }}>
                                            Dari seluruh pasangan tercatat di Australia, 1 dari 5 memilih hanya tinggal bersama tanpa ikatan pernikahan secara resmi.
                                        </p>
                                    </ChartCard>
                                </div>
                            </div>
                        </FadeIn>

                        {/* ROW 2 */}
                        <FadeIn delay={0.1}>
                            <div style={{ display: 'flex', flexWrap: 'wrap-reverse', gap: 'clamp(32px, 5vw, 60px)', alignItems: 'center' }}>
                                <div style={{ flex: 1, minWidth: 300 }}>
                                    <ChartCard title="Komparasi Gender berdasarkan Status">
                                        <div style={{ padding: '10px 0' }}>
                                            <Bar data={barGenderData} options={barGenderVertOptions} />
                                        </div>
                                        <p style={{ fontSize: '0.85rem', color: '#999', textAlign: 'center', marginTop: 14, lineHeight: 1.6 }}>
                                            Perempuan dan laki-laki Australia sama-sama memilih hanya tinggal bersama dalam jumlah yang setara, menunjukkan bahwa keputusan tinggal bersama bukan pilihan sepihak melainkan kesepakatan bersama.
                                        </p>
                                    </ChartCard>
                                </div>
                                <div style={{ flex: 1, minWidth: 320 }}>
                                    <h3 style={{...storyTitleStyle, marginBottom: 16}}>Lalu, apakah pola ini berbeda antara perempuan dan laki-laki?</h3>
                                    <p style={storyTextStyle}>
                                        Ternyata <span style={highlightText}>tidak ada bedanya</span>, keduanya memilih hanya tinggal bersama dan menikah resmi dalam proporsi yang hampir sama rata. Seolah Australia, tanpa memandang jenis kelamin, sama-sama nyaman dengan pilihan <span style={highlightText}>tinggal bersama</span> tanpa status menikah resmi.
                                    </p>
                                </div>
                            </div>
                        </FadeIn>

                        {/* ROW 3 */}
                        <FadeIn delay={0.2}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <h3 style={{...storyTitleStyle, textAlign: 'center', marginBottom: 40}}>
                                    Lalu, Siapa Sebenarnya yang Memilih <span style={{ fontWeight: 'bold', fontStyle: 'italic' }}>Living Together</span> ini?
                                </h3>
                                <ChartCard style={{ width: '100%', padding: 'clamp(20px, 4vw, 40px)' }}>
                                    <div style={{ position: 'relative', height: 'clamp(300px, 50vh, 450px)', width: '100%' }}>
                                        <Bar data={barTotalData} options={{...barHorizOptions, maintainAspectRatio: false}} />
                                    </div>
                                    <p style={{ fontSize: '0.85rem', color: '#999', textAlign: 'center', marginTop: 20, lineHeight: 1.6 }}>
                                        Registered marriage mendominasi hampir di semua kelompok usia, tapi <span style={{fontWeight: 'bold', color: colors.gold}}>de facto</span> justru melampahinya di usia-usia muda, sebelum akhirnya menyusut setelah 35 tahun.
                                    </p>
                                </ChartCard>
                                <p style={{...storyTextStyle, textAlign: 'center', maxWidth: 900, marginTop: 40}}>
                                    Ternyata di kelompok 20-24 tahun, angka orang yang <span style={highlightText}><i>living together</i></span> tanpa status pernikahan resmi bahkan mengalahkan pernikahan resmi, seolah di usia itu komitmen saja cukup tanpa sebuah bukti resmi. Namun seiring bertambahnya usia, pola mulai bergeser. Semakin dewasa, semakin banyak yang memilih untuk meresmikan hubungan mereka.
                                </p>
                            </div>
                        </FadeIn>

                        {/* ROW 4 */}
                        <FadeIn delay={0.3}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(32px, 5vw, 60px)', alignItems: 'center' }}>
                                <div style={{ flex: 1.2, minWidth: 320 }}>
                                    <h3 style={{...storyTitleStyle, marginBottom: 16}}>Namun, Pilihan ini bukan hanya soal masa muda</h3>
                                    <p style={storyTextStyle}>
                                        Ternyata justru di usia <span style={highlightText}>25-34 tahunlah</span> yang menjadi puncaknya. Bukan remaja yang baru pertama kali jatuh cinta, bukan pula pasangan tua yang sudah lama bersama melainkan orang yang baru beranjak dewasa yang secara sadar memilih untuk belum meresmikan hubungan mereka. Seolah di usia itu, <span style={highlightText}>tinggal bersama</span> sudah cukup menjadi jawaban.
                                    </p>
                                </div>
                                <div style={{ flex: 0.8, minWidth: 300 }}>
                                    <ChartCard title="Populasi De Facto Berdasarkan Umur">
                                        <div style={{ padding: '10px 0' }}>
                                            <Bar data={barDefactoData} options={barVertOptions} />
                                        </div>
                                        <p style={{ fontSize: '0.85rem', color: '#999', textAlign: 'center', marginTop: 14, lineHeight: 1.6 }}>
                                            Puncak de facto ada di kelompok usia 25-34 tahun, jauh melampaui kelompok usia muda. De facto bukan fase tetapi ini pilihan.
                                        </p>
                                    </ChartCard>
                                </div>
                            </div>
                        </FadeIn>
                    </>
                )}
            </div>
        </Section>
    );
}