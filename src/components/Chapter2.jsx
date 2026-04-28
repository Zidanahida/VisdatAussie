import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Section, Divider, ChapterLabel, ChartCard, StatBox, FadeIn, colors } from './shared';
import AustraliaMap from './AustraliaMap';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend, Filler);

/* ─────────────────────────────────────────────────────────────────
   Keyframes & global CSS
───────────────────────────────────────────────────────────────── */
const injectStyles = `
@keyframes drift {
    0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
    33%       { transform: translateY(-18px) translateX(8px) rotate(1.5deg); }
    66%       { transform: translateY(10px) translateX(-6px) rotate(-1deg); }
}
@keyframes pulse-ring {
    0%, 100% { opacity: 0.12; transform: scale(1); }
    50%       { opacity: 0.28; transform: scale(1.06); }
}
@keyframes particle-float {
    0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.25; }
    50%       { transform: translateY(-22px) translateX(12px); opacity: 0.5; }
}
@keyframes line-scan {
    0%   { transform: translateY(-100%); opacity: 0; }
    10%  { opacity: 0.4; }
    90%  { opacity: 0.4; }
    100% { transform: translateY(200vh); opacity: 0; }
}
@keyframes morph-blob {
    0%, 100% { border-radius: 60% 40% 55% 45% / 50% 60% 40% 50%; }
    50%       { border-radius: 40% 60% 45% 55% / 60% 40% 60% 40%; }
}
`;

