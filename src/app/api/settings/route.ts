import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { dentalStore } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    let settings = await prisma.clinicSettings.findFirst();
    if (settings) {
      return NextResponse.json(settings);
    }
  } catch (error: any) {
    console.warn('Prisma DB fallback to in-memory settings:', error?.message);
  }
  return NextResponse.json(dentalStore.getSettings());
}

export async function PUT(request: Request) {
  const body = await request.json();

  try {
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
    console.warn('Prisma DB fallback to update settings in store:', error?.message);
    const updated = dentalStore.updateSettings(body);
    return NextResponse.json(updated || body);
  }
}
