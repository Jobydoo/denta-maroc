import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { StockCategory } from '@prisma/client';
import { dentalStore } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const stock = await prisma.stockItem.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(stock);
  } catch (error: any) {
    console.warn('Prisma DB fallback to in-memory stock:', error?.message);
    return NextResponse.json(dentalStore.getStock());
  }
}

export async function POST(request: Request) {
  const body = await request.json();

  try {
    const item = await prisma.stockItem.create({
      data: {
        name: body.name,
        category: (body.category as StockCategory) || StockCategory.AUTRE,
        currentQuantity: Number(body.currentQuantity || 0),
        minAlertThreshold: Number(body.minAlertThreshold || 5),
        unit: body.unit || 'boîtes',
        supplier: body.supplier || null,
        unitCost: body.unitCost ? Number(body.unitCost) : null,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error: any) {
    console.warn('Prisma DB fallback to store stock item:', error?.message);
    const created = dentalStore.createStock(body);
    return NextResponse.json(created, { status: 201 });
  }
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const { id, delta, currentQuantity } = body;

  try {
    let updated;
    if (typeof delta === 'number') {
      updated = await prisma.stockItem.update({
        where: { id },
        data: { currentQuantity: { increment: delta } },
      });
    } else if (typeof currentQuantity === 'number') {
      updated = await prisma.stockItem.update({
        where: { id },
        data: { currentQuantity },
      });
    }
    return NextResponse.json(updated);
  } catch (error: any) {
    console.warn('Prisma DB fallback to update stock quantity:', error?.message);
    const updated = dentalStore.updateStock(id, body);
    return NextResponse.json(updated || body);
  }
}
