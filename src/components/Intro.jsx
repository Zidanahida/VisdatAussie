import React from 'react';
import { Section, Divider, colors, FadeIn } from './shared';

import analysisIcon from '../assets/analysis.png';
import handsIcon from '../assets/hands.png';
import rainbowIcon from '../assets/rainbow.png';
import loversIcon from '../assets/lovers.png';

const reasons = [
    { icon: analysisIcon, title: 'Data Lengkap & Terpercaya', desc: 'Australia memiliki sistem pencatatan pernikahan yang komprehensif melalui ABS.' },
    { icon: handsIcon, title: 'Masyarakat Multikultural', desc: 'Lebih dari 30% penduduk Australia lahir di luar negeri.' },
    { icon: rainbowIcon, title: 'Legalisasi Pernikahan Sejenis', desc: 'Sejak 2017, Australia melegalkan same-sex marriage.' },
    { icon: loversIcon, title: 'Tren De Facto Tinggi', desc: 'Proporsi pasangan de facto tinggi di negara maju.' },
];

export default function Intro({ index }) {
    return (
        <Section 
            index={index} 
            bg="linear-gradient(135deg, #fff0f5 0%, #fde8ec 30%, #fef3e8 60%, #f0f5ff 100%)"
        >

            <FadeIn>
                <Divider />
                <p style={{
                    maxWidth: 580,
                    margin: '0 auto 36px',
                    color: '#9a7a7a',
                    lineHeight: 1.9,
                    fontSize: '1rem',
                    fontFamily: "'Lora', serif",
                    fontStyle: 'italic',
                    letterSpacing: '0.02em',
                    textAlign: 'center',
                }}>
                    Mengapa Australia? Negeri kanguru ini menyimpan cerita pernikahan yang menarik
                    dari tradisi, keberagaman, hingga perubahan sosial modern.
                </p>
            </FadeIn>

            {/* GRID */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 20,
                maxWidth: 800, // ✅ lebih lebar
                width: '100%',
                padding: '0 20px',
                margin: '0 auto',
                alignItems: 'stretch'
            }}>
                {reasons.map((r, i) => (
                    <FadeIn key={i} delay={i * 0.1}>
                        <div
                            style={{
                                background: 'rgba(255,255,255,0.75)',
                                backdropFilter: 'blur(12px)',
                                border: '1px solid rgba(242,196,206,0.6)',
                                borderRadius: 20,
                                padding: '24px 28px',
                                height: 200, // ✅ sedikit lebih tinggi biar balance
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                textAlign: 'left',
                                boxShadow: '0 8px 32px rgba(212,120,138,0.1), inset 0 1px 0 rgba(255,255,255,0.8)',
                                transition: 'transform 0.3s, box-shadow 0.3s',
                                cursor: 'default',
                                boxSizing: 'border-box',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)';
                                e.currentTarget.style.boxShadow = '0 16px 48px rgba(212,120,138,0.22), inset 0 1px 0 rgba(255,255,255,0.8)';

                                const img = e.currentTarget.querySelector('img');
                                if (img) img.style.transform = 'scale(1.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                e.currentTarget.style.boxShadow = '0 8px 32px rgba(212,120,138,0.1), inset 0 1px 0 rgba(255,255,255,0.8)';

                                const img = e.currentTarget.querySelector('img');
                                if (img) img.style.transform = 'scale(1)';
                            }}
                        >
                            {/* ICON */}
                            <div style={{ marginBottom: 12 }}>
                                <img 
                                    src={r.icon} 
                                    alt="icon"
                                    style={{ 
                                        width: 36, 
                                        height: 36, 
                                        objectFit: 'contain',
                                        transition: 'transform 0.3s'
                                    }} 
                                />
                            </div>

                            {/* TEXT */}
                            <div>
                                <h3 style={{
                                    fontFamily: "'Playfair Display', serif",
                                    fontSize: '1.05rem',
                                    color: colors.rose,
                                    marginBottom: 8
                                }}>
                                    {r.title}
                                </h3>

                                <p style={{
                                    fontSize: '0.85rem',
                                    color: '#888',
                                    lineHeight: 1.6
                                }}>
                                    {r.desc}
                                </p>
                            </div>
                        </div>
                    </FadeIn>
                ))}
            </div>

        </Section>
    );
}