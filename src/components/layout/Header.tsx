'use client';

import React from 'react';
import Link from 'next/link';
import {
  Search,
  Plus,
  Bell,
  UserPlus,
  CalendarPlus,
  CreditCard,
  PhoneCall,
  Clock,
  Sparkles
} from 'lucide-react';

interface HeaderProps {
  onQuickPatient?: () => void;
  onQuickAppointment?: () => void;
  onQuickPayment?: () => void;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
  todayDateStr?: string;
}

export default function Header({
  onQuickPatient,
  onQuickAppointment,
  onQuickPayment,
  searchQuery,
  setSearchQuery,
  todayDateStr = new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date()),
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 px-6 py-3.5 flex items-center justify-between gap-4">
      {/* Date & Search Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200/80">
          <Clock className="w-4 h-4 text-sky-600" />
          <span className="capitalize">{todayDateStr}</span>
        </div>

        {setSearchQuery && (
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery || ''}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher patient par Nom, Téléphone ou CIN..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-100/80 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all placeholder:text-slate-400"
            />
          </div>
        )}
      </div>

      {/* Quick Action Buttons */}
      <div className="flex items-center gap-2">
        {onQuickPatient && (
          <button
            onClick={onQuickPatient}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 transition-colors shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden md:inline">+ Nouveau Patient</span>
          </button>
        )}

        {onQuickAppointment && (
          <button
            onClick={onQuickAppointment}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors shadow-sm"
          >
            <CalendarPlus className="w-4 h-4" />
            <span className="hidden md:inline">+ Nouveau RDV</span>
          </button>
        )}

        {onQuickPayment && (
          <button
            onClick={onQuickPayment}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:opacity-95 transition-opacity shadow-sm shadow-emerald-500/20"
          >
            <CreditCard className="w-4 h-4" />
            <span className="hidden md:inline">Encaisser</span>
          </button>
        )}

        {/* Urgence WhatsApp Quick Link */}
        <a
          href="https://web.whatsapp.com"
          target="_blank"
          rel="noreferrer"
          title="Ouvrir WhatsApp Web Cabinet"
          className="p-2 rounded-xl text-emerald-600 hover:bg-emerald-50 border border-emerald-200 transition-colors"
        >
          <PhoneCall className="w-4 h-4" />
        </a>
      </div>
    </header>
  );
}
