import React, { useState, useEffect } from 'react';
import Intro from './Intro';
import Chapter1 from './Chapter1';
import Chapter2 from './Chapter2';
import Chapter3 from './Chapter3';
import Chapter4 from './Chapter4';
import Footer from './Footer';

export default function App() {
    const [activeSection, setActiveSection] = useState(0);

    useEffect(() => {
        const sections = document.querySelectorAll('section[data-index]');
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(e => {
                    if (e.isIntersecting) setActiveSection(Number(e.target.dataset.index));
                });
            },
            { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
        );
        sections.forEach(s => observer.observe(s));
        return () => observer.disconnect();
    }, []);

    const labels = ['Intro', 'Ch.1', 'Ch.2', 'Ch.3', 'Ch.4'];

    const accentColors = [
        '#d4788a',
        '#d4788a',
        '#4a9d5c',
        'rgb(255, 209, 247)',
        '#b483ff',
    ];

    const scrollTo = (i) => {
        document.querySelector(`section[data-index="${i}"]`)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <>
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
                <Footer />
            </div>
        </>
    );
}