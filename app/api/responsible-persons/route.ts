import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET all responsible persons
export async function GET() {
  try {
    const responsiblePersons = await db.responsibleForFillingForm.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    // Format the response to match frontend expectations
    const formattedResponsiblePersons = responsiblePersons.map((person) => ({
      id: person.id,
      name: person.name,
      role: person.role,
      contact: person.contact,
      date: person.date.toISOString(),
      signature: person.signature,
      created_at: person.createdAt.toISOString(),
      updated_at: person.updatedAt.toISOString(),
    }));

    return NextResponse.json(formattedResponsiblePersons);
  } catch (error) {
    console.error('Error fetching responsible persons:', error);
    return NextResponse.json(
      { error: 'Failed to fetch responsible persons' },
      { status: 500 }
    );
  }
}

// POST create a new responsible person
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, role, contact, date, signature } = body;

    if (!name || !role || !contact || !date) {
      return NextResponse.json(
        { error: 'Name, role, contact, and date are required' },
        { status: 400 }
      );
    }

    const responsiblePerson = await db.responsibleForFillingForm.create({
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

    return NextResponse.json(formattedResponsiblePerson, { status: 201 });
  } catch (error) {
    console.error('Error creating responsible person:', error);
    return NextResponse.json(
      { error: 'Failed to create responsible person' },
      { status: 500 }
    );
  }
}
