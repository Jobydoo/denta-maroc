'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Stethoscope, Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('dr.alami@dentacare.ma');
  const [password, setPassword] = useState('Admin123!');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError(res.error || 'Identifiants incorrects');
      setIsLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  const setDemoAccount = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 flex flex-col justify-center items-center p-6 text-slate-100">
      <div className="w-full max-w-md space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-14 h-14 rounded-3xl bg-gradient-to-tr from-sky-500 to-teal-400 p-0.5 shadow-xl shadow-sky-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center text-2xl">
              🦷
            </div>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Denta<span className="text-teal-400">Maroc</span>
          </h1>
          <p className="text-xs text-slate-400">
            Portail sécurisé Cabinet Dentaire & Laboratoire de Prothèse
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold text-center">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Adresse Email Professionnelle
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="docteur@cabinet.ma"
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-800/80 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 text-white placeholder:text-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Mot de Passe
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-800/80 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 text-white placeholder:text-slate-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 via-teal-500 to-emerald-500 text-slate-950 font-black text-xs shadow-lg shadow-teal-500/20 hover:opacity-95 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>{isLoading ? 'Connexion en cours...' : 'Se Connecter'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Accounts Selection */}
          <div className="pt-4 border-t border-slate-800 space-y-2.5">
            <p className="text-[11px] font-bold text-slate-400 text-center uppercase tracking-wider">
              Comptes Démonstration Immédiate (1 Clic) :
            </p>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => setDemoAccount('dr.alami@dentacare.ma', 'Admin123!')}
                className="p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700 text-left flex items-center justify-between text-xs transition-colors"
              >
                <div>
                  <p className="font-bold text-sky-400">👨‍⚕️ Dr. Mehdi Alami (ADMIN)</p>
                  <p className="text-[10px] text-slate-400">Accès total : Finances, Odontogramme, Dépenses</p>
                </div>
                <span className="text-[10px] font-mono bg-sky-950 text-sky-300 px-2 py-0.5 rounded border border-sky-800">
                  Choisir
                </span>
              </button>

              <button
                type="button"
                onClick={() => setDemoAccount('assia@dentacare.ma', 'Assistant123!')}
                className="p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700 text-left flex items-center justify-between text-xs transition-colors"
              >
                <div>
                  <p className="font-bold text-teal-400">👩‍💼 Assia Benjelloun (ASSISTANTE)</p>
                  <p className="text-[10px] text-slate-400">Agenda, Patients, Encaissements, WhatsApp</p>
                </div>
                <span className="text-[10px] font-mono bg-teal-950 text-teal-300 px-2 py-0.5 rounded border border-teal-800">
                  Choisir
                </span>
              </button>

              <button
                type="button"
                onClick={() => setDemoAccount('labo.atlas@dentacare.ma', 'Prothese123!')}
                className="p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700 text-left flex items-center justify-between text-xs transition-colors"
              >
                <div>
                  <p className="font-bold text-amber-400">🔬 Labo Atlas (PROTHÉSISTE)</p>
                  <p className="text-[10px] text-slate-400">Suivi des bons de commande et livraisons</p>
                </div>
                <span className="text-[10px] font-mono bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-800">
                  Choisir
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
