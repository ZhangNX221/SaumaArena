'use client';

import React, { useState } from 'react';
import { Calendar, Clock, Trophy, Coffee, Flag, BarChart2 } from 'lucide-react';
import { TOURNAMENT_RUNDOWN, RundownItem, initialMatches } from '@/mocks/tournamentData';

export const TournamentRundownTable: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<'H1' | 'H2'>('H1');

  const items = TOURNAMENT_RUNDOWN.filter((it) => it.day === selectedDay);

  const getCategoryBadge = (item: RundownItem) => {
    switch (item.category) {
      case 'CEREMONY':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-barlow font-bold uppercase tracking-wider bg-purple-500/15 text-purple-800 dark:text-purple-300 border border-purple-500/25">
            <Flag className="w-3 h-3 shrink-0" />
            <span>Seremonial</span>
          </span>
        );
      case 'BREAK':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-barlow font-bold uppercase tracking-wider bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/25">
            <Coffee className="w-3 h-3 shrink-0" />
            <span>Istirahat</span>
          </span>
        );
      case 'RECAP':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-barlow font-bold uppercase tracking-wider bg-blue-500/15 text-blue-800 dark:text-blue-300 border border-blue-500/25">
            <BarChart2 className="w-3 h-3 shrink-0" />
            <span>Rekapitulasi</span>
          </span>
        );
      default:
        if (item.agendaCode === 'FINAL') {
          return (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-barlow font-black uppercase tracking-wider bg-amber-500 text-slate-950 border border-amber-600 shadow-2xs">
              <Trophy className="w-3 h-3 shrink-0" />
              <span>Grand Final</span>
            </span>
          );
        }
        if (item.agendaCode === '4 BESAR') {
          return (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-barlow font-bold uppercase tracking-wider bg-[var(--color-arena-primary-light)] text-[var(--color-arena-primary)] border border-[var(--color-arena-primary)]/30">
              <Trophy className="w-3 h-3 shrink-0" />
              <span>4 Besar (Semifinal)</span>
            </span>
          );
        }
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-[var(--bg-muted)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
            {item.notes}
          </span>
        );
    }
  };

  return (
    <div className="rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs overflow-hidden space-y-4 p-3.5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
        <div>
          <h3 className="font-bebas text-lg sm:text-xl text-[var(--text-main)] uppercase tracking-wide flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[var(--color-arena-primary)] shrink-0" />
            <span>Tabel Rundown &amp; Jadwal Pertandingan Lengkap</span>
          </h3>
          <p className="text-xs text-[var(--text-muted)]">
            Daftar partai resmi P1–P17, alokasi waktu, kode pertandingan, dan agenda seremonial turnamen.
          </p>
        </div>

        {/* Filter Hari (Jadwal Per Hari Saja) */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-xs font-semibold shrink-0">
          <button
            type="button"
            onClick={() => setSelectedDay('H1')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              selectedDay === 'H1'
                ? 'bg-[var(--color-arena-primary)] text-white shadow-xs font-bold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            HARI-1 (Selasa, 3 Nov)
          </button>
          <button
            type="button"
            onClick={() => setSelectedDay('H2')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              selectedDay === 'H2'
                ? 'bg-[var(--color-arena-primary)] text-white shadow-xs font-bold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            HARI-2 (Rabu, 4 Nov)
          </button>
        </div>
      </div>

      {/* 1. TAMPILAN MOBILE: Simpel, Rapi, Lengkap Tanpa Terpotong (antislop-layoutmobile & antislop-ui) */}
      <div className="block md:hidden space-y-2.5">
        {items.map((it) => {
          const isCeremonyOrBreak = it.category === 'CEREMONY' || it.category === 'BREAK' || it.category === 'RECAP';
          const isFinal = it.agendaCode === 'FINAL';

          const matchNum = it.matchCode.startsWith('P') ? parseInt(it.matchCode.replace('P', ''), 10) : null;
          const matchData = matchNum ? initialMatches.find((m) => m.matchNumber === matchNum) : null;
          const isLive = matchData?.status === 'LIVE';
          const isCompleted = matchData?.status === 'COMPLETED';

          const vsParts = it.category === 'MATCH' && it.detail.includes(' vs ') ? it.detail.split(/\s+vs\s+/i) : null;
          const teamA = vsParts?.[0];
          const teamB = vsParts?.[1];

          return (
            <div
              key={`card-${it.id}`}
              className={`rounded-xl p-3 border transition-colors ${
                isLive
                  ? 'bg-red-500/5 dark:bg-red-950/20 border-red-500/40 shadow-xs'
                  : isFinal
                  ? 'bg-amber-500/10 border-amber-500/40 shadow-xs'
                  : isCeremonyOrBreak
                  ? 'bg-[var(--bg-muted)]/40 border-[var(--border-subtle)] text-[var(--text-muted)]'
                  : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] shadow-2xs'
              }`}
            >
              {/* Header: Partai, Kode Laga, Status Live, dan Waktu Lengkap */}
              <div className="flex items-center justify-between gap-2 text-xs pb-2 border-b border-[var(--border-subtle)]/70">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {it.matchCode !== '-' ? (
                    <span
                      className={`px-2 py-0.5 rounded font-mono font-bold text-xs ${
                        isFinal
                          ? 'bg-amber-500 text-slate-950 font-black'
                          : 'bg-[var(--color-arena-dark)] text-white'
                      }`}
                    >
                      {it.matchCode}
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded font-mono font-bold text-xs bg-[var(--bg-muted)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
                      {it.agendaCode}
                    </span>
                  )}

                  {it.matchCode !== '-' && (
                    <span className="px-2 py-0.5 rounded font-mono text-xs font-semibold bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-[var(--text-main)]">
                      {it.agendaCode}
                    </span>
                  )}

                  {isLive && (
                    <span className="px-1.5 py-0.5 rounded bg-red-600 text-white font-barlow font-bold text-[9px] uppercase tracking-wider animate-pulse flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      LIVE
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-[11px] font-mono font-semibold text-[var(--text-muted)] shrink-0">
                  <Clock className="w-3.5 h-3.5 text-[var(--color-arena-primary)] shrink-0" />
                  <span>{it.time} WIB</span>
                </div>
              </div>

              {/* Isi Detail: Nama Tim & Skor (atau Agenda Seremoni) */}
              <div className="py-2.5">
                {isCeremonyOrBreak ? (
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[var(--text-main)]">
                    {it.category === 'CEREMONY' && <Flag className="w-4 h-4 text-purple-600 shrink-0" />}
                    {it.category === 'BREAK' && <Coffee className="w-4 h-4 text-amber-600 shrink-0" />}
                    {it.category === 'RECAP' && <BarChart2 className="w-4 h-4 text-blue-600 shrink-0" />}
                    <span>{it.detail}</span>
                  </div>
                ) : teamA && teamB ? (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-bold text-[var(--text-main)] leading-snug">
                        {teamA}
                      </span>
                      <span className="font-mono font-bold text-xs tabular-nums text-[var(--text-main)] shrink-0">
                        {isLive || isCompleted ? (matchData?.scoreA ?? 0) : '-'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-bold text-[var(--text-main)] leading-snug">
                        {teamB}
                      </span>
                      <span className="font-mono font-bold text-xs tabular-nums text-[var(--text-main)] shrink-0">
                        {isLive || isCompleted ? (matchData?.scoreB ?? 0) : '-'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs font-bold text-[var(--text-main)] leading-snug">
                    {it.detail}
                  </div>
                )}
              </div>

              {/* Footer: Kategori/Babak Lengkap & Status Laga */}
              <div className="pt-2 border-t border-[var(--border-subtle)]/70 flex items-center justify-between gap-2 text-xs">
                <div>
                  {getCategoryBadge(it)}
                </div>

                <div className="text-right shrink-0">
                  {isLive ? (
                    <span className="text-[11px] font-mono text-red-600 dark:text-red-400 font-bold">
                      Sedang Bertanding
                    </span>
                  ) : isCompleted ? (
                    <span className="text-[11px] font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                      Selesai
                    </span>
                  ) : it.category === 'MATCH' ? (
                    <span className="text-[11px] font-mono font-medium text-[var(--text-muted)]">
                      Belum Tanding
                    </span>
                  ) : (
                    <span className="text-[11px] font-mono text-[var(--text-faint)]">-</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. TAMPILAN TABEL LENGKAP (Khusus Layar Desktop md: ke Atas) */}
      <div className="hidden md:block">

        <div className="overflow-x-auto rounded-xl border border-[var(--border-subtle)]">
          <table className="w-full min-w-[660px] text-xs text-left">
            <thead className="bg-[var(--bg-muted)]/80 text-[11px] font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border-subtle)]">
              <tr>
                <th className="py-3 px-3.5 text-center w-14">Partai</th>
                <th className="py-3 px-3.5 w-36">Waktu (WIB)</th>
                <th className="py-3 px-3.5 w-28 text-center">Kode</th>
                <th className="py-3 px-4 min-w-[220px]">Detail Tim Bertanding / Agenda</th>
                <th className="py-3 px-3.5 text-center min-w-[140px]">Kategori / Babak</th>
                <th className="py-3 px-3.5 text-center w-24">Skor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {items.map((it) => {
                const isCeremonyOrBreak = it.category === 'CEREMONY' || it.category === 'BREAK' || it.category === 'RECAP';
                const isFinal = it.agendaCode === 'FINAL';

                // Hubungkan dengan data pertandingan resmi jika bertipe MATCH
                const matchNum = it.matchCode.startsWith('P') ? parseInt(it.matchCode.replace('P', ''), 10) : null;
                const matchData = matchNum ? initialMatches.find((m) => m.matchNumber === matchNum) : null;
                const isLive = matchData?.status === 'LIVE';
                const isCompleted = matchData?.status === 'COMPLETED';

                return (
                  <tr
                    key={it.id}
                    className={`transition-colors ${
                      isLive
                        ? 'bg-red-500/5 dark:bg-red-950/20 font-semibold'
                        : isFinal
                        ? 'bg-amber-500/10 font-semibold'
                        : isCeremonyOrBreak
                        ? 'bg-[var(--bg-muted)]/35 text-[var(--text-muted)] italic'
                        : 'hover:bg-[var(--bg-muted)]/40'
                    }`}
                  >
                    <td className="py-3 px-3.5 text-center font-mono font-bold">
                      {it.matchCode === '-' ? (
                        <span className="text-[var(--text-faint)]">-</span>
                      ) : (
                        <span className={`px-2 py-0.5 rounded ${isFinal ? 'bg-amber-500 text-slate-950 font-black' : 'bg-[var(--color-arena-dark)] text-white'}`}>
                          {it.matchCode}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3.5 font-mono text-[var(--text-muted)] whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[var(--color-arena-primary)] shrink-0" />
                        <span>{it.time}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3.5 text-center font-mono font-bold text-[var(--text-main)] whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                        {it.agendaCode}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-[var(--text-main)]">
                      <div className="flex items-center gap-2">
                        <span className={isCeremonyOrBreak ? 'not-italic font-bold' : ''}>
                          {it.detail}
                        </span>
                        {isLive && (
                          <span className="px-1.5 py-0.5 rounded bg-red-600 text-white font-barlow font-bold text-[9px] uppercase tracking-wider animate-pulse shrink-0">
                            LIVE
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3.5 text-center whitespace-nowrap">
                      {getCategoryBadge(it)}
                    </td>
                    <td className="py-3 px-3.5 text-center font-mono font-bold tabular-nums whitespace-nowrap">
                      {isLive || isCompleted ? (
                        <span className={`font-teko text-base ${isLive ? 'text-red-600 dark:text-red-400 font-bold' : 'text-[var(--text-main)]'}`}>
                          {matchData?.scoreA ?? 0} - {matchData?.scoreB ?? 0}
                        </span>
                      ) : it.category === 'MATCH' ? (
                        <span className="text-[var(--text-muted)] tracking-wider font-mono font-semibold">-</span>
                      ) : (
                        <span className="text-[var(--text-faint)]">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
