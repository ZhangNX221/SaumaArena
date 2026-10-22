'use client';

import React, { useState } from 'react';
import { BookOpen, Search, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { RULEBOOK_ITEMS } from '@/mocks/multiSportData';

export const RefereeRulebook: React.FC = () => {
  const [selectedSport, setSelectedSport] = useState<string>('FUTSAL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const currentRulebook = RULEBOOK_ITEMS.find((r) => r.sport === selectedSport) || RULEBOOK_ITEMS[0];

  const filteredSections = currentRulebook.sections.filter(
    (s) =>
      s.heading.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[var(--text-main)] font-[var(--font-display)] flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#33658a]" />
            <span>Buku Peraturan &amp; Regulasi Teknis (Rulebook)</span>
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Rujukan cepat juri di pinggir lapangan saat terjadi protes pemain/pelatih atau keraguan aturan.
          </p>
        </div>

        {/* Sport Switcher Chips */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-xs font-semibold w-fit">
          {RULEBOOK_ITEMS.map((r) => (
            <button
              key={r.sport}
              type="button"
              onClick={() => setSelectedSport(r.sport)}
              className={`btn-tactile px-3.5 py-1.5 rounded-lg transition-all ${
                selectedSport === r.sport
                  ? 'bg-[#33658a] text-white shadow-xs font-bold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              {r.sport}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-faint)]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari pasal regulasi (contoh: foul, akumulasi, timeout, deuce)..."
          className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-main)] focus:outline-none focus:border-[#33658a]"
        />
      </div>

      {/* Rulebook Content Accordion */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
          <span className="font-black text-sm text-[var(--text-main)]">{currentRulebook.title}</span>
          <span className="text-[11px] font-bold text-[#33658a] bg-[#33658a]/10 px-2.5 py-1 rounded-md border border-[#33658a]/20">
            Resmi Terverifikasi Dispora
          </span>
        </div>

        <div className="space-y-2.5">
          {filteredSections.map((sec, idx) => {
            const isExpanded = expandedIndex === idx;
            return (
              <div
                key={sec.heading}
                className="rounded-xl border border-[var(--border-subtle)] overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                  className="btn-tactile w-full p-4 flex items-center justify-between text-left bg-[var(--bg-muted)]/50 hover:bg-[var(--bg-muted)]"
                >
                  <span className="font-bold text-xs sm:text-sm text-[var(--text-main)]">
                    {idx + 1}. {sec.heading}
                  </span>
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {isExpanded && (
                  <div className="p-4 bg-[var(--bg-surface)] text-xs text-[var(--text-muted)] leading-relaxed border-t border-[var(--border-subtle)] animate-fadeIn">
                    {sec.text}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
