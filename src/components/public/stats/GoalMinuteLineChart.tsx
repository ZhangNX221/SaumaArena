'use client';

import React, { useMemo } from 'react';
import { Activity } from 'lucide-react';
import { Match } from '@/types';
import { initialMatches } from '@/mocks/tournamentData';
import { usePersistentState } from '@/hooks/usePersistentState';

interface IntervalPoint {
  interval: string;
  phase: string;
  goals: number;
}

interface GoalMinuteLineChartProps {
  matches?: Match[];
}

export const GoalMinuteLineChart: React.FC<GoalMinuteLineChartProps> = ({ matches: matchesProp }) => {
  const [persistedMatches] = usePersistentState<Match[]>('sauma_arena_matches', initialMatches);
  const currentMatches = matchesProp || persistedMatches;

  const intervals: IntervalPoint[] = useMemo(() => {
    const goalEvents = currentMatches
      .flatMap((m) => m.events || [])
      .filter((e) => e.type === 'GOAL');

    let g1 = 0; // 01' - 05'
    let g2 = 0; // 06' - 10'
    let g3 = 0; // 11' - 15'
    let g4 = 0; // 16' - 20' / Crunch Time

    goalEvents.forEach((ev) => {
      const min = ev.minute || 1;
      if (min <= 5) g1 += 1;
      else if (min <= 10) g2 += 1;
      else if (min <= 15) g3 += 1;
      else g4 += 1;
    });

    return [
      { interval: "01' - 05'", phase: 'Babak 1 (Awal)', goals: g1 },
      { interval: "06' - 10'", phase: 'Babak 1 (Akhir)', goals: g2 },
      { interval: "11' - 15'", phase: 'Babak 2 (Awal)', goals: g3 },
      { interval: "16' - 20'", phase: 'Babak 2 (Crunch Time)', goals: g4 },
    ];
  }, [currentMatches]);

  const totalGoals = useMemo(() => intervals.reduce((acc, d) => acc + d.goals, 0), [intervals]);
  const highestInterval = useMemo(() => {
    return intervals.reduce((prev, cur) => (cur.goals > prev.goals ? cur : prev), intervals[0]);
  }, [intervals]);

  const maxGoals = Math.max(8, Math.ceil((highestInterval.goals + 2) / 4) * 4);
  const yTicks = [0, maxGoals * 0.25, maxGoals * 0.5, maxGoals * 0.75, maxGoals].map((v) => Math.round(v));

  const viewBoxWidth = 720;
  const viewBoxHeight = 280;
  const plotLeft = 60;
  const plotRight = 680;
  const plotTop = 40;
  const plotBottom = 210;
  const plotHeight = plotBottom - plotTop;
  const plotWidth = plotRight - plotLeft;

  const points = intervals.map((item, idx) => {
    const x = plotLeft + (idx / (intervals.length - 1)) * plotWidth;
    const y = plotBottom - (item.goals / maxGoals) * plotHeight;
    return { x, y, ...item };
  });

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ');
  const areaPolygonPoints = `${plotLeft},${plotBottom} ${polylinePoints} ${plotRight},${plotBottom}`;

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs space-y-3.5 h-full flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-2.5 border-b border-[var(--border-subtle)]">
        <div>
          <span className="text-[10px] font-barlow font-bold uppercase tracking-wider text-[var(--color-arena-primary)] block">
            Trend Line Chart &bull; Ritme Pertandingan
          </span>
          <h3 className="font-bebas text-base sm:text-lg text-[var(--text-main)] uppercase tracking-wide flex items-center gap-1.5 mt-0.5">
            <Activity className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="truncate">Distribusi Waktu &amp; Menit Terciptanya Gol</span>
          </h3>
        </div>
        <div className="text-left sm:text-right shrink-0">
          <span className="text-xs font-barlow font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            {totalGoals > 0 ? `Puncak: ${highestInterval.goals} Gol (${highestInterval.interval})` : 'Puncak: 0 Gol'}
          </span>
          <span className="text-[10px] text-[var(--text-muted)] block">
            {totalGoals > 0 ? `${totalGoals} Gol Terdistribusi` : 'Menunggu peristiwa gol tercatat'}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto w-full">
        <svg
          role="img"
          aria-labelledby="goal-timing-title goal-timing-desc"
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          className="w-full h-auto max-w-full font-sans select-none"
        >
          <title id="goal-timing-title">Distribusi Waktu Terjadinya Gol</title>
          <desc id="goal-timing-desc">
            Grafik garis tren menit gol futsal MMFC I ({totalGoals} gol tercatat).
          </desc>

          {/* Horizontal Gridlines */}
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
                  className="text-[var(--text-muted)] text-[9.5px] font-mono font-semibold"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {/* Subtle Area Fill under curve */}
          <polygon points={areaPolygonPoints} fill="var(--color-arena-accent)" opacity="0.12" />

          {/* Polyline Path */}
          <polyline
            points={polylinePoints}
            fill="none"
            stroke="var(--color-arena-accent)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Dots and Labels at each interval */}
          {points.map((p) => (
            <g key={p.interval} className="cursor-pointer">
              <line
                x1={p.x}
                y1={p.y}
                x2={p.x}
                y2={plotBottom}
                stroke="currentColor"
                className="text-[var(--border-subtle)] opacity-40"
                strokeDasharray="2,2"
              />
              <circle
                cx={p.x}
                cy={p.y}
                r="5"
                fill="var(--color-arena-accent)"
                stroke="var(--bg-surface)"
                strokeWidth="2"
              />
              <rect
                x={p.x - 18}
                y={p.y - 24}
                width="36"
                height="17"
                rx="4"
                fill="var(--bg-muted)"
                stroke="var(--border-subtle)"
                strokeWidth="1"
              />
              <text
                x={p.x}
                y={p.y - 12}
                textAnchor="middle"
                fill="currentColor"
                className="text-[10px] font-mono font-bold text-[var(--color-arena-accent)]"
              >
                {p.goals}
              </text>
              <text
                x={p.x}
                y={plotBottom + 16}
                textAnchor="middle"
                fill="currentColor"
                className="text-xs font-barlow font-bold text-[var(--text-main)]"
              >
                {p.interval}
              </text>
              <text
                x={p.x}
                y={plotBottom + 28}
                textAnchor="middle"
                fill="currentColor"
                className="text-[10px] font-sans text-[var(--text-muted)]"
              >
                {p.phase}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};
