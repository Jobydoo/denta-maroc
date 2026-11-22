'use client';

import React from 'react';
import {
  AlertTriangle,
  HeartCrack,
  Droplet,
  Baby,
  Pill,
  ShieldAlert,
  Info
} from 'lucide-react';

interface MedicalAlertBannerProps {
  allergies?: string | null;
  chronicDiseases?: string | null;
  heartCondition?: boolean;
  bleedingDisorder?: boolean; // Anticoagulants (Sintrom / AVK)
  isPregnant?: boolean;
  biphosphonates?: boolean; // Risque nécrose osseuse
  medicalNotes?: string | null;
}

export default function MedicalAlertBanner({
  allergies,
  chronicDiseases,
  heartCondition,
  bleedingDisorder,
  isPregnant,
  biphosphonates,
  medicalNotes,
}: MedicalAlertBannerProps) {
  const hasAlert =
    Boolean(allergies) ||
    Boolean(chronicDiseases) ||
    heartCondition ||
    bleedingDisorder ||
    isPregnant ||
    biphosphonates;

  if (!hasAlert && !medicalNotes) {
    return (
      <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 flex items-center gap-3 text-emerald-800 text-xs font-semibold">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
        <span>Anamnèse médicale : Aucun antécédent critique ni allergie signalée. Patient apte aux soins dentaires usuels.</span>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border-2 border-rose-500 bg-rose-50/90 shadow-md shadow-rose-500/10 p-4 space-y-3">
      {/* Alert Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-rose-700 font-black text-sm uppercase tracking-wide">
          <ShieldAlert className="w-5 h-5 text-rose-600 animate-bounce" />
          <span>⚠️ VIGILANCE MÉDICALE CRITIQUE (ANAMNÈSE)</span>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-rose-200 text-rose-900 text-[11px] font-black tracking-wider uppercase">
          Contre-indications
        </span>
      </div>

      {/* Badges and detailed alerts */}
      <div className="flex flex-wrap gap-2 pt-1">
        {allergies && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-rose-300 text-rose-800 text-xs font-bold shadow-sm">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Allergies : <strong>{allergies}</strong></span>
          </div>
        )}

        {bleedingDisorder && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-rose-300 text-rose-800 text-xs font-bold shadow-sm">
            <Droplet className="w-4 h-4 text-rose-600" />
            <span>Risque Hémorragique : <strong>Anticoagulant (Vérifier INR)</strong></span>
          </div>
        )}

        {heartCondition && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-rose-300 text-rose-800 text-xs font-bold shadow-sm">
            <HeartCrack className="w-4 h-4 text-rose-600" />
            <span>Cardiopathie / Valvulopathie : <strong>Antibioprophylaxie requise</strong></span>
          </div>
        )}

        {isPregnant && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-amber-300 text-amber-900 text-xs font-bold shadow-sm">
            <Baby className="w-4 h-4 text-amber-600" />
            <span>Patiente Enceinte : <strong>Éviter AINS & Rayons X inutiles</strong></span>
          </div>
        )}

        {biphosphonates && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-purple-300 text-purple-900 text-xs font-bold shadow-sm">
            <Pill className="w-4 h-4 text-purple-600" />
            <span>Sous Biphosphonates : <strong>Risque d'ostéonécrose des mâchoires</strong></span>
          </div>
        )}

        {chronicDiseases && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-rose-300 text-rose-800 text-xs font-bold shadow-sm">
            <Info className="w-4 h-4 text-rose-600" />
            <span>Pathologies : <strong>{chronicDiseases}</strong></span>
          </div>
        )}
      </div>

      {medicalNotes && (
        <div className="mt-2 p-2.5 rounded-xl bg-white/80 border border-rose-200 text-xs text-rose-900 font-medium">
          <strong>Note Praticien :</strong> {medicalNotes}
        </div>
      )}
    </div>
  );
}
