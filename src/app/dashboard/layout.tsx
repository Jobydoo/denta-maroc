'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import PatientFormModal from '@/components/patients/PatientFormModal';
import PaymentReceiptModal from '@/components/invoices/PaymentReceiptModal';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [counts, setCounts] = useState({
    waitingRoomCount: 1,
    protheseAlertCount: 1,
    lowStockCount: 2,
  });

  const handleSaveQuickPatient = async (data: any) => {
    try {
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        window.location.href = '/dashboard/patients';
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveQuickPayment = async (data: any) => {
    try {
      await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          patientId: 'dummy-quick-pay',
        }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex">
      {/* Sidebar Navigation */}
      <Sidebar
        waitingRoomCount={counts.waitingRoomCount}
        protheseAlertCount={counts.protheseAlertCount}
        lowStockCount={counts.lowStockCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        <Header
          onQuickPatient={() => setIsPatientModalOpen(true)}
          onQuickAppointment={() => (window.location.href = '/dashboard/agenda')}
          onQuickPayment={() => setIsPaymentModalOpen(true)}
        />

        <main className="flex-1 p-6 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Quick Modals */}
      <PatientFormModal
        isOpen={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
        onSave={handleSaveQuickPatient}
      />

      <PaymentReceiptModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        patientId=""
        patientName="Encaissement Direct Comptoir"
        patientRemainingBalance={0}
        onSavePayment={handleSaveQuickPayment}
      />
    </div>
  );
}
