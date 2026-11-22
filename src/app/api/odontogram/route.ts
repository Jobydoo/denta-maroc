import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ToothStatus } from '@prisma/client';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { patientId, toothNumber, status, surfaces, notes, newProcedure, newPrice } = body;

    // 1. Mettre à jour ou créer la condition de la dent
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

    // 2. Si un acte a été spécifié, l'enregistrer dans le journal des traitements
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
    console.error('Error updating odontogram:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
