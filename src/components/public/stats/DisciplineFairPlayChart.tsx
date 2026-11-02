'use client';

import React, { useState, useMemo } from 'react';
import { ShieldAlert, ListFilter } from 'lucide-react';
import { Match, Team, FlattenedAthlete, STORAGE_KEY_MASTER_ATHLETES, STORAGE_KEY_TEAMS } from '@/types';
import { initialMatches, initialTeams } from '@/mocks/tournamentData';
import { usePersistentState } from '@/hooks/usePersistentState';

interface TeamDiscipline {
  id: string;
  team: string;
  fullName: string;
  yellow: number;
  red: number;
  fairPlayScore: number;
}

interface DisciplineFairPlayChartProps {
  matches?: Match[];
  teams?: Team[];
  athletes?: FlattenedAthlete[];
}

export const DisciplineFairPlayChart: React.FC<DisciplineFairPlayChartProps> = ({
  matches: matchesProp,
  teams: teamsProp,
  athletes: athletesProp,
}) => {
  const [persistedMatches] = usePersistentState<Match[]>('sauma_arena_matches', initialMatches);
  const [persistedTeams] = usePersistentState<Team[]>(STORAGE_KEY_TEAMS, initialTeams);
  const [persistedAthletes] = usePersistentState<FlattenedAthlete[]>(STORAGE_KEY_MASTER_ATHLETES, []);

  const [showAllTeams, setShowAllTeams] = useState(false);

  const currentMatches = matchesProp && matchesProp.length > 0 ? matchesProp : persistedMatches;
  const currentTeams = teamsProp && teamsProp.length > 0 ? teamsProp : persistedTeams;
  const currentAthletes =
    athletesProp && athletesProp.length > 0
      ? athletesProp
      : persistedAthletes && persistedAthletes.length > 0
      ? persistedAthletes
      : [];

  // Hitung data kedisiplinan dan indeks fair play dari semua sumber (Atlet Juri, Pemain Tim, Match Events)
  const allDisciplineData: TeamDiscipline[] = useMemo(() => {
    const list = (currentTeams.length > 0 ? currentTeams : initialTeams).map((t) => {
      // Akumulasi kartu dari data atlet juri, pemain tim, dan kejadian laga
      const athleteYellow = currentAthletes
        .filter((a) => a.teamId === t.id || (a.teamName && a.teamName.toLowerCase() === t.name.toLowerCase()))
        .reduce((sum, a) => sum + Number(a.yellowCards || 0), 0);

      const athleteRed = currentAthletes
        .filter((a) => a.teamId === t.id || (a.teamName && a.teamName.toLowerCase() === t.name.toLowerCase()))
        .reduce((sum, a) => sum + Number(a.redCards || 0), 0);

      const playerYellow = (t.players || []).reduce((sum, p) => sum + Number(p.yellowCards || 0), 0);
      const playerRed = (t.players || []).reduce((sum, p) => sum + Number(p.redCards || 0), 0);

      const matchYellow = currentMatches.reduce((sum, m) => {
        return (
          sum +
          (m.events || []).filter((e) => {
            if (e.type !== 'YELLOW_CARD') return false;
            return (
              e.teamId === t.id ||
              (m.teamAId === t.id && (e.teamId === 'A' || e.playerName?.includes('Tim A'))) ||
              (m.teamBId === t.id && (e.teamId === 'B' || e.playerName?.includes('Tim B'))) ||
              (e.playerName && e.playerName.toLowerCase().includes(t.name.toLowerCase()))
            );
          }).length
        );
      }, 0);

      const matchRed = currentMatches.reduce((sum, m) => {
        return (
          sum +
          (m.events || []).filter((e) => {
            if (e.type !== 'RED_CARD') return false;
            return (
              e.teamId === t.id ||
              (m.teamAId === t.id && (e.teamId === 'A' || e.playerName?.includes('Tim A'))) ||
              (m.teamBId === t.id && (e.teamId === 'B' || e.playerName?.includes('Tim B'))) ||
              (e.playerName && e.playerName.toLowerCase().includes(t.name.toLowerCase()))
            );
          }).length
        );
      }, 0);

      // Agregasi gabungan: gunakan nilai maksimal dari ketiga sumber
      const yellow = Math.max(athleteYellow, playerYellow, matchYellow);
      const red = Math.max(athleteRed, playerRed, matchRed);
      const fairPlayScore = Math.max(0, 100 - yellow * 2 - red * 5);

      return {
        id: t.id,
        team: t.shortName || t.name.replace(/^(MI|MIN|UPT|SDI|SD)\s+/, '').slice(0, 16),
        fullName: t.name,
        yellow,
        red,
        fairPlayScore,
      };
    });

    // Urutkan berdasarkan Skor Fair Play tertinggi, lalu jumlah pelanggaran paling minim
    return [...list].sort((a, b) => {
      if (b.fairPlayScore !== a.fairPlayScore) return b.fairPlayScore - a.fairPlayScore;
      if (a.yellow + a.red !== b.yellow + b.red) return a.yellow + a.red - (b.yellow + b.red);
      return a.team.localeCompare(b.team);
    });
  }, [currentTeams, currentMatches, currentAthletes]);

  // Total kartu seluruh turnamen dari seluruh tim
  const totalYellow = useMemo(
    () => allDisciplineData.reduce((acc, d) => acc + d.yellow, 0),
    [allDisciplineData]
  );
  const totalRed = useMemo(
    () => allDisciplineData.reduce((acc, d) => acc + d.red, 0),
    [allDisciplineData]
  );

  // Tim yang ditampilkan (Top 6 atau Semua Tim)
  const displayedData = useMemo(() => {
    if (showAllTeams) return allDisciplineData;
    return allDisciplineData.slice(0, 6);
  }, [allDisciplineData, showAllTeams]);

  // Dimensi SVG responsif dan dinamis berdasarkan jumlah baris
  const viewBoxWidth = 720;
  const plotLeft = 180;
  const plotRight = 620;
  const plotTop = 38;
  const rowPitch = 36;
  const plotWidth = plotRight - plotLeft;
  const totalRowsHeight = displayedData.length * rowPitch;
  const legendY = plotTop + totalRowsHeight + 20;
  const viewBoxHeight = legendY + 36;

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
            Horizontal Bar &bull; Fair Play &amp; Disiplin
          </span>
          <h3 className="font-black text-base text-[var(--text-main)] font-[var(--font-display)] flex items-center gap-2 mt-0.5">
            <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Indeks Fair Play &amp; Rekapitulasi Kartu Tim</span>
          </h3>
        </div>

        <div className="flex items-center sm:justify-end gap-3">
          <button
            type="button"
            onClick={() => setShowAllTeams((prev) => !prev)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-[var(--bg-muted)] hover:bg-[var(--border-subtle)] text-[var(--text-main)] transition-colors border border-[var(--border-subtle)] cursor-pointer"
            title="Ganti tampilan tim"
          >
            <ListFilter className="w-3.5 h-3.5 text-amber-500" />
            <span>{showAllTeams ? 'Tampilkan 6 Tim' : `Semua Tim (${allDisciplineData.length})`}</span>
          </button>

          <div className="text-right">
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 block">
              Penghargaan Fair Play Tim
            </span>
            <span className="text-[10px] text-[var(--text-muted)] font-mono block">
              {totalYellow === 0 && totalRed === 0
                ? 'Seluruh Tim Disiplin (100 Poin)'
                : `${totalYellow} Kartu Kuning &bull; ${totalRed} Kartu Merah`}
            </span>
          </div>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="overflow-x-auto w-full">
        <svg
          role="img"
          aria-labelledby="discipline-chart-title discipline-chart-desc"
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          className="w-full h-auto min-w-[560px] max-w-full font-sans select-none"
        >
          <title id="discipline-chart-title">Indeks Fair Play dan Kartu Disiplin</title>
          <desc id="discipline-chart-desc">
            Grafik batang horizontal skor Fair Play dan jumlah kartu pelanggaran tim kontingen.
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
                  y2={plotTop + totalRowsHeight}
                  stroke="currentColor"
                  className="text-[var(--border-subtle)] opacity-40"
                  strokeWidth="1"
                  strokeDasharray={tick === 0 ? undefined : '3,3'}
                />
                <text
                  x={x}
                  y={plotTop + totalRowsHeight + 14}
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
          {displayedData.map((item, idx) => {
            const y = plotTop + idx * rowPitch + 10;
            const barW = (item.fairPlayScore / 100) * plotWidth;
            const hasCards = item.yellow > 0 || item.red > 0;

            return (
              <g key={item.id || item.team} className="group cursor-pointer">
                {/* Team label */}
                <text
                  x={plotLeft - 14}
                  y={y + 5}
                  textAnchor="end"
                  fill="currentColor"
                  className={`text-[11px] font-bold ${
                    hasCards ? 'text-amber-500 dark:text-amber-400' : 'text-[var(--text-main)]'
                  }`}
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
                  fill={
                    item.fairPlayScore >= 95
                      ? 'var(--color-arena-accent)'
                      : item.fairPlayScore >= 80
                      ? 'var(--color-arena-primary)'
                      : '#f59e0b'
                  }
                  opacity={item.fairPlayScore >= 95 ? '0.9' : '0.75'}
                  className="transition-all duration-300 group-hover:opacity-100"
                />

                {/* Score Label inside bar */}
                <text
                  x={Math.max(plotLeft + 22, plotLeft + barW - 6)}
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
                  <rect
                    x="0"
                    y="0"
                    width="28"
                    height="16"
                    rx="3"
                    fill="#f59e0b"
                    opacity={item.yellow > 0 ? '0.25' : '0.08'}
                    stroke="#f59e0b"
                    strokeWidth="1"
                  />
                  <text
                    x="14"
                    y="11"
                    textAnchor="middle"
                    fill={item.yellow > 0 ? '#d97706' : 'currentColor'}
                    className={`text-[9px] font-mono ${
                      item.yellow > 0 ? 'font-black' : 'font-semibold opacity-40'
                    }`}
                  >
                    {item.yellow} 🟨
                  </text>

                  {/* Red Card count */}
                  <g transform="translate(34, 0)">
                    <rect
                      x="0"
                      y="0"
                      width="28"
                      height="16"
                      rx="3"
                      fill="#ef4444"
                      opacity={item.red > 0 ? '0.25' : '0.08'}
                      stroke="#ef4444"
                      strokeWidth="1"
                    />
                    <text
                      x="14"
                      y="11"
                      textAnchor="middle"
                      fill={item.red > 0 ? '#dc2626' : 'currentColor'}
                      className={`text-[9px] font-mono ${
                        item.red > 0 ? 'font-black' : 'font-semibold opacity-40'
                      }`}
                    >
                      {item.red} 🟥
                    </text>
                  </g>
                </g>
              </g>
            );
          })}

          {/* Legend Bottom Strip */}
          <line
            x1={plotLeft}
            y1={legendY - 5}
            x2={plotRight + 70}
            y2={legendY - 5}
            stroke="currentColor"
            className="text-[var(--border-subtle)] opacity-40"
            strokeWidth="1"
          />
          <g transform={`translate(180, ${legendY + 14})`}>
            <rect x="0" y="-8" width="12" height="10" rx="2" fill="var(--color-arena-accent)" />
            <text x="18" y="0" fill="currentColor" className="text-[var(--text-main)] text-[10px] font-bold">
              Fair Play Unggulan (≥95 Poin)
            </text>

            <rect
              x="200"
              y="-8"
              width="12"
              height="10"
              rx="2"
              fill="var(--color-arena-primary)"
              opacity="0.75"
            />
            <text
              x="218"
              y="0"
              fill="currentColor"
              className="text-[var(--text-muted)] text-[10px] font-medium"
            >
              Fair Play Terjaga
            </text>

            <text
              x="340"
              y="0"
              fill="currentColor"
              className="text-[var(--text-muted)] text-[10px] font-mono"
            >
              *Pengurangan: -2 poin per kartu kuning, -5 poin per kartu merah
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
};
