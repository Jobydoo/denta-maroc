import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ProtheseStatus, ProtheseType } from '@prisma/client';
import { DEMO_PROTHESES } from '@/lib/demo-data';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const patientId = searchParams.get('patientId');
  const status = searchParams.get('status') as ProtheseStatus | null;

  try {
    const orders = await prisma.protheseOrder.findMany({
      where: {
        ...(patientId ? { patientId } : {}),
        ...(status ? { status } : {}),
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(orders);
  } catch (error: any) {
    console.warn('Prisma DB fallback to demo protheses:', error?.message);
    return NextResponse.json(DEMO_PROTHESES);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const orderNumber = `LAB-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const order = await prisma.protheseOrder.create({
      data: {
        orderNumber,
        patientId: body.patientId,
        labName: body.labName,
        protheseType: body.protheseType as ProtheseType,
        teethNumbers: body.teethNumbers,
        vitaShade: body.vitaShade || 'A2',
        status: (body.status as ProtheseStatus) || ProtheseStatus.EMPREINTE_PRISE,
        tryInDate: body.tryInDate ? new Date(body.tryInDate) : null,
        deliveryDate: body.deliveryDate ? new Date(body.deliveryDate) : null,
        clinicPrice: Number(body.clinicPrice || 0),
        labCost: Number(body.labCost || 0),
        instructions: body.instructions || null,
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    console.error('Error creating prothese order:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, isPaidToLab, labInvoiceNumber } = body;

    const updated = await prisma.protheseOrder.update({
      where: { id },
      data: {
        ...(status ? { status: status as ProtheseStatus } : {}),
        ...(typeof isPaidToLab === 'boolean' ? { isPaidToLab } : {}),
        ...(labInvoiceNumber ? { labInvoiceNumber } : {}),
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('Error updating prothese order:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
