import React from 'react';
import { colors } from './shared';

export default function Footer() {
    return (
        <footer style={{
            background: colors.dark, color: '#ccc',
            minHeight: '30vh', display: 'flex', flexDirection: 'column',
            justifyContent: 'center', alignItems: 'center',
            textAlign: 'center', padding: 'clamp(24px, 5vw, 40px)', gap: 8,
            boxSizing: 'border-box', width: '100%',
        }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", color: colors.blush, fontSize: '1.8rem', marginBottom: 8 }}>
                💍 Love Down Under
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#aaa', maxWidth: 500, lineHeight: 1.7 }}>
                Data visualisasi pernikahan Australia — menggabungkan data ABS (Australian Bureau of Statistics)
                dan Sensus Penduduk 2021.
            </p>
            <div style={{ marginTop: 16, display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
                {['Chapter 1: Usia Menikah', 'Chapter 2: Waktu Menikah', 'Chapter 3: De Facto', 'Chapter 4: Same-Sex'].map((lbl, i) => (
                    <button
                        key={i}
                        onClick={() => document.querySelector(`section[data-index="${i + 1}"]`)?.scrollIntoView({ behavior: 'smooth' })}
                        style={{
                            background: 'transparent', border: `1px solid #555`, color: '#aaa',
                            padding: '6px 16px', borderRadius: 20, cursor: 'pointer', fontSize: '0.8rem',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = colors.blush; e.currentTarget.style.color = colors.blush; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#555'; e.currentTarget.style.color = '#aaa'; }}
                    >
                        {lbl}
                    </button>
                ))}
            </div>
            <p style={{ fontSize: '0.75rem', color: '#666', marginTop: 20 }}>
                © 2025 · Data: ABS Marriage Australia 2024, Census 2021
            </p>
        </footer>
    );
}
