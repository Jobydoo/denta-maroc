'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Save, Download, Database, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function ParametresPage() {
  const [settings, setSettings] = useState({
    name: 'Cabinet Dentaire Dr. Mehdi Alami',
    doctorName: 'Dr. Mehdi Alami',
    specialty: 'Chirurgien-Dentiste - Implantologie & Prothèse',
    address: '145 Boulevard d\'Anfa, 4ème étage, Maarif',
    city: 'Casablanca',
    phone: '+212 5 22 20 30 40',
    whatsappNumber: '+212 6 61 23 45 67',
    email: 'contact@cabinet-alami.ma',
    ice: '002345678000045',
    taxId: '45879201',
    patente: '32415089',
    inpe: '098765432',
    defaultCurrency: 'MAD',
  });

  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.name) setSettings(data);
      })
      .catch(console.error);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Paramètres du Cabinet Dentaire & Sauvegardes
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Mentions légales marocaines (ICE, IF, Patente, INPE), catalogue et export complet de la base
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Form */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-6">
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            {isSaved && (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Paramètres du cabinet mis à jour avec succès !</span>
              </div>
            )}

            <h3 className="font-black text-slate-900 text-sm border-b pb-2">
              Identité & Coordonnées du Cabinet
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nom du Cabinet</label>
                <input
                  type="text"
                  value={settings.name}
                  onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nom du Chirurgien-Dentiste</label>
                <input
                  type="text"
                  value={settings.doctorName}
                  onChange={(e) => setSettings({ ...settings, doctorName: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Adresse</label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Ville</label>
                <input
                  type="text"
                  value={settings.city}
                  onChange={(e) => setSettings({ ...settings, city: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Téléphone Cabinet</label>
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 font-mono"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">WhatsApp Cabinet</label>
                <input
                  type="text"
                  value={settings.whatsappNumber}
                  onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 font-mono"
                />
              </div>
            </div>

            <h3 className="font-black text-slate-900 text-sm border-b pb-2 pt-4">
              Mentions Légales & Fiscalité Marocaine
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">ICE (15 chiffres)</label>
                <input
                  type="text"
                  value={settings.ice}
                  onChange={(e) => setSettings({ ...settings, ice: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 font-mono"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Identifiant Fiscal (IF)</label>
                <input
                  type="text"
                  value={settings.taxId}
                  onChange={(e) => setSettings({ ...settings, taxId: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 font-mono"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Patente</label>
                <input
                  type="text"
                  value={settings.patente}
                  onChange={(e) => setSettings({ ...settings, patente: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 font-mono"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">INPE (Santé)</label>
                <input
                  type="text"
                  value={settings.inpe}
                  onChange={(e) => setSettings({ ...settings, inpe: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 font-mono"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md shadow-sky-600/20 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Enregistrer les Paramètres</span>
              </button>
            </div>
          </form>
        </div>

        {/* Database Backup & Export Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-sky-700">
            <Database className="w-5 h-5" />
            <h3 className="font-black text-slate-900 text-sm">Sauvegarde & Export Base de Données</h3>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Téléchargez l'intégralité des données de votre cabinet (patients, rendez-vous, factures, encaissements, prothèses, consommables) en 1 clic pour archivage sécurisé.
          </p>

          <div className="space-y-3">
            <a
              href="/api/export?format=json"
              download
              className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Exporter Tout en JSON (Complet)</span>
            </a>

            <a
              href="/api/export?format=csv"
              download
              className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-300 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Exporter Patients en CSV (Excel)</span>
            </a>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 space-y-1">
            <p className="font-bold text-slate-700">🔒 Conformité CNDP Maroc :</p>
            <p>
              Les données médicales sont stockées et chiffrées selon les recommandations légales du Conseil de l'Ordre National des Médecins Dentistes du Maroc.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
