import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { Section, Divider, ChapterLabel, ChartCard, StatBox, FadeIn, colors } from './shared';
import { useExcelData } from '../hooks/useExcelData';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// ── Population Pyramid (pure SVG) ──────────────────────────────────────────
function PopulationPyramid({ ageLabels, maleCounts, femaleCounts, maxVal }) {
    const [hovered, setHovered] = React.useState(null);
    const W = 900, H = 460;
    const labelW  = 52;
    const padding = 8;
    const axisH   = 28; // ruang untuk axis X di bawah
    const barAreaW = W - labelW - padding * 2;
    const halfBar  = barAreaW / 2;
    const centerX  = labelW + halfBar;
    const chartH   = H - axisH;

    const reversed     = [...ageLabels].reverse();
    const reversedMale = [...maleCounts].reverse();
    const reversedFem  = [...femaleCounts].reverse();
    const rowH = chartH / reversed.length;

    // Tick values untuk axis X (simetris)
    const tickCount = 4;
    const tickStep  = Math.ceil(maxVal / tickCount / 1000) * 1000;
    const ticks     = Array.from({ length: tickCount }, (_, i) => tickStep * (i + 1));

    return (
        <div style={{ width: '100%' }}>
            <p style={{ textAlign: 'center', fontFamily: "'Playfair Display', serif", fontSize: '0.95rem', color: colors.dark, marginBottom: 8, fontWeight: 700 }}>
                Piramida Usia Menikah (2024)
            </p>
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
                {reversed.map((label, i) => {
                    const y       = i * rowH;
                    const maleW   = (reversedMale[i] / maxVal) * halfBar * 0.95;
                    const femaleW = (reversedFem[i]  / maxVal) * halfBar * 0.95;
                    const barY    = y + rowH * 0.1;
                    const barH    = rowH * 0.8;
                    const scale   = halfBar * 0.95 / maxVal;

                    const isHovered = hovered === i;
                    return (
                        <g key={label}
                            onMouseEnter={() => setHovered(i)}
                            onMouseLeave={() => setHovered(null)}
                            style={{ cursor: 'default' }}
                        >
                            <rect x={0} y={y} width={W} height={rowH}
                                fill={isHovered ? 'rgba(0,0,0,0.06)' : i % 2 === 0 ? 'rgba(0,0,0,0.025)' : 'transparent'} />

                            <text x={padding} y={y + rowH / 2 + 4}
                                textAnchor="start"
                                style={{ fontSize: '10px', fill: '#555', fontWeight: 600 }}>
                                {label}
                            </text>

                            <rect
                                x={centerX - maleW} y={barY}
                                width={maleW} height={barH} rx={3}
                                fill="rgba(100,149,237,0.82)"
                            />

                            <rect
                                x={centerX} y={barY}
                                width={femaleW} height={barH} rx={3}
                                fill="rgba(212,120,138,0.82)"
                            />

                            {isHovered && (
                                <>
                                    <rect
                                        x={centerX - maleW - 2} y={barY - 1}
                                        width={maleW + 4} height={barH + 2} rx={3}
                                        fill="none" stroke="rgba(100,149,237,0.9)" strokeWidth={1.5}
                                    />
                                    <rect
                                        x={centerX - 2} y={barY - 1}
                                        width={femaleW + 4} height={barH + 2} rx={3}
                                        fill="none" stroke="rgba(212,120,138,0.9)" strokeWidth={1.5}
                                    />
                                    <rect x={W / 2 - 60} y={y + 2} width={120} height={rowH - 4} rx={4}
                                        fill="rgba(255,255,255,0.95)" stroke="#ddd" strokeWidth={1} />
                                    <text x={W / 2} y={y + rowH / 2 - 3} textAnchor="middle"
                                        style={{ fontSize: '9px', fill: '#6495ed', fontWeight: 700 }}>
                                        Pria: {reversedMale[i].toLocaleString()}
                                    </text>
                                    <text x={W / 2} y={y + rowH / 2 + 9} textAnchor="middle"
                                        style={{ fontSize: '9px', fill: '#d4788a', fontWeight: 700 }}>
                                        Wanita: {reversedFem[i].toLocaleString()}
                                    </text>
                                </>
                            )}
                        </g>
                    );
                })}

                {/* Center divider */}
                <line x1={centerX} y1={0} x2={centerX} y2={chartH} stroke="#ccc" strokeWidth={1} strokeDasharray="3,3" />

                {/* Axis X baseline */}
                <line x1={labelW} y1={chartH} x2={W - padding} y2={chartH} stroke="#bbb" strokeWidth={1} />

                {/* Axis X ticks & labels */}
                {ticks.map(val => {
                    const offset = (val / maxVal) * halfBar * 0.95;
                    const xLeft  = centerX - offset;
                    const xRight = centerX + offset;
                    const lbl    = val >= 1000 ? `${val / 1000}k` : val;
                    return (
                        <g key={val}>
                            {/* left side (pria) */}
                            <line x1={xLeft} y1={chartH} x2={xLeft} y2={chartH + 4} stroke="#bbb" strokeWidth={1} />
                            <text x={xLeft} y={chartH + 14} textAnchor="middle"
                                style={{ fontSize: '8px', fill: '#6495ed' }}>{lbl}</text>
                            {/* right side (wanita) */}
                            <line x1={xRight} y1={chartH} x2={xRight} y2={chartH + 4} stroke="#bbb" strokeWidth={1} />
                            <text x={xRight} y={chartH + 14} textAnchor="middle"
                                style={{ fontSize: '8px', fill: '#d4788a' }}>{lbl}</text>
                        </g>
                    );
                })}
                {/* 0 label */}
                <text x={centerX} y={chartH + 14} textAnchor="middle"
                    style={{ fontSize: '8px', fill: '#999' }}>0</text>

                {/* Axis X side labels */}
                <text x={labelW + halfBar / 2} y={chartH + 26} textAnchor="middle"
                    style={{ fontSize: '9px', fill: '#6495ed', fontWeight: 700 }}>← Pria</text>
                <text x={centerX + halfBar / 2} y={chartH + 26} textAnchor="middle"
                    style={{ fontSize: '9px', fill: '#d4788a', fontWeight: 700 }}>Wanita →</text>
            </svg>
        </div>
    );
}

