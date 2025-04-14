import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET all document types
export async function GET() {
  try {
    const documentTypes = await db.documentType.findMany({
      orderBy: {
        description: 'asc',
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

// POST create a new document type
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { description } = body;

    if (!description) {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      );
    }

    const documentType = await db.documentType.create({
      data: {
        description,
      },
    });

    return NextResponse.json(documentType, { status: 201 });
  } catch (error) {
    console.error('Error creating document type:', error);
    return NextResponse.json(
      { error: 'Failed to create document type' },
      { status: 500 }
    );
  }
}
