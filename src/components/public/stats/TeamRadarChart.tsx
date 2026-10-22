'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface RadarAxis {
  label: string;
  min1Score: number; // 0 - 10
  kaumanScore: number; // 0 - 10
}

const AXES: RadarAxis[] = [
  { label: 'Serangan', min1Score: 9.5, kaumanScore: 8.8 },
  { label: 'Pertahanan', min1Score: 7.8, kaumanScore: 9.2 },
  { label: 'Kedisiplinan', min1Score: 8.5, kaumanScore: 7.6 },
  { label: 'Efisiensi', min1Score: 9.2, kaumanScore: 8.0 },
  { label: 'Penguasaan', min1Score: 8.8, kaumanScore: 8.4 },
];

export const TeamRadarChart: React.FC = () => {
  const viewBoxWidth = 720;
  const viewBoxHeight = 330;
  const cx = 260;
  const cy = 160;
  const R = 110;
  const N = AXES.length;

  const getVertex = (i: number, fraction: number) => {
    const angle = -Math.PI / 2 + (2 * Math.PI * i) / N;
    const x = cx + fraction * R * Math.cos(angle);
    const y = cy + fraction * R * Math.sin(angle);
    return { x: Math.round(x), y: Math.round(y) };
  };

  const ringFractions = [0.2, 0.4, 0.6, 0.8, 1.0];

  const getPolygonPoints = (scores: number[]) => {
    return scores
      .map((score, i) => {
        const v = getVertex(i, score / 10);
        return `${v.x},${v.y}`;
      })
      .join(' ');
  };

  const min1Points = getPolygonPoints(AXES.map((a) => a.min1Score));
  const kaumanPoints = getPolygonPoints(AXES.map((a) => a.kaumanScore));

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--border-subtle)]">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--color-arena-primary)] block">
            Radar / Spider &bull; Analisis Head-to-Head
          </span>
          <h3 className="font-black text-base text-[var(--text-main)] font-[var(--font-display)] flex items-center gap-2 mt-0.5">
            <ShieldCheck className="w-4 h-4 text-[var(--color-arena-accent)]" />
            <span>Matriks Taktis Finalis: MIN 1 Malang vs SDN 1 Kauman</span>
          </h3>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono font-bold text-[var(--color-arena-accent)]">
            5 Dimensi Kinerja Taktis
          </span>
          <span className="text-[10px] text-[var(--text-muted)] block">Skala Normalisasi 0 – 10</span>
        </div>
      </div>

      <div className="overflow-x-auto w-full">
        <svg
          role="img"
          aria-labelledby="team-radar-title team-radar-desc"
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          className="w-full h-auto min-w-[580px] max-w-full font-sans select-none"
        >
          <title id="team-radar-title">Matriks Radar Kinerja MIN 1 Malang vs SDN 1 Kauman</title>
          <desc id="team-radar-desc">
            Diagram radar membandingkan kekuatan serangan, pertahanan, disiplin, efisiensi peluang, dan penguasaan bola.
          </desc>

          {/* Concentric Pentagon Rings */}
          {ringFractions.map((fraction, fIdx) => {
            const ringPoints = Array.from({ length: N })
              .map((_, i) => {
                const v = getVertex(i, fraction);
                return `${v.x},${v.y}`;
              })
              .join(' ');

            return (
              <polygon
                key={fIdx}
                points={ringPoints}
                fill="none"
                stroke="currentColor"
                className="text-[var(--border-subtle)]"
                opacity={fraction === 1.0 ? '0.45' : '0.2'}
                strokeWidth={fraction === 1.0 ? '1.5' : '1'}
                strokeDasharray={fraction === 1.0 ? undefined : '2,2'}
              />
            );
          })}

          {/* Spokes & Axis Labels */}
          {AXES.map((axis, i) => {
            const outer = getVertex(i, 1.0);
            const labelPos = getVertex(i, 1.22);
            const isTop = i === 0;

            let textAnchor: 'middle' | 'start' | 'end' = 'middle';
            if (labelPos.x > cx + 10) textAnchor = 'start';
            else if (labelPos.x < cx - 10) textAnchor = 'end';

            return (
              <g key={axis.label}>
                {/* Spoke line */}
                <line
                  x1={cx}
                  y1={cy}
                  x2={outer.x}
                  y2={outer.y}
                  stroke="currentColor"
                  className="text-[var(--border-subtle)] opacity-40"
                  strokeWidth="1"
                />

                {/* Axis label outside ring */}
                <text
                  x={labelPos.x}
                  y={labelPos.y + (isTop ? -2 : 4)}
                  textAnchor={textAnchor}
                  fill="currentColor"
                  className="text-[var(--text-main)] text-[10.5px] font-bold"
                >
                  {axis.label}
                </text>
              </g>
            );
          })}

          {/* Scale Ticks on Top Spoke Only (per type-radar.md convention) */}
          {[2, 4, 6, 8, 10].map((val) => {
            const v = getVertex(0, val / 10);
            return (
              <text
                key={val}
                x={cx - 7}
                y={v.y + 3}
                textAnchor="end"
                fill="currentColor"
                className="text-[var(--text-muted)] text-[8px] font-mono"
              >
                {val}
              </text>
            );
          })}

          {/* Secondary Series: SDN 1 Kauman (Blue stroke & fill) */}
          <polygon
            points={kaumanPoints}
            fill="var(--color-arena-primary)"
            opacity="0.14"
            stroke="var(--color-arena-primary)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* Focal Series: MIN 1 Malang (Gold Accent stroke & fill, vertex dots) */}
          <polygon
            points={min1Points}
            fill="var(--color-arena-accent)"
            opacity="0.22"
            stroke="var(--color-arena-accent)"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />

          {/* Focal Series Vertex Dots (Only focal carries dots per radar taste gate) */}
          {AXES.map((axis, i) => {
            const v = getVertex(i, axis.min1Score / 10);
            return (
              <circle
                key={i}
                cx={v.x}
                cy={v.y}
                r="4"
                fill="var(--color-arena-accent)"
                stroke="var(--bg-surface)"
                strokeWidth="1.5"
              />
            );
          })}

          {/* Right Side Stats Panel & Legend */}
          <g transform="translate(500, 50)">
            <rect
              x="0"
              y="0"
              width="200"
              height="220"
              rx="12"
              fill="var(--bg-muted)"
              opacity="0.5"
              stroke="var(--border-subtle)"
              strokeWidth="1"
            />

            <text x="16" y="24" fill="currentColor" className="text-[var(--text-muted)] text-[9.5px] font-mono uppercase tracking-wider font-bold">
              KOMPARASI TAKTIS
            </text>

            {/* MIN 1 Malang row */}
            <g transform="translate(16, 44)">
              <rect x="0" y="0" width="12" height="12" rx="2" fill="var(--color-arena-accent)" />
              <text x="18" y="10" fill="currentColor" className="text-[var(--text-main)] text-[11px] font-black">
                MIN 1 Kota Malang
              </text>
              <text x="18" y="24" fill="currentColor" className="text-[var(--text-muted)] text-[9px] font-mono">
                Agresivitas Serangan: 9.5/10
              </text>
            </g>

            {/* SDN 1 Kauman row */}
            <g transform="translate(16, 86)">
              <rect x="0" y="0" width="12" height="12" rx="2" fill="var(--color-arena-primary)" opacity="0.7" />
              <text x="18" y="10" fill="currentColor" className="text-[var(--text-main)] text-[11px] font-black">
                SDN 1 Kauman
              </text>
              <text x="18" y="24" fill="currentColor" className="text-[var(--text-muted)] text-[9px] font-mono">
                Kekuatan Bertahan: 9.2/10
              </text>
            </g>

            {/* Tactical Takeaway */}
            <line x1="16" y1="126" x2="184" y2="126" stroke="var(--border-subtle)" strokeWidth="1" />
            <text x="16" y="146" fill="currentColor" className="text-[var(--text-main)] text-[10px] font-bold">
              Kesimpulan Analis:
            </text>
            <text x="16" y="164" fill="currentColor" className="text-[var(--text-muted)] text-[9px]">
              MIN 1 unggul dalam konversi
            </text>
            <text x="16" y="178" fill="currentColor" className="text-[var(--text-muted)] text-[9px]">
              tembakan &amp; counter-attack,
            </text>
            <text x="16" y="192" fill="currentColor" className="text-[var(--text-muted)] text-[9px]">
              Kauman lebih solid di zona low block.
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
};
