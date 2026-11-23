import {
  DEMO_SETTINGS,
  DEMO_PATIENTS,
  DEMO_APPOINTMENTS,
  DEMO_PROTHESES,
  DEMO_EXPENSES,
  DEMO_STOCK,
} from './demo-data';

// Persistent in-memory global store across serverless requests in same instance
// Provides seamless operation if PostgreSQL is not connected or in development.

interface GlobalDentalStore {
  settings: any;
  patients: any[];
  appointments: any[];
  protheses: any[];
  expenses: any[];
  stock: any[];
  invoices: any[];
  quotes: any[];
  payments: any[];
}

const g = global as unknown as { __dentalStore?: GlobalDentalStore };

if (!g.__dentalStore) {
  // Extract initial invoices, quotes, payments from DEMO_PATIENTS
  const initialInvoices: any[] = [];
  const initialQuotes: any[] = [];
  const initialPayments: any[] = [];

  DEMO_PATIENTS.forEach((p) => {
    if (p.invoices) {
      p.invoices.forEach((inv) => {
        initialInvoices.push({
          ...inv,
          patient: {
            id: p.id,
            firstName: p.firstName,
            lastName: p.lastName,
            phone: p.phone,
            cin: p.cin,
          },
        });
      });
    }
    if (p.quotes) {
      p.quotes.forEach((q) => {
        initialQuotes.push({
          ...q,
          patient: {
            id: p.id,
            firstName: p.firstName,
            lastName: p.lastName,
          },
        });
      });
    }
    if (p.payments) {
      p.payments.forEach((pmt) => {
        initialPayments.push({
          ...pmt,
          patient: {
            id: p.id,
            firstName: p.firstName,
            lastName: p.lastName,
            cin: p.cin,
          },
          receivedBy: { name: 'Dr. Mehdi Alami' },
        });
      });
    }
  });

  g.__dentalStore = {
    settings: { ...DEMO_SETTINGS },
    patients: JSON.parse(JSON.stringify(DEMO_PATIENTS)),
    appointments: JSON.parse(JSON.stringify(DEMO_APPOINTMENTS)),
    protheses: JSON.parse(JSON.stringify(DEMO_PROTHESES)),
    expenses: JSON.parse(JSON.stringify(DEMO_EXPENSES)),
    stock: JSON.parse(JSON.stringify(DEMO_STOCK)),
    invoices: initialInvoices,
    quotes: initialQuotes,
    payments: initialPayments,
  };
}

const store = g.__dentalStore;

