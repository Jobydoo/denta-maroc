'use client';

import React, { useState, useEffect } from 'react';
import { ProtheseStatus, ProtheseType } from '@/types';
import { formatMAD, formatDateFR } from '@/lib/utils';
import ProtheseOrderModal from '@/components/protheses/ProtheseOrderModal';
import {
  Layers,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  DollarSign
} from 'lucide-react';

interface OrderItem {
  id: string;
  orderNumber: string;
  patient: {
    id: string;
    firstName: string;
    lastName: string;
  };
  labName: string;
  protheseType: ProtheseType;
  teethNumbers: string;
  vitaShade: string;
  status: ProtheseStatus;
  impressionDate: string;
  tryInDate?: string | null;
  deliveryDate?: string | null;
  clinicPrice: number;
  labCost: number;
  instructions?: string | null;
  isPaidToLab: boolean;
}

const STAGES: Array<{ id: ProtheseStatus; label: string; bg: string; text: string }> = [
  { id: 'EMPREINTE_PRISE', label: '1. Empreinte Prise', bg: 'bg-slate-100', text: 'text-slate-800' },
  { id: 'ENVOYE_LABO', label: '2. Envoyé au Labo', bg: 'bg-sky-100', text: 'text-sky-800' },
  { id: 'ESSAYAGE_PREVU', label: '3. Essayage Prévu', bg: 'bg-amber-100', text: 'text-amber-800' },
  { id: 'RETOUCHE', label: '4. En Retouche', bg: 'bg-rose-100', text: 'text-rose-800' },
  { id: 'LIVRE_CABINET', label: '5. Livré au Cabinet', bg: 'bg-teal-100', text: 'text-teal-800' },
  { id: 'POSE', label: '6. Posé en Bouche', bg: 'bg-emerald-100', text: 'text-emerald-800' },
];

export default function ProthesesPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/protheses');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: ProtheseStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
    try {
      await fetch('/api/protheses', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateOrder = async (data: any) => {
    const res = await fetch('/api/protheses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      fetchOrders();
    }
  };

  // KPIs financiers du labo
  const totalFacturePatients = orders.reduce((sum, o) => sum + o.clinicPrice, 0);
  const totalCoutLabo = orders.reduce((sum, o) => sum + o.labCost, 0);
  const margeGlobale = totalFacturePatients - totalCoutLabo;
  const margeMoyennePct = totalFacturePatients > 0 ? Math.round((margeGlobale / totalFacturePatients) * 100) : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Suivi des Prothèses Dentaires & Laboratoire
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Traçabilité des bons de commande, essayages, teintes Vita et rentabilité par pièce
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-lg shadow-amber-600/20 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Créer un Bon de Commande Labo</span>
        </button>
      </div>

      {/* Financial Rentability Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
          <p className="text-[11px] font-bold uppercase text-slate-400">Total Prothèses Facturées</p>
          <h3 className="text-xl font-black font-mono text-slate-900 mt-1">
            {formatMAD(totalFacturePatients)}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">{orders.length} commande(s) enregistrée(s)</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
          <p className="text-[11px] font-bold uppercase text-slate-400">Coût Total Facturé par Labo</p>
          <h3 className="text-xl font-black font-mono text-rose-600 mt-1">
            {formatMAD(totalCoutLabo)}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Charges externes de laboratoire</p>
        </div>

        <div className="p-5 rounded-3xl bg-emerald-50/70 border border-emerald-200/80 shadow-sm">
          <p className="text-[11px] font-bold uppercase text-emerald-800">Marge Nette Cabinet</p>
          <h3 className="text-xl font-black font-mono text-emerald-700 mt-1">
            {formatMAD(margeGlobale)}
          </h3>
          <p className="text-xs font-bold text-emerald-800 mt-0.5">
            Taux de marge brute : <strong>{margeMoyennePct}%</strong>
          </p>
        </div>
      </div>

      {/* Kanban / Table des Commandes */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-black text-slate-900 text-sm">
            Toutes les Commandes en Cours & Livraisons
          </h3>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-xs text-slate-400">
            Chargement des commandes de prothèses...
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            Aucune commande de prothèse pour le moment.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {orders.map((order) => {
              const margin = order.clinicPrice - order.labCost;
              return (
                <div
                  key={order.id}
                  className="p-5 hover:bg-slate-50/70 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-black text-xs text-slate-900">
                        {order.orderNumber}
                      </span>
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                        Teinte {order.vitaShade}
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        {order.patient.firstName} {order.patient.lastName}
                      </span>
                    </div>

                    <p className="text-xs font-bold text-slate-800">
                      {order.protheseType.replace(/_/g, ' ')} • Dents :{' '}
                      <span className="font-mono text-sky-700">{order.teethNumbers}</span>
                    </p>

                    <p className="text-[11px] text-slate-500">
                      Labo : <strong className="text-slate-700">{order.labName}</strong> • Empreinte
                      : {formatDateFR(order.impressionDate)}{' '}
                      {order.tryInDate && `• Essayage : ${formatDateFR(order.tryInDate)}`}
                    </p>

                    {order.instructions && (
                      <p className="text-[11px] text-slate-600 italic bg-slate-50 p-2 rounded-xl mt-1 border border-slate-200/60">
                        « {order.instructions} »
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 self-end lg:self-center">
                    <div className="text-right">
                      <p className="text-xs font-mono font-bold text-slate-900">
                        Patient : {formatMAD(order.clinicPrice)}
                      </p>
                      <p className="text-[11px] font-mono text-rose-600">
                        Labo : {formatMAD(order.labCost)}
                      </p>
                      <p className="text-[10px] font-bold text-emerald-700">
                        Marge : +{formatMAD(margin)}
                      </p>
                    </div>

                    {/* Stage Selector */}
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleUpdateStatus(order.id, e.target.value as ProtheseStatus)
                      }
                      className="px-3 py-2 rounded-xl text-xs font-black border border-amber-300 bg-amber-50 text-amber-950 focus:bg-white"
                    >
                      {STAGES.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Commande */}
      <ProtheseOrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        patientId={orders[0]?.patient?.id || 'pat-1'}
        patientName={orders[0]?.patient ? `${orders[0].patient.firstName} ${orders[0].patient.lastName}` : 'Youssef Berrada'}
        onSave={handleCreateOrder}
      />
    </div>
  );
}
