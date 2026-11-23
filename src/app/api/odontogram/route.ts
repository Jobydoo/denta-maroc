import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ToothStatus } from '@prisma/client';
import { dentalStore } from '@/lib/store';

export async function POST(request: Request) {
  const body = await request.json();
  const { patientId, toothNumber, status, surfaces, notes, newProcedure, newPrice } = body;

  try {
    const toothCondition = await prisma.toothCondition.upsert({
      where: {
        patientId_toothNumber: {
          patientId,
          toothNumber: Number(toothNumber),
        },
      },
      update: {
        status: status as ToothStatus,
        surfaces: surfaces ? JSON.stringify(surfaces) : null,
        notes: notes || null,
      },
      create: {
        patientId,
        toothNumber: Number(toothNumber),
        status: status as ToothStatus,
        surfaces: surfaces ? JSON.stringify(surfaces) : null,
        notes: notes || null,
      },
    });

    let createdTreatment = null;
    if (newProcedure) {
      createdTreatment = await prisma.treatment.create({
        data: {
          patientId,
          toothNumber: Number(toothNumber),
          procedureName: newProcedure,
          price: Number(newPrice || 0),
          category: 'SOINS_CONSERVATEURS',
          status: 'TERMINE',
          clinicalNotes: notes || null,
        },
      });
    }

    return NextResponse.json({ success: true, toothCondition, createdTreatment });
  } catch (error: any) {
    console.warn('Prisma DB fallback to update odontogram in store:', error?.message);
    const result = dentalStore.updateOdontogram(body);
    return NextResponse.json(result || { success: true });
  }
}
