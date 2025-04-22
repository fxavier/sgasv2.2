import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET a specific responsible verification by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const responsibleVerification =
      await db.responsibleForVerification.findUnique({
        where: {
          id,
        },
        include: {
          contactPerson: true,
        },
      });

    if (!responsibleVerification) {
      return NextResponse.json(
        { error: 'Responsible verification not found' },
        { status: 404 }
      );
    }

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

    return NextResponse.json(formattedVerification);
  } catch (error) {
    console.error('Error fetching responsible verification:', error);
    return NextResponse.json(
      { error: 'Failed to fetch responsible verification' },
      { status: 500 }
    );
  }
}

// DELETE a responsible verification
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Check if the verification exists
    const verification = await db.responsibleForVerification.findUnique({
      where: {
        id,
      },
    });

    if (!verification) {
      return NextResponse.json(
        { error: 'Responsible verification not found' },
        { status: 404 }
      );
    }

    // Delete the verification
    await db.responsibleForVerification.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting responsible verification:', error);
    return NextResponse.json(
      { error: 'Failed to delete responsible verification' },
      { status: 500 }
    );
  }
}
