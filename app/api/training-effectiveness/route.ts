import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET all training effectiveness assessments
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

    const assessments = await db.trainingEffectivnessAssessment.findMany({
      where: whereClause,
      include: {
        department: true,
        subproject: true,
        trainingEvaluationQuestion: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Format the response to match frontend expectations
    const formattedAssessments = assessments.map((assessment) => ({
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
    }));

    return NextResponse.json(formattedAssessments);
  } catch (error) {
    console.error('Error fetching training effectiveness assessments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch training effectiveness assessments' },
      { status: 500 }
    );
  }
}

// POST create a new training effectiveness assessment
export async function POST(request: Request) {
  try {
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

    // Create the assessment
    const assessment = await db.trainingEffectivnessAssessment.create({
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

    return NextResponse.json(formattedAssessment, { status: 201 });
  } catch (error) {
    console.error('Error creating training effectiveness assessment:', error);
    return NextResponse.json(
      { error: 'Failed to create training effectiveness assessment' },
      { status: 500 }
    );
  }
}
