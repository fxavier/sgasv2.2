import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET all specific objectives
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const strategicObjectiveId = searchParams.get('strategicObjectiveId');

    let whereClause = {};

    if (strategicObjectiveId) {
      whereClause = {
        ...whereClause,
        strategicObjectiveId,
      };
    }

    const specificObjectives = await db.specificObjective.findMany({
      where: whereClause,
      include: {
        strategicObjective: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Format the response to match frontend expectations
    const formattedObjectives = specificObjectives.map((objective) => ({
      id: objective.id,
      strategic_objective: objective.strategicObjective.description,
      specific_objective: objective.specificObjective,
      actions_for_achievement: objective.actionsForAchievement,
      responsible_person: objective.responsiblePerson,
      necessary_resources: objective.necessaryResources,
      indicator: objective.indicator,
      goal: objective.goal,
      monitoring_frequency: objective.monitoringFrequency,
      deadline: objective.deadline.toISOString(),
      observation: objective.observation,
      created_at: objective.createdAt.toISOString(),
      updated_at: objective.updatedAt.toISOString(),
    }));

    return NextResponse.json(formattedObjectives);
  } catch (error) {
    console.error('Error fetching specific objectives:', error);
    return NextResponse.json(
      { error: 'Failed to fetch specific objectives' },
      { status: 500 }
    );
  }
}

// POST create a new specific objective
export async function POST(request: Request) {
  try {
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

    // Create the specific objective
    const specificObjective = await db.specificObjective.create({
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

    return NextResponse.json(formattedObjective, { status: 201 });
  } catch (error) {
    console.error('Error creating specific objective:', error);
    return NextResponse.json(
      { error: 'Failed to create specific objective' },
      { status: 500 }
    );
  }
}
