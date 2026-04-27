import React from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { Section, Divider, ChapterLabel, ChartCard, StatBox, FadeIn, colors } from './shared';
import AustraliaMap from './AustraliaMap';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const sameSexData = { NSW: 1.9, VIC: 2.1, QLD: 1.5, SA: 1.6, WA: 1.4, TAS: 1.7, NT: 2.3, ACT: 3.1 };

// Color scale: light blue → deep rose/purple
const sameSexColorScale = (val) => {
    const min = 1.2, max = 3.2;
    const t = (val - min) / (max - min);
    const r = Math.round(100 + (180 - 100) * t);
    const g = Math.round(149 + (80  - 149) * t);
    const b = Math.round(237 + (160 - 237) * t);
    return `rgb(${r},${g},${b})`;
};

const doughnutData = {
    labels: ['Pasangan Heteroseksual', 'Pasangan Same-Sex'],
    datasets: [{
        data: [116_580, 2_062],
        backgroundColor: ['rgba(100,149,237,0.8)', 'rgba(212,120,138,0.85)'],
        borderColor: ['#6495ed', '#d4788a'],
        borderWidth: 2,
        hoverOffset: 14,
    }],
};

const doughnutOptions = {
    responsive: true,
    cutout: '65%',
    plugins: {
        legend: { position: 'bottom' },
        tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.parsed.toLocaleString()} pernikahan` } },
    },
};

const overseasData = {
    labels: ['Keduanya Lahir di Australia', 'Salah Satu Lahir di LN', 'Keduanya Lahir di LN'],
    datasets: [
        {
            label: 'Heteroseksual (%)',
            data: [52.1, 30.4, 17.5],
            backgroundColor: 'rgba(100,149,237,0.75)',
            borderRadius: 6,
        },
        {
            label: 'Same-Sex (%)',
            data: [44.2, 28.1, 27.7],
            backgroundColor: 'rgba(212,120,138,0.75)',
            borderRadius: 6,
        },
    ],
};

const overseasOptions = {
    responsive: true,
    plugins: {
        legend: { position: 'top' },
        tooltip: { callbacks: { label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y}%` } },
    },
    scales: { y: { beginAtZero: true, ticks: { callback: v => v + '%' } } },
};

function BgDecor() {
    return (
        <>
            <style>{`
                @keyframes floatDiamond {
                    0%,100% { transform: rotate(45deg) translate(0,0); }
                    50%     { transform: rotate(45deg) translate(15px,-20px); }
                }
                @keyframes gradientShift {
                    0%   { background-position: 0% 50%; }
                    50%  { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
            `}</style>
            {/* Animated gradient mesh */}
            <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                background: 'linear-gradient(-45deg, #f7f5ff, #ede8f5, #fce4ec, #e8f5e9)',
                backgroundSize: '400% 400%',
                animation: 'gradientShift 15s ease infinite',
                opacity: 0.6,
            }} />
            {/* Floating diamonds */}
            {[
                { size: 60, top: '10%', left: '5%',  color: 'rgba(180,120,220,0.15)', dur: '8s' },
                { size: 40, top: '70%', left: '85%', color: 'rgba(212,120,138,0.15)', dur: '11s' },
                { size: 80, top: '40%', left: '90%', color: 'rgba(100,149,237,0.1)',  dur: '14s' },
                { size: 30, top: '85%', left: '15%', color: 'rgba(201,168,76,0.15)',  dur: '9s' },
            ].map((d, i) => (
                <div key={i} style={{
                    position: 'absolute', width: d.size, height: d.size,
                    top: d.top, left: d.left,
                    background: d.color,
                    transform: 'rotate(45deg)',
                    animation: `floatDiamond ${d.dur} ease-in-out infinite`,
                    animationDelay: `${i * 1.5}s`,
                    pointerEvents: 'none',
                    borderRadius: 4,
                }} />
            ))}
            {/* Orbs */}
            {[
                { w: 400, h: 400, top: '-10%', right: '-8%', color: 'rgba(180,120,220,0.15)' },
                { w: 300, h: 300, bottom: '0%', left: '-5%', color: 'rgba(100,149,237,0.12)' },
            ].map((o, i) => (
                <div key={i} style={{
                    position: 'absolute', width: o.w, height: o.h,
                    top: o.top, bottom: o.bottom, left: o.left, right: o.right,
                    background: `radial-gradient(circle, ${o.color} 0%, transparent 70%)`,
                    borderRadius: '50%', pointerEvents: 'none',
                }} />
            ))}
        </>
    );
}

