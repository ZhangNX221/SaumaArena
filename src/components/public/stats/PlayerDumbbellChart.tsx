'use client';

import React from 'react';
import { Award } from 'lucide-react';

interface PlayerStat {
  name: string;
  team: string;
  goals: number;
  assists: number;
}

const PLAYERS: PlayerStat[] = [
  { name: 'Rizky Aditya', team: 'MIN 1 Kota Malang', goals: 7, assists: 3 },
  { name: 'Dimas Arya', team: 'SDN 1 Kauman', goals: 6, assists: 2 },
  { name: 'Kevin Pratama', team: 'SDIT Insan Permata', goals: 5, assists: 4 },
  { name: 'Farhan Malik', team: 'SDK Cor Jesu', goals: 4, assists: 3 },
  { name: 'Arkan Ziyad', team: 'SDI Surya Buana', goals: 4, assists: 2 },
  { name: 'Bima Sena', team: 'SDN Model Malang', goals: 3, assists: 3 },
];

export const PlayerDumbbellChart: React.FC = () => {
  const viewBoxWidth = 720;
  const viewBoxHeight = 320;
  const plotLeft = 190;
  const plotRight = 680;
  const plotTop = 45;
  const rowPitch = 38;
  const scaleMax = 8;
  const plotWidth = plotRight - plotLeft;

  const getX = (val: number) => plotLeft + (val / scaleMax) * plotWidth;

  const ticks = [0, 2, 4, 6, 8];

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--border-subtle)]">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--color-arena-primary)] block">
            Dumbbell Chart &bull; Kontribusi Pemain
          </span>
          <h3 className="font-black text-base text-[var(--text-main)] font-[var(--font-display)] flex items-center gap-2 mt-0.5">
            <Award className="w-4 h-4 text-[var(--color-arena-accent)]" />
            <span>Perbandingan Gol vs Assist Pemain Bintang</span>
          </h3>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono font-bold text-[var(--text-main)]">
            Skala 0 – 8 Kontribusi
          </span>
          <span className="text-[10px] text-[var(--text-muted)] block">Urutan: Total Gol Tertinggi</span>
        </div>
      </div>

      <div className="overflow-x-auto w-full">
        <svg
          role="img"
          aria-labelledby="player-stats-title player-stats-desc"
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          className="w-full h-auto min-w-[560px] max-w-full font-sans select-none"
        >
          <title id="player-stats-title">Dumbbell Chart Gol vs Assist Pemain</title>
          <desc id="player-stats-desc">
            Visualisasi perbandingan pencapaian Gol (lingkaran padat emas) dan Assist (lingkaran biru) untuk 6 pemain teratas.
          </desc>

          {/* Gridlines vertical */}
          {ticks.map((tick) => {
            const x = getX(tick);
            return (
              <g key={tick}>
                <line
                  x1={x}
                  y1={plotTop - 10}
                  x2={x}
                  y2={plotTop + PLAYERS.length * rowPitch}
                  stroke="currentColor"
                  className="text-[var(--border-subtle)] opacity-40"
                  strokeWidth="1"
                  strokeDasharray={tick === 0 ? undefined : '3,3'}
                />
                <text
                  x={x}
                  y={plotTop + PLAYERS.length * rowPitch + 16}
                  textAnchor="middle"
                  fill="currentColor"
                  className="text-[var(--text-muted)] text-[9px] font-mono font-semibold"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {/* Rows */}
          {PLAYERS.map((player, idx) => {
            const y = plotTop + idx * rowPitch + 14;
            const xGoals = getX(player.goals);
            const xAssists = getX(player.assists);
            const xMin = Math.min(xGoals, xAssists);
            const xMax = Math.max(xGoals, xAssists);

            return (
              <g key={player.name} className="group cursor-pointer">
                {/* Row Hover Background */}
                <rect
                  x={10}
                  y={y - 14}
                  width={viewBoxWidth - 20}
                  height={rowPitch}
                  fill="currentColor"
                  className="text-[var(--bg-muted)] opacity-0 group-hover:opacity-40 transition-opacity"
                  rx="6"
                />

                {/* Player Name & Team (Left Gutters) */}
                <text
                  x={plotLeft - 16}
                  y={y - 1}
                  textAnchor="end"
                  fill="currentColor"
                  className="text-[var(--text-main)] text-[11px] font-bold"
                >
                  {player.name}
                </text>
                <text
                  x={plotLeft - 16}
                  y={y + 11}
                  textAnchor="end"
                  fill="currentColor"
                  className="text-[var(--text-muted)] text-[8.5px] font-mono"
                >
                  {player.team}
                </text>

                {/* Connecting Line between Assists & Goals */}
                <line
                  x1={xMin}
                  y1={y}
                  x2={xMax}
                  y2={y}
                  stroke="currentColor"
                  className="text-[var(--text-main)] opacity-40"
                  strokeWidth="1.5"
                />

                {/* Assist Dot (Hollow, Blue border) */}
                <circle
                  cx={xAssists}
                  cy={y}
                  r="5.5"
                  fill="var(--bg-surface)"
                  stroke="var(--color-arena-primary)"
                  strokeWidth="2"
                />

                {/* Goal Dot (Solid, Gold Accent) */}
                <circle
                  cx={xGoals}
                  cy={y}
                  r="6.5"
                  fill="var(--color-arena-accent)"
                  stroke="var(--text-main)"
                  strokeWidth="1"
                />

                {/* Labels outside dots */}
                <text
                  x={xGoals + (xGoals >= xAssists ? 10 : -10)}
                  y={y + 3.5}
                  textAnchor={xGoals >= xAssists ? 'start' : 'end'}
                  fill="var(--color-arena-accent)"
                  className="text-[10px] font-mono font-black"
                >
                  {player.goals}G
                </text>
                <text
                  x={xAssists + (xAssists <= xGoals ? -10 : 10)}
                  y={y + 3.5}
                  textAnchor={xAssists <= xGoals ? 'end' : 'start'}
                  fill="var(--color-arena-primary)"
                  className="text-[10px] font-mono font-bold"
                >
                  {player.assists}A
                </text>
              </g>
            );
          })}

          {/* Legend Bottom Strip */}
          <line
            x1={plotLeft}
            y1={285}
            x2={plotRight}
            y2={285}
            stroke="currentColor"
            className="text-[var(--border-subtle)] opacity-40"
            strokeWidth="1"
          />
          <g transform="translate(190, 305)">
            {/* Goal marker */}
            <circle cx="6" cy="-3" r="5" fill="var(--color-arena-accent)" stroke="var(--text-main)" strokeWidth="1" />
            <text x="18" y="0" fill="currentColor" className="text-[var(--text-main)] text-[10px] font-bold">
              Gol Tercipta (Focal Accent)
            </text>

            {/* Assist marker */}
            <circle
              cx="180"
              cy="-3"
              r="4.5"
              fill="var(--bg-surface)"
              stroke="var(--color-arena-primary)"
              strokeWidth="2"
            />
            <text x="192" y="0" fill="currentColor" className="text-[var(--text-muted)] text-[10px] font-medium">
              Assist (Umpan Gol)
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
};
