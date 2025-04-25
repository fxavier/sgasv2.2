import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET all toolbox talks
export async function GET() {
  try {
    const toolboxTalks = await db.toolBoxTalks.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(toolboxTalks);
  } catch (error) {
    console.error('Error fetching toolbox talks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch toolbox talks' },
      { status: 500 }
    );
  }
}

// POST create a new toolbox talk
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const toolboxTalk = await db.toolBoxTalks.create({
      data: {
        name,
      },
    });

    return NextResponse.json(toolboxTalk, { status: 201 });
  } catch (error) {
    console.error('Error creating toolbox talk:', error);
    return NextResponse.json(
      { error: 'Failed to create toolbox talk' },
      { status: 500 }
    );
  }
}
