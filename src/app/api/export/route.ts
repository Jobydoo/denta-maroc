import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json'; // json or csv

    const [patients, appointments, invoices, payments, expenses, protheses, stock] =
      await Promise.all([
        prisma.patient.findMany(),
        prisma.appointment.findMany(),
        prisma.invoice.findMany({ include: { items: true } }),
        prisma.payment.findMany(),
        prisma.expense.findMany(),
        prisma.protheseOrder.findMany(),
        prisma.stockItem.findMany(),
      ]);

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
      // Export simple CSV pour les patients
      const headers = 'ID,Nom,Prenom,CIN,Telephone,Mutuelle,Ville,DateCreation\n';
      const rows = patients
        .map(
          (p) =>
            `"${p.id}","${p.lastName}","${p.firstName}","${p.cin || ''}","${p.phone}","${
              p.mutualType
            }","${p.city}","${p.createdAt.toISOString()}"`
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
  } catch (error: any) {
    console.error('Error exporting database backup:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
