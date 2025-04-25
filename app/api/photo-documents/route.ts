import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/photo-documents - Create a new photo document
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { photo, document, createdBy } = body;

    // Validate input
    if (!createdBy) {
      return NextResponse.json(
        { message: 'Creator name is required' },
        { status: 400 }
      );
    }

    if (!photo && !document) {
      return NextResponse.json(
        { message: 'At least one file URL (photo or document) is required' },
        { status: 400 }
      );
    }

    // Create photo document
    const photoDocument = await prisma.photoDocumentProvingClosure.create({
      data: {
        photo,
        document,
        createdBy,
      },
    });

    return NextResponse.json(photoDocument, { status: 201 });
  } catch (error) {
    console.error('Error creating photo document:', error);
    return NextResponse.json(
      { message: 'Error creating photo document' },
      { status: 500 }
    );
  }
}

// GET /api/photo-documents - Get all photo documents
export async function GET() {
  try {
    const photoDocuments = await prisma.photoDocumentProvingClosure.findMany(
      {}
    );

    return NextResponse.json(photoDocuments);
  } catch (error) {
    console.error('Error fetching photo documents:', error);
    return NextResponse.json(
      { message: 'Error fetching photo documents' },
      { status: 500 }
    );
  }
}
