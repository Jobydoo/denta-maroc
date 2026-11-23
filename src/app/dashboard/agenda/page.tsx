'use client';

import React, { useState, useEffect } from 'react';
import { AppointmentStatus, CareType } from '@/types';
import { formatDateFR } from '@/lib/utils';
import { buildAppointmentReminderUrl, buildDirectWhatsAppUrl } from '@/lib/whatsapp';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Plus,
  Phone,
  MessageCircle,
  CheckCircle,
  Filter,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface AppointmentItem {
  id: string;
  patientId: string;
  patient: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    cin?: string | null;
  };
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  careType: CareType;
  notes?: string | null;
}

export default function AgendaPage() {
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Nouveau RDV State
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientPhone, setNewPatientPhone] = useState('+212 6 ');
  const [newTitle, setNewTitle] = useState('Consultation & Soins');
  const [newCareType, setNewCareType] = useState<CareType>('SOIN');
  const [newDate, setNewDate] = useState(selectedDate);
  const [newStartTime, setNewStartTime] = useState('10:00');
  const [newNotes, setNewNotes] = useState('');

  const fetchAppointments = async () => {
    try {
      const res = await fetch(`/api/appointments?date=${selectedDate}`);
      if (res.ok) {
        const data = await res.json();
        setAppointments(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [selectedDate]);

  const handleUpdateStatus = async (id: string, newStatus: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
    try {
      await fetch('/api/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();

    const tempId = `appt-${Date.now()}`;
    const pFirst = newPatientName.trim().split(' ')[0] || 'Patient';
    const pLast = newPatientName.trim().split(' ').slice(1).join(' ') || 'Cabinet';

    const optimisticAppt: AppointmentItem = {
      id: tempId,
      patientId: `pat-${Date.now()}`,
      patient: {
        id: `pat-${Date.now()}`,
        firstName: pFirst,
        lastName: pLast,
        phone: newPatientPhone,
      },
      title: newTitle,
      date: new Date(newDate).toISOString(),
      startTime: newStartTime,
      endTime: '11:00',
      status: 'PLANIFIE' as AppointmentStatus,
      careType: newCareType,
      notes: newNotes,
    };

    setAppointments((prev) => [optimisticAppt, ...prev]);
    setIsNewModalOpen(false);
    showToast(`✓ Rendez-vous programmé pour ${pFirst} ${pLast} à ${newStartTime} !`);

    try {
      const patRes = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: pFirst,
          lastName: pLast,
          phone: newPatientPhone,
          dateOfBirth: '1990-01-01',
        }),
      });
      const newPat = await patRes.json();

      await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: newPat.id,
          title: newTitle,
          careType: newCareType,
          date: newDate,
          startTime: newStartTime,
          endTime: '11:00',
          status: 'PLANIFIE',
          notes: newNotes,
        }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = appointments.filter((a) => {
    if (statusFilter === 'ALL') return true;
    return a.status === statusFilter;
  });

  return (
    <div className="space-y-6 animate-fade-in relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 font-bold text-xs animate-bounce">
          <CheckCircle className="w-5 h-5 text-emerald-200" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Agenda Clinique & Gestion des Rendez-vous
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Planning des consultations, flux de la salle d'attente et rappels WhatsApp automatisés
          </p>
        </div>

        <button
          onClick={() => setIsNewModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-sky-600 to-teal-600 text-white font-bold text-xs shadow-lg shadow-sky-600/20 hover:opacity-95 transition-opacity self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Fixer un Rendez-vous</span>
        </button>
      </div>

      {/* Date Navigation & Controls */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="p-2.5 text-xs font-bold rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
          />

          <span className="text-xs font-bold text-slate-600 capitalize">
            {new Intl.DateTimeFormat('fr-FR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            }).format(new Date(selectedDate))}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 text-xs font-bold rounded-2xl bg-slate-50 border border-slate-200 text-slate-700"
          >
            <option value="ALL">Tous les statuts</option>
            <option value="PLANIFIE">Planifié</option>
            <option value="CONFIRME">Confirmé</option>
            <option value="SALLE_ATTENTE">En Salle d'Attente</option>
            <option value="AU_FAUTEUIL">Au Fauteuil</option>
            <option value="TERMINE">Terminé</option>
            <option value="ABSENT">Absent / Annulé</option>
          </select>
        </div>
      </div>

      {/* Appointment List / Timeline */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-slate-400 bg-white rounded-3xl border">
            Chargement de l'agenda...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200 space-y-2">
            <CalendarIcon className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-bold text-slate-600">Aucun rendez-vous pour cette date.</p>
            <p className="text-[11px] text-slate-400">
              Cliquez sur "+ Fixer un Rendez-vous" pour ajouter un patient à l'agenda.
            </p>
          </div>
        ) : (
          filtered.map((appt) => {
            const reminderUrl = buildAppointmentReminderUrl({
              patientPhone: appt.patient.phone,
              patientName: `${appt.patient.firstName} ${appt.patient.lastName}`,
              doctorName: 'Dr. Mehdi Alami',
              clinicName: 'Cabinet Dentaire Dr. Alami',
              clinicAddress: '145 Boulevard d\'Anfa, 4ème étage, Casablanca',
              appointmentDate: formatDateFR(appt.date),
              appointmentTime: appt.startTime,
            });

            return (
              <div
                key={appt.id}
                className={`p-5 rounded-3xl border bg-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:shadow-md ${
                  appt.status === 'AU_FAUTEUIL'
                    ? 'border-purple-300 ring-2 ring-purple-500/20 bg-purple-50/20'
                    : appt.status === 'SALLE_ATTENTE'
                    ? 'border-emerald-300 ring-2 ring-emerald-500/20 bg-emerald-50/20'
                    : 'border-slate-200'
                }`}
              >
                {/* Time & Patient */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-14 rounded-2xl bg-slate-900 text-white flex flex-col items-center justify-center font-mono shrink-0 shadow-sm">
                    <Clock className="w-3.5 h-3.5 text-teal-400 mb-0.5" />
                    <span className="text-xs font-black">{appt.startTime}</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-black text-slate-900">
                        {appt.patient.firstName} {appt.patient.lastName}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                        {appt.careType}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-slate-600 mt-0.5">{appt.title}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Tél : <strong className="text-slate-700 font-mono">{appt.patient.phone}</strong>{' '}
                      {appt.notes ? `• ${appt.notes}` : ''}
                    </p>
                  </div>
                </div>

                {/* Workflow State Switcher & 1-Click WhatsApp Reminder */}
                <div className="flex items-center gap-3 self-end sm:self-center">
                  {/* WhatsApp Reminder Button */}
                  <a
                    href={reminderUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold transition-colors shadow-sm"
                    title="Envoyer un rappel de RDV par WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                    <span className="hidden md:inline">Rappel WhatsApp</span>
                  </a>

                  {/* Status Dropdown */}
                  <select
                    value={appt.status}
                    onChange={(e) =>
                      handleUpdateStatus(appt.id, e.target.value as AppointmentStatus)
                    }
                    className="px-3 py-2 rounded-xl text-xs font-black border border-slate-300 bg-slate-50 text-slate-800 focus:bg-white focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="PLANIFIE">Planifié</option>
                    <option value="CONFIRME">Confirmé</option>
                    <option value="SALLE_ATTENTE">En Salle d'Attente</option>
                    <option value="AU_FAUTEUIL">Au Fauteuil (En Soin)</option>
                    <option value="TERMINE">Terminé</option>
                    <option value="ABSENT">Absent / Annulé</option>
                  </select>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal Nouveau Rendez-vous */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
              <h3 className="font-bold text-sm">Nouveau Rendez-vous Patient</h3>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nom Complet du Patient *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Mehdi Bennani"
                  value={newPatientName}
                  onChange={(e) => setNewPatientName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:bg-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Téléphone Mobile (pour rappels WhatsApp) *
                </label>
                <input
                  type="tel"
                  required
                  value={newPatientPhone}
                  onChange={(e) => setNewPatientPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 font-mono font-bold focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 border border-slate-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Heure de Début</label>
                  <input
                    type="time"
                    required
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 border border-slate-300 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Motif / Acte</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Ex: Soin carie dent 26"
                    className="w-full p-2 rounded-xl bg-slate-50 border border-slate-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Catégorie</label>
                  <select
                    value={newCareType}
                    onChange={(e) => setNewCareType(e.target.value as CareType)}
                    className="w-full p-2 rounded-xl bg-slate-50 border border-slate-300 font-bold"
                  >
                    <option value="CONSULTATION">Consultation</option>
                    <option value="SOIN">Soin Conservateur</option>
                    <option value="PROTHESE">Prothèse</option>
                    <option value="CHIRURGIE">Chirurgie</option>
                    <option value="IMPLANTOLOGIE">Implantologie</option>
                    <option value="ORTHODONTIE">Orthodontie</option>
                    <option value="URGENCE">Urgence Dentaire</option>
                    <option value="CONTROLE">Contrôle</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Notes Cliniques</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Ex: Patient anxieux, anesthésie sans adrénaline..."
                  className="w-full p-2 rounded-xl bg-slate-50 border border-slate-300"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold shadow-md shadow-sky-600/20"
                >
                  Valider le Rendez-vous
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
