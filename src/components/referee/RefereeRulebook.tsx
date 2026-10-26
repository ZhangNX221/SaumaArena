'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Zap,
  Eye
} from 'lucide-react';
import { AppUser } from '@/types';
import { 
  FUTSAL_CHEAT_SHEET, 
  FUTSAL_ARTICLES, 
  RuleArticle
} from '@/mocks/refereeRulebookData';
import { RuleDetailModal } from './rules/RuleDetailModal';

interface RefereeRulebookProps {
  user?: AppUser;
  sport?: string;
}

export const RefereeRulebook: React.FC<RefereeRulebookProps> = ({ user, sport }) => {
  const [selectedRuleForModal, setSelectedRuleForModal] = useState<RuleArticle | null>(null);

  // Tentukan cabor juri ini saja (spesialisasi juri atau cabor aktif)
  const activeSportCode = (sport || (user?.specialization && user.specialization !== 'ALL' ? user.specialization : 'FUTSAL')).toUpperCase();
  const sportDisplayName = activeSportCode === 'FUTSAL' ? 'Futsal' : activeSportCode;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16 animate-fadeIn">
      {/* 1. Header Banner */}
      <div className="p-6 sm:p-7 rounded-2xl bg-[#0D1E30] text-white border border-[#1C3B5B] transition-all duration-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1">
            <h1 className="font-bebas text-3xl sm:text-4xl tracking-wide uppercase text-white leading-none">
              REGULASI TEKNIS {sportDisplayName.toUpperCase()}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-sans">
              Rujukan hukum pertandingan dan panduan keputusan wasit resmi di lapangan untuk{' '}
              <strong className="text-white">{user?.name || 'Wasit Utama'}</strong>{' '}
              ({user?.licenseLevel || 'Lisensi 2 Nasional FFI'}).
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-3.5 py-2 rounded-xl bg-[#07131F] border border-[#1C3B5B] text-left">
              <div className="text-[10px] font-barlow font-bold uppercase tracking-wider text-[#F6AE2D] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#F6AE2D]" />
                <span>Spesialisasi Lapangan</span>
              </div>
              <div className="text-xs font-mono font-bold text-white mt-0.5">
                {sportDisplayName} &bull; FFI 2026
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Kartu Cepat Meja Wasit - Rapi, Lega & Tanpa Teks Terpotong */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#F6AE2D]" />
            <h2 className="font-bebas text-xl sm:text-2xl text-[var(--text-main)] uppercase tracking-wide">
              Rujukan Cepat Lapangan
            </h2>
          </div>
          <span className="text-xs text-[var(--text-muted)] font-barlow font-semibold uppercase tracking-wider">
            Angka Krusial Meja
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {FUTSAL_CHEAT_SHEET.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--color-arena-primary)]/40 transition-all duration-150 flex flex-col justify-between space-y-1.5 shadow-xs"
            >
              <div className="space-y-1">
                <span className="text-[10px] sm:text-[11px] font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] block">
                  {item.label}
                </span>
                <div className="text-xl sm:text-2xl font-scoreboard font-bold text-[var(--color-arena-primary)] leading-tight tracking-wide">
                  {item.value}
                </div>
              </div>
              <p className="text-xs text-[var(--text-muted)] font-sans leading-relaxed pt-1 border-t border-[var(--border-subtle)]/60">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Tabel Pasal Regulasi dengan Tombol Pop-up */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-[var(--text-muted)] px-1">
          <span className="font-sans">
            Daftar <strong className="text-[var(--text-main)]">{FUTSAL_ARTICLES.length}</strong> pasal regulasi {sportDisplayName}
          </span>
        </div>

        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-x-auto shadow-xs">
          <table className="w-full text-left text-xs min-w-[620px]">
            <thead className="bg-[var(--bg-muted)]/70 text-[var(--text-muted)] uppercase text-[11px] font-barlow font-bold tracking-wider border-b border-[var(--border-subtle)]">
              <tr>
                <th className="py-3.5 px-4 w-28">Pasal</th>
                <th className="py-3.5 px-4 w-44">Kategori</th>
                <th className="py-3.5 px-4">Judul &amp; Ringkasan Regulasi</th>
                <th className="py-3.5 px-4 w-32 hidden sm:table-cell">Klausul</th>
                <th className="py-3.5 px-4 text-right w-36">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)] font-medium text-[var(--text-main)]">
              {FUTSAL_ARTICLES.map((article) => (
                <tr
                  key={article.id}
                  onClick={() => setSelectedRuleForModal(article)}
                  className="hover:bg-[var(--bg-muted)]/40 transition-colors group cursor-pointer"
                >
                  <td className="py-4 px-4 font-mono font-bold text-xs whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-md bg-[var(--color-arena-primary)]/10 text-[var(--color-arena-primary)] border border-[var(--color-arena-primary)]/20">
                      Pasal {article.number}
                    </span>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-lg text-[11px] font-barlow font-bold uppercase tracking-wider bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-[var(--text-muted)]">
                      {article.category}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="space-y-0.5 max-w-xl">
                      <div className="font-bebas text-base sm:text-lg text-[var(--text-main)] uppercase tracking-wide group-hover:text-[var(--color-arena-primary)] transition-colors leading-tight">
                        {article.title}
                      </div>
                      <p className="text-xs text-[var(--text-muted)] line-clamp-1 font-sans">
                        {article.summary}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-4 hidden sm:table-cell whitespace-nowrap">
                    <span className="text-xs text-[var(--text-muted)] font-mono font-semibold">
                      {article.points.length} Butir Ketentuan
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => setSelectedRuleForModal(article)}
                      className="btn-tactile px-3.5 py-1.5 rounded-xl border border-[var(--border-subtle)] group-hover:border-[var(--color-arena-primary)] bg-[var(--bg-surface)] hover:bg-[var(--color-arena-primary)] hover:text-white text-[var(--text-main)] text-xs font-barlow font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-all shadow-xs"
                      aria-label={`Buka detail ${article.title}`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Buka Aturan</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Pop-up Modal Detail Regulasi */}
      <RuleDetailModal
        rule={selectedRuleForModal}
        sportDisplayName={sportDisplayName}
        onClose={() => setSelectedRuleForModal(null)}
      />
    </div>
  );
};
