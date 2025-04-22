import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET all responsible verifications
export async function GET() {
  try {
    const responsibleVerifications =
      await db.responsibleForVerification.findMany({
        include: {
          contactPerson: true,
        },
      });

    // Format the response to match frontend expectations
    const formattedVerifications = responsibleVerifications.map(
      (verification) => ({
        id: verification.id,
        contactPerson: {
          id: verification.contactPerson.id,
          name: verification.contactPerson.name,
          role: verification.contactPerson.role,
          contact: verification.contactPerson.contact,
          date: verification.contactPerson.date.toISOString(),
          signature: verification.contactPerson.signature,
        },
        created_at: verification.contactPerson.createdAt.toISOString(),
        updated_at: verification.contactPerson.updatedAt.toISOString(),
      })
    );

    return NextResponse.json(formattedVerifications);
  } catch (error) {
    console.error('Error fetching responsible verifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch responsible verifications' },
      { status: 500 }
    );
  }
}

// POST create a new responsible verification
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { contactPersonId } = body;

    if (!contactPersonId) {
      return NextResponse.json(
        { error: 'Contact person ID is required' },
        { status: 400 }
      );
    }

    // Check if the contact person exists
    const contactPerson = await db.contactPerson.findUnique({
      where: {
        id: contactPersonId,
      },
    });

    if (!contactPerson) {
      return NextResponse.json(
        { error: 'Contact person not found' },
        { status: 404 }
      );
    }

    // Check if a verification already exists for this contact person
    const existingVerification = await db.responsibleForVerification.findUnique(
      {
        where: {
          contactPersonId,
        },
      }
    );

    if (existingVerification) {
      return NextResponse.json(
        { error: 'A verification already exists for this contact person' },
        { status: 400 }
      );
    }

    const responsibleVerification = await db.responsibleForVerification.create({
      data: {
        contactPersonId,
      },
      include: {
        contactPerson: true,
      },
    });

    // Format the response to match frontend expectations
    const formattedVerification = {
      id: responsibleVerification.id,
      contactPerson: {
        id: responsibleVerification.contactPerson.id,
        name: responsibleVerification.contactPerson.name,
        role: responsibleVerification.contactPerson.role,
        contact: responsibleVerification.contactPerson.contact,
        date: responsibleVerification.contactPerson.date.toISOString(),
        signature: responsibleVerification.contactPerson.signature,
      },
      created_at: responsibleVerification.contactPerson.createdAt.toISOString(),
      updated_at: responsibleVerification.contactPerson.updatedAt.toISOString(),
    };

    return NextResponse.json(formattedVerification, { status: 201 });
  } catch (error) {
    console.error('Error creating responsible verification:', error);
    return NextResponse.json(
      { error: 'Failed to create responsible verification' },
      { status: 500 }
    );
  }
}
