import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { Section, Divider, ChapterLabel, ChartCard, FadeIn, colors } from './shared';
import AustraliaMap from './AustraliaMap';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

<script
    type="module"
    src="https://public.tableau.com/javascripts/api/tableau.embedding.3.latest.min.js">
</script>

const defactoData = { NSW: 13.2, VIC: 14.1, QLD: 15.8, SA: 13.9, WA: 15.2, TAS: 16.4, NT: 20.1, ACT: 14.7 };

// Color scale: light gold → deep rose
const defactoColorScale = (val) => {
    const min = 13, max = 21;
    const t = (val - min) / (max - min);
    // Dari biru muda → kuning → merah tua (lebih kontras)
    if (t < 0.5) {
        const t2 = t / 0.5;
        const r = Math.round(100 + (220 - 100) * t2);
        const g = Math.round(180 + (160 - 180) * t2);
        const b = Math.round(220 + (80  - 220) * t2);
        return `rgb(${r},${g},${b})`;
    } else {
        const t2 = (t - 0.5) / 0.5;
        const r = Math.round(220 + (180 - 220) * t2);
        const g = Math.round(160 + (40  - 160) * t2);
        const b = Math.round(80  + (60  -  80) * t2);
        return `rgb(${r},${g},${b})`;
    }
};

const pieData = {
    labels: ['Pasangan Menikah (Registered)', 'Pasangan De Facto'],
    datasets: [{
        data: [7_025_000, 1_017_000],
        backgroundColor: ['rgba(212,120,138,0.85)', 'rgba(201,168,76,0.8)'],
        borderColor: ['#d4788a', '#c9a84c'],
        borderWidth: 2,
        hoverOffset: 14,
    }],
};

const pieOptions = {
    responsive: true,
    plugins: {
        legend: { position: 'bottom' },
        tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.parsed.toLocaleString()} pasangan` } },
    },
};

function BgDecor() {
    return (
        <>
            <style>{`
                @keyframes rotateSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes pulse3 { 0%,100%{opacity:0.15} 50%{opacity:0.3} }
            `}</style>
            {/* Large rotating ring */}
            <div style={{
                position: 'absolute', width: 600, height: 600,
                top: '50%', left: '-15%', transform: 'translateY(-50%)',
                border: '1.5px solid rgba(212,120,138,0.2)',
                borderRadius: '50%',
                animation: 'rotateSlow 40s linear infinite',
                pointerEvents: 'none',
            }} />
            <div style={{
                position: 'absolute', width: 400, height: 400,
                top: '50%', left: '-8%', transform: 'translateY(-50%)',
                border: '1px solid rgba(201,168,76,0.2)',
                borderRadius: '50%',
                animation: 'rotateSlow 28s linear infinite reverse',
                pointerEvents: 'none',
            }} />
            {/* Blobs */}
            {[
                { w: 350, h: 350, top: '-5%',  right: '-5%',  color: 'rgba(212,120,138,0.12)' },
                { w: 280, h: 280, bottom: '5%', left: '40%',  color: 'rgba(201,168,76,0.1)' },
            ].map((b, i) => (
                <div key={i} style={{
                    position: 'absolute', width: b.w, height: b.h,
                    top: b.top, bottom: b.bottom, left: b.left, right: b.right,
                    background: `radial-gradient(circle, ${b.color} 0%, transparent 70%)`,
                    borderRadius: '50%', pointerEvents: 'none',
                    animation: `pulse3 ${6 + i * 2}s ease-in-out infinite`,
                }} />
            ))}
            {/* Dot grid pattern */}
            <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                backgroundImage: 'radial-gradient(circle, rgba(212,120,138,0.12) 1px, transparent 1px)',
                backgroundSize: '32px 32px',
                opacity: 0.6,
            }} />
        </>
    );
}

export default function Chapter3({ index }) {
    return (
        <Section index={index} bg="linear-gradient(145deg, #fff5f8 0%, #fef0f5 40%, #f5f0ff 100%)">
            <BgDecor />
            <div style={{ position: 'relative', zIndex: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <FadeIn>
                    <ChapterLabel num={3} title="🏠 De Facto vs Pernikahan Resmi" />
                    <Divider />
                    <p style={{ fontSize: '0.95rem', color: '#9a7a7a', maxWidth: 600, textAlign: 'center', marginBottom: 36, lineHeight: 1.8 }}>
                        Berdasarkan Sensus Penduduk Australia 2021, terdapat perbedaan signifikan antara
                        pasangan yang menikah secara resmi dan yang hidup bersama (de facto).
                    </p>
                </FadeIn>

                <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', justifyContent: 'center', width: '100%', maxWidth: 1100, boxSizing: 'border-box' }}>
                    <FadeIn delay={0.1}>
    <ChartCard title="Komposisi Pasangan: Registered vs De Facto (SP 2021)">
        <div style={{ width: '100%', minHeight: 500 }}>
            <tableau-viz
                src="https://public.tableau.com/views/TBDkelompok2-Chapter3/Dashboard1"
                width="100%"
                height="500"
                toolbar="hidden"
                hide-tabs
            />
        </div>
    </ChartCard>
</FadeIn>

                    <FadeIn delay={0.2}>
                        <ChartCard title="Peta De Facto per Wilayah — Hover untuk detail">
                            <AustraliaMap
                                data={defactoData}
                                colorScale={defactoColorScale}
                                unit="%"
                            />
                            <p style={{ fontSize: '0.75rem', color: '#aaa', textAlign: 'center', marginTop: 8 }}>
                                🔴 NT tertinggi (20.1%) · Sumber: ABS Census 2021
                            </p>
                        </ChartCard>
                    </FadeIn>
                </div>

                <FadeIn delay={0.3}>
                    <div style={{
                        marginTop: 28, background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)',
                        borderRadius: 18, padding: '20px 32px',
                        boxShadow: '0 8px 32px rgba(212,120,138,0.1)', maxWidth: 680, textAlign: 'center',
                        border: '1px solid rgba(242,196,206,0.4)',
                    }}>
                        <p style={{ fontSize: '0.9rem', color: '#776060', lineHeight: 1.8 }}>
                            💡 Tasmania (TAS) dan Northern Territory (NT) memiliki proporsi de facto tertinggi,
                            mencerminkan gaya hidup yang lebih <strong>liberal dan urban</strong> di wilayah tersebut.
                        </p>
                    </div>
                </FadeIn>
            </div>
        </Section>
    );
}
