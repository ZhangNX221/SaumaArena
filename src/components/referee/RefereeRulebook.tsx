'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  Zap,
  HelpCircle, 
  Scale,
  AlertTriangle
} from 'lucide-react';
import { AppUser } from '@/types';
import { 
  FUTSAL_CHEAT_SHEET, 
  FUTSAL_ARTICLES, 
} from '@/mocks/refereeRulebookData';

interface RefereeRulebookProps {
  user?: AppUser;
  sport?: string;
}

export const RefereeRulebook: React.FC<RefereeRulebookProps> = ({ user, sport }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('SEMUA');
  const [expandedIds, setExpandedIds] = useState<string[]>(['pasal-1', 'pasal-2']);

  // Tentukan cabor juri ini saja (spesialisasi juri atau cabor aktif)
  const activeSportCode = (sport || (user?.specialization && user.specialization !== 'ALL' ? user.specialization : 'FUTSAL')).toUpperCase();
  const sportDisplayName = activeSportCode === 'FUTSAL' ? 'Futsal' : activeSportCode;

  // Kategori filter
  const categories = [
    'SEMUA',
    'Waktu & Durasi',
    'Akumulasi & Penalti',
    'Regulasi Kiper',
    'Kartu & Disiplin',
    'Pergantian & Restart',
    'Adu Penalti',
    'Protes & Ofisial',
  ];

  // Filter artikel berdasarkan query pencarian dan kategori
  const filteredArticles = useMemo(() => {
    return FUTSAL_ARTICLES.filter((art) => {
      const matchCat = selectedCategory === 'SEMUA' || art.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchCat;
      const matchText = 
        art.title.toLowerCase().includes(q) ||
        art.summary.toLowerCase().includes(q) ||
        art.points.some((p) => p.toLowerCase().includes(q)) ||
        art.refereeTip.toLowerCase().includes(q);
      return matchCat && matchText;
    });
  }, [searchQuery, selectedCategory]);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleExpandAll = () => {
    setExpandedIds(FUTSAL_ARTICLES.map((a) => a.id));
  };

  const handleCollapseAll = () => {
    setExpandedIds([]);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16 animate-fadeIn">
      {/* 1. Header Banner - Quieter: Crisp 1px border, no loud gradients */}
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

      {/* 3. Search Bar & Category Controls - Rapi & Fleksibel */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-faint)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari regulasi (contoh: backpass, 4 detik, akumulasi foul, 10 meter, kartu merah)..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-main)] placeholder:text-[var(--text-faint)] focus:outline-none focus:border-[var(--color-arena-primary)] transition-all duration-150 font-sans shadow-xs"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleExpandAll}
              className="btn-tactile px-3.5 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-muted)] active:scale-95 transition-all duration-150 shadow-xs"
            >
              Buka Semua
            </button>
            <button
              type="button"
              onClick={handleCollapseAll}
              className="btn-tactile px-3.5 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-muted)] active:scale-95 transition-all duration-150 shadow-xs"
            >
              Tutup Semua
            </button>
          </div>
        </div>

        {/* Category Pills - Rapi & Responsive */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`btn-tactile px-3.5 py-2 rounded-xl text-xs font-barlow font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-150 active:scale-95 shadow-xs ${
                selectedCategory === cat
                  ? 'bg-[var(--color-arena-primary)] text-white'
                  : 'bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:bg-[var(--bg-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Daftar Pasal Regulasi - Distilled & Clarified */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-[var(--text-muted)] px-1">
          <span className="font-sans">
            Menampilkan <strong className="text-[var(--text-main)]">{filteredArticles.length}</strong> pasal regulasi {sportDisplayName}
          </span>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-[var(--color-arena-primary)] font-bold hover:underline transition-colors"
            >
              Reset pencarian
            </button>
          )}
        </div>

        {filteredArticles.length === 0 ? (
          <div className="p-10 text-center rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2">
            <HelpCircle className="w-7 h-7 text-[var(--text-faint)] mx-auto" />
            <h3 className="font-bebas text-lg text-[var(--text-main)] uppercase tracking-wide">
              Tidak Ada Pasal yang Cocok
            </h3>
            <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto font-sans">
              Pastikan ejaan kata kunci sudah benar atau coba cari istilah umum seperti foul, kiper, atau time-out.
            </p>
          </div>
        ) : (
          filteredArticles.map((article) => {
            const isExpanded = expandedIds.includes(article.id);
            return (
              <div
                key={article.id}
                className="rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] overflow-hidden transition-all duration-150 hover:border-[var(--color-arena-primary)]/40"
              >
                {/* Header Accordion */}
                <button
                  type="button"
                  onClick={() => toggleExpand(article.id)}
                  className="btn-tactile w-full p-4 sm:p-5 flex items-start sm:items-center justify-between gap-3 text-left hover:bg-[var(--bg-muted)]/40 transition-colors duration-150"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-[var(--color-arena-primary)]/10 text-[var(--color-arena-primary)] text-[10px] font-barlow font-bold uppercase tracking-wider border border-[var(--color-arena-primary)]/20">
                        Pasal {article.number} &bull; {article.category}
                      </span>
                    </div>
                    <h3 className="font-bebas text-xl sm:text-2xl text-[var(--text-main)] uppercase tracking-wide">
                      {article.title}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] line-clamp-1 font-sans">
                      {article.summary}
                    </p>
                  </div>

                  <div className="p-1.5 rounded-lg bg-[var(--bg-muted)] text-[var(--text-muted)] shrink-0 mt-1 sm:mt-0 transition-transform duration-200">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {/* Content Accordion Body */}
                {isExpanded && (
                  <div className="p-5 sm:p-6 border-t border-[var(--border-subtle)] bg-[var(--bg-page)]/40 space-y-4 animate-fadeIn font-sans">
                    <div className="text-xs sm:text-sm text-[var(--text-main)] leading-relaxed">
                      {article.summary}
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                        <Scale className="w-3.5 h-3.5 text-[var(--color-arena-primary)]" />
                        <span>Klausul Regulasi:</span>
                      </h4>
                      <ul className="space-y-1.5">
                        {article.points.map((pt, pIdx) => (
                          <li
                            key={pIdx}
                            className="flex items-start gap-2 text-xs sm:text-sm text-[var(--text-main)] leading-relaxed pl-0.5"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-arena-primary)] mt-1.5 shrink-0" />
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3.5 sm:p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-900 dark:text-amber-200 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-barlow font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>Panduan Keputusan Wasit:</span>
                      </div>
                      <p className="text-xs sm:text-sm leading-relaxed pl-5">
                        {article.refereeTip}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
