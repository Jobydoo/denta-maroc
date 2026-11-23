'use client';

import React, { useState, useEffect } from 'react';
import { ExpenseCategory, PaymentMethod } from '@/types';
import { formatMAD, formatDateFR } from '@/lib/utils';
import { TrendingDown, Plus, Upload, CheckCircle2, DollarSign } from 'lucide-react';

export default function DepensesPage() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('FOURNITURES_DENTAIRES');
  const [amount, setAmount] = useState<number>(1500);
  const [supplier, setSupplier] = useState('Promodentaire Maroc');
  const [method, setMethod] = useState<PaymentMethod>('VIREMENT');
  const [notes, setNotes] = useState('');

  const fetchExpenses = async () => {
    try {
      const res = await fetch('/api/expenses');
      if (res.ok) {
        const data = await res.json();
        setExpenses(data.expenses || []);
        setTotalExpenses(data.totalExpenses || 0);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();

    const tempId = `exp-${Date.now()}`;
    const optimisticExp = {
      id: tempId,
      title,
      category,
      amount: Number(amount),
      supplier: supplier || null,
      paymentMethod: method,
      notes: notes || null,
      date: new Date().toISOString(),
    };

    setExpenses((prev) => [optimisticExp, ...prev]);
    setIsAddOpen(false);
    showToast(`✓ Dépense de ${amount} MAD enregistrée avec succès !`);
    setTitle('');

    try {
      await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          amount,
          supplier,
          paymentMethod: method,
          notes,
        }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 font-bold text-xs animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-200" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Dépenses, Charges & Marge Nette du Cabinet
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Suivi des factures fournisseurs, loyer, factures labo prothèse et calcul du bénéfice net réel
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-lg shadow-rose-600/20 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Enregistrer une Dépense</span>
        </button>
      </div>

      {/* Summary KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
          <p className="text-[11px] font-bold uppercase text-slate-400">Total Dépenses Enregistrées</p>
          <h3 className="text-2xl font-black font-mono text-rose-600 mt-1">
            {formatMAD(totalExpenses)}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">{expenses.length} dépense(s)</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
          <p className="text-[11px] font-bold uppercase text-slate-400">Poste Principal</p>
          <h3 className="text-base font-black text-slate-900 mt-1">
            Loyer & Labo Prothèse
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Charges fixes récurrentes</p>
        </div>

        <div className="p-5 rounded-3xl bg-emerald-50 border border-emerald-200 shadow-sm">
          <p className="text-[11px] font-bold uppercase text-emerald-800">Résultat Net Réel (Mois)</p>
          <h3 className="text-2xl font-black font-mono text-emerald-700 mt-1">
            {formatMAD(54000 - totalExpenses)}
          </h3>
          <p className="text-xs text-emerald-800 mt-0.5 font-bold">Encaissements - Dépenses</p>
        </div>
      </div>

      {/* Table of Expenses */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="font-black text-slate-900 text-sm">Historique des Dépenses & Factures</h3>
        </div>

        <div className="divide-y divide-slate-100">
          {expenses.map((exp) => (
            <div
              key={exp.id}
              className="p-5 hover:bg-slate-50/70 transition-colors flex justify-between items-center"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-900">{exp.title}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {exp.category}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Fournisseur : <strong>{exp.supplier || 'Non précisé'}</strong> • Mode : {exp.paymentMethod}
                </p>
                <p className="text-[11px] text-slate-400">Date : {formatDateFR(exp.date)}</p>
              </div>
              <div className="text-right font-mono font-black text-rose-600 text-base">
                -{formatMAD(exp.amount)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
              <h3 className="font-bold text-sm">Ajouter une Dépense / Facture</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleAddExpense} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Libellé / Titre *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Facture composite & fraises"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Montant (MAD) *</label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full p-2 rounded-xl bg-slate-50 border border-slate-300 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Catégorie</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                    className="w-full p-2 rounded-xl bg-slate-50 border border-slate-300 font-bold"
                  >
                    <option value="LOYER">Loyer Cabinet</option>
                    <option value="SALAIRES">Salaires & Primes</option>
                    <option value="LABO_PROTHESE">Labo Prothèse</option>
                    <option value="FOURNITURES_DENTAIRES">Fournitures Dentaires</option>
                    <option value="EAU_ELEC_INTERNET">Eau / Élec / Télécom</option>
                    <option value="MAINTENANCE">Maintenance & Fauteuil</option>
                    <option value="IMPOTS_TAXES">Impôts & Taxes</option>
                    <option value="AUTRE">Autre Dépense</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Fournisseur / Bénéficiaire</label>
                <input
                  type="text"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  placeholder="Ex: Promodentaire Maroc"
                  className="w-full p-2 rounded-xl bg-slate-50 border border-slate-300"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Mode de Règlement</label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value as PaymentMethod)}
                  className="w-full p-2 rounded-xl bg-slate-50 border border-slate-300 font-bold"
                >
                  <option value="VIREMENT">Virement Bancaire</option>
                  <option value="CHEQUE">Chèque</option>
                  <option value="ESPECES">Espèces</option>
                  <option value="CARTE_BANCAIRE">Carte Bancaire</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
