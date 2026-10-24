'use client';

import React, { useState } from 'react';
import { Users, Plus, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { RegisteredPlayer, TeamRegistrationData } from '@/types/registration';

interface StepRosterProps {
  data: TeamRegistrationData;
  onChange: (fields: Partial<TeamRegistrationData>) => void;
}

const SAMPLE_ROSTER: RegisteredPlayer[] = [
  { id: 'sample-1', name: 'Rizky Alamsyah', number: 1, position: 'Kiper', nisn: '0129847101' },
  { id: 'sample-2', name: 'Dimas Pratama', number: 7, position: 'Flank', nisn: '0129847102' },
  { id: 'sample-3', name: 'Fikri Haikal', number: 10, position: 'Pivot', nisn: '0129847103' },
  { id: 'sample-4', name: 'Bayu Saputra', number: 4, position: 'Anchor', nisn: '0129847104' },
  { id: 'sample-5', name: 'Zidan Maulana', number: 11, position: 'Flank', nisn: '0129847105' },
];

export const StepRoster: React.FC<StepRosterProps> = ({ data, onChange }) => {
  const [playerName, setPlayerName] = useState('');
  const [playerNumber, setPlayerNumber] = useState<number | ''>('');
  const [playerPosition, setPlayerPosition] = useState('Flank');
  const [playerNisn, setPlayerNisn] = useState('');
  const [inputError, setInputError] = useState<string | null>(null);

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) {
      setInputError('Nama lengkap pemain wajib diisi.');
      return;
    }
    if (typeof playerNumber !== 'number' || playerNumber < 1 || playerNumber > 99) {
      setInputError('Nomor punggung harus angka antara 1 sampai 99.');
      return;
    }
    if (data.players.some((p) => p.number === playerNumber)) {
      setInputError(`Nomor punggung ${playerNumber} sudah digunakan oleh pemain lain.`);
      return;
    }
    if (data.players.length >= 12) {
      setInputError('Maksimal 12 pemain dalam satu kontingen tim futsal.');
      return;
    }

    const newPlayer: RegisteredPlayer = {
      id: `p-${Date.now()}`,
      name: playerName.trim(),
      number: playerNumber,
      position: playerPosition,
      nisn: playerNisn.trim() || 'Terdata di Sekolah',
    };

    onChange({ players: [...data.players, newPlayer] });
    setPlayerName('');
    setPlayerNumber('');
    setPlayerNisn('');
    setInputError(null);
  };

  const handleRemovePlayer = (id: string) => {
    onChange({ players: data.players.filter((p) => p.id !== id) });
  };

  const handleApplySampleRoster = () => {
    onChange({ players: [...SAMPLE_ROSTER] });
    setInputError(null);
  };

  const isRosterComplete = data.players.length >= 5;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-4">
        <div>
          <h4 className="font-extrabold text-base text-[var(--text-main)] font-[var(--font-display)] flex items-center gap-2">
            <Users className="w-4 h-4 text-[var(--color-arena-primary)]" />
            <span>Langkah 3: Roster Skuad Atlet (Min. 5 Pemain)</span>
          </h4>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Daftarkan minimal 5 pemain sah yang terdaftar dalam data pokok pendidikan (Dapodik/EMIS).
          </p>
        </div>

        {data.players.length === 0 && (
          <button
            type="button"
            onClick={handleApplySampleRoster}
            className="btn-tactile text-xs font-bold px-3 py-1.5 rounded-xl bg-[var(--color-arena-primary-light)] text-[var(--color-arena-primary)] border border-[var(--border-subtle)] hover:bg-[var(--color-arena-primary)] hover:text-white transition-colors flex items-center gap-1.5 self-start sm:self-auto shrink-0"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Isi Roster Contoh</span>
          </button>
        )}
      </div>

      {/* Box Status Kuota Roster */}
      <div className={`p-3.5 rounded-xl border text-xs flex items-center justify-between ${
        isRosterComplete
          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
          : 'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200'
      }`}>
        <div className="flex items-center gap-2">
          {isRosterComplete ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
          )}
          <span>
            {isRosterComplete
              ? `Persyaratan terpenuhi: ${data.players.length} pemain siap bertanding.`
              : `Kurang ${5 - data.players.length} pemain lagi untuk memenuhi syarat tanding (minimal 5 pemain).`}
          </span>
        </div>
        <span className="font-mono font-bold text-xs">
          {data.players.length} / 12 Pemain
        </span>
      </div>

      {/* Form Tambah Pemain Baru */}
      <form onSubmit={handleAddPlayer} className="p-4 rounded-2xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] space-y-3">
        <span className="text-xs font-bold text-[var(--text-main)] block">
          Tambah Pemain Baru
        </span>

        {inputError && (
          <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{inputError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="sm:col-span-2">
            <label htmlFor="reg-pname" className="block text-[11px] font-semibold text-[var(--text-main)] mb-1">
              Nama Lengkap Siswa
            </label>
            <input
              id="reg-pname"
              type="text"
              placeholder="Nama atlet..."
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-main)] text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-arena-primary)]"
            />
          </div>

          <div>
            <label htmlFor="reg-pnum" className="block text-[11px] font-semibold text-[var(--text-main)] mb-1">
              No. Punggung (1-99)
            </label>
            <input
              id="reg-pnum"
              type="number"
              min={1}
              max={99}
              placeholder="No"
              value={playerNumber}
              onChange={(e) => setPlayerNumber(e.target.value === '' ? '' : parseInt(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-main)] font-mono font-bold text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-arena-primary)]"
            />
          </div>

          <div>
            <label htmlFor="reg-ppos" className="block text-[11px] font-semibold text-[var(--text-main)] mb-1">
              Posisi Bermain
            </label>
            <select
              id="reg-ppos"
              value={playerPosition}
              onChange={(e) => setPlayerPosition(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-main)] text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-arena-primary)]"
            >
              <option value="Kiper">Kiper</option>
              <option value="Anchor">Anchor (Bek)</option>
              <option value="Flank">Flank (Sayap)</option>
              <option value="Pivot">Pivot (Depan)</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div className="flex-1 max-w-sm">
            <input
              type="text"
              placeholder="NISN Siswa (Opsional/Bisa saat TM)"
              value={playerNisn}
              onChange={(e) => setPlayerNisn(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-main)] text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[var(--color-arena-primary)]"
            />
          </div>

          <button
            type="submit"
            className="btn-tactile px-4 py-2 rounded-xl text-xs font-bold bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] text-white flex items-center justify-center gap-1.5 min-h-[38px] transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Tambahkan ke Skuad</span>
          </button>
        </div>
      </form>

      {/* Tabel Skuad Pemain Terdaftar */}
      <div className="overflow-x-auto rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[var(--bg-muted)] text-[var(--text-muted)] text-[11px] uppercase tracking-wider font-bold border-b border-[var(--border-subtle)] font-mono">
              <th className="py-2.5 px-3 text-center w-12">No</th>
              <th className="py-2.5 px-4 font-sans">Nama Siswa / Atlet</th>
              <th className="py-2.5 px-3 text-center">Posisi</th>
              <th className="py-2.5 px-3 font-mono">NISN</th>
              <th className="py-2.5 px-3 text-center w-16">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)]">
            {data.players.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-[var(--text-muted)] text-xs">
                  Belum ada pemain yang ditambahkan ke skuad. Silakan isi form di atas.
                </td>
              </tr>
            ) : (
              data.players.map((player) => (
                <tr key={player.id} className="hover:bg-[var(--bg-muted)]/50 transition-colors">
                  <td className="py-2.5 px-3 text-center">
                    <span className="w-7 h-7 rounded-lg bg-[var(--color-arena-primary-light)] text-[var(--color-arena-primary)] font-black text-xs inline-flex items-center justify-center font-mono border border-[var(--border-subtle)]">
                      {player.number}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 font-bold text-[var(--text-main)]">
                    {player.name}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[var(--bg-muted)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
                      {player.position}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-[var(--text-muted)]">
                    {player.nisn}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemovePlayer(player.id)}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                      title={`Hapus ${player.name}`}
                      aria-label={`Hapus ${player.name}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
