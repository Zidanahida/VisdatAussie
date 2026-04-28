import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import {
    Chart as ChartJS,
    CategoryScale, LinearScale, BarElement,
    Tooltip, Legend, PointElement, LineElement
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { Section, Divider, ChapterLabel, ChartCard, FadeIn, colors } from './shared';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, PointElement, LineElement);

// ─── Data hook ───────────────────────────────────────────────────────────────
function useData4() {
    const [mapData, setMapData] = useState(null);  // per-state living together
    const [trendData, setTrendData] = useState(null); // tren pernikahan same-sex
    const [livingTrendData, setLivingTrendData] = useState(null); // tren living together

    useEffect(() => {
        // Sheet 1: per-state (existing data4.xlsx, rows 3–10)
        fetch('/data4.xlsx')
            .then(r => r.arrayBuffer())
            .then(buf => {
                const wb = XLSX.read(buf, { type: 'array' });

                // --- Map data (sheet 1) ---
                const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1 });
                const nameToKey = {
                    'New South Wales': 'NSW', 'Victoria': 'VIC', 'Queensland': 'QLD',
                    'South Australia': 'SA', 'Western Australia': 'WA', 'Tasmania': 'TAS',
                    'Northern Territory': 'NT', 'Australian Capital Territory': 'ACT',
                };
                const result = {};
                rows.slice(3, 11).forEach(r => {
                    const key = nameToKey[r[0]];
                    if (key) result[key] = { sameSex: r[5], total: r[7] };
                });
                setMapData(result);

                // --- Tren same-sex marriages (sheet 2 jika ada, fallback hardcode) ---
                // Hardcode data tren 2018-2021 dari ABS
                setTrendData([
                    { year: '2018', count: 174 },
                    { year: '2019', count: 5548 },
                    { year: '2020', count: 2923 },
                    { year: '2021', count: 2883 },
                ]);

                // --- Tren living together 1996-2021 ---
                setLivingTrendData([
                    { year: '1996', count: 10081 },
                    { year: '2001', count: 19900 },
                    { year: '2006', count: 25620 },
                    { year: '2011', count: 33714 },
                    { year: '2016', count: 46800 },
                    { year: '2021', count: 79000 },
                ]);
            });
    }, []);

    return { mapData, trendData, livingTrendData };
}

// ─── Background decoration (selaras dengan Chapter3) ─────────────────────────
function BgDecor() {
    return (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
            <style>{`
                @keyframes floatUp4 { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-20px) rotate(5deg)} }
                @keyframes pulse4 { 0%,100%{opacity:0.1} 50%{opacity:0.25} }
            `}</style>
            <div style={{ position: 'absolute', width: 500, height: 500, top: '-10%', left: '-10%', background: 'radial-gradient(circle, rgba(180,120,220,0.15) 0%, transparent 70%)', borderRadius: '50%', animation: 'pulse4 8s infinite' }} />
            <div style={{ position: 'absolute', width: 400, height: 400, bottom: '-5%', right: '-5%', background: 'radial-gradient(circle, rgba(212,120,138,0.15) 0%, transparent 70%)', borderRadius: '50%', animation: 'pulse4 10s infinite reverse' }} />
            {[
                { size: 120, top: '20%', right: '10%', color: 'rgba(180,120,220,0.15)' },
                { size: 80, bottom: '30%', left: '8%', color: 'rgba(212,120,138,0.2)' }
            ].map((r, i) => (
                <div key={i} style={{
                    position: 'absolute', width: r.size, height: r.size,
                    top: r.top, bottom: r.bottom, left: r.left, right: r.right,
                    border: `2px solid ${r.color}`, borderRadius: '50%',
                    animation: `floatUp4 ${6 + i * 2}s ease-in-out infinite`
                }} />
            ))}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(180,120,220,0.07) 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }} />
        </div>
    );
}

// ─── Tooltip style (sama dengan Chapter3) ────────────────────────────────────
const flatTooltip = {
    backgroundColor: '#ffffff',
    titleColor: '#3d2b2b',
    bodyColor: '#555',
    borderColor: 'rgba(180,120,220,0.3)',
    borderWidth: 1,
    padding: 12,
    boxPadding: 6,
    usePointStyle: true,
    titleFont: { size: 13, family: "'Playfair Display', serif", weight: 'bold' },
    bodyFont: { size: 12, family: "'Nunito', sans-serif" },
};

// ─── Person Icon ──────────────────────────────────────────────────────────────
function PersonIcon({ color, size = 48 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
            <circle cx="12" cy="7" r="4" />
            <path d="M12 13c-5 0-8 2.5-8 4v1h16v-1c0-1.5-3-4-8-4z" />
        </svg>
    );
}

