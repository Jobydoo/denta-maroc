import { PrismaClient, Role, ToothStatus, AppointmentStatus, CareType, ProtheseType, ProtheseStatus, PaymentMethod, CheckStatus, InvoiceStatus, QuoteStatus, ExpenseCategory, StockCategory } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Initialisation du Seeding DentaMaroc ---');

  // 1. Nettoyage initial (optionnel en mode reset)
  await prisma.patientFile.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.invoiceItem.deleteMany({});
  await prisma.invoice.deleteMany({});
  await prisma.quoteItem.deleteMany({});
  await prisma.quote.deleteMany({});
  await prisma.treatment.deleteMany({});
  await prisma.toothCondition.deleteMany({});
  await prisma.appointment.deleteMany({});
  await prisma.protheseOrder.deleteMany({});
  await prisma.expense.deleteMany({});
  await prisma.stockItem.deleteMany({});
  await prisma.procedureCatalog.deleteMany({});
  await prisma.patient.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.clinicSettings.deleteMany({});

  // 2. Paramètres du Cabinet Dentaire
  await prisma.clinicSettings.create({
    data: {
      name: 'Cabinet Dentaire Dr. Mehdi Alami',
      doctorName: 'Dr. Mehdi Alami',
      specialty: 'Chirurgien-Dentiste - Implantologie, Esthétique & Prothèse',
      address: '145 Boulevard d\'Anfa, 4ème étage, Maarif',
      city: 'Casablanca',
      phone: '+212 5 22 20 30 40',
      whatsappNumber: '+212 6 61 23 45 67',
      email: 'contact@cabinet-alami.ma',
      ice: '002345678000045',
      taxId: '45879201',
      patente: '32415089',
      inpe: '098765432',
      logoUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=300&auto=format&fit=crop&q=80',
      googleReviewUrl: 'https://g.page/r/dental-alami-casablanca/review',
      defaultCurrency: 'MAD',
    },
  });

  // 3. Utilisateurs & RBAC
  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const assistantPassword = await bcrypt.hash('Assistant123!', 10);
  const prothesePassword = await bcrypt.hash('Prothese123!', 10);

  const doctor = await prisma.user.create({
    data: {
      email: 'dr.alami@dentacare.ma',
      name: 'Dr. Mehdi Alami',
      passwordHash: adminPassword,
      role: Role.ADMIN,
      phone: '+212 6 61 23 45 67',
      specialty: 'Chirurgien-Dentiste Gérant',
    },
  });

  const assistant = await prisma.user.create({
    data: {
      email: 'assia@dentacare.ma',
      name: 'Assia Benjelloun',
      passwordHash: assistantPassword,
      role: Role.ASSISTANT,
      phone: '+212 6 62 98 76 54',
      specialty: 'Secrétaire Médicale & Assistante Clinique',
    },
  });

  await prisma.user.create({
    data: {
      email: 'labo.atlas@dentacare.ma',
      name: 'Laboratoire Atlas Dental Casablanca',
      passwordHash: prothesePassword,
      role: Role.PROTHESISTE,
      phone: '+212 5 22 44 55 66',
      specialty: 'Prothésiste Dentaire Agréé',
    },
  });

  console.log('Utilisateurs créés (Admin, Assistant, Prothésiste)');

  // 4. Catalogue des Actes Dentaires (Tarifs Marocains en MAD)
  const procedures = [
    { code: 'CONS01', name: 'Consultation & Bilan bucco-dentaire complet', category: 'SOINS_CONSERVATEURS', defaultPrice: 300, estimatedLabCost: 0, amoCode: 'C' },
    { code: 'DET01', name: 'Détartrage sus et sous-gingival + Polissage Prophy', category: 'SOINS_CONSERVATEURS', defaultPrice: 500, estimatedLabCost: 0, amoCode: 'D20' },
    { code: 'COMP01', name: 'Restauration Composite esthétique 1 face', category: 'SOINS_CONSERVATEURS', defaultPrice: 450, estimatedLabCost: 0, amoCode: 'SC01' },
    { code: 'COMP02', name: 'Restauration Composite esthétique 2/3 faces', category: 'SOINS_CONSERVATEURS', defaultPrice: 650, estimatedLabCost: 0, amoCode: 'SC02' },
    { code: 'ENDO01', name: 'Traitement canalaire / Pulpectomie incisive/canine', category: 'SOINS_CONSERVATEURS', defaultPrice: 800, estimatedLabCost: 0, amoCode: 'D30' },
    { code: 'ENDO02', name: 'Traitement canalaire / Pulpectomie prémolaire/molaire', category: 'SOINS_CONSERVATEURS', defaultPrice: 1300, estimatedLabCost: 0, amoCode: 'D50' },
    { code: 'PROTH01', name: 'Couronne Zircone monolithique multicouche (CAD/CAM)', category: 'PROTHESES', defaultPrice: 2800, estimatedLabCost: 750, amoCode: 'SPR50' },
    { code: 'PROTH02', name: 'Couronne Céramo-Métallique (CCM)', category: 'PROTHESES', defaultPrice: 1800, estimatedLabCost: 450, amoCode: 'SPR40' },
    { code: 'PROTH03', name: 'Bridge Zircone 3 éléments', category: 'PROTHESES', defaultPrice: 7800, estimatedLabCost: 2200, amoCode: 'SPR150' },
    { code: 'PROTH04', name: 'Facette Céramique E.Max haute esthétique', category: 'ESTHETIQUE', defaultPrice: 3500, estimatedLabCost: 900, amoCode: 'HN' },
    { code: 'PROTH05', name: 'Prothèse amovible squelettée Stellite (1 arcade)', category: 'PROTHESES', defaultPrice: 5500, estimatedLabCost: 1700, amoCode: 'SPR120' },
    { code: 'IMPL01', name: 'Pose d\'Implant dentaire Titane Grade IV (Straumann/Neodent)', category: 'IMPLANTOLOGIE', defaultPrice: 7000, estimatedLabCost: 0, amoCode: 'HN' },
    { code: 'IMPL02', name: 'Pilier implantaire personnalisé + Couronne vissée Zircone', category: 'IMPLANTOLOGIE', defaultPrice: 4500, estimatedLabCost: 1200, amoCode: 'HN' },
    { code: 'CHIR01', name: 'Avulsion simple dent permanente monoradiculée', category: 'CHIRURGIE', defaultPrice: 400, estimatedLabCost: 0, amoCode: 'DC08' },
    { code: 'CHIR02', name: 'Avulsion chirurgicale dent de sagesse incluse', category: 'CHIRURGIE', defaultPrice: 1500, estimatedLabCost: 0, amoCode: 'DC30' },
    { code: 'BLANCH01', name: 'Éclaircissement dentaire au fauteuil (Lampe LED Bleue)', category: 'ESTHETIQUE', defaultPrice: 2500, estimatedLabCost: 200, amoCode: 'HN' },
    { code: 'GOUT01', name: 'Gouttière occlusale de décompression / bruxisme', category: 'PROTHESES', defaultPrice: 1500, estimatedLabCost: 400, amoCode: 'SPR30' },
  ];

  for (const proc of procedures) {
    await prisma.procedureCatalog.create({ data: proc });
  }

  // 5. Patients Réalistes avec Profils Médicaux & Financiers
  const patient1 = await prisma.patient.create({
    data: {
      cin: 'BE892341',
      firstName: 'Youssef',
      lastName: 'Berrada',
      gender: 'M',
      dateOfBirth: new Date('1984-06-15'),
      phone: '+212 6 61 11 22 33',
      email: 'youssef.berrada@gmail.com',
      address: '28 Rue Ibnou Toufail, Palmier',
      city: 'Casablanca',
      occupation: 'Architecte DPLG',
      mutualType: 'CNOPS',
      mutualNumber: '084592019',
      mutualAffiliation: 'Ministère de l\'Habitat',
      // Anamnèse
      allergies: 'Pénicilline (Urticaire sévère), Latex',
      chronicDiseases: 'Hypertension artérielle sous Amlodipine 5mg',
      heartCondition: false,
      bleedingDisorder: false,
      isPregnant: false,
      biphosphonates: false,
      medicalNotes: 'Attention allergie pénicilline : prescrire Macrolides ou Clindamycine.',
    },
  });

  const patient2 = await prisma.patient.create({
    data: {
      cin: 'BK124578',
      firstName: 'Fatima Zahra',
      lastName: 'El Amrani',
      gender: 'F',
      dateOfBirth: new Date('1991-03-22'),
      phone: '+212 6 63 44 55 66',
      email: 'fz.elamrani@yahoo.fr',
      address: 'Résidence Les Iris, Apt 14, Gauthier',
      city: 'Casablanca',
      occupation: 'Cadre Bancaire',
      mutualType: 'CNSS',
      mutualNumber: '109845321',
      mutualAffiliation: 'Attijariwafa bank',
      // Anamnèse
      allergies: null,
      chronicDiseases: 'Diabète Type 2 équilibré sous Metformine',
      heartCondition: false,
      bleedingDisorder: false,
      isPregnant: true, // Grossesse
      biphosphonates: false,
      medicalNotes: 'Patiente enceinte (2ème trimestre). Éviter AINS et anesthésie avec forte dose de vasoconstricteur.',
    },
  });

  const patient3 = await prisma.patient.create({
    data: {
      cin: 'A748392',
      firstName: 'Mohamed',
      lastName: 'Tazi',
      gender: 'M',
      dateOfBirth: new Date('1962-11-08'),
      phone: '+212 6 70 88 99 00',
      email: 'm.tazi@menara.ma',
      address: 'Villa 12, Rue des Papillons, Oasis',
      city: 'Casablanca',
      occupation: 'Retraité OCP',
      mutualType: 'AMO',
      mutualNumber: '894520119',
      mutualAffiliation: 'Retraité',
      // Anamnèse
      allergies: 'Anesthésiques sans vasoconstricteurs recommandés',
      chronicDiseases: 'Cardiopathie ischémique (Pontage aorto-coronarien en 2021)',
      heartCondition: true,
      bleedingDisorder: true, // Anticoagulant Sintrom
      isPregnant: false,
      biphosphonates: false,
      medicalNotes: 'Sous anticoagulant Sintrom (INR à vérifier avant toute extraction chirurgicale).',
    },
  });

  const patient4 = await prisma.patient.create({
    data: {
      cin: 'W349812',
      firstName: 'Khadija',
      lastName: 'Bennani',
      gender: 'F',
      dateOfBirth: new Date('1998-09-14'),
      phone: '+212 6 65 33 22 11',
      email: 'khadija.bennani@outlook.com',
      address: 'Bd Zerktouni, Immeuble B, Bourgogne',
      city: 'Casablanca',
      occupation: 'Consultante Marketing',
      mutualType: 'AXA',
      mutualNumber: 'AXA-908123-MA',
      mutualAffiliation: 'Entreprise Multinationale',
      allergies: null,
      chronicDiseases: null,
      heartCondition: false,
      bleedingDisorder: false,
      isPregnant: false,
      biphosphonates: false,
      medicalNotes: 'Excellente santé générale. Demande esthétique (blanchiment + facettes antérieures).',
    },
  });

  // 6. Odontogramme (État dentaire des patients - Numérotation FDI)
  // Patient 1 (Youssef Berrada)
  await prisma.toothCondition.createMany({
    data: [
      { patientId: patient1.id, toothNumber: 11, status: ToothStatus.SAINE },
      { patientId: patient1.id, toothNumber: 16, status: ToothStatus.CARIE, surfaces: JSON.stringify(['occlusal', 'mesial']), notes: 'Carie profonde, sensibilité au froid' },
      { patientId: patient1.id, toothNumber: 26, status: ToothStatus.DEVITALISEE, notes: 'Pulpectomie réalisée, obturation gutta percha' },
      { patientId: patient1.id, toothNumber: 27, status: ToothStatus.COURONNE, notes: 'Couronne Zircone posée' },
      { patientId: patient1.id, toothNumber: 36, status: ToothStatus.ABSENTE, notes: 'Édentement encastré, projet bridge ou implant' },
      { patientId: patient1.id, toothNumber: 48, status: ToothStatus.A_EXTRAIRE, notes: 'Dent de sagesse incluse enclavée avec péricoronarite' },
    ],
  });

  // Patient 3 (Mohamed Tazi)
  await prisma.toothCondition.createMany({
    data: [
      { patientId: patient3.id, toothNumber: 14, status: ToothStatus.IMPLANT, notes: 'Implant Neodent 4.3x10mm ostéointégré' },
      { patientId: patient3.id, toothNumber: 15, status: ToothStatus.COURONNE, notes: 'Couronne transvissée sur implant' },
      { patientId: patient3.id, toothNumber: 46, status: ToothStatus.ABSENTE, notes: 'Extraction ancienne' },
    ],
  });

  // 7. Traitements / Actes Réalisés
  await prisma.treatment.createMany({
    data: [
      {
        patientId: patient1.id,
        toothNumber: 16,
        procedureName: 'Restauration Composite esthétique 2/3 faces',
        category: 'SOINS_CONSERVATEURS',
        price: 650,
        practitionerId: doctor.id,
        date: new Date(Date.now() - 5 * 86400000),
        status: 'TERMINE',
        clinicalNotes: 'Anesthésie sans adrénaline. Éviction carieuse sous digue, mordançage sélectif, composite Filtek A2.',
      },
      {
        patientId: patient1.id,
        toothNumber: 26,
        procedureName: 'Traitement canalaire / Pulpectomie prémolaire/molaire',
        category: 'SOINS_CONSERVATEURS',
        price: 1300,
        practitionerId: doctor.id,
        date: new Date(Date.now() - 12 * 86400000),
        status: 'TERMINE',
        clinicalNotes: 'Localisation de 3 canaux, mise en forme ProTaper Next X1-X2, obturation monocône + ciment biocéramique.',
      },
      {
        patientId: patient4.id,
        toothNumber: null,
        procedureName: 'Détartrage sus et sous-gingival + Polissage Prophy',
        category: 'SOINS_CONSERVATEURS',
        price: 500,
        practitionerId: doctor.id,
        date: new Date(Date.now() - 2 * 86400000),
        status: 'TERMINE',
        clinicalNotes: 'Détartrage ultrasonique complet, aéropolissage au bicarbonate.',
      },
    ],
  });

  // 8. Rendez-vous (Agenda & File d'attente du jour)
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  await prisma.appointment.createMany({
    data: [
      {
        patientId: patient1.id,
        doctorId: doctor.id,
        title: 'Pose Couronne Zircone sur 26',
        date: new Date(`${todayStr}T09:00:00Z`),
        startTime: '09:00',
        endTime: '09:45',
        status: AppointmentStatus.AU_FAUTEUIL,
        careType: CareType.PROTHESE,
        notes: 'Essayage armature et scellement définitif Fuji Plus.',
        reminderSent: true,
      },
      {
        patientId: patient2.id,
        doctorId: doctor.id,
        title: 'Contrôle parodontal & Détartrage doux',
        date: new Date(`${todayStr}T10:00:00Z`),
        startTime: '10:00',
        endTime: '10:30',
        status: AppointmentStatus.SALLE_ATTENTE,
        careType: CareType.SOIN,
        notes: 'Femme enceinte, séance douce, positionnement adapté.',
        reminderSent: true,
      },
      {
        patientId: patient4.id,
        doctorId: doctor.id,
        title: 'Séance Éclaircissement dentaire LED',
        date: new Date(`${todayStr}T11:00:00Z`),
        startTime: '11:00',
        endTime: '12:00',
        status: AppointmentStatus.CONFIRME,
        careType: CareType.SOIN,
        notes: 'Prendre photos avant/après avec teintier.',
        reminderSent: true,
      },
      {
        patientId: patient3.id,
        doctorId: doctor.id,
        title: 'Consultation & Contrôle Implant',
        date: new Date(`${todayStr}T15:30:00Z`),
        startTime: '15:30',
        endTime: '16:00',
        status: AppointmentStatus.PLANIFIE,
        careType: CareType.CONTROLE,
        notes: 'Vérifier ostéointégration et radio rétro-alvéolaire.',
        reminderSent: true,
      },
    ],
  });

  // 9. Commandes Laboratoire de Prothèse Dentaire
  await prisma.protheseOrder.create({
    data: {
      orderNumber: 'LAB-2026-0018',
      patientId: patient1.id,
      labName: 'Laboratoire Atlas Dental Casablanca',
      protheseType: ProtheseType.COURONNE_ZIRCONE,
      teethNumbers: '26',
      vitaShade: 'A2',
      status: ProtheseStatus.LIVRE_CABINET,
      impressionDate: new Date(Date.now() - 7 * 86400000),
      sentDate: new Date(Date.now() - 6 * 86400000),
      tryInDate: new Date(Date.now() - 1 * 86400000),
      deliveryDate: new Date(Date.now()),
      clinicPrice: 2800,
      labCost: 750,
      labInvoiceNumber: 'FAC-ATLAS-992',
      instructions: 'Couronne Zircone monolithique multicouche, occlusion légère, point de contact serré en distal.',
      isPaidToLab: true,
    },
  });

  await prisma.protheseOrder.create({
    data: {
      orderNumber: 'LAB-2026-0019',
      patientId: patient4.id,
      labName: 'Labo Dentaire Maarif Esthétique',
      protheseType: ProtheseType.FACETTE_CERAMIQUE,
      teethNumbers: '11, 12, 21, 22',
      vitaShade: 'Bleach 2',
      status: ProtheseStatus.ENVOYE_LABO,
      impressionDate: new Date(Date.now() - 2 * 86400000),
      sentDate: new Date(Date.now() - 1 * 86400000),
      tryInDate: new Date(Date.now() + 5 * 86400000),
      clinicPrice: 14000,
      labCost: 3600,
      instructions: '4 facettes E.max feldspathiques, texture naturelle, translucidité incisale prononcée.',
      isPaidToLab: false,
    },
  });

  // 10. Devis, Factures & Encaissements
  const devis1 = await prisma.quote.create({
    data: {
      quoteNumber: 'DEV-2026-0015',
      patientId: patient1.id,
      totalAmount: 4750,
      discount: 250,
      finalAmount: 4500,
      status: QuoteStatus.ACCEPTE,
      validUntil: new Date(Date.now() + 30 * 86400000),
      notes: 'Plan de traitement global : Dévitalisation + Composite + Couronne Zircone',
      items: {
        create: [
          { description: 'Pulpectomie molaire sous digue (26)', toothNumber: 26, quantity: 1, unitPrice: 1300, totalPrice: 1300 },
          { description: 'Restauration composite 2 faces (16)', toothNumber: 16, quantity: 1, unitPrice: 650, totalPrice: 650 },
          { description: 'Couronne Zircone monolithique (26)', toothNumber: 26, quantity: 1, unitPrice: 2800, totalPrice: 2800 },
        ],
      },
    },
  });

  const invoice1 = await prisma.invoice.create({
    data: {
      invoiceNumber: 'FAC-2026-0038',
      patientId: patient1.id,
      quoteId: devis1.id,
      totalAmount: 4500,
      paidAmount: 3000,
      remainingAmount: 1500,
      status: InvoiceStatus.PARTIELLEMENT_PAYEE,
      mutualType: 'CNOPS',
      mutualClaimNumber: 'CNOPS-2026-781',
      issueDate: new Date(Date.now() - 5 * 86400000),
      items: {
        create: [
          { description: 'Pulpectomie molaire (D50)', toothNumber: 26, quantity: 1, unitPrice: 1300, totalPrice: 1300, amoCode: 'D50' },
          { description: 'Composite esthétique (SC02)', toothNumber: 16, quantity: 1, unitPrice: 650, totalPrice: 650, amoCode: 'SC02' },
          { description: 'Couronne Zircone (SPR50)', toothNumber: 26, quantity: 1, unitPrice: 2550, totalPrice: 2550, amoCode: 'SPR50' },
        ],
      },
    },
  });

  // Paiement 1 : Espèces
  await prisma.payment.create({
    data: {
      paymentNumber: 'REC-2026-0071',
      invoiceId: invoice1.id,
      patientId: patient1.id,
      amount: 1500,
      method: PaymentMethod.ESPECES,
      paymentDate: new Date(Date.now() - 5 * 86400000),
      receiptGenerated: true,
      notes: 'Avance en espèces au démarrage du soin.',
      receivedByUserId: assistant.id,
    },
  });

  // Paiement 2 : Chèque bancaire Attijariwafa
  await prisma.payment.create({
    data: {
      paymentNumber: 'REC-2026-0082',
      invoiceId: invoice1.id,
      patientId: patient1.id,
      amount: 1500,
      method: PaymentMethod.CHEQUE,
      checkNumber: 'CHQ-8934521',
      checkBank: 'Attijariwafa bank',
      checkDueDate: new Date(Date.now() + 10 * 86400000),
      checkStatus: CheckStatus.EN_PORTEFEUILLE,
      receiptGenerated: true,
      notes: 'Chèque pour essayage couronne (échéance dans 10 jours).',
      receivedByUserId: assistant.id,
    },
  });

  // Facture soldée pour Patient 4
  const invoice2 = await prisma.invoice.create({
    data: {
      invoiceNumber: 'FAC-2026-0039',
      patientId: patient4.id,
      totalAmount: 500,
      paidAmount: 500,
      remainingAmount: 0,
      status: InvoiceStatus.SOLDEE,
      mutualType: 'AXA',
      issueDate: new Date(Date.now() - 2 * 86400000),
      items: {
        create: [
          { description: 'Détartrage sus et sous-gingival + Polissage', quantity: 1, unitPrice: 500, totalPrice: 500, amoCode: 'D20' },
        ],
      },
    },
  });

  await prisma.payment.create({
    data: {
      paymentNumber: 'REC-2026-0083',
      invoiceId: invoice2.id,
      patientId: patient4.id,
      amount: 500,
      method: PaymentMethod.CARTE_BANCAIRE,
      receiptGenerated: true,
      notes: 'Règlement par TPE Carte Bancaire CMI.',
      receivedByUserId: assistant.id,
    },
  });

  // 11. Dépenses & Charges du Cabinet (Mois en cours)
  await prisma.expense.createMany({
    data: [
      {
        title: 'Loyer Cabinet Médical Maarif (Mois courant)',
        category: ExpenseCategory.LOYER,
        amount: 8500,
        supplier: 'Bailleur Maarif Properties',
        paymentMethod: PaymentMethod.VIREMENT,
        date: new Date(Date.now() - 10 * 86400000),
        notes: 'Virement bancaire loyer mensuel.',
      },
      {
        title: 'Facture Fournitures Dentaires & Anesthésiques',
        category: ExpenseCategory.FOURNITURES_DENTAIRES,
        amount: 4200,
        supplier: 'Promodentaire Maroc',
        paymentMethod: PaymentMethod.CHEQUE,
        date: new Date(Date.now() - 8 * 86400000),
        notes: 'Commande de 10 boîtes Septanest + 4 seringues Filtek.',
      },
      {
        title: 'Règlement Facture Travaux Prothèse Septembre',
        category: ExpenseCategory.LABO_PROTHESE,
        amount: 5400,
        supplier: 'Laboratoire Atlas Dental Casablanca',
        paymentMethod: PaymentMethod.VIREMENT,
        date: new Date(Date.now() - 4 * 86400000),
        notes: 'Règlement groupé couronnes Zircone et Stellites.',
      },
      {
        title: 'Abonnement Fibre Optique Pro & Ligne Téléphonique',
        category: ExpenseCategory.EAU_ELEC_INTERNET,
        amount: 650,
        supplier: 'Maroc Telecom',
        paymentMethod: PaymentMethod.VIREMENT,
        date: new Date(Date.now() - 3 * 86400000),
      },
      {
        title: 'Facture Électricité & Eau Cabinet',
        category: ExpenseCategory.EAU_ELEC_INTERNET,
        amount: 820,
        supplier: 'Lydec Casablanca',
        paymentMethod: PaymentMethod.VIREMENT,
        date: new Date(Date.now() - 2 * 86400000),
      },
    ],
  });

  // 12. Stock Consommables avec Seuils Critiques
  await prisma.stockItem.createMany({
    data: [
      {
        name: 'Septanest 4% Adrénaline 1/100 000 (Boîte 50 carpules)',
        category: StockCategory.ANESTHESIE,
        currentQuantity: 3, // ALERTE CRITIQUE (seuil = 5)
        minAlertThreshold: 5,
        unit: 'boîtes',
        supplier: 'Promodentaire Maroc',
        unitCost: 380,
      },
      {
        name: 'Scandonest 3% Sans Vasoconstricteur (Femmes enceintes / Cardiaques)',
        category: StockCategory.ANESTHESIE,
        currentQuantity: 6,
        minAlertThreshold: 4,
        unit: 'boîtes',
        supplier: 'Promodentaire Maroc',
        unitCost: 410,
      },
      {
        name: 'Composite 3M Filtek Supreme XTE Seringue Teinte A2',
        category: StockCategory.RESTAURATION,
        currentQuantity: 2, // ALERTE CRITIQUE
        minAlertThreshold: 4,
        unit: 'seringues',
        supplier: 'Dentsply Sirona Maroc',
        unitCost: 320,
      },
      {
        name: 'Ciment verre ionomère de scellement GC Fuji Plus',
        category: StockCategory.RESTAURATION,
        currentQuantity: 5,
        minAlertThreshold: 2,
        unit: 'coffrets',
        supplier: 'Henry Schein Maroc',
        unitCost: 850,
      },
      {
        name: 'Gants d\'examen Nitrile non poudrés Taille M (Boîte de 100)',
        category: StockCategory.HYGIENE_PROTECTION,
        currentQuantity: 8,
        minAlertThreshold: 6,
        unit: 'boîtes',
        supplier: 'Promodentaire Maroc',
        unitCost: 65,
      },
      {
        name: 'Alginate pour empreinte de précision Cavex ColorChange',
        category: StockCategory.EMPREINTE,
        currentQuantity: 12,
        minAlertThreshold: 5,
        unit: 'sachets 500g',
        supplier: 'Promodentaire Maroc',
        unitCost: 75,
      },
    ],
  });

  // 13. Radiographies & Documents Cliniques
  await prisma.patientFile.createMany({
    data: [
      {
        patientId: patient1.id,
        title: 'Panoramique dentaire bilan initial',
        fileType: 'PANORAMIQUE',
        fileUrl: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=1200&auto=format&fit=crop&q=80',
        fileSize: 2450000,
        mimeType: 'image/jpeg',
      },
      {
        patientId: patient1.id,
        title: 'Rétro-alvéolaire contrôle endodontique dent 26',
        fileType: 'RETRO_ALVEOLAIRE',
        fileUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80',
        fileSize: 850000,
        mimeType: 'image/jpeg',
      },
      {
        patientId: patient4.id,
        title: 'Photo clinique avant éclaircissement dentaire',
        fileType: 'PHOTO_AVANT_APRES',
        fileUrl: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&auto=format&fit=crop&q=80',
        fileSize: 1200000,
        mimeType: 'image/jpeg',
      },
    ],
  });

  console.log('--- Données de démonstration marocaines insérées avec succès ! ---');
}

main()
  .catch((e) => {
    console.error('Erreur lors du seed :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
