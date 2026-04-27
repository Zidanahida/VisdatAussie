import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { Section, Divider, ChapterLabel, ChartCard, StatBox, FadeIn, colors } from './shared';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const ageLabels = ['15–19', '20–24', '25–29', '30–34', '35–39', '40–44', '45–49', '50–54', '55–59', '60+'];
const maleCounts   = [120,  3200, 18500, 22400, 13800, 7200, 4100, 2800, 2100, 3200];
const femaleCounts = [380,  6100, 22300, 21000, 11900, 6100, 3500, 2400, 1700, 2400];
const totalCounts  = ageLabels.map((_, i) => maleCounts[i] + femaleCounts[i]);

const maxVal = Math.max(...maleCounts, ...femaleCounts);

// ── Population Pyramid (pure SVG) ──────────────────────────────────────────
function PopulationPyramid() {
    const W = 480, H = 340;
    const rowH = H / ageLabels.length;
    const barMaxW = 160;   // max bar width each side
    const centerX = W / 2;
    const labelW  = 52;    // center label column width
    const barAreaW = (W - labelW) / 2;  // available width per side

    return (
        <div style={{ width: '100%' }}>
            <p style={{ textAlign: 'center', fontFamily: "'Playfair Display', serif", fontSize: '0.95rem', color: colors.dark, marginBottom: 8 }}>
                Piramida Usia Menikah (2024)
            </p>

            {/* Legend */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 8, fontSize: '0.78rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ width: 14, height: 14, borderRadius: 3, background: 'rgba(100,149,237,0.85)', display: 'inline-block' }} />
                    Pria
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ width: 14, height: 14, borderRadius: 3, background: 'rgba(212,120,138,0.85)', display: 'inline-block' }} />
                    Wanita
                </span>
            </div>

            <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%' }}>
                {ageLabels.map((label, i) => {
                    const y      = i * rowH;
                    const maleW  = (maleCounts[i]   / maxVal) * barAreaW * 0.92;
                    const femaleW= (femaleCounts[i]  / maxVal) * barAreaW * 0.92;
                    const barY   = y + rowH * 0.12;
                    const barH   = rowH * 0.76;
                    const midX   = centerX;

                    return (
                        <g key={label}>
                            {/* Alternating row bg */}
                            <rect x={0} y={y} width={W} height={rowH}
                                fill={i % 2 === 0 ? 'rgba(0,0,0,0.02)' : 'transparent'} />

                            {/* Male bar (grows LEFT from center) */}
                            <rect
                                x={midX - labelW / 2 - maleW}
                                y={barY} width={maleW} height={barH}
                                rx={3}
                                fill="rgba(100,149,237,0.82)"
                            />

                            {/* Female bar (grows RIGHT from center) */}
                            <rect
                                x={midX + labelW / 2}
                                y={barY} width={femaleW} height={barH}
                                rx={3}
                                fill="rgba(212,120,138,0.82)"
                            />

                            {/* Center age label */}
                            <text
                                x={midX} y={y + rowH / 2 + 4}
                                textAnchor="middle"
                                style={{ fontSize: '10px', fill: '#555', fontWeight: 600 }}
                            >
                                {label}
                            </text>

                            {/* Male value label */}
                            {maleCounts[i] >= 1000 && (
                                <text
                                    x={midX - labelW / 2 - maleW - 4}
                                    y={y + rowH / 2 + 4}
                                    textAnchor="end"
                                    style={{ fontSize: '9px', fill: '#6495ed' }}
                                >
                                    {(maleCounts[i] / 1000).toFixed(1)}k
                                </text>
                            )}

                            {/* Female value label */}
                            {femaleCounts[i] >= 1000 && (
                                <text
                                    x={midX + labelW / 2 + femaleW + 4}
                                    y={y + rowH / 2 + 4}
                                    textAnchor="start"
                                    style={{ fontSize: '9px', fill: '#d4788a' }}
                                >
                                    {(femaleCounts[i] / 1000).toFixed(1)}k
                                </text>
                            )}
                        </g>
                    );
                })}

                {/* Center divider line */}
                <line
                    x1={centerX - labelW / 2} y1={0}
                    x2={centerX - labelW / 2} y2={H}
                    stroke="#ddd" strokeWidth={1}
                />
                <line
                    x1={centerX + labelW / 2} y1={0}
                    x2={centerX + labelW / 2} y2={H}
                    stroke="#ddd" strokeWidth={1}
                />

                {/* Side headers */}
                <text x={centerX - labelW / 2 - barAreaW / 2} y={H - 4}
                    textAnchor="middle"
                    style={{ fontSize: '10px', fill: '#6495ed', fontWeight: 700 }}>
                    ← Pria
                </text>
                <text x={centerX + labelW / 2 + barAreaW / 2} y={H - 4}
                    textAnchor="middle"
                    style={{ fontSize: '10px', fill: '#d4788a', fontWeight: 700 }}>
                    Wanita →
                </text>
            </svg>
        </div>
    );
}

// ── Total per age group bar chart ───────────────────────────────────────────
const totalChartData = {
    labels: ageLabels,
    datasets: [{
        label: 'Total Pernikahan',
        data: totalCounts,
        backgroundColor: totalCounts.map((_, i) => {
            // highlight peak ages 25-34
            return (i === 2 || i === 3) ? 'rgba(212,120,138,0.88)' : 'rgba(201,168,76,0.72)';
        }),
        borderRadius: 6,
    }],
};

