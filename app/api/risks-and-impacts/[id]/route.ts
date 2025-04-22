import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET a specific risk and impact by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const risk = await db.risksAndImpact.findUnique({
      where: {
        id,
      },
    });

    if (!risk) {
      return NextResponse.json(
        { error: 'Risk and impact not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(risk);
  } catch (error) {
    console.error('Error fetching risk and impact:', error);
    return NextResponse.json(
      { error: 'Failed to fetch risk and impact' },
      { status: 500 }
    );
  }
}

// PUT update a risk and impact
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

    const risk = await db.risksAndImpact.update({
      where: {
        id,
      },
      data: {
        description,
      },
    });

    return NextResponse.json(risk);
  } catch (error) {
    console.error('Error updating risk and impact:', error);
    return NextResponse.json(
      { error: 'Failed to update risk and impact' },
      { status: 500 }
    );
  }
}

// DELETE a risk and impact
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Check if there are any impact assessments using this risk
    const assessmentsUsingRisk =
      await db.environAndSocialRiskAndImapactAssessement.count({
        where: {
          risksAndImpactId: id,
        },
      });

    if (assessmentsUsingRisk > 0) {
      return NextResponse.json(
        {
          error:
            'Cannot delete risk and impact that is in use by impact assessments',
        },
        { status: 400 }
      );
    }

    await db.risksAndImpact.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting risk and impact:', error);
    return NextResponse.json(
      { error: 'Failed to delete risk and impact' },
      { status: 500 }
    );
  }
}
