import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { dentalStore } from '@/lib/store';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const patient = await prisma.patient.findUnique({
      where: { id: params.id },
      include: {
        teethConditions: true,
        treatments: {
          orderBy: { date: 'desc' },
          include: { practitioner: { select: { name: true } } },
        },
        appointments: {
          orderBy: { date: 'desc' },
        },
        quotes: {
          orderBy: { createdAt: 'desc' },
          include: { items: true },
        },
        invoices: {
          orderBy: { createdAt: 'desc' },
          include: { items: true, payments: true },
        },
        payments: {
          orderBy: { paymentDate: 'desc' },
          include: { receivedBy: { select: { name: true } } },
        },
        protheses: {
          orderBy: { createdAt: 'desc' },
        },
        files: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (patient) {
      const totalInvoiced = patient.invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
      const totalPaid = patient.invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
      const remainingDue = patient.invoices.reduce((sum, inv) => sum + inv.remainingAmount, 0);

      return NextResponse.json({
        ...patient,
        totalInvoiced,
        totalPaid,
        remainingDue,
      });
    }
  } catch (error: any) {
    console.warn('Prisma DB fallback to in-memory patient by ID:', error?.message);
  }

  const found = dentalStore.getPatientById(params.id);
  return NextResponse.json(found);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json();

  try {
    const updated = await prisma.patient.update({
      where: { id: params.id },
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        cin: body.cin || null,
        gender: body.gender,
        dateOfBirth: new Date(body.dateOfBirth),
        phone: body.phone,
        email: body.email || null,
        address: body.address,
        city: body.city,
        occupation: body.occupation,
        mutualType: body.mutualType,
        mutualNumber: body.mutualNumber,
        allergies: body.allergies,
        chronicDiseases: body.chronicDiseases,
        heartCondition: Boolean(body.heartCondition),
        bleedingDisorder: Boolean(body.bleedingDisorder),
        isPregnant: Boolean(body.isPregnant),
        biphosphonates: Boolean(body.biphosphonates),
        medicalNotes: body.medicalNotes,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.warn('Prisma DB fallback to update patient in store:', error?.message);
    const updated = dentalStore.updatePatient(params.id, body);
    return NextResponse.json(updated || body);
  }
}
