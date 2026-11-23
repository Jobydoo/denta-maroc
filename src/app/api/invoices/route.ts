import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { InvoiceStatus, QuoteStatus } from '@prisma/client';
import { dentalStore } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const patientId = searchParams.get('patientId') || undefined;

  try {
    const invoices = await prisma.invoice.findMany({
      where: patientId ? { patientId } : undefined,
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
        items: true,
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const quotes = await prisma.quote.findMany({
      where: patientId ? { patientId } : undefined,
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ invoices, quotes });
  } catch (error: any) {
    console.warn('Prisma DB fallback to in-memory invoices/quotes:', error?.message);
    return NextResponse.json(dentalStore.getInvoices(patientId));
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const { isQuote, patientId, mutualType, mutualClaimNumber, discount, totalAmount, items, number } = body;

  try {
    if (isQuote) {
      const quote = await prisma.quote.create({
        data: {
          quoteNumber: number || `DEV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          patientId,
          totalAmount: Number(totalAmount + (discount || 0)),
          discount: Number(discount || 0),
          finalAmount: Number(totalAmount),
          status: QuoteStatus.EN_ATTENTE,
          validUntil: new Date(Date.now() + 30 * 86400000),
          items: {
            create: items.map((i: any) => ({
              description: i.description,
              toothNumber: i.toothNumber ? Number(i.toothNumber) : null,
              quantity: Number(i.quantity || 1),
              unitPrice: Number(i.unitPrice),
              totalPrice: Number(i.unitPrice * (i.quantity || 1)),
            })),
          },
        },
      });
      return NextResponse.json(quote, { status: 201 });
    }

    // Facture
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber: number || `FAC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        patientId,
        totalAmount: Number(totalAmount),
        paidAmount: 0,
        remainingAmount: Number(totalAmount),
        status: InvoiceStatus.IMPAYEE,
        mutualType: mutualType || null,
        mutualClaimNumber: mutualClaimNumber || null,
        items: {
          create: items.map((i: any) => ({
            description: i.description,
            toothNumber: i.toothNumber ? Number(i.toothNumber) : null,
            quantity: Number(i.quantity || 1),
            unitPrice: Number(i.unitPrice),
            totalPrice: Number(i.unitPrice * (i.quantity || 1)),
            amoCode: i.amoCode || null,
          })),
        },
      },
    });

    return NextResponse.json(invoice, { status: 201 });
  } catch (error: any) {
    console.warn('Prisma DB fallback to store invoice or quote:', error?.message);
    const created = dentalStore.createInvoiceOrQuote(body);
    return NextResponse.json(created, { status: 201 });
  }
}
