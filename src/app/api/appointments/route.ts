import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AppointmentStatus, CareType } from '@prisma/client';
import { DEMO_APPOINTMENTS } from '@/lib/demo-data';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');
  const patientId = searchParams.get('patientId');

  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        ...(patientId ? { patientId } : {}),
        ...(date
          ? {
              date: {
                gte: new Date(`${date}T00:00:00Z`),
                lte: new Date(`${date}T23:59:59Z`),
              },
            }
          : {}),
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            cin: true,
          },
        },
      },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    });

    return NextResponse.json(appointments);
  } catch (error: any) {
    console.warn('Prisma DB fallback to demo appointments:', error?.message);
    return NextResponse.json(DEMO_APPOINTMENTS);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const appt = await prisma.appointment.create({
      data: {
        patientId: body.patientId,
        title: body.title,
        date: new Date(body.date),
        startTime: body.startTime,
        endTime: body.endTime || '10:00',
        status: (body.status as AppointmentStatus) || AppointmentStatus.PLANIFIE,
        careType: (body.careType as CareType) || CareType.CONSULTATION,
        notes: body.notes || null,
      },
    });

    return NextResponse.json(appt, { status: 201 });
  } catch (error: any) {
    console.error('Error creating appointment:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    const updated = await prisma.appointment.update({
      where: { id },
      data: {
        status: status as AppointmentStatus,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('Error updating appointment:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
