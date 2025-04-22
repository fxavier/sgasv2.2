import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET all risks and impacts
export async function GET() {
  try {
    const risks = await db.risksAndImpact.findMany({
      orderBy: {
        description: 'asc',
      },
    });

    return NextResponse.json(risks);
  } catch (error) {
    console.error('Error fetching risks and impacts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch risks and impacts' },
      { status: 500 }
    );
  }
}

// POST create a new risk and impact
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

    const risk = await db.risksAndImpact.create({
      data: {
        description,
      },
    });

    return NextResponse.json(risk, { status: 201 });
  } catch (error) {
    console.error('Error creating risk and impact:', error);
    return NextResponse.json(
      { error: 'Failed to create risk and impact' },
      { status: 500 }
    );
  }
}
