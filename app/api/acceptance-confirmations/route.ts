import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET all acceptance confirmations
export async function GET() {
  try {
    const confirmations = await db.acceptanceConfirmation.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(confirmations);
  } catch (error) {
    console.error('Error fetching acceptance confirmations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch acceptance confirmations' },
      { status: 500 }
    );
  }
}

// POST create a new acceptance confirmation
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

    const confirmation = await db.acceptanceConfirmation.create({
      data: {
        description,
      },
    });

    return NextResponse.json(confirmation, { status: 201 });
  } catch (error) {
    console.error('Error creating acceptance confirmation:', error);
    return NextResponse.json(
      { error: 'Failed to create acceptance confirmation' },
      { status: 500 }
    );
  }
}
