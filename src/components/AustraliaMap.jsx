import React, { useState, useEffect } from 'react';

// Map STATE_NAME from GeoJSON to our data keys
const nameToKey = {
    'New South Wales':    'NSW',
    'Victoria':           'VIC',
    'Queensland':         'QLD',
    'South Australia':    'SA',
    'Western Australia':  'WA',
    'Tasmania':           'TAS',
    'Northern Territory': 'NT',
    'Australian Capital Territory': 'ACT',
};

// Project [lon, lat] → [x, y] using simple equirectangular within a viewBox
function makeProjection(features, width, height, padding = 20) {
    let minLon = Infinity, maxLon = -Infinity;
    let minLat = Infinity, maxLat = -Infinity;

    const eachCoord = (coords) => {
        if (typeof coords[0] === 'number') {
            const [lon, lat] = coords;
            if (lon < minLon) minLon = lon;
            if (lon > maxLon) maxLon = lon;
            if (lat < minLat) minLat = lat;
            if (lat > maxLat) maxLat = lat;
        } else {
            coords.forEach(eachCoord);
        }
    };

    features.forEach(f => {
        const geom = f.geometry;
        if (geom.type === 'Polygon') eachCoord(geom.coordinates);
        else if (geom.type === 'MultiPolygon') geom.coordinates.forEach(p => eachCoord(p));
    });

    const scaleX = (width  - padding * 2) / (maxLon - minLon);
    const scaleY = (height - padding * 2) / (maxLat - minLat);
    const scale  = Math.min(scaleX, scaleY);

    return ([lon, lat]) => [
        padding + (lon - minLon) * scale,
        height - padding - (lat - minLat) * scale,   // flip Y (lat increases upward)
    ];
};

// Convert a ring of coordinates to an SVG path string
function ringToPath(ring, project) {
    return ring.map((coord, i) => {
        const [x, y] = project(coord);
        return `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`;
    }).join(' ') + ' Z';
}

// Build full SVG path string for a feature (Polygon or MultiPolygon)
function featureToPath(feature, project) {
    const geom = feature.geometry;
    const parts = [];

    if (geom.type === 'Polygon') {
        geom.coordinates.forEach(ring => parts.push(ringToPath(ring, project)));
    } else if (geom.type === 'MultiPolygon') {
        geom.coordinates.forEach(polygon =>
            polygon.forEach(ring => parts.push(ringToPath(ring, project)))
        );
    }
    return parts.join(' ');
}

// Compute true polygon centroid using the shoelace / area-weighted formula
function ringCentroid(ring, project) {
    let area = 0, cx = 0, cy = 0;
    const pts = ring.map(project);
    const n = pts.length;
    for (let i = 0, j = n - 1; i < n; j = i++) {
        const cross = pts[j][0] * pts[i][1] - pts[i][0] * pts[j][1];
        area += cross;
        cx   += (pts[j][0] + pts[i][0]) * cross;
        cy   += (pts[j][1] + pts[i][1]) * cross;
    }
    area /= 2;
    if (Math.abs(area) < 1e-10) {
        // degenerate — fall back to mean
        const mx = pts.reduce((s, p) => s + p[0], 0) / n;
        const my = pts.reduce((s, p) => s + p[1], 0) / n;
        return { cx: mx, cy: my, area: 0 };
    }
    return { cx: cx / (6 * area), cy: cy / (6 * area), area: Math.abs(area) };
}

function getCentroid(feature, project) {
    const geom = feature.geometry;
    let polygons = [];

    if (geom.type === 'Polygon') {
        polygons = [geom.coordinates];
    } else if (geom.type === 'MultiPolygon') {
        polygons = geom.coordinates;
    }

    // Pick the polygon with the largest projected area
    let bestCx = 0, bestCy = 0, bestArea = -1;
    polygons.forEach(poly => {
        const outer = poly[0];
        if (!outer || outer.length < 3) return;
        const { cx, cy, area } = ringCentroid(outer, project);
        if (area > bestArea) { bestArea = area; bestCx = cx; bestCy = cy; }
    });
    return [bestCx, bestCy];
}

const W = 600, H = 700;

