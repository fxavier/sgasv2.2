import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET a specific responsible person by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const responsiblePerson = await db.responsibleForFillingForm.findUnique({
      where: {
        id,
      },
    });

    if (!responsiblePerson) {
      return NextResponse.json(
        { error: 'Responsible person not found' },
        { status: 404 }
      );
    }

    // Format the response to match frontend expectations
    const formattedResponsiblePerson = {
      id: responsiblePerson.id,
      name: responsiblePerson.name,
      role: responsiblePerson.role,
      contact: responsiblePerson.contact,
      date: responsiblePerson.date.toISOString(),
      signature: responsiblePerson.signature,
      created_at: responsiblePerson.createdAt.toISOString(),
      updated_at: responsiblePerson.updatedAt.toISOString(),
    };

    return NextResponse.json(formattedResponsiblePerson);
  } catch (error) {
    console.error('Error fetching responsible person:', error);
    return NextResponse.json(
      { error: 'Failed to fetch responsible person' },
      { status: 500 }
    );
  }
}

// PUT update a responsible person
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();

    const { name, role, contact, date, signature } = body;

    if (!name || !role || !contact || !date) {
      return NextResponse.json(
        { error: 'Name, role, contact, and date are required' },
        { status: 400 }
      );
    }

    const responsiblePerson = await db.responsibleForFillingForm.update({
      where: {
        id,
      },
      data: {
        name,
        role,
        contact,
        date: new Date(date),
        signature,
      },
    });

    // Format the response to match frontend expectations
    const formattedResponsiblePerson = {
      id: responsiblePerson.id,
      name: responsiblePerson.name,
      role: responsiblePerson.role,
      contact: responsiblePerson.contact,
      date: responsiblePerson.date.toISOString(),
      signature: responsiblePerson.signature,
      created_at: responsiblePerson.createdAt.toISOString(),
      updated_at: responsiblePerson.updatedAt.toISOString(),
    };

    return NextResponse.json(formattedResponsiblePerson);
  } catch (error) {
    console.error('Error updating responsible person:', error);
    return NextResponse.json(
      { error: 'Failed to update responsible person' },
      { status: 500 }
    );
  }
}

// DELETE a responsible person
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Check if there are any screenings using this responsible person
    const screeningsUsingResponsible =
      await db.environmentalSocialScreening.count({
        where: {
          responsibleForFillingFormId: id,
        },
      });

    if (screeningsUsingResponsible > 0) {
      return NextResponse.json(
        {
          error:
            'Cannot delete responsible person that is in use by screening forms',
        },
        { status: 400 }
      );
    }

    await db.responsibleForFillingForm.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting responsible person:', error);
    return NextResponse.json(
      { error: 'Failed to delete responsible person' },
      { status: 500 }
    );
  }
}
