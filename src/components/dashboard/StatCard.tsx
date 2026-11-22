'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  subValue?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  colorTheme?: 'sky' | 'emerald' | 'amber' | 'rose' | 'purple' | 'slate';
}

const themeStyles = {
  sky: {
    bg: 'bg-sky-50/70',
    border: 'border-sky-200/80',
    iconBg: 'bg-sky-600 text-white shadow-sky-600/20',
    valueText: 'text-sky-950',
    subText: 'text-sky-700',
  },
  emerald: {
    bg: 'bg-emerald-50/70',
    border: 'border-emerald-200/80',
    iconBg: 'bg-emerald-600 text-white shadow-emerald-600/20',
    valueText: 'text-emerald-950',
    subText: 'text-emerald-700',
  },
  amber: {
    bg: 'bg-amber-50/70',
    border: 'border-amber-200/80',
    iconBg: 'bg-amber-500 text-white shadow-amber-500/20',
    valueText: 'text-amber-950',
    subText: 'text-amber-700',
  },
  rose: {
    bg: 'bg-rose-50/70',
    border: 'border-rose-200/80',
    iconBg: 'bg-rose-600 text-white shadow-rose-600/20',
    valueText: 'text-rose-950',
    subText: 'text-rose-700',
  },
  purple: {
    bg: 'bg-purple-50/70',
    border: 'border-purple-200/80',
    iconBg: 'bg-purple-600 text-white shadow-purple-600/20',
    valueText: 'text-purple-950',
    subText: 'text-purple-700',
  },
  slate: {
    bg: 'bg-slate-50/70',
    border: 'border-slate-200/80',
    iconBg: 'bg-slate-800 text-white shadow-slate-800/20',
    valueText: 'text-slate-950',
    subText: 'text-slate-600',
  },
};

export default function StatCard({
  title,
  value,
  subValue,
  icon: Icon,
  trend,
  colorTheme = 'sky',
}: StatCardProps) {
  const theme = themeStyles[colorTheme];

  return (
    <div
      className={`p-5 rounded-3xl border ${theme.bg} ${theme.border} shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            {title}
          </p>
          <h3 className={`text-2xl font-black mt-1 font-mono tracking-tight ${theme.valueText}`}>
            {value}
          </h3>
          {subValue && (
            <p className={`text-xs font-semibold mt-1 ${theme.subText}`}>{subValue}</p>
          )}
        </div>
        <div className={`p-3 rounded-2xl shadow-md ${theme.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {trend && (
        <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center gap-1.5 text-xs font-bold">
          <span
            className={`px-1.5 py-0.5 rounded text-[10px] ${
              trend.isPositive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
            }`}
          >
            {trend.isPositive ? '▲' : '▼'} {trend.value}
          </span>
          <span className="text-slate-400 font-normal">vs mois précédent</span>
        </div>
      )}
    </div>
  );
}