/* ─────────────────────────────────────────────────────────────────
   Background
───────────────────────────────────────────────────────────────── */
function BgDecor() {
    const particles = Array.from({ length: 18 }, (_, i) => ({
        size: 2 + (i % 3),
        top: `${6 + (i * 5.2) % 87}%`,
        left: `${2 + (i * 5.7) % 95}%`,
        dur: `${11 + (i % 7) * 2.5}s`,
        delay: `${(i * 0.85) % 6}s`,
    }));

    return (
        <>
            <style>{injectStyles}</style>

            {/* Gradient mesh — atmospheric base */}
            <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                background: `
                    radial-gradient(ellipse 75% 55% at 12% 22%, rgba(74,157,92,0.14) 0%, transparent 58%),
                    radial-gradient(ellipse 55% 75% at 88% 78%, rgba(74,157,92,0.09) 0%, transparent 58%),
                    radial-gradient(ellipse 42% 42% at 58% 48%, rgba(168,184,154,0.08) 0%, transparent 52%)
                `,
            }} />

            {/* Dot matrix */}
            <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                backgroundImage: 'radial-gradient(circle, rgba(74,157,92,0.11) 1.5px, transparent 1.5px)',
                backgroundSize: '38px 38px',
            }} />

            {/* Coarse line grid */}
            <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                backgroundImage: `
                    linear-gradient(rgba(74,157,92,0.04) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(74,157,92,0.04) 1px, transparent 1px)
                `,
                backgroundSize: '100px 100px',
            }} />

            {/* Subtle scan line — startup terminal vibe */}
            <div style={{
                position: 'absolute', left: 0, right: 0, height: 2, top: 0,
                background: 'linear-gradient(90deg, transparent, rgba(74,157,92,0.15), transparent)',
                animation: 'line-scan 12s linear infinite',
                pointerEvents: 'none',
            }} />

            {/* Floating particles */}
            {particles.map((p, i) => (
                <div key={`p${i}`} style={{
                    position: 'absolute',
                    width: p.size, height: p.size,
                    top: p.top, left: p.left,
                    background: 'rgba(74,157,92,0.45)',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    animation: `particle-float ${p.dur} ease-in-out infinite`,
                    animationDelay: p.delay,
                }} />
            ))}

            {/* Corner bracket — top left */}
            <div style={{ position: 'absolute', top: 36, left: 36, pointerEvents: 'none' }}>
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                    <path d="M2 62 L2 2 L62 2" stroke="rgba(74,157,92,0.38)" strokeWidth="1.5" strokeLinecap="round"/>
                    <circle cx="2" cy="2" r="3.5" fill="rgba(74,157,92,0.55)" />
                    <circle cx="62" cy="2" r="2" fill="rgba(74,157,92,0.25)" />
                </svg>
            </div>
            {/* Corner bracket — bottom right */}
            <div style={{ position: 'absolute', bottom: 36, right: 36, pointerEvents: 'none', transform: 'rotate(180deg)' }}>
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                    <path d="M2 62 L2 2 L62 2" stroke="rgba(74,157,92,0.38)" strokeWidth="1.5" strokeLinecap="round"/>
                    <circle cx="2" cy="2" r="3.5" fill="rgba(74,157,92,0.55)" />
                </svg>
            </div>
            {/* Corner bracket — top right small */}
            <div style={{ position: 'absolute', top: 36, right: 36, pointerEvents: 'none' }}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path d="M30 2 L30 30 L2 30" stroke="rgba(74,157,92,0.2)" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
            </div>

            {/* Floating orbs — layered atmospheric blobs */}
            {[
                { w: 500, h: 500, top: '-12%', left: '-10%', dur: '18s', delay: '0s' },
                { w: 380, h: 380, top: '52%', right: '-7%', dur: '22s', delay: '5s' },
                { w: 280, h: 280, top: '26%', left: '60%', dur: '14s', delay: '2.5s' },
                { w: 200, h: 200, top: '72%', left: '18%', dur: '12s', delay: '1.5s' },
            ].map((o, i) => (
                <div key={`o${i}`} style={{
                    position: 'absolute', width: o.w, height: o.h,
                    top: o.top, left: o.left, right: o.right,
                    background: `radial-gradient(circle, rgba(74,157,92,${0.10 - i * 0.01}) 0%, transparent 70%)`,
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    animation: `drift ${o.dur} ease-in-out infinite`,
                    animationDelay: o.delay,
                }} />
            ))}

            {/* Morphing accent blob */}
            <div style={{
                position: 'absolute', width: 160, height: 160,
                top: '38%', left: '4%',
                background: 'rgba(74,157,92,0.06)',
                animation: 'morph-blob 12s ease-in-out infinite, drift 16s ease-in-out infinite',
                pointerEvents: 'none',
            }} />

            {/* Pulsing rings */}
            {[
                { size: 260, top: '14%', right: '8%' },
                { size: 180, top: '62%', left: '5%' },
                { size: 110, top: '42%', left: '46%' },
            ].map((r, i) => (
                <div key={`r${i}`} style={{
                    position: 'absolute', width: r.size, height: r.size,
                    top: r.top, left: r.left, right: r.right,
                    border: '1px solid rgba(74,157,92,0.18)',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    animation: `pulse-ring ${7 + i * 2.5}s ease-in-out infinite`,
                    animationDelay: `${i * 1.8}s`,
                }} />
            ))}

            {/* Rotating diamond accents */}
            {[
                { top: '42%', left: '2%', size: 9 },
                { top: '19%', right: '4%', size: 6 },
                { top: '76%', right: '13%', size: 10 },
                { top: '57%', left: '52%', size: 5 },
                { top: '8%', left: '30%', size: 4 },
            ].map((d, i) => (
                <div key={`d${i}`} style={{
                    position: 'absolute', top: d.top, left: d.left, right: d.right,
                    width: d.size, height: d.size,
                    background: 'rgba(74,157,92,0.32)',
                    transform: 'rotate(45deg)',
                    pointerEvents: 'none',
                    animation: `drift ${9 + i * 2}s ease-in-out infinite`,
                    animationDelay: `${i * 0.9}s`,
                }} />
            ))}
        </>
    );
}

/* ─────────────────────────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────────────────────────── */
function RowDivider() {
    return (
        <div style={{
            display: 'flex', alignItems: 'center', gap: 14,
            opacity: 0.32, pointerEvents: 'none',
        }}>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(74,157,92,0.7))' }} />
            <div style={{ width: 7, height: 7, background: 'rgba(74,157,92,0.7)', transform: 'rotate(45deg)' }} />
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(74,157,92,0.7), transparent)' }} />
        </div>
    );
}

