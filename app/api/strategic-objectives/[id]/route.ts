import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET a specific strategic objective by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const strategicObjective = await db.strategicObjective.findUnique({
      where: {
        id,
      },
      include: {
        specificObjectives: true,
      },
    });

    if (!strategicObjective) {
      return NextResponse.json(
        { error: 'Strategic objective not found' },
        { status: 404 }
      );
    }

    // Format the response to match frontend expectations
    const formattedObjective = {
      id: strategicObjective.id,
      description: strategicObjective.description,
      goals: strategicObjective.goals,
      strategies_for_achievement: strategicObjective.strategiesForAchievement,
      specific_objectives: strategicObjective.specificObjectives.map(
        (specific) => ({
          id: specific.id,
          specific_objective: specific.specificObjective,
        })
      ),
      created_at: strategicObjective.createdAt.toISOString(),
      updated_at: strategicObjective.updatedAt.toISOString(),
    };

    return NextResponse.json(formattedObjective);
  } catch (error) {
    console.error('Error fetching strategic objective:', error);
    return NextResponse.json(
      { error: 'Failed to fetch strategic objective' },
      { status: 500 }
    );
  }
}

// PUT update a strategic objective
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();

    const { description, goals, strategies_for_achievement } = body;

    // Validate required fields
    if (!description || !goals || !strategies_for_achievement) {
      return NextResponse.json(
        {
          error:
            'Description, goals, and strategies for achievement are required',
        },
        { status: 400 }
      );
    }

    // Check if the strategic objective exists
    const existingObjective = await db.strategicObjective.findUnique({
      where: {
        id,
      },
    });

    if (!existingObjective) {
      return NextResponse.json(
        { error: 'Strategic objective not found' },
        { status: 404 }
      );
    }

    // Update the strategic objective
    const strategicObjective = await db.strategicObjective.update({
      where: {
        id,
      },
      data: {
        description,
        goals,
        strategiesForAchievement: strategies_for_achievement,
      },
      include: {
        specificObjectives: true,
      },
    });

    // Format the response to match frontend expectations
    const formattedObjective = {
      id: strategicObjective.id,
      description: strategicObjective.description,
      goals: strategicObjective.goals,
      strategies_for_achievement: strategicObjective.strategiesForAchievement,
      specific_objectives: strategicObjective.specificObjectives.map(
        (specific) => ({
          id: specific.id,
          specific_objective: specific.specificObjective,
        })
      ),
      created_at: strategicObjective.createdAt.toISOString(),
      updated_at: strategicObjective.updatedAt.toISOString(),
    };

    return NextResponse.json(formattedObjective);
  } catch (error) {
    console.error('Error updating strategic objective:', error);
    return NextResponse.json(
      { error: 'Failed to update strategic objective' },
      { status: 500 }
    );
  }
}

// DELETE a strategic objective
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Check if the strategic objective exists
    const existingObjective = await db.strategicObjective.findUnique({
      where: {
        id,
      },
      include: {
        specificObjectives: true,
      },
    });

    if (!existingObjective) {
      return NextResponse.json(
        { error: 'Strategic objective not found' },
        { status: 404 }
      );
    }

    // Check if there are specific objectives associated with this strategic objective
    if (existingObjective.specificObjectives.length > 0) {
      return NextResponse.json(
        {
          error:
            'Cannot delete strategic objective with associated specific objectives',
        },
        { status: 400 }
      );
    }

    // Delete the strategic objective
    await db.strategicObjective.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting strategic objective:', error);
    return NextResponse.json(
      { error: 'Failed to delete strategic objective' },
      { status: 500 }
    );
  }
}
