'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatMAD, calculateAge } from '@/lib/utils';
import QuickContactButtons from '@/components/patients/QuickContactButtons';
import PatientFormModal from '@/components/patients/PatientFormModal';
import {
  Search,
  UserPlus,
  ShieldAlert,
  ChevronRight,
  Filter,
  User,
  CreditCard,
  FileSpreadsheet,
  CheckCircle2,
} from 'lucide-react';

export default function PatientsListPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [mutualFilter, setMutualFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchPatients = async () => {
    try {
      const res = await fetch(`/api/patients${searchQuery ? `?q=${searchQuery}` : ''}`);
      if (res.ok) {
        const data = await res.json();
        setPatients(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPatients();
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleCreatePatient = async (data: any) => {
    // 1. Mise à jour optimiste immédiate dans l'interface
    const tempId = `pat-${Date.now()}`;
    const newPatient = {
      ...data,
      id: tempId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      totalInvoiced: 0,
      totalPaid: 0,
      remainingDue: 0,
      teethConditions: [],
      treatments: [],
      invoices: [],
      payments: [],
      quotes: [],
      protheses: [],
      files: [],
    };

    setPatients((prev) => [newPatient, ...prev]);
    showToast(`✓ Patient "${data.firstName} ${data.lastName}" ajouté avec succès !`);

    // 2. Persistance via l'API
    try {
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const saved = await res.json();
        setPatients((prev) =>
          prev.map((p) => (p.id === tempId ? { ...newPatient, ...saved } : p))
        );
      }
    } catch (e) {
      console.error('Erreur API patients:', e);
    }
  };

  const filteredPatients = patients.filter((p) => {
    if (mutualFilter === 'ALL') return true;
    return p.mutualType === mutualFilter;
  });

  return (
    <div className="space-y-6 animate-fade-in relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 font-bold text-xs animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-200" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Gestion des Patients & Dossiers Médicaux
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {patients.length} patient(s) enregistrés au cabinet dentaire
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-sky-600 to-teal-600 text-white font-bold text-xs shadow-lg shadow-sky-600/20 hover:opacity-95 transition-opacity self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Créer un Nouveau Patient</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par Nom, Prénom, Téléphone, ou N° CIN (ex: BE892341)..."
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={mutualFilter}
            onChange={(e) => setMutualFilter(e.target.value)}
            className="p-2 text-xs font-bold rounded-2xl bg-slate-50 border border-slate-200 text-slate-700"
          >
            <option value="ALL">Toutes les Mutuelles</option>
            <option value="CNOPS">CNOPS</option>
            <option value="CNSS">CNSS</option>
            <option value="AMO">AMO</option>
            <option value="FAR">FAR</option>
            <option value="AXA">AXA Assurance</option>
            <option value="RMA_WATANYA">RMA Watanya</option>
          </select>
        </div>
      </div>

      {/* Patient Cards / Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-slate-400">
            Chargement des dossiers patients...
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <User className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-500 font-bold">Aucun patient trouvé.</p>
            <p className="text-[11px] text-slate-400">
              Essayez un autre mot-clé ou ajoutez un nouveau dossier médical.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredPatients.map((p) => {
              const hasAlert =
                Boolean(p.allergies) ||
                Boolean(p.chronicDiseases) ||
                p.heartCondition ||
                p.bleedingDisorder ||
                p.isPregnant ||
                p.biphosphonates;

              const remainingDue = p.remainingDue || 0;

              return (
                <div
                  key={p.id}
                  className="p-5 hover:bg-slate-50/70 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4 group"
                >
                  {/* Info principale */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500/10 to-teal-500/10 border border-sky-500/20 text-sky-700 flex items-center justify-center font-black text-sm">
                      {p.firstName[0]}
                      {p.lastName[0]}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link
                          href={`/dashboard/patients/${p.id}`}
                          className="font-black text-slate-900 hover:text-sky-600 transition-colors text-sm"
                        >
                          {p.firstName} {p.lastName}
                        </Link>

                        {p.cin && (
                          <span className="font-mono text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-900 text-white">
                            CIN: {p.cin}
                          </span>
                        )}

                        <span className="text-[10px] font-black px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                          {p.mutualType}
                        </span>

                        {hasAlert && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 animate-pulse">
                            <ShieldAlert className="w-3 h-3 text-rose-600" />
                            Alerte Médicale
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-500">
                        {calculateAge(p.dateOfBirth)} ans • Tél :{' '}
                        <span className="font-mono font-bold text-slate-700">{p.phone}</span>
                        {p.city && ` • ${p.city}`}
                      </p>

                      {p.allergies && (
                        <p className="text-[11px] text-rose-600 font-semibold">
                          ⚠️ Allergies : {p.allergies}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions & Finances */}
                  <div className="flex items-center gap-4 self-end lg:self-auto">
                    <div className="text-right">
                      <p className="text-[11px] font-bold text-slate-400 uppercase">
                        Solde Patient
                      </p>
                      <p
                        className={`font-mono text-sm font-black ${
                          remainingDue > 0 ? 'text-rose-600' : 'text-emerald-600'
                        }`}
                      >
                        {formatMAD(remainingDue)}
                      </p>
                    </div>

                    <QuickContactButtons
                      phone={p.phone}
                      patientName={`${p.firstName} ${p.lastName}`}
                    />

                    <Link
                      href={`/dashboard/patients/${p.id}`}
                      className="p-2.5 rounded-xl bg-slate-100 hover:bg-sky-50 text-slate-600 hover:text-sky-600 transition-colors"
                      title="Ouvrir le dossier 360°"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Création Patient */}
      <PatientFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreatePatient}
      />
    </div>
  );
}
