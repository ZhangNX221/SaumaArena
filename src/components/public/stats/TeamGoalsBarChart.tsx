'use client';

import React, { useMemo } from 'react';
import { Trophy } from 'lucide-react';
import { Match, Team } from '@/types';
import { initialMatches, initialTeams } from '@/mocks/tournamentData';
import { usePersistentState } from '@/hooks/usePersistentState';

interface TeamGoalData {
  team: string;
  shortName: string;
  goals: number;
  matches: number;
  isFocal?: boolean;
}

interface TeamGoalsBarChartProps {
  matches?: Match[];
  teams?: Team[];
}

export const TeamGoalsBarChart: React.FC<TeamGoalsBarChartProps> = ({
  matches: matchesProp,
  teams: teamsProp,
}) => {
  const [persistedMatches] = usePersistentState<Match[]>('sauma_arena_matches', initialMatches);
  const [persistedTeams] = usePersistentState<Team[]>('sauma_arena_teams_v2', initialTeams);

  const currentMatches = matchesProp || persistedMatches;
  const currentTeams = teamsProp || persistedTeams;

  const data: TeamGoalData[] = useMemo(() => {
    const list = (currentTeams.length > 0 ? currentTeams : initialTeams).map((t) => {
      let goals = 0;
      let played = 0;
      currentMatches.forEach((m) => {
        if (m.status === 'COMPLETED' || m.status === 'LIVE') {
          if (m.teamAId === t.id || m.teamAName?.toLowerCase() === t.name?.toLowerCase()) {
            goals += Number(m.scoreA || 0);
            played += 1;
          } else if (m.teamBId === t.id || m.teamBName?.toLowerCase() === t.name?.toLowerCase()) {
            goals += Number(m.scoreB || 0);
            played += 1;
          }
        }
      });
      return {
        team: t.name,
        shortName: t.shortName || t.name.replace(/^(MI|MIN|UPT|SDI|SD)\s+/, '').slice(0, 14),
        goals,
        matches: played,
      };
    });

    const sorted = [...list].sort((a, b) => b.goals - a.goals || b.matches - a.matches).slice(0, 6);
    return sorted.map((item, idx) => ({
      ...item,
      isFocal: idx === 0 && item.goals > 0,
    }));
  }, [currentTeams, currentMatches]);

  const totalGoals = useMemo(() => data.reduce((acc, d) => acc + d.goals, 0), [data]);
  const totalMatches = useMemo(() => data.reduce((acc, d) => acc + d.matches, 0), [data]);
  const avgGoals = totalMatches > 0 ? (totalGoals / totalMatches).toFixed(2) : '0.00';

  const highestGoal = Math.max(...data.map((d) => d.goals), 0);
  const maxGoals = Math.max(8, Math.ceil((highestGoal + 2) / 4) * 4);
  const yTicks = [0, maxGoals * 0.25, maxGoals * 0.5, maxGoals * 0.75, maxGoals].map((v) => Math.round(v));

  const viewBoxWidth = 720;
  const viewBoxHeight = 300;
  const plotLeft = 60;
  const plotRight = 700;
  const plotTop = 35;
  const plotBottom = 230;
  const plotHeight = plotBottom - plotTop;
  const plotWidth = plotRight - plotLeft;

  const barCount = data.length || 1;
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
            Total {totalGoals} Gol Tercipta
          </span>
          <span className="text-[10px] text-[var(--text-muted)] block">Rata-rata {avgGoals} Gol/Laga</span>
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
            Grafik perbandingan total gol tim kontingen MMFC I ({totalGoals} gol tercipta).
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
          {data.map((item, idx) => {
            const barH = maxGoals > 0 ? (item.goals / maxGoals) * plotHeight : 0;
            const x = plotLeft + idx * colPitch + (colPitch - barWidth) / 2;
            const y = plotBottom - barH;

            return (
              <g key={item.team} className="group cursor-pointer">
                {/* Bar Body */}
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={Math.max(barH, 3)}
                  rx="4"
                  fill={item.isFocal ? 'var(--color-arena-accent)' : 'var(--color-arena-primary)'}
                  opacity={item.isFocal ? '0.95' : item.goals > 0 ? '0.65' : '0.25'}
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
                  {item.matches > 0 ? (item.goals / item.matches).toFixed(1) : '0.0'} gol/laga
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
            <rect x="0" y="-8" width="12" height="10" rx="2" fill="var(--color-arena-accent)" />
            <text x="18" y="0" fill="currentColor" className="text-[var(--text-main)] text-[10px] font-bold">
              Tim Tersubur (Top Goalscorer Leader)
            </text>

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