export default function Chapter4({ index }) {
    return (
        <Section index={index} bg="#f0eeff">
            <BgDecor />
            <div style={{ position: 'relative', zIndex: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <FadeIn>
                    <ChapterLabel num={4} title="🏳️🌈 Pernikahan Same-Sex & Keberagaman" />
                    <Divider />
                    <p style={{ fontSize: '0.95rem', color: '#7a6a8a', maxWidth: 600, textAlign: 'center', marginBottom: 36, lineHeight: 1.8 }}>
                        Sejak dilegalkan pada Desember 2017, pernikahan same-sex terus meningkat.
                        Menariknya, pasangan same-sex lebih banyak melibatkan individu yang lahir di luar negeri.
                    </p>
                </FadeIn>

                <FadeIn delay={0.05}>
                    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 32, width: '100%' }}>
                        <StatBox num="2062"  label="Pernikahan Same-Sex (2024)" color="#b07cc6" />
                        <StatBox num="1.74"  label="% dari Total Pernikahan"   color={colors.rose} />
                        <StatBox num="+8.3%" label="Naik dari 2023"            color={colors.sage} />
                    </div>
                </FadeIn>

                <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', justifyContent: 'center', width: '100%', maxWidth: 1100, boxSizing: 'border-box' }}>
                    <FadeIn delay={0.1}>
                        <ChartCard title="Perbandingan Pernikahan: Heteroseksual vs Same-Sex (2024)">
                            <div style={{ maxWidth: 300, margin: '0 auto' }}>
                                <Doughnut data={doughnutData} options={doughnutOptions} />
                            </div>
                            <p style={{ fontSize: '0.75rem', color: '#aaa', textAlign: 'center', marginTop: 12 }}>
                                Total: 118,642 pernikahan tercatat di Australia tahun 2024
                            </p>
                        </ChartCard>
                    </FadeIn>

                    <FadeIn delay={0.2}>
                        <ChartCard title="Peta % Same-Sex per Wilayah — Hover untuk detail">
                            <AustraliaMap
                                data={sameSexData}
                                colorScale={sameSexColorScale}
                                unit="%"
                            />
                            <p style={{ fontSize: '0.75rem', color: '#aaa', textAlign: 'center', marginTop: 8 }}>
                                🔴 ACT tertinggi (3.1%) · Sumber: ABS 2024
                            </p>
                        </ChartCard>
                    </FadeIn>
                </div>

                <FadeIn delay={0.3}>
                    <ChartCard
                        title="Asal Kelahiran Pasangan: Heteroseksual vs Same-Sex (%)"
                        style={{ maxWidth: 720, width: '100%', marginTop: 24 }}
                    >
                        <Bar data={overseasData} options={overseasOptions} />
                        <p style={{ fontSize: '0.85rem', color: '#776688', textAlign: 'center', marginTop: 14, lineHeight: 1.8 }}>
                            💡 Pasangan same-sex lebih banyak melibatkan individu yang <strong>lahir di luar negeri</strong> (27.7% keduanya dari LN),
                            dibanding pasangan heteroseksual (17.5%). Banyak warga asing memilih menikah di Australia karena
                            <strong> perlindungan hukum yang lebih kuat</strong> bagi komunitas LGBTQ+.
                        </p>
                    </ChartCard>
                </FadeIn>
            </div>
        </Section>
    );
}
