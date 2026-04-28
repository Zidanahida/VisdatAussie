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
const ch1Styles = `
    @keyframes ch1Float { 0%,100%{transform:translateY(0) translateX(0) rotate(0deg)} 33%{transform:translateY(-18px) translateX(7px) rotate(2deg)} 66%{transform:translateY(10px) translateX(-5px) rotate(-1.5deg)} }
    @keyframes ch1Pulse { 0%,100%{opacity:0.1; transform:scale(1)} 50%{opacity:0.24; transform:scale(1.06)} }
    @keyframes ch1Scan  { 0%{transform:translateY(-100%);opacity:0} 10%{opacity:0.3} 90%{opacity:0.3} 100%{transform:translateY(200vh);opacity:0} }
    @keyframes ch1Morph { 0%,100%{border-radius:58% 42% 54% 46%/48% 58% 42% 52%} 50%{border-radius:42% 58% 46% 54%/58% 42% 58% 42%} }
    @keyframes ch1Petal { 0%{transform:translateY(-60px) rotate(0deg) scale(1); opacity:0.55} 100%{transform:translateY(105vh) rotate(480deg) scale(0.4); opacity:0} }
`;

function BgDecor() {
    const particles = Array.from({ length: 20 }, (_, i) => ({
        size: 2 + (i % 3),
        top: `${5 + (i * 4.9) % 88}%`,
        left: `${2 + (i * 5.3) % 95}%`,
        dur: `${10 + (i % 7) * 2.5}s`,
        delay: `${(i * 0.75) % 6}s`,
    }));

    const petals = Array.from({ length: 14 }, (_, i) => ({
        size: 7 + (i % 4) * 3,
        left: `${(i * 7.3) % 100}%`,
        dur: `${8 + (i % 5) * 2}s`,
        delay: `${(i * 1.1) % 10}s`,
    }));

    return (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
            <style>{ch1Styles}</style>

            {/* Gradient mesh */}
            <div style={{
                position: 'absolute', inset: 0,
                background: `
                    radial-gradient(ellipse 70% 50% at 10% 20%, rgba(212,120,138,0.13) 0%, transparent 58%),
                    radial-gradient(ellipse 55% 70% at 88% 80%, rgba(201,168,76,0.1) 0%, transparent 58%),
                    radial-gradient(ellipse 40% 40% at 55% 48%, rgba(212,120,138,0.07) 0%, transparent 52%)
                `,
            }} />

            {/* Dot matrix */}
            <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'radial-gradient(circle, rgba(212,120,138,0.1) 1.5px, transparent 1.5px)',
                backgroundSize: '36px 36px',
            }} />

            {/* Line grid */}
            <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: `
                    linear-gradient(rgba(212,120,138,0.035) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(212,120,138,0.035) 1px, transparent 1px)
                `,
                backgroundSize: '100px 100px',
            }} />

            {/* Scan line */}
            <div style={{
                position: 'absolute', left: 0, right: 0, height: 2, top: 0,
                background: 'linear-gradient(90deg, transparent, rgba(212,120,138,0.13), transparent)',
                animation: 'ch1Scan 13s linear infinite',
            }} />

            {/* Floating particles */}
            {particles.map((p, i) => (
                <div key={`p${i}`} style={{
                    position: 'absolute', width: p.size, height: p.size,
                    top: p.top, left: p.left,
                    background: 'rgba(212,120,138,0.4)',
                    borderRadius: '50%',
                    animation: `ch1Float ${p.dur} ease-in-out infinite`,
                    animationDelay: p.delay,
                }} />
            ))}

            {/* Falling petals */}
            {petals.map((p, i) => (
                <div key={`petal${i}`} style={{
                    position: 'absolute', top: '-40px', left: p.left,
                    width: p.size, height: p.size * 1.4,
                    background: `hsl(${340 + (i % 4) * 8}, 65%, ${78 + (i % 3) * 5}%)`,
                    borderRadius: '50% 0 50% 0',
                    animation: `ch1Petal ${p.dur} linear ${p.delay} infinite`,
                    opacity: 0.45,
                }} />
            ))}

            {/* Corner brackets */}
            <div style={{ position: 'absolute', top: 36, left: 36 }}>
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                    <path d="M2 62 L2 2 L62 2" stroke="rgba(212,120,138,0.3)" strokeWidth="1.5" strokeLinecap="round"/>
                    <circle cx="2" cy="2" r="3.5" fill="rgba(212,120,138,0.45)" />
                    <circle cx="62" cy="2" r="2" fill="rgba(212,120,138,0.2)" />
                </svg>
            </div>
            <div style={{ position: 'absolute', bottom: 36, right: 36, transform: 'rotate(180deg)' }}>
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                    <path d="M2 62 L2 2 L62 2" stroke="rgba(201,168,76,0.3)" strokeWidth="1.5" strokeLinecap="round"/>
                    <circle cx="2" cy="2" r="3.5" fill="rgba(201,168,76,0.45)" />
                </svg>
            </div>
            <div style={{ position: 'absolute', top: 36, right: 36 }}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path d="M30 2 L30 30 L2 30" stroke="rgba(212,120,138,0.18)" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
            </div>
            <div style={{ position: 'absolute', bottom: 36, left: 36 }}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path d="M2 30 L2 2 L30 2" stroke="rgba(201,168,76,0.18)" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
            </div>

            {/* Atmospheric orbs */}
            {[
                { w: 520, h: 520, top: '-12%', left: '-10%', color: 'rgba(212,120,138,0.12)', dur: '18s' },
                { w: 400, h: 400, top: '55%', right: '-7%', color: 'rgba(201,168,76,0.1)', dur: '22s' },
                { w: 260, h: 260, top: '25%', left: '58%', color: 'rgba(212,120,138,0.08)', dur: '14s' },
                { w: 180, h: 180, top: '70%', left: '15%', color: 'rgba(201,168,76,0.09)', dur: '11s' },
            ].map((o, i) => (
                <div key={`o${i}`} style={{
                    position: 'absolute', width: o.w, height: o.h,
                    top: o.top, left: o.left, right: o.right,
                    background: `radial-gradient(circle, ${o.color} 0%, transparent 70%)`,
                    borderRadius: '50%',
                    animation: `ch1Float ${o.dur} ease-in-out infinite`,
                    animationDelay: `${i * 2.5}s`,
                }} />
            ))}

            {/* Morphing blob */}
            <div style={{
                position: 'absolute', width: 155, height: 155,
                top: '38%', left: '3%',
                background: 'rgba(212,120,138,0.06)',
                animation: 'ch1Morph 12s ease-in-out infinite, ch1Float 17s ease-in-out infinite',
            }} />

            {/* Pulsing rings */}
            {[
                { size: 250, top: '12%', right: '7%' },
                { size: 170, top: '60%', left: '4%' },
                { size: 105, top: '40%', left: '44%' },
            ].map((r, i) => (
                <div key={`r${i}`} style={{
                    position: 'absolute', width: r.size, height: r.size,
                    top: r.top, left: r.left, right: r.right,
                    border: '1px solid rgba(212,120,138,0.15)',
                    borderRadius: '50%',
                    animation: `ch1Pulse ${7 + i * 2.5}s ease-in-out infinite`,
                    animationDelay: `${i * 1.8}s`,
                }} />
            ))}

            {/* Diamond accents */}
            {[
                { top: '18%', left: '5%', size: 8 },
                { top: '72%', right: '6%', size: 7 },
                { top: '48%', left: '47%', size: 5 },
                { top: '7%', right: '22%', size: 5 },
                { top: '85%', left: '35%', size: 4 },
            ].map((d, i) => (
                <div key={`d${i}`} style={{
                    position: 'absolute', top: d.top, left: d.left, right: d.right,
                    width: d.size, height: d.size,
                    background: i % 2 === 0 ? 'rgba(212,120,138,0.3)' : 'rgba(201,168,76,0.3)',
                    transform: 'rotate(45deg)',
                    animation: `ch1Float ${9 + i * 2}s ease-in-out infinite`,
                    animationDelay: `${i * 0.9}s`,
                }} />
            ))}
        </div>
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

    const storyTitleStyle = {
        fontFamily: "'Caveat', cursive",
        fontSize: 'clamp(2.2rem, 3.8vw, 3.2rem)',
        color: colors.dark,
        lineHeight: 1.15,
    };
    const storyTextStyle = {
        fontSize: '1rem',
        color: '#6b5a5a',
        lineHeight: 1.85,
        marginBottom: 16,
    };
    const highlightText = { color: colors.rose, fontWeight: 600 };

    return (
        <Section index={index} bg="linear-gradient(150deg, #fff8fa 0%, #fef0f5 50%, #fff8f0 100%)">
            <BgDecor />
            <div style={{
                position: 'relative', zIndex: 1,
                width: '100%', maxWidth: 1100,
                boxSizing: 'border-box',
                display: 'flex', flexDirection: 'column',
                gap: 'clamp(60px, 8vw, 100px)',
            }}>

                {/* ── ROW 1: HEADER & INTRO ── */}
                <FadeIn>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 40, alignItems: 'flex-start' }}>
                        <div style={{ flex: '1 1 340px' }}>
                            <ChapterLabel num={1}/>
                            <Divider style={{ margin: '0 0 24px 0' }} />
                            <h3 style={{ ...storyTitleStyle, textAlign: 'center' }}>Di usia berapa orang Australia memilih untuk menikah?</h3>
                            <p style={{ ...storyTextStyle, marginTop: 16, textAlign: 'center' }}>
                                Pada tahun 2024, Australia mencatat lebih dari <span style={highlightText}>240 ribu pernikahan resmi</span>. Di balik angka itu, tersimpan pola yang menarik — sebuah potret kolektif tentang kapan seseorang merasa siap untuk berkomitmen seumur hidup.
                            </p>
                            {/* Pull quote */}
                            <div style={{
                                borderLeft: `3px solid ${colors.gold}`,
                                paddingLeft: 16, margin: '20px 0 0',
                                background: `rgba(201,168,76,0.06)`,
                                borderRadius: '0 12px 12px 0',
                                padding: '12px 16px',
                            }}>
                                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '0.95rem', color: colors.dark, fontStyle: 'italic', lineHeight: 1.7, margin: 0 }}>
                                    "Setiap angka mewakili dua orang yang memutuskan untuk memulai babak baru bersama."
                                </p>
                            </div>
                        </div>
                    </div>
                </FadeIn>

                {/* ── ROW 2: STATS ── */}
                <FadeIn delay={0.1}>
                    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
                        <StatBox num="240,338" label="Total Pernikahan 2024" />
                        <StatBox num="32.8" label="Rata-rata Usia Pria Menikah" color={colors.gold} />
                        <StatBox num="31.2" label="Rata-rata Usia Wanita Menikah" color="#b07cc6" />
                    </div>
                </FadeIn>

                {/* ── ROW 3: PYRAMID + NARASI ── */}
                <FadeIn delay={0.15}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(28px, 4.5vw, 52px)', alignItems: 'center' }}>
                        <div style={{ flex: '1.4 1 320px' }}>
                            <div style={{
                                background: 'white', borderRadius: 20, padding: 'clamp(16px,3vw,24px)',
                                boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                                border: '1px solid rgba(0,0,0,0.04)',
                            }}>
                                <PopulationPyramid
                                    ageLabels={ageLabels}
                                    maleCounts={maleCounts}
                                    femaleCounts={femaleCounts}
                                    maxVal={maxVal}
                                />
                            </div>
                        </div>
                        <div style={{ flex: '1 1 280px' }}>
                            {/* Label tag */}
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: `${colors.rose}15`, border: `1px solid ${colors.rose}40`, borderRadius: 20, padding: '4px 12px', marginBottom: 12 }}>
                                <div style={{ width: 6, height: 6, borderRadius: '50%', background: colors.rose }} />
                                <span style={{ fontSize: '0.72rem', color: colors.rose, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 600 }}>Temuan Utama</span>
                            </div>
                            <h3 style={storyTitleStyle}>Usia 25–34: Zona Emas Pernikahan</h3>
                            <p style={{ ...storyTextStyle, marginTop: 12 }}>
                                Piramida usia ini mengungkap bahwa kelompok usia <span style={highlightText}>25 hingga 34 tahun</span> mendominasi pernikahan di Australia. Ini adalah fase di mana banyak orang telah menyelesaikan pendidikan, membangun karier awal, dan merasa siap secara emosional.
                            </p>
                            <p style={storyTextStyle}>
                                Rata-rata pria menikah di usia <span style={highlightText}>32,8 tahun</span>, sementara wanita di usia <span style={{ color: '#b07cc6', fontWeight: 600 }}>31,2 tahun</span>. Selisih sekitar 1,5 tahun ini konsisten dengan tren yang ditemukan di banyak negara maju lainnya.
                            </p>
                            <p style={storyTextStyle}>
                                Yang menarik, pernikahan di usia <span style={{ color: colors.gold, fontWeight: 600 }}>di bawah 25 tahun</span> kini semakin jarang — mencerminkan pergeseran sosial di mana generasi muda Australia lebih memprioritaskan kemandirian sebelum berkomitmen.
                            </p>
                        </div>
                    </div>
                </FadeIn>

                {/* ── ROW 4: NARASI + BAR CHART ── */}
                <FadeIn delay={0.2}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(28px, 4.5vw, 52px)', alignItems: 'center' }}>
                        <div style={{ flex: '1 1 280px' }}>
                            {/* Label tag */}
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: `${colors.gold}15`, border: `1px solid ${colors.gold}40`, borderRadius: 20, padding: '4px 12px', marginBottom: 12 }}>
                                <div style={{ width: 6, height: 6, borderRadius: '50%', background: colors.gold }} />
                                <span style={{ fontSize: '0.72rem', color: colors.gold, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 600 }}>Distribusi Usia</span>
                            </div>
                            <h3 style={storyTitleStyle}>Puncak yang Tak Terduga</h3>
                            <p style={{ ...storyTextStyle, marginTop: 12 }}>
                                Bar chart ini mempertegas narasi piramida — kelompok usia <span style={highlightText}>30–34 tahun</span> mencatat jumlah pernikahan tertinggi secara absolut.
                            </p>
                            <p style={storyTextStyle}>
                                Setelah puncak di usia 30-an, angka pernikahan menurun secara bertahap. Namun pernikahan di usia <span style={{ color: colors.gold, fontWeight: 600 }}>40 tahun ke atas</span> tetap signifikan, menunjukkan bahwa cinta tidak mengenal batas usia di Australia.
                            </p>
                            {/* Pull quote */}
                            <div style={{
                                borderLeft: `3px solid ${colors.rose}`,
                                background: `rgba(212,120,138,0.05)`,
                                borderRadius: '0 12px 12px 0',
                                padding: '12px 16px',
                                marginTop: 8,
                            }}>
                                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '0.9rem', color: colors.dark, fontStyle: 'italic', lineHeight: 1.7, margin: 0 }}>
                                    "Usia bukan sekadar angka — ia adalah cermin dari kesiapan yang terbentuk oleh pengalaman hidup."
                                </p>
                            </div>
                        </div>
                        <div style={{ flex: '1.4 1 320px' }}>
                            <ChartCard title="Total Pernikahan berdasarkan Kelompok Umur (2024)">
                                <Bar data={groupedChartData} options={groupedChartOptions} />
                                <p style={{ fontSize: '0.75rem', color: '#aaa', textAlign: 'center', marginTop: 10 }}>
                                    Sumber: ABS 2024
                                </p>
                            </ChartCard>
                        </div>
                    </div>
                </FadeIn>

            </div>
        </Section>
    );
}