const totalChartOptions = {
    indexAxis: 'y',   // horizontal bar chart
    responsive: true,
    plugins: {
        legend: { display: false },
        tooltip: {
            callbacks: {
                label: ctx => ` ${ctx.parsed.x.toLocaleString()} pernikahan`,
            },
        },
    },
    scales: {
        x: {
            beginAtZero: true,
            ticks: { callback: v => (v / 1000) + 'k', font: { size: 10 } },
            grid: { color: 'rgba(0,0,0,0.05)' },
        },
        y: {
            ticks: { font: { size: 11 } },
            grid: { display: false },
        },
    },
};

// ── Background decoration ───────────────────────────────────────────────────
function BgDecor() {
    return (
        <>
            <style>{`
                @keyframes waveMove { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
                @keyframes floatUp  { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-20px) rotate(5deg)} }
            `}</style>
            <div style={{ position:'absolute', bottom:0, left:0, right:0, height:120, overflow:'hidden', pointerEvents:'none' }}>
                <svg viewBox="0 0 1440 120" style={{ width:'200%', animation:'waveMove 12s linear infinite' }} preserveAspectRatio="none">
                    <path d="M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 L1440,120 L0,120 Z" fill="rgba(212,120,138,0.07)"/>
                    <path d="M0,80 C240,40 480,100 720,80 C960,40 1200,100 1440,80 L1440,120 L0,120 Z" fill="rgba(201,168,76,0.06)"/>
                </svg>
            </div>
            {['10%','30%','55%','75%','90%'].map((left, i) => (
                <div key={i} style={{
                    position:'absolute', top:`${15+i*12}%`, left,
                    fontSize: 16+i*4, opacity:0.08,
                    animation:`floatUp ${5+i}s ease-in-out infinite`,
                    animationDelay:`${i*0.8}s`, pointerEvents:'none',
                }}>💍</div>
            ))}
            <div style={{ position:'absolute', width:500, height:500, top:'-20%', right:'-10%', background:'radial-gradient(circle, rgba(212,120,138,0.1) 0%, transparent 70%)', borderRadius:'50%', pointerEvents:'none' }}/>
            <div style={{ position:'absolute', width:350, height:350, bottom:'-10%', left:'-5%', background:'radial-gradient(circle, rgba(201,168,76,0.1) 0%, transparent 70%)', borderRadius:'50%', pointerEvents:'none' }}/>
            <div style={{ position:'absolute', inset:0, pointerEvents:'none', backgroundImage:'radial-gradient(circle, rgba(212,120,138,0.1) 1px, transparent 1px)', backgroundSize:'28px 28px' }}/>
        </>
    );
}

// ── Main component ──────────────────────────────────────────────────────────
export default function Chapter1({ index }) {
    return (
        <Section index={index} bg="linear-gradient(150deg, #fff8fa 0%, #fef0f5 50%, #fff8f0 100%)">
            <BgDecor />
            <div style={{ position:'relative', zIndex:1, width:'100%', display:'flex', flexDirection:'column', alignItems:'center' }}>

                <FadeIn>
                    <ChapterLabel num={1} title="💒 Total Pernikahan & Usia Menikah" />
                    <Divider />
                    <p style={{ fontSize:'0.95rem', color:'#888', maxWidth:600, textAlign:'center', marginBottom:36, lineHeight:1.7 }}>
                        Pada tahun 2024, Australia mencatat lebih dari 118 ribu pernikahan resmi.
                        Lalu, di usia berapa rata-rata orang Australia memutuskan untuk menikah?
                    </p>
                </FadeIn>

                <FadeIn delay={0.1}>
                    <div style={{ display:'flex', gap:24, flexWrap:'wrap', justifyContent:'center', marginBottom:36, width:'100%' }}>
                        <StatBox num="118642" label="Total Pernikahan 2024" />
                        <StatBox num="31.4"   label="Rata-rata Usia Pria (thn)"   color={colors.gold} />
                        <StatBox num="29.6"   label="Rata-rata Usia Wanita (thn)" color="#b07cc6" />
                        <StatBox num="+3.2%"  label="Naik dari 2023"              color={colors.sage} />
                    </div>
                </FadeIn>

                {/* Two charts side by side */}
                <div style={{ display:'flex', gap:24, flexWrap:'wrap', justifyContent:'center', width:'100%', maxWidth:1100, boxSizing:'border-box' }}>
                    <FadeIn delay={0.2}>
                        <div style={{
                            background:'white', borderRadius:20, padding:'clamp(16px,3vw,24px)',
                            boxShadow:'0 4px 24px rgba(0,0,0,0.06)',
                            flex:1, minWidth:'min(300px,100%)', boxSizing:'border-box',
                        }}>
                            <PopulationPyramid />
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.3}>
                        <ChartCard
                            title="Total Pernikahan per Kelompok Umur (2024)"
                            style={{ flex:1, minWidth:300 }}
                        >
                            <Bar data={totalChartData} options={totalChartOptions} />
                            <p style={{ fontSize:'0.75rem', color:'#aaa', textAlign:'center', marginTop:10 }}>
                                🔴 Puncak: usia 25–34 tahun · Sumber: ABS 2024
                            </p>
                        </ChartCard>
                    </FadeIn>
                </div>

            </div>
        </Section>
    );
}