export const dentalStore = {
  // --- PATIENTS ---
  getPatients(q?: string) {
    if (!q) return store.patients;
    const query = q.toLowerCase();
    return store.patients.filter(
      (p) =>
        p.firstName.toLowerCase().includes(query) ||
        p.lastName.toLowerCase().includes(query) ||
        p.phone.includes(query) ||
        (p.cin && p.cin.toLowerCase().includes(query))
    );
  },

  getPatientById(id: string) {
    const p = store.patients.find((x) => x.id === id);
    if (!p) {
      return store.patients[0] || null;
    }
    return p;
  },

  createPatient(data: any) {
    const id = `pat-${Date.now()}`;
    const newPatient = {
      id,
      firstName: data.firstName || 'Nouveau',
      lastName: data.lastName || 'Patient',
      cin: data.cin || null,
      gender: data.gender || 'M',
      dateOfBirth: data.dateOfBirth
        ? new Date(data.dateOfBirth).toISOString()
        : new Date('1990-01-01').toISOString(),
      phone: data.phone || '',
      email: data.email || null,
      address: data.address || '',
      city: data.city || 'Casablanca',
      occupation: data.occupation || '',
      mutualType: data.mutualType || 'CNOPS',
      mutualNumber: data.mutualNumber || null,
      allergies: data.allergies || null,
      chronicDiseases: data.chronicDiseases || null,
      heartCondition: Boolean(data.heartCondition),
      bleedingDisorder: Boolean(data.bleedingDisorder),
      isPregnant: Boolean(data.isPregnant),
      biphosphonates: Boolean(data.biphosphonates),
      medicalNotes: data.medicalNotes || null,
      status: 'ACTIF',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      totalInvoiced: 0,
      totalPaid: 0,
      remainingDue: 0,
      teethConditions: [],
      treatments: [],
      invoices: [],
      payments: [],
      quotes: [],
      protheses: [],
      files: [],
    };
    store.patients.unshift(newPatient);
    return newPatient;
  },

  updatePatient(id: string, data: any) {
    const idx = store.patients.findIndex((p) => p.id === id);
    if (idx !== -1) {
      store.patients[idx] = {
        ...store.patients[idx],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      return store.patients[idx];
    }
    return null;
  },

  // --- APPOINTMENTS ---
  getAppointments(date?: string, patientId?: string) {
    return store.appointments.filter((a) => {
      if (patientId && a.patientId !== patientId) return false;
      if (date && a.date && !a.date.startsWith(date)) return false;
      return true;
    });
  },

  createAppointment(data: any) {
    const id = `appt-${Date.now()}`;
    const patient = this.getPatientById(data.patientId);
    const newAppt = {
      id,
      patientId: data.patientId,
      patient: patient
        ? {
            id: patient.id,
            firstName: patient.firstName,
            lastName: patient.lastName,
            phone: patient.phone,
            cin: patient.cin,
          }
        : {
            id: data.patientId,
            firstName: 'Patient',
            lastName: 'Cabinet',
            phone: '',
          },
      title: data.title || 'Consultation & Soins',
      date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
      startTime: data.startTime || '10:00',
      endTime: data.endTime || '10:45',
      status: data.status || 'PLANIFIE',
      careType: data.careType || 'CONSULTATION',
      notes: data.notes || null,
    };
    store.appointments.unshift(newAppt);
    return newAppt;
  },

  updateAppointment(id: string, status: string) {
    const idx = store.appointments.findIndex((a) => a.id === id);
    if (idx !== -1) {
      store.appointments[idx].status = status;
      return store.appointments[idx];
    }
    return null;
  },

  // --- PROTHESES ---
  getProtheses(patientId?: string, status?: string) {
    return store.protheses.filter((p) => {
      if (patientId && p.patientId !== patientId) return false;
      if (status && p.status !== status) return false;
      return true;
    });
  },

  createProthese(data: any) {
    const id = `proth-${Date.now()}`;
    const patient = this.getPatientById(data.patientId);
    const newProthese = {
      id,
      orderNumber: `LAB-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      patientId: data.patientId,
      patient: patient
        ? {
            id: patient.id,
            firstName: patient.firstName,
            lastName: patient.lastName,
          }
        : { id: data.patientId, firstName: 'Patient', lastName: '' },
      labName: data.labName || 'Laboratoire Atlas Dental Casablanca',
      protheseType: data.protheseType || 'COURONNE_ZIRCONE',
      teethNumbers: data.teethNumbers || '16',
      vitaShade: data.vitaShade || 'A2',
      status: data.status || 'EMPREINTE_PRISE',
      impressionDate: new Date().toISOString(),
      tryInDate: data.tryInDate ? new Date(data.tryInDate).toISOString() : null,
      deliveryDate: data.deliveryDate ? new Date(data.deliveryDate).toISOString() : null,
      clinicPrice: Number(data.clinicPrice || 0),
      labCost: Number(data.labCost || 0),
      instructions: data.instructions || null,
      isPaidToLab: Boolean(data.isPaidToLab),
    };
    store.protheses.unshift(newProthese);

    if (patient && patient.protheses) {
      patient.protheses.unshift(newProthese);
    }
    return newProthese;
  },

  updateProthese(id: string, data: any) {
    const idx = store.protheses.findIndex((p) => p.id === id);
    if (idx !== -1) {
      store.protheses[idx] = {
        ...store.protheses[idx],
        ...data,
      };
      return store.protheses[idx];
    }
    return null;
  },

  // --- EXPENSES ---
  getExpenses() {
    return store.expenses;
  },

  createExpense(data: any) {
    const id = `exp-${Date.now()}`;
    const newExp = {
      id,
      title: data.title,
      category: data.category || 'AUTRE',
      amount: Number(data.amount || 0),
      supplier: data.supplier || null,
      paymentMethod: data.paymentMethod || 'VIREMENT',
      date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
      notes: data.notes || null,
    };
    store.expenses.unshift(newExp);
    return newExp;
  },

  // --- STOCK ---
  getStock() {
    return store.stock;
  },

  createStock(data: any) {
    const id = `stk-${Date.now()}`;
    const newItem = {
      id,
      name: data.name,
      category: data.category || 'AUTRE',
      currentQuantity: Number(data.currentQuantity || 0),
      minAlertThreshold: Number(data.minAlertThreshold || 5),
      unit: data.unit || 'boîtes',
      supplier: data.supplier || null,
      unitCost: data.unitCost ? Number(data.unitCost) : null,
    };
    store.stock.unshift(newItem);
    return newItem;
  },

  updateStock(id: string, updates: any) {
    const idx = store.stock.findIndex((s) => s.id === id);
    if (idx !== -1) {
      if (typeof updates.delta === 'number') {
        store.stock[idx].currentQuantity = Math.max(
          0,
          store.stock[idx].currentQuantity + updates.delta
        );
      } else if (typeof updates.currentQuantity === 'number') {
        store.stock[idx].currentQuantity = updates.currentQuantity;
      }
      return store.stock[idx];
    }
    return null;
  },

  // --- INVOICES & QUOTES ---
  getInvoices(patientId?: string) {
    const invoices = patientId
      ? store.invoices.filter((i) => i.patientId === patientId)
      : store.invoices;
    const quotes = patientId
      ? store.quotes.filter((q) => q.patientId === patientId)
      : store.quotes;
    return { invoices, quotes };
  },

  createInvoiceOrQuote(data: any) {
    const patient = this.getPatientById(data.patientId);
    const id = `doc-${Date.now()}`;

    if (data.isQuote) {
      const newQuote = {
        id,
        quoteNumber: data.number || `DEV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        patientId: data.patientId,
        patient: patient
          ? { id: patient.id, firstName: patient.firstName, lastName: patient.lastName }
          : { id: data.patientId, firstName: 'Patient', lastName: '' },
        totalAmount: Number(data.totalAmount + (data.discount || 0)),
        discount: Number(data.discount || 0),
        finalAmount: Number(data.totalAmount),
        status: 'EN_ATTENTE',
        validUntil: new Date(Date.now() + 30 * 86400000).toISOString(),
        items: data.items || [],
        createdAt: new Date().toISOString(),
      };
      store.quotes.unshift(newQuote);
      if (patient && patient.quotes) {
        patient.quotes.unshift(newQuote);
      }
      return newQuote;
    } else {
      const newInvoice = {
        id,
        invoiceNumber: data.number || `FAC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        patientId: data.patientId,
        patient: patient
          ? {
              id: patient.id,
              firstName: patient.firstName,
              lastName: patient.lastName,
              phone: patient.phone,
              cin: patient.cin,
            }
          : { id: data.patientId, firstName: 'Patient', lastName: '' },
        totalAmount: Number(data.totalAmount),
        paidAmount: 0,
        remainingAmount: Number(data.totalAmount),
        status: 'IMPAYEE',
        mutualType: data.mutualType || 'CNOPS',
        mutualClaimNumber: data.mutualClaimNumber || null,
        items: data.items || [],
        payments: [],
        createdAt: new Date().toISOString(),
        issueDate: new Date().toISOString(),
      };
      store.invoices.unshift(newInvoice);

      if (patient) {
        if (!patient.invoices) patient.invoices = [];
        patient.invoices.unshift(newInvoice);
        patient.totalInvoiced = (patient.totalInvoiced || 0) + newInvoice.totalAmount;
        patient.remainingDue = (patient.remainingDue || 0) + newInvoice.remainingAmount;
      }
      return newInvoice;
    }
  },

  // --- PAYMENTS ---
  getPayments(patientId?: string, checkStatus?: string) {
    return store.payments.filter((p) => {
      if (patientId && p.patientId !== patientId) return false;
      if (checkStatus && p.checkStatus !== checkStatus) return false;
      return true;
    });
  },

  createPayment(data: any) {
    const id = `pmt-${Date.now()}`;
    const patient = this.getPatientById(data.patientId);
    const amount = Number(data.amount || 0);

    const newPayment = {
      id,
      paymentNumber: `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      patientId: data.patientId,
      patient: patient
        ? {
            id: patient.id,
            firstName: patient.firstName,
            lastName: patient.lastName,
            cin: patient.cin,
          }
        : { id: data.patientId, firstName: 'Patient', lastName: '' },
      invoiceId: data.invoiceId || null,
      amount,
      method: data.method || 'ESPECES',
      checkNumber: data.checkNumber || null,
      checkBank: data.checkBank || null,
      checkDueDate: data.checkDueDate ? new Date(data.checkDueDate).toISOString() : null,
      checkStatus: data.method === 'CHEQUE' ? 'EN_PORTEFEUILLE' : 'NON_APPLICABLE',
      paymentDate: new Date().toISOString(),
      notes: data.notes || null,
      receivedBy: { name: 'Dr. Mehdi Alami' },
    };

    store.payments.unshift(newPayment);

    // Mettre à jour la facture liée
    if (data.invoiceId) {
      const inv = store.invoices.find((i) => i.id === data.invoiceId);
      if (inv) {
        inv.paidAmount = (inv.paidAmount || 0) + amount;
        inv.remainingAmount = Math.max(0, inv.totalAmount - inv.paidAmount);
        inv.status =
          inv.remainingAmount === 0
            ? 'SOLDEE'
            : inv.paidAmount > 0
            ? 'PARTIELLEMENT_PAYEE'
            : 'IMPAYEE';
      }
    }

    if (patient) {
      if (!patient.payments) patient.payments = [];
      patient.payments.unshift(newPayment);
      patient.totalPaid = (patient.totalPaid || 0) + amount;
      patient.remainingDue = Math.max(0, (patient.remainingDue || 0) - amount);
    }

    return newPayment;
  },

  // --- ODONTOGRAM ---
  updateOdontogram(data: any) {
    const patient = this.getPatientById(data.patientId);
    if (!patient) return null;

    if (!patient.teethConditions) patient.teethConditions = [];

    const toothNum = Number(data.toothNumber);
    const existingIdx = patient.teethConditions.findIndex(
      (tc: any) => tc.toothNumber === toothNum
    );

    const toothCondition = {
      id: `tc-${Date.now()}`,
      patientId: data.patientId,
      toothNumber: toothNum,
      status: data.status,
      surfaces: data.surfaces ? JSON.stringify(data.surfaces) : null,
      notes: data.notes || null,
      updatedAt: new Date().toISOString(),
    };

    if (existingIdx !== -1) {
      patient.teethConditions[existingIdx] = toothCondition;
    } else {
      patient.teethConditions.push(toothCondition);
    }

    let createdTreatment = null;
    if (data.newProcedure) {
      if (!patient.treatments) patient.treatments = [];
      createdTreatment = {
        id: `trt-${Date.now()}`,
        patientId: data.patientId,
        toothNumber: toothNum,
        procedureName: data.newProcedure,
        price: Number(data.newPrice || 0),
        category: 'SOINS_CONSERVATEURS',
        date: new Date().toISOString(),
        status: 'TERMINE',
        clinicalNotes: data.notes || null,
        practitioner: { name: 'Dr. Mehdi Alami' },
      };
      patient.treatments.unshift(createdTreatment);
    }

    return { success: true, toothCondition, createdTreatment };
  },

  // --- SETTINGS ---
  getSettings() {
    return store.settings;
  },

  updateSettings(data: any) {
    store.settings = {
      ...store.settings,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return store.settings;
  },
};
