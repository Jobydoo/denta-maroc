import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { DEMO_PATIENTS } from '@/lib/demo-data';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.toLowerCase() || '';

  try {
    const patients = await prisma.patient.findMany({
      where: q
        ? {
            OR: [
              { firstName: { contains: q, mode: 'insensitive' } },
              { lastName: { contains: q, mode: 'insensitive' } },
              { phone: { contains: q, mode: 'insensitive' } },
              { cin: { contains: q, mode: 'insensitive' } },
            ],
          }
        : undefined,
      include: {
        invoices: {
          select: {
            totalAmount: true,
            paidAmount: true,
            remainingAmount: true,
          },
        },
        appointments: {
          orderBy: { date: 'desc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    const formatted = patients.map((p) => {
      const totalInvoiced = p.invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
      const totalPaid = p.invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
      const remainingDue = p.invoices.reduce((sum, inv) => sum + inv.remainingAmount, 0);

      return {
        ...p,
        totalInvoiced,
        totalPaid,
        remainingDue,
        lastAppointment: p.appointments[0] || null,
      };
    });

    return NextResponse.json(formatted);
  } catch (error: any) {
    console.warn('Prisma DB fallback to demo patients:', error?.message);
    const filtered = q
      ? DEMO_PATIENTS.filter(
          (p) =>
            p.firstName.toLowerCase().includes(q) ||
            p.lastName.toLowerCase().includes(q) ||
            p.phone.includes(q) ||
            (p.cin && p.cin.toLowerCase().includes(q))
        )
      : DEMO_PATIENTS;
    return NextResponse.json(filtered);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const patient = await prisma.patient.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        cin: body.cin || null,
        gender: body.gender || 'M',
        dateOfBirth: new Date(body.dateOfBirth),
        phone: body.phone,
        email: body.email || null,
        address: body.address || null,
        city: body.city || 'Casablanca',
        occupation: body.occupation || null,
        mutualType: body.mutualType || 'CNOPS',
        mutualNumber: body.mutualNumber || null,
        allergies: body.allergies || null,
        chronicDiseases: body.chronicDiseases || null,
        heartCondition: Boolean(body.heartCondition),
        bleedingDisorder: Boolean(body.bleedingDisorder),
        isPregnant: Boolean(body.isPregnant),
        biphosphonates: Boolean(body.biphosphonates),
        medicalNotes: body.medicalNotes || null,
      },
    });

    return NextResponse.json(patient, { status: 201 });
  } catch (error: any) {
    console.error('Error creating patient:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
