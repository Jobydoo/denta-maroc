'use client';

import React from 'react';
import { formatMAD } from '@/lib/utils';
import { BarChart3, PieChart, TrendingUp } from 'lucide-react';

interface RevenueChartProps {
  monthlyData: Array<{
    month: string;
    recettes: number;
    depenses: number;
    benefice: number;
  }>;
  categoryData: Array<{
    category: string;
    amount: number;
    percentage: number;
    color: string;
  }>;
}

export default function RevenueChart({ monthlyData, categoryData }: RevenueChartProps) {
  const maxAmount = Math.max(
    ...monthlyData.map((d) => Math.max(d.recettes, d.depenses, 10000)),
    30000
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Bar Chart : Recettes vs Dépenses */}
      <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-sky-600" />
            <h3 className="font-black text-slate-900 text-sm">
              Évolution Financière (Recettes vs Dépenses vs Marge)
            </h3>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-bold">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-sky-600" />
              <span className="text-slate-600">Recettes Encaissées</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-rose-500" />
              <span className="text-slate-600">Dépenses & Charges</span>
            </div>
          </div>
        </div>

        {/* Visual SVG Bars */}
        <div className="h-56 flex items-end justify-between gap-4 pt-6 px-2">
          {monthlyData.map((d) => {
            const hRecettes = Math.round((d.recettes / maxAmount) * 160);
            const hDepenses = Math.round((d.depenses / maxAmount) * 160);

            return (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="relative flex items-end gap-1.5 h-44 w-full justify-center">
                  {/* Tooltip */}
                  <div className="absolute -top-10 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 whitespace-nowrap">
                    Bénéfice : {formatMAD(d.benefice)}
                  </div>

                  {/* Recettes bar */}
                  <div
                    style={{ height: `${Math.max(hRecettes, 4)}px` }}
                    className="w-4 sm:w-6 bg-gradient-to-t from-sky-600 to-teal-500 rounded-t-lg transition-all group-hover:brightness-110 shadow-sm"
                    title={`Recettes: ${formatMAD(d.recettes)}`}
                  />
                  {/* Dépenses bar */}
                  <div
                    style={{ height: `${Math.max(hDepenses, 4)}px` }}
                    className="w-4 sm:w-6 bg-gradient-to-t from-rose-500 to-pink-500 rounded-t-lg transition-all group-hover:brightness-110 shadow-sm"
                    title={`Dépenses: ${formatMAD(d.depenses)}`}
                  />
                </div>
                <span className="text-[11px] font-bold text-slate-500 group-hover:text-slate-900">
                  {d.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Distribution des Actes par Catégorie */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <PieChart className="w-5 h-5 text-teal-600" />
          <h3 className="font-black text-slate-900 text-sm">
            Répartition du Chiffre d'Affaires
          </h3>
        </div>

        <div className="space-y-3 pt-2">
          {categoryData.map((cat) => (
            <div key={cat.category} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-700">{cat.category}</span>
                <span className="font-mono font-bold text-slate-900">
                  {formatMAD(cat.amount)} ({cat.percentage}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
                  className="h-full rounded-full transition-all duration-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
