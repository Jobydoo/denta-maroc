import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PaymentMethod, CheckStatus, InvoiceStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');
    const checkStatus = searchParams.get('checkStatus') as CheckStatus | null;

    const payments = await prisma.payment.findMany({
      where: {
        ...(patientId ? { patientId } : {}),
        ...(checkStatus ? { checkStatus } : {}),
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            cin: true,
          },
        },
        receivedBy: {
          select: { name: true },
        },
      },
      orderBy: { paymentDate: 'desc' },
    });

    return NextResponse.json(payments);
  } catch (error: any) {
    console.error('Error fetching payments:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { patientId, invoiceId, amount, method, checkNumber, checkBank, checkDueDate, notes } = body;

    const paymentNumber = `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const payment = await prisma.payment.create({
      data: {
        paymentNumber,
        patientId,
        invoiceId: invoiceId || null,
        amount: Number(amount),
        method: method as PaymentMethod,
        checkNumber: checkNumber || null,
        checkBank: checkBank || null,
        checkDueDate: checkDueDate ? new Date(checkDueDate) : null,
        checkStatus: method === 'CHEQUE' ? CheckStatus.EN_PORTEFEUILLE : CheckStatus.NON_APPLICABLE,
        notes: notes || null,
      },
    });

    // Mettre à jour la facture liée si présente
    if (invoiceId) {
      const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId } });
      if (invoice) {
        const newPaid = invoice.paidAmount + Number(amount);
        const newRemaining = Math.max(0, invoice.totalAmount - newPaid);
        const newStatus =
          newRemaining === 0
            ? InvoiceStatus.SOLDEE
            : newPaid > 0
            ? InvoiceStatus.PARTIELLEMENT_PAYEE
            : InvoiceStatus.IMPAYEE;

        await prisma.invoice.update({
          where: { id: invoiceId },
          data: {
            paidAmount: newPaid,
            remainingAmount: newRemaining,
            status: newStatus,
          },
        });
      }
    }

    return NextResponse.json(payment, { status: 201 });
  } catch (error: any) {
    console.error('Error registering payment:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
