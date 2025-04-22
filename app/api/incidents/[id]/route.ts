import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET a specific incident by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const incident = await db.incidents.findUnique({
      where: {
        id,
      },
    });

    if (!incident) {
      return NextResponse.json(
        { error: 'Incident not found' },
        { status: 404 }
      );
    }

    // Format the response to match frontend expectations
    const formattedIncident = {
      id: incident.id,
      description: incident.description,
      created_at: incident.createdAt.toISOString(),
      updated_at: incident.updatedAt.toISOString(),
    };

    return NextResponse.json(formattedIncident);
  } catch (error) {
    console.error('Error fetching incident:', error);
    return NextResponse.json(
      { error: 'Failed to fetch incident' },
      { status: 500 }
    );
  }
}

// PUT update an incident
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();

    const { description } = body;

    if (!description) {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      );
    }

    const incident = await db.incidents.update({
      where: {
        id,
      },
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

    return NextResponse.json(formattedIncident);
  } catch (error) {
    console.error('Error updating incident:', error);
    return NextResponse.json(
      { error: 'Failed to update incident' },
      { status: 500 }
    );
  }
}

// DELETE an incident
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Check if there are any flash reports using this incident
    const flashReportsUsingIncident = await db.incidentFlashReport.findFirst({
      where: {
        incidents: {
          some: {
            id,
          },
        },
      },
    });

    if (flashReportsUsingIncident) {
      return NextResponse.json(
        { error: 'Cannot delete incident that is in use by flash reports' },
        { status: 400 }
      );
    }

    await db.incidents.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting incident:', error);
    return NextResponse.json(
      { error: 'Failed to delete incident' },
      { status: 500 }
    );
  }
}
