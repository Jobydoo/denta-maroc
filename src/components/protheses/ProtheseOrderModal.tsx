'use client';

import React, { useState } from 'react';
import { ProtheseType, ProtheseStatus } from '@/types';
import { DENTAL_LABS_MOROCCO, VITA_SHADES } from '@/lib/moroccan-data';
import { formatMAD } from '@/lib/utils';
import { Layers, X, Save, Calendar, Printer } from 'lucide-react';

interface ProtheseOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  patientName: string;
  onSave: (order: {
    patientId: string;
    labName: string;
    protheseType: ProtheseType;
    teethNumbers: string;
    vitaShade: string;
    status: ProtheseStatus;
    tryInDate?: string;
    deliveryDate?: string;
    clinicPrice: number;
    labCost: number;
    instructions: string;
  }) => Promise<void>;
}

export default function ProtheseOrderModal({
  isOpen,
  onClose,
  patientId,
  patientName,
  onSave,
}: ProtheseOrderModalProps) {
  const [labName, setLabName] = useState(DENTAL_LABS_MOROCCO[0]);
  const [protheseType, setProtheseType] = useState<ProtheseType>('COURONNE_ZIRCONE');
  const [teethNumbers, setTeethNumbers] = useState('16');
  const [vitaShade, setVitaShade] = useState('A2');
  const [status, setStatus] = useState<ProtheseStatus>('EMPREINTE_PRISE');
  const [tryInDate, setTryInDate] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [clinicPrice, setClinicPrice] = useState<number>(2800);
  const [labCost, setLabCost] = useState<number>(750);
  const [instructions, setInstructions] = useState(
    'Couronne Zircone monolithique multicouche, occlusion soignée, contact proximal serré.'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave({
        patientId,
        labName,
        protheseType,
        teethNumbers,
        vitaShade,
        status,
        tryInDate: tryInDate || undefined,
        deliveryDate: deliveryDate || undefined,
        clinicPrice,
        labCost,
        instructions,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const margin = clinicPrice - labCost;
  const marginPercent = clinicPrice > 0 ? Math.round((margin / clinicPrice) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5" />
            <h3 className="font-bold text-sm">Bon de Commande Laboratoire de Prothèse</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-white/80 hover:bg-white/20 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex justify-between items-center">
            <div>
              <p className="text-slate-500">Patient destinataire :</p>
              <p className="font-black text-slate-900 text-sm">{patientName}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase bg-amber-200 text-amber-900 px-2 py-0.5 rounded">
                Labo Dentaire
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Laboratoire Partenaire</label>
              <select
                value={labName}
                onChange={(e) => setLabName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold focus:bg-white"
              >
                {DENTAL_LABS_MOROCCO.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Type de Prothèse</label>
              <select
                value={protheseType}
                onChange={(e) => setProtheseType(e.target.value as ProtheseType)}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold focus:bg-white"
              >
                <option value="COURONNE_ZIRCONE">Couronne Zircone Monolithique</option>
                <option value="COURONNE_CERAMO_METALLIQUE">Couronne Céramo-Métallique (CCM)</option>
                <option value="BRIDGE_CERAMIQUE">Bridge Céramique / Zircone</option>
                <option value="STELLITE">Stellite Résine / Chrome-Cobalt</option>
                <option value="PROTHESE_COMPLETE">Prothèse Complète Adjointe</option>
                <option value="FACETTE_CERAMIQUE">Facette E.Max Haute Esthétique</option>
                <option value="GOUTTIERE">Gouttière Bruxisme / Occlusale</option>
                <option value="INLAY_ONLAY">Inlay / Onlay Céramique</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Dents Concernées (FDI)</label>
              <input
                type="text"
                placeholder="Ex: 14, 15, 16"
                value={teethNumbers}
                onChange={(e) => setTeethNumbers(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold font-mono focus:bg-white"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Teinte Vita</label>
              <select
                value={vitaShade}
                onChange={(e) => setVitaShade(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold focus:bg-white"
              >
                {VITA_SHADES.map((sh) => (
                  <option key={sh} value={sh}>
                    Teinte {sh}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Date d'Essayage Prévue</label>
              <input
                type="date"
                value={tryInDate}
                onChange={(e) => setTryInDate(e.target.value)}
                className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Date de Livraison Souhaitée</label>
              <input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200"
              />
            </div>
          </div>

          {/* Analyse de rentabilité de l'acte prothétique */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-3 gap-2 text-center">
            <div>
              <label className="text-[10px] text-slate-500 font-bold block mb-0.5">
                Prix Patient (MAD)
              </label>
              <input
                type="number"
                value={clinicPrice}
                onChange={(e) => setClinicPrice(Number(e.target.value))}
                className="w-full p-1.5 text-center font-bold font-mono rounded-lg border border-slate-300"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 font-bold block mb-0.5">
                Coût Labo (MAD)
              </label>
              <input
                type="number"
                value={labCost}
                onChange={(e) => setLabCost(Number(e.target.value))}
                className="w-full p-1.5 text-center font-bold font-mono rounded-lg border border-slate-300 text-rose-600"
              />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold mb-0.5">Marge Brute Cabinet</p>
              <p className="font-black font-mono text-emerald-600 text-sm mt-1">
                {formatMAD(margin)}
              </p>
              <p className="text-[10px] text-emerald-700 font-bold">({marginPercent}%)</p>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Instructions & Spécifications Cliniques pour le Prothésiste
            </label>
            <textarea
              rows={3}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Ex: Épaisseur sous-occlusale, type de congé, translucidité du bord libre, contact avec l'antagoniste..."
              className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-md shadow-amber-600/20 disabled:opacity-50 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Envoi...' : 'Créer la Commande Labo'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
