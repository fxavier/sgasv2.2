import { NextResponse } from 'next/server';
import db from '@/lib/db';

// Get all documents or filter by document type
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const typeId = searchParams.get('typeId');

    let documents;

    if (typeId) {
      documents = await db.document.findMany({
        where: {
          documentTypeId: typeId,
        },
        include: {
          documentType: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } else {
      documents = await db.document.findMany({
        include: {
          documentType: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }

    // Transform the data to match the frontend expected format
    const formattedDocuments = documents.map((doc) => ({
      id: doc.id,
      code: doc.code,
      creation_date: doc.creationDate.toISOString(),
      revision_date: doc.revisionDate.toISOString(),
      document_name: doc.documentName,
      document_type: {
        id: doc.documentType.id,
        description: doc.documentType.description,
      },
      document_path: doc.documentPath,
      document_state: doc.documentState,
      retention_period: doc.retentionPeriod.toISOString(),
      disposal_method: doc.disposalMethod,
      observation: doc.observation,
      created_at: doc.createdAt.toISOString(),
      updated_at: doc.updatedAt.toISOString(),
    }));

    return NextResponse.json(formattedDocuments);
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}

// Create a new document
export async function POST(request: Request) {
  try {
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

    const document = await db.document.create({
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

    return NextResponse.json(formattedDocument, { status: 201 });
  } catch (error) {
    console.error('Error creating document:', error);
    return NextResponse.json(
      { error: 'Failed to create document' },
      { status: 500 }
    );
  }
}
