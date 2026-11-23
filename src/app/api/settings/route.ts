import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { DEMO_SETTINGS } from '@/lib/demo-data';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    let settings = await prisma.clinicSettings.findFirst();
    if (settings) {
      return NextResponse.json(settings);
    }
  } catch (error: any) {
    console.warn('Prisma DB fallback to demo settings:', error?.message);
  }
  return NextResponse.json(DEMO_SETTINGS);
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    let settings = await prisma.clinicSettings.findFirst();

    if (!settings) {
      settings = await prisma.clinicSettings.create({ data: body });
    } else {
      settings = await prisma.clinicSettings.update({
        where: { id: settings.id },
        data: body,
      });
    }

    return NextResponse.json(settings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
