'use client';

import React, { useState } from 'react';
import { PRESET_MEDICATIONS, StandardMedication } from '@/lib/moroccan-data';
import { Plus, Trash2, Printer, X, FileText, CheckCircle2 } from 'lucide-react';

interface PrescriptionItem {
  id: string;
  name: string;
  dosage: string;
  instructions: string;
  duration: string;
}

interface PrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  patientCin?: string | null;
  patientAge?: number;
  doctorName?: string;
  clinicName?: string;
  clinicAddress?: string;
  clinicInpe?: string;
  clinicIce?: string;
}

export default function PrescriptionModal({
  isOpen,
  onClose,
  patientName,
  patientCin,
  patientAge,
  doctorName = 'Dr. Mehdi Alami',
  clinicName = 'Cabinet Dentaire Dr. Mehdi Alami',
  clinicAddress = '145 Boulevard d\'Anfa, 4ème étage, Casablanca',
  clinicInpe = '098765432',
  clinicIce = '002345678000045',
}: PrescriptionModalProps) {
  const [items, setItems] = useState<PrescriptionItem[]>([
    {
      id: '1',
      name: 'Amoxicilline 1g (Clamoxyl)',
      dosage: '1 comprimé matin et soir',
      instructions: 'Au début des repas',
      duration: '6 jours',
    },
    {
      id: '2',
      name: 'Paracétamol 1g (Doliprane)',
      dosage: '1 comprimé toutes les 6 heures si douleur',
      instructions: 'Ne pas dépasser 3g par jour',
      duration: '4 jours',
    },
  ]);

  const [includeCertificate, setIncludeCertificate] = useState(false);
  const [restDays, setRestDays] = useState(2);
  const [certificateReason, setCertificateReason] = useState('Soins bucco-dentaires et avulsion chirurgicale');
  const [todayStr] = useState(
    new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date())
  );

  if (!isOpen) return null;

  const handleAddPreset = (med: StandardMedication) => {
    setItems((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        name: med.name,
        dosage: med.dosage,
        instructions: med.instructions,
        duration: med.duration,
      },
    ]);
  };

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in print:p-0 print:bg-white">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] print:max-h-none print:shadow-none print:border-none print:w-full">
        {/* Modal Controls Bar (Hidden when printing) */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-400" />
            <h3 className="font-bold text-sm">Générateur d'Ordonnance & Certificat Médical</h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold text-xs transition-colors shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer (A4 / A5)</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Medication Library Selector (Hidden when printing) */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 print:hidden space-y-2">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Bibliothèque de Médicaments Usuels (Ajout en 1 Clic) :
          </p>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_MEDICATIONS.map((med) => (
              <button
                key={med.id}
                type="button"
                onClick={() => handleAddPreset(med)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white border border-slate-300 hover:border-teal-500 hover:bg-teal-50/50 text-[11px] font-semibold text-slate-700 transition-colors"
              >
                <Plus className="w-3 h-3 text-teal-600" />
                <span>{med.name.split('(')[0]}</span>
              </button>
            ))}
          </div>

          {/* Toggle Certificat Médical */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-200/80">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={includeCertificate}
                onChange={(e) => setIncludeCertificate(e.target.checked)}
                className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
              />
              <span>Joindre un Certificat Médical d'Arrêt de Travail / Repos</span>
            </label>
            {includeCertificate && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-600">Durée :</span>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={restDays}
                  onChange={(e) => setRestDays(Number(e.target.value))}
                  className="w-16 px-2 py-1 text-xs font-bold border border-slate-300 rounded-lg text-center"
                />
                <span className="text-xs text-slate-600">jour(s)</span>
              </div>
            )}
          </div>
        </div>

        {/* Printable Prescription Body (Format A4/A5 Professionnel Marocain) */}
        <div className="p-8 overflow-y-auto flex-1 font-serif text-slate-900 bg-white print:p-0 print:overflow-visible">
          {/* En-Tête Officiel du Cabinet Dentaire */}
          <div className="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-start">
            <div>
              <h1 className="text-xl font-bold font-sans tracking-tight text-slate-950 uppercase">
                {doctorName}
              </h1>
              <p className="text-xs font-sans text-slate-600 font-semibold">
                Chirurgien-Dentiste • Lauréat de la Faculté de Médecine Dentaire
              </p>
              <p className="text-[11px] font-sans text-slate-500">
                Implantologie, Esthétique du Sourire & Parodontologie
              </p>
              <p className="text-[11px] font-sans text-slate-500 mt-1">
                INPE : <strong className="font-mono text-slate-800">{clinicInpe}</strong> • ICE : <strong className="font-mono text-slate-800">{clinicIce}</strong>
              </p>
            </div>
            <div className="text-right font-sans text-xs text-slate-600">
              <p className="font-bold text-slate-900">{clinicName}</p>
              <p>{clinicAddress}</p>
              <p className="font-medium text-slate-700">Tél : +212 5 22 20 30 40</p>
              <p className="mt-2 text-slate-900 font-semibold">
                Casablanca, le : <span className="font-mono font-bold">{todayStr}</span>
              </p>
            </div>
          </div>

          {/* Fiche Patient Info */}
          <div className="mb-6 font-sans flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div>
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Patient</p>
              <p className="text-base font-black text-slate-900">{patientName}</p>
            </div>
            <div className="text-right text-xs">
              {patientCin && (
                <p className="text-slate-600">
                  CIN : <strong className="font-mono text-slate-800">{patientCin}</strong>
                </p>
              )}
              {patientAge && <p className="text-slate-600">Âge : <strong>{patientAge} ans</strong></p>}
            </div>
          </div>

          {/* Titre Ordonnance */}
          <div className="text-center my-6">
            <h2 className="text-lg font-bold tracking-widest uppercase underline underline-offset-8 font-sans">
              ORDONNANCE MÉDICALE
            </h2>
          </div>

          {/* Liste des Médicaments */}
          <div className="space-y-4 mb-8">
            {items.map((item, idx) => (
              <div
                key={item.id}
                className="group relative border-b border-dashed border-slate-200 pb-3"
              >
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="font-sans font-black text-xs text-slate-500">
                      {idx + 1}.
                    </span>
                    <h4 className="text-sm font-bold font-sans text-slate-950">
                      {item.name}
                    </h4>
                  </div>
                  <span className="text-xs font-sans italic text-slate-600 font-semibold">
                    Pendant {item.duration}
                  </span>
                </div>
                <div className="ml-5 text-xs text-slate-700 font-sans mt-0.5 space-y-0.5">
                  <p>• {item.dosage}</p>
                  {item.instructions && (
                    <p className="text-slate-500 italic">• {item.instructions}</p>
                  )}
                </div>

                {/* Bouton supprimer (caché à l'impression) */}
                <button
                  onClick={() => handleRemove(item.id)}
                  className="absolute right-0 top-0 p-1 text-slate-300 hover:text-rose-500 print:hidden opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Supprimer de l'ordonnance"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Certificat Médical de Repos (Optionnel) */}
          {includeCertificate && (
            <div className="mt-8 pt-6 border-t-2 border-slate-800 font-sans">
              <h3 className="text-center font-bold text-sm tracking-wider uppercase mb-3 underline">
                CERTIFICAT MÉDICAL
              </h3>
              <p className="text-xs leading-relaxed text-slate-800">
                Je soussigné, <strong>{doctorName}</strong>, Chirurgien-Dentiste, certifie avoir examiné ce jour le/la nommé(e) <strong>{patientName}</strong>, porteur(se) de la CIN N° <strong>{patientCin || '............'}</strong>, et que son état bucco-dentaire ({certificateReason}) nécessite un repos avec arrêt de travail de <strong>{restDays} ({restDays > 1 ? `${restDays} jours consécutifs` : '1 jour'})</strong>, sauf complications ultérieures, à compter de ce jour.
              </p>
              <p className="text-[11px] text-slate-500 italic mt-1">
                Certificat délivré à l'intéressé(e) pour servir et valoir ce que de droit.
              </p>
            </div>
          )}

          {/* Cachet & Signature du Praticien */}
          <div className="mt-12 flex justify-between items-end font-sans">
            <div className="text-[10px] text-slate-400">
              <p>Document clinique officiel délivré par le {clinicName}</p>
              <p>Validité légale Royaume du Maroc • Art. 78 Code Déontologie</p>
            </div>
            <div className="text-center border border-dashed border-slate-300 rounded-2xl p-4 w-52 bg-slate-50/50">
              <p className="text-xs font-bold text-slate-700 mb-8">Cachet & Signature du Médecin</p>
              <div className="h-10 flex items-center justify-center text-xs text-slate-400 font-serif italic">
                {doctorName}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
