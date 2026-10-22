'use client';

import React from 'react';
import { ShieldAlert } from 'lucide-react';

interface TeamDiscipline {
  team: string;
  yellow: number;
  red: number;
  fairPlayScore: number; // 100 is best
}

const DISCIPLINE_DATA: TeamDiscipline[] = [
  { team: 'SDIT Bina Insani', yellow: 1, red: 0, fairPlayScore: 98 },
  { team: 'MIS Al-Hidayah', yellow: 1, red: 0, fairPlayScore: 97 },
  { team: 'MIN 1 Kota', yellow: 2, red: 0, fairPlayScore: 94 },
  { team: 'SDN Percobaan 1', yellow: 2, red: 0, fairPlayScore: 92 },
  { team: 'MIN 2 Unggulan', yellow: 3, red: 0, fairPlayScore: 89 },
  { team: "MI Ma'arif Nurul Ulum", yellow: 3, red: 1, fairPlayScore: 81 },
];

export const DisciplineFairPlayChart: React.FC = () => {
  const viewBoxWidth = 720;
  const viewBoxHeight = 290;
  const plotLeft = 180;
  const plotRight = 620;
  const plotTop = 40;
  const rowPitch = 36;
  const plotWidth = plotRight - plotLeft;

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--border-subtle)]">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
            Horizontal Bar &bull; Fair Play &amp; Disiplin
          </span>
          <h3 className="font-black text-base text-[var(--text-main)] font-[var(--font-display)] flex items-center gap-2 mt-0.5">
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            <span>Indeks Fair Play &amp; Rekapitulasi Kartu Tim</span>
          </h3>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
            Penghargaan Fair Play Tim Terbaik
          </span>
          <span className="text-[10px] text-[var(--text-muted)] block">SDIT Insan Permata Memimpin (98 Poin)</span>
        </div>
      </div>

      <div className="overflow-x-auto w-full">
        <svg
          role="img"
          aria-labelledby="discipline-chart-title discipline-chart-desc"
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          className="w-full h-auto min-w-[560px] max-w-full font-sans select-none"
        >
          <title id="discipline-chart-title">Indeks Fair Play dan Kartu Disiplin</title>
          <desc id="discipline-chart-desc">
            Grafik batang horizontal perbandingan skor Fair Play dan jumlah kartu pelanggaran tiap tim kontingen.
          </desc>

          {/* Scale Axis Line and Ticks */}
          {[0, 25, 50, 75, 100].map((tick) => {
            const x = plotLeft + (tick / 100) * plotWidth;
            return (
              <g key={tick}>
                <line
                  x1={x}
                  y1={plotTop - 10}
                  x2={x}
                  y2={plotTop + DISCIPLINE_DATA.length * rowPitch}
                  stroke="currentColor"
                  className="text-[var(--border-subtle)] opacity-40"
                  strokeWidth="1"
                  strokeDasharray={tick === 0 ? undefined : '3,3'}
                />
                <text
                  x={x}
                  y={plotTop + DISCIPLINE_DATA.length * rowPitch + 16}
                  textAnchor="middle"
                  fill="currentColor"
                  className="text-[var(--text-muted)] text-[9px] font-mono font-semibold"
                >
                  {tick}%
                </text>
              </g>
            );
          })}

          {/* Rows */}
          {DISCIPLINE_DATA.map((item, idx) => {
            const y = plotTop + idx * rowPitch + 10;
            const barW = (item.fairPlayScore / 100) * plotWidth;

            return (
              <g key={item.team} className="group cursor-pointer">
                {/* Team label */}
                <text
                  x={plotLeft - 14}
                  y={y + 5}
                  textAnchor="end"
                  fill="currentColor"
                  className="text-[var(--text-main)] text-[11px] font-bold"
                >
                  {item.team}
                </text>

                {/* Track Background */}
                <rect
                  x={plotLeft}
                  y={y - 8}
                  width={plotWidth}
                  height="16"
                  rx="4"
                  fill="var(--bg-muted)"
                  opacity="0.4"
                />

                {/* Fair Play Score Bar */}
                <rect
                  x={plotLeft}
                  y={y - 8}
                  width={barW}
                  height="16"
                  rx="4"
                  fill={item.fairPlayScore >= 95 ? 'var(--color-arena-accent)' : 'var(--color-arena-primary)'}
                  opacity={item.fairPlayScore >= 95 ? '0.9' : '0.6'}
                  className="transition-all duration-200 group-hover:opacity-100"
                />

                {/* Score Label inside or at end */}
                <text
                  x={plotLeft + barW - 8}
                  y={y + 4}
                  textAnchor="end"
                  fill="#ffffff"
                  className="text-[9.5px] font-mono font-black select-none"
                >
                  {item.fairPlayScore}
                </text>

                {/* Badges on right side: Yellow & Red cards */}
                <g transform={`translate(${plotRight + 16}, ${y - 8})`}>
                  {/* Yellow Card count */}
                  <rect x="0" y="0" width="28" height="16" rx="3" fill="#f59e0b" opacity="0.15" stroke="#f59e0b" strokeWidth="1" />
                  <text x="14" y="11" textAnchor="middle" fill="#d97706" className="text-[9px] font-mono font-black">
                    {item.yellow} 🟨
                  </text>

                  {/* Red Card count */}
                  {item.red > 0 ? (
                    <g transform="translate(34, 0)">
                      <rect x="0" y="0" width="28" height="16" rx="3" fill="#ef4444" opacity="0.15" stroke="#ef4444" strokeWidth="1" />
                      <text x="14" y="11" textAnchor="middle" fill="#dc2626" className="text-[9px] font-mono font-black">
                        {item.red} 🟥
                      </text>
                    </g>
                  ) : (
                    <g transform="translate(34, 0)">
                      <text x="14" y="11" textAnchor="middle" fill="currentColor" className="text-[var(--text-faint)] text-[9px] font-mono">
                        0 🟥
                      </text>
                    </g>
                  )}
                </g>
              </g>
            );
          })}

          {/* Legend Bottom Strip */}
          <line
            x1={plotLeft}
            y1={260}
            x2={plotRight + 70}
            y2={260}
            stroke="currentColor"
            className="text-[var(--border-subtle)] opacity-40"
            strokeWidth="1"
          />
          <g transform="translate(180, 278)">
            <rect x="0" y="-8" width="12" height="10" rx="2" fill="var(--color-arena-accent)" />
            <text x="18" y="0" fill="currentColor" className="text-[var(--text-main)] text-[10px] font-bold">
              Fair Play Unggulan (≥95 Poin)
            </text>

            <rect x="200" y="-8" width="12" height="10" rx="2" fill="var(--color-arena-primary)" opacity="0.6" />
            <text x="218" y="0" fill="currentColor" className="text-[var(--text-muted)] text-[10px] font-medium">
              Fair Play Terjaga
            </text>

            <text x="360" y="0" fill="currentColor" className="text-[var(--text-muted)] text-[10px] font-mono">
              *Pengurangan: -2 poin per kartu kuning, -5 poin per kartu merah
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
};
