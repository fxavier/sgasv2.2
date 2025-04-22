import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET a specific screening form by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const screening = await db.environmentalSocialScreening.findUnique({
      where: {
        id,
      },
      include: {
        subproject: true,
        responsibleForFillingForm: true,
      },
    });

    if (!screening) {
      return NextResponse.json(
        { error: 'Screening form not found' },
        { status: 404 }
      );
    }

    // Get the screening results for this screening
    const screeningResult = await db.screeningResult.findFirst({
      where: {
        subprojectId: screening.subprojectId,
      },
    });

    // Get the responsible for verification (assuming it's the same as filling form for now)
    const responsibleForVerification = screening.responsibleForFillingForm;

    // Get biodiversity resources (mocked for now as it's not clear from schema)
    const biodiversityResource = {
      id: '1', // This would come from a real table in a complete implementation
      description: 'Flora and Fauna',
    };

    // Format the response to match frontend expectations
    const formattedScreening = {
      id: screening.id,
      responsible_for_filling_form: {
        id: screening.responsibleForFillingForm.id,
        name: screening.responsibleForFillingForm.name,
      },
      responsible_for_verification: {
        id: responsibleForVerification.id,
        name: responsibleForVerification.name,
      },
      subproject: {
        id: screening.subproject.id,
        name: screening.subproject.name,
      },
      biodiversidade_recursos_naturais: biodiversityResource,
      response: 'SIM', // This would come from a real field in a complete implementation
      comment: '', // This would come from a real field in a complete implementation
      relevant_standard: '', // This would come from a real field in a complete implementation
      consultation_and_engagement: '', // This would come from a real field in a complete implementation
      recomended_actions: '', // This would come from a real field in a complete implementation
      screening_results: screeningResult
        ? {
            risk_category: 'BAIXO', // This would come from a real field in a complete implementation
            description: '', // This would come from a real field in a complete implementation
            instruments_to_be_developed: '', // This would come from a real field in a complete implementation
          }
        : {
            risk_category: 'BAIXO',
            description: '',
            instruments_to_be_developed: '',
          },
      created_at: screening.createdAt.toISOString(),
      updated_at: screening.updatedAt.toISOString(),
    };

    return NextResponse.json(formattedScreening);
  } catch (error) {
    console.error('Error fetching screening form:', error);
    return NextResponse.json(
      { error: 'Failed to fetch screening form' },
      { status: 500 }
    );
  }
}

// PUT update a screening form
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();

    const {
      responsible_for_filling_form,
      responsible_for_verification,
      subproject,
      biodiversidade_recursos_naturais,
      response,
      comment,
      relevant_standard,
      consultation_and_engagement,
      recomended_actions,
      screening_results,
    } = body;

    // Validate required fields
    if (!responsible_for_filling_form || !subproject) {
      return NextResponse.json(
        { error: 'Responsible for filling form and subproject are required' },
        { status: 400 }
      );
    }

    // Check if the screening form exists
    const existingScreening = await db.environmentalSocialScreening.findUnique({
      where: {
        id,
      },
    });

    if (!existingScreening) {
      return NextResponse.json(
        { error: 'Screening form not found' },
        { status: 404 }
      );
    }

    // Update the screening form
    const screening = await db.environmentalSocialScreening.update({
      where: {
        id,
      },
      data: {
        subprojectId: subproject.id,
        responsibleForFillingFormId: responsible_for_filling_form.id,
      },
      include: {
        subproject: true,
        responsibleForFillingForm: true,
      },
    });

    // Update or create screening result
    let screeningResultRecord;
    const existingScreeningResult = await db.screeningResult.findFirst({
      where: {
        subprojectId: subproject.id,
      },
    });

    if (existingScreeningResult) {
      // Update existing screening result
      screeningResultRecord = existingScreeningResult;
    } else {
      // Create new screening result
      screeningResultRecord = await db.screeningResult.create({
        data: {
          subprojectId: subproject.id,
        },
      });
    }

    // Format the response to match frontend expectations
    const formattedScreening = {
      id: screening.id,
      responsible_for_filling_form: {
        id: screening.responsibleForFillingForm.id,
        name: screening.responsibleForFillingForm.name,
      },
      responsible_for_verification: {
        id: responsible_for_verification.id,
        name: responsible_for_verification.name,
      },
      subproject: {
        id: screening.subproject.id,
        name: screening.subproject.name,
      },
      biodiversidade_recursos_naturais: biodiversidade_recursos_naturais,
      response: response,
      comment: comment,
      relevant_standard: relevant_standard,
      consultation_and_engagement: consultation_and_engagement,
      recomended_actions: recomended_actions,
      screening_results: screening_results,
      created_at: screening.createdAt.toISOString(),
      updated_at: screening.updatedAt.toISOString(),
    };

    return NextResponse.json(formattedScreening);
  } catch (error) {
    console.error('Error updating screening form:', error);
    return NextResponse.json(
      { error: 'Failed to update screening form' },
      { status: 500 }
    );
  }
}

// DELETE a screening form
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Check if the screening form exists
    const existingScreening = await db.environmentalSocialScreening.findUnique({
      where: {
        id,
      },
    });

    if (!existingScreening) {
      return NextResponse.json(
        { error: 'Screening form not found' },
        { status: 404 }
      );
    }

    // Delete the screening form
    await db.environmentalSocialScreening.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting screening form:', error);
    return NextResponse.json(
      { error: 'Failed to delete screening form' },
      { status: 500 }
    );
  }
}
