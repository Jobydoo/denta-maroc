'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PatientSummary } from '@/types';
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
  FileSpreadsheet
} from 'lucide-react';

export default function PatientsListPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [mutualFilter, setMutualFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
    const res = await fetch('/api/patients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      fetchPatients();
    }
  };

  const filteredPatients = patients.filter((p) => {
    if (mutualFilter === 'ALL') return true;
    return p.mutualType === mutualFilter;
  });

  return (
    <div className="space-y-6 animate-fade-in">
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
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-base shadow-sm shrink-0">
                      {p.firstName.charAt(0)}
                      {p.lastName.charAt(0)}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link
                          href={`/dashboard/patients/${p.id}`}
                          className="font-black text-sm text-slate-900 hover:text-sky-600 transition-colors flex items-center gap-1"
                        >
                          <span>
                            {p.firstName} {p.lastName}
                          </span>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                        </Link>

                        {p.cin && (
                          <span className="font-mono text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                            CIN: {p.cin}
                          </span>
                        )}

                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                          {p.mutualType}
                        </span>

                        {/* Alerte Médicale Rouge */}
                        {hasAlert && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-100 text-rose-700 text-[10px] font-black tracking-wider uppercase border border-rose-300">
                            <ShieldAlert className="w-3 h-3 text-rose-600" />
                            Alerte Médicale
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-500">
                        {calculateAge(p.dateOfBirth)} ans • Tél :{' '}
                        <strong className="text-slate-700 font-mono">{p.phone}</strong> • {p.city}
                      </p>

                      {/* Résumé de l'alerte médicale si présente */}
                      {hasAlert && (
                        <p className="text-[11px] text-rose-600 font-bold">
                          ⚠️ {p.allergies ? `Allergie: ${p.allergies}` : ''}{' '}
                          {p.bleedingDisorder ? '• Anticoagulant' : ''}{' '}
                          {p.isPregnant ? '• Grossesse' : ''}{' '}
                          {p.chronicDiseases ? `• ${p.chronicDiseases}` : ''}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Situation Financière & Actions Rapides */}
                  <div className="flex items-center justify-between lg:justify-end gap-6 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    <div className="text-left lg:text-right">
                      <p className="text-[10px] uppercase font-bold text-slate-400">
                        Solde Restant Dû
                      </p>
                      <p
                        className={`text-sm font-black font-mono ${
                          remainingDue > 0 ? 'text-rose-600' : 'text-emerald-600'
                        }`}
                      >
                        {formatMAD(remainingDue)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <QuickContactButtons
                        phone={p.phone}
                        patientName={`${p.firstName} ${p.lastName}`}
                      />

                      <Link
                        href={`/dashboard/patients/${p.id}`}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors shadow-sm"
                      >
                        Ouvrir Dossier 360°
                      </Link>
                    </div>
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
