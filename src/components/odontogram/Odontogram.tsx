'use client';

import React, { useState } from 'react';
import { ToothStatus } from '@/types';
import { Sparkles, Layers, Info, Check, RefreshCw } from 'lucide-react';

export interface ToothData {
  toothNumber: number;
  status: ToothStatus;
  surfaces?: string[];
  notes?: string | null;
  history?: Array<{
    date: string;
    procedure: string;
    notes?: string;
  }>;
}

interface OdontogramProps {
  teethData: Record<number, ToothData>;
  onSelectTooth: (toothNumber: number) => void;
  selectedToothNumber?: number | null;
  isReadOnly?: boolean;
}

// Couleurs et labels standardisés
export const STATUS_CONFIG: Record<
  ToothStatus,
  { label: string; bg: string; border: string; text: string; fill: string; dot: string }
> = {
  SAINE: {
    label: 'Saine',
    bg: 'bg-emerald-50',
    border: 'border-emerald-300',
    text: 'text-emerald-700',
    fill: '#ecfdf5',
    dot: 'bg-emerald-500',
  },
  CARIE: {
    label: 'Carie active',
    bg: 'bg-rose-100',
    border: 'border-rose-400',
    text: 'text-rose-700',
    fill: '#ef4444',
    dot: 'bg-rose-500',
  },
  DEVITALISEE: {
    label: 'Dévitalisée (Endo)',
    bg: 'bg-amber-100',
    border: 'border-amber-400',
    text: 'text-amber-800',
    fill: '#f59e0b',
    dot: 'bg-amber-500',
  },
  COURONNE: {
    label: 'Couronne prothétique',
    bg: 'bg-blue-100',
    border: 'border-blue-400',
    text: 'text-blue-700',
    fill: '#2563eb',
    dot: 'bg-blue-500',
  },
  BRIDGE: {
    label: 'Élément de Bridge',
    bg: 'bg-purple-100',
    border: 'border-purple-400',
    text: 'text-purple-700',
    fill: '#9333ea',
    dot: 'bg-purple-500',
  },
  IMPLANT: {
    label: 'Implant titane',
    bg: 'bg-cyan-100',
    border: 'border-cyan-400',
    text: 'text-cyan-700',
    fill: '#06b6d4',
    dot: 'bg-cyan-500',
  },
  ABSENTE: {
    label: 'Dent absente',
    bg: 'bg-slate-100',
    border: 'border-slate-400',
    text: 'text-slate-600',
    fill: '#64748b',
    dot: 'bg-slate-500',
  },
  A_EXTRAIRE: {
    label: 'À extraire',
    bg: 'bg-pink-100',
    border: 'border-pink-400',
    text: 'text-pink-700',
    fill: '#f43f5e',
    dot: 'bg-pink-500',
  },
};

