'use client';

import React, { useState, useEffect } from 'react';
import { formatMAD, formatDateFR } from '@/lib/utils';
import { Receipt, FileText, CheckCircle2, Clock, Filter, Printer, CreditCard } from 'lucide-react';

export default function FinancesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'FACTURES' | 'DEVIS' | 'PAIEMENTS' | 'CHEQUES'>('FACTURES');
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [invRes, payRes] = await Promise.all([
        fetch('/api/invoices'),
        fetch('/api/payments'),
      ]);
      if (invRes.ok) {
        const invData = await invRes.json();
        setInvoices(invData.invoices || []);
        setQuotes(invData.quotes || []);
      }
      if (payRes.ok) {
        const payData = await payRes.json();
        setPayments(payData || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const pendingChecks = payments.filter((p) => p.method === 'CHEQUE' && p.checkStatus === 'EN_PORTEFEUILLE');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Devis, Facturation & Comptabilité Dentaire
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Dossiers mutuelle (CNOPS, CNSS, AMO), suivi des règlements et portefeuille des chèques
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-bold">
        {[
          { id: 'FACTURES', label: `Factures (${invoices.length})`, icon: FileText },
          { id: 'DEVIS', label: `Devis (${quotes.length})`, icon: Receipt },
          { id: 'PAIEMENTS', label: `Encaissements (${payments.length})`, icon: CreditCard },
          { id: 'CHEQUES', label: `Chèques à Encaisser (${pendingChecks.length})`, icon: Clock },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 rounded-t-2xl transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-sky-700 border-t-2 border-x border-sky-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        {activeTab === 'FACTURES' && (
          <div className="divide-y divide-slate-100">
            {invoices.length === 0 ? (
              <p className="p-8 text-center text-xs text-slate-400">Aucune facture émise.</p>
            ) : (
              invoices.map((inv) => (
                <div
                  key={inv.id}
                  className="p-5 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-xs text-slate-900">
                        {inv.invoiceNumber}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          inv.status === 'SOLDEE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {inv.status}
                      </span>
                      {inv.mutualType && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                          {inv.mutualType}
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-bold text-slate-800 mt-1">
                      Patient : {inv.patient.firstName} {inv.patient.lastName}{' '}
                      {inv.patient.cin && `(CIN: ${inv.patient.cin})`}
                    </p>
                    <p className="text-[11px] text-slate-400">Date : {formatDateFR(inv.issueDate)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-bold text-sm text-slate-900">
                      {formatMAD(inv.totalAmount)}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Payé : {formatMAD(inv.paidAmount)} | Reste :{' '}
                      <strong className="text-rose-600">{formatMAD(inv.remainingAmount)}</strong>
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'DEVIS' && (
          <div className="divide-y divide-slate-100">
            {quotes.length === 0 ? (
              <p className="p-8 text-center text-xs text-slate-400">Aucun devis enregistré.</p>
            ) : (
              quotes.map((q) => (
                <div
                  key={q.id}
                  className="p-5 hover:bg-slate-50/70 transition-colors flex justify-between items-center"
                >
                  <div>
                    <span className="font-mono font-bold text-xs text-slate-900">{q.quoteNumber}</span>
                    <p className="text-xs font-bold text-slate-800 mt-0.5">
                      {q.patient.firstName} {q.patient.lastName}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Valable jusqu'au : {formatDateFR(q.validUntil)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-bold text-sm text-slate-900">
                      {formatMAD(q.finalAmount)}
                    </p>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      {q.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'PAIEMENTS' && (
          <div className="divide-y divide-slate-100">
            {payments.map((p) => (
              <div
                key={p.id}
                className="p-5 hover:bg-slate-50/70 transition-colors flex justify-between items-center"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-slate-900">
                      {p.paymentNumber}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      {p.method}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-800 mt-0.5">
                    {p.patient.firstName} {p.patient.lastName}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Date : {formatDateFR(p.paymentDate)} {p.notes ? `• ${p.notes}` : ''}
                  </p>
                </div>
                <div className="text-right font-mono font-black text-emerald-700 text-base">
                  {formatMAD(p.amount)}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'CHEQUES' && (
          <div className="divide-y divide-slate-100">
            {pendingChecks.length === 0 ? (
              <p className="p-8 text-center text-xs text-slate-400">
                Aucun chèque en portefeuille à encaisser.
              </p>
            ) : (
              pendingChecks.map((chk) => (
                <div
                  key={chk.id}
                  className="p-5 bg-amber-50/40 hover:bg-amber-50/70 transition-colors flex justify-between items-center"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-slate-900">
                        {chk.checkNumber}
                      </span>
                      <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded">
                        {chk.checkBank}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-800 mt-0.5">
                      Émis par : {chk.patient.firstName} {chk.patient.lastName}
                    </p>
                    <p className="text-[11px] text-rose-600 font-bold">
                      Date d'échéance : {formatDateFR(chk.checkDueDate)}
                    </p>
                  </div>
                  <div className="text-right font-mono font-black text-slate-900 text-base">
                    {formatMAD(chk.amount)}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
