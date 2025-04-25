import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET all claim complain control records
export async function GET() {
  try {
    const claimComplains = await db.claimComplainControl.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Format the response to match frontend expectations
    const formattedClaimComplains = claimComplains.map((claimComplain) => ({
      id: claimComplain.id,
      number: claimComplain.number,
      claim_complain_submitted_by: claimComplain.claimComplainSubmittedBy,
      claim_complain_reception_date:
        claimComplain.claimComplainReceptionDate.toISOString(),
      claim_complain_description: claimComplain.claimComplainDescription,
      treatment_action: claimComplain.treatmentAction,
      claim_complain_responsible_person:
        claimComplain.claimComplainResponsiblePerson,
      claim_complain_deadline:
        claimComplain.claimComplainDeadline.toISOString(),
      claim_complain_status: claimComplain.claimComplainStatus,
      closure_date: claimComplain.closureDate.toISOString(),
      observation: claimComplain.observation,
      created_at: claimComplain.createdAt.toISOString(),
      updated_at: claimComplain.updatedAt.toISOString(),
    }));

    return NextResponse.json(formattedClaimComplains);
  } catch (error) {
    console.error('Error fetching claim complain control records:', error);
    return NextResponse.json(
      { error: 'Failed to fetch claim complain control records' },
      { status: 500 }
    );
  }
}

// POST create a new claim complain control record
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      number,
      claim_complain_submitted_by,
      claim_complain_reception_date,
      claim_complain_description,
      treatment_action,
      claim_complain_responsible_person,
      claim_complain_deadline,
      claim_complain_status,
      closure_date,
      observation,
    } = body;

    // Validate required fields
    if (
      !number ||
      !claim_complain_submitted_by ||
      !claim_complain_reception_date ||
      !claim_complain_description ||
      !treatment_action ||
      !claim_complain_responsible_person ||
      !claim_complain_deadline ||
      !closure_date
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if a claim complain with the same number already exists
    const existingClaimComplain = await db.claimComplainControl.findUnique({
      where: {
        number,
      },
    });

    if (existingClaimComplain) {
      return NextResponse.json(
        {
          error:
            'A claim complain control record with this number already exists',
        },
        { status: 400 }
      );
    }

    // Create the claim complain control record
    const claimComplain = await db.claimComplainControl.create({
      data: {
        number,
        claimComplainSubmittedBy: claim_complain_submitted_by,
        claimComplainReceptionDate: new Date(claim_complain_reception_date),
        claimComplainDescription: claim_complain_description,
        treatmentAction: treatment_action,
        claimComplainResponsiblePerson: claim_complain_responsible_person,
        claimComplainDeadline: new Date(claim_complain_deadline),
        claimComplainStatus: claim_complain_status || 'PENDING',
        closureDate: new Date(closure_date),
        observation: observation || '',
      },
    });

    // Format the response to match frontend expectations
    const formattedClaimComplain = {
      id: claimComplain.id,
      number: claimComplain.number,
      claim_complain_submitted_by: claimComplain.claimComplainSubmittedBy,
      claim_complain_reception_date:
        claimComplain.claimComplainReceptionDate.toISOString(),
      claim_complain_description: claimComplain.claimComplainDescription,
      treatment_action: claimComplain.treatmentAction,
      claim_complain_responsible_person:
        claimComplain.claimComplainResponsiblePerson,
      claim_complain_deadline:
        claimComplain.claimComplainDeadline.toISOString(),
      claim_complain_status: claimComplain.claimComplainStatus,
      closure_date: claimComplain.closureDate.toISOString(),
      observation: claimComplain.observation,
      created_at: claimComplain.createdAt.toISOString(),
      updated_at: claimComplain.updatedAt.toISOString(),
    };

    return NextResponse.json(formattedClaimComplain, { status: 201 });
  } catch (error) {
    console.error('Error creating claim complain control record:', error);
    return NextResponse.json(
      { error: 'Failed to create claim complain control record' },
      { status: 500 }
    );
  }
}
