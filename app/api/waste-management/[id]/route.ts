import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET a specific waste management record by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const wasteManagement = await db.wasteManagement.findUnique({
      where: {
        id,
      },
    });

    if (!wasteManagement) {
      return NextResponse.json(
        { error: 'Waste management record not found' },
        { status: 404 }
      );
    }

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

    return NextResponse.json(formattedWasteManagement);
  } catch (error) {
    console.error('Error fetching waste management record:', error);
    return NextResponse.json(
      { error: 'Failed to fetch waste management record' },
      { status: 500 }
    );
  }
}

// PUT update a waste management record
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
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

    // Check if the waste management record exists
    const existingWasteManagement = await db.wasteManagement.findUnique({
      where: {
        id,
      },
    });

    if (!existingWasteManagement) {
      return NextResponse.json(
        { error: 'Waste management record not found' },
        { status: 404 }
      );
    }

    // Update the waste management record
    const wasteManagement = await db.wasteManagement.update({
      where: {
        id,
      },
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

    return NextResponse.json(formattedWasteManagement);
  } catch (error) {
    console.error('Error updating waste management record:', error);
    return NextResponse.json(
      { error: 'Failed to update waste management record' },
      { status: 500 }
    );
  }
}

// DELETE a waste management record
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Check if the waste management record exists
    const existingWasteManagement = await db.wasteManagement.findUnique({
      where: {
        id,
      },
    });

    if (!existingWasteManagement) {
      return NextResponse.json(
        { error: 'Waste management record not found' },
        { status: 404 }
      );
    }

    // Delete the waste management record
    await db.wasteManagement.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting waste management record:', error);
    return NextResponse.json(
      { error: 'Failed to delete waste management record' },
      { status: 500 }
    );
  }
}
