import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET all legal requirements
export async function GET() {
  try {
    const legalRequirements = await db.legalRequirementControl.findMany({
      orderBy: {
        number: 'asc',
      },
    });

    // Format the response to match frontend expectations
    const formattedRequirements = legalRequirements.map((req) => ({
      id: req.id,
      number: req.number,
      document_title: req.documentTitle,
      effective_date: req.effectiveDate.toISOString(),
      description: req.description,
      status: req.status.toLowerCase(),
      amended_description: req.amendedDescription,
      observation: req.observation,
      law_file: req.lawFile,
      created_at: req.createdAt.toISOString(),
      updated_at: req.updatedAt.toISOString(),
    }));

    return NextResponse.json(formattedRequirements);
  } catch (error) {
    console.error('Error fetching legal requirements:', error);
    return NextResponse.json(
      { error: 'Failed to fetch legal requirements' },
      { status: 500 }
    );
  }
}

// POST create a new legal requirement
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      number,
      documentTitle,
      effectiveDate,
      description,
      status,
      amendedDescription,
      observation,
      lawFile,
    } = body;

    if (
      !number ||
      !documentTitle ||
      !effectiveDate ||
      !description ||
      !status
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Map status string to enum
    let statusEnum;
    switch (status.toUpperCase()) {
      case 'ACTIVE':
        statusEnum = 'ACTIVE';
        break;
      case 'REVOKED':
        statusEnum = 'REVOKED';
        break;
      case 'AMENDED':
        statusEnum = 'AMENDED';
        break;
      default:
        statusEnum = 'ACTIVE';
    }

    const legalRequirement = await db.legalRequirementControl.create({
      data: {
        number,
        documentTitle,
        effectiveDate: new Date(effectiveDate),
        description,
        status: statusEnum as any,
        amendedDescription,
        observation,
        lawFile,
      },
    });

    // Format the response to match frontend expectations
    const formattedRequirement = {
      id: legalRequirement.id,
      number: legalRequirement.number,
      document_title: legalRequirement.documentTitle,
      effective_date: legalRequirement.effectiveDate.toISOString(),
      description: legalRequirement.description,
      status: legalRequirement.status.toLowerCase(),
      amended_description: legalRequirement.amendedDescription,
      observation: legalRequirement.observation,
      law_file: legalRequirement.lawFile,
      created_at: legalRequirement.createdAt.toISOString(),
      updated_at: legalRequirement.updatedAt.toISOString(),
    };

    return NextResponse.json(formattedRequirement, { status: 201 });
  } catch (error) {
    console.error('Error creating legal requirement:', error);
    return NextResponse.json(
      { error: 'Failed to create legal requirement' },
      { status: 500 }
    );
  }
}