export default function AustraliaMap({ data, colorScale, unit = '%', title }) {
    const [geo, setGeo]       = useState(null);
    const [hovered, setHovered] = useState(null);
    const [mouse, setMouse]   = useState({ x: 0, y: 0 });

    useEffect(() => {
        fetch('/australian-states.min.geojson')
            .then(r => r.json())
            .then(setGeo)
            .catch(console.error);
    }, []);

    if (!geo) return (
        <div style={{ textAlign: 'center', padding: 40, color: '#aaa' }}>Memuat peta…</div>
    );

    const project = makeProjection(geo.features, W, H);

    return (
        <div style={{ width: '100%', maxWidth: 480 }}>
            {title && (
                <h3 style={{
                    fontFamily: "'Playfair Display', serif", fontSize: '1rem',
                    color: '#3d2b2b', marginBottom: 12, textAlign: 'center',
                }}>{title}</h3>
            )}

            <svg
                viewBox={`0 0 ${W} ${H}`}
                style={{ width: '100%', filter: 'drop-shadow(0 6px 24px rgba(0,0,0,0.13))' }}
                onMouseLeave={() => setHovered(null)}
            >
                {geo.features.map((feature) => {
                    const stateName = feature.properties.STATE_NAME;
                    const key  = nameToKey[stateName];
                    const val  = key !== undefined ? data[key] : undefined;
                    const fill = val !== undefined ? colorScale(val) : '#ccc';
                    const isHov = hovered === key;
                    const d = featureToPath(feature, project);
                    const [cx, cy] = getCentroid(feature, project);

                    return (
                        <g key={feature.id}>
                            <path
                                d={d}
                                fill={fill}
                                stroke="white"
                                strokeWidth={isHov ? 2 : 0.8}
                                strokeLinejoin="round"
                                style={{
                                    cursor: 'pointer',
                                    filter: isHov
                                        ? 'brightness(0.78) drop-shadow(0 2px 8px rgba(0,0,0,0.3))'
                                        : 'brightness(1)',
                                    transition: 'filter 0.18s',
                                }}
                                onMouseMove={e => {
                                    const rect = e.currentTarget.closest('svg').getBoundingClientRect();
                                    setMouse({
                                        x: (e.clientX - rect.left) / rect.width  * W,
                                        y: (e.clientY - rect.top)  / rect.height * H,
                                    });
                                    setHovered(key);
                                }}
                            />
                            {/* Label — skip tiny/undefined regions */}
                            {key && val !== undefined && (
                                <>
                                    <text x={cx} y={cy - 6} textAnchor="middle"
                                        style={{
                                            fontSize: key === 'ACT' ? '8px' : key === 'TAS' ? '11px' : '13px',
                                            fontWeight: 700, fill: 'white', pointerEvents: 'none',
                                            paintOrder: 'stroke', stroke: 'rgba(0,0,0,0.4)', strokeWidth: '3px',
                                        }}>
                                        {key}
                                    </text>
                                    <text x={cx} y={cy + 10} textAnchor="middle"
                                        style={{
                                            fontSize: key === 'ACT' ? '7px' : key === 'TAS' ? '10px' : '12px',
                                            fill: 'rgba(255,255,255,0.95)', pointerEvents: 'none',
                                            paintOrder: 'stroke', stroke: 'rgba(0,0,0,0.3)', strokeWidth: '2.5px',
                                        }}>
                                        {val}{unit}
                                    </text>
                                </>
                            )}
                        </g>
                    );
                })}

                {/* Tooltip */}
                {hovered && data[hovered] !== undefined && (() => {
                    const tx = Math.min(Math.max(mouse.x, 100), W - 100);
                    const ty = Math.max(mouse.y - 20, 60);
                    const label = Object.entries(nameToKey).find(([, v]) => v === hovered)?.[0] || hovered;
                    return (
                        <g style={{ pointerEvents: 'none' }}>
                            <rect x={tx - 95} y={ty - 50} width={190} height={52}
                                rx={10} fill="rgba(20,10,10,0.88)" />
                            <text x={tx} y={ty - 28} textAnchor="middle"
                                style={{ fontSize: '12px', fill: '#f2c4ce', fontWeight: 700 }}>
                                {label}
                            </text>
                            <text x={tx} y={ty - 10} textAnchor="middle"
                                style={{ fontSize: '14px', fill: 'white', fontWeight: 600 }}>
                                {data[hovered]}{unit}
                            </text>
                        </g>
                    );
                })()}
            </svg>

            {/* Legend */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                {Object.entries(data)
                    .sort((a, b) => b[1] - a[1])
                    .map(([key, val]) => (
                        <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.72rem', color: '#666' }}>
                            <div style={{ width: 11, height: 11, borderRadius: 3, background: colorScale(val), flexShrink: 0 }} />
                            <span>{key}: {val}{unit}</span>
                        </div>
                    ))}
            </div>
        </div>
    );
}
