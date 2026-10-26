'use client';

import React from 'react';
import { Trophy } from 'lucide-react';

interface TeamGoalData {
  team: string;
  shortName: string;
  goals: number;
  matches: number;
  isFocal?: boolean;
}

const DATA: TeamGoalData[] = [
  { team: 'SDN Percobaan 1', shortName: 'SDN Percobaan', goals: 16, matches: 3 },
  { team: 'MIN 1 Kota', shortName: 'MIN 1 Kota', goals: 15, matches: 3, isFocal: true },
  { team: 'MIN 2 Unggulan', shortName: 'MIN 2 Unggulan', goals: 15, matches: 3 },
  { team: 'MIS Darussalam', shortName: 'MIS Darussalam', goals: 14, matches: 3 },
  { team: 'MIS Al-Hidayah', shortName: 'MIS Al-Hidayah', goals: 12, matches: 3 },
  { team: 'SDN 2 Harapan', shortName: 'SDN 2 Harapan', goals: 8, matches: 3 },
];

export const TeamGoalsBarChart: React.FC = () => {
  const maxGoals = 16;
  const viewBoxWidth = 720;
  const viewBoxHeight = 300;
  const plotLeft = 60;
  const plotRight = 700;
  const plotTop = 35;
  const plotBottom = 230;
  const plotHeight = plotBottom - plotTop;
  const plotWidth = plotRight - plotLeft;

  const yTicks = [0, 4, 8, 12, 16];
  const barCount = DATA.length;
  const colPitch = plotWidth / barCount;
  const barWidth = 54;

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs space-y-3.5 h-full flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-2.5 border-b border-[var(--border-subtle)]">
        <div>
          <span className="text-[10px] font-barlow font-bold uppercase tracking-wider text-[var(--color-arena-primary)] block">
            Column Chart &bull; Produktivitas Tim
          </span>
          <h3 className="font-bebas text-base sm:text-lg text-[var(--text-main)] uppercase tracking-wide flex items-center gap-1.5 mt-0.5">
            <Trophy className="w-4 h-4 text-[var(--color-arena-accent)] shrink-0" />
            <span className="truncate">Distribusi Total Gol per Kontingen Sekolah</span>
          </h3>
        </div>
        <div className="text-left sm:text-right shrink-0">
          <span className="text-xs font-barlow font-bold uppercase tracking-wider text-[var(--color-arena-accent)]">
            Total 55 Gol Tercipta
          </span>
          <span className="text-[10px] text-[var(--text-muted)] block">Rata-rata 3.67 Gol/Laga</span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="overflow-x-auto w-full">
        <svg
          role="img"
          aria-labelledby="team-goals-title team-goals-desc"
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          className="w-full h-auto max-w-full font-sans select-none"
        >
          <title id="team-goals-title">Distribusi Gol Kontingen Turnamen</title>
          <desc id="team-goals-desc">
            Grafik perbandingan total gol tim kontingen MMFC I dengan MIN 1 Malang sebagai tim tersubur (14 gol).
          </desc>

          {/* Background Grid Lines & Y-Axis Labels */}
          {yTicks.map((tick) => {
            const y = plotBottom - (tick / maxGoals) * plotHeight;
            return (
              <g key={tick}>
                <line
                  x1={plotLeft}
                  y1={y}
                  x2={plotRight}
                  y2={y}
                  stroke="currentColor"
                  className="text-[var(--border-subtle)] opacity-40"
                  strokeWidth={tick === 0 ? '1.5' : '1'}
                  strokeDasharray={tick === 0 ? undefined : '3,3'}
                />
                <text
                  x={plotLeft - 10}
                  y={y + 3.5}
                  textAnchor="end"
                  fill="currentColor"
                  className="text-[var(--text-muted)] text-[10px] font-mono font-semibold"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {/* Y-Axis Label */}
          <text
            x={18}
            y={(plotTop + plotBottom) / 2}
            transform={`rotate(-90, 18, ${(plotTop + plotBottom) / 2})`}
            textAnchor="middle"
            fill="currentColor"
            className="text-[var(--text-faint)] text-[9px] font-mono uppercase tracking-widest font-bold"
          >
            Total Gol
          </text>

          {/* Bars */}
          {DATA.map((item, idx) => {
            const barH = (item.goals / maxGoals) * plotHeight;
            const x = plotLeft + idx * colPitch + (colPitch - barWidth) / 2;
            const y = plotBottom - barH;

            return (
              <g key={item.team} className="group cursor-pointer">
                {/* Bar Body */}
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barH}
                  rx="4"
                  fill={item.isFocal ? 'var(--color-arena-accent)' : 'var(--color-arena-primary)'}
                  opacity={item.isFocal ? '0.95' : '0.45'}
                  stroke={item.isFocal ? 'var(--color-arena-accent)' : 'var(--color-arena-primary)'}
                  strokeWidth="1.5"
                  className="transition-all duration-200 group-hover:opacity-100"
                />

                {/* Value Label above Bar */}
                <text
                  x={x + barWidth / 2}
                  y={y - 8}
                  textAnchor="middle"
                  fill={item.isFocal ? 'var(--color-arena-accent)' : 'var(--text-main)'}
                  className="text-base font-teko font-bold tracking-wide"
                >
                  {item.goals}
                </text>

                {/* Team Name below X-Axis */}
                <text
                  x={x + barWidth / 2}
                  y={plotBottom + 16}
                  textAnchor="middle"
                  fill="currentColor"
                  className="text-[var(--text-main)] text-xs font-barlow font-bold tracking-wide"
                >
                  {item.shortName}
                </text>

                {/* Sub-label: Match average */}
                <text
                  x={x + barWidth / 2}
                  y={plotBottom + 30}
                  textAnchor="middle"
                  fill="currentColor"
                  className="text-[var(--text-muted)] text-[10px] font-barlow"
                >
                  {(item.goals / item.matches).toFixed(1)} gol/laga
                </text>
              </g>
            );
          })}

          {/* Legend Bottom Strip */}
          <line
            x1={plotLeft}
            y1={270}
            x2={plotRight}
            y2={270}
            stroke="currentColor"
            className="text-[var(--border-subtle)] opacity-40"
            strokeWidth="1"
          />
          <g transform="translate(60, 288)">
            {/* Focal Legend Item */}
            <rect x="0" y="-8" width="12" height="10" rx="2" fill="var(--color-arena-accent)" />
            <text x="18" y="0" fill="currentColor" className="text-[var(--text-main)] text-[10px] font-bold">
              Tim Tersubur (Top Goalscorer Leader)
            </text>

            {/* Standard Item */}
            <rect
              x="260"
              y="-8"
              width="12"
              height="10"
              rx="2"
              fill="var(--color-arena-primary)"
              opacity="0.5"
            />
            <text x="278" y="0" fill="currentColor" className="text-[var(--text-muted)] text-[10px] font-medium">
              Kontingen Peserta
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
};
