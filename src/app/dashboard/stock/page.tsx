'use client';

import React, { useState, useEffect } from 'react';
import { StockCategory } from '@/types';
import { Package, Plus, AlertTriangle, CheckCircle2, Minus } from 'lucide-react';

export default function StockPage() {
  const [items, setItems] = useState<any[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };
  const [name, setName] = useState('');
  const [category, setCategory] = useState<StockCategory>('ANESTHESIE');
  const [qty, setQty] = useState(10);
  const [threshold, setThreshold] = useState(5);
  const [unit, setUnit] = useState('boîtes');
  const [supplier, setSupplier] = useState('Promodentaire Maroc');

  const fetchStock = async () => {
    try {
      const res = await fetch('/api/stock');
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchStock();
  }, []);

  const handleAdjust = async (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, currentQuantity: Math.max(0, i.currentQuantity + delta) } : i
      )
    );
    try {
      await fetch('/api/stock', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, delta, quantityDelta: delta }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();

    const tempId = `stk-${Date.now()}`;
    const newItem = {
      id: tempId,
      name,
      category,
      currentQuantity: qty,
      minAlertThreshold: threshold,
      unit,
      supplier,
    };

    setItems((prev) => [newItem, ...prev]);
    setIsAddOpen(false);
    showToast(`✓ Produit "${name}" ajouté au stock !`);
    setName('');

    try {
      await fetch('/api/stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          category,
          currentQuantity: qty,
          minAlertThreshold: threshold,
          unit,
          supplier,
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

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Gestion du Stock & Consommables Dentaires
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Surveillance en direct des anesthésiques, composites, ciments et alertes de réapprovisionnement
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-lg shadow-sky-600/20 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Ajouter un Produit au Stock</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => {
          const isCritical = item.currentQuantity <= item.minAlertThreshold;
          return (
            <div
              key={item.id}
              className={`p-5 rounded-3xl border bg-white shadow-sm flex flex-col justify-between gap-4 transition-all ${
                isCritical ? 'border-rose-400 ring-2 ring-rose-500/10' : 'border-slate-200'
              }`}
            >
              <div>
                <div className="flex justify-between items-start gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                    {item.category}
                  </span>
                  {isCritical ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full">
                      <AlertTriangle className="w-3 h-3 text-rose-600" />
                      Alerte Réappro
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Stock OK
                    </span>
                  )}
                </div>

                <h4 className="font-bold text-sm text-slate-900 mt-2">{item.name}</h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  Fournisseur : {item.supplier || 'Promodentaire'} • Seuil min :{' '}
                  <strong className="text-slate-700">{item.minAlertThreshold} {item.unit}</strong>
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Quantité Actuelle</p>
                  <p className={`text-xl font-black font-mono ${isCritical ? 'text-rose-600' : 'text-slate-900'}`}>
                    {item.currentQuantity} <span className="text-xs font-normal text-slate-500">{item.unit}</span>
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleAdjust(item.id, -1)}
                    className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-700 transition-colors"
                    title="Consommer 1 unité"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleAdjust(item.id, 1)}
                    className="w-8 h-8 rounded-xl bg-sky-50 hover:bg-sky-100 flex items-center justify-center font-bold text-sky-700 border border-sky-200 transition-colors"
                    title="Réceptionner 1 unité"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
              <h3 className="font-bold text-sm">Ajouter un Consommable au Stock</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Désignation Produit *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Septanest 4% Adrénaline"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Quantité Initiale</label>
                  <input
                    type="number"
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="w-full p-2 rounded-xl bg-slate-50 border border-slate-300 font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Seuil Alerte Min</label>
                  <input
                    type="number"
                    value={threshold}
                    onChange={(e) => setThreshold(Number(e.target.value))}
                    className="w-full p-2 rounded-xl bg-slate-50 border border-slate-300 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Unité</label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="boîtes, seringues..."
                    className="w-full p-2 rounded-xl bg-slate-50 border border-slate-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Catégorie</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as StockCategory)}
                    className="w-full p-2 rounded-xl bg-slate-50 border border-slate-300 font-bold"
                  >
                    <option value="ANESTHESIE">Anesthésie</option>
                    <option value="RESTAURATION">Restauration & Composite</option>
                    <option value="ENDODONTIE">Endodontie</option>
                    <option value="HYGIENE_PROTECTION">Hygiène & Gants</option>
                    <option value="CHIRURGIE">Chirurgie</option>
                    <option value="EMPREINTE">Empreinte & Alginate</option>
                  </select>
                </div>
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
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
