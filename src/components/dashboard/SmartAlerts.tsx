'use client';

import React from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  Clock,
  Layers,
  Package,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Cake
} from 'lucide-react';
import { formatMAD, formatDateFR } from '@/lib/utils';

export interface SmartAlertItem {
  id: string;
  type: 'PROTHESE_LATE' | 'CHECK_PENDING' | 'STOCK_LOW' | 'BIRTHDAY';
  title: string;
  description: string;
  badge?: string;
  actionUrl: string;
}

interface SmartAlertsProps {
  alerts: SmartAlertItem[];
}

export default function SmartAlerts({ alerts }: SmartAlertsProps) {
  if (alerts.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm">
        <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>Toutes les alertes sont à jour : aucune prothèse en retard ni stock critique !</span>
        </div>
      </div>
    );
  }

  const iconMap = {
    PROTHESE_LATE: { icon: Layers, bg: 'bg-amber-100 text-amber-700 border-amber-300' },
    CHECK_PENDING: { icon: Clock, bg: 'bg-sky-100 text-sky-700 border-sky-300' },
    STOCK_LOW: { icon: Package, bg: 'bg-rose-100 text-rose-700 border-rose-300' },
    BIRTHDAY: { icon: Cake, bg: 'bg-purple-100 text-purple-700 border-purple-300' },
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-3">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <h3 className="font-black text-slate-900 text-sm">
            Alertes Intelligentes & Vigilance Clinique
          </h3>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold">
          {alerts.length} action(s) requise(s)
        </span>
      </div>

      <div className="space-y-2">
        {alerts.map((alert) => {
          const cfg = iconMap[alert.type];
          const Icon = cfg.icon;
          return (
            <Link
              key={alert.id}
              href={alert.actionUrl}
              className="p-3 rounded-2xl border border-slate-200/80 hover:border-slate-300 bg-slate-50/50 hover:bg-white transition-all flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl border ${cfg.bg}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-xs text-slate-900 group-hover:text-sky-600 transition-colors">
                      {alert.title}
                    </p>
                    {alert.badge && (
                      <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
                        {alert.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{alert.description}</p>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
