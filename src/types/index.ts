export type Role = 'ADMIN' | 'ASSISTANT' | 'PROTHESISTE';

export type ToothStatus =
  | 'SAINE'
  | 'CARIE'
  | 'DEVITALISEE'
  | 'COURONNE'
  | 'BRIDGE'
  | 'IMPLANT'
  | 'ABSENTE'
  | 'A_EXTRAIRE';

export type AppointmentStatus =
  | 'PLANIFIE'
  | 'CONFIRME'
  | 'SALLE_ATTENTE'
  | 'AU_FAUTEUIL'
  | 'TERMINE'
  | 'ABSENT';

export type CareType =
  | 'CONSULTATION'
  | 'SOIN'
  | 'PROTHESE'
  | 'CHIRURGIE'
  | 'IMPLANTOLOGIE'
  | 'ORTHODONTIE'
  | 'URGENCE'
  | 'CONTROLE';

export type ProtheseStatus =
  | 'EMPREINTE_PRISE'
  | 'ENVOYE_LABO'
  | 'ESSAYAGE_PREVU'
  | 'RETOUCHE'
  | 'LIVRE_CABINET'
  | 'POSE';

export type ProtheseType =
  | 'COURONNE_ZIRCONE'
  | 'COURONNE_CERAMO_METALLIQUE'
  | 'BRIDGE_CERAMIQUE'
  | 'STELLITE'
  | 'PROTHESE_COMPLETE'
  | 'GOUTTIERE'
  | 'INLAY_ONLAY'
  | 'FACETTE_CERAMIQUE'
  | 'PILIER_IMPLANTAIRE';

export type PaymentMethod = 'ESPECES' | 'CHEQUE' | 'VIREMENT' | 'CARTE_BANCAIRE';

export type CheckStatus = 'NON_APPLICABLE' | 'EN_PORTEFEUILLE' | 'ENCAISSE' | 'REJETE';

export type InvoiceStatus = 'IMPAYEE' | 'PARTIELLEMENT_PAYEE' | 'SOLDEE' | 'ANNULEE';

export type QuoteStatus = 'BROUILLON' | 'EN_ATTENTE' | 'ACCEPTE' | 'REFUSE';

export type ExpenseCategory =
  | 'LOYER'
  | 'SALAIRES'
  | 'LABO_PROTHESE'
  | 'FOURNITURES_DENTAIRES'
  | 'EAU_ELEC_INTERNET'
  | 'MAINTENANCE'
  | 'IMPOTS_TAXES'
  | 'AUTRE';

export type StockCategory =
  | 'ANESTHESIE'
  | 'RESTAURATION'
  | 'ENDODONTIE'
  | 'HYGIENE_PROTECTION'
  | 'CHIRURGIE'
  | 'EMPREINTE'
  | 'AUTRE';

export type FileType =
  | 'PANORAMIQUE'
  | 'RETRO_ALVEOLAIRE'
  | 'SCANNER_3D'
  | 'PHOTO_AVANT_APRES'
  | 'ORDONNANCE'
  | 'DEVIS_SIGNE'
  | 'AUTRE';

export interface PatientSummary {
  id: string;
  cin?: string | null;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string | Date;
  phone: string;
  email?: string | null;
  city: string;
  mutualType: string;
  allergies?: string | null;
  chronicDiseases?: string | null;
  heartCondition: boolean;
  bleedingDisorder: boolean;
  isPregnant: boolean;
  biphosphonates: boolean;
  medicalNotes?: string | null;
  totalInvoiced?: number;
  totalPaid?: number;
  remainingDue?: number;
}
