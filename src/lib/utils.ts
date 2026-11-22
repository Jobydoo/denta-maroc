import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formate un montant en Dirhams Marocains (MAD) */
export function formatMAD(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return '0,00 MAD';
  return (
    new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })
      .format(amount)
      .replace('MAD', '')
      .trim() + ' MAD'
  );
}

/** Formate une date en format français complet ou court */
export function formatDateFR(date: Date | string | null | undefined, includeTime = false): string {
  if (!date) return '-';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '-';

  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...(includeTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  };

  return new Intl.DateTimeFormat('fr-FR', options).format(d);
}

/** Nettoie et formate un numéro de téléphone marocain pour l'affichage */
export function formatPhoneMorocco(phone: string | null | undefined): string {
  if (!phone) return '-';
  const cleaned = phone.replace(/[^\d+]/g, '');
  return cleaned;
}

/** Calcule l'âge à partir de la date de naissance */
export function calculateAge(birthDate: Date | string): number {
  const dob = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
  const diff = Date.now() - dob.getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}
