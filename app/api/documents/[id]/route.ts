import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET a specific document by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const document = await db.document.findUnique({
      where: {
        id,
      },
      include: {
        documentType: true,
      },
    });

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // Format the response to match frontend expectations
    const formattedDocument = {
      id: document.id,
      code: document.code,
      creation_date: document.creationDate.toISOString(),
      revision_date: document.revisionDate.toISOString(),
      document_name: document.documentName,
      document_type: {
        id: document.documentType.id,
        description: document.documentType.description,
      },
      document_path: document.documentPath,
      document_state: document.documentState,
      retention_period: document.retentionPeriod.toISOString(),
      disposal_method: document.disposalMethod,
      observation: document.observation,
      created_at: document.createdAt.toISOString(),
      updated_at: document.updatedAt.toISOString(),
    };

    return NextResponse.json(formattedDocument);
  } catch (error) {
    console.error('Error fetching document:', error);
    return NextResponse.json(
      { error: 'Failed to fetch document' },
      { status: 500 }
    );
  }
}

// PUT update a document
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();

    const {
      code,
      creation_date,
      revision_date,
      document_name,
      document_type,
      document_path,
      document_state,
      retention_period,
      disposal_method,
      observation,
    } = body;

    // Validate required fields
    if (
      !code ||
      !document_name ||
      !document_type ||
      !document_state ||
      !disposal_method
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const document = await db.document.update({
      where: {
        id,
      },
      data: {
        code,
        creationDate: new Date(creation_date),
        revisionDate: new Date(revision_date),
        documentName: document_name,
        documentTypeId: document_type.id,
        documentPath: document_path || '',
        documentState: document_state,
        retentionPeriod: new Date(retention_period),
        disposalMethod: disposal_method,
        observation: observation || '',
      },
      include: {
        documentType: true,
      },
    });

    // Format the response to match frontend expectations
    const formattedDocument = {
      id: document.id,
      code: document.code,
      creation_date: document.creationDate.toISOString(),
      revision_date: document.revisionDate.toISOString(),
      document_name: document.documentName,
      document_type: {
        id: document.documentType.id,
        description: document.documentType.description,
      },
      document_path: document.documentPath,
      document_state: document.documentState,
      retention_period: document.retentionPeriod.toISOString(),
      disposal_method: document.disposalMethod,
      observation: document.observation,
      created_at: document.createdAt.toISOString(),
      updated_at: document.updatedAt.toISOString(),
    };

    return NextResponse.json(formattedDocument);
  } catch (error) {
    console.error('Error updating document:', error);
    return NextResponse.json(
      { error: 'Failed to update document' },
      { status: 500 }
    );
  }
}

// DELETE a document
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    await db.document.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json(
      { error: 'Failed to delete document' },
      { status: 500 }
    );
  }
}
