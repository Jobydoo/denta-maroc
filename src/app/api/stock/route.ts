import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { StockCategory } from '@prisma/client';
import { DEMO_STOCK } from '@/lib/demo-data';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const items = await prisma.stockItem.findMany({
      orderBy: { name: 'asc' },
    });

    const lowStockAlerts = items.filter((i) => i.currentQuantity <= i.minAlertThreshold);

    return NextResponse.json({ items, lowStockAlerts });
  } catch (error: any) {
    console.warn('Prisma DB fallback to demo stock:', error?.message);
    const lowStockAlerts = DEMO_STOCK.filter((i) => i.currentQuantity <= i.minAlertThreshold);
    return NextResponse.json({ items: DEMO_STOCK, lowStockAlerts });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const item = await prisma.stockItem.create({
      data: {
        name: body.name,
        category: (body.category as StockCategory) || StockCategory.AUTRE,
        currentQuantity: Number(body.currentQuantity || 0),
        minAlertThreshold: Number(body.minAlertThreshold || 5),
        unit: body.unit || 'boîtes',
        expiryDate: body.expiryDate ? new Date(body.expiryDate) : null,
        supplier: body.supplier || null,
        unitCost: body.unitCost ? Number(body.unitCost) : null,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error: any) {
    console.error('Error creating stock item:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, quantityDelta, newQuantity } = body;

    const item = await prisma.stockItem.findUnique({ where: { id } });
    if (!item) {
      return NextResponse.json({ error: 'Article introuvable' }, { status: 404 });
    }

    const updatedQty =
      typeof newQuantity === 'number'
        ? newQuantity
        : Math.max(0, item.currentQuantity + Number(quantityDelta || 0));

    const updated = await prisma.stockItem.update({
      where: { id },
      data: { currentQuantity: updatedQty },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('Error updating stock item:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
