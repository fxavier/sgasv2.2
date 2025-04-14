import { NextResponse } from 'next/server';
//import { prisma } from '@/lib/prisma';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const documentTypes = await db.documentType.findMany({
      orderBy: {
        created_at: 'desc',
      },
    });
    return NextResponse.json(documentTypes);
  } catch (error) {
    console.error('Error fetching document types:', error);
    return NextResponse.json(
      { error: 'Failed to fetch document types' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { description } = body;

    const documentType = await db.documentType.create({
      data: {
        description,
      },
    });

    return NextResponse.json(documentType);
  } catch (error) {
    console.error('Error creating document type:', error);
    return NextResponse.json(
      { error: 'Failed to create document type' },
      { status: 500 }
    );
  }
}
