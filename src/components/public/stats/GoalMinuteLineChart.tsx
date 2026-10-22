'use client';

import React from 'react';
import { Activity } from 'lucide-react';

interface IntervalPoint {
  interval: string;
  phase: string;
  goals: number;
}

const INTERVALS: IntervalPoint[] = [
  { interval: "01' - 10'", phase: 'Babak 1 (Awal)', goals: 8 },
  { interval: "11' - 20'", phase: 'Babak 1 (Akhir)', goals: 14 },
  { interval: "21' - 30'", phase: 'Babak 2 (Awal)', goals: 12 },
  { interval: "31' - 40'", phase: 'Babak 2 (Crunch Time)', goals: 21 },
];

export const GoalMinuteLineChart: React.FC = () => {
  const viewBoxWidth = 720;
  const viewBoxHeight = 280;
  const plotLeft = 60;
  const plotRight = 680;
  const plotTop = 40;
  const plotBottom = 210;
  const plotHeight = plotBottom - plotTop;
  const plotWidth = plotRight - plotLeft;
  const maxGoals = 25;

  const yTicks = [0, 5, 10, 15, 20, 25];

  const points = INTERVALS.map((item, idx) => {
    const x = plotLeft + (idx / (INTERVALS.length - 1)) * plotWidth;
    const y = plotBottom - (item.goals / maxGoals) * plotHeight;
    return { x, y, ...item };
  });

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ');
  const areaPolygonPoints = `${plotLeft},${plotBottom} ${polylinePoints} ${plotRight},${plotBottom}`;

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--border-subtle)]">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--color-arena-primary)] block">
            Trend Line Chart &bull; Ritme Pertandingan
          </span>
          <h3 className="font-black text-base text-[var(--text-main)] font-[var(--font-display)] flex items-center gap-2 mt-0.5">
            <Activity className="w-4 h-4 text-emerald-500" />
            <span>Distribusi Waktu &amp; Menit Terciptanya Gol</span>
          </h3>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
            Puncak: 21 Gol (Menit 31&apos; - 40&apos;)
          </span>
          <span className="text-[10px] text-[var(--text-muted)] block">38.2% Gol di Fase Akhir</span>
        </div>
      </div>

      <div className="overflow-x-auto w-full">
        <svg
          role="img"
          aria-labelledby="goal-timing-title goal-timing-desc"
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          className="w-full h-auto min-w-[560px] max-w-full font-sans select-none"
        >
          <title id="goal-timing-title">Distribusi Waktu Terjadinya Gol</title>
          <desc id="goal-timing-desc">
            Grafik garis tren menit gol futsal MMFC I, memperlihatkan intensitas gol melonjak di menit 31 hingga 40.
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
                  strokeWidth="1"
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
          <polygon
            points={areaPolygonPoints}
            fill="var(--color-arena-accent)"
            opacity="0.12"
          />

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
          {points.map((p, idx) => (
            <g key={p.interval} className="cursor-pointer">
              {/* Vertical Guide to X-axis */}
              <line
                x1={p.x}
                y1={p.y}
                x2={p.x}
                y2={plotBottom}
                stroke="currentColor"
                className="text-[var(--border-subtle)] opacity-40"
                strokeDasharray="2,2"
              />

              {/* Point Dot */}
              <circle
                cx={p.x}
                cy={p.y}
                r="5"
                fill="var(--color-arena-accent)"
                stroke="var(--bg-surface)"
                strokeWidth="2"
              />

              {/* Value Badge on top */}
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
                fill="var(--color-arena-accent)"
                className="text-[10px] font-mono font-black"
              >
                {p.goals}
              </text>

              {/* X-Axis Interval Label */}
              <text
                x={p.x}
                y={plotBottom + 18}
                textAnchor="middle"
                fill="currentColor"
                className="text-[var(--text-main)] text-[11px] font-mono font-bold"
              >
                {p.interval}
              </text>

              {/* Phase name */}
              <text
                x={p.x}
                y={plotBottom + 32}
                textAnchor="middle"
                fill="currentColor"
                className="text-[var(--text-muted)] text-[9px]"
              >
                {p.phase}
              </text>
            </g>
          ))}

          {/* Bottom Annotation */}
          <line
            x1={plotLeft}
            y1={255}
            x2={plotRight}
            y2={255}
            stroke="currentColor"
            className="text-[var(--border-subtle)] opacity-40"
            strokeWidth="1"
          />
          <text
            x={plotLeft}
            y={272}
            fill="currentColor"
            className="text-[var(--text-muted)] text-[10px] italic"
          >
            * Analisis Taktis: Tekanan fisik dan pergantian strategi 'flying goalkeeper' memicu lonjakan gol di kuarter akhir.
          </text>
        </svg>
      </div>
    </div>
  );
};
