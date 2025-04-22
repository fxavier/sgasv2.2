import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

// GET a specific impact assessment by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    const assessment = await prisma.environAndSocialRiskAndImapactAssessement.findUnique({
      where: {
        id,
      },
      include: {
        department: true,
        subproject: true,
        risksAndImpact: true,
        environmentalFactor: true,
        legalRequirements: true,
      },
    });
    
    if (!assessment) {
      return NextResponse.json(
        { error: 'Impact assessment not found' },
        { status: 404 }
      );
    }
    
    // Format the response to match frontend expectations
    const formattedAssessment = {
      id: assessment.id,
      departament: assessment.department ? {
        id: assessment.department.id,
        name: assessment.department.name,
      } : null,
      subproject: assessment.subproject ? {
        id: assessment.subproject.id,
        name: assessment.subproject.name,
      } : null,
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
      legal_requirements: assessment.legalRequirements.map(req => ({
        id: req.id,
        number: req.number,
        document_title: req.documentTitle,
      })),
      compliance_requirements: assessment.complianceRequirements,
      observations: assessment.observations,
      created_at: assessment.createdAt.toISOString(),
      updated_at: assessment.updatedAt.toISOString(),
    };
    
    return NextResponse.json(formattedAssessment);
  } catch (error) {
    console.error('Error fetching impact assessment:', error);
    return NextResponse.json(
      { error: 'Failed to fetch impact assessment' },
      { status: 500 }
    );
  }
}

// PUT update an impact assessment
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
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
    if (!activity || !risks_and_impact || !environmental_factor || !description_of_measures) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // First, disconnect all existing legal requirements
    await prisma.environAndSocialRiskAndImapactAssessement.update({
      where: { id },
      data: {
        legalRequirements: {
          set: [], // Disconnect all existing connections
        },
      },
    });
    
    // Then update the assessment with new data
    const assessment = await prisma.environAndSocialRiskAndImapactAssessement.update({
      where: {
        id,
      },
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
          connect: legal_requirements ? legal_requirements.map(req => ({ id: req.id })) : [],
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
      departament: assessment.department ? {
        id: assessment.department.id,
        name: assessment.department.name,
      } : null,
      subproject: assessment.subproject ? {
        id: assessment.subproject.id,
        name: assessment.subproject.name,
      } : null,
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
      legal_requirements: assessment.legalRequirements.map(req => ({
        id: req.id,
        number: req.number,
        document_title: req.documentTitle,
      })),
      compliance_requirements: assessment.complianceRequirements,
      observations: assessment.observations,
      created_at: assessment.createdAt.toISOString(),
      updated_at: assessment.updatedAt.toISOString(),
    };
    
    return NextResponse.json(formattedAssessment);
  } catch (error) {
    console.error('Error updating impact assessment:', error);
    return NextResponse.json(
      { error: 'Failed to update impact assessment' },
      { status: 500 }
    );
  }
}

// DELETE an impact assessment
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // First, disconnect all legal requirements
    await prisma.environAndSocialRiskAndImapactAssessement.update({
      where: { id },
      data: {
        legalRequirements: {
          set: [], // Disconnect all existing connections
        },
      },
    });
    
    // Then delete the assessment
    await prisma.environAndSocialRiskAndImapactAssessement.delete({
      where: {
        id,
      },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting impact assessment:', error);
    return NextResponse.json(
      { error: 'Failed to delete impact assessment' },
      { status: 500 }
    );
  }
}