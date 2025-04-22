import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET all training needs
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const departmentId = searchParams.get('departmentId');
    const subprojectId = searchParams.get('subprojectId');

    let whereClause = {};

    if (departmentId) {
      whereClause = {
        ...whereClause,
        departmentId,
      };
    }

    if (subprojectId) {
      whereClause = {
        ...whereClause,
        subprojectId,
      };
    }

    const trainingNeeds = await db.trainingNeeds.findMany({
      where: whereClause,
      include: {
        department: true,
        subproject: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Format the response to match frontend expectations
    const formattedNeeds = trainingNeeds.map((need) => ({
      id: need.id,
      filled_by: need.filledBy,
      date: need.date.toISOString(),
      department: need.department
        ? {
            id: need.department.id,
            name: need.department.name,
          }
        : null,
      subproject: need.subproject
        ? {
            id: need.subproject.id,
            name: need.subproject.name,
          }
        : null,
      training: need.training,
      training_objective: need.trainingObjective,
      proposal_of_training_entity: need.proposalOfTrainingEntity,
      potential_training_participants: need.potentialTrainingParticipants,
      created_at: need.createdAt.toISOString(),
      updated_at: need.updatedAt.toISOString(),
    }));

    return NextResponse.json(formattedNeeds);
  } catch (error) {
    console.error('Error fetching training needs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch training needs' },
      { status: 500 }
    );
  }
}

// POST create a new training need
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      filled_by,
      date,
      department,
      subproject,
      training,
      training_objective,
      proposal_of_training_entity,
      potential_training_participants,
    } = body;

    // Validate required fields
    if (
      !filled_by ||
      !date ||
      !training ||
      !training_objective ||
      !proposal_of_training_entity ||
      !potential_training_participants
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create the training need
    const trainingNeed = await db.trainingNeeds.create({
      data: {
        filledBy: filled_by,
        date: new Date(date),
        departmentId: department?.id || null,
        subprojectId: subproject?.id || null,
        training,
        trainingObjective: training_objective,
        proposalOfTrainingEntity: proposal_of_training_entity,
        potentialTrainingParticipants: potential_training_participants,
      },
      include: {
        department: true,
        subproject: true,
      },
    });

    // Format the response to match frontend expectations
    const formattedNeed = {
      id: trainingNeed.id,
      filled_by: trainingNeed.filledBy,
      date: trainingNeed.date.toISOString(),
      department: trainingNeed.department
        ? {
            id: trainingNeed.department.id,
            name: trainingNeed.department.name,
          }
        : null,
      subproject: trainingNeed.subproject
        ? {
            id: trainingNeed.subproject.id,
            name: trainingNeed.subproject.name,
          }
        : null,
      training: trainingNeed.training,
      training_objective: trainingNeed.trainingObjective,
      proposal_of_training_entity: trainingNeed.proposalOfTrainingEntity,
      potential_training_participants:
        trainingNeed.potentialTrainingParticipants,
      created_at: trainingNeed.createdAt.toISOString(),
      updated_at: trainingNeed.updatedAt.toISOString(),
    };

    return NextResponse.json(formattedNeed, { status: 201 });
  } catch (error) {
    console.error('Error creating training need:', error);
    return NextResponse.json(
      { error: 'Failed to create training need' },
      { status: 500 }
    );
  }
}
