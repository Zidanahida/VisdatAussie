import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { 
    Chart as ChartJS, 
    CategoryScale, 
    LinearScale, 
    PointElement, 
    LineElement, 
    BarElement, 
    Tooltip, 
    Legend, 
    Filler 
} from 'chart.js';
import { Section, Divider, ChapterLabel, ChartCard, StatBox, FadeIn, colors } from './shared';
import AustraliaMap from './AustraliaMap';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend, Filler);

const injectStyles = `
@keyframes morph {
    0% { border-radius: 40% 60% 60% 40% / 70% 30% 70% 30%; }
    100% { border-radius: 60% 40% 40% 60% / 30% 70% 30% 70%; }
}
@keyframes float-subtle {
    0% { transform: translateY(0px) translateX(0px); }
    50% { transform: translateY(-20px) translateX(10px); }
    100% { transform: translateY(0px) translateX(0px); }
}
.glass-card {
    background: rgba(255, 255, 255, 0.7) !important;
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.3) !important;
    box-shadow: 0 20px 40px rgba(0,0,0,0.04) !important;
}
`;

export default function Chapter2({ index }) {
    // Data Bulanan Nasional (Total: 116,522)
    const monthlyLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const monthlyData = [7386, 10028, 12859, 11832, 8854, 7284, 6318, 8869, 11006, 13050, 13739, 8297];

    const weeklyLabels = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
    const weeklyData = [6200, 7800, 8100, 9600, 21500, 54538, 11801];

    // Data Puncak Wilayah Berdasarkan Bulan Terbanyak (Peak Month)
    const regionalPeakData = {
        'NSW': { month: 'Oktober', count: 4684, season: 'Spring' },
        'VIC': { month: 'November', count: 3412, season: 'Spring' },
        'QLD': { month: 'Oktober', count: 2105, season: 'Spring' },
        'WA': { month: 'November', count: 1240, season: 'Spring' },
        'SA': { month: 'Maret', count: 820, season: 'Autumn' }, 
        'TAS': { month: 'Februari', count: 280, season: 'Summer' }, 
        'ACT': { month: 'Maret', count: 190, season: 'Autumn' }, 
        'NT': { month: 'Agustus', count: 97, season: 'Dry' }
    };

    // Skema Warna Berdasarkan Musim Puncak
    const seasonColors = {
        'Spring': colors.rose,  
        'Autumn': colors.gold,  
        'Summer': '#f9d5e5',    // Warna khusus untuk Tasmania (Februari)
        'Dry': colors.sage      
    };

    const storyTitleStyle = { 
        fontFamily: "'Caveat', cursive", 
        fontSize: 'clamp(2.4rem, 4vw, 3.4rem)', 
        color: colors.dark, 
        lineHeight: 1.1,
    };

    const storyTextStyle = { 
        fontSize: '1rem', 
        color: '#666', 
        lineHeight: 1.8, 
        marginBottom: 16 
    };

    const highlightText = (color = colors.rose) => ({
        color: color,
        fontWeight: 600
    });

    return (
        <Section index={index} bg="linear-gradient(150deg, #f2f8f0 0%, #eaf5e6 40%, #f8faf2 100%)">
            <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 1120, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 'clamp(80px, 12vw, 140px)' }}>
                
                {/* ROW 1: HEADER & STATS */}
                <FadeIn>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', alignItems: 'center' }}>
                        <div style={{ flex: 1.2, minWidth: 320 }}>
                            <ChapterLabel num={2} />
                            <Divider style={{ margin: '0 0 24px 0' }} />
                            <h3 style={storyTitleStyle}>Pernah kepo ga sih, kapan orang Aussie suka nikah</h3>
                            <p style={storyTextStyle}>
                                Pernikahan mungkin adalah keputusan yang paling personal bagi sepasang kekasih. Namun, di Australia, ribuan keputusan personal itu secara ajaib membentuk sebuah simfoni kolektif yang rapi. Ia bukan sekadar deretan angka di kalender, melainkan harmoni yang berdenyut mengikuti napas iklim benua ini.
                            </p>
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <StatBox num="240,338" label="Total Pernikahan di tahun 2024" color={colors.dark} /> 
                        </div>
                    </div>
                </FadeIn>

                {/* ROW 2: MONTHLY TRENDS */}
                <FadeIn delay={0.1}>
                    <div style={{ display: 'flex', flexWrap: 'wrap-reverse', gap: 'clamp(32px, 5vw, 60px)', alignItems: 'center' }}>
                        <div style={{ flex: 1.4, minWidth: 320 }}>
                            <ChartCard title="Irama Pernikahan Bulanan Nasional" style={{ borderTop: 'none' }}>
                                <Line 
                                    data={{
                                        labels: monthlyLabels,
                                        datasets: [{
                                            label: 'Total',
                                            data: monthlyData,
                                            borderColor: colors.rose,
                                            backgroundColor: 'rgba(212, 120, 138, 0.08)',
                                            fill: true,
                                            tension: 0.4,
                                            borderWidth: 3,
                                            pointRadius: 5,
                                            pointBackgroundColor: colors.rose
                                        }]
                                    }}
                                    options={{
                                        plugins: { legend: { display: false } },
                                        scales: {
                                            y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.03)' } },
                                            x: { grid: { display: false } }
                                        }
                                    }}
                                />
                            </ChartCard>
                        </div>
                        <div style={{ flex: 1, minWidth: 320 }}>
                            <h3 style={storyTitleStyle}>Mengejar "Sweet Spot"</h3>
                            <p style={storyTextStyle}>
                               Pernikahan di Australia bukan sekadar memilih angka, melainkan harmoni kolektif yang berdenyut mengikuti napas iklim benua. Pasangan melakukan dialog tak kasatmata dengan alam untuk mengejar <span style={highlightText()}>sweet spots</span> di <span style={highlightText()}>November</span> dan <span style={highlightText()}>Maret</span> disaat bunga bermekaran dan langit musim gugur yang stabil memberikan restu terbaik bagi hari bahagia mereka.
                            </p>

                            <p style={storyTextStyle}>
                                Sebaliknya, angka janji suci merosot ketika alam menunjukkan sisi ekstremnya. Panas menyengat di <span style={highlightText(colors.dark)}>Januari</span> dan dinginnya hujan di puncak musim dingin bulan <span style={highlightText(colors.dark)}>Juli</span> menjadi rintangan alam yang paling dihindari, memaksa langkah pasangan melambat demi menjaga kenyamanan perayaan di ruang terbuka.
                            </p>
                        </div>
                    </div>
                </FadeIn>

                {/* ROW 3: WEEKLY DOMINANCE */}
                <FadeIn delay={0.2}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(32px, 5vw, 60px)', alignItems: 'center' }}>
                        <div style={{ flex: 1, minWidth: 320 }}>
                            <h3 style={storyTitleStyle}>Sabtu Sang Penguasa</h3>
                            <p style={storyTextStyle}>
                                Jika iklim menentukan bulannya, maka tradisi sosial adalah penguasa mutlak harinya melalui dominasi hari <span style={highlightText()}>Sabtu</span> yang tak tertandingi. Dengan mencatatkan <span style={highlightText()}>54.538 pernikahan</span>, hari ini berdiri sebagai panggung utama yang menyerap hampir seluruh energi perayaan nasional, bahkan volumenya saja sanggup menandingi akumulasi gabungan pernikahan dari Senin hingga Kamis. 
                            </p>
                            <p style={storyTextStyle}>
                                Hal ini jadi bukti bahwa bagi masyarakat Australia, Sabtu bukan sekadar akhir pekan biasa, melainkan kesepakatan kolektif yang tak tergoyahkan untuk merayakan momen cinta yang paling sakral.
                            </p>
                        </div>
                        <div style={{ flex: 1.2, minWidth: 300 }}>
                            <ChartCard title="Distribusi Pernikahan Per Hari" style={{ borderTop: 'none' }}>
                                <Bar 
                                    data={{
                                        labels: weeklyLabels,
                                        datasets: [{
                                            data: weeklyData,
                                            backgroundColor: weeklyLabels.map(d => d === 'Sabtu' ? colors.rose : '#e0e0e0'),
                                            borderRadius: 6
                                        }]
                                    }}
                                    options={{
                                        plugins: { legend: { display: false } },
                                        scales: {
                                            y: { beginAtZero: true, ticks: { callback: v => (v/1000) + 'k' } },
                                            x: { grid: { display: false } }
                                        }
                                    }}
                                />
                            </ChartCard>
                        </div>
                    </div>
                </FadeIn>

                {/* ROW 4: REGIONAL STORYTELLING (Split Layout) */}
                <FadeIn delay={0.3}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(32px, 5vw, 60px)', alignItems: 'center' }}>
                        
                        {/* Sisi Kiri: Peta Australia */}
                        <div style={{ flex: 1, minWidth: 320 }}>
                            <ChartCard title="Peta Regional Australia: Frekuensi Pernikahan Terbanyak berdasarkan Hari" style={{ borderTop: 'none' }}>
                                <div style={{ width: '100%', maxWidth: '500px', margin: '0 auto' }}>
                                    <AustraliaMap 
                                        data={Object.fromEntries(Object.entries(regionalPeakData).map(([k, v]) => [k, v.count]))}
                                        colorScale={(val) => {
                                            const key = Object.keys(regionalPeakData).find(k => regionalPeakData[k].count === val);
                                            return seasonColors[regionalPeakData[key].season];
                                        }}
                                        unit="" 
                                    />
                                </div>
                                
                                {/* Custom Legend dengan Nama Musim & Bulan */}
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: 40, flexWrap: 'wrap' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: '#666' }}>
                                        <div style={{ width: 14, height: 14, background: colors.rose, borderRadius: 3 }} /> 
                                        Musim Semi (Sep - Nov)
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: '#666' }}>
                                        <div style={{ width: 14, height: 14, background: colors.gold, borderRadius: 3 }} /> 
                                        Musim Gugur (Mar - Mei)
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: '#666' }}>
                                        <div style={{ width: 14, height: 14, background: '#f9d5e5', borderRadius: 3 }} /> 
                                        Musim Panas (Des - Feb)
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: '#666' }}>
                                        <div style={{ width: 14, height: 14, background: colors.sage, borderRadius: 3 }} /> 
                                        Musim Kemarau (Mei - Okt)
                                    </div>
                                </div>
                            </ChartCard>
                        </div>

                        {/* Sisi Kanan: Narasi Regional */}
                        <div style={{ flex: 1.2, minWidth: 320 }}>
                            <h3 style={storyTitleStyle}>Beda Wilayah, Beda Waktu Bersemi</h3>
                            <p style={storyTextStyle}>
                                Dominasi <span style={highlightText()}>New South Wales</span> memuncak di <span style={highlightText()}>Oktober</span> dengan 4.684 pernikahan. Menariknya, wilayah <span style={highlightText('#f9d5e5')}>Tasmania</span> menjadi anomali yang puncaknya justru terjadi di bulan <span style={highlightText('#f9d5e5')}>Februari</span>, memanfaatkan sisa kehangatan musim panas.
                            </p>
                            <p style={storyTextStyle}>
                                Di sisi lain, ibu kota <span style={highlightText(colors.gold)}>ACT</span> dan <span style={highlightText(colors.gold)}>South Australia</span> lebih memilih pesona musim gugur di bulan <span style={highlightText(colors.gold)}>Maret</span>. Sementara di wilayah utara yang tropis seperti <span style={highlightText(colors.sage)}>Northern Territory</span>, pasangan justru memilih bulan <span style={highlightText(colors.sage)}>Agustus</span> saat cuaca cerah dan kering.
                            </p>
                            <p style={{ ...storyTextStyle, fontStyle: 'italic', fontSize: '0.9rem' }}>
                                "Setiap wilayah memiliki iklimnya sendiri untuk merayakan cinta."
                            </p>
                        </div>
                    </div>
                </FadeIn>

            </div>
        </Section>
    );
}