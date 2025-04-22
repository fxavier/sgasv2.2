import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET all environmental & social screening forms
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const subprojectId = searchParams.get('subprojectId');

    let whereClause = {};

    if (subprojectId) {
      whereClause = {
        ...whereClause,
        subprojectId,
      };
    }

    const screenings = await db.environmentalSocialScreening.findMany({
      where: whereClause,
      include: {
        subproject: true,
        responsibleForFillingForm: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform the data to match the frontend expected format
    const formattedScreenings = await Promise.all(
      screenings.map(async (screening) => {
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

        return {
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
      })
    );

    return NextResponse.json(formattedScreenings);
  } catch (error) {
    console.error('Error fetching screening forms:', error);
    return NextResponse.json(
      { error: 'Failed to fetch screening forms' },
      { status: 500 }
    );
  }
}

// POST create a new environmental & social screening form
export async function POST(request: Request) {
  try {
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

    // Check if responsible for filling form exists, create if not
    let responsibleForFillingFormRecord =
      await db.responsibleForFillingForm.findUnique({
        where: {
          id: responsible_for_filling_form.id,
        },
      });

    if (!responsibleForFillingFormRecord) {
      responsibleForFillingFormRecord =
        await db.responsibleForFillingForm.create({
          data: {
            id: responsible_for_filling_form.id,
            name: responsible_for_filling_form.name,
            role: 'Environmental Specialist', // Default role
            contact: 'N/A', // Default contact
            date: new Date(),
          },
        });
    }

    // Check if subproject exists
    const subprojectRecord = await db.subproject.findUnique({
      where: {
        id: subproject.id,
      },
    });

    if (!subprojectRecord) {
      return NextResponse.json(
        { error: 'Subproject not found' },
        { status: 404 }
      );
    }

    // Create or update screening result
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

    // Create or update consultation and engagement
    let consultationRecord;
    const existingConsultation = await db.consultationAndEngagement.findFirst({
      where: {
        subprojectId: subproject.id,
      },
    });

    if (existingConsultation) {
      // Update existing consultation
      consultationRecord = existingConsultation;
    } else {
      // Create new consultation
      consultationRecord = await db.consultationAndEngagement.create({
        data: {
          subprojectId: subproject.id,
        },
      });
    }

    // Create the environmental social screening
    const screening = await db.environmentalSocialScreening.create({
      data: {
        subprojectId: subproject.id,
        responsibleForFillingFormId: responsibleForFillingFormRecord.id,
      },
      include: {
        subproject: true,
        responsibleForFillingForm: true,
      },
    });

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

    return NextResponse.json(formattedScreening, { status: 201 });
  } catch (error) {
    console.error('Error creating screening form:', error);
    return NextResponse.json(
      { error: 'Failed to create screening form' },
      { status: 500 }
    );
  }
}
