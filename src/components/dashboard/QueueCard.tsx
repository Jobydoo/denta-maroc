'use client';

import React from 'react';
import Link from 'next/link';
import { AppointmentStatus, CareType } from '@/types';
import { Clock, User, PhoneCall, ChevronRight, Stethoscope } from 'lucide-react';
import { buildDirectWhatsAppUrl } from '@/lib/whatsapp';

export interface TodayPatient {
  id: string;
  patientId: string;
  name: string;
  phone: string;
  time: string;
  careType: CareType;
  title: string;
  status: AppointmentStatus;
}

interface QueueCardProps {
  patients: TodayPatient[];
  onUpdateStatus: (appointmentId: string, newStatus: AppointmentStatus) => void;
}

const statusBadges: Record<
  AppointmentStatus,
  { label: string; bg: string; text: string; border: string; next?: AppointmentStatus }
> = {
  PLANIFIE: {
    label: 'Planifié',
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-300',
    next: 'CONFIRME',
  },
  CONFIRME: {
    label: 'Confirmé',
    bg: 'bg-sky-100',
    text: 'text-sky-800',
    border: 'border-sky-300',
    next: 'SALLE_ATTENTE',
  },
  SALLE_ATTENTE: {
    label: 'En Salle d\'Attente',
    bg: 'bg-emerald-100',
    text: 'text-emerald-800',
    border: 'border-emerald-400',
    next: 'AU_FAUTEUIL',
  },
  AU_FAUTEUIL: {
    label: 'Au Fauteuil (En Soin)',
    bg: 'bg-purple-100',
    text: 'text-purple-800',
    border: 'border-purple-400',
    next: 'TERMINE',
  },
  TERMINE: {
    label: 'Terminé',
    bg: 'bg-teal-50',
    text: 'text-teal-700',
    border: 'border-teal-200',
  },
  ABSENT: {
    label: 'Absent / Lapin',
    bg: 'bg-rose-100',
    text: 'text-rose-700',
    border: 'border-rose-300',
  },
};

export default function QueueCard({ patients, onUpdateStatus }: QueueCardProps) {
  const waitingCount = patients.filter((p) => p.status === 'SALLE_ATTENTE').length;
  const chairCount = patients.filter((p) => p.status === 'AU_FAUTEUIL').length;

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-sky-600" />
          <h3 className="font-black text-slate-900 text-sm">
            File d'Attente du Jour & Flux Patients
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            {waitingCount} en attente
          </span>
          <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold">
            {chairCount} au fauteuil
          </span>
        </div>
      </div>

      {patients.length === 0 ? (
        <p className="text-xs text-slate-400 py-6 text-center italic">
          Aucun patient programmé pour aujourd'hui.
        </p>
      ) : (
        <div className="space-y-2.5">
          {patients.map((p) => {
            const st = statusBadges[p.status];
            return (
              <div
                key={p.id}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  p.status === 'AU_FAUTEUIL'
                    ? 'bg-purple-50/70 border-purple-300 shadow-sm'
                    : p.status === 'SALLE_ATTENTE'
                    ? 'bg-emerald-50/70 border-emerald-300'
                    : 'bg-slate-50/60 border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-10 rounded-xl bg-white border border-slate-200 flex flex-col items-center justify-center font-mono font-bold text-xs text-slate-800 shadow-sm">
                    <Clock className="w-3 h-3 text-sky-500 mb-0.5" />
                    <span>{p.time}</span>
                  </div>

                  <div>
                    <Link
                      href={`/dashboard/patients/${p.patientId}`}
                      className="font-bold text-xs text-slate-900 hover:text-sky-600 transition-colors flex items-center gap-1 group"
                    >
                      <span>{p.name}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      <span className="font-semibold text-slate-700">{p.title}</span> • {p.careType}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {/* WhatsApp Quick Call */}
                  <a
                    href={buildDirectWhatsAppUrl(p.phone, `Bonjour ${p.name}, le cabinet dentaire vous informe que...`)}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-100 transition-colors"
                    title="Envoyer un message WhatsApp"
                  >
                    <PhoneCall className="w-4 h-4" />
                  </a>

                  {/* Status Dropdown / Action */}
                  <select
                    value={p.status}
                    onChange={(e) => onUpdateStatus(p.id, e.target.value as AppointmentStatus)}
                    className={`px-2.5 py-1 text-xs font-bold rounded-xl border ${st.bg} ${st.text} ${st.border} focus:outline-none`}
                  >
                    <option value="PLANIFIE">Planifié</option>
                    <option value="CONFIRME">Confirmé</option>
                    <option value="SALLE_ATTENTE">En Salle d'Attente</option>
                    <option value="AU_FAUTEUIL">Au Fauteuil</option>
                    <option value="TERMINE">Terminé</option>
                    <option value="ABSENT">Absent</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
