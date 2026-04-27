import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { Section, Divider, ChapterLabel, ChartCard, FadeIn, colors } from './shared';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const monthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
    datasets: [{
        label: 'Jumlah Pernikahan',
        data: [11200, 9800, 10400, 8600, 7900, 7200, 7800, 9100, 11800, 13200, 12900, 9700],
        backgroundColor: ageColors(),
        borderRadius: 8,
    }],
};

function ageColors() {
    return ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'].map((_, i) => {
        const peak = [8, 9, 10]; // Sep, Oct, Nov
        return peak.includes(i) ? 'rgba(212,120,138,0.85)' : 'rgba(201,168,76,0.65)';
    });
}

const dayData = {
    labels: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'],
    datasets: [{
        label: 'Jumlah Pernikahan',
        data: [3200, 3800, 4100, 5600, 9800, 38400, 7200],
        backgroundColor: ['#ddd', '#ddd', '#ddd', '#ddd', 'rgba(168,184,154,0.8)', 'rgba(212,120,138,0.9)', 'rgba(201,168,76,0.7)'],
        borderRadius: 8,
    }],
};

const opts = (title) => ({
    responsive: true,
    plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => ` ${ctx.parsed.y.toLocaleString()} pernikahan` } },
    },
    scales: {
        y: { beginAtZero: true, ticks: { callback: v => v.toLocaleString() } },
    },
});

function BgDecor() {
    return (
        <>
            <style>{`
                @keyframes leafSway { 0%,100%{transform:rotate(-8deg)} 50%{transform:rotate(8deg)} }
                @keyframes floatBubble { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-25px) scale(1.05)} }
            `}</style>
            {/* Animated gradient overlay */}
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg, rgba(168,184,154,0.15) 0%, rgba(201,168,76,0.1) 50%, rgba(168,184,154,0.08) 100%)', pointerEvents:'none' }}/>
            {/* Leaf shapes */}
            {[{t:'8%',l:'3%',s:50},{t:'60%',l:'92%',s:40},{t:'30%',l:'88%',s:60},{t:'80%',l:'5%',s:35}].map((d,i)=>(
                <div key={i} style={{
                    position:'absolute', top:d.t, left:d.l, width:d.s, height:d.s*1.5,
                    background:`rgba(168,184,154,${0.12+i*0.03})`,
                    borderRadius:'50% 0 50% 0',
                    animation:`leafSway ${4+i}s ease-in-out infinite`,
                    animationDelay:`${i*0.7}s`,
                    pointerEvents:'none',
                }}/>
            ))}
            {/* Bubbles */}
            {[{t:'20%',l:'15%',s:80},{t:'65%',l:'75%',s:60},{t:'45%',l:'50%',s:100}].map((b,i)=>(
                <div key={i} style={{
                    position:'absolute', top:b.t, left:b.l, width:b.s, height:b.s,
                    border:'1.5px solid rgba(168,184,154,0.25)',
                    borderRadius:'50%',
                    animation:`floatBubble ${6+i*2}s ease-in-out infinite`,
                    animationDelay:`${i}s`,
                    pointerEvents:'none',
                }}/>
            ))}
            {/* Dot grid */}
            <div style={{ position:'absolute', inset:0, pointerEvents:'none', backgroundImage:'radial-gradient(circle, rgba(168,184,154,0.18) 1px, transparent 1px)', backgroundSize:'30px 30px' }}/>
        </>
    );
}

export default function Chapter2({ index }) {
    return (
        <Section index={index} bg="linear-gradient(150deg, #f2f8f0 0%, #eaf5e6 40%, #f8faf2 100%)">
            <BgDecor />
            <div style={{ position:'relative', zIndex:1, width:'100%', display:'flex', flexDirection:'column', alignItems:'center' }}>
            <FadeIn>
                <ChapterLabel num={2} title="📅 Kapan Orang Australia Menikah?" />
                <Divider />
                <p style={{ fontSize: '0.95rem', color: '#888', maxWidth: 600, textAlign: 'center', marginBottom: 36, lineHeight: 1.7 }}>
                    Hari Sabtu tetap jadi favorit, dan bulan-bulan musim semi Australia (September–November)
                    selalu ramai dengan pesta pernikahan.
                </p>
            </FadeIn>

            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center', width: '100%', maxWidth: 1100, boxSizing: 'border-box' }}>
                <FadeIn delay={0.1}>
                    <ChartCard title="Pernikahan per Bulan (2024)">
                        <Bar data={monthData} options={opts('bulan')} />
                        <p style={{ fontSize: '0.75rem', color: '#aaa', textAlign: 'center', marginTop: 10 }}>
                            🌸 Puncak: September–November (musim semi)
                        </p>
                    </ChartCard>
                </FadeIn>
                <FadeIn delay={0.2}>
                    <ChartCard title="Pernikahan per Hari dalam Seminggu (2024)">
                        <Bar data={dayData} options={opts('hari')} />
                        <p style={{ fontSize: '0.75rem', color: '#aaa', textAlign: 'center', marginTop: 10 }}>
                            📅 Sabtu mendominasi dengan ~38.400 pernikahan
                        </p>
                    </ChartCard>
                </FadeIn>
            </div>

            <FadeIn delay={0.3}>
                <div style={{
                    marginTop: 32, background: 'white', borderRadius: 16, padding: '20px 32px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)', maxWidth: 680, textAlign: 'center'
                }}>
                    <p style={{ fontSize: '0.9rem', color: '#666', lineHeight: 1.8 }}>
                        💡 <strong>Fun fact:</strong> Tanggal 14 Februari (Valentine's Day) dan 11/11 adalah
                        tanggal paling populer untuk menikah di Australia, dengan lonjakan hingga <strong>3x lipat</strong> dari hari biasa.
                    </p>
                </div>
            </FadeIn>
            </div>
        </Section>
    );
}
