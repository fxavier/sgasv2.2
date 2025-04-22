import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET a specific training effectiveness assessment by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const assessment = await db.trainingEffectivnessAssessment.findUnique({
      where: {
        id,
      },
      include: {
        department: true,
        subproject: true,
        trainingEvaluationQuestion: true,
      },
    });

    if (!assessment) {
      return NextResponse.json(
        { error: 'Training effectiveness assessment not found' },
        { status: 404 }
      );
    }

    // Format the response to match frontend expectations
    const formattedAssessment = {
      id: assessment.id,
      training: assessment.training,
      date: assessment.date.toISOString(),
      department: assessment.department
        ? {
            id: assessment.department.id,
            name: assessment.department.name,
          }
        : null,
      subproject: assessment.subproject
        ? {
            id: assessment.subproject.id,
            name: assessment.subproject.name,
          }
        : null,
      trainee: assessment.trainee,
      immediate_supervisor: assessment.immediateSupervisor,
      training_evaluation_question: {
        id: assessment.trainingEvaluationQuestion.id,
        question: assessment.trainingEvaluationQuestion.question,
      },
      answer: assessment.answer,
      human_resource_evaluation: assessment.humanResourceEvaluation,
      created_at: assessment.createdAt.toISOString(),
      updated_at: assessment.updatedAt.toISOString(),
    };

    return NextResponse.json(formattedAssessment);
  } catch (error) {
    console.error('Error fetching training effectiveness assessment:', error);
    return NextResponse.json(
      { error: 'Failed to fetch training effectiveness assessment' },
      { status: 500 }
    );
  }
}

// PUT update a training effectiveness assessment
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();

    const {
      training,
      date,
      department,
      subproject,
      trainee,
      immediate_supervisor,
      training_evaluation_question,
      answer,
      human_resource_evaluation,
    } = body;

    // Validate required fields
    if (
      !training ||
      !date ||
      !trainee ||
      !immediate_supervisor ||
      !training_evaluation_question ||
      !answer ||
      !human_resource_evaluation
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if the assessment exists
    const existingAssessment =
      await db.trainingEffectivnessAssessment.findUnique({
        where: {
          id,
        },
      });

    if (!existingAssessment) {
      return NextResponse.json(
        { error: 'Training effectiveness assessment not found' },
        { status: 404 }
      );
    }

    // Check if training evaluation question exists, create if not
    let questionId = training_evaluation_question.id;
    const existingQuestion = await db.trainingEvaluationQuestions.findUnique({
      where: { id: questionId },
    });

    if (!existingQuestion) {
      // Create the question
      const newQuestion = await db.trainingEvaluationQuestions.create({
        data: {
          id: questionId,
          question: training_evaluation_question.question,
        },
      });
      questionId = newQuestion.id;
    }

    // Update the assessment
    const assessment = await db.trainingEffectivnessAssessment.update({
      where: {
        id,
      },
      data: {
        training,
        date: new Date(date),
        departmentId: department?.id,
        subprojectId: subproject?.id,
        trainee,
        immediateSupervisor: immediate_supervisor,
        trainingEvaluationQuestionId: questionId,
        answer,
        humanResourceEvaluation: human_resource_evaluation,
      },
      include: {
        department: true,
        subproject: true,
        trainingEvaluationQuestion: true,
      },
    });

    // Format the response to match frontend expectations
    const formattedAssessment = {
      id: assessment.id,
      training: assessment.training,
      date: assessment.date.toISOString(),
      department: assessment.department
        ? {
            id: assessment.department.id,
            name: assessment.department.name,
          }
        : null,
      subproject: assessment.subproject
        ? {
            id: assessment.subproject.id,
            name: assessment.subproject.name,
          }
        : null,
      trainee: assessment.trainee,
      immediate_supervisor: assessment.immediateSupervisor,
      training_evaluation_question: {
        id: assessment.trainingEvaluationQuestion.id,
        question: assessment.trainingEvaluationQuestion.question,
      },
      answer: assessment.answer,
      human_resource_evaluation: assessment.humanResourceEvaluation,
      created_at: assessment.createdAt.toISOString(),
      updated_at: assessment.updatedAt.toISOString(),
    };

    return NextResponse.json(formattedAssessment);
  } catch (error) {
    console.error('Error updating training effectiveness assessment:', error);
    return NextResponse.json(
      { error: 'Failed to update training effectiveness assessment' },
      { status: 500 }
    );
  }
}

// DELETE a training effectiveness assessment
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Check if the assessment exists
    const existingAssessment =
      await db.trainingEffectivnessAssessment.findUnique({
        where: {
          id,
        },
      });

    if (!existingAssessment) {
      return NextResponse.json(
        { error: 'Training effectiveness assessment not found' },
        { status: 404 }
      );
    }

    // Delete the assessment
    await db.trainingEffectivnessAssessment.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting training effectiveness assessment:', error);
    return NextResponse.json(
      { error: 'Failed to delete training effectiveness assessment' },
      { status: 500 }
    );
  }
}
