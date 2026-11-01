'use client';

import React from 'react';
import { ShieldAlert } from 'lucide-react';

interface SupporterCriteriaPenaltyProps {
  incidentViolentChaos: boolean;
  setIncidentViolentChaos: (val: boolean) => void;
  incidentThrowObjects: boolean;
  setIncidentThrowObjects: (val: boolean) => void;
  incidentRacismProvocation: boolean;
  setIncidentRacismProvocation: (val: boolean) => void;
  incidentSmuggleContraband: boolean;
  setIncidentSmuggleContraband: (val: boolean) => void;
  incidentLitteringTribun: boolean;
  setIncidentLitteringTribun: (val: boolean) => void;
  penaltyScore: number;
}

export const SupporterCriteriaPenalty: React.FC<SupporterCriteriaPenaltyProps> = ({
  incidentViolentChaos,
  setIncidentViolentChaos,
  incidentThrowObjects,
  setIncidentThrowObjects,
  incidentRacismProvocation,
  setIncidentRacismProvocation,
  incidentSmuggleContraband,
  setIncidentSmuggleContraband,
  incidentLitteringTribun,
  setIncidentLitteringTribun,
  penaltyScore,
}) => {
  return (
    <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-red-500/20 space-y-4 shadow-xs">
      <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
        <span className="text-xs font-barlow font-bold uppercase tracking-wider text-red-600 dark:text-red-400 flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4" />
          <span>3. Sanksi &amp; Pelanggaran Suporter (Penalti)</span>
        </span>
        <span className="text-[10px] text-red-600 font-mono font-bold">
          Total Sanksi: -{penaltyScore}
        </span>
      </div>

      <div className="space-y-2.5">
        <label className="flex items-center justify-between p-3 rounded-xl bg-red-500/5 border border-red-500/20 hover:bg-red-500/10 cursor-pointer transition-all">
          <span className="text-xs font-barlow font-bold uppercase text-red-700 dark:text-red-300 flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded bg-red-600 text-white font-black text-[10px] font-barlow uppercase">
              RICUH
            </span>
            <span>Membuat kericuhan, kekerasan dll</span>
          </span>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-red-600">-50</span>
            <input
              type="checkbox"
              checked={incidentViolentChaos}
              onChange={(e) => setIncidentViolentChaos(e.target.checked)}
              className="w-4 h-4 rounded text-red-600 focus:ring-0 cursor-pointer"
            />
          </div>
        </label>

        <label className="flex items-center justify-between p-3 rounded-xl bg-red-500/5 border border-red-500/20 hover:bg-red-500/10 cursor-pointer transition-all">
          <span className="text-xs font-barlow font-bold uppercase text-red-700 dark:text-red-300 flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded bg-red-600 text-white font-black text-[10px] font-barlow uppercase">
              LEMPAR
            </span>
            <span>Melempar benda ke dalam lapangan</span>
          </span>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-red-600">-25</span>
            <input
              type="checkbox"
              checked={incidentThrowObjects}
              onChange={(e) => setIncidentThrowObjects(e.target.checked)}
              className="w-4 h-4 rounded text-red-600 focus:ring-0 cursor-pointer"
            />
          </div>
        </label>

        <label className="flex items-center justify-between p-3 rounded-xl bg-red-500/5 border border-red-500/20 hover:bg-red-500/10 cursor-pointer transition-all">
          <span className="text-xs font-barlow font-bold uppercase text-red-700 dark:text-red-300 flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded bg-red-600 text-white font-black text-[10px] font-barlow uppercase">
              RASIS
            </span>
            <span>Melakukan rasis/provokasi</span>
          </span>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-red-600">-15</span>
            <input
              type="checkbox"
              checked={incidentRacismProvocation}
              onChange={(e) => setIncidentRacismProvocation(e.target.checked)}
              className="w-4 h-4 rounded text-red-600 focus:ring-0 cursor-pointer"
            />
          </div>
        </label>

        <label className="flex items-center justify-between p-3 rounded-xl bg-red-500/5 border border-red-500/20 hover:bg-red-500/10 cursor-pointer transition-all">
          <span className="text-xs font-barlow font-bold uppercase text-red-700 dark:text-red-300 flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded bg-red-600 text-white font-black text-[10px] font-barlow uppercase">
              BARANG
            </span>
            <span>Membawa atau menyelundupkan barang yang dilarang</span>
          </span>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-red-600">-5</span>
            <input
              type="checkbox"
              checked={incidentSmuggleContraband}
              onChange={(e) => setIncidentSmuggleContraband(e.target.checked)}
              className="w-4 h-4 rounded text-red-600 focus:ring-0 cursor-pointer"
            />
          </div>
        </label>
      </div>
    </div>
  );
};

