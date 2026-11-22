import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

    if (!patient) {
      return NextResponse.json({ error: 'Patient introuvable' }, { status: 404 });
    }

    const totalInvoiced = patient.invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const totalPaid = patient.invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
    const remainingDue = patient.invoices.reduce((sum, inv) => sum + inv.remainingAmount, 0);

    return NextResponse.json({
      ...patient,
      totalInvoiced,
      totalPaid,
      remainingDue,
    });
  } catch (error: any) {
    console.error('Error fetching patient 360:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

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
    console.error('Error updating patient:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.patient.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting patient:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