// ─── Chart: Tren Living Together ─────────────────────────────────────────────
function LivingTrendChart({ data }) {
    const chartData = {
        labels: data.map(d => d.year),
        datasets: [{
            label: 'Pasangan Same-Sex Living Together',
            data: data.map(d => d.count),
            borderColor: '#b07cc6',
            backgroundColor: 'rgba(176,124,198,0.12)',
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#b07cc6',
            pointRadius: 5,
            pointHoverRadius: 8,
        }],
    };
    const options = {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: {
                ...flatTooltip,
                callbacks: {
                    label: ctx => ` ${ctx.parsed.y.toLocaleString()} pasangan`,
                },
            },
        },
        scales: {
            x: { grid: { display: false }, ticks: { font: { family: "'Nunito', sans-serif" } } },
            y: {
                grid: { color: 'rgba(0,0,0,0.05)' },
                ticks: {
                    font: { family: "'Nunito', sans-serif" },
                    callback: v => v.toLocaleString(),
                },
            },
        },
    };
    return <Line data={chartData} options={options} />;
}

// ─── Chart: Tren Same-Sex Marriages ──────────────────────────────────────────
function MarriageTrendChart({ data }) {
    const chartData = {
        labels: data.map(d => d.year),
        datasets: [{
            label: 'Pernikahan Same-Sex',
            data: data.map(d => d.count),
            backgroundColor: data.map((_, i) => i === 1 ? '#b07cc6' : 'rgba(176,124,198,0.45)'),
            borderRadius: 8,
            borderSkipped: false,
        }],
    };
    const options = {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: {
                ...flatTooltip,
                callbacks: {
                    label: ctx => ` ${ctx.parsed.y.toLocaleString()} pernikahan`,
                },
            },
        },
        scales: {
            x: { grid: { display: false }, ticks: { font: { family: "'Nunito', sans-serif" } } },
            y: {
                grid: { color: 'rgba(0,0,0,0.05)' },
                ticks: {
                    font: { family: "'Nunito', sans-serif" },
                    callback: v => v.toLocaleString(),
                },
            },
        },
    };
    return <Bar data={chartData} options={options} />;
}

// ─── Illustration: 10 Persons Waffle ─────────────────────────────────────────
function WaffleIllustration() {
    return (
        <div style={{
            background: 'white', borderRadius: 20, padding: '28px 32px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.06)', width: '100%', boxSizing: 'border-box',
        }}>
            {/* Same-sex */}
            <div style={{ marginBottom: 20 }}>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', color: '#3d2b2b', marginBottom: 4, fontWeight: 700 }}>
                    Dari 10 Pasangan Same-Sex...
                </p>
                <p style={{ fontSize: '0.82rem', color: '#9a7a9a', marginBottom: 10, lineHeight: 1.6 }}>
                    Hanya <strong style={{ color: '#b07cc6' }}>2</strong> memilih menikah resmi,{' '}
                    <strong style={{ color: '#ccc' }}>8</strong> tetap memilih de facto.
                </p>
                <div style={{ display: 'flex', gap: 4 }}>
                    {Array.from({ length: 10 }).map((_, i) => (
                        <PersonIcon key={i} color={i < 2 ? '#b07cc6' : '#ddd'} size={38} />
                    ))}
                </div>
            </div>

            <div style={{ width: '100%', height: 1, background: '#f0f0f0', margin: '16px 0' }} />

            {/* Different-sex */}
            <div>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', color: '#3d2b2b', marginBottom: 4, fontWeight: 700 }}>
                    Dari 10 Pasangan Beda Jenis...
                </p>
                <p style={{ fontSize: '0.82rem', color: '#9a7a9a', marginBottom: 10, lineHeight: 1.6 }}>
                    Sebanyak <strong style={{ color: '#d4788a' }}>8</strong> memilih menikah resmi, hanya{' '}
                    <strong style={{ color: '#ccc' }}>2</strong> memilih de facto.
                </p>
                <div style={{ display: 'flex', gap: 4 }}>
                    {Array.from({ length: 10 }).map((_, i) => (
                        <PersonIcon key={i} color={i < 8 ? '#d4788a' : '#ddd'} size={38} />
                    ))}
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-start', gap: 24, marginTop: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: '#b07cc6', fontWeight: 600 }}>
                    <PersonIcon color="#b07cc6" size={14} /> Menikah (same-sex)
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: '#d4788a', fontWeight: 600 }}>
                    <PersonIcon color="#d4788a" size={14} /> Menikah (beda jenis)
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: '#ccc', fontWeight: 600 }}>
                    <PersonIcon color="#ddd" size={14} /> De Facto
                </div>
            </div>
            <p style={{ fontSize: '0.72rem', color: '#aaa', marginTop: 10 }}>Sumber: ABS Census 2021</p>
        </div>
    );
}

