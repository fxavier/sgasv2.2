import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET a specific acceptance confirmation by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const confirmation = await db.acceptanceConfirmation.findUnique({
      where: {
        id,
      },
    });

    if (!confirmation) {
      return NextResponse.json(
        { error: 'Acceptance confirmation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(confirmation);
  } catch (error) {
    console.error('Error fetching acceptance confirmation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch acceptance confirmation' },
      { status: 500 }
    );
  }
}

// PUT update an acceptance confirmation
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

    const confirmation = await db.acceptanceConfirmation.update({
      where: {
        id,
      },
      data: {
        description,
      },
    });

    return NextResponse.json(confirmation);
  } catch (error) {
    console.error('Error updating acceptance confirmation:', error);
    return NextResponse.json(
      { error: 'Failed to update acceptance confirmation' },
      { status: 500 }
    );
  }
}

// DELETE an acceptance confirmation
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Check if there are any OHS Acting records using this confirmation
    const ohsActingUsingConfirmation = await db.oHSACTING.findFirst({
      where: {
        acceptanceConfirmation: {
          some: {
            id,
          },
        },
      },
    });

    if (ohsActingUsingConfirmation) {
      return NextResponse.json(
        {
          error:
            'Cannot delete acceptance confirmation that is in use by OHS Acting records',
        },
        { status: 400 }
      );
    }

    await db.acceptanceConfirmation.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting acceptance confirmation:', error);
    return NextResponse.json(
      { error: 'Failed to delete acceptance confirmation' },
      { status: 500 }
    );
  }
}
