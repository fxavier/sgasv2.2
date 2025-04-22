import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET all incidents
export async function GET() {
  try {
    const incidents = await db.incidents.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Format the response to match frontend expectations
    const formattedIncidents = incidents.map((incident) => ({
      id: incident.id,
      description: incident.description,
      created_at: incident.createdAt.toISOString(),
      updated_at: incident.updatedAt.toISOString(),
    }));

    return NextResponse.json(formattedIncidents);
  } catch (error) {
    console.error('Error fetching incidents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch incidents' },
      { status: 500 }
    );
  }
}

// POST create a new incident
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

    const incident = await db.incidents.create({
      data: {
        description,
      },
    });

    // Format the response to match frontend expectations
    const formattedIncident = {
      id: incident.id,
      description: incident.description,
      created_at: incident.createdAt.toISOString(),
      updated_at: incident.updatedAt.toISOString(),
    };

    return NextResponse.json(formattedIncident, { status: 201 });
  } catch (error) {
    console.error('Error creating incident:', error);
    return NextResponse.json(
      { error: 'Failed to create incident' },
      { status: 500 }
    );
  }
}
