import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET all training matrix entries
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const positionId = searchParams.get('positionId');
    const trainingId = searchParams.get('trainingId');

    let whereClause = {};

    if (positionId) {
      whereClause = {
        ...whereClause,
        positionId,
      };
    }

    if (trainingId) {
      whereClause = {
        ...whereClause,
        trainingId,
      };
    }

    const trainingMatrix = await db.trainingMatrix.findMany({
      where: whereClause,
      include: {
        position: true,
        training: true,
        toolboxTalks: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Format the response to match frontend expectations
    const formattedMatrix = trainingMatrix.map((entry) => ({
      id: entry.id,
      date: entry.date ? entry.date.toISOString() : null,
      position: {
        id: entry.position.id,
        name: entry.position.name,
      },
      training: {
        id: entry.training.id,
        name: entry.training.name,
      },
      toolbox_talks: {
        id: entry.toolboxTalks.id,
        name: entry.toolboxTalks.name,
      },
      effectiveness: entry.effectiveness,
      actions_training_not_effective: entry.actionsTrainingNotEffective,
      approved_by: entry.approvedBy,
      created_at: entry.createdAt.toISOString(),
      updated_at: entry.updatedAt.toISOString(),
    }));

    return NextResponse.json(formattedMatrix);
  } catch (error) {
    console.error('Error fetching training matrix:', error);
    return NextResponse.json(
      { error: 'Failed to fetch training matrix' },
      { status: 500 }
    );
  }
}

// POST create a new training matrix entry
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      date,
      position,
      training,
      toolbox_talks,
      effectiveness,
      actions_training_not_effective,
      approved_by,
    } = body;

    // Validate required fields
    if (
      !position ||
      !training ||
      !toolbox_talks ||
      !effectiveness ||
      !approved_by
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if position exists, create if not
    let positionRecord = await db.position.findUnique({
      where: {
        id: position.id,
      },
    });

    if (!positionRecord) {
      positionRecord = await db.position.create({
        data: {
          id: position.id,
          name: position.name,
        },
      });
    }

    // Check if training exists, create if not
    let trainingRecord = await db.training.findUnique({
      where: {
        id: training.id,
      },
    });

    if (!trainingRecord) {
      trainingRecord = await db.training.create({
        data: {
          id: training.id,
          name: training.name,
        },
      });
    }

    // Check if toolbox talk exists, create if not
    let toolboxRecord = await db.toolBoxTalks.findUnique({
      where: {
        id: toolbox_talks.id,
      },
    });

    if (!toolboxRecord) {
      toolboxRecord = await db.toolBoxTalks.create({
        data: {
          id: toolbox_talks.id,
          name: toolbox_talks.name,
        },
      });
    }

    // Create the training matrix entry
    const matrixEntry = await db.trainingMatrix.create({
      data: {
        date: date ? new Date(date) : null,
        positionId: positionRecord.id,
        trainingId: trainingRecord.id,
        toolboxTalksId: toolboxRecord.id,
        effectiveness: effectiveness,
        actionsTrainingNotEffective: actions_training_not_effective,
        approvedBy: approved_by,
      },
      include: {
        position: true,
        training: true,
        toolboxTalks: true,
      },
    });

    // Format the response to match frontend expectations
    const formattedEntry = {
      id: matrixEntry.id,
      date: matrixEntry.date ? matrixEntry.date.toISOString() : null,
      position: {
        id: matrixEntry.position.id,
        name: matrixEntry.position.name,
      },
      training: {
        id: matrixEntry.training.id,
        name: matrixEntry.training.name,
      },
      toolbox_talks: {
        id: matrixEntry.toolboxTalks.id,
        name: matrixEntry.toolboxTalks.name,
      },
      effectiveness: matrixEntry.effectiveness,
      actions_training_not_effective: matrixEntry.actionsTrainingNotEffective,
      approved_by: matrixEntry.approvedBy,
      created_at: matrixEntry.createdAt.toISOString(),
      updated_at: matrixEntry.updatedAt.toISOString(),
    };

    return NextResponse.json(formattedEntry, { status: 201 });
  } catch (error) {
    console.error('Error creating training matrix entry:', error);
    return NextResponse.json(
      { error: 'Failed to create training matrix entry' },
      { status: 500 }
    );
  }
}
