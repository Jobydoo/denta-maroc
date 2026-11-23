import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { dentalStore } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format') || 'json'; // json or csv

  let patients: any[] = [];
  let appointments: any[] = [];
  let invoices: any[] = [];
  let payments: any[] = [];
  let expenses: any[] = [];
  let protheses: any[] = [];
  let stock: any[] = [];

  try {
    const results = await Promise.all([
      prisma.patient.findMany(),
      prisma.appointment.findMany(),
      prisma.invoice.findMany({ include: { items: true } }),
      prisma.payment.findMany(),
      prisma.expense.findMany(),
      prisma.protheseOrder.findMany(),
      prisma.stockItem.findMany(),
    ]);
    patients = results[0];
    appointments = results[1];
    invoices = results[2];
    payments = results[3];
    expenses = results[4];
    protheses = results[5];
    stock = results[6];
  } catch (error: any) {
    console.warn('Prisma DB fallback to in-memory store for export:', error?.message);
    patients = dentalStore.getPatients();
    appointments = dentalStore.getAppointments();
    const invData = dentalStore.getInvoices();
    invoices = invData.invoices;
    payments = dentalStore.getPayments();
    expenses = dentalStore.getExpenses();
    protheses = dentalStore.getProtheses();
    stock = dentalStore.getStock();
  }

  const exportData = {
    exportedAt: new Date().toISOString(),
    cabinet: 'Cabinet Dentaire Dr. Mehdi Alami Casablanca',
    patients,
    appointments,
    invoices,
    payments,
    expenses,
    protheses,
    stock,
  };

  if (format === 'csv') {
    const headers = 'ID,Nom,Prenom,CIN,Telephone,Mutuelle,Ville,DateCreation\n';
    const rows = patients
      .map(
        (p) =>
          `"${p.id}","${p.lastName}","${p.firstName}","${p.cin || ''}","${p.phone}","${
            p.mutualType
          }","${p.city || 'Casablanca'}","${p.createdAt || new Date().toISOString()}"`
      )
      .join('\n');

    return new Response(headers + rows, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="patients_dentamaroc_${Date.now()}.csv"`,
      },
    });
  }

  return new Response(JSON.stringify(exportData, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="backup_dentamaroc_${Date.now()}.json"`,
    },
  });
}
