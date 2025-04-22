import { NextResponse } from 'next/server';
import db from '@/lib/db';

interface LegalRequirement {
  id: string;
  number: string;
  document_title: string;
}

// GET all impact assessments
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const departmentId = searchParams.get('departmentId');
    const subprojectId = searchParams.get('subprojectId');

    let whereClause = {};

    if (departmentId) {
      whereClause = {
        ...whereClause,
        departmentId,
      };
    }

    if (subprojectId) {
      whereClause = {
        ...whereClause,
        subprojectId,
      };
    }

    const assessments =
      await db.environAndSocialRiskAndImapactAssessement.findMany({
        where: whereClause,
        include: {
          department: true,
          subproject: true,
          risksAndImpact: true,
          environmentalFactor: true,
          legalRequirements: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

    // Transform the data to match the frontend expected format
    const formattedAssessments = assessments.map((assessment) => ({
      id: assessment.id,
      departament: assessment.department
        ? {
            id: assessment.department.id,
            name: assessment.department.name,
          }
        : null,
      subproject: assessment.subproject
        ? {
            id: assessment.subproject.id,
            name: assessment.subproject.name,
          }
        : null,
      activity: assessment.activity,
      risks_and_impact: {
        id: assessment.risksAndImpact.id,
        description: assessment.risksAndImpact.description,
      },
      environmental_factor: {
        id: assessment.environmentalFactor.id,
        description: assessment.environmentalFactor.description,
      },
      life_cycle: assessment.lifeCycle,
      statute: assessment.statute,
      extension: assessment.extension,
      duration: assessment.duration,
      intensity: assessment.intensity,
      probability: assessment.probability,
      significance: assessment.significance,
      description_of_measures: assessment.descriptionOfMeasures,
      deadline: assessment.deadline.toISOString(),
      responsible: assessment.responsible,
      effectiveness_assessment: assessment.effectivenessAssessment,
      legal_requirements: assessment.legalRequirements.map((req) => ({
        id: req.id,
        number: req.number,
        document_title: req.documentTitle,
      })),
      compliance_requirements: assessment.complianceRequirements,
      observations: assessment.observations,
      created_at: assessment.createdAt.toISOString(),
      updated_at: assessment.updatedAt.toISOString(),
    }));

    return NextResponse.json(formattedAssessments);
  } catch (error) {
    console.error('Error fetching impact assessments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch impact assessments' },
      { status: 500 }
    );
  }
}

// POST create a new impact assessment
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      departament,
      subproject,
      activity,
      risks_and_impact,
      environmental_factor,
      life_cycle,
      statute,
      extension,
      duration,
      intensity,
      probability,
      significance,
      description_of_measures,
      deadline,
      responsible,
      effectiveness_assessment,
      legal_requirements,
      compliance_requirements,
      observations,
    } = body;

    // Validate required fields
    if (
      !activity ||
      !risks_and_impact ||
      !environmental_factor ||
      !description_of_measures
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create the impact assessment
    const assessment =
      await db.environAndSocialRiskAndImapactAssessement.create({
        data: {
          departmentId: departament?.id || null,
          subprojectId: subproject?.id || null,
          activity,
          risksAndImpactId: risks_and_impact.id,
          environmentalFactorId: environmental_factor.id,
          lifeCycle: life_cycle,
          statute,
          extension,
          duration,
          intensity,
          probability,
          significance,
          descriptionOfMeasures: description_of_measures,
          deadline: new Date(deadline),
          responsible,
          effectivenessAssessment: effectiveness_assessment,
          complianceRequirements: compliance_requirements,
          observations: observations || '',
          legalRequirements: {
            connect: legal_requirements
              ? legal_requirements.map((req: LegalRequirement) => ({
                  id: req.id,
                }))
              : [],
          },
        },
        include: {
          department: true,
          subproject: true,
          risksAndImpact: true,
          environmentalFactor: true,
          legalRequirements: true,
        },
      });

    // Format the response to match frontend expectations
    const formattedAssessment = {
      id: assessment.id,
      departament: assessment.department
        ? {
            id: assessment.department.id,
            name: assessment.department.name,
          }
        : null,
      subproject: assessment.subproject
        ? {
            id: assessment.subproject.id,
            name: assessment.subproject.name,
          }
        : null,
      activity: assessment.activity,
      risks_and_impact: {
        id: assessment.risksAndImpact.id,
        description: assessment.risksAndImpact.description,
      },
      environmental_factor: {
        id: assessment.environmentalFactor.id,
        description: assessment.environmentalFactor.description,
      },
      life_cycle: assessment.lifeCycle,
      statute: assessment.statute,
      extension: assessment.extension,
      duration: assessment.duration,
      intensity: assessment.intensity,
      probability: assessment.probability,
      significance: assessment.significance,
      description_of_measures: assessment.descriptionOfMeasures,
      deadline: assessment.deadline.toISOString(),
      responsible: assessment.responsible,
      effectiveness_assessment: assessment.effectivenessAssessment,
      legal_requirements: assessment.legalRequirements.map((req) => ({
        id: req.id,
        number: req.number,
        document_title: req.documentTitle,
      })),
      compliance_requirements: assessment.complianceRequirements,
      observations: assessment.observations,
      created_at: assessment.createdAt.toISOString(),
      updated_at: assessment.updatedAt.toISOString(),
    };

    return NextResponse.json(formattedAssessment, { status: 201 });
  } catch (error) {
    console.error('Error creating impact assessment:', error);
    return NextResponse.json(
      { error: 'Failed to create impact assessment' },
      { status: 500 }
    );
  }
}
