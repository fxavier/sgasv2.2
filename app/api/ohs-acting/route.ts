import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET all OHS acting entries
export async function GET() {
  try {
    const ohsActingEntries = await db.oHSACTING.findMany({
      include: {
        acceptanceConfirmation: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Format the response to match frontend expectations
    const formattedEntries = ohsActingEntries.map((entry) => ({
      id: entry.id,
      fullname: entry.fullname,
      designation: entry.designation,
      terms_of_office_from: entry.termsOfOfficeFrom,
      terms_of_office_to: entry.termsOfOfficeTo,
      acceptance_confirmation: entry.acceptanceConfirmation.map((conf) => ({
        id: conf.id,
        description: conf.description,
      })),
      date: entry.date.toISOString(),
      created_at: entry.createdAt.toISOString(),
      updated_at: entry.updatedAt.toISOString(),
    }));

    return NextResponse.json(formattedEntries);
  } catch (error) {
    console.error('Error fetching OHS acting entries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch OHS acting entries' },
      { status: 500 }
    );
  }
}

// POST create a new OHS acting entry
export async function POST(request: Request) {
  try {
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

    // Create the OHS acting entry
    const ohsActing = await db.oHSACTING.create({
      data: {
        fullname,
        designation,
        termsOfOfficeFrom: terms_of_office_from,
        termsOfOfficeTo: terms_of_office_to,
        date: date ? new Date(date) : new Date(),
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

    return NextResponse.json(formattedEntry, { status: 201 });
  } catch (error) {
    console.error('Error creating OHS acting entry:', error);
    return NextResponse.json(
      { error: 'Failed to create OHS acting entry' },
      { status: 500 }
    );
  }
}
