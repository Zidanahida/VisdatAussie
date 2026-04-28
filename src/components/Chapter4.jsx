import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { Section, Divider, ChapterLabel, ChartCard, FadeIn, colors } from './shared';

// Heatmap color scale based on same-sex count (light → dark purple)
function heatColor(val, min, max) {
    const t = (val - min) / (max - min);
    const r = Math.round(237 - (237 - 80) * t);
    const g = Math.round(220 - (220 - 40) * t);
    const b = Math.round(255 - (255 - 160) * t);
    return `rgb(${r},${g},${b})`;
}

const nameToKey = {
    'New South Wales': 'NSW',
    'Victoria': 'VIC',
    'Queensland': 'QLD',
    'South Australia': 'SA',
    'Western Australia': 'WA',
    'Tasmania': 'TAS',
    'Northern Territory': 'NT',
    'Australian Capital Territory': 'ACT',
};

function useData4() {
    const [data, setData] = useState(null);
    useEffect(() => {
        fetch('/data4.xlsx')
            .then(r => r.arrayBuffer())
            .then(buf => {
                const wb = XLSX.read(buf, { type: 'array' });
                const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1 });
                // rows 3–10 = state data (0-indexed), col 0=name, col 5=same-sex count, col 7=total couples count
                const result = {};
                rows.slice(3, 11).forEach(r => {
                    const key = nameToKey[r[0]];
                    if (key) result[key] = { sameSex: r[5], total: r[7] };
                });
                setData(result);
            });
    }, []);
    return data;
}

function makeProjection(features, width, height, padding = 20) {
    let minLon = Infinity, maxLon = -Infinity, minLat = Infinity, maxLat = -Infinity;
    const eachCoord = (coords) => {
        if (typeof coords[0] === 'number') {
            if (coords[0] < minLon) minLon = coords[0];
            if (coords[0] > maxLon) maxLon = coords[0];
            if (coords[1] < minLat) minLat = coords[1];
            if (coords[1] > maxLat) maxLat = coords[1];
        } else coords.forEach(eachCoord);
    };
    features.forEach(f => {
        if (f.geometry.type === 'Polygon') eachCoord(f.geometry.coordinates);
        else if (f.geometry.type === 'MultiPolygon') f.geometry.coordinates.forEach(p => eachCoord(p));
    });

    const scaleX = (width - padding * 2) / (maxLon - minLon);
    const scaleY = (height - padding * 2) / (maxLat - minLat);
    const scale = Math.min(scaleX, scaleY);

    // Hitung sisa ruang untuk centering
    const mapW = (maxLon - minLon) * scale;
    const mapH = (maxLat - minLat) * scale;
    const offsetX = (width - mapW) / 2;
    const offsetY = (height - mapH) / 2;

    return ([lon, lat]) => [
        offsetX + (lon - minLon) * scale + 30,
        height - offsetY - (lat - minLat) * scale + 10,
    ];
}

function ringToPath(ring, project) {
    return ring.map((c, i) => { const [x, y] = project(c); return `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`; }).join(' ') + ' Z';
}

function featureToPath(feature, project) {
    const geom = feature.geometry;
    const parts = [];
    if (geom.type === 'Polygon') geom.coordinates.forEach(r => parts.push(ringToPath(r, project)));
    else if (geom.type === 'MultiPolygon') geom.coordinates.forEach(p => p.forEach(r => parts.push(ringToPath(r, project))));
    return parts.join(' ');
}

function getCentroid(feature, project) {
    const geom = feature.geometry;
    const polygons = geom.type === 'Polygon' ? [geom.coordinates] : geom.type === 'MultiPolygon' ? geom.coordinates : [];
    let bestCx = 0, bestCy = 0, bestArea = -1;
    polygons.forEach(poly => {
        const pts = poly[0].map(project);
        const n = pts.length;
        let area = 0, cx = 0, cy = 0;
        for (let i = 0, j = n - 1; i < n; j = i++) {
            const cross = pts[j][0] * pts[i][1] - pts[i][0] * pts[j][1];
            area += cross; cx += (pts[j][0] + pts[i][0]) * cross; cy += (pts[j][1] + pts[i][1]) * cross;
        }
        area /= 2;
        if (Math.abs(area) > bestArea) { bestArea = Math.abs(area); bestCx = cx / (6 * area); bestCy = cy / (6 * area); }
    });
    return [bestCx, bestCy];
}

const W = 600, H = 500;

