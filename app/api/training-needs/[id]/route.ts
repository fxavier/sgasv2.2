import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET a specific training need by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const trainingNeed = await db.trainingNeeds.findUnique({
      where: {
        id,
      },
      include: {
        department: true,
        subproject: true,
      },
    });

    if (!trainingNeed) {
      return NextResponse.json(
        { error: 'Training need not found' },
        { status: 404 }
      );
    }

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

    return NextResponse.json(formattedNeed);
  } catch (error) {
    console.error('Error fetching training need:', error);
    return NextResponse.json(
      { error: 'Failed to fetch training need' },
      { status: 500 }
    );
  }
}

// PUT update a training need
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
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

    // Check if the training need exists
    const existingNeed = await db.trainingNeeds.findUnique({
      where: {
        id,
      },
    });

    if (!existingNeed) {
      return NextResponse.json(
        { error: 'Training need not found' },
        { status: 404 }
      );
    }

    // Update the training need
    const trainingNeed = await db.trainingNeeds.update({
      where: {
        id,
      },
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

    return NextResponse.json(formattedNeed);
  } catch (error) {
    console.error('Error updating training need:', error);
    return NextResponse.json(
      { error: 'Failed to update training need' },
      { status: 500 }
    );
  }
}

// DELETE a training need
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Check if the training need exists
    const existingNeed = await db.trainingNeeds.findUnique({
      where: {
        id,
      },
    });

    if (!existingNeed) {
      return NextResponse.json(
        { error: 'Training need not found' },
        { status: 404 }
      );
    }

    // Delete the training need
    await db.trainingNeeds.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting training need:', error);
    return NextResponse.json(
      { error: 'Failed to delete training need' },
      { status: 500 }
    );
  }
}
