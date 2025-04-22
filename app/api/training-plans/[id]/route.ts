import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET a specific training plan by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const trainingPlan = await db.trainingPlan.findUnique({
      where: {
        id,
      },
    });

    if (!trainingPlan) {
      return NextResponse.json(
        { error: 'Training plan not found' },
        { status: 404 }
      );
    }

    // Format the response to match frontend expectations
    const formattedPlan = {
      id: trainingPlan.id,
      updated_by: trainingPlan.updatedBy,
      date: trainingPlan.date.toISOString(),
      year: trainingPlan.year,
      training_area: trainingPlan.trainingArea,
      training_title: trainingPlan.trainingTitle,
      training_objective: trainingPlan.trainingObjective,
      training_type: trainingPlan.trainingType,
      training_entity: trainingPlan.trainingEntity,
      duration: trainingPlan.duration,
      number_of_trainees: trainingPlan.numberOfTrainees,
      training_recipients: trainingPlan.trainingRecipients,
      training_month: trainingPlan.trainingMonth,
      training_status: trainingPlan.trainingStatus,
      observations: trainingPlan.observations,
      created_at: trainingPlan.createdAt.toISOString(),
      updated_at: trainingPlan.updatedAt.toISOString(),
    };

    return NextResponse.json(formattedPlan);
  } catch (error) {
    console.error('Error fetching training plan:', error);
    return NextResponse.json(
      { error: 'Failed to fetch training plan' },
      { status: 500 }
    );
  }
}

// PUT update a training plan
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();

    const {
      updated_by,
      date,
      year,
      training_area,
      training_title,
      training_objective,
      training_type,
      training_entity,
      duration,
      number_of_trainees,
      training_recipients,
      training_month,
      training_status,
      observations,
    } = body;

    // Validate required fields
    if (
      !updated_by ||
      !date ||
      !year ||
      !training_area ||
      !training_title ||
      !training_objective ||
      !training_type ||
      !training_entity ||
      !duration ||
      !number_of_trainees ||
      !training_recipients ||
      !training_month ||
      !training_status
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if the training plan exists
    const existingPlan = await db.trainingPlan.findUnique({
      where: {
        id,
      },
    });

    if (!existingPlan) {
      return NextResponse.json(
        { error: 'Training plan not found' },
        { status: 404 }
      );
    }

    // Update the training plan
    const trainingPlan = await db.trainingPlan.update({
      where: {
        id,
      },
      data: {
        updatedBy: updated_by,
        date: new Date(date),
        year,
        trainingArea: training_area,
        trainingTitle: training_title,
        trainingObjective: training_objective,
        trainingType: training_type,
        trainingEntity: training_entity,
        duration,
        numberOfTrainees: number_of_trainees,
        trainingRecipients: training_recipients,
        trainingMonth: training_month,
        trainingStatus: training_status,
        observations: observations || '',
      },
    });

    // Format the response to match frontend expectations
    const formattedPlan = {
      id: trainingPlan.id,
      updated_by: trainingPlan.updatedBy,
      date: trainingPlan.date.toISOString(),
      year: trainingPlan.year,
      training_area: trainingPlan.trainingArea,
      training_title: trainingPlan.trainingTitle,
      training_objective: trainingPlan.trainingObjective,
      training_type: trainingPlan.trainingType,
      training_entity: trainingPlan.trainingEntity,
      duration: trainingPlan.duration,
      number_of_trainees: trainingPlan.numberOfTrainees,
      training_recipients: trainingPlan.trainingRecipients,
      training_month: trainingPlan.trainingMonth,
      training_status: trainingPlan.trainingStatus,
      observations: trainingPlan.observations,
      created_at: trainingPlan.createdAt.toISOString(),
      updated_at: trainingPlan.updatedAt.toISOString(),
    };

    return NextResponse.json(formattedPlan);
  } catch (error) {
    console.error('Error updating training plan:', error);
    return NextResponse.json(
      { error: 'Failed to update training plan' },
      { status: 500 }
    );
  }
}

// DELETE a training plan
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Check if the training plan exists
    const existingPlan = await db.trainingPlan.findUnique({
      where: {
        id,
      },
    });

    if (!existingPlan) {
      return NextResponse.json(
        { error: 'Training plan not found' },
        { status: 404 }
      );
    }

    // Delete the training plan
    await db.trainingPlan.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting training plan:', error);
    return NextResponse.json(
      { error: 'Failed to delete training plan' },
      { status: 500 }
    );
  }
}
