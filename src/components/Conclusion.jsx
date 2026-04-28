import React, { useRef, useState, useEffect } from 'react';
import { colors, Section } from './shared';

function useInView(threshold = 0.3) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) setVisible(true); },
            { threshold }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [threshold]);
    return [ref, visible];
}

const lines = [
    { delay: 0.1, text: 'Jadi apakah pernikahan masih relevan di era modern?' },
    { delay: 0.4, text: 'Data tidak menjawab itu secara langsung. Yang ia tunjukkan adalah bahwa pernikahan terus berubah bentuknya — siapa yang menikah, kapan, dengan siapa, dan apakah perlu menikah sama sekali, semua itu terus bergeser dari satu sensus ke sensus berikutnya.' },
    { delay: 0.8, text: 'Dan mungkin itulah justru jawabannya. Pernikahan tidak mati. Ia hanya terus mendefinisikan ulang dirinya sendiri, mengikuti cara manusia mendefinisikan ulang komitmen.' },
    { delay: 1.2, text: 'Angka-angka di atas adalah fotonya. Cerita di baliknya masih terus berjalan.' },
];

export default function Conclusion({ index }) {
    const [containerRef, containerVisible] = useInView(0.2);

    return (
        <Section
            index={index}
            bg="linear-gradient(150deg, #fffaf7 0%, #fef3e8 40%, #f5f9ff 100%)"
            style={{ justifyContent: 'center', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}
        >
            {/* Background dekoratif */}
            <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden',
            }}>
                {/* Lingkaran besar blur kiri */}
                <div style={{
                    position: 'absolute', width: 500, height: 500,
                    borderRadius: '50%', top: '-10%', left: '-10%',
                    background: 'radial-gradient(circle, rgba(212,120,138,0.12) 0%, transparent 70%)',
                }} />
                {/* Lingkaran blur kanan bawah */}
                <div style={{
                    position: 'absolute', width: 400, height: 400,
                    borderRadius: '50%', bottom: '-5%', right: '-5%',
                    background: 'radial-gradient(circle, rgba(180,131,255,0.1) 0%, transparent 70%)',
                }} />
                {/* Garis horisontal dekoratif */}
                <div style={{
                    position: 'absolute', top: '50%', left: '5%', right: '5%',
                    height: 1, background: 'linear-gradient(to right, transparent, rgba(212,120,138,0.15), transparent)',
                }} />
            </div>

            <div
                ref={containerRef}
                style={{
                    maxWidth: 720, width: '100%', zIndex: 1,
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    textAlign: 'center', gap: 0, padding: 'clamp(16px, 4vw, 40px)',
                }}
            >
                {/* Label atas */}
                <div style={{
                    opacity: containerVisible ? 1 : 0,
                    transform: containerVisible ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'opacity 0.6s ease 0s, transform 0.6s ease 0s',
                    fontSize: '0.7rem', letterSpacing: 4,
                    textTransform: 'uppercase', color: colors.rose,
                    marginBottom: 20,
                }}>
                    Penutup
                </div>

                {/* Judul besar */}
                <div style={{
                    opacity: containerVisible ? 1 : 0,
                    transform: containerVisible ? 'translateY(0)' : 'translateY(24px)',
                    transition: 'opacity 0.7s ease 0.05s, transform 0.7s ease 0.05s',
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 'clamp(2rem, 5vw, 3.6rem)',
                    color: colors.rose,
                    lineHeight: 1.2,
                    marginBottom: 12,
                    fontStyle: 'italic',
                }}>
                    Masih Terus Berjalan
                </div>

                {/* Divider ornamen */}
                <div style={{
                    opacity: containerVisible ? 1 : 0,
                    transition: 'opacity 0.6s ease 0.1s',
                    display: 'flex', alignItems: 'center', gap: 12,
                    marginBottom: 40,
                }}>
                    <div style={{ width: 40, height: 1, background: colors.rose, opacity: 0.4 }} />
                    <span style={{ fontSize: '1rem', opacity: 0.7 }}>💍</span>
                    <div style={{ width: 40, height: 1, background: colors.rose, opacity: 0.4 }} />
                </div>

                {/* Paragraf teks */}
                {lines.map((line, i) => (
                    <div
                        key={i}
                        style={{
                            opacity: containerVisible ? 1 : 0,
                            transform: containerVisible ? 'translateY(0)' : 'translateY(20px)',
                            transition: `opacity 0.7s ease ${line.delay}s, transform 0.7s ease ${line.delay}s`,
                            marginBottom: i === 0 ? 32 : 24,
                            width: '100%',
                        }}
                    >
                        {i === 0 ? (
                            // Kalimat pembuka — besar & italic
                            <p style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
                                color: colors.rose,
                                lineHeight: 1.6,
                                fontStyle: 'italic',
                                margin: 0,
                            }}>
                                "{line.text}"
                            </p>
                        ) : i === lines.length - 1 ? (
                            // Kalimat penutup — highlighted
                            <p style={{
                                fontSize: 'clamp(0.85rem, 1.8vw, 1rem)',
                                color: colors.gold,
                                lineHeight: 1.8,
                                margin: 0,
                                fontStyle: 'italic',
                                opacity: 0.9,
                            }}>
                                — {line.text}
                            </p>
                        ) : (
                            // Paragraf biasa
                            <p style={{
                                fontSize: 'clamp(0.9rem, 1.8vw, 1.05rem)',
                                color: '#5a5a5a',
                                lineHeight: 1.9,
                                margin: 0,
                            }}>
                                {line.text}
                            </p>
                        )}
                    </div>
                ))}

                {/* Divider bawah */}
                <div style={{
                    opacity: containerVisible ? 1 : 0,
                    transition: 'opacity 0.6s ease 1.6s',
                    width: 1, height: 48,
                    background: 'linear-gradient(to bottom, rgba(212,120,138,0.2), transparent)',
                    marginTop: 20,
                }} />
            </div>
        </Section>
    );
}