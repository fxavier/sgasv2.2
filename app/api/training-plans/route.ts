import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET all training plans
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year');
    const trainingArea = searchParams.get('trainingArea');

    let whereClause = {};

    if (year) {
      whereClause = {
        ...whereClause,
        year: parseInt(year),
      };
    }

    if (trainingArea) {
      whereClause = {
        ...whereClause,
        trainingArea: {
          contains: trainingArea,
          mode: 'insensitive',
        },
      };
    }

    const trainingPlans = await db.trainingPlan.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Format the response to match frontend expectations
    const formattedPlans = trainingPlans.map((plan) => ({
      id: plan.id,
      updated_by: plan.updatedBy,
      date: plan.date.toISOString(),
      year: plan.year,
      training_area: plan.trainingArea,
      training_title: plan.trainingTitle,
      training_objective: plan.trainingObjective,
      training_type: plan.trainingType,
      training_entity: plan.trainingEntity,
      duration: plan.duration,
      number_of_trainees: plan.numberOfTrainees,
      training_recipients: plan.trainingRecipients,
      training_month: plan.trainingMonth,
      training_status: plan.trainingStatus,
      observations: plan.observations,
      created_at: plan.createdAt.toISOString(),
      updated_at: plan.updatedAt.toISOString(),
    }));

    return NextResponse.json(formattedPlans);
  } catch (error) {
    console.error('Error fetching training plans:', error);
    return NextResponse.json(
      { error: 'Failed to fetch training plans' },
      { status: 500 }
    );
  }
}

// POST create a new training plan
export async function POST(request: Request) {
  try {
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

    // Create the training plan
    const trainingPlan = await db.trainingPlan.create({
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

    return NextResponse.json(formattedPlan, { status: 201 });
  } catch (error) {
    console.error('Error creating training plan:', error);
    return NextResponse.json(
      { error: 'Failed to create training plan' },
      { status: 500 }
    );
  }
}
