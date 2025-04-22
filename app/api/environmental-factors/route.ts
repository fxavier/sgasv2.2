import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET all environmental factors
export async function GET() {
  try {
    const factors = await db.environmentalFactor.findMany({
      orderBy: {
        description: 'asc',
      },
    });

    return NextResponse.json(factors);
  } catch (error) {
    console.error('Error fetching environmental factors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch environmental factors' },
      { status: 500 }
    );
  }
}

// POST create a new environmental factor
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

    const factor = await db.environmentalFactor.create({
      data: {
        description,
      },
    });

    return NextResponse.json(factor, { status: 201 });
  } catch (error) {
    console.error('Error creating environmental factor:', error);
    return NextResponse.json(
      { error: 'Failed to create environmental factor' },
      { status: 500 }
    );
  }
}
