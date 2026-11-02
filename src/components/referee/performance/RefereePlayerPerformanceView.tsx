'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  CheckCircle2,
  Award,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Save,
} from 'lucide-react';
import { AppUser, FlattenedAthlete, Team, STORAGE_KEY_TEAMS, STORAGE_KEY_MASTER_ATHLETES } from '@/types';
import { initialTeams } from '@/mocks/tournamentData';
import { usePersistentState } from '@/hooks/usePersistentState';
import { AdminPageHeaderCard } from '@/components/admin/common/AdminPageHeaderCard';
import { PerformanceStatCards } from './PerformanceStatCards';
import { PlayerPerformanceRow } from './PlayerPerformanceRow';
import { PerformanceToolbar, FilterCategory, SortOption } from './PerformanceToolbar';
import { pushAthleteStatToBackend, pushAllAthletesToBackend, fetchAthletesFromBackend } from '@/lib/athleteSync';

interface RefereePlayerPerformanceViewProps {
  user?: AppUser;
}

export const RefereePlayerPerformanceView: React.FC<RefereePlayerPerformanceViewProps> = ({ user }) => {
  // 1. Data Induk Atlet dari database atlet admin
  const allAthletesFallback: FlattenedAthlete[] = useMemo(
    () =>
      initialTeams.flatMap((t) =>
        t.players.map((p) => ({
          ...p,
          teamId: t.id,
          teamName: t.name,
          schoolName: t.schoolName,
          group: t.group,
        }))
      ),
    []
  );

  const [athletesList, setAthletesList] = usePersistentState<FlattenedAthlete[]>(
    STORAGE_KEY_MASTER_ATHLETES,
    allAthletesFallback
  );

  // Self-healing agar nama tim dan data atlet selalu sinkron dengan master kontingen
  useEffect(() => {
    if (athletesList.length === 0) {
      setAthletesList(allAthletesFallback);
    }
  }, [athletesList.length, allAthletesFallback, setAthletesList]);

  // Sinkronisasi data atlet & performa dari SQLite Database Backend saat dimuat
  useEffect(() => {
    let isMounted = true;
    fetchAthletesFromBackend().then((backendAthletes) => {
      if (!isMounted) return;
      if (backendAthletes && Array.isArray(backendAthletes) && backendAthletes.length > 0) {
        setAthletesList((prev) => {
          if (!prev || prev.length === 0) return backendAthletes;
          const prevMap = new Map(prev.map((a) => [a.id, a]));
          return backendAthletes.map((remote) => {
            const local = prevMap.get(remote.id);
            return {
              ...remote,
              // Pertahankan nilai tertinggi antara lokal dan remote database
              goals: Math.max(Number(local?.goals || 0), Number(remote.goals || 0)),
              yellowCards: Math.max(Number(local?.yellowCards || 0), Number(remote.yellowCards || 0)),
              redCards: Math.max(Number(local?.redCards || 0), Number(remote.redCards || 0)),
              assists: Math.max(Number(local?.assists || 0), Number(remote.assists || 0)),
            };
          });
        });
      }
    });

    return () => {
      isMounted = false;
    };
  }, [setAthletesList]);

  // 2. Filter & Pencarian
  const [search, setSearch] = useState('');
  const [selectedTeamFilter, setSelectedTeamFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState<FilterCategory>('ALL');
  const [sortOption, setSortOption] = useState<SortOption>('GOALS_DESC');
  const [currentPage, setCurrentPage] = useState(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSavingDb, setIsSavingDb] = useState(false);
  const pageSize = 20;

  const handleSaveAllToDatabase = async () => {
    setIsSavingDb(true);
    try {
      const ok = await pushAllAthletesToBackend(athletesList);
      if (ok) {
        setToastMessage('✓ Data performa & kartu pemain tersimpan permanen di database!');
      } else {
        setToastMessage('✓ Data performa tersimpan di penyimpanan lokal');
      }
    } catch {
      setToastMessage('✓ Data tersimpan di penyimpanan lokal');
    } finally {
      setIsSavingDb(false);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  // 3. Update Statistik Pemain (Gol / Kartu Kuning / Kartu Merah)
  const handleUpdateStat = (
    athleteId: string,
    teamId: string,
    field: 'goals' | 'yellowCards' | 'redCards',
    delta: number
  ) => {
    const target = athletesList.find((a) => a.id === athleteId);
    const currentVal = (target && target[field]) || 0;
    const nextVal = Math.max(0, currentVal + delta);
    const targetAthleteName = target?.name || 'Pemain';

    // A. Update Master Athletes (Halaman Admin & Publik)
    const updatedAthletes = athletesList.map((a) => {
      if (a.id === athleteId) {
        return { ...a, [field]: nextVal };
      }
      return a;
    });
    setAthletesList(updatedAthletes);

    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_MASTER_ATHLETES, JSON.stringify(updatedAthletes));
        window.dispatchEvent(
          new CustomEvent('sauma_state_sync', {
            detail: { key: STORAGE_KEY_MASTER_ATHLETES, value: updatedAthletes },
          })
        );
      }
    } catch (e) {
      console.warn('[RefereePerformance] Gagal sinkron ke master athletes storage:', e);
    }

    // B. Sinkronisasi ke storage tim (STORAGE_KEY_TEAMS) agar halaman publik & bagan ikut terupdate
    try {
      if (typeof window !== 'undefined') {
        const savedTeamsStr = localStorage.getItem(STORAGE_KEY_TEAMS);
        if (savedTeamsStr) {
          const teams: Team[] = JSON.parse(savedTeamsStr);
          const updatedTeams = teams.map((t) => {
            if (t.id === teamId) {
              return {
                ...t,
                players: t.players.map((p) => {
                  if (p.id === athleteId) {
                    return { ...p, [field]: nextVal };
                  }
                  return p;
                }),
              };
            }
            return t;
          });
          localStorage.setItem(STORAGE_KEY_TEAMS, JSON.stringify(updatedTeams));
          window.dispatchEvent(
            new CustomEvent('sauma_state_sync', {
              detail: { key: STORAGE_KEY_TEAMS, value: updatedTeams },
            })
          );
        }
      }
    } catch (e) {
      console.warn('[RefereePerformance] Gagal sinkron ke teams storage:', e);
    }

    // Sinkronisasi perubahan stat ke database backend SQLite
    pushAthleteStatToBackend(athleteId, field, nextVal).catch(() => {});

    // Notifikasi umpan balik
    const labelField =
      field === 'goals' ? 'Gol' : field === 'yellowCards' ? 'Kartu Kuning' : 'Kartu Merah';
    setToastMessage(`✓ ${labelField} ${targetAthleteName} diubah menjadi ${nextVal}`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Statistik agregat kartu & gol
  const { totalGoals, totalYellowCards, totalRedCards, topScorer } = useMemo(() => {
    let goals = 0;
    let yellow = 0;
    let red = 0;
    let top: { name: string; goals: number; teamName: string } | null = null;

    athletesList.forEach((a) => {
      const g = a.goals || 0;
      goals += g;
      yellow += a.yellowCards || 0;
      red += a.redCards || 0;
      if (g > 0 && (!top || g > top.goals)) {
        top = { name: a.name, goals: g, teamName: a.teamName };
      }
    });

    return { totalGoals: goals, totalYellowCards: yellow, totalRedCards: red, topScorer: top };
  }, [athletesList]);

  // 5. Filter & Sort Pemain
  const filteredAthletes = useMemo(() => {
    return athletesList
      .filter((a) => {
        const matchSearch =
          (a.athleteCode && a.athleteCode.toLowerCase().includes(search.toLowerCase())) ||
          a.name.toLowerCase().includes(search.toLowerCase()) ||
          (a.number !== undefined && a.number.toString().includes(search)) ||
          a.teamName.toLowerCase().includes(search.toLowerCase());

        const matchTeam = selectedTeamFilter === 'ALL' || a.teamId === selectedTeamFilter;

        let matchCategory = true;
        if (categoryFilter === 'GOALS') matchCategory = (a.goals || 0) > 0;
        else if (categoryFilter === 'YELLOW') matchCategory = (a.yellowCards || 0) > 0;
        else if (categoryFilter === 'RED') matchCategory = (a.redCards || 0) > 0;

        return matchSearch && matchTeam && matchCategory;
      })
      .sort((a, b) => {
        if (sortOption === 'GOALS_DESC') return (b.goals || 0) - (a.goals || 0);
        if (sortOption === 'CARDS_DESC') {
          const scoreB = (b.redCards || 0) * 3 + (b.yellowCards || 0);
          const scoreA = (a.redCards || 0) * 3 + (a.yellowCards || 0);
          return scoreB - scoreA;
        }
        if (sortOption === 'NUMBER_ASC') return (a.number || 0) - (b.number || 0);
        if (sortOption === 'NAME_ASC') return a.name.localeCompare(b.name);
        return 0;
      });
  }, [athletesList, search, selectedTeamFilter, categoryFilter, sortOption]);

  // Reset pagination saat filter berganti
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedTeamFilter, categoryFilter, sortOption]);

  const totalPages = Math.max(1, Math.ceil(filteredAthletes.length / pageSize));
  const paginatedAthletes = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAthletes.slice(start, start + pageSize);
  }, [filteredAthletes, currentPage, pageSize]);

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-barlow font-bold text-xs shadow-lg flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Utama Juri */}
      <AdminPageHeaderCard
        icon={Award}
        category="PENCATAT RESMI MEJA JURI • SAUMA ARENA MMFC I"
        title="Performa &amp; Disiplin Pemain"
        description="Pencatatan statistik individu pemain mencakup gol, kartu kuning, dan kartu merah yang tersinkronisasi dengan data atlet turnamen."
        action={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSaveAllToDatabase}
              disabled={isSavingDb}
              className="btn-tactile px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-barlow font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSavingDb ? 'Menyimpan...' : 'Simpan ke Database'}</span>
            </button>
            <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-right">
              <div>
                <span className="text-[10px] font-barlow font-bold uppercase tracking-wider text-[var(--text-muted)] block">
                  Petugas Pencatat
                </span>
                <span className="text-xs font-bold text-[var(--color-arena-primary)] truncate max-w-[140px] block">
                  {user?.name || 'Wasit Meja Lapangan'}
                </span>
              </div>
            </div>
          </div>
        }
      />

      {/* Kartu Ringkasan Statistik */}
      <PerformanceStatCards
        totalGoals={totalGoals}
        totalYellowCards={totalYellowCards}
        totalRedCards={totalRedCards}
        totalAthletes={athletesList.length}
        topScorer={topScorer}
      />

      {/* Toolbar Filter & Pencarian */}
      <PerformanceToolbar
        search={search}
        onSearchChange={setSearch}
        selectedTeamFilter={selectedTeamFilter}
        onSelectedTeamChange={setSelectedTeamFilter}
        sortOption={sortOption}
        onSortChange={setSortOption}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        athletesList={athletesList}
      />

      {/* Daftar Baris Pemain */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs text-[var(--text-muted)] px-1 font-barlow font-bold uppercase tracking-wider">
          <span>Menampilkan {filteredAthletes.length} Atlet Terpilih</span>
          <span>Halaman {currentPage} dari {totalPages}</span>
        </div>

        {paginatedAthletes.length === 0 ? (
          <div className="py-16 text-center bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6">
            <Award className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-2 opacity-50" />
            <p className="text-sm font-bold text-[var(--text-main)]">Tidak ada atlet yang cocok</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Coba sesuaikan kata kunci pencarian atau ubah filter tim/kategori.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setSelectedTeamFilter('ALL');
                setCategoryFilter('ALL');
              }}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-muted)] text-xs font-bold text-[var(--text-main)] hover:bg-[var(--bg-surface)] cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filter</span>
            </button>
          </div>
        ) : (
          paginatedAthletes.map((athlete) => (
            <PlayerPerformanceRow
              key={`${athlete.teamId}-${athlete.id}`}
              athlete={athlete}
              onUpdateStat={handleUpdateStat}
            />
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)]">
          <p className="text-xs text-[var(--text-muted)] font-medium">
            Halaman {currentPage} dari {totalPages} ({filteredAthletes.length} pemain)
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs font-bold text-[var(--text-main)] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--bg-muted)] cursor-pointer flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Sebelumnya</span>
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs font-bold text-[var(--text-main)] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--bg-muted)] cursor-pointer flex items-center gap-1"
            >
              <span>Selanjutnya</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

