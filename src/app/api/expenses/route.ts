import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ExpenseCategory, PaymentMethod } from '@prisma/client';
import { dentalStore } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const expenses = await prisma.expense.findMany({
      orderBy: { date: 'desc' },
    });
    return NextResponse.json(expenses);
  } catch (error: any) {
    console.warn('Prisma DB fallback to in-memory expenses:', error?.message);
    return NextResponse.json(dentalStore.getExpenses());
  }
}

export async function POST(request: Request) {
  const body = await request.json();

  try {
    const expense = await prisma.expense.create({
      data: {
        title: body.title,
        category: (body.category as ExpenseCategory) || ExpenseCategory.AUTRE,
        amount: Number(body.amount),
        date: body.date ? new Date(body.date) : new Date(),
        supplier: body.supplier || null,
        paymentMethod: (body.paymentMethod as PaymentMethod) || PaymentMethod.VIREMENT,
        notes: body.notes || null,
      },
    });

    return NextResponse.json(expense, { status: 201 });
  } catch (error: any) {
    console.warn('Prisma DB fallback to store expense:', error?.message);
    const created = dentalStore.createExpense(body);
    return NextResponse.json(created, { status: 201 });
  }
}
