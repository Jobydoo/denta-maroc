'use client';

import React, { useState, useEffect } from 'react';
import StatCard from '@/components/dashboard/StatCard';
import QueueCard, { TodayPatient } from '@/components/dashboard/QueueCard';
import SmartAlerts, { SmartAlertItem } from '@/components/dashboard/SmartAlerts';
import RevenueChart from '@/components/dashboard/RevenueChart';
import { formatMAD } from '@/lib/utils';
import {
  TrendingUp,
  Receipt,
  AlertCircle,
  CreditCard,
  TrendingDown,
  Sparkles,
  Calendar,
  Users
} from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    caMois: 68500,
    encaisseMois: 54000,
    resteAEncaisser: 14500,
    depensesMois: 19570,
    beneficeNet: 34430,
  });

  const [todayPatients, setTodayPatients] = useState<TodayPatient[]>([
    {
      id: 'appt-1',
      patientId: 'pat-1',
      name: 'Youssef Berrada',
      phone: '+212661112233',
      time: '09:00',
      careType: 'PROTHESE',
      title: 'Pose Couronne Zircone sur 26',
      status: 'AU_FAUTEUIL',
    },
    {
      id: 'appt-2',
      patientId: 'pat-2',
      name: 'Fatima Zahra El Amrani',
      phone: '+212663445566',
      time: '10:00',
      careType: 'SOIN',
      title: 'Contrôle parodontal & Détartrage doux',
      status: 'SALLE_ATTENTE',
    },
    {
      id: 'appt-3',
      patientId: 'pat-4',
      name: 'Khadija Bennani',
      phone: '+212665332211',
      time: '11:00',
      careType: 'SOIN',
      title: 'Séance Éclaircissement dentaire LED',
      status: 'CONFIRME',
    },
    {
      id: 'appt-4',
      patientId: 'pat-3',
      name: 'Mohamed Tazi',
      phone: '+212670889900',
      time: '15:30',
      careType: 'CONTROLE',
      title: 'Consultation & Contrôle Implant',
      status: 'PLANIFIE',
    },
  ]);

  const [smartAlerts, setSmartAlerts] = useState<SmartAlertItem[]>([
    {
      id: 'al-1',
      type: 'PROTHESE_LATE',
      title: 'Commande Prothèse Zircone livrée à valider',
      description: 'Patient : Youssef Berrada • Labo Atlas Dental (Teinte A2 sur 26)',
      badge: 'Prêt à poser',
      actionUrl: '/dashboard/protheses',
    },
    {
      id: 'al-2',
      type: 'CHECK_PENDING',
      title: 'Chèque à encaisser cette semaine (1 500 MAD)',
      description: 'Attijariwafa bank N° CHQ-8934521 • Patient : Youssef Berrada',
      badge: 'Échéance J+7',
      actionUrl: '/dashboard/finances',
    },
    {
      id: 'al-3',
      type: 'STOCK_LOW',
      title: 'Stock critique : Septanest 4% Adrénaline',
      description: 'Il reste seulement 3 boîtes en réserve (Seuil d\'alerte minimal : 5)',
      badge: 'Réappro',
      actionUrl: '/dashboard/stock',
    },
    {
      id: 'al-4',
      type: 'STOCK_LOW',
      title: 'Stock critique : Composite 3M Filtek A2',
      description: 'Il reste 2 seringues disponibles au cabinet.',
      badge: 'Urgent',
      actionUrl: '/dashboard/stock',
    },
  ]);

  const [monthlyData] = useState([
    { month: 'Juin', recettes: 52000, depenses: 16000, benefice: 36000 },
    { month: 'Juil', recettes: 61000, depenses: 18500, benefice: 42500 },
    { month: 'Août', recettes: 45000, depenses: 14000, benefice: 31000 },
    { month: 'Sept', recettes: 72000, depenses: 21000, benefice: 51000 },
    { month: 'Oct', recettes: 64000, depenses: 17500, benefice: 46500 },
    { month: 'Nov', recettes: 68500, depenses: 19570, benefice: 48930 },
  ]);

  const [categoryData] = useState([
    { category: 'Prothèses (Zircone & CCM)', amount: 28500, percentage: 42, color: '#0ea5e9' },
    { category: 'Implantologie & Chirurgie', amount: 18000, percentage: 26, color: '#0d9488' },
    { category: 'Soins Conservateurs & Endo', amount: 14000, percentage: 20, color: '#f59e0b' },
    { category: 'Esthétique & Blanchiment', amount: 8000, percentage: 12, color: '#8b5cf6' },
  ]);

  const handleUpdatePatientStatus = async (apptId: string, newStatus: any) => {
    setTodayPatients((prev) =>
      prev.map((p) => (p.id === apptId ? { ...p, status: newStatus } : p))
    );
    try {
      await fetch('/api/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: apptId, status: newStatus }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 p-6 sm:p-8 rounded-3xl text-white border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tableau de Bord Clinique & Financier • Maroc</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Bonjour, <span className="text-teal-400">Dr. Mehdi Alami</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Aujourd'hui, <strong>{todayPatients.length} patients</strong> sont programmés à votre agenda. 1 patient est actuellement en salle d'attente et 1 au fauteuil.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-800/80 border border-slate-700/80 p-3.5 rounded-2xl text-right">
            <p className="text-[11px] font-bold uppercase text-slate-400">Date du Jour</p>
            <p className="text-xs font-mono font-bold text-white capitalize">
              {new Intl.DateTimeFormat('fr-FR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              }).format(new Date())}
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Chiffre d'Affaires (Mois)"
          value={formatMAD(stats.caMois)}
          subValue="Devis & Actes facturés"
          icon={TrendingUp}
          colorTheme="sky"
          trend={{ value: '+14%', isPositive: true }}
        />
        <StatCard
          title="Total Encaissé"
          value={formatMAD(stats.encaisseMois)}
          subValue="En caisse & banque"
          icon={Receipt}
          colorTheme="emerald"
          trend={{ value: '+18%', isPositive: true }}
        />
        <StatCard
          title="Reste à Encaisser"
          value={formatMAD(stats.resteAEncaisser)}
          subValue="Crédits patients en cours"
          icon={AlertCircle}
          colorTheme="rose"
        />
        <StatCard
          title="Dépenses & Charges"
          value={formatMAD(stats.depensesMois)}
          subValue="Loyer, Labo, Matériel"
          icon={TrendingDown}
          colorTheme="amber"
        />
        <StatCard
          title="Bénéfice Net Réel"
          value={formatMAD(stats.beneficeNet)}
          subValue="Encaissements - Dépenses"
          icon={CreditCard}
          colorTheme="purple"
          trend={{ value: '+9%', isPositive: true }}
        />
      </div>

      {/* Main Grid : File d'attente du jour + Alertes Intelligentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QueueCard
          patients={todayPatients}
          onUpdateStatus={handleUpdatePatientStatus}
        />
        <SmartAlerts alerts={smartAlerts} />
      </div>

      {/* Financial Analytics & Procedure Rentability Charts */}
      <RevenueChart
        monthlyData={monthlyData}
        categoryData={categoryData}
      />
    </div>
  );
}