// ── Background decoration ───────────────────────────────────────────────────
function BgDecor() {
    return (
        <>
            <style>{`
                @keyframes waveMove { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
                @keyframes floatUp  { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-20px) rotate(5deg)} }
            `}</style>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, overflow: 'hidden', pointerEvents: 'none' }}>
                <svg viewBox="0 0 1440 120" style={{ width: '200%', animation: 'waveMove 12s linear infinite' }} preserveAspectRatio="none">
                    <path d="M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 L1440,120 L0,120 Z" fill="rgba(212,120,138,0.07)" />
                    <path d="M0,80 C240,40 480,100 720,80 C960,40 1200,100 1440,80 L1440,120 L0,120 Z" fill="rgba(201,168,76,0.06)" />
                </svg>
            </div>
            {['10%', '30%', '55%', '75%', '90%'].map((left, i) => (
                <div key={i} style={{
                    position: 'absolute', top: `${15 + i * 12}%`, left,
                    fontSize: 16 + i * 4, opacity: 0.08,
                    animation: `floatUp ${5 + i}s ease-in-out infinite`,
                    animationDelay: `${i * 0.8}s`, pointerEvents: 'none',
                }}>💍</div>
            ))}
            <div style={{ position: 'absolute', width: 500, height: 500, top: '-20%', right: '-10%', background: 'radial-gradient(circle, rgba(212,120,138,0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', width: 350, height: 350, bottom: '-10%', left: '-5%', background: 'radial-gradient(circle, rgba(201,168,76,0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'radial-gradient(circle, rgba(212,120,138,0.1) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        </>
    );
}

// ── Main component ──────────────────────────────────────────────────────────
export default function Chapter1({ index }) {
    const rawData = useExcelData('/data.xlsx');

    if (!rawData) return (
        <Section index={index} bg="linear-gradient(150deg, #fff8fa 0%, #fef0f5 50%, #fff8f0 100%)">
            <div style={{ textAlign: 'center', color: '#aaa', fontSize: '1rem' }}>Memuat data...</div>
        </Section>
    );

    const filteredData = rawData.filter(r => String(r.age).toLowerCase() !== 'total');
    const ageLabels    = filteredData.map(r => r.age);
    const maleCounts   = filteredData.map(r => r.males);
    const femaleCounts = filteredData.map(r => r.females);
    const maxVal       = Math.max(...maleCounts, ...femaleCounts);

    const sumCounts = filteredData.map(r => r.sum);

    const groupedChartData = {
        labels: ageLabels,
        datasets: [
            {
                label: 'Total Pernikahan',
                data: sumCounts,
                backgroundColor: 'rgba(201,168,76,0.82)',
                borderRadius: 5,
            },
        ],
    };

    const groupedChartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            tooltip: {
                callbacks: { label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y.toLocaleString()}` },
            },
        },
        scales: {
            x: { ticks: { font: { size: 10 } }, grid: { display: false } },
            y: {
                beginAtZero: true,
                ticks: { callback: v => (v / 1000) + 'k', font: { size: 10 } },
                grid: { color: 'rgba(0,0,0,0.05)' },
            },
        },
    };

    return (
        <Section index={index} bg="linear-gradient(150deg, #fff8fa 0%, #fef0f5 50%, #fff8f0 100%)">
            <BgDecor />
            <div style={{ position: 'relative', zIndex: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                <FadeIn>
                    <ChapterLabel num={1} title="💒 Total Pernikahan & Usia Menikah" />
                    <Divider />
                    <p style={{ fontSize: '0.95rem', color: '#888', maxWidth: 600, textAlign: 'center', marginBottom: 36, lineHeight: 1.7 }}>
                        Pada tahun 2024, Australia mencatat lebih dari 240 ribu pernikahan resmi.
                        Lalu, di usia berapa rata-rata orang Australia memutuskan untuk menikah?
                    </p>
                </FadeIn>

                <FadeIn delay={0.1}>
                    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 36, width: '100%' }}>
                        <StatBox num="240,338" label="Total Pernikahan 2024" />
                        <StatBox num="32.8" label="Rata-rata Usia Pria Menikah"    color={colors.gold} />
                        <StatBox num="31.2" label="Rata-rata Usia Wanita Menikah"  color="#b07cc6" />
                    </div>
                </FadeIn>

                <div style={{ display: 'flex', gap: 24, flexDirection: 'column', alignItems: 'center', width: '100%', boxSizing: 'border-box' }}>
                    <FadeIn delay={0.2}>
                        <div style={{
                            background: 'white', borderRadius: 20, padding: 'clamp(16px,3vw,24px)',
                            boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                            width: '100%', boxSizing: 'border-box',
                        }}>
                            <PopulationPyramid
                                ageLabels={ageLabels}
                                maleCounts={maleCounts}
                                femaleCounts={femaleCounts}
                                maxVal={maxVal}
                            />
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.3}>
                        <ChartCard title="Total Pernikahan berdasarkan Kelompok Umur (2024)" style={{ flex: 1, minWidth: 300 }}>
                            <Bar data={groupedChartData} options={groupedChartOptions} />
                            <p style={{ fontSize: '0.75rem', color: '#aaa', textAlign: 'center', marginTop: 10 }}>
                                Sumber: ABS 2024
                            </p>
                        </ChartCard>
                    </FadeIn>
                </div>

            </div>
        </Section>
    );
}