import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET /api/waste-transfer-log - Get all waste transfer logs
export async function GET() {
  try {
    const logs = await db.wasteTransferLog.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error('Error fetching waste transfer logs:', error);
    return NextResponse.json(
      { message: 'Error fetching waste transfer logs' },
      { status: 500 }
    );
  }
}

// POST /api/waste-transfer-log - Create a new waste transfer log
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      wasteType,
      howIsWasteContained,
      howMuchWaste,
      referenceNumber,
      dateOfRemoval,
      transferCompany,
      specialInstructions,
    } = body;

    // Validate input
    if (!wasteType || !referenceNumber) {
      return NextResponse.json(
        { message: 'Waste type and reference number are required' },
        { status: 400 }
      );
    }

    // Create waste transfer log
    const log = await db.wasteTransferLog.create({
      data: {
        wasteType,
        howIsWasteContained,
        howMuchWaste,
        referenceNumber,
        dateOfRemoval: new Date(dateOfRemoval),
        transferCompany,
        specialInstructions,
      },
    });

    return NextResponse.json(log, { status: 201 });
  } catch (error) {
    console.error('Error creating waste transfer log:', error);
    return NextResponse.json(
      { message: 'Error creating waste transfer log' },
      { status: 500 }
    );
  }
}

// Handle dynamic route parameters for PUT and DELETE
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      wasteType,
      howIsWasteContained,
      howMuchWaste,
      referenceNumber,
      dateOfRemoval,
      transferCompany,
      specialInstructions,
    } = body;

    // Validate input
    if (!id || !wasteType || !referenceNumber) {
      return NextResponse.json(
        { message: 'ID, waste type, and reference number are required' },
        { status: 400 }
      );
    }

    // Update waste transfer log
    const log = await db.wasteTransferLog.update({
      where: { id },
      data: {
        wasteType,
        howIsWasteContained,
        howMuchWaste,
        referenceNumber,
        dateOfRemoval: new Date(dateOfRemoval),
        transferCompany,
        specialInstructions,
      },
    });

    return NextResponse.json(log);
  } catch (error) {
    console.error('Error updating waste transfer log:', error);
    return NextResponse.json(
      { message: 'Error updating waste transfer log' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'ID is required' }, { status: 400 });
    }

    // Delete waste transfer log
    await db.wasteTransferLog.delete({
      where: { id },
    });

    return NextResponse.json({
      message: 'Waste transfer log deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting waste transfer log:', error);
    return NextResponse.json(
      { message: 'Error deleting waste transfer log' },
      { status: 500 }
    );
  }
}