function AustraliaMapChart({ data }) {
    const [geo, setGeo] = useState(null);
    const [hovered, setHovered] = useState(null);
    const [mouse, setMouse] = useState({ x: 0, y: 0 });

    useEffect(() => {
        fetch('/australian-states.min.geojson').then(r => r.json()).then(setGeo);
    }, []);

    if (!geo) return <div style={{ textAlign: 'center', padding: 40, color: '#aaa' }}>Memuat peta…</div>;

    const project = makeProjection(geo.features, W, H);
    const sameSexValues = Object.values(data).map(d => d.sameSex);
    const minVal = Math.min(...sameSexValues);
    const maxVal = Math.max(...sameSexValues);

    return (
        <div style={{ width: '100%' }}>
            <svg
                viewBox={`0 0 ${W} ${H}`}
                style={{ width: '100%', filter: 'drop-shadow(0 6px 24px rgba(0,0,0,0.13))' }}
                onMouseLeave={() => setHovered(null)}
            >
                {geo.features.map(feature => {
                    const key = nameToKey[feature.properties.STATE_NAME];
                    const val = key ? data[key] : undefined;
                    const fill = key && data[key] ? heatColor(data[key].sameSex, minVal, maxVal) : '#ddd';
                    const isHov = hovered === key;
                    const [cx, cy] = getCentroid(feature, project);

                    return (
                        <g key={feature.id}>
                            <path
                                d={featureToPath(feature, project)}
                                fill={fill}
                                stroke="white"
                                strokeWidth={isHov ? 2 : 0.8}
                                strokeLinejoin="round"
                                style={{ cursor: 'pointer', filter: isHov ? 'brightness(0.82) drop-shadow(0 2px 8px rgba(0,0,0,0.3))' : 'brightness(1)', transition: 'filter 0.18s' }}
                                onMouseMove={e => {
                                    const rect = e.currentTarget.closest('svg').getBoundingClientRect();
                                    setMouse({ x: (e.clientX - rect.left) / rect.width * W, y: (e.clientY - rect.top) / rect.height * H });
                                    setHovered(key);
                                }}
                            />
                            {key && val && (
                                <text x={cx} y={cy} textAnchor="middle"
                                    style={{ fontSize: key === 'ACT' ? '8px' : '13px', fontWeight: 700, fill: 'white', pointerEvents: 'none', paintOrder: 'stroke', stroke: 'rgba(0,0,0,0.4)', strokeWidth: '3px' }}>
                                    {key}
                                </text>
                            )}
                        </g>
                    );
                })}

                {hovered && data[hovered] && (() => {
                    const tx = Math.min(Math.max(mouse.x, 120), W - 120);
                    const ty = Math.max(mouse.y - 20, 70);
                    const label = Object.entries(nameToKey).find(([, v]) => v === hovered)?.[0] || hovered;
                    const { sameSex, total } = data[hovered];
                    return (
                        <g style={{ pointerEvents: 'none' }}>
                            <rect x={tx - 115} y={ty - 68} width={230} height={72} rx={10} fill="rgba(20,10,10,0.88)" />
                            <text x={tx} y={ty - 48} textAnchor="middle" style={{ fontSize: '11px', fill: '#f2c4ce', fontWeight: 700 }}>{label}</text>
                            <text x={tx} y={ty - 30} textAnchor="middle" style={{ fontSize: '12px', fill: 'white' }}>
                                Same-Sex: {sameSex.toLocaleString()}
                            </text>
                            <text x={tx} y={ty - 10} textAnchor="middle" style={{ fontSize: '12px', fill: '#c9a84c' }}>
                                Total Couples: {total.toLocaleString()}
                            </text>
                        </g>
                    );
                })()}
            </svg>

            {/* Heatmap legend */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, justifyContent: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: '#888' }}>Sedikit</span>
                <div style={{ width: 160, height: 12, borderRadius: 6, background: `linear-gradient(to right, ${heatColor(minVal, minVal, maxVal)}, ${heatColor(maxVal, minVal, maxVal)})` }} />
                <span style={{ fontSize: '0.72rem', color: '#888' }}>Banyak</span>
            </div>
        </div>
    );
}

