import React, { useRef } from 'react';
import coverImg from '../assets/cover.png';

/* ── Falling petals ── */
function Petals() {
    const petals = useRef(
        Array.from({ length: 26 }, (_, i) => ({
            key:   i,
            size:  7 + (i * 37 % 15),
            delay: (i * 53 % 140) / 10,
            dur:   9 + (i * 71 % 10),
            left:  (i * 389 % 100),
            hue:   330 + (i * 17 % 30),
            light: 76 + (i * 7 % 14),
            sway:  (i * 29 % 30) + 20,
        }))
    ).current;

    return (
        <>
            <style>{`
                @keyframes petalFall {
                    0%   { transform: translateY(-80px) rotate(0deg)   scale(1);    opacity: 0.9; }
                    85%  { opacity: 0.5; }
                    100% { transform: translateY(108vh) rotate(560deg) scale(0.35); opacity: 0; }
                }
                @keyframes petalSway {
                    0%,100% { margin-left: 0px; }
                    33%     { margin-left: var(--sw); }
                    66%     { margin-left: calc(var(--sw) * -0.7); }
                }
            `}</style>
            {petals.map(p => (
                <div key={p.key} style={{
                    position: 'absolute',
                    top: '-5%',
                    left: `${p.left}%`,
                    width:  p.size,
                    height: p.size * 1.5,
                    background: `hsl(${p.hue}, 68%, ${p.light}%)`,
                    borderRadius: '50% 0 50% 0',
                    pointerEvents: 'none',
                    zIndex: 4,
                    '--sw': `${p.sway}px`,
                    animation: `
                        petalFall ${p.dur}s linear ${p.delay}s infinite,
                        petalSway ${p.dur * 0.55}s ease-in-out ${p.delay}s infinite
                    `,
                    willChange: 'transform',
                    filter: 'drop-shadow(0 1px 2px rgba(200,80,100,0.12))',
                }} />
            ))}
        </>
    );
}

export default function Hero() {
    return (
        <section style={{
            width: '100%',
            /* 56.25% = rasio 16:9 penuh, tidak ada crop */
            paddingBottom: '56.25%',
            position: 'relative',
            overflow: 'hidden',
        }}>
            <style>{`
                @keyframes sayingFade {
                    0%,100% { opacity: 0.82; transform: translateY(0); }
                    50%     { opacity: 1;    transform: translateY(-4px); }
                }
            `}</style>

            {/* ── Background — geser ke bawah 8% supaya bagian atas terpotong
                dan angsa bawah lebih terlihat ── */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url(${coverImg})`,
                backgroundSize: 'cover',
                /* center 15% = geser titik fokus ke bawah → atas terpotong sedikit */
                backgroundPosition: 'center top',
                backgroundRepeat: 'no-repeat',
                zIndex: 0,
            }} />

            {/* ── Petals ── */}
            <Petals />

            {/* ── Bottom gradient ── */}
            <div style={{
                position: 'absolute',
                bottom: 0, left: 0, right: 0,
                height: '40%',
                zIndex: 5,
                pointerEvents: 'none',
                background: `linear-gradient(
                    to bottom,
                    rgba(255,240,245,0)    0%,
                    rgba(253,232,236,0.45) 32%,
                    rgba(254,243,232,0.80) 60%,
                    rgba(240,245,255,0.96) 82%,
                    #f0f5ff               100%
                )`,
            }} />

            {/* ── Saying text ── */}
            <div style={{
                position: 'absolute',
                bottom: '11%',
                left: 0,
                right: 0,
                zIndex: 10,
                textAlign: 'center',
                padding: '0 24px',
                pointerEvents: 'none',
            }}>
                <p style={{
                    fontFamily: "'Playfair Display', serif",
                    fontStyle: 'italic',
                    fontSize: 'clamp(1.1rem, 2.6vw, 1.7rem)',
                    color: 'rgba(110, 40, 60, 0.88)',
                    letterSpacing: '0.06em',
                    margin: 50,
                    animation: 'sayingFade 5s ease-in-out infinite',
                    textShadow: '0 2px 16px rgba(255,220,230,0.8)',
                    lineHeight: 1.6,
                    fontWeight: 600,
                }}>
                    "Is marriage still relevant in this modern relationship?"
                </p>
            </div>

            {/* ── Copyright ── */}
            <div style={{
                position: 'absolute',
                bottom: '3.5%',
                width: '100%',
                textAlign: 'center',
                zIndex: 10,
                color: 'rgba(150,70,90,0.55)',
                fontSize: '0.68rem',
                letterSpacing: 1.8,
                fontFamily: "'Nunito', sans-serif",
                pointerEvents: 'none',
            }}>
                © 2025 · Data: ABS Marriage Australia 2024, Census 2021
            </div>
        </section>
    );
}