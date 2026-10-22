'use client';

import React, { useState, useEffect } from 'react';
import {
  Plus,
  LayoutGrid,
  List,
  Search,
  CheckCircle2,
} from 'lucide-react';
import { SPORTS_CONFIG, VENUES } from '@/mocks/multiSportData';
import { SportConfig, Venue } from '@/types';
import { SportFormModal } from './master/SportFormModal';
import { DeleteSportConfirmModal } from './master/DeleteSportConfirmModal';
import { SportGridView } from './master/SportGridView';
import { SportTableView } from './master/SportTableView';
import { CategoriesTab, VenuesTab } from './master/VenuesAndCategoriesTab';

export interface AdminMasterDataModuleProps {
  subTab?: 'sports' | 'categories' | 'venues';
  onSelectSubTab?: (tab: 'sports' | 'categories' | 'venues') => void;
}

export const AdminMasterDataModule: React.FC<AdminMasterDataModuleProps> = ({
  subTab: externalSubTab,
  onSelectSubTab,
}) => {
  const [internalSubTab, setInternalSubTab] = useState<'SPORTS' | 'CATEGORIES' | 'VENUES'>('SPORTS');
  const currentTab = externalSubTab
    ? (externalSubTab.toUpperCase() as 'SPORTS' | 'CATEGORIES' | 'VENUES')
    : internalSubTab;

  const handleTabChange = (t: 'SPORTS' | 'CATEGORIES' | 'VENUES') => {
    setInternalSubTab(t);
    if (onSelectSubTab) {
      onSelectSubTab(t.toLowerCase() as 'sports' | 'categories' | 'venues');
    }
  };

  const [sports, setSports] = useState<SportConfig[]>(SPORTS_CONFIG);
  const [venues] = useState<Venue[]>(VENUES);
  const [viewMode, setViewMode] = useState<'GRID' | 'TABLE'>('GRID');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingSport, setEditingSport] = useState<SportConfig | null>(null);
  const [deletingSport, setDeletingSport] = useState<SportConfig | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load / persist sports from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('sauma_arena_sports');
      if (saved) {
        setSports(JSON.parse(saved));
      }
    } catch {
      // fallback to initial mock
    }
  }, []);

  const persistSports = (updated: SportConfig[]) => {
    setSports(updated);
    try {
      localStorage.setItem('sauma_arena_sports', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenAddModal = () => {
    setEditingSport(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (sport: SportConfig) => {
    setEditingSport(sport);
    setIsFormModalOpen(true);
  };

  const handleSaveSport = (sportToSave: SportConfig) => {
    if (editingSport) {
      const updated = sports.map((s) => (s.code === editingSport.code ? sportToSave : s));
      persistSports(updated);
      showToast(`Regulasi cabor ${sportToSave.name} berhasil diperbarui.`);
    } else {
      const exists = sports.some((s) => s.code === sportToSave.code);
      if (exists) {
        const updated = sports.map((s) => (s.code === sportToSave.code ? sportToSave : s));
        persistSports(updated);
        showToast(`Cabor ${sportToSave.name} berhasil diperbarui.`);
      } else {
        const updated = [...sports, sportToSave];
        persistSports(updated);
        showToast(`Cabor baru ${sportToSave.name} berhasil ditambahkan.`);
      }
    }
    setIsFormModalOpen(false);
    setEditingSport(null);
  };

  const handleConfirmDelete = () => {
    if (!deletingSport) return;
    const updated = sports.filter((s) => s.code !== deletingSport.code);
    persistSports(updated);
    showToast(`Cabor ${deletingSport.name} telah dihapus.`);
    setDeletingSport(null);
  };

  const filteredSports = sports.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.categories.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Subtab Segmented Switcher & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[var(--text-main)] font-[var(--font-display)] tracking-tight">
            Data Lapangan &amp; Cabor
          </h2>
          <p className="text-xs text-[var(--text-muted)] font-[var(--font-sans)] mt-1">
            Fondasi multi-cabor: kelola cabang olahraga, nomor tanding resmi, serta titik lapangan arena.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1.5 rounded-2xl bg-[var(--bg-muted)]/80 border border-[var(--border-subtle)] text-xs font-bold font-[var(--font-display)] w-fit">
          <button
            type="button"
            onClick={() => handleTabChange('SPORTS')}
            className={`btn-tactile px-4 py-2 rounded-xl transition-all ${
              currentTab === 'SPORTS'
                ? 'bg-[var(--color-arena-primary)] text-white shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            Daftar Cabor ({sports.length})
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('CATEGORIES')}
            className={`btn-tactile px-4 py-2 rounded-xl transition-all ${
              currentTab === 'CATEGORIES'
                ? 'bg-[var(--color-arena-primary)] text-white shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            Nomor Tanding
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('VENUES')}
            className={`btn-tactile px-4 py-2 rounded-xl transition-all ${
              currentTab === 'VENUES'
                ? 'bg-[var(--color-arena-primary)] text-white shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            Data Lapangan ({venues.length})
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: DAFTAR CABANG OLAHRAGA (CRUD & VIEW TOGGLE) */}
      {currentTab === 'SPORTS' && (
        <div className="space-y-4">
          {/* Action Toolbar: Search, View Switcher, and Add Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative max-w-sm w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-faint)]" />
              <input
                type="text"
                placeholder="Cari cabor atau nomor tanding..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-main)] focus:outline-none focus:border-[var(--color-arena-primary)]"
              />
            </div>

            <div className="flex items-center gap-2">
              {/* View Mode Toggle: Grid vs Table */}
              <div className="flex items-center p-1 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setViewMode('GRID')}
                  className={`btn-tactile flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                    viewMode === 'GRID'
                      ? 'bg-[var(--bg-surface)] text-[var(--color-arena-primary)] shadow-xs font-bold'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                  title="Tampilan Grid / Kartu"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Grid</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('TABLE')}
                  className={`btn-tactile flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                    viewMode === 'TABLE'
                      ? 'bg-[var(--bg-surface)] text-[var(--color-arena-primary)] shadow-xs font-bold'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                  title="Tampilan Tabel"
                >
                  <List className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Tabel</span>
                </button>
              </div>

              {/* Add Sport Button */}
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="btn-tactile px-4 py-2 rounded-xl bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors min-h-[38px]"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Cabor</span>
              </button>
            </div>
          </div>

          {/* Grid View */}
          {viewMode === 'GRID' && (
            <SportGridView
              sports={filteredSports}
              onEdit={handleOpenEditModal}
              onDelete={(sport) => setDeletingSport(sport)}
            />
          )}

          {/* Table View */}
          {viewMode === 'TABLE' && (
            <SportTableView
              sports={filteredSports}
              onEdit={handleOpenEditModal}
              onDelete={(sport) => setDeletingSport(sport)}
            />
          )}
        </div>
      )}

      {/* SUB-TAB 2: NOMOR TANDING & KATEGORI */}
      {currentTab === 'CATEGORIES' && (
        <CategoriesTab sports={sports} onOpenAddModal={handleOpenAddModal} />
      )}

      {/* SUB-TAB 3: VENUE & LAPANGAN */}
      {currentTab === 'VENUES' && <VenuesTab venues={venues} />}

      {/* Sport Add/Edit Form Modal */}
      <SportFormModal
        isOpen={isFormModalOpen}
        initialData={editingSport}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingSport(null);
        }}
        onSave={handleSaveSport}
      />

      {/* Delete Confirmation Modal */}
      <DeleteSportConfirmModal
        isOpen={!!deletingSport}
        sport={deletingSport}
        onClose={() => setDeletingSport(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
