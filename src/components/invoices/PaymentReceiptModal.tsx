'use client';

import React, { useState } from 'react';
import { formatMAD, formatDateFR } from '@/lib/utils';
import { PaymentMethod, CheckStatus } from '@/types';
import { Receipt, CheckCircle, Printer, X } from 'lucide-react';

interface PaymentReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  patientName: string;
  patientCin?: string | null;
  patientRemainingBalance: number;
  doctorName?: string;
  clinicName?: string;
  clinicAddress?: string;
  onSavePayment: (payment: {
    amount: number;
    method: PaymentMethod;
    checkNumber?: string;
    checkBank?: string;
    checkDueDate?: string;
    notes?: string;
  }) => Promise<void>;
}

export default function PaymentReceiptModal({
  isOpen,
  onClose,
  patientId,
  patientName,
  patientCin,
  patientRemainingBalance,
  doctorName = 'Dr. Mehdi Alami',
  clinicName = 'Cabinet Dentaire Dr. Mehdi Alami',
  clinicAddress = '145 Boulevard d\'Anfa, Maarif, Casablanca',
  onSavePayment,
}: PaymentReceiptModalProps) {
  const [receiptNumber] = useState(
    `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [amount, setAmount] = useState<number>(patientRemainingBalance > 0 ? patientRemainingBalance : 500);
  const [method, setMethod] = useState<PaymentMethod>('ESPECES');
  const [checkNumber, setCheckNumber] = useState('');
  const [checkBank, setCheckBank] = useState('Attijariwafa bank');
  const [checkDueDate, setCheckDueDate] = useState('');
  const [notes, setNotes] = useState('Règlement séance soins dentaires');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSavePayment({
        amount,
        method,
        checkNumber: method === 'CHEQUE' ? checkNumber : undefined,
        checkBank: method === 'CHEQUE' ? checkBank : undefined,
        checkDueDate: method === 'CHEQUE' ? checkDueDate : undefined,
        notes,
      });
      setIsSaved(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in print:p-0 print:bg-white">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col print:shadow-none print:border-none print:w-full">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm">
              {isSaved ? 'Reçu de Paiement Imprimable' : 'Enregistrer un Encaissement'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulaire Saisie (Caché si déjà enregistré ou en impression) */}
        {!isSaved && (
          <div className="p-6 space-y-4 print:hidden">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex justify-between items-center text-xs">
              <div>
                <p className="text-slate-500">Patient :</p>
                <p className="font-bold text-slate-900">{patientName}</p>
              </div>
              <div className="text-right">
                <p className="text-slate-500">Reste à payer actuel :</p>
                <p className="font-mono font-black text-rose-600">
                  {formatMAD(patientRemainingBalance)}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 uppercase mb-1">
                Montant Encaissé (MAD)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full p-2.5 text-base font-black text-emerald-700 rounded-xl bg-slate-50 border border-slate-300 focus:bg-white focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 uppercase mb-1">
                Mode de Règlement
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'ESPECES', label: '💵 Espèces' },
                  { id: 'CHEQUE', label: '📑 Chèque' },
                  { id: 'CARTE_BANCAIRE', label: '💳 TPE Carte' },
                  { id: 'VIREMENT', label: '🏦 Virement' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMethod(m.id as PaymentMethod)}
                    className={`p-2.5 rounded-xl text-xs font-bold border transition-all ${
                      method === m.id
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-400 ring-2 ring-emerald-500'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Champs spécifiques au chèque marocain */}
            {method === 'CHEQUE' && (
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">N° Chèque</label>
                  <input
                    type="text"
                    placeholder="CHQ-123456"
                    value={checkNumber}
                    onChange={(e) => setCheckNumber(e.target.value)}
                    className="w-full p-2 rounded-lg bg-white border border-amber-300 font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Banque</label>
                  <select
                    value={checkBank}
                    onChange={(e) => setCheckBank(e.target.value)}
                    className="w-full p-2 rounded-lg bg-white border border-amber-300 font-bold"
                  >
                    <option value="Attijariwafa bank">Attijariwafa bank</option>
                    <option value="Banque Populaire (BCP)">Banque Populaire (BCP)</option>
                    <option value="Bank of Africa (BMCE)">Bank of Africa (BMCE)</option>
                    <option value="CIH Bank">CIH Bank</option>
                    <option value="Crédit du Maroc">Crédit du Maroc</option>
                    <option value="Société Générale Maroc">Société Générale Maroc</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Date d'échéance</label>
                  <input
                    type="date"
                    value={checkDueDate}
                    onChange={(e) => setCheckDueDate(e.target.value)}
                    className="w-full p-2 rounded-lg bg-white border border-amber-300"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Motif / Notes
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2 text-xs rounded-xl bg-slate-50 border border-slate-200"
              />
            </div>

            <button
              type="button"
              disabled={isSubmitting || amount <= 0}
              onClick={handleSubmit}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 hover:opacity-95 transition-opacity disabled:opacity-50"
            >
              {isSubmitting ? 'Traitement en cours...' : 'Enregistrer et Émettre le Reçu'}
            </button>
          </div>
        )}

        {/* Vue Reçu Officiel Imprimable (A5 / Reçu Patient) */}
        {isSaved && (
          <div className="p-6 bg-white space-y-6">
            <div className="flex justify-between items-center print:hidden border-b pb-3">
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" />
                Encaissement validé avec succès
              </span>
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-sm"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimer le Reçu</span>
              </button>
            </div>

            <div className="border-2 border-slate-900 p-6 rounded-2xl font-sans text-xs space-y-4">
              <div className="flex justify-between items-start border-b border-slate-200 pb-3">
                <div>
                  <h4 className="font-black text-sm uppercase text-slate-950">{clinicName}</h4>
                  <p className="text-slate-500 text-[11px]">{clinicAddress}</p>
                  <p className="text-slate-500 text-[11px]">Dr. {doctorName}</p>
                </div>
                <div className="text-right">
                  <span className="font-black text-xs uppercase bg-slate-900 text-white px-2 py-0.5 rounded">
                    REÇU DE PAIEMENT
                  </span>
                  <p className="font-mono font-bold text-slate-700 mt-1">{receiptNumber}</p>
                  <p className="text-slate-500 text-[10px]">{formatDateFR(new Date())}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Reçu de :</p>
                  <p className="font-bold text-slate-900">{patientName}</p>
                  {patientCin && <p className="font-mono text-slate-500">CIN : {patientCin}</p>}
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Mode de paiement :</p>
                  <p className="font-bold text-slate-800">{method}</p>
                  {method === 'CHEQUE' && checkNumber && (
                    <p className="font-mono text-slate-500 text-[10px]">
                      {checkBank} - {checkNumber}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center py-3 border-y border-slate-200 text-sm font-black">
                <span>MONTANT ENCAISSÉ :</span>
                <span className="text-emerald-700 font-mono text-base">{formatMAD(amount)}</span>
              </div>

              <div className="flex justify-between text-[11px] text-slate-500">
                <span>Solde restant dû après règlement :</span>
                <span className="font-mono font-bold text-slate-800">
                  {formatMAD(Math.max(0, patientRemainingBalance - amount))}
                </span>
              </div>

              <div className="pt-4 flex justify-between items-end text-[10px] text-slate-400">
                <p>Merci pour votre confiance • Bon rétablissement !</p>
                <div className="text-center font-bold text-slate-700 border border-dashed border-slate-300 p-2 rounded-xl w-36">
                  Signature & Cachet
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
