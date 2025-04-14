import { NextResponse } from 'next/server';
//import { prisma } from '@/lib/prisma';
import db from '@/lib/db';
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { description } = body;

    const documentType = await db.documentType.update({
      where: {
        id: params.id,
      },
      data: {
        description,
      },
    });

    return NextResponse.json(documentType);
  } catch (error) {
    console.error('Error updating document type:', error);
    return NextResponse.json(
      { error: 'Failed to update document type' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await db.documentType.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting document type:', error);
    return NextResponse.json(
      { error: 'Failed to delete document type' },
      { status: 500 }
    );
  }
}
