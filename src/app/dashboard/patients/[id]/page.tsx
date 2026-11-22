'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import MedicalAlertBanner from '@/components/patients/MedicalAlertBanner';
import Odontogram, { ToothData } from '@/components/odontogram/Odontogram';
import ToothModal from '@/components/odontogram/ToothModal';
import QuickContactButtons from '@/components/patients/QuickContactButtons';
import PrescriptionModal from '@/components/prescriptions/PrescriptionModal';
import InvoiceModal from '@/components/invoices/InvoiceModal';
import PaymentReceiptModal from '@/components/invoices/PaymentReceiptModal';
import ProtheseOrderModal from '@/components/protheses/ProtheseOrderModal';
import ImagingGallery from '@/components/patients/ImagingGallery';
import { formatMAD, formatDateFR, calculateAge } from '@/lib/utils';
import {
  User,
  Calendar,
  FileText,
  Receipt,
  Layers,
  Image as ImageIcon,
  Pill,
  CreditCard,
  Plus,
  Printer,
  ChevronLeft
} from 'lucide-react';
import Link from 'next/link';

export default function PatientProfilePage() {
  const params = useParams();
  const patientId = params.id as string;

  const [patient, setPatient] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<
    'ODONTOGRAMME' | 'TRAITEMENTS' | 'DEVIS_FACTURES' | 'PAIEMENTS' | 'IMAGERIE' | 'PROTHESES'
  >('ODONTOGRAMME');

  // Modals
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [isPrescriptionOpen, setIsPrescriptionOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [isQuoteMode, setIsQuoteMode] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isProtheseOpen, setIsProtheseOpen] = useState(false);

  const fetchPatient = async () => {
    try {
      const res = await fetch(`/api/patients/${patientId}`);
      if (res.ok) {
        const data = await res.json();
        setPatient(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchPatient();
  }, [patientId]);

  if (!patient) {
    return (
      <div className="p-12 text-center text-xs text-slate-400">
        Chargement de la fiche patient 360°...
      </div>
    );
  }

  // Mapper les conditions dentaires sous forme de dictionnaire indexé par numéro de dent FDI
  const teethRecord: Record<number, ToothData> = {};
  if (patient.teethConditions) {
    patient.teethConditions.forEach((tc: any) => {
      teethRecord[tc.toothNumber] = {
        toothNumber: tc.toothNumber,
        status: tc.status,
        surfaces: tc.surfaces ? JSON.parse(tc.surfaces) : [],
        notes: tc.notes,
      };
    });
  }

  const handleSaveTooth = async (data: any) => {
    try {
      await fetch('/api/odontogram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          patientId,
        }),
      });
      fetchPatient();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveInvoiceOrQuote = async (data: any) => {
    try {
      await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      fetchPatient();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSavePayment = async (data: any) => {
    try {
      await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          patientId,
        }),
      });
      fetchPatient();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveProthese = async (data: any) => {
    try {
      await fetch('/api/protheses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      fetchPatient();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveFile = async (data: any) => {
    try {
      // Endpoint ou direct upload
      fetchPatient();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Return link & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/patients"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                {patient.firstName} {patient.lastName}
              </h2>
              {patient.cin && (
                <span className="font-mono text-xs font-black uppercase px-2.5 py-0.5 rounded-lg bg-slate-900 text-white">
                  CIN : {patient.cin}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {calculateAge(patient.dateOfBirth)} ans ({formatDateFR(patient.dateOfBirth)}) • Mutuelle :{' '}
              <strong className="text-teal-700">{patient.mutualType}</strong> ({patient.mutualNumber || 'Non renseigné'})
            </p>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <QuickContactButtons
            phone={patient.phone}
            patientName={`${patient.firstName} ${patient.lastName}`}
          />

          <button
            onClick={() => setIsPrescriptionOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 shadow-sm transition-colors"
          >
            <Pill className="w-4 h-4 text-teal-400" />
            <span>Ordonnance</span>
          </button>

          <button
            onClick={() => {
              setIsQuoteMode(false);
              setIsInvoiceOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-50 text-sky-700 border border-sky-300 font-bold text-xs hover:bg-sky-100 shadow-sm transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>Facture</span>
          </button>

          <button
            onClick={() => setIsPaymentOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-md shadow-emerald-600/20 hover:opacity-95 transition-opacity"
          >
            <CreditCard className="w-4 h-4" />
            <span>Encaisser</span>
          </button>
        </div>
      </div>

      {/* BANDEAU D'ALERTE MÉDICALE CRITIQUE (ANAMNÈSE) */}
      <MedicalAlertBanner
        allergies={patient.allergies}
        chronicDiseases={patient.chronicDiseases}
        heartCondition={patient.heartCondition}
        bleedingDisorder={patient.bleedingDisorder}
        isPregnant={patient.isPregnant}
        biphosphonates={patient.biphosphonates}
        medicalNotes={patient.medicalNotes}
      />

      {/* Financial Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="p-2">
          <p className="text-[11px] font-bold text-slate-400 uppercase">Total Soins Facturés</p>
          <p className="text-lg font-black font-mono text-slate-900 mt-0.5">
            {formatMAD(patient.totalInvoiced)}
          </p>
        </div>
        <div className="p-2 border-y sm:border-y-0 sm:border-x border-slate-100">
          <p className="text-[11px] font-bold text-slate-400 uppercase">Total Encaissé</p>
          <p className="text-lg font-black font-mono text-emerald-600 mt-0.5">
            {formatMAD(patient.totalPaid)}
          </p>
        </div>
        <div className="p-2">
          <p className="text-[11px] font-bold text-slate-400 uppercase">Solde Restant Dû</p>
          <p className="text-lg font-black font-mono text-rose-600 mt-0.5">
            {formatMAD(patient.remainingDue)}
          </p>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold border-b border-slate-200">
        {[
          { id: 'ODONTOGRAMME', label: 'Odontogramme FDI Interactif', icon: '🦷' },
          { id: 'TRAITEMENTS', label: 'Journal des Séances & Actes', icon: '📋' },
          { id: 'DEVIS_FACTURES', label: 'Devis & Factures Mutuelle', icon: '📑' },
          { id: 'PAIEMENTS', label: 'Règlements & Reçus', icon: '💵' },
          { id: 'IMAGERIE', label: 'Radios & Photos', icon: '🖼️' },
          { id: 'PROTHESES', label: 'Commandes Labo Prothèse', icon: '🔬' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`flex items-center gap-2 px-4 py-3 rounded-t-2xl transition-all whitespace-nowrap ${
              activeTab === t.id
                ? 'bg-white text-sky-700 border-t-2 border-x border-sky-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
            }`}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1 : ODONTOGRAMME INTERACTIF */}
      {activeTab === 'ODONTOGRAMME' && (
        <div className="space-y-6">
          <Odontogram
            teethData={teethRecord}
            onSelectTooth={(num) => setSelectedTooth(num)}
            selectedToothNumber={selectedTooth}
          />
        </div>
      )}

      {/* TAB 2 : JOURNAL DES SÉANCES & ACTES */}
      {activeTab === 'TRAITEMENTS' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <h3 className="font-black text-slate-900 text-sm">
              Historique des Actes Cliniques Réalisés
            </h3>
            <button
              onClick={() => setSelectedTooth(11)}
              className="px-3 py-1.5 rounded-xl bg-sky-600 text-white font-bold text-xs"
            >
              + Ajouter un Acte
            </button>
          </div>

          {patient.treatments.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center italic">
              Aucun acte enregistré pour ce patient.
            </p>
          ) : (
            <div className="space-y-3">
              {patient.treatments.map((tr: any) => (
                <div
                  key={tr.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row justify-between sm:items-center gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{tr.procedureName}</span>
                      {tr.toothNumber && (
                        <span className="text-[10px] font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded">
                          Dent #{tr.toothNumber}
                        </span>
                      )}
                    </div>
                    {tr.clinicalNotes && (
                      <p className="text-xs text-slate-600 mt-1">{tr.clinicalNotes}</p>
                    )}
                    <p className="text-[11px] text-slate-400 mt-1">
                      Date : {formatDateFR(tr.date)} • Par : {tr.practitioner?.name || 'Dr. Alami'}
                    </p>
                  </div>
                  <div className="text-right font-mono font-bold text-sm text-slate-900">
                    {formatMAD(tr.price)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3 : DEVIS & FACTURES MUTUELLE */}
      {activeTab === 'DEVIS_FACTURES' && (
        <div className="space-y-6">
          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setIsQuoteMode(true);
                setIsInvoiceOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-300"
            >
              + Nouveau Devis
            </button>
            <button
              onClick={() => {
                setIsQuoteMode(false);
                setIsInvoiceOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md shadow-sky-600/20"
            >
              + Nouvelle Facture Mutuelle
            </button>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="font-black text-slate-900 text-sm border-b pb-3">Factures Émises</h3>
            {patient.invoices.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center italic">
                Aucune facture émise.
              </p>
            ) : (
              <div className="space-y-3">
                {patient.invoices.map((inv: any) => (
                  <div
                    key={inv.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex justify-between items-center"
                  >
                    <div>
                      <span className="font-bold font-mono text-xs text-slate-900">
                        {inv.invoiceNumber}
                      </span>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Date : {formatDateFR(inv.issueDate)} • Mutuelle : {inv.mutualType || 'Aucune'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-bold text-sm text-slate-900">
                        {formatMAD(inv.totalAmount)}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Payé : {formatMAD(inv.paidAmount)} | Reste :{' '}
                        <strong className="text-rose-600">{formatMAD(inv.remainingAmount)}</strong>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4 : PAIEMENTS & REÇUS */}
      {activeTab === 'PAIEMENTS' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <h3 className="font-black text-slate-900 text-sm">Historique des Règlements</h3>
            <button
              onClick={() => setIsPaymentOpen(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20"
            >
              + Encaisser un Règlement
            </button>
          </div>

          {patient.payments.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center italic">
              Aucun paiement enregistré pour ce patient.
            </p>
          ) : (
            <div className="space-y-3">
              {patient.payments.map((pmt: any) => (
                <div
                  key={pmt.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex justify-between items-center"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-slate-900">
                        {pmt.paymentNumber}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {pmt.method}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Date : {formatDateFR(pmt.paymentDate)} • {pmt.notes}
                    </p>
                    {pmt.method === 'CHEQUE' && pmt.checkNumber && (
                      <p className="text-[11px] font-mono text-amber-700">
                        {pmt.checkBank} - {pmt.checkNumber} (Échéance : {formatDateFR(pmt.checkDueDate)})
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-bold text-emerald-700 text-base">
                      {formatMAD(pmt.amount)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5 : IMAGERIE & RADIOGRAPHIES */}
      {activeTab === 'IMAGERIE' && (
        <ImagingGallery
          files={patient.files || []}
          onUploadNew={handleSaveFile}
        />
      )}

      {/* TAB 6 : COMMANDES PROTHÈSE LABO */}
      {activeTab === 'PROTHESES' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <h3 className="font-black text-slate-900 text-sm">
              Commandes Laboratoire de Prothèse pour ce Patient
            </h3>
            <button
              onClick={() => setIsProtheseOpen(true)}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md shadow-amber-600/20"
            >
              + Nouveau Bon de Commande Labo
            </button>
          </div>

          {patient.protheses.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center italic">
              Aucune commande prothétique en cours.
            </p>
          ) : (
            <div className="space-y-3">
              {patient.protheses.map((pr: any) => (
                <div
                  key={pr.id}
                  className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 flex justify-between items-center"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-slate-900">
                        {pr.orderNumber}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                        {pr.status}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-800 mt-1">
                      {pr.protheseType.replace(/_/g, ' ')} (Dents : {pr.teethNumbers}) • Teinte {pr.vitaShade}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Labo : {pr.labName} • Essayage : {formatDateFR(pr.tryInDate)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-bold text-slate-900 text-xs">
                      Facturé patient : {formatMAD(pr.clinicPrice)}
                    </p>
                    <p className="font-mono text-rose-600 text-xs">
                      Coût labo : {formatMAD(pr.labCost)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modals connectées */}
      {selectedTooth !== null && (
        <ToothModal
          isOpen={selectedTooth !== null}
          onClose={() => setSelectedTooth(null)}
          toothNumber={selectedTooth}
          currentStatus={teethRecord[selectedTooth]?.status || 'SAINE'}
          currentSurfaces={teethRecord[selectedTooth]?.surfaces || []}
          currentNotes={teethRecord[selectedTooth]?.notes || ''}
          onSave={handleSaveTooth}
        />
      )}

      <PrescriptionModal
        isOpen={isPrescriptionOpen}
        onClose={() => setIsPrescriptionOpen(false)}
        patientName={`${patient.firstName} ${patient.lastName}`}
        patientCin={patient.cin}
        patientAge={calculateAge(patient.dateOfBirth)}
      />

      <InvoiceModal
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
        isQuote={isQuoteMode}
        patientId={patientId}
        patientName={`${patient.firstName} ${patient.lastName}`}
        patientCin={patient.cin}
        patientMutual={patient.mutualType}
        onSave={handleSaveInvoiceOrQuote}
      />

      <PaymentReceiptModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        patientId={patientId}
        patientName={`${patient.firstName} ${patient.lastName}`}
        patientCin={patient.cin}
        patientRemainingBalance={patient.remainingDue}
        onSavePayment={handleSavePayment}
      />

      <ProtheseOrderModal
        isOpen={isProtheseOpen}
        onClose={() => setIsProtheseOpen(false)}
        patientId={patientId}
        patientName={`${patient.firstName} ${patient.lastName}`}
        onSave={handleSaveProthese}
      />
    </div>
  );
}
