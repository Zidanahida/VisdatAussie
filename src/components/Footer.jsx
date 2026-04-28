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
            {/* ✅ Div chapter buttons dihapus dari sini */}
            <p style={{ fontSize: '0.75rem', color: '#666', marginTop: 20 }}>
                © 2025 · Data: ABS Marriage Australia 2024, Census 2021
            </p>
        </footer>
    );
}