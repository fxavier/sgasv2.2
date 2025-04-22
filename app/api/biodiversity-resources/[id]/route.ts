import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET a specific biodiversity resource by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const resource = await db.biodeversidadeRecursosNaturais.findUnique({
      where: {
        id,
      },
    });

    if (!resource) {
      return NextResponse.json(
        { error: 'Biodiversity resource not found' },
        { status: 404 }
      );
    }

    // Format the response to match frontend expectations
    const formattedResource = {
      id: resource.id,
      reference: resource.reference,
      description: resource.description,
    };

    return NextResponse.json(formattedResource);
  } catch (error) {
    console.error('Error fetching biodiversity resource:', error);
    return NextResponse.json(
      { error: 'Failed to fetch biodiversity resource' },
      { status: 500 }
    );
  }
}

// PUT update a biodiversity resource
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();

    const { reference, description } = body;

    if (!description) {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      );
    }

    const resource = await db.biodeversidadeRecursosNaturais.update({
      where: {
        id,
      },
      data: {
        reference,
        description,
      },
    });

    // Format the response to match frontend expectations
    const formattedResource = {
      id: resource.id,
      reference: resource.reference,
      description: resource.description,
    };

    return NextResponse.json(formattedResource);
  } catch (error) {
    console.error('Error updating biodiversity resource:', error);
    return NextResponse.json(
      { error: 'Failed to update biodiversity resource' },
      { status: 500 }
    );
  }
}

// DELETE a biodiversity resource
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Check if there are any references to this biodiversity resource
    // In a real implementation, you would check for references in other tables
    // For now, we'll just delete it directly

    await db.biodeversidadeRecursosNaturais.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting biodiversity resource:', error);
    return NextResponse.json(
      { error: 'Failed to delete biodiversity resource' },
      { status: 500 }
    );
  }
}
