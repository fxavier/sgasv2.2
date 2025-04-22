import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET a specific department by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const department = await db.department.findUnique({
      where: {
        id,
      },
    });

    if (!department) {
      return NextResponse.json(
        { error: 'Department not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(department);
  } catch (error) {
    console.error('Error fetching department:', error);
    return NextResponse.json(
      { error: 'Failed to fetch department' },
      { status: 500 }
    );
  }
}

// PUT update a department
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();

    const { name, description } = body;

    if (!name || !description) {
      return NextResponse.json(
        { error: 'Name and description are required' },
        { status: 400 }
      );
    }

    const department = await db.department.update({
      where: {
        id,
      },
      data: {
        name,
        description,
      },
    });

    return NextResponse.json(department);
  } catch (error) {
    console.error('Error updating department:', error);
    return NextResponse.json(
      { error: 'Failed to update department' },
      { status: 500 }
    );
  }
}

// DELETE a department
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Check if there are any references to this department
    const assessmentsUsingDepartment =
      await db.environAndSocialRiskAndImapactAssessement.count({
        where: {
          departmentId: id,
        },
      });

    if (assessmentsUsingDepartment > 0) {
      return NextResponse.json(
        {
          error:
            'Cannot delete department that is in use by impact assessments',
        },
        { status: 400 }
      );
    }

    await db.department.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting department:', error);
    return NextResponse.json(
      { error: 'Failed to delete department' },
      { status: 500 }
    );
  }
}
