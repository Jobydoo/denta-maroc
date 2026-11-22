'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { ShieldCheck, ArrowRight, Stethoscope, Users, Calendar, Layers, Sparkles } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white flex flex-col justify-between">
      {/* Navbar */}
      <header className="px-8 py-6 flex items-center justify-between max-w-7xl mx-auto w-full border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-teal-400 p-0.5 shadow-lg shadow-sky-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <span className="text-xl">🦷</span>
            </div>
          </div>
          <div>
            <span className="text-xl font-black text-white">Denta</span>
            <span className="text-xl font-black text-teal-400">Maroc</span>
          </div>
        </div>

        <Link
          href="/login"
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-teal-500 text-white font-bold text-xs shadow-lg shadow-sky-500/20 hover:opacity-95 transition-all"
        >
          <span>Espace Connexion</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </header>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-6 py-16 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold">
          <Sparkles className="w-4 h-4" />
          <span>Solution Médicale Spécialisée Cabinet & Laboratoire Dentaire au Maroc</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
          La gestion clinique intégrale pensée pour les{' '}
          <span className="bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
            Chirurgiens-Dentistes Marocains
          </span>
        </h1>

        <p className="text-slate-400 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
          Odontogramme FDI interactif, feuille de soins et devis mutuelle (CNOPS, CNSS, AMO), suivi de fabrication des prothèses en temps réel et rappels WhatsApp en un clic.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            href="/login"
            className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-sky-500 via-teal-500 to-emerald-500 text-slate-950 font-black text-sm shadow-xl shadow-teal-500/20 hover:scale-105 transition-all"
          >
            <Stethoscope className="w-5 h-5 text-slate-950" />
            <span>Accéder au Cabinet de Démonstration</span>
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 text-left">
          <div className="p-6 rounded-3xl bg-slate-800/40 border border-slate-700/60 backdrop-blur space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/20 flex items-center justify-center text-sky-400 font-bold">
              🦷
            </div>
            <h3 className="font-bold text-sm text-white">Odontogramme FDI Interactif</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Notation adulte 11-48 et enfant 51-85 avec cartographie 5 faces, diagnostic de carie, dévitalisation, couronnes et implants.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-800/40 border border-slate-700/60 backdrop-blur space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 flex items-center justify-center text-teal-400 font-bold">
              📑
            </div>
            <h3 className="font-bold text-sm text-white">Facturation & Mutuelles Maroc</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Devis et factures conformes DGI (ICE, IF, INPE) avec gestion des dossiers CNOPS, CNSS, AMO et reçus de règlement chèques.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-800/40 border border-slate-700/60 backdrop-blur space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold">
              🔬
            </div>
            <h3 className="font-bold text-sm text-white">Traçabilité Prothèse & Labo</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Bons de commande labo, sélection teinte Vita, suivi Kanban de l'empreinte jusqu'à la pose et calcul automatique de rentabilité.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <p>DentaMaroc • Plateforme Cloud pour Cabinets et Cliniques Dentaires au Maroc • Conforme Vercel & PostgreSQL</p>
      </footer>
    </div>
  );
}
