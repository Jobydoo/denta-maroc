'use client';

import React, { useState } from 'react';
import { ToothStatus } from '@/types';
import { STATUS_CONFIG } from './Odontogram';
import { X, Save, History, PlusCircle, Trash2 } from 'lucide-react';

interface ToothModalProps {
  isOpen: boolean;
  onClose: () => void;
  toothNumber: number;
  currentStatus: ToothStatus;
  currentSurfaces?: string[];
  currentNotes?: string | null;
  history?: Array<{
    date: string;
    procedure: string;
    notes?: string;
  }>;
  onSave: (data: {
    toothNumber: number;
    status: ToothStatus;
    surfaces: string[];
    notes: string;
    newProcedure?: string;
    newPrice?: number;
  }) => Promise<void>;
}

export default function ToothModal({
  isOpen,
  onClose,
  toothNumber,
  currentStatus,
  currentSurfaces = [],
  currentNotes = '',
  history = [],
  onSave,
}: ToothModalProps) {
  const [status, setStatus] = useState<ToothStatus>(currentStatus);
  const [surfaces, setSurfaces] = useState<string[]>(currentSurfaces);
  const [notes, setNotes] = useState<string>(currentNotes || '');
  const [addAct, setAddAct] = useState(false);
  const [actName, setActName] = useState('');
  const [actPrice, setActPrice] = useState<number>(500);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const toggleSurface = (surf: string) => {
    if (surfaces.includes(surf)) {
      setSurfaces(surfaces.filter((s) => s !== surf));
    } else {
      setSurfaces([...surfaces, surf]);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave({
        toothNumber,
        status,
        surfaces,
        notes,
        newProcedure: addAct ? actName : undefined,
        newPrice: addAct ? actPrice : undefined,
      });
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Modal */}
        <div className="px-6 py-4 bg-gradient-to-r from-sky-600 to-teal-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center font-black text-lg">
              {toothNumber}
            </div>
            <div>
              <h3 className="font-black text-base">Fiche Clinique Dent #{toothNumber}</h3>
              <p className="text-xs text-sky-100">Système de notation FDI</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:bg-white/20 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {/* Sélection de l'état */}
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
              État Actuel de la Dent
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(STATUS_CONFIG) as ToothStatus[]).map((st) => {
                const cfg = STATUS_CONFIG[st];
                const isSelected = status === st;
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatus(st)}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                      isSelected
                        ? `${cfg.bg} ${cfg.border} ring-2 ring-sky-500 shadow-sm font-bold`
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className={`w-3 h-3 rounded-full ${cfg.dot}`} />
                    <span className="text-xs">{cfg.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sélection des surfaces anatomiques atteintes */}
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
              Surfaces Atteintes / Concernées
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'occlusal', label: 'Occlusale (O) / Incisale' },
                { id: 'mesial', label: 'Mésiale (M)' },
                { id: 'distal', label: 'Distale (D)' },
                { id: 'vestibular', label: 'Vestibulaire (V)' },
                { id: 'lingual', label: 'Linguale / Palatine (L)' },
                { id: 'cervical', label: 'Cervicale (C)' },
              ].map((surf) => {
                const active = surfaces.includes(surf.id);
                return (
                  <button
                    key={surf.id}
                    type="button"
                    onClick={() => toggleSurface(surf.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      active
                        ? 'bg-rose-500 text-white border-rose-600 shadow-sm'
                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {surf.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes cliniques pour cette dent */}
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
              Observations & Diagnostic Clinique
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Carie profonde avec proximité pulpaire, test de vitalité positif, détartrage spécifique..."
              className="w-full p-3 text-xs rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
            />
          </div>

          {/* Option : Enregistrer directement un acte réalisé */}
          <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
                <PlusCircle className="w-4 h-4 text-sky-600" />
                Enregistrer un acte réalisé lors de cette séance
              </span>
              <input
                type="checkbox"
                checked={addAct}
                onChange={(e) => setAddAct(e.target.checked)}
                className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
              />
            </div>

            {addAct && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Nom de l'acte dentaire
                  </label>
                  <input
                    type="text"
                    value={actName}
                    onChange={(e) => setActName(e.target.value)}
                    placeholder="Ex: Restauration Composite 2 faces"
                    className="w-full p-2 text-xs rounded-xl bg-white border border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Tarif (MAD)
                  </label>
                  <input
                    type="number"
                    value={actPrice}
                    onChange={(e) => setActPrice(Number(e.target.value))}
                    className="w-full p-2 text-xs rounded-xl bg-white border border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Historique des interventions sur cette dent */}
          {history.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-2">
                <History className="w-4 h-4 text-slate-500" />
                <span>Historique des soins sur la dent #{toothNumber}</span>
              </div>
              <div className="space-y-2">
                {history.map((h, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600"
                  >
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>{h.procedure}</span>
                      <span className="text-slate-400 font-normal">{h.date}</span>
                    </div>
                    {h.notes && <p className="text-[11px] text-slate-500 mt-0.5">{h.notes}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Annuler
          </button>
          <button
            type="button"
            disabled={isSaving}
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white shadow-md shadow-sky-600/20 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Enregistrement...' : 'Enregistrer la Dent'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
