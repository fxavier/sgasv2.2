import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET a specific claim complain control record by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const claimComplain = await db.claimComplainControl.findUnique({
      where: {
        id,
      },
    });

    if (!claimComplain) {
      return NextResponse.json(
        { error: 'Claim complain control record not found' },
        { status: 404 }
      );
    }

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

    return NextResponse.json(formattedClaimComplain);
  } catch (error) {
    console.error('Error fetching claim complain control record:', error);
    return NextResponse.json(
      { error: 'Failed to fetch claim complain control record' },
      { status: 500 }
    );
  }
}

// PUT update a claim complain control record
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
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

    // Check if the claim complain control record exists
    const existingClaimComplain = await db.claimComplainControl.findUnique({
      where: {
        id,
      },
    });

    if (!existingClaimComplain) {
      return NextResponse.json(
        { error: 'Claim complain control record not found' },
        { status: 404 }
      );
    }

    // Check if the number is being changed and if it already exists
    if (number !== existingClaimComplain.number) {
      const numberExists = await db.claimComplainControl.findUnique({
        where: {
          number,
        },
      });

      if (numberExists) {
        return NextResponse.json(
          {
            error:
              'A claim complain control record with this number already exists',
          },
          { status: 400 }
        );
      }
    }

    // Update the claim complain control record
    const claimComplain = await db.claimComplainControl.update({
      where: {
        id,
      },
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

    return NextResponse.json(formattedClaimComplain);
  } catch (error) {
    console.error('Error updating claim complain control record:', error);
    return NextResponse.json(
      { error: 'Failed to update claim complain control record' },
      { status: 500 }
    );
  }
}

// DELETE a claim complain control record
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Check if the claim complain control record exists
    const existingClaimComplain = await db.claimComplainControl.findUnique({
      where: {
        id,
      },
    });

    if (!existingClaimComplain) {
      return NextResponse.json(
        { error: 'Claim complain control record not found' },
        { status: 404 }
      );
    }

    // Delete the claim complain control record
    await db.claimComplainControl.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting claim complain control record:', error);
    return NextResponse.json(
      { error: 'Failed to delete claim complain control record' },
      { status: 500 }
    );
  }
}
