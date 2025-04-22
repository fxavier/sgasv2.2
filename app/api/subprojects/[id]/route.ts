import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

// GET a specific subproject by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    const subproject = await prisma.subproject.findUnique({
      where: {
        id,
      },
    });
    
    if (!subproject) {
      return NextResponse.json(
        { error: 'Subproject not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(subproject);
  } catch (error) {
    console.error('Error fetching subproject:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subproject' },
      { status: 500 }
    );
  }
}

// PUT update a subproject
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    
    const { 
      name, 
      contractReference, 
      contractorName, 
      estimatedCost, 
      location, 
      geographicCoordinates, 
      type, 
      approximateArea 
    } = body;
    
    if (!name || !location || !type || !approximateArea) {
      return NextResponse.json(
        { error: 'Name, location, type, and approximate area are required' },
        { status: 400 }
      );
    }
    
    const subproject = await prisma.subproject.update({
      where: {
        id,
      },
      data: {
        name,
        contractReference,
        contractorName,
        estimatedCost: estimatedCost ? parseFloat(estimatedCost) : null,
        location,
        geographicCoordinates,
        type,
        approximateArea,
      },
    });
    
    return NextResponse.json(subproject);
  } catch (error) {
    console.error('Error updating subproject:', error);
    return NextResponse.json(
      { error: 'Failed to update subproject' },
      { status: 500 }
    );
  }
}

// DELETE a subproject
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Check if there are any impact assessments using this subproject
    const assessmentsUsingSubproject = await prisma.environAndSocialRiskAndImapactAssessement.count({
      where: {
        subprojectId: id,
      },
    });
    
    if (assessmentsUsingSubproject > 0) {
      return NextResponse.json(
        { error: 'Cannot delete subproject that is in use by impact assessments' },
        { status: 400 }
      );
    }
    
    await prisma.subproject.delete({
      where: {
        id,
      },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting subproject:', error);
    return NextResponse.json(
      { error: 'Failed to delete subproject' },
      { status: 500 }
    );
  }
}