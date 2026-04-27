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
            { threshold: 0.5 }
        );
        sections.forEach(s => observer.observe(s));
        return () => observer.disconnect();
    }, []);

    const labels = ['Intro', 'Ch.1', 'Ch.2', 'Ch.3', 'Ch.4'];

    const scrollTo = (i) => {
        document.querySelector(`section[data-index="${i}"]`)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <>
            {/* Floating nav dots — di luar wrapper agar tidak pengaruhi layout */}
            <nav style={{
                position: 'fixed', right: 16, top: '50%', transform: 'translateY(-50%)',
                zIndex: 1000, display: 'flex', flexDirection: 'column', gap: 10,
                pointerEvents: 'none',
            }}>
                {labels.map((lbl, i) => (
                    <button
                        key={i}
                        onClick={() => scrollTo(i)}
                        title={lbl}
                        style={{
                            width: 12, height: 12, borderRadius: '50%', border: 'none', cursor: 'pointer',
                            background: activeSection === i ? '#d4788a' : '#ddd',
                            transition: 'all 0.3s',
                            transform: activeSection === i ? 'scale(1.4)' : 'scale(1)',
                            pointerEvents: 'auto',
                        }}
                    />
                ))}
            </nav>

            <div style={{ fontFamily: "'Lato', sans-serif", background: '#fffaf7', color: '#3d2b2b' }}>
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
