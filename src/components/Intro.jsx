import React, { useEffect, useRef } from 'react';
import { Section, Divider, colors, FadeIn } from './shared';

const reasons = [
    { icon: '📊', title: 'Data Lengkap & Terpercaya', desc: 'Australia memiliki sistem pencatatan pernikahan yang komprehensif melalui ABS (Australian Bureau of Statistics).' },
    { icon: '🌏', title: 'Masyarakat Multikultural', desc: 'Lebih dari 30% penduduk Australia lahir di luar negeri, menciptakan pola pernikahan yang beragam dan unik.' },
    { icon: '🏳️🌈', title: 'Legalisasi Pernikahan Sejenis', desc: 'Sejak 2017, Australia melegalkan same-sex marriage, menjadikannya studi kasus sosial yang relevan.' },
    { icon: '💑', title: 'Tren De Facto Tinggi', desc: 'Australia memiliki proporsi pasangan de facto tertinggi di antara negara-negara maju, menarik untuk dikaji.' },
];

function AnimatedBackground() {
    return (
        <>
            <style>{`
                @keyframes fall {
                    0%   { transform: translateY(-80px) rotate(0deg) scale(1);   opacity: 0.6; }
                    100% { transform: translateY(110vh)  rotate(540deg) scale(0.5); opacity: 0; }
                }
                @keyframes floatOrb {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33%      { transform: translate(30px, -40px) scale(1.1); }
                    66%      { transform: translate(-20px, 20px) scale(0.95); }
                }
                @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(8px)} }
                @keyframes shimmer {
                    0%   { background-position: -200% center; }
                    100% { background-position: 200% center; }
                }
            `}</style>

            {/* Soft orbs */}
            {[
                { w: 500, h: 500, top: '-10%', left: '-10%', color: 'rgba(242,196,206,0.35)', dur: '12s' },
                { w: 400, h: 400, top: '50%', left: '70%', color: 'rgba(201,168,76,0.2)', dur: '16s' },
                { w: 300, h: 300, top: '20%', left: '60%', color: 'rgba(168,184,154,0.25)', dur: '10s' },
                { w: 350, h: 350, top: '70%', left: '10%', color: 'rgba(212,120,138,0.2)', dur: '14s' },
            ].map((o, i) => (
                <div key={i} style={{
                    position: 'absolute', width: o.w, height: o.h,
                    top: o.top, left: o.left,
                    background: `radial-gradient(circle, ${o.color} 0%, transparent 70%)`,
                    borderRadius: '50%',
                    animation: `floatOrb ${o.dur} ease-in-out infinite`,
                    animationDelay: `${i * 2}s`,
                    pointerEvents: 'none',
                }} />
            ))}

            {/* Falling petals */}
            {Array.from({ length: 22 }).map((_, i) => {
                const size = 8 + Math.random() * 16;
                return (
                    <div key={`p${i}`} style={{
                        position: 'absolute',
                        width: size, height: size * 1.4,
                        background: `hsl(${335 + Math.random() * 35}, 70%, ${78 + Math.random() * 12}%)`,
                        borderRadius: '50% 0 50% 0',
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 20}%`,
                        animation: `fall ${7 + Math.random() * 9}s linear ${Math.random() * 12}s infinite`,
                        pointerEvents: 'none',
                        opacity: 0.5,
                    }} />
                );
            })}

            {/* Decorative rings */}
            {[
                { size: 180, top: '15%', right: '8%', color: 'rgba(201,168,76,0.2)' },
                { size: 120, bottom: '20%', left: '5%', color: 'rgba(212,120,138,0.15)' },
                { size: 80, top: '60%', right: '20%', color: 'rgba(168,184,154,0.2)' },
            ].map((r, i) => (
                <div key={`r${i}`} style={{
                    position: 'absolute', width: r.size, height: r.size,
                    top: r.top, bottom: r.bottom, left: r.left, right: r.right,
                    border: `2px solid ${r.color}`,
                    borderRadius: '50%', pointerEvents: 'none',
                }} />
            ))}
        </>
    );
}

export default function Intro({ index }) {
    return (
        <Section index={index} bg="linear-gradient(135deg, #fff0f5 0%, #fde8ec 30%, #fef3e8 60%, #f0f5ff 100%)">
            <AnimatedBackground />
            <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', width: '100%' }}>
                <FadeIn>
                    <h1 style={{
                        fontFamily: "'Great Vibes', cursive",
                        fontSize: 'clamp(3.5rem, 7vw, 6rem)',
                        background: 'linear-gradient(135deg, #d4788a 0%, #c9a84c 50%, #d4788a 100%)',
                        backgroundSize: '200% auto',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        animation: 'shimmer 4s linear infinite',
                        marginBottom: 12,
                        lineHeight: 1.3, // ✅ tambahkan ini agar huruf sambung tidak terpotong
                        letterSpacing: 2, // ✅ opsional, beri sedikit nafas
                    }}>
                        Dibalik Angka Pernikahan
                    </h1>
                    <p style={{
                        fontSize: '1.05rem', color: '#a08080', letterSpacing: 4,
                        textTransform: 'uppercase', marginBottom: 32,
                        fontWeight: 300,
                    }}>
                        Australian Marriage Data Story
                    </p>
                    <Divider />
                    <p style={{ maxWidth: 560, margin: '0 auto 36px', color: '#9a7a7a', lineHeight: 1.9, fontSize: '0.95rem' }}>
                        Mengapa Australia? Negeri kanguru ini menyimpan cerita pernikahan yang menarik —
                        dari tradisi, keberagaman, hingga perubahan sosial yang mencerminkan dunia modern.
                    </p>
                </FadeIn>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, justifyContent: 'center', maxWidth: 900, margin: '0 auto 44px', width: '100%' }}>
                    {reasons.map((r, i) => (
                        <FadeIn key={i} delay={i * 0.12}>
                            <div style={{
                                background: 'rgba(255,255,255,0.75)',
                                backdropFilter: 'blur(12px)',
                                border: '1px solid rgba(242,196,206,0.6)',
                                borderRadius: 20,
                                padding: '22px 26px',
                                width: 'clamp(200px, 40vw, 230px)',
                                textAlign: 'left',
                                boxShadow: '0 8px 32px rgba(212,120,138,0.1), inset 0 1px 0 rgba(255,255,255,0.8)',
                                transition: 'transform 0.3s, box-shadow 0.3s',
                                cursor: 'default',
                                boxSizing: 'border-box',
                            }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)';
                                    e.currentTarget.style.boxShadow = '0 16px 48px rgba(212,120,138,0.22), inset 0 1px 0 rgba(255,255,255,0.8)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(212,120,138,0.1), inset 0 1px 0 rgba(255,255,255,0.8)';
                                }}
                            >
                                <div style={{ fontSize: 30, marginBottom: 10 }}>{r.icon}</div>
                                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', color: colors.rose, marginBottom: 8 }}>{r.title}</h3>
                                <p style={{ fontSize: '0.83rem', color: '#888', lineHeight: 1.6 }}>{r.desc}</p>
                            </div>
                        </FadeIn>
                    ))}
                </div>

                <p style={{ fontSize: '0.8rem', color: '#c4a0a8', letterSpacing: 2, animation: 'bounce 2s infinite' }}>
                    ↓ scroll untuk mulai ↓
                </p>
            </div>
        </Section>
    );
}