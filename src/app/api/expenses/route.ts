import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ExpenseCategory, PaymentMethod } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') as ExpenseCategory | null;

    const expenses = await prisma.expense.findMany({
      where: category ? { category } : undefined,
      orderBy: { date: 'desc' },
    });

    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

    return NextResponse.json({ expenses, totalExpenses });
  } catch (error: any) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const expense = await prisma.expense.create({
      data: {
        title: body.title,
        category: body.category as ExpenseCategory,
        amount: Number(body.amount),
        date: body.date ? new Date(body.date) : new Date(),
        supplier: body.supplier || null,
        paymentMethod: (body.paymentMethod as PaymentMethod) || PaymentMethod.VIREMENT,
        receiptUrl: body.receiptUrl || null,
        notes: body.notes || null,
      },
    });

    return NextResponse.json(expense, { status: 201 });
  } catch (error: any) {
    console.error('Error creating expense:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
