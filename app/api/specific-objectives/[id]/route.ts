import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET a specific objective by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const specificObjective = await db.specificObjective.findUnique({
      where: {
        id,
      },
      include: {
        strategicObjective: true,
      },
    });

    if (!specificObjective) {
      return NextResponse.json(
        { error: 'Specific objective not found' },
        { status: 404 }
      );
    }

    // Format the response to match frontend expectations
    const formattedObjective = {
      id: specificObjective.id,
      strategic_objective: specificObjective.strategicObjective.description,
      specific_objective: specificObjective.specificObjective,
      actions_for_achievement: specificObjective.actionsForAchievement,
      responsible_person: specificObjective.responsiblePerson,
      necessary_resources: specificObjective.necessaryResources,
      indicator: specificObjective.indicator,
      goal: specificObjective.goal,
      monitoring_frequency: specificObjective.monitoringFrequency,
      deadline: specificObjective.deadline.toISOString(),
      observation: specificObjective.observation,
      created_at: specificObjective.createdAt.toISOString(),
      updated_at: specificObjective.updatedAt.toISOString(),
    };

    return NextResponse.json(formattedObjective);
  } catch (error) {
    console.error('Error fetching specific objective:', error);
    return NextResponse.json(
      { error: 'Failed to fetch specific objective' },
      { status: 500 }
    );
  }
}

// PUT update a specific objective
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();

    const {
      strategic_objective,
      specific_objective,
      actions_for_achievement,
      responsible_person,
      necessary_resources,
      indicator,
      goal,
      monitoring_frequency,
      deadline,
      observation,
    } = body;

    // Validate required fields
    if (
      !strategic_objective ||
      !specific_objective ||
      !actions_for_achievement ||
      !responsible_person ||
      !necessary_resources ||
      !indicator ||
      !goal ||
      !monitoring_frequency ||
      !deadline
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if the specific objective exists
    const existingObjective = await db.specificObjective.findUnique({
      where: {
        id,
      },
    });

    if (!existingObjective) {
      return NextResponse.json(
        { error: 'Specific objective not found' },
        { status: 404 }
      );
    }

    // Check if the strategic objective exists
    const strategicObjective = await db.strategicObjective.findFirst({
      where: {
        description: strategic_objective,
      },
    });

    if (!strategicObjective) {
      return NextResponse.json(
        { error: 'Strategic objective not found' },
        { status: 404 }
      );
    }

    // Update the specific objective
    const specificObjective = await db.specificObjective.update({
      where: {
        id,
      },
      data: {
        strategicObjectiveId: strategicObjective.id,
        specificObjective: specific_objective,
        actionsForAchievement: actions_for_achievement,
        responsiblePerson: responsible_person,
        necessaryResources: necessary_resources,
        indicator,
        goal,
        monitoringFrequency: monitoring_frequency,
        deadline: new Date(deadline),
        observation: observation || '',
      },
      include: {
        strategicObjective: true,
      },
    });

    // Format the response to match frontend expectations
    const formattedObjective = {
      id: specificObjective.id,
      strategic_objective: specificObjective.strategicObjective.description,
      specific_objective: specificObjective.specificObjective,
      actions_for_achievement: specificObjective.actionsForAchievement,
      responsible_person: specificObjective.responsiblePerson,
      necessary_resources: specificObjective.necessaryResources,
      indicator: specificObjective.indicator,
      goal: specificObjective.goal,
      monitoring_frequency: specificObjective.monitoringFrequency,
      deadline: specificObjective.deadline.toISOString(),
      observation: specificObjective.observation,
      created_at: specificObjective.createdAt.toISOString(),
      updated_at: specificObjective.updatedAt.toISOString(),
    };

    return NextResponse.json(formattedObjective);
  } catch (error) {
    console.error('Error updating specific objective:', error);
    return NextResponse.json(
      { error: 'Failed to update specific objective' },
      { status: 500 }
    );
  }
}

// DELETE a specific objective
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Check if the specific objective exists
    const existingObjective = await db.specificObjective.findUnique({
      where: {
        id,
      },
    });

    if (!existingObjective) {
      return NextResponse.json(
        { error: 'Specific objective not found' },
        { status: 404 }
      );
    }

    // Delete the specific objective
    await db.specificObjective.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting specific objective:', error);
    return NextResponse.json(
      { error: 'Failed to delete specific objective' },
      { status: 500 }
    );
  }
}
