import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET all waste management records
export async function GET() {
  try {
    const wasteManagements = await db.wasteManagement.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Format the response to match frontend expectations
    const formattedWasteManagements = wasteManagements.map((waste) => ({
      id: waste.id,
      waste_route: waste.wasteRoute,
      labelling: waste.labelling,
      storage: waste.storage,
      transportation_company_method: waste.transportationCompanyMethod,
      disposal_company: waste.disposalCompany,
      special_instructions: waste.specialInstructions,
      created_at: waste.createdAt.toISOString(),
      updated_at: waste.updatedAt.toISOString(),
    }));

    return NextResponse.json(formattedWasteManagements);
  } catch (error) {
    console.error('Error fetching waste management records:', error);
    return NextResponse.json(
      { error: 'Failed to fetch waste management records' },
      { status: 500 }
    );
  }
}

// POST create a new waste management record
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      waste_route,
      labelling,
      storage,
      transportation_company_method,
      disposal_company,
      special_instructions,
    } = body;

    // Validate required fields
    if (
      !waste_route ||
      !labelling ||
      !storage ||
      !transportation_company_method ||
      !disposal_company
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create the waste management record
    const wasteManagement = await db.wasteManagement.create({
      data: {
        wasteRoute: waste_route,
        labelling,
        storage,
        transportationCompanyMethod: transportation_company_method,
        disposalCompany: disposal_company,
        specialInstructions: special_instructions || '',
      },
    });

    // Format the response to match frontend expectations
    const formattedWasteManagement = {
      id: wasteManagement.id,
      waste_route: wasteManagement.wasteRoute,
      labelling: wasteManagement.labelling,
      storage: wasteManagement.storage,
      transportation_company_method:
        wasteManagement.transportationCompanyMethod,
      disposal_company: wasteManagement.disposalCompany,
      special_instructions: wasteManagement.specialInstructions,
      created_at: wasteManagement.createdAt.toISOString(),
      updated_at: wasteManagement.updatedAt.toISOString(),
    };

    return NextResponse.json(formattedWasteManagement, { status: 201 });
  } catch (error) {
    console.error('Error creating waste management record:', error);
    return NextResponse.json(
      { error: 'Failed to create waste management record' },
      { status: 500 }
    );
  }
}
