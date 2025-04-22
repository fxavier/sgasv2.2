import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET a specific environmental factor by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const factor = await db.environmentalFactor.findUnique({
      where: {
        id,
      },
    });

    if (!factor) {
      return NextResponse.json(
        { error: 'Environmental factor not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(factor);
  } catch (error) {
    console.error('Error fetching environmental factor:', error);
    return NextResponse.json(
      { error: 'Failed to fetch environmental factor' },
      { status: 500 }
    );
  }
}

// PUT update an environmental factor
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

    const factor = await db.environmentalFactor.update({
      where: {
        id,
      },
      data: {
        description,
      },
    });

    return NextResponse.json(factor);
  } catch (error) {
    console.error('Error updating environmental factor:', error);
    return NextResponse.json(
      { error: 'Failed to update environmental factor' },
      { status: 500 }
    );
  }
}

// DELETE an environmental factor
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Check if there are any impact assessments using this factor
    const assessmentsUsingFactor =
      await db.environAndSocialRiskAndImapactAssessement.count({
        where: {
          environmentalFactorId: id,
        },
      });

    if (assessmentsUsingFactor > 0) {
      return NextResponse.json(
        {
          error:
            'Cannot delete environmental factor that is in use by impact assessments',
        },
        { status: 400 }
      );
    }

    await db.environmentalFactor.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting environmental factor:', error);
    return NextResponse.json(
      { error: 'Failed to delete environmental factor' },
      { status: 500 }
    );
  }
}
