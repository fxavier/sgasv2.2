import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET a specific non-compliance record by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const nonCompliance = await db.claimNonComplianceControl.findUnique({
      where: {
        id,
      },
      include: {
        department: true,
        subproject: true,
      },
    });

    if (!nonCompliance) {
      return NextResponse.json(
        { error: 'Non-compliance record not found' },
        { status: 404 }
      );
    }

    // Format the response to match frontend expectations
    const formattedNonCompliance = {
      id: nonCompliance.id,
      number: nonCompliance.number,
      department: nonCompliance.department
        ? {
            id: nonCompliance.department.id,
            name: nonCompliance.department.name,
          }
        : null,
      subproject: nonCompliance.subproject
        ? {
            id: nonCompliance.subproject.id,
            name: nonCompliance.subproject.name,
          }
        : null,
      non_compliance_description: nonCompliance.nonComplianceDescription,
      identified_causes: nonCompliance.identifiedCauses,
      corrective_actions: nonCompliance.correctiveActions,
      responsible_person: nonCompliance.responsiblePerson,
      deadline: nonCompliance.deadline.toISOString(),
      status: nonCompliance.status,
      effectiveness_evaluation: nonCompliance.effectivenessEvaluation,
      responsible_person_evaluation: nonCompliance.responsiblePersonEvaluation,
      observation: nonCompliance.observation,
      created_at: nonCompliance.createdAt.toISOString(),
      updated_at: nonCompliance.updatedAt.toISOString(),
    };

    return NextResponse.json(formattedNonCompliance);
  } catch (error) {
    console.error('Error fetching non-compliance record:', error);
    return NextResponse.json(
      { error: 'Failed to fetch non-compliance record' },
      { status: 500 }
    );
  }
}

// PUT update a non-compliance record
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();

    const {
      number,
      department,
      subproject,
      non_compliance_description,
      identified_causes,
      corrective_actions,
      responsible_person,
      deadline,
      status,
      effectiveness_evaluation,
      responsible_person_evaluation,
      observation,
    } = body;

    // Validate required fields
    if (
      !number ||
      !non_compliance_description ||
      !identified_causes ||
      !corrective_actions ||
      !responsible_person ||
      !deadline ||
      !responsible_person_evaluation
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if the non-compliance record exists
    const existingNonCompliance = await db.claimNonComplianceControl.findUnique(
      {
        where: {
          id,
        },
      }
    );

    if (!existingNonCompliance) {
      return NextResponse.json(
        { error: 'Non-compliance record not found' },
        { status: 404 }
      );
    }

    // Check if the number is being changed and if it already exists
    if (number !== existingNonCompliance.number) {
      const numberExists = await db.claimNonComplianceControl.findUnique({
        where: {
          number,
        },
      });

      if (numberExists) {
        return NextResponse.json(
          { error: 'A non-compliance record with this number already exists' },
          { status: 400 }
        );
      }
    }

    // Update the non-compliance record
    const nonCompliance = await db.claimNonComplianceControl.update({
      where: {
        id,
      },
      data: {
        number,
        departmentId: department?.id,
        subprojectId: subproject?.id,
        nonComplianceDescription: non_compliance_description,
        identifiedCauses: identified_causes,
        correctiveActions: corrective_actions,
        responsiblePerson: responsible_person,
        deadline: new Date(deadline),
        status,
        effectivenessEvaluation: effectiveness_evaluation,
        responsiblePersonEvaluation: responsible_person_evaluation,
        observation: observation || '',
      },
      include: {
        department: true,
        subproject: true,
      },
    });

    // Format the response to match frontend expectations
    const formattedNonCompliance = {
      id: nonCompliance.id,
      number: nonCompliance.number,
      department: nonCompliance.department
        ? {
            id: nonCompliance.department.id,
            name: nonCompliance.department.name,
          }
        : null,
      subproject: nonCompliance.subproject
        ? {
            id: nonCompliance.subproject.id,
            name: nonCompliance.subproject.name,
          }
        : null,
      non_compliance_description: nonCompliance.nonComplianceDescription,
      identified_causes: nonCompliance.identifiedCauses,
      corrective_actions: nonCompliance.correctiveActions,
      responsible_person: nonCompliance.responsiblePerson,
      deadline: nonCompliance.deadline.toISOString(),
      status: nonCompliance.status,
      effectiveness_evaluation: nonCompliance.effectivenessEvaluation,
      responsible_person_evaluation: nonCompliance.responsiblePersonEvaluation,
      observation: nonCompliance.observation,
      created_at: nonCompliance.createdAt.toISOString(),
      updated_at: nonCompliance.updatedAt.toISOString(),
    };

    return NextResponse.json(formattedNonCompliance);
  } catch (error) {
    console.error('Error updating non-compliance record:', error);
    return NextResponse.json(
      { error: 'Failed to update non-compliance record' },
      { status: 500 }
    );
  }
}

// DELETE a non-compliance record
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Check if the non-compliance record exists
    const existingNonCompliance = await db.claimNonComplianceControl.findUnique(
      {
        where: {
          id,
        },
      }
    );

    if (!existingNonCompliance) {
      return NextResponse.json(
        { error: 'Non-compliance record not found' },
        { status: 404 }
      );
    }

    // Delete the non-compliance record
    await db.claimNonComplianceControl.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting non-compliance record:', error);
    return NextResponse.json(
      { error: 'Failed to delete non-compliance record' },
      { status: 500 }
    );
  }
}