export default function Odontogram({
  teethData,
  onSelectTooth,
  selectedToothNumber,
  isReadOnly = false,
}: OdontogramProps) {
  const [activeTab, setActiveTab] = useState<'ADULTE' | 'ENFANT'>('ADULTE');

  // Numérotation FDI
  // Adulte
  const upperRightAdult = [18, 17, 16, 15, 14, 13, 12, 11];
  const upperLeftAdult = [21, 22, 23, 24, 25, 26, 27, 28];
  const lowerRightAdult = [48, 47, 46, 45, 44, 43, 42, 41];
  const lowerLeftAdult = [31, 32, 33, 34, 35, 36, 37, 38];

  // Enfant (Dents déciduales)
  const upperRightChild = [55, 54, 53, 52, 51];
  const upperLeftChild = [61, 62, 63, 64, 65];
  const lowerRightChild = [85, 84, 83, 82, 81];
  const lowerLeftChild = [71, 72, 73, 74, 75];

  // Rendu graphique d'une dent individuelle (Anatomie avec 5 surfaces cliquables)
  const renderTooth = (num: number, isUpper: boolean) => {
    const data = teethData[num] || { toothNumber: num, status: 'SAINE' as ToothStatus };
    const status = data.status || 'SAINE';
    const cfg = STATUS_CONFIG[status];
    const isSelected = selectedToothNumber === num;

    const isMolarOrPremolar =
      (num >= 14 && num <= 18) ||
      (num >= 24 && num <= 28) ||
      (num >= 34 && num <= 38) ||
      (num >= 44 && num <= 48) ||
      num === 54 ||
      num === 55 ||
      num === 64 ||
      num === 65 ||
      num === 74 ||
      num === 75 ||
      num === 84 ||
      num === 85;

    return (
      <div
        key={num}
        onClick={() => onSelectTooth(num)}
        className={`flex flex-col items-center group cursor-pointer p-1 rounded-xl transition-all duration-150 ${
          isSelected
            ? 'ring-2 ring-sky-500 bg-sky-50 shadow-md scale-105'
            : 'hover:bg-slate-100 hover:scale-105'
        }`}
      >
        {/* Numéro FDI haut */}
        {isUpper && (
          <span
            className={`text-[11px] font-black mb-1 px-1.5 py-0.5 rounded ${
              isSelected ? 'bg-sky-600 text-white' : 'text-slate-600 group-hover:text-sky-600'
            }`}
          >
            {num}
          </span>
        )}

        {/* SVG Représentation Anatomique */}
        <div className="relative w-8 h-10 flex items-center justify-center">
          <svg
            viewBox="0 0 40 50"
            className="w-full h-full drop-shadow-sm transition-transform"
          >
            {/* Racine de la dent */}
            {isUpper ? (
              <path
                d={
                  isMolarOrPremolar
                    ? 'M 14 18 C 12 5, 8 2, 10 2 C 14 2, 18 10, 20 18 C 22 10, 26 2, 30 2 C 32 2, 28 5, 26 18 Z'
                    : 'M 16 18 C 15 6, 18 2, 20 2 C 22 2, 25 6, 24 18 Z'
                }
                fill={status === 'DEVITALISEE' ? '#f59e0b' : status === 'IMPLANT' ? '#06b6d4' : '#e2e8f0'}
                stroke="#94a3b8"
                strokeWidth="1.2"
              />
            ) : (
              <path
                d={
                  isMolarOrPremolar
                    ? 'M 14 32 C 12 45, 8 48, 10 48 C 14 48, 18 40, 20 32 C 22 40, 26 48, 30 48 C 32 48, 28 45, 26 32 Z'
                    : 'M 16 32 C 15 44, 18 48, 20 48 C 22 48, 25 44, 24 32 Z'
                }
                fill={status === 'DEVITALISEE' ? '#f59e0b' : status === 'IMPLANT' ? '#06b6d4' : '#e2e8f0'}
                stroke="#94a3b8"
                strokeWidth="1.2"
              />
            )}

            {/* Couronne de la dent (5 surfaces anatomiques) */}
            <g transform={isUpper ? 'translate(0, 16)' : 'translate(0, 4)'}>
              {/* Fond Couronne */}
              <rect
                x="6"
                y="6"
                width="28"
                height="24"
                rx="5"
                fill={status === 'SAINE' ? '#ffffff' : cfg.fill}
                stroke="#475569"
                strokeWidth="1.5"
                opacity={status === 'ABSENTE' ? 0.3 : 1}
              />

              {/* Lignes anatomiques des surfaces occlusales */}
              {isMolarOrPremolar && status !== 'ABSENTE' && (
                <>
                  <polygon
                    points="10,10 30,10 25,15 15,15"
                    fill={status === 'CARIE' ? '#f87171' : 'none'}
                    stroke="#94a3b8"
                    strokeWidth="0.8"
                  />
                  <polygon
                    points="10,26 30,26 25,21 15,21"
                    fill={status === 'CARIE' ? '#f87171' : 'none'}
                    stroke="#94a3b8"
                    strokeWidth="0.8"
                  />
                  <polygon
                    points="10,10 10,26 15,21 15,15"
                    fill={status === 'CARIE' ? '#f87171' : 'none'}
                    stroke="#94a3b8"
                    strokeWidth="0.8"
                  />
                  <polygon
                    points="30,10 30,26 25,21 25,15"
                    fill={status === 'CARIE' ? '#f87171' : 'none'}
                    stroke="#94a3b8"
                    strokeWidth="0.8"
                  />
                  <rect
                    x="15"
                    y="15"
                    width="10"
                    height="6"
                    fill={status === 'CARIE' ? '#ef4444' : '#f8fafc'}
                    stroke="#94a3b8"
                    strokeWidth="0.8"
                  />
                </>
              )}

              {/* Croix rouge pour dent à extraire */}
              {status === 'A_EXTRAIRE' && (
                <path
                  d="M 10 10 L 30 26 M 30 10 L 10 26"
                  stroke="#e11d48"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              )}

              {/* Croix barrée pour dent absente */}
              {status === 'ABSENTE' && (
                <path
                  d="M 8 8 L 32 28 M 32 8 L 8 28"
                  stroke="#64748b"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              )}

              {/* Symbole implant */}
              {status === 'IMPLANT' && (
                <g stroke="#ffffff" strokeWidth="1.5">
                  <line x1="20" y1="10" x2="20" y2="26" />
                  <line x1="14" y1="14" x2="26" y2="14" />
                  <line x1="14" y1="18" x2="26" y2="18" />
                  <line x1="14" y1="22" x2="26" y2="22" />
                </g>
              )}

              {/* Symbole Couronne prothétique */}
              {status === 'COURONNE' && (
                <path
                  d="M 12 24 L 14 12 L 18 16 L 20 12 L 22 16 L 26 12 L 28 24 Z"
                  fill="#ffffff"
                  opacity="0.9"
                />
              )}
            </g>
          </svg>

          {/* Pastille état */}
          <span
            className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-white ${cfg.dot}`}
            title={`${num} : ${cfg.label}`}
          />
        </div>

        {/* Numéro FDI bas */}
        {!isUpper && (
          <span
            className={`text-[11px] font-black mt-1 px-1.5 py-0.5 rounded ${
              isSelected ? 'bg-sky-600 text-white' : 'text-slate-600 group-hover:text-sky-600'
            }`}
          >
            {num}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-6">
      {/* Header Odontogramme */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🦷</span>
            <h3 className="text-base font-black text-slate-800">
              Odontogramme Interactif (Système FDI)
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Cliquez sur une dent pour mettre à jour son état, ajouter une carie, prothèse ou intervention
          </p>
        </div>

        {/* Toggle Adulte / Enfant */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab('ADULTE')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'ADULTE'
                ? 'bg-white text-sky-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Denture Permanente (11 - 48)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ENFANT')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'ENFANT'
                ? 'bg-white text-sky-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Denture Temporaire / Enfant (51 - 85)
          </button>
        </div>
      </div>

      {/* Vue Arcade Dentaire */}
      <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200/80 relative">
        {/* Lignes de repère Médiane & Occlusale */}
        <div className="absolute inset-y-6 left-1/2 w-px bg-dashed bg-sky-200 pointer-events-none -translate-x-1/2 z-0" />
        <div className="absolute inset-x-6 top-1/2 h-px bg-slate-200 pointer-events-none -translate-y-1/2 z-0" />

        {/* Labels Quadrants */}
        <div className="flex justify-between text-[11px] font-bold text-slate-400 mb-2 px-2">
          <span>Quadrant Droit (Patient)</span>
          <span>Quadrant Gauche (Patient)</span>
        </div>

        {activeTab === 'ADULTE' ? (
          <div className="space-y-8 relative z-10">
            {/* Arcade Supérieure (Maxillaire) */}
            <div className="flex items-center justify-center gap-1 sm:gap-2 flex-wrap sm:flex-nowrap">
              {/* Droit 18 -> 11 */}
              <div className="flex items-center gap-1">
                {upperRightAdult.map((n) => renderTooth(n, true))}
              </div>
              <div className="w-4" /> {/* Séparation médiane */}
              {/* Gauche 21 -> 28 */}
              <div className="flex items-center gap-1">
                {upperLeftAdult.map((n) => renderTooth(n, true))}
              </div>
            </div>

            {/* Label Arcade */}
            <div className="text-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                PLAN D'OCCLUSION
              </span>
            </div>

            {/* Arcade Inférieure (Mandibule) */}
            <div className="flex items-center justify-center gap-1 sm:gap-2 flex-wrap sm:flex-nowrap">
              {/* Droit 48 -> 41 */}
              <div className="flex items-center gap-1">
                {lowerRightAdult.map((n) => renderTooth(n, false))}
              </div>
              <div className="w-4" /> {/* Séparation médiane */}
              {/* Gauche 31 -> 38 */}
              <div className="flex items-center gap-1">
                {lowerLeftAdult.map((n) => renderTooth(n, false))}
              </div>
            </div>
          </div>
        ) : (
          /* Denture Enfant */
          <div className="space-y-8 relative z-10">
            <div className="flex items-center justify-center gap-1 sm:gap-2">
              <div className="flex items-center gap-1">
                {upperRightChild.map((n) => renderTooth(n, true))}
              </div>
              <div className="w-4" />
              <div className="flex items-center gap-1">
                {upperLeftChild.map((n) => renderTooth(n, true))}
              </div>
            </div>

            <div className="text-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                DENTS DE LAIT (TEMPORAIRES)
              </span>
            </div>

            <div className="flex items-center justify-center gap-1 sm:gap-2">
              <div className="flex items-center gap-1">
                {lowerRightChild.map((n) => renderTooth(n, false))}
              </div>
              <div className="w-4" />
              <div className="flex items-center gap-1">
                {lowerLeftChild.map((n) => renderTooth(n, false))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Légende Interactive & Code Couleur */}
      <div className="pt-2">
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5">
          Légende & Codes Couleurs Cliniques
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {(Object.keys(STATUS_CONFIG) as ToothStatus[]).map((st) => {
            const item = STATUS_CONFIG[st];
            const count = Object.values(teethData).filter((d) => d.status === st).length;
            return (
              <div
                key={st}
                className={`p-2 rounded-xl border flex items-center gap-2 ${item.bg} ${item.border}`}
              >
                <span className={`w-3 h-3 rounded-full ${item.dot} shrink-0`} />
                <div className="min-w-0">
                  <p className={`text-[11px] font-bold truncate ${item.text}`}>{item.label}</p>
                  <p className="text-[10px] text-slate-500 font-medium">{count} dent(s)</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
