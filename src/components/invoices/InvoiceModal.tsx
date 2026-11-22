'use client';

import React, { useState } from 'react';
import { formatMAD } from '@/lib/utils';
import { MOROCCAN_MUTUALS } from '@/lib/moroccan-data';
import { Plus, Trash2, Printer, X, FileText, CheckCircle2 } from 'lucide-react';

export interface InvoiceItemForm {
  id: string;
  description: string;
  toothNumber?: number;
  quantity: number;
  unitPrice: number;
  amoCode?: string;
}

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  isQuote?: boolean; // Devis or Facture
  patientId: string;
  patientName: string;
  patientCin?: string | null;
  patientMutual?: string;
  doctorName?: string;
  clinicName?: string;
  clinicAddress?: string;
  clinicIce?: string;
  clinicTaxId?: string; // IF
  clinicPatente?: string;
  clinicInpe?: string;
  onSave: (invoiceData: any) => Promise<void>;
}

export default function InvoiceModal({
  isOpen,
  onClose,
  isQuote = false,
  patientId,
  patientName,
  patientCin,
  patientMutual = 'CNOPS',
  doctorName = 'Dr. Mehdi Alami',
  clinicName = 'Cabinet Dentaire Dr. Mehdi Alami',
  clinicAddress = '145 Boulevard d\'Anfa, Maarif, Casablanca',
  clinicIce = '002345678000045',
  clinicTaxId = '45879201',
  clinicPatente = '32415089',
  clinicInpe = '098765432',
  onSave,
}: InvoiceModalProps) {
  const [docNumber] = useState(
    `${isQuote ? 'DEV' : 'FAC'}-2026-${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [mutualType, setMutualType] = useState(patientMutual);
  const [mutualClaimNumber, setMutualClaimNumber] = useState('');
  const [discount, setDiscount] = useState<number>(0);

  const [items, setItems] = useState<InvoiceItemForm[]>([
    {
      id: '1',
      description: 'Détartrage sus et sous-gingival + Polissage',
      toothNumber: undefined,
      quantity: 1,
      unitPrice: 500,
      amoCode: 'D20',
    },
    {
      id: '2',
      description: 'Couronne Zircone monolithique CAD/CAM',
      toothNumber: 26,
      quantity: 1,
      unitPrice: 2800,
      amoCode: 'SPR50',
    },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        description: 'Nouvel acte dentaire',
        quantity: 1,
        unitPrice: 400,
      },
    ]);
  };

  const updateItem = (id: string, field: keyof InvoiceItemForm, value: any) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, [field]: value } : i))
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const subTotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const totalAmount = Math.max(0, subTotal - discount);

  const handlePrint = () => {
    window.print();
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await onSave({
        number: docNumber,
        isQuote,
        patientId,
        mutualType,
        mutualClaimNumber,
        discount,
        subTotal,
        totalAmount,
        items,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in print:p-0 print:bg-white">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] print:max-h-none print:shadow-none print:border-none print:w-full">
        {/* Controls Bar (Hidden when printing) */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-sky-400" />
            <h3 className="font-bold text-sm">
              {isQuote ? 'Création de Devis Dentaire' : 'Facturation & Feuille de Soins (Maroc)'}
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors border border-slate-700"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer</span>
            </button>
            <button
              onClick={handleSave}
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 text-white font-bold text-xs hover:opacity-95 transition-opacity disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Enregistrement...' : 'Valider & Enregistrer'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mutual Bar (Hidden when printing) */}
        <div className="p-4 bg-sky-50/70 border-b border-sky-100 flex flex-wrap items-center gap-4 text-xs print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">Organisme / Mutuelle :</span>
            <select
              value={mutualType}
              onChange={(e) => setMutualType(e.target.value)}
              className="p-1.5 rounded-xl bg-white border border-slate-300 font-bold text-slate-800"
            >
              {MOROCCAN_MUTUALS.map((m) => (
                <option key={m.code} value={m.code}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <span className="font-bold text-slate-700">N° Dossier Mutuelle :</span>
            <input
              type="text"
              placeholder="Ex: CNOPS-2026-89412"
              value={mutualClaimNumber}
              onChange={(e) => setMutualClaimNumber(e.target.value)}
              className="p-1.5 rounded-xl bg-white border border-slate-300 flex-1 font-mono"
            />
          </div>
          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter une ligne</span>
          </button>
        </div>

        {/* Printable Invoice Sheet */}
        <div className="p-8 overflow-y-auto flex-1 text-slate-900 bg-white print:p-0 print:overflow-visible">
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-start">
            <div>
              <h1 className="text-xl font-black uppercase text-slate-950">{doctorName}</h1>
              <p className="text-xs text-slate-600 font-semibold">Chirurgien-Dentiste</p>
              <p className="text-[11px] text-slate-500 mt-1 font-mono">
                ICE : <strong>{clinicIce}</strong> • IF : <strong>{clinicTaxId}</strong> • Patente : <strong>{clinicPatente}</strong>
              </p>
              <p className="text-[11px] text-slate-500 font-mono">
                INPE : <strong>{clinicInpe}</strong>
              </p>
            </div>
            <div className="text-right text-xs">
              <span className="inline-block px-3 py-1 rounded-full bg-slate-900 text-white font-black text-sm tracking-wider uppercase mb-1">
                {isQuote ? 'DEVIS DENTAIRE' : 'FACTURE DENTAIRE'}
              </span>
              <p className="font-mono font-bold text-slate-800">{docNumber}</p>
              <p className="text-slate-500 mt-1">
                Date : {new Date().toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>

          {/* Patient Details & Mutuelle */}
          <div className="mb-6 grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Patient</p>
              <p className="text-sm font-black text-slate-900">{patientName}</p>
              {patientCin && (
                <p className="text-xs text-slate-600 mt-0.5 font-mono">CIN : {patientCin}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Couverture / Mutuelle</p>
              <p className="text-xs font-bold text-slate-900">{mutualType}</p>
              {mutualClaimNumber && (
                <p className="text-xs text-slate-600 font-mono">Réf : {mutualClaimNumber}</p>
              )}
            </div>
          </div>

          {/* Line Items Table */}
          <table className="w-full text-left text-xs mb-6">
            <thead>
              <tr className="border-b-2 border-slate-300 text-[11px] font-black uppercase tracking-wider text-slate-600">
                <th className="py-2">Description de l'acte</th>
                <th className="py-2 text-center w-16">Dent</th>
                <th className="py-2 text-center w-20">Code AMO</th>
                <th className="py-2 text-center w-16">Qté</th>
                <th className="py-2 text-right w-24">P.U (MAD)</th>
                <th className="py-2 text-right w-24">Total (MAD)</th>
                <th className="py-2 w-10 print:hidden"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {items.map((item) => (
                <tr key={item.id} className="group">
                  <td className="py-2.5">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      className="w-full bg-transparent font-medium border-none focus:outline-none focus:ring-1 focus:ring-sky-500 rounded px-1"
                    />
                  </td>
                  <td className="py-2.5 text-center">
                    <input
                      type="number"
                      placeholder="-"
                      value={item.toothNumber || ''}
                      onChange={(e) =>
                        updateItem(
                          item.id,
                          'toothNumber',
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                      className="w-12 text-center bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-sky-500 rounded font-bold"
                    />
                  </td>
                  <td className="py-2.5 text-center font-mono text-slate-500">
                    <input
                      type="text"
                      placeholder="-"
                      value={item.amoCode || ''}
                      onChange={(e) => updateItem(item.id, 'amoCode', e.target.value)}
                      className="w-16 text-center bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-sky-500 rounded"
                    />
                  </td>
                  <td className="py-2.5 text-center">
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                      className="w-12 text-center bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-sky-500 rounded"
                    />
                  </td>
                  <td className="py-2.5 text-right font-mono">
                    <input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(item.id, 'unitPrice', Number(e.target.value))}
                      className="w-20 text-right bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-sky-500 rounded font-mono"
                    />
                  </td>
                  <td className="py-2.5 text-right font-mono font-bold">
                    {formatMAD(item.unitPrice * item.quantity)}
                  </td>
                  <td className="py-2.5 text-center print:hidden">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-slate-300 hover:text-rose-500 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals Summary */}
          <div className="flex justify-end mb-8">
            <div className="w-64 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Sous-total :</span>
                <span className="font-mono font-bold">{formatMAD(subTotal)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 items-center">
                <span className="text-slate-500">Remise accordée :</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min={0}
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-20 text-right p-1 rounded border border-slate-200 text-xs font-mono"
                  />
                  <span>MAD</span>
                </div>
              </div>
              <div className="flex justify-between py-2 border-t-2 border-slate-900 text-sm font-black bg-slate-50 px-2 rounded-xl">
                <span>TOTAL À PAYER :</span>
                <span className="text-emerald-700 font-mono">{formatMAD(totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Signatures & Mentions */}
          <div className="pt-6 border-t border-slate-200 flex justify-between items-end text-xs">
            <div className="text-[10px] text-slate-400 space-y-1">
              <p>Arrêté la présente facture / devis à la somme de :</p>
              <p className="font-bold text-slate-700 uppercase">
                {Math.round(totalAmount)} Dirhams Marocains
              </p>
              <p className="italic">Cabinet conventionné avec les mutuelles agréées (Maroc)</p>
            </div>
            <div className="text-center border border-dashed border-slate-300 rounded-2xl p-4 w-48 bg-slate-50/50">
              <p className="text-[11px] font-bold text-slate-700 mb-6">Signature & Cachet Dr</p>
              <div className="h-6 font-serif italic text-slate-400">{doctorName}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
