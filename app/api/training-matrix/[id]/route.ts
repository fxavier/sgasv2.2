import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET a specific training matrix entry by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const matrixEntry = await db.trainingMatrix.findUnique({
      where: {
        id,
      },
      include: {
        position: true,
        training: true,
        toolboxTalks: true,
      },
    });

    if (!matrixEntry) {
      return NextResponse.json(
        { error: 'Training matrix entry not found' },
        { status: 404 }
      );
    }

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

    return NextResponse.json(formattedEntry);
  } catch (error) {
    console.error('Error fetching training matrix entry:', error);
    return NextResponse.json(
      { error: 'Failed to fetch training matrix entry' },
      { status: 500 }
    );
  }
}

// PUT update a training matrix entry
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
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

    // Check if the matrix entry exists
    const existingEntry = await db.trainingMatrix.findUnique({
      where: {
        id,
      },
    });

    if (!existingEntry) {
      return NextResponse.json(
        { error: 'Training matrix entry not found' },
        { status: 404 }
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

    // Update the training matrix entry
    const matrixEntry = await db.trainingMatrix.update({
      where: {
        id,
      },
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

    return NextResponse.json(formattedEntry);
  } catch (error) {
    console.error('Error updating training matrix entry:', error);
    return NextResponse.json(
      { error: 'Failed to update training matrix entry' },
      { status: 500 }
    );
  }
}

// DELETE a training matrix entry
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Check if the matrix entry exists
    const existingEntry = await db.trainingMatrix.findUnique({
      where: {
        id,
      },
    });

    if (!existingEntry) {
      return NextResponse.json(
        { error: 'Training matrix entry not found' },
        { status: 404 }
      );
    }

    // Delete the training matrix entry
    await db.trainingMatrix.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting training matrix entry:', error);
    return NextResponse.json(
      { error: 'Failed to delete training matrix entry' },
      { status: 500 }
    );
  }
}
