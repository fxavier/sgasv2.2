import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET all non-compliance records
export async function GET() {
  try {
    const nonCompliances = await db.claimNonComplianceControl.findMany({
      include: {
        department: true,
        subproject: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Format the response to match frontend expectations
    const formattedNonCompliances = nonCompliances.map((nonCompliance) => ({
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
    }));

    return NextResponse.json(formattedNonCompliances);
  } catch (error) {
    console.error('Error fetching non-compliance records:', error);
    return NextResponse.json(
      { error: 'Failed to fetch non-compliance records' },
      { status: 500 }
    );
  }
}

// POST create a new non-compliance record
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received form data:', JSON.stringify(body, null, 2));

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
      console.log('Missing required fields:', {
        number,
        non_compliance_description,
        identified_causes,
        corrective_actions,
        responsible_person,
        deadline,
        responsible_person_evaluation,
      });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if a non-compliance with the same number already exists
    const existingNonCompliance = await db.claimNonComplianceControl.findUnique(
      {
        where: {
          number,
        },
      }
    );

    if (existingNonCompliance) {
      console.log('Number already exists:', number);
      return NextResponse.json(
        { error: 'A non-compliance record with this number already exists' },
        { status: 400 }
      );
    }

    console.log('Attempting to create record with data:', {
      number,
      departmentId: department?.id,
      subprojectId: subproject?.id,
      nonComplianceDescription: non_compliance_description,
      identifiedCauses: identified_causes,
      correctiveActions: corrective_actions,
      responsiblePerson: responsible_person,
      deadline: new Date(deadline),
      status: status || 'PENDING',
      effectivenessEvaluation: effectiveness_evaluation || 'NOT_EFFECTIVE',
      responsiblePersonEvaluation: responsible_person_evaluation,
      observation: observation || '',
    });

    // Create the non-compliance record
    const nonCompliance = await db.claimNonComplianceControl.create({
      data: {
        number,
        departmentId: department?.id,
        subprojectId: subproject?.id,
        nonComplianceDescription: non_compliance_description,
        identifiedCauses: identified_causes,
        correctiveActions: corrective_actions,
        responsiblePerson: responsible_person,
        deadline: new Date(deadline),
        status: status || 'PENDING',
        effectivenessEvaluation: effectiveness_evaluation || 'NOT_EFFECTIVE',
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

    return NextResponse.json(formattedNonCompliance, { status: 201 });
  } catch (error) {
    console.error('Error creating non-compliance record:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('Error details:', errorMessage);

    return NextResponse.json(
      { error: `Failed to create non-compliance record: ${errorMessage}` },
      { status: 500 }
    );
  }
}
