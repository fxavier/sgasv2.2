import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET a specific training evaluation question by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const question = await db.trainingEvaluationQuestions.findUnique({
      where: {
        id,
      },
    });

    if (!question) {
      return NextResponse.json(
        { error: 'Training evaluation question not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(question);
  } catch (error) {
    console.error('Error fetching training evaluation question:', error);
    return NextResponse.json(
      { error: 'Failed to fetch training evaluation question' },
      { status: 500 }
    );
  }
}

// PUT update a training evaluation question
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();

    const { question } = body;

    if (!question) {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      );
    }

    const updatedQuestion = await db.trainingEvaluationQuestions.update({
      where: {
        id,
      },
      data: {
        question,
      },
    });

    return NextResponse.json(updatedQuestion);
  } catch (error) {
    console.error('Error updating training evaluation question:', error);
    return NextResponse.json(
      { error: 'Failed to update training evaluation question' },
      { status: 500 }
    );
  }
}

// DELETE a training evaluation question
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Check if there are any assessments using this question
    const assessmentsUsingQuestion =
      await db.trainingEffectivnessAssessment.count({
        where: {
          trainingEvaluationQuestionId: id,
        },
      });

    if (assessmentsUsingQuestion > 0) {
      return NextResponse.json(
        { error: 'Cannot delete question that is in use by assessments' },
        { status: 400 }
      );
    }

    await db.trainingEvaluationQuestions.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting training evaluation question:', error);
    return NextResponse.json(
      { error: 'Failed to delete training evaluation question' },
      { status: 500 }
    );
  }
}
