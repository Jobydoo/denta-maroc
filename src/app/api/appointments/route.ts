import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AppointmentStatus, CareType } from '@prisma/client';
import { dentalStore } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date') || undefined;
  const patientId = searchParams.get('patientId') || undefined;

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
    console.warn('Prisma DB fallback to in-memory appointments:', error?.message);
    return NextResponse.json(dentalStore.getAppointments(date, patientId));
  }
}

export async function POST(request: Request) {
  const body = await request.json();

  try {
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
    console.warn('Prisma DB fallback to store appointment:', error?.message);
    const created = dentalStore.createAppointment(body);
    return NextResponse.json(created, { status: 201 });
  }
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const { id, status } = body;

  try {
    const updated = await prisma.appointment.update({
      where: { id },
      data: {
        status: status as AppointmentStatus,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.warn('Prisma DB fallback to update appointment status:', error?.message);
    const updated = dentalStore.updateAppointment(id, status);
    return NextResponse.json(updated || { id, status });
  }
}
