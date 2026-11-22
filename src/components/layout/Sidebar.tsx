'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Layers,
  Receipt,
  TrendingDown,
  Package,
  HeartHandshake,
  Settings,
  LogOut,
  Sparkles,
  Stethoscope,
  ShieldCheck,
  Building2,
  Menu,
  X
} from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';

interface SidebarProps {
  waitingRoomCount?: number;
  protheseAlertCount?: number;
  lowStockCount?: number;
}

export default function Sidebar({
  waitingRoomCount = 0,
  protheseAlertCount = 0,
  lowStockCount = 0,
}: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = React.useState(false);

  const role = (session?.user as any)?.role || 'ADMIN';

  const navLinks = [
    {
      title: 'Tableau de Bord',
      href: '/dashboard',
      icon: LayoutDashboard,
      roles: ['ADMIN', 'ASSISTANT', 'PROTHESISTE'],
    },
    {
      title: 'Patients & Fiches 360°',
      href: '/dashboard/patients',
      icon: Users,
      roles: ['ADMIN', 'ASSISTANT'],
    },
    {
      title: 'Agenda & Rendez-vous',
      href: '/dashboard/agenda',
      icon: Calendar,
      badge: waitingRoomCount > 0 ? `${waitingRoomCount} en attente` : undefined,
      badgeColor: 'bg-emerald-500 text-white',
      roles: ['ADMIN', 'ASSISTANT'],
    },
    {
      title: 'Suivi Prothèses & Labo',
      href: '/dashboard/protheses',
      icon: Layers,
      badge: protheseAlertCount > 0 ? `${protheseAlertCount}` : undefined,
      badgeColor: 'bg-amber-500 text-white',
      roles: ['ADMIN', 'ASSISTANT', 'PROTHESISTE'],
    },
    {
      title: 'Devis, Factures & Reçus',
      href: '/dashboard/finances',
      icon: Receipt,
      roles: ['ADMIN', 'ASSISTANT'],
    },
    {
      title: 'Dépenses & Marge Nette',
      href: '/dashboard/depenses',
      icon: TrendingDown,
      roles: ['ADMIN'], // Réservé au Docteur / Administrateur
    },
    {
      title: 'Stock Consommables',
      href: '/dashboard/stock',
      icon: Package,
      badge: lowStockCount > 0 ? `${lowStockCount} alerte` : undefined,
      badgeColor: 'bg-rose-500 text-white',
      roles: ['ADMIN', 'ASSISTANT'],
    },
    {
      title: 'Fidélisation & Avis Google',
      href: '/dashboard/fidelisation',
      icon: HeartHandshake,
      roles: ['ADMIN', 'ASSISTANT'],
    },
    {
      title: 'Paramètres du Cabinet',
      href: '/dashboard/parametres',
      icon: Settings,
      roles: ['ADMIN'],
    },
  ];

  const filteredLinks = navLinks.filter((item) => item.roles.includes(role));

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-white text-slate-700 shadow-md border border-slate-200"
        aria-label="Toggle Navigation"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay Mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-72 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand / Logo */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-500 via-cyan-400 to-teal-400 p-0.5 shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <span className="text-2xl font-black bg-gradient-to-r from-sky-400 to-teal-300 bg-clip-text text-transparent">
                  🦷
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight text-white">Denta</span>
                <span className="text-lg font-black text-emerald-400">Maroc</span>
              </div>
              <p className="text-[11px] font-medium text-slate-400">Cabinet & Prothèse Lab</p>
            </div>
          </Link>
        </div>

        {/* User Role Card */}
        <div className="px-5 py-4 border-b border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sky-950 border border-sky-800 flex items-center justify-center text-sky-400 font-bold">
              {session?.user?.name ? session.user.name.charAt(0) : 'D'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-200 truncate">
                {session?.user?.name || 'Dr. Mehdi Alami'}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    role === 'ADMIN'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : role === 'ASSISTANT'
                      ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}
                >
                  {role === 'ADMIN' ? 'DOCTEUR (ADMIN)' : role === 'ASSISTANT' ? 'ASSISTANTE' : 'PROTHÉSISTE'}
                </span>
                <span className="text-[11px] text-slate-500">• Maroc</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {filteredLinks.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-gradient-to-r from-sky-600 to-teal-600 text-white shadow-md shadow-sky-600/20 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.title}</span>
                </div>
                {item.badge && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Clinic Info Footer & Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 space-y-3">
          <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/50">
            <div className="flex items-center gap-2 text-[11px] font-medium text-slate-300">
              <Building2 className="w-3.5 h-3.5 text-teal-400" />
              <span>Casablanca, Maarif</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5 font-mono">Devise : MAD (Dirham)</p>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors border border-rose-500/20"
          >
            <LogOut className="w-4 h-4" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>
    </>
  );
}
