import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ProtheseStatus, ProtheseType } from '@prisma/client';
import { dentalStore } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const patientId = searchParams.get('patientId') || undefined;
  const status = (searchParams.get('status') as ProtheseStatus) || undefined;

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
    console.warn('Prisma DB fallback to in-memory protheses:', error?.message);
    return NextResponse.json(dentalStore.getProtheses(patientId, status));
  }
}

export async function POST(request: Request) {
  const body = await request.json();

  try {
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
    console.warn('Prisma DB fallback to store prothese order:', error?.message);
    const created = dentalStore.createProthese(body);
    return NextResponse.json(created, { status: 201 });
  }
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const { id, status, isPaidToLab, labInvoiceNumber } = body;

  try {
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
    console.warn('Prisma DB fallback to update prothese order:', error?.message);
    const updated = dentalStore.updateProthese(id, body);
    return NextResponse.json(updated || body);
  }
}
