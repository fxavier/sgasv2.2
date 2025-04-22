import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET all training evaluation questions
export async function GET() {
  try {
    const questions = await db.trainingEvaluationQuestions.findMany({
      orderBy: {
        question: 'asc',
      },
    });

    // Format the response to match frontend expectations
    const formattedQuestions = questions.map((question) => ({
      id: question.id,
      question: question.question,
    }));

    return NextResponse.json(formattedQuestions);
  } catch (error) {
    console.error('Error fetching training evaluation questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch training evaluation questions' },
      { status: 500 }
    );
  }
}

// POST create a new training evaluation question
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { question } = body;

    if (!question) {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      );
    }

    const newQuestion = await db.trainingEvaluationQuestions.create({
      data: {
        question,
      },
    });

    return NextResponse.json(newQuestion, { status: 201 });
  } catch (error) {
    console.error('Error creating training evaluation question:', error);
    return NextResponse.json(
      { error: 'Failed to create training evaluation question' },
      { status: 500 }
    );
  }
}
