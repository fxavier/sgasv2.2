import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET all subprojects
export async function GET() {
  try {
    const subprojects = await db.subproject.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(subprojects);
  } catch (error) {
    console.error('Error fetching subprojects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subprojects' },
      { status: 500 }
    );
  }
}

// POST create a new subproject
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      name,
      contractReference,
      contractorName,
      estimatedCost,
      location,
      geographicCoordinates,
      type,
      approximateArea,
    } = body;

    if (!name || !location || !type || !approximateArea) {
      return NextResponse.json(
        { error: 'Name, location, type, and approximate area are required' },
        { status: 400 }
      );
    }

    const subproject = await db.subproject.create({
      data: {
        name,
        contractReference,
        contractorName,
        estimatedCost: estimatedCost ? parseFloat(estimatedCost) : null,
        location,
        geographicCoordinates,
        type,
        approximateArea,
      },
    });

    return NextResponse.json(subproject, { status: 201 });
  } catch (error) {
    console.error('Error creating subproject:', error);
    return NextResponse.json(
      { error: 'Failed to create subproject' },
      { status: 500 }
    );
  }
}
