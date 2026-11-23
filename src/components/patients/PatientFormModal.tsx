'use client';

import React, { useState } from 'react';
import { MOROCCAN_MUTUALS } from '@/lib/moroccan-data';
import { User, Phone, Mail, MapPin, ShieldAlert, X, Save, FileSpreadsheet } from 'lucide-react';

interface PatientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (patientData: any) => Promise<void>;
  initialData?: any;
}

export default function PatientFormModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: PatientFormModalProps) {
  const [firstName, setFirstName] = useState(initialData?.firstName || '');
  const [lastName, setLastName] = useState(initialData?.lastName || '');
  const [cin, setCin] = useState(initialData?.cin || '');
  const [gender, setGender] = useState(initialData?.gender || 'M');
  const [dateOfBirth, setDateOfBirth] = useState(
    initialData?.dateOfBirth
      ? new Date(initialData.dateOfBirth).toISOString().split('T')[0]
      : '1990-01-01'
  );
  const [phone, setPhone] = useState(initialData?.phone || '+212 6 ');
  const [email, setEmail] = useState(initialData?.email || '');
  const [address, setAddress] = useState(initialData?.address || '');
  const [city, setCity] = useState(initialData?.city || 'Casablanca');
  const [occupation, setOccupation] = useState(initialData?.occupation || '');

  // Mutuelle
  const [mutualType, setMutualType] = useState(initialData?.mutualType || 'CNOPS');
  const [mutualNumber, setMutualNumber] = useState(initialData?.mutualNumber || '');

  // Anamnèse Médicale
  const [allergies, setAllergies] = useState(initialData?.allergies || '');
  const [chronicDiseases, setChronicDiseases] = useState(initialData?.chronicDiseases || '');
  const [heartCondition, setHeartCondition] = useState(initialData?.heartCondition || false);
  const [bleedingDisorder, setBleedingDisorder] = useState(initialData?.bleedingDisorder || false);
  const [isPregnant, setIsPregnant] = useState(initialData?.isPregnant || false);
  const [biphosphonates, setBiphosphonates] = useState(initialData?.biphosphonates || false);
  const [medicalNotes, setMedicalNotes] = useState(initialData?.medicalNotes || '');

  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave({
        id: initialData?.id,
        firstName: firstName.trim() || 'Nouveau',
        lastName: lastName.trim() || 'Patient',
        cin: cin.toUpperCase().trim() || null,
        gender,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : new Date('1990-01-01'),
        phone: phone.trim() || '+212 6 00 00 00 00',
        email: email.trim() || null,
        address,
        city,
        occupation,
        mutualType,
        mutualNumber: mutualNumber.trim() || null,
        allergies: allergies.trim() || null,
        chronicDiseases: chronicDiseases.trim() || null,
        heartCondition,
        bleedingDisorder,
        isPregnant,
        biphosphonates,
        medicalNotes: medicalNotes.trim() || null,
      });
      onClose();
    } catch (err) {
      console.error(err);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-sky-400" />
            <h3 className="font-bold text-sm">
              {initialData ? 'Modifier le Dossier Patient' : 'Créer une Fiche Patient 360°'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 text-xs text-slate-800">
          {/* 1. État Civil & Coordonnées */}
          <div className="space-y-3">
            <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider border-b pb-1">
              1. État Civil & Identité Marocaine
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold block mb-1">Prénom *</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Ex: Youssef"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:bg-white"
                />
              </div>
              <div>
                <label className="font-bold block mb-1">Nom de Famille *</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Ex: Berrada"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-bold block mb-1">CIN (Carte d'Identité)</label>
                <input
                  type="text"
                  value={cin}
                  onChange={(e) => setCin(e.target.value)}
                  placeholder="Ex: BE892341"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 font-mono font-bold uppercase focus:bg-white"
                />
              </div>
              <div>
                <label className="font-bold block mb-1">Sexe</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:bg-white font-bold"
                >
                  <option value="M">Homme (M)</option>
                  <option value="F">Femme (F)</option>
                </select>
              </div>
              <div>
                <label className="font-bold block mb-1">Date de Naissance *</label>
                <input
                  type="date"
                  required
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold block mb-1">Téléphone Portable (WhatsApp)</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+212 6 61 23 45 67"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 font-bold focus:bg-white"
                />
              </div>
              <div>
                <label className="font-bold block mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="patient@gmail.com"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold block mb-1">Adresse</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Quartier, Rue, N°"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:bg-white"
                />
              </div>
              <div>
                <label className="font-bold block mb-1">Ville</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* 2. Couverture Médicale / Mutuelle */}
          <div className="space-y-3">
            <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider border-b pb-1">
              2. Couverture Médicale & Mutuelle
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold block mb-1">Organisme Mutuelle</label>
                <select
                  value={mutualType}
                  onChange={(e) => setMutualType(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 font-bold focus:bg-white"
                >
                  {MOROCCAN_MUTUALS.map((m) => (
                    <option key={m.code} value={m.code}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-bold block mb-1">N° d'Immatriculation Mutuelle</label>
                <input
                  type="text"
                  value={mutualNumber}
                  onChange={(e) => setMutualNumber(e.target.value)}
                  placeholder="Ex: 098451298"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 font-mono focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* 3. Anamnèse Médicale Critique (Affichage Rouge) */}
          <div className="p-4 rounded-2xl bg-rose-50/80 border-2 border-rose-300 space-y-3">
            <div className="flex items-center gap-2 text-rose-700 font-black text-xs uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>3. Anamnèse Médicale Critique (Vigilance)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-rose-900 block mb-1">
                  Allergies Médicamenteuses (Pénicilline, Latex...)
                </label>
                <input
                  type="text"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  placeholder="Ex: Pénicilline, Latex"
                  className="w-full p-2.5 rounded-xl bg-white border border-rose-300 focus:ring-2 focus:ring-rose-500 font-semibold"
                />
              </div>
              <div>
                <label className="font-bold text-rose-900 block mb-1">
                  Pathologies Chroniques (Diabète, HTA...)
                </label>
                <input
                  type="text"
                  value={chronicDiseases}
                  onChange={(e) => setChronicDiseases(e.target.value)}
                  placeholder="Ex: Diabète type 2, HTA"
                  className="w-full p-2.5 rounded-xl bg-white border border-rose-300 focus:ring-2 focus:ring-rose-500 font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              <label className="flex items-center gap-2 p-2 rounded-xl bg-white border border-rose-200 text-rose-900 font-bold cursor-pointer">
                <input
                  type="checkbox"
                  checked={bleedingDisorder}
                  onChange={(e) => setBleedingDisorder(e.target.checked)}
                  className="rounded text-rose-600"
                />
                <span className="text-[11px]">Anticoagulant (AVK / Sintrom)</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-xl bg-white border border-rose-200 text-rose-900 font-bold cursor-pointer">
                <input
                  type="checkbox"
                  checked={heartCondition}
                  onChange={(e) => setHeartCondition(e.target.checked)}
                  className="rounded text-rose-600"
                />
                <span className="text-[11px]">Cardiopathie / Valvule</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-xl bg-white border border-rose-200 text-rose-900 font-bold cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPregnant}
                  onChange={(e) => setIsPregnant(e.target.checked)}
                  className="rounded text-rose-600"
                />
                <span className="text-[11px]">Femme Enceinte</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-xl bg-white border border-rose-200 text-rose-900 font-bold cursor-pointer">
                <input
                  type="checkbox"
                  checked={biphosphonates}
                  onChange={(e) => setBiphosphonates(e.target.checked)}
                  className="rounded text-rose-600"
                />
                <span className="text-[11px]">Biphosphonates (Nécrose)</span>
              </label>
            </div>

            <div>
              <label className="font-bold text-rose-900 block mb-1">
                Remarques médicales supplémentaires
              </label>
              <textarea
                rows={2}
                value={medicalNotes}
                onChange={(e) => setMedicalNotes(e.target.value)}
                placeholder="Ex: Anesthésie sans vasoconstricteur requise, phobie du dentiste..."
                className="w-full p-2.5 rounded-xl bg-white border border-rose-300 focus:ring-2 focus:ring-rose-500 text-xs"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold shadow-md shadow-sky-600/20 disabled:opacity-50 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Enregistrement...' : 'Enregistrer le Patient'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
