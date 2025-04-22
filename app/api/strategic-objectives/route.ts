import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET all strategic objectives
export async function GET() {
  try {
    const strategicObjectives = await db.strategicObjective.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        specificObjectives: true,
      },
    });

    // Format the response to match frontend expectations
    const formattedObjectives = strategicObjectives.map((objective) => ({
      id: objective.id,
      description: objective.description,
      goals: objective.goals,
      strategies_for_achievement: objective.strategiesForAchievement,
      specific_objectives: objective.specificObjectives.map((specific) => ({
        id: specific.id,
        specific_objective: specific.specificObjective,
      })),
      created_at: objective.createdAt.toISOString(),
      updated_at: objective.updatedAt.toISOString(),
    }));

    return NextResponse.json(formattedObjectives);
  } catch (error) {
    console.error('Error fetching strategic objectives:', error);
    return NextResponse.json(
      { error: 'Failed to fetch strategic objectives' },
      { status: 500 }
    );
  }
}

// POST create a new strategic objective
export async function POST(request: Request) {
  try {
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

    // Create the strategic objective
    const strategicObjective = await db.strategicObjective.create({
      data: {
        description,
        goals,
        strategiesForAchievement: strategies_for_achievement,
      },
    });

    // Format the response to match frontend expectations
    const formattedObjective = {
      id: strategicObjective.id,
      description: strategicObjective.description,
      goals: strategicObjective.goals,
      strategies_for_achievement: strategicObjective.strategiesForAchievement,
      specific_objectives: [],
      created_at: strategicObjective.createdAt.toISOString(),
      updated_at: strategicObjective.updatedAt.toISOString(),
    };

    return NextResponse.json(formattedObjective, { status: 201 });
  } catch (error) {
    console.error('Error creating strategic objective:', error);
    return NextResponse.json(
      { error: 'Failed to create strategic objective' },
      { status: 500 }
    );
  }
}
