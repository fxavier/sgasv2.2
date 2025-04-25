import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET all trainings
export async function GET() {
  try {
    const trainings = await db.training.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(trainings);
  } catch (error) {
    console.error('Error fetching trainings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trainings' },
      { status: 500 }
    );
  }
}

// POST create a new training
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const training = await db.training.create({
      data: {
        name,
      },
    });

    return NextResponse.json(training, { status: 201 });
  } catch (error) {
    console.error('Error creating training:', error);
    return NextResponse.json(
      { error: 'Failed to create training' },
      { status: 500 }
    );
  }
}
