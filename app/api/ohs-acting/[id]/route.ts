import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET a specific OHS acting entry by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const ohsActing = await db.oHSACTING.findUnique({
      where: {
        id,
      },
      include: {
        acceptanceConfirmation: true,
      },
    });

    if (!ohsActing) {
      return NextResponse.json(
        { error: 'OHS acting entry not found' },
        { status: 404 }
      );
    }

    // Format the response to match frontend expectations
    const formattedEntry = {
      id: ohsActing.id,
      fullname: ohsActing.fullname,
      designation: ohsActing.designation,
      terms_of_office_from: ohsActing.termsOfOfficeFrom,
      terms_of_office_to: ohsActing.termsOfOfficeTo,
      acceptance_confirmation: ohsActing.acceptanceConfirmation.map((conf) => ({
        id: conf.id,
        description: conf.description,
      })),
      date: ohsActing.date.toISOString(),
      created_at: ohsActing.createdAt.toISOString(),
      updated_at: ohsActing.updatedAt.toISOString(),
    };

    return NextResponse.json(formattedEntry);
  } catch (error) {
    console.error('Error fetching OHS acting entry:', error);
    return NextResponse.json(
      { error: 'Failed to fetch OHS acting entry' },
      { status: 500 }
    );
  }
}

// PUT update an OHS acting entry
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();

    const {
      fullname,
      designation,
      terms_of_office_from,
      terms_of_office_to,
      acceptance_confirmation,
      date,
    } = body;

    if (!fullname) {
      return NextResponse.json(
        { error: 'Full name is required' },
        { status: 400 }
      );
    }

    // Check if the OHS acting entry exists
    const existingEntry = await db.oHSACTING.findUnique({
      where: {
        id,
      },
    });

    if (!existingEntry) {
      return NextResponse.json(
        { error: 'OHS acting entry not found' },
        { status: 404 }
      );
    }

    // Check if acceptance confirmations exist
    if (acceptance_confirmation && acceptance_confirmation.length > 0) {
      for (const conf of acceptance_confirmation) {
        const existingConf = await db.acceptanceConfirmation.findUnique({
          where: { id: conf.id },
        });

        if (!existingConf) {
          return NextResponse.json(
            { error: `Acceptance confirmation with ID ${conf.id} not found` },
            { status: 404 }
          );
        }
      }
    }

    // First, disconnect all existing acceptance confirmations
    await db.oHSACTING.update({
      where: { id },
      data: {
        acceptanceConfirmation: {
          set: [], // Disconnect all existing connections
        },
      },
    });

    // Then update the OHS acting entry with new data
    const ohsActing = await db.oHSACTING.update({
      where: {
        id,
      },
      data: {
        fullname,
        designation,
        termsOfOfficeFrom: terms_of_office_from,
        termsOfOfficeTo: terms_of_office_to,
        date: date ? new Date(date) : existingEntry.date,
        acceptanceConfirmation: {
          connect: acceptance_confirmation
            ? acceptance_confirmation.map((conf: { id: string }) => ({
                id: conf.id,
              }))
            : [],
        },
      },
      include: {
        acceptanceConfirmation: true,
      },
    });

    // Format the response to match frontend expectations
    const formattedEntry = {
      id: ohsActing.id,
      fullname: ohsActing.fullname,
      designation: ohsActing.designation,
      terms_of_office_from: ohsActing.termsOfOfficeFrom,
      terms_of_office_to: ohsActing.termsOfOfficeTo,
      acceptance_confirmation: ohsActing.acceptanceConfirmation.map((conf) => ({
        id: conf.id,
        description: conf.description,
      })),
      date: ohsActing.date.toISOString(),
      created_at: ohsActing.createdAt.toISOString(),
      updated_at: ohsActing.updatedAt.toISOString(),
    };

    return NextResponse.json(formattedEntry);
  } catch (error) {
    console.error('Error updating OHS acting entry:', error);
    return NextResponse.json(
      { error: 'Failed to update OHS acting entry' },
      { status: 500 }
    );
  }
}

// DELETE an OHS acting entry
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Check if the OHS acting entry exists
    const existingEntry = await db.oHSACTING.findUnique({
      where: {
        id,
      },
    });

    if (!existingEntry) {
      return NextResponse.json(
        { error: 'OHS acting entry not found' },
        { status: 404 }
      );
    }

    // First, disconnect all acceptance confirmations
    await db.oHSACTING.update({
      where: { id },
      data: {
        acceptanceConfirmation: {
          set: [], // Disconnect all existing connections
        },
      },
    });

    // Then delete the OHS acting entry
    await db.oHSACTING.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting OHS acting entry:', error);
    return NextResponse.json(
      { error: 'Failed to delete OHS acting entry' },
      { status: 500 }
    );
  }
}