// ─── Shared typography (sama dengan Chapter3) ─────────────────────────────────
const storyTitleStyle = {
    fontFamily: "'Caveat', cursive",
    fontSize: 'clamp(2.4rem, 4vw, 3.4rem)',
    color: '#3d2b2b',
    lineHeight: 1.1,
};

const storyTextStyle = {
    fontSize: '1rem',
    color: '#666',
    lineHeight: 1.8,
    marginBottom: 16,
};

const highlightText = {
    color: '#b07cc6',
    fontWeight: 600,
};

// ─── Milestone card: 7 Des 2017 ───────────────────────────────────────────────
function MilestoneCard() {
    return (
        <div style={{
            background: 'linear-gradient(135deg, #f3eaff 0%, #fce4ec 100%)',
            borderRadius: 20,
            padding: 'clamp(24px, 4vw, 40px)',
            textAlign: 'center',
            boxShadow: '0 4px 24px rgba(176,124,198,0.15)',
            border: '1.5px solid rgba(176,124,198,0.2)',
            width: '100%',
            boxSizing: 'border-box',
        }}>
            <div style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', marginBottom: 8 }}>🏛️</div>
            <div style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)', color: '#3d2b2b', fontWeight: 700, marginBottom: 8, fontFamily: "'Playfair Display', serif" }}>
                7 Desember 2017
            </div>
            <div style={{ fontSize: '1rem', color: '#7a6a8a', lineHeight: 1.7, maxWidth: 520, margin: '0 auto' }}>
                Australia mengesahkan undang-undang yang mengizinkan pernikahan same-sex secara hukum. Perubahan regulasi ini membuka opsi baru bagi pasangan same-sex untuk{' '}
                <span style={{ color: '#b07cc6', fontWeight: 600 }}>mencatatkan hubungan mereka secara resmi</span>{' '}
                di hadapan negara, sama seperti pasangan lainnya.
            </div>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Chapter4({ index }) {
    const { mapData, trendData, livingTrendData } = useData4();

    return (
        <Section
            index={index}
            bg="linear-gradient(150deg, #fdf8ff 0%, #f5eeff 50%, #fff8fa 100%)"
            style={{ overflow: 'hidden' }}
        >
            <BgDecor />

            <div style={{
                position: 'relative', zIndex: 1,
                width: '100%', maxWidth: 1120, boxSizing: 'border-box',
                display: 'flex', flexDirection: 'column',
                gap: 'clamp(50px, 8vw, 80px)',
            }}>

                {/* ── ROW 1: Transisi + Tren Living Together ── */}
                <FadeIn>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(32px, 5vw, 60px)', alignItems: 'center' }}>

                        {/* Narasi kiri */}
                        <div style={{ flex: 1.2, minWidth: 320, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <ChapterLabel num={4} />
                            <Divider style={{ margin: '0 0 24px 0' }} />
                            <h3 style={{ ...storyTitleStyle, marginBottom: 16 }}>Apa yang Berubah di 2017?</h3>
                            <p style={storyTextStyle}>
                                Di chapter sebelumnya kita melihat de facto sebagai pilihan yang tersebar di berbagai kelompok usia. Tapi ada satu kelompok yang membuat pola de facto ini punya konteks berbeda secara hukum.
                            </p>
                            <p style={storyTextStyle}>
                                Sejak 1996, sensus Australia sudah mencatat pasangan same-sex yang tinggal bersama sebagai bagian dari data kependudukan. Jumlahnya sekitar{' '}
                                <span style={highlightText}>10.000 pasangan</span> di 1996. Di 2021, angka itu tumbuh hampir delapan kali lipat menjadi sekitar{' '}
                                <span style={highlightText}>80.000 pasangan</span>.
                            </p>
                            <p style={storyTextStyle}>
                                Selama periode itu, pernikahan secara hukum belum tersedia bagi kelompok ini di Australia. Barulah pada akhir 2017, regulasi berubah dan opsi tersebut menjadi tersedia secara legal.
                            </p>
                        </div>

                        {/* Chart kanan */}
                        <div style={{ flex: 0.8, minWidth: 300 }}>
                            <ChartCard title="Total Same-Sex Couples Living Together (1996–2021)">
                                <div style={{ padding: '10px 0' }}>
                                    {livingTrendData
                                        ? <LivingTrendChart data={livingTrendData} />
                                        : <div style={{ color: '#aaa', textAlign: 'center' }}>Memuat data…</div>
                                    }
                                </div>
                                <p style={{ fontSize: '0.85rem', color: '#999', textAlign: 'center', marginTop: 14, lineHeight: 1.6 }}>
                                    Pertumbuhan yang konsisten selama 25 tahun, tercatat dalam sensus sebelum adanya perubahan regulasi pernikahan.
                                </p>
                            </ChartCard>
                        </div>
                    </div>
                </FadeIn>

                {/* ── MILESTONE CARD: 7 Des 2017 ── */}
                <FadeIn delay={0.1}>
                    <MilestoneCard />
                </FadeIn>

                {/* ── ROW 2: Tren Marriage + Narasi ── */}
                <FadeIn delay={0.15}>
                    <div style={{ display: 'flex', flexWrap: 'wrap-reverse', gap: 'clamp(32px, 5vw, 60px)', alignItems: 'center' }}>

                        {/* Chart kiri */}
                        <div style={{ flex: 1, minWidth: 300 }}>
                            <ChartCard title="Total Same-Sex Marriages per Tahun (2018–2021)">
                                <div style={{ padding: '10px 0' }}>
                                    {trendData
                                        ? <MarriageTrendChart data={trendData} />
                                        : <div style={{ color: '#aaa', textAlign: 'center' }}>Memuat data…</div>
                                    }
                                </div>
                                <p style={{ fontSize: '0.85rem', color: '#999', textAlign: 'center', marginTop: 14, lineHeight: 1.6 }}>
                                    Lonjakan di 2019 adalah tahun penuh pertama sejak regulasi berlaku, sebelum terdampak pandemi di 2020.
                                </p>
                            </ChartCard>
                        </div>

                        {/* Narasi kanan */}
                        <div style={{ flex: 1, minWidth: 320 }}>
                            <h3 style={{ ...storyTitleStyle, marginBottom: 16 }}>Bagaimana Responnya?</h3>
                            <p style={storyTextStyle}>
                                Begitu regulasi berlaku, ABS mulai mencatat pernikahan same-sex sebagai kategori tersendiri. Di 2018, tahun pertama, angkanya masih sangat kecil karena undang-undang baru saja disahkan di penghujung 2017.
                            </p>
                            <p style={storyTextStyle}>
                                Di 2019 terjadi lonjakan signifikan, tercatat lebih dari{' '}
                                <span style={highlightText}>5.500 pernikahan same-sex</span> dalam satu tahun. Ini adalah tahun pertama di mana data sepenuhnya mencerminkan kelompok yang sebelumnya belum punya akses legal ke institusi pernikahan.
                            </p>
                            <p style={storyTextStyle}>
                                Di 2020 dan 2021, angka turun ke kisaran <span style={highlightText}>2.900</span> per tahun. Penurunan ini sejalan dengan tren pernikahan secara umum di Australia yang juga terdampak pembatasan akibat pandemi COVID-19.
                            </p>
                        </div>
                    </div>
                </FadeIn>

                {/* ── ROW 3: Waffle + Narasi ── */}
                <FadeIn delay={0.2}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(32px, 5vw, 60px)', alignItems: 'center' }}>

                        {/* Narasi kiri */}
                        <div style={{ flex: 1.2, minWidth: 320 }}>
                            <h3 style={{ ...storyTitleStyle, marginBottom: 16 }}>Pilihan yang Tidak Selalu Sama</h3>
                            <p style={storyTextStyle}>
                                Yang menarik dari data ini bukan hanya berapa banyak yang menikah, tapi berapa banyak yang tidak.
                            </p>
                            <p style={storyTextStyle}>
                                Dari 10 pasangan same-sex, hanya{' '}
                                <span style={highlightText}>2 yang tercatat menikah resmi</span>. Delapan sisanya masih berstatus de facto. Sementara pada pasangan beda jenis, polanya hampir terbalik: <span style={highlightText}>8 dari 10</span> memilih menikah resmi.
                            </p>
                            <p style={storyTextStyle}>
                                Data ini menunjukkan bahwa tersedianya akses hukum tidak otomatis mengubah pola yang sudah terbentuk. Sebagian besar pasangan same-sex tampaknya tetap mempertahankan status de facto meski opsi menikah kini tersedia secara legal.
                            </p>
                        </div>

                        {/* Waffle kanan */}
                        <div style={{ flex: 0.8, minWidth: 300 }}>
                            <WaffleIllustration />
                        </div>
                    </div>
                </FadeIn>
            </div>
        </Section>
    );
}