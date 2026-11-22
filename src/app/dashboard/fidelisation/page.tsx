'use client';

import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Star, MessageCircle, QrCode as QrIcon, Printer, HeartHandshake } from 'lucide-react';
import { buildGoogleReviewRequestUrl } from '@/lib/whatsapp';

export default function FidelisationPage() {
  const [googleReviewUrl, setGoogleReviewUrl] = useState(
    'https://g.page/r/dental-alami-casablanca/review'
  );
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [patientPhone, setPatientPhone] = useState('+212 6 61 11 22 33');
  const [patientName, setPatientName] = useState('Youssef Berrada');

  useEffect(() => {
    QRCode.toDataURL(googleReviewUrl, { width: 300, margin: 2 }, (err, url) => {
      if (!err && url) {
        setQrCodeDataUrl(url);
      }
    });
  }, [googleReviewUrl]);

  const whatsappUrl = buildGoogleReviewRequestUrl({
    patientPhone,
    patientName,
    clinicName: 'Cabinet Dentaire Dr. Mehdi Alami',
    googleReviewUrl,
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Fidélisation & Avis Google Maps 5 Étoiles
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Boostez la réputation locale de votre cabinet à Casablanca / Maroc auprès de nouveaux patients
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QR Code Card */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm flex flex-col items-center text-center space-y-4">
          <div className="flex items-center gap-2 text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
            ))}
          </div>

          <h3 className="font-black text-lg text-slate-900">
            Chevalet de Comptoir : Scannez pour Laisser un Avis
          </h3>
          <p className="text-xs text-slate-500 max-w-sm">
            Placez ce QR code sur votre banque d'accueil. Les patients scannent avec leur smartphone pour ouvrir directement la page Google Maps 5 étoiles.
          </p>

          {qrCodeDataUrl && (
            <div className="p-4 bg-white rounded-3xl border-2 border-slate-900 shadow-lg">
              <img src={qrCodeDataUrl} alt="QR Code Avis Google" className="w-48 h-48 mx-auto" />
            </div>
          )}

          <div className="w-full space-y-2 pt-2">
            <label className="text-[11px] font-bold text-slate-600 block text-left">
              Lien de votre Fiche Google Business Profile :
            </label>
            <input
              type="text"
              value={googleReviewUrl}
              onChange={(e) => setGoogleReviewUrl(e.target.value)}
              className="w-full p-2.5 text-xs font-mono rounded-xl bg-slate-50 border border-slate-300"
            />
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 shadow-md transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer le Chevalet d'Accueil (A4 / A5)</span>
          </button>
        </div>

        {/* WhatsApp Post-Care Campaign */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-emerald-600">
            <MessageCircle className="w-6 h-6 fill-emerald-500 text-emerald-500" />
            <h3 className="font-black text-base text-slate-900">
              Message WhatsApp Post-Soin Automatisé
            </h3>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Envoyez un message chaleureux au patient le lendemain de sa consultation pour prendre de ses nouvelles et l'inviter à partager son expérience.
          </p>

          <div className="space-y-3">
            <div>
              <label className="font-bold text-xs text-slate-700 block mb-1">Nom du Patient</label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full p-2 text-xs rounded-xl bg-slate-50 border border-slate-300"
              />
            </div>
            <div>
              <label className="font-bold text-xs text-slate-700 block mb-1">Numéro WhatsApp</label>
              <input
                type="text"
                value={patientPhone}
                onChange={(e) => setPatientPhone(e.target.value)}
                className="w-full p-2 text-xs rounded-xl bg-slate-50 border border-slate-300 font-mono"
              />
            </div>
          </div>

          <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 text-xs text-slate-700 space-y-2">
            <p className="font-bold text-emerald-900">Aperçu du message WhatsApp :</p>
            <p className="italic text-slate-600 text-[11px] leading-relaxed">
              « Bonjour {patientName}, toute l'équipe du Cabinet Dentaire Dr. Mehdi Alami espère que vos soins se sont bien passés ! Votre avis compte énormément pour nous. Pourriez-vous nous accorder 30 secondes pour partager votre expérience avec une note de 5 étoiles sur Google ? ⭐⭐⭐⭐⭐ »
            </p>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Envoyer la Demande d'Avis sur WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