function StartupStat({ num, label, accent = '#4a9d5c' }) {
    return (
        <div style={{
            display: 'inline-flex', flexDirection: 'column', gap: 6,
            padding: '20px 32px',
            background: 'rgba(255,255,255,0.45)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            border: `1px solid ${accent}35`,
            borderLeft: `3px solid ${accent}`,
            borderRadius: 16,
            boxShadow: `0 8px 32px ${accent}12, inset 0 1px 0 rgba(255,255,255,0.85)`,
            minWidth: 220,
        }}>
            <span style={{ fontSize: 'clamp(1.7rem, 3vw, 2.3rem)', fontFamily: "'Playfair Display', serif", fontWeight: 700, color: accent, lineHeight: 1 }}>
                {num}
            </span>
            <span style={{ fontSize: '0.76rem', color: '#777', letterSpacing: 1.2, textTransform: 'uppercase' }}>
                {label}
            </span>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────────
   Main Component
───────────────────────────────────────────────────────────────── */
export default function Chapter2({ index }) {
    const monthlyLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const monthlyData = [7386, 10028, 12859, 11832, 8854, 7284, 6318, 8869, 11006, 13050, 13739, 8297];

    const weeklyLabels = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
    const weeklyData = [6200, 7800, 8100, 9600, 21500, 54538, 11801];

    const regionalPeakData = {
        'NSW': { month: 'Oktober', count: 4684, season: 'Spring' },
        'VIC': { month: 'November', count: 3412, season: 'Spring' },
        'QLD': { month: 'Oktober', count: 2105, season: 'Spring' },
        'WA': { month: 'November', count: 1240, season: 'Spring' },
        'SA': { month: 'Maret', count: 820, season: 'Autumn' },
        'TAS': { month: 'Februari', count: 280, season: 'Summer' },
        'ACT': { month: 'Maret', count: 190, season: 'Autumn' },
        'NT': { month: 'Agustus', count: 97, season: 'Dry' }
    };

    const seasonColors = {
        'Spring': colors.rose,
        'Autumn': colors.gold,
        'Summer': colors.orange,
        'Dry': colors.blue
    };

    /* ── Typography ── */
    const storyTitleStyle = {
        fontFamily: "'Caveat', cursive",
        fontSize: 'clamp(2.2rem, 3.8vw, 3.2rem)',
        color: colors.dark,
        lineHeight: 1.15,
    };
    const storyTextStyle = {
        fontSize: '1rem',
        color: '#5a6b5c',
        lineHeight: 1.85,
        marginBottom: 16,
    };
    const highlightText = (color = colors.rose) => ({ color, fontWeight: 600 });

    /* ── Glassmorphism styles ── */
    const glassCard = {
        background: 'rgba(240,249,242,0.52)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(74,157,92,0.18)',
        borderRadius: 20,
        boxShadow: '0 8px 40px rgba(74,157,92,0.08), inset 0 1px 0 rgba(255,255,255,0.8)',
    };

    // const narrativeGlass = {
    //     background: 'rgba(255,255,255,0.28)',
    //     backdropFilter: 'blur(14px)',
    //     WebkitBackdropFilter: 'blur(14px)',
    //     border: '1px solid rgba(74,157,92,0.1)',
    //     borderRadius: 20,
    //     padding: 'clamp(22px, 4vw, 38px)',
    //     boxShadow: '0 4px 20px rgba(74,157,92,0.04), inset 0 1px 0 rgba(255,255,255,0.7)',
    // };

    return (
        <Section index={index} bg="linear-gradient(150deg, #f0f9f2 0%, #e8f5ea 40%, #f4faf5 100%)">
            <BgDecor />

            <div style={{
                position: 'relative', zIndex: 1,
                width: '100%', maxWidth: 1100,
                boxSizing: 'border-box',
                display: 'flex', flexDirection: 'column',
                gap: 'clamp(60px, 8vw, 100px)',
            }}>

                {/* ── ROW 1: HEADER & STATS ── */}
                <FadeIn>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 40, alignItems: 'flex-start', alignItems: 'stretch' }}>
                        <div style={{ flex: '1 1 340px' }}>
                            <ChapterLabel num={2} />
                            <Divider style={{ margin: '0 0 24px 0' }} />
                            <h3 style={{ ...storyTitleStyle, textAlign: 'center' }}>Pernah kepo ga sih, kapan orang Aussie melaksanakan pernikahan?</h3>
                            <p style={{ ...storyTextStyle, marginTop: 16, textAlign: 'center' }}>
                                Pernikahan mungkin adalah keputusan yang paling personal bagi sepasang kekasih. Namun, di Australia, ribuan keputusan personal itu secara ajaib membentuk sebuah simfoni kolektif yang rapi. Ia bukan sekadar deretan angka di kalender, melainkan harmoni yang berdenyut mengikuti napas iklim benua ini.
                            </p>
                        </div>
                    </div>
                </FadeIn>

                {/* ── ROW 2: MONTHLY TRENDS ── */}
                <FadeIn delay={0.1}>
                    <div style={{ display: 'flex', flexWrap: 'wrap-reverse', gap: 'clamp(28px, 4.5vw, 52px)', alignItems: 'center' }}>
                        <div style={{ flex: '1.45 1 320px' }}>
                            <ChartCard title="Trend Pernikahan Bulanan Nasional" style={glassCard}>
                                <Line
                                    data={{
                                        labels: monthlyLabels,
                                        datasets: [{
                                            label: 'Total',
                                            data: monthlyData,
                                            borderColor: '#4a9d5c',
                                            backgroundColor: 'rgba(74,157,92,0.07)',
                                            fill: true,
                                            tension: 0.4,
                                            borderWidth: 2.5,
                                            pointRadius: 4,
                                            pointBackgroundColor: '#4a9d5c',
                                            pointBorderColor: '#fff',
                                            pointBorderWidth: 2,
                                        }]
                                    }}
                                    options={{
                                        plugins: { legend: { display: false } },
                                        scales: {
                                            y: { beginAtZero: true, grid: { color: 'rgba(74,157,92,0.06)' }, ticks: { color: '#999' } },
                                            x: { grid: { display: false }, ticks: { color: '#999' } }
                                        }
                                    }}
                                />
                            </ChartCard>
                        </div>
                        <div style={{ flex: '1 1 280px' }}>
                            <h3 style={storyTitleStyle}>Mengejar "Sweet Spot"</h3>
                            <p style={{ ...storyTextStyle, marginTop: 12 }}>
                                Pernikahan di Australia bukan sekadar memilih angka, melainkan harmoni kolektif yang berdenyut mengikuti napas iklim benua. Pasangan melakukan dialog tak kasatmata dengan alam untuk mengejar <span style={highlightText()}>sweet spots</span> di <span style={highlightText()}>November</span> dan <span style={highlightText()}>Maret</span> disaat bunga bermekaran dan langit musim gugur yang stabil memberikan restu terbaik bagi hari bahagia mereka.
                            </p>
                            <p style={storyTextStyle}>
                                Sebaliknya, angka janji suci merosot ketika alam menunjukkan sisi ekstremnya. Panas menyengat di <span style={highlightText(colors.dark)}>Januari</span> dan dinginnya hujan di puncak musim dingin bulan <span style={highlightText(colors.dark)}>Juli</span> menjadi rintangan alam yang paling dihindari, memaksa langkah pasangan melambat demi menjaga kenyamanan perayaan di ruang terbuka.
                            </p>
                        </div>
                    </div>
                </FadeIn>

                {/* ── ROW 3: WEEKLY DOMINANCE ── */}
                <FadeIn delay={0.2}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(28px, 4.5vw, 52px)', alignItems: 'center' }}>
                        <div style={{ flex: '1 1 280px' }}>
                            <h3 style={storyTitleStyle}>Sabtu Sang Penguasa</h3>
                            <p style={{ ...storyTextStyle, marginTop: 12 }}>
                                Jika iklim menentukan bulannya, maka tradisi sosial adalah penguasa mutlak harinya melalui dominasi hari <span style={highlightText()}>Sabtu</span> yang tak tertandingi. Dengan mencatatkan <span style={highlightText()}>54.538 pernikahan</span>, hari ini berdiri sebagai panggung utama yang menyerap hampir seluruh energi perayaan nasional, bahkan volumenya saja sanggup menandingi akumulasi gabungan pernikahan dari Senin hingga Kamis.
                            </p>
                            <p style={storyTextStyle}>
                                Hal ini jadi bukti bahwa bagi masyarakat Australia, Sabtu bukan sekadar akhir pekan biasa, melainkan kesepakatan kolektif yang tak tergoyahkan untuk merayakan momen cinta yang paling sakral.
                            </p>
                        </div>
                        <div style={{ flex: '1.45 1 320px' }}>
                            <ChartCard title="Distribusi Pernikahan Per Hari" style={glassCard}>
                                <Bar
                                    data={{
                                        labels: weeklyLabels,
                                        datasets: [{
                                            data: weeklyData,
                                            backgroundColor: weeklyLabels.map(d =>
                                                d === 'Sabtu' ? 'rgba(74,157,92,0.85)' : 'rgba(74,157,92,0.15)'
                                            ),
                                            borderRadius: 6,
                                        }]
                                    }}
                                    options={{
                                        plugins: { legend: { display: false } },
                                        scales: {
                                            y: { beginAtZero: true, ticks: { callback: v => (v / 1000) + 'k', color: '#999' }, grid: { color: 'rgba(74,157,92,0.06)' } },
                                            x: { grid: { display: false }, ticks: { color: '#999' } }
                                        }
                                    }}
                                />
                            </ChartCard>
                        </div>
                    </div>
                </FadeIn>

                {/* ── ROW 4: REGIONAL MAP ── */}
                <FadeIn delay={0.3}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(28px, 4.5vw, 52px)', alignItems: 'flex-start' }}>

                        <div style={{ flex: '1.15 1 320px' }}>
                            <ChartCard title="Musim Pernikahan berdasarkan Regional di Australia" style={glassCard}>
                                <div style={{ width: '100%', maxWidth: '500px', margin: '0 auto' }}>
                                    <AustraliaMap
                                        data={Object.fromEntries(Object.entries(regionalPeakData).map(([k, v]) => [k, v.count]))}
                                        colorScale={(val) => {
                                            const key = Object.keys(regionalPeakData).find(k => regionalPeakData[k].count === val);
                                            return seasonColors[regionalPeakData[key].season];
                                        }}
                                        unit=""
                                    />
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'center', gap: '18px', marginTop: 36, flexWrap: 'wrap' }}>
                                    {[
                                        { color: colors.rose, label: 'Musim Semi (Sep - Nov)' },
                                        { color: colors.gold, label: 'Musim Gugur (Mar - Mei)' },
                                        { color: colors.orange, label: 'Musim Panas (Des - Feb)' },
                                        { color: colors.blue, label: 'Musim Dingin (Jun - Aug)' },
                                    ].map((item, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.78rem', color: '#666' }}>
                                            <div style={{ width: 11, height: 11, background: item.color, borderRadius: 3, flexShrink: 0, boxShadow: `0 1px 4px ${item.color}66` }} />
                                            {item.label}
                                        </div>
                                    ))}
                                </div>
                            </ChartCard>
                        </div>

                        <div style={{ flex: '1 1 280px', paddingTop: 8 }}>
                            <h3 style={storyTitleStyle}>Beda Wilayah, Beda Waktu Bersemi</h3>
                            <p style={{ ...storyTextStyle, marginTop: 12 }}>
                                Dominasi <span style={highlightText()}>New South Wales</span> memuncak di <span style={highlightText()}>Oktober</span> dengan 4.684 pernikahan. Menariknya, wilayah <span style={highlightText(colors.orange)}>Tasmania</span> menjadi anomali yang puncaknya justru terjadi di bulan <span style={highlightText(colors.orange)}>Februari</span>, memanfaatkan sisa kehangatan musim panas.
                            </p>
                            <p style={storyTextStyle}>
                                Di sisi lain, ibu kota <span style={highlightText(colors.gold)}>ACT</span> dan <span style={highlightText(colors.gold)}>South Australia</span> lebih memilih pesona musim gugur di bulan <span style={highlightText(colors.gold)}>Maret</span>. Sementara di wilayah utara yang tropis seperti <span style={highlightText(colors.blue)}>Northern Territory</span>, pasangan justru memilih bulan <span style={highlightText(colors.blue)}>Agustus</span> saat cuaca cerah dan kering.
                            </p>
                            <p style={{ ...storyTextStyle, fontStyle: 'italic', fontSize: '0.9rem', marginBottom: 0 }}>
                                "Setiap wilayah memiliki iklimnya sendiri untuk merayakan cinta."
                            </p>
                        </div>
                    </div>
                </FadeIn>

            </div>
        </Section>
    );
}