import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

// GET all positions
export async function GET() {
  try {
    const positions = await prisma.position.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    
    return NextResponse.json(positions);
  } catch (error) {
    console.error('Error fetching positions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch positions' },
      { status: 500 }
    );
  }
}

// POST create a new position
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const { name } = body;
    
    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }
    
    const position = await prisma.position.create({
      data: {
        name,
      },
    });
    
    return NextResponse.json(position, { status: 201 });
  } catch (error) {
    console.error('Error creating position:', error);
    return NextResponse.json(
      { error: 'Failed to create position' },
      { status: 500 }
    );
  }
}