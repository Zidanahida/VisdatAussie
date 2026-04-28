import React from 'react';
import { colors } from './shared';

export default function Footer() {
    return (
        <footer style={{
            position: 'relative',
            background: 'linear-gradient(180deg, #f5f9ff 0%, #fef3e8 55%, #fffaf7 100%)',
            color: '#7a6a68',
            minHeight: '30vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            padding: 'clamp(32px, 5vw, 48px) clamp(24px, 5vw, 40px)',
            gap: 8,
            boxSizing: 'border-box',
            width: '100%',
            overflow: 'hidden',
        }}>
            {/* garis pemisah panjang */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 'min(86vw, 980px)',
                height: 1,
                background: 'linear-gradient(to right, transparent, rgba(212,120,138,0.32), transparent)',
                pointerEvents: 'none',
            }} />

            <h2 style={{
                fontFamily: "'Playfair Display', serif",
                color: colors.rose,
                fontSize: '1.8rem',
                marginBottom: 8,
                position: 'relative',
                zIndex: 1,
            }}>
                Australia Marriage Data Story
            </h2>

            <p style={{
                fontSize: '0.9rem',
                color: '#8a7d7a',
                maxWidth: 500,
                lineHeight: 1.7,
                position: 'relative',
                zIndex: 1,
            }}>
                Data visualisasi pernikahan Australia — menggabungkan data ABS (Australian Bureau of Statistics)
                dan Sensus Penduduk 2021.
            </p>

            <p style={{
                fontSize: '0.75rem',
                color: '#a49a98',
                marginTop: 20,
                position: 'relative',
                zIndex: 1,
            }}>
                © 2026 · Kelompok 2 - Visualisasi Data
            </p>
        </footer>
    );
}