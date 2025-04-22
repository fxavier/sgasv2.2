import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET all departments
export async function GET() {
  try {
    const departments = await db.department.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(departments);
  } catch (error) {
    console.error('Error fetching departments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch departments' },
      { status: 500 }
    );
  }
}

// POST create a new department
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, description } = body;

    if (!name || !description) {
      return NextResponse.json(
        { error: 'Name and description are required' },
        { status: 400 }
      );
    }

    const department = await db.department.create({
      data: {
        name,
        description,
      },
    });

    return NextResponse.json(department, { status: 201 });
  } catch (error) {
    console.error('Error creating department:', error);
    return NextResponse.json(
      { error: 'Failed to create department' },
      { status: 500 }
    );
  }
}
