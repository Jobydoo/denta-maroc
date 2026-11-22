'use client';

import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { buildDirectWhatsAppUrl } from '@/lib/whatsapp';

interface QuickContactButtonsProps {
  phone: string;
  patientName: string;
}

export default function QuickContactButtons({ phone, patientName }: QuickContactButtonsProps) {
  const whatsappUrl = buildDirectWhatsAppUrl(
    phone,
    `Bonjour ${patientName}, Dr. Mehdi Alami (Cabinet Dentaire) : `
  );

  return (
    <div className="flex items-center gap-2">
      {/* Bouton Appel Direct */}
      <a
        href={`tel:${phone}`}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
        title="Appeler le patient"
      >
        <Phone className="w-3.5 h-3.5 text-sky-600" />
        <span>Appeler</span>
      </a>

      {/* Bouton WhatsApp en 1 Clic */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold transition-colors shadow-sm"
        title="Ouvrir conversation WhatsApp"
      >
        <MessageCircle className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
        <span>WhatsApp</span>
      </a>
    </div>
  );
}