function BgDecor() {
    return (
        <>
            <style>{`
                @keyframes floatDiamond { 0%,100%{transform:rotate(45deg) translate(0,0)} 50%{transform:rotate(45deg) translate(15px,-20px)} }
                @keyframes gradientShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
            `}</style>
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(-45deg, #f7f5ff, #ede8f5, #fce4ec, #e8f5e9)', backgroundSize: '400% 400%', animation: 'gradientShift 15s ease infinite', opacity: 0.6 }} />
            {[{ size: 60, top: '10%', left: '5%', color: 'rgba(180,120,220,0.15)', dur: '8s' }, { size: 40, top: '70%', left: '85%', color: 'rgba(212,120,138,0.15)', dur: '11s' }, { size: 80, top: '40%', left: '90%', color: 'rgba(100,149,237,0.1)', dur: '14s' }].map((d, i) => (
                <div key={i} style={{ position: 'absolute', width: d.size, height: d.size, top: d.top, left: d.left, background: d.color, transform: 'rotate(45deg)', animation: `floatDiamond ${d.dur} ease-in-out infinite`, animationDelay: `${i * 1.5}s`, pointerEvents: 'none', borderRadius: 4 }} />
            ))}
        </>
    );
}

// SVG person icon
function PersonIcon({ color, size = 48 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
            <circle cx="12" cy="7" r="4" />
            <path d="M12 13c-5 0-8 2.5-8 4v1h16v-1c0-1.5-3-4-8-4z" />
        </svg>
    );
}

function SameSexIllustration() {
    return (
        <div style={{
            background: 'white', borderRadius: 20, padding: '24px 32px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
            maxWidth: 600, width: '100%', boxSizing: 'border-box', textAlign: 'center',
        }}>
            {/* Same-sex */}
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', color: '#3d2b2b', marginBottom: 6 }}>
                Dari 10 Pasangan Same-Sex...
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#9a7a9a', marginBottom: 12, lineHeight: 1.6 }}>
                Hanya <strong style={{ color: '#b07cc6' }}>2</strong> memilih menikah resmi, <strong style={{ color: '#bbb' }}>8</strong> memilih de facto.
            </p>
            <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                {Array.from({ length: 10 }).map((_, i) => <PersonIcon key={i} color={i < 2 ? '#b07cc6' : '#ccc'} size={40} />)}
            </div>

            <div style={{ width: '100%', height: 1, background: '#f0f0f0', margin: '20px 0' }} />

            {/* Different-sex */}
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', color: '#3d2b2b', marginBottom: 6 }}>
                Dari 10 Pasangan Different-Sex...
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#9a7a9a', marginBottom: 12, lineHeight: 1.6 }}>
                Sebanyak <strong style={{ color: '#b07cc6' }}>8</strong> memilih menikah resmi, hanya <strong style={{ color: '#bbb' }}>2</strong> memilih de facto.
            </p>
            <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                {Array.from({ length: 10 }).map((_, i) => <PersonIcon key={i} color={i < 8 ? '#b07cc6' : '#ccc'} size={40} />)}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.72rem', color: '#b07cc6', fontWeight: 600 }}>
                    <PersonIcon color="#b07cc6" size={14} /> Menikah
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.72rem', color: '#bbb', fontWeight: 600 }}>
                    <PersonIcon color="#ccc" size={14} /> De Facto
                </div>
            </div>
            <p style={{ fontSize: '0.72rem', color: '#aaa', marginTop: 10 }}>Sumber: ABS Census 2021</p>
        </div>
    );
}


export default function Chapter4({ index }) {
    const data4 = useData4();

    return (
        <Section index={index} bg="#f0eeff">
            <BgDecor />
            <div style={{ position: 'relative', zIndex: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <FadeIn>
                    <ChapterLabel num={4} title="🏳️‍🌈 Pernikahan Same-Sex & Keberagaman" />
                    <Divider />
                    <p style={{ fontSize: '0.95rem', color: '#7a6a8a', maxWidth: 600, textAlign: 'center', marginBottom: 36, lineHeight: 1.8 }}>
                        Sejak dilegalkan pada Desember 2017, pernikahan same-sex terus meningkat.
                        Berikut sebaran pasangan same-sex dan total pasangan per negara bagian berdasarkan Sensus 2021.
                    </p>
                </FadeIn>

                {!data4 ? (
                    <div style={{ color: '#aaa' }}>Memuat data...</div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, width: '100%', maxWidth: 600 }}>
                        <FadeIn delay={0.1}>
                            <ChartCard title="Sebaran Same-Sex Couples & Total Couples per Negara Bagian (2021)" style={{ maxWidth: 600, width: '100%', paddingTop: 12 }}>
                                <div style={{ marginTop: -8 }}>
                                    <AustraliaMapChart data={data4} />
                                </div>
                                <p style={{ fontSize: '0.75rem', color: '#aaa', textAlign: 'center', marginTop: 10 }}>
                                    Hover tiap wilayah untuk melihat detail · Sumber: ABS Census 2021
                                </p>
                            </ChartCard>
                        </FadeIn>

                        <FadeIn delay={0.2}>
                            <SameSexIllustration />
                        </FadeIn>

                    </div>
                )}
            </div>
        </Section>
    );
}