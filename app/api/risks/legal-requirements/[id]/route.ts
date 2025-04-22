import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { deleteFromS3, getKeyFromUrl } from '@/lib/s3-service';

// GET a specific legal requirement by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const legalRequirement = await db.legalRequirementControl.findUnique({
      where: {
        id,
      },
    });

    if (!legalRequirement) {
      return NextResponse.json(
        { error: 'Legal requirement not found' },
        { status: 404 }
      );
    }

    // Format the response to match frontend expectations
    const formattedRequirement = {
      id: legalRequirement.id,
      number: legalRequirement.number,
      document_title: legalRequirement.documentTitle,
      effective_date: legalRequirement.effectiveDate.toISOString(),
      description: legalRequirement.description,
      status: legalRequirement.status.toLowerCase(),
      amended_description: legalRequirement.amendedDescription,
      observation: legalRequirement.observation,
      law_file: legalRequirement.lawFile,
      created_at: legalRequirement.createdAt.toISOString(),
      updated_at: legalRequirement.updatedAt.toISOString(),
    };

    return NextResponse.json(formattedRequirement);
  } catch (error) {
    console.error('Error fetching legal requirement:', error);
    return NextResponse.json(
      { error: 'Failed to fetch legal requirement' },
      { status: 500 }
    );
  }
}

// PUT update a legal requirement
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();

    const {
      number,
      documentTitle,
      effectiveDate,
      description,
      status,
      amendedDescription,
      observation,
      lawFile,
    } = body;

    if (
      !number ||
      !documentTitle ||
      !effectiveDate ||
      !description ||
      !status
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get the current requirement to check for existing law file
    const currentRequirement = await db.legalRequirementControl.findUnique({
      where: { id },
    });

    // If there's a new law file and an old one exists, delete the old one from S3
    if (lawFile && currentRequirement?.lawFile) {
      try {
        const key = getKeyFromUrl(currentRequirement.lawFile);
        if (key) {
          await deleteFromS3(key);
        }
      } catch (error) {
        console.error('Error deleting old law file:', error);
        // Continue with the update even if file deletion fails
      }
    }

    // Map status string to enum
    let statusEnum;
    switch (status.toUpperCase()) {
      case 'ACTIVE':
        statusEnum = 'ACTIVE';
        break;
      case 'REVOKED':
        statusEnum = 'REVOKED';
        break;
      case 'AMENDED':
        statusEnum = 'AMENDED';
        break;
      default:
        statusEnum = 'ACTIVE';
    }

    const legalRequirement = await db.legalRequirementControl.update({
      where: {
        id,
      },
      data: {
        number,
        documentTitle,
        effectiveDate: new Date(effectiveDate),
        description,
        status: statusEnum as any,
        amendedDescription,
        observation,
        lawFile,
      },
    });

    // Format the response to match frontend expectations
    const formattedRequirement = {
      id: legalRequirement.id,
      number: legalRequirement.number,
      document_title: legalRequirement.documentTitle,
      effective_date: legalRequirement.effectiveDate.toISOString(),
      description: legalRequirement.description,
      status: legalRequirement.status.toLowerCase(),
      amended_description: legalRequirement.amendedDescription,
      observation: legalRequirement.observation,
      law_file: legalRequirement.lawFile,
      created_at: legalRequirement.createdAt.toISOString(),
      updated_at: legalRequirement.updatedAt.toISOString(),
    };

    return NextResponse.json(formattedRequirement);
  } catch (error) {
    console.error('Error updating legal requirement:', error);
    return NextResponse.json(
      { error: 'Failed to update legal requirement' },
      { status: 500 }
    );
  }
}

// DELETE a legal requirement
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Get the requirement to check for law file
    const requirement = await db.legalRequirementControl.findUnique({
      where: { id },
    });

    if (!requirement) {
      return NextResponse.json(
        { error: 'Legal requirement not found' },
        { status: 404 }
      );
    }

    // Check if there are any impact assessments using this legal requirement
    const assessmentsUsingRequirement =
      await db.environAndSocialRiskAndImapactAssessement.findMany({
        where: {
          legalRequirements: {
            some: {
              id,
            },
          },
        },
      });

    if (assessmentsUsingRequirement.length > 0) {
      return NextResponse.json(
        {
          error:
            'Cannot delete legal requirement that is in use by impact assessments',
        },
        { status: 400 }
      );
    }

    // Delete law file from S3 if it exists
    if (requirement.lawFile) {
      try {
        const key = getKeyFromUrl(requirement.lawFile);
        if (key) {
          await deleteFromS3(key);
        }
      } catch (error) {
        console.error('Error deleting law file:', error);
        // Continue with the deletion even if file deletion fails
      }
    }

    await db.legalRequirementControl.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting legal requirement:', error);
    return NextResponse.json(
      { error: 'Failed to delete legal requirement' },
      { status: 500 }
    );
  }
}
