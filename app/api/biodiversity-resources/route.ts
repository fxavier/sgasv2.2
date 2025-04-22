import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET all biodiversity resources
export async function GET() {
  try {
    const resources = await db.biodeversidadeRecursosNaturais.findMany({
      orderBy: {
        description: 'asc',
      },
    });

    // Format the response to match frontend expectations
    const formattedResources = resources.map((resource) => ({
      id: resource.id,
      reference: resource.reference,
      description: resource.description,
    }));

    return NextResponse.json(formattedResources);
  } catch (error) {
    console.error('Error fetching biodiversity resources:', error);
    return NextResponse.json(
      { error: 'Failed to fetch biodiversity resources' },
      { status: 500 }
    );
  }
}

// POST create a new biodiversity resource
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { reference, description } = body;

    if (!description) {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      );
    }

    const resource = await db.biodeversidadeRecursosNaturais.create({
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

    return NextResponse.json(formattedResource, { status: 201 });
  } catch (error) {
    console.error('Error creating biodiversity resource:', error);
    return NextResponse.json(
      { error: 'Failed to create biodiversity resource' },
      { status: 500 }
    );
  }
}
