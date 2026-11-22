/**
 * Données de référence de la pratique dentaire au Maroc
 */

export interface StandardMedication {
  id: string;
  name: string;
  category: 'Antibiotique' | 'Antalgique / AINS' | 'Bain de bouche' | 'Corticostéroïde' | 'Autre';
  dosage: string;
  instructions: string;
  duration: string;
}

export const PRESET_MEDICATIONS: StandardMedication[] = [
  {
    id: 'med-1',
    name: 'Amoxicilline 1g (Clamoxyl / Hiconcil)',
    category: 'Antibiotique',
    dosage: '1 comprimé matin et soir (2g/jour)',
    instructions: 'À prendre au début des repas',
    duration: '6 jours',
  },
  {
    id: 'med-2',
    name: 'Amoxicilline + Acide Clavulanique 1g/125mg (Augmentin / Curam)',
    category: 'Antibiotique',
    dosage: '1 sachet ou comprimé 2 fois par jour',
    instructions: 'Au milieu du repas',
    duration: '7 jours',
  },
  {
    id: 'med-3',
    name: 'Spiramycine + Métronidazole (Bi-Rodogyl)',
    category: 'Antibiotique',
    dosage: '1 comprimé 2 à 3 fois par jour',
    instructions: 'Avec un grand verre d\'eau au cours des repas. Éviter toute boisson alcoolisée.',
    duration: '6 jours',
  },
  {
    id: 'med-4',
    name: 'Paracétamol 1g (Doliprane / Dafalgan)',
    category: 'Antalgique / AINS',
    dosage: '1 comprimé toutes les 6 heures si douleur (max 3g à 4g/j)',
    instructions: 'Espacer les prises d\'au moins 4 à 6 heures',
    duration: '3 à 5 jours',
  },
  {
    id: 'med-5',
    name: 'Kétoprofène 150mg (Bi-Profenid)',
    category: 'Antalgique / AINS',
    dosage: '1 comprimé par jour (ou 1/2 comprimé matin et soir)',
    instructions: 'Obligatoirement au milieu d\'un repas copieux. Contre-indiqué chez la femme enceinte et en cas d\'ulcère.',
    duration: '3 à 4 jours',
  },
  {
    id: 'med-6',
    name: 'Ibuprofène 400mg (Advil / Algoflex)',
    category: 'Antalgique / AINS',
    dosage: '1 comprimé 3 fois par jour',
    instructions: 'Au cours des repas',
    duration: '3 à 5 jours',
  },
  {
    id: 'med-7',
    name: 'Bain de bouche Chlorhexidine 0.12% (Eludril / Paroex)',
    category: 'Bain de bouche',
    dosage: '1 bouchon doseur dilué dans un demi-verre d\'eau tiède',
    instructions: 'Bain de bouche pendant 1 minute après le brossage, 2 à 3 fois par jour. Ne pas avaler.',
    duration: '7 à 10 jours',
  },
  {
    id: 'med-8',
    name: 'Prednisolone 20mg (Solupred)',
    category: 'Corticostéroïde',
    dosage: '1 à 2 comprimés le matin au petit-déjeuner',
    instructions: 'Pour limiter l\'œdème post-chirurgical',
    duration: '3 jours',
  },
];

export const MOROCCAN_MUTUALS = [
  { code: 'CNOPS', label: 'CNOPS (Secteur Public)' },
  { code: 'CNSS', label: 'CNSS (Secteur Privé)' },
  { code: 'AMO', label: 'AMO - Assurance Maladie Obligatoire' },
  { code: 'FAR', label: 'Mutuelle Militaire / FAR' },
  { code: 'AXA', label: 'AXA Assurance Maroc' },
  { code: 'RMA_WATANYA', label: 'RMA Watanya' },
  { code: 'SAHAM', label: 'Sanlam (ex-Saham Assurance)' },
  { code: 'WAFA_ASSURANCE', label: 'Wafa Assurance' },
  { code: 'ATLANTA_SANAD', label: 'AtlantaSanad' },
  { code: 'AUTRE', label: 'Autre Mutuelle / Sans Mutuelle' },
];

export const VITA_SHADES = [
  'A1', 'A2', 'A3', 'A3.5', 'A4',
  'B1', 'B2', 'B3', 'B4',
  'C1', 'C2', 'C3', 'C4',
  'D2', 'D3', 'D4',
  'Bleach 1 (BL1)', 'Bleach 2 (BL2)', 'Bleach 3 (BL3)', 'Bleach 4 (BL4)'
];

export const DENTAL_LABS_MOROCCO = [
  'Laboratoire Atlas Dental Casablanca',
  'Labo Dentaire Maarif Esthétique',
  'Laboratoire Médident Rabat',
  'Laboratoire Prothèse Anfa Tech',
  'Laboratoire Dentaire Tangier Smile',
  'Laboratoire Numérique Agadir CAD/CAM',
];
