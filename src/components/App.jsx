import React, { useState, useEffect } from 'react';
import Intro from './Intro';
import Chapter1 from './Chapter1';
import Chapter2 from './Chapter2';
import Chapter3 from './Chapter3';
import Chapter4 from './Chapter4';
import Conclusion from './Conclusion';
import Footer from './Footer';


export default function App() {
    const [activeSection, setActiveSection] = useState(0);


    useEffect(() => {
        const sections = document.querySelectorAll('section[data-index]');
        const visibleSet = new Set();

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(e => {
                    const idx = Number(e.target.dataset.index);
                    if (e.isIntersecting) visibleSet.add(idx);
                    else visibleSet.delete(idx);
                });

                if (visibleSet.size > 0) {
                    setActiveSection(Math.min(...visibleSet));
                }
            },
            { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
        );

        sections.forEach(s => observer.observe(s));

        // ✅ Fallback: deteksi saat scroll sudah sampai paling bawah
        const handleScroll = () => {
            const scrollBottom = window.innerHeight + window.scrollY;
            const pageHeight = document.documentElement.scrollHeight;

            if (scrollBottom >= pageHeight - 80) {
                // Ambil index tertinggi dari semua section yang ada
                const allIndexes = Array.from(sections).map(s => Number(s.dataset.index));
                const maxIndex = Math.max(...allIndexes);
                setActiveSection(maxIndex);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            observer.disconnect();
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);


    const labels = ['Intro', 'Ch.1', 'Ch.2', 'Ch.3', 'Ch.4', 'Akhir'];

    const navLabels = [
        { short: 'Intro', full: 'Intro' },
        { short: 'Ch.1', full: 'Chapter 1: Usia Menikah' },
        { short: 'Ch.2', full: 'Chapter 2: Waktu Menikah' },
        { short: 'Ch.3', full: 'Chapter 3: De Facto' },
        { short: 'Ch.4', full: 'Chapter 4: Same-Sex' },
        { short: 'Akhir', full: 'Kesimpulan' },
    ];

    const accentColors = [
        '#d4788a',
        '#d4788a',
        '#4a9d5c',
        'rgb(255, 209, 247)',
        '#b483ff',
        '#c9a84c',
    ];

    const scrollTo = (i) => {
        document.querySelector(`section[data-index="${i}"]`)?.scrollIntoView({ behavior: 'smooth' });
    };


    return (
        <>
            {/* TOP-RIGHT NAVBAR */}
            <nav style={{
                position: 'fixed',
                top: 16,
                right: 48,
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: 'rgba(255, 250, 247, 0.45)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                borderRadius: 24,
                padding: '6px 14px',
                boxShadow: 'none',
                border: '1px solid rgba(255,255,255,0.3)',
            }}>
                {navLabels.map((item, i) => {
                    const isActive = activeSection === i;
                    return (
                        <button
                            key={i}
                            onClick={() => scrollTo(i)}
                            title={item.full}
                            style={{
                                background: isActive ? accentColors[i] : 'transparent',
                                border: `1.5px solid ${isActive ? accentColors[i] : 'transparent'}`,
                                color: isActive ? '#fff' : '#7a5c5c',
                                padding: '4px 12px',
                                borderRadius: 16,
                                cursor: 'pointer',
                                fontSize: '0.75rem',
                                fontFamily: "'Lato', sans-serif",
                                fontWeight: isActive ? 700 : 400,
                                letterSpacing: 0.3,
                                transition: 'all 0.25s ease',
                                whiteSpace: 'nowrap',
                            }}
                            onMouseEnter={e => {
                                if (!isActive) {
                                    e.currentTarget.style.background = 'rgba(0,0,0,0.05)';
                                    e.currentTarget.style.color = '#3d2b2b';
                                }
                            }}
                            onMouseLeave={e => {
                                if (!isActive) {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.color = '#7a5c5c';
                                }
                            }}
                        >
                            {item.short}
                        </button>
                    );
                })}
            </nav>

            {/* DOT NAVIGATION */}
            <nav style={{
                position: 'fixed', right: 20, top: '50%', transform: 'translateY(-50%)',
                zIndex: 1000,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
            }}>
                {labels.map((lbl, i) => {
                    const isActive = activeSection === i;
                    return (
                        <button
                            key={i}
                            onClick={() => scrollTo(i)}
                            title={lbl}
                            style={{
                                width: isActive ? 10 : 7,
                                height: isActive ? 10 : 7,
                                borderRadius: '50%',
                                border: `2px solid ${isActive ? accentColors[i] : 'rgba(0,0,0,0.18)'}`,
                                background: isActive ? accentColors[i] : 'transparent',
                                cursor: 'pointer',
                                padding: 0,
                                transition: 'all 0.3s ease',
                                display: 'block',
                            }}
                        />
                    );
                })}
            </nav>

            <div style={{
                fontFamily: "'Lato', sans-serif",
                background: '#fffaf7',
                color: '#3d2b2b',
                overflowX: 'hidden',
            }}>
                <Intro index={0} />
                <Chapter1 index={1} />
                <Chapter2 index={2} />
                <Chapter3 index={3} />
                <Chapter4 index={4} />
                <Conclusion index={5} />
                <Footer />
            </div>
        </>
    );
}