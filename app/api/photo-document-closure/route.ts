import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { uploadToS3, deleteFromS3, getKeyFromUrl } from '@/lib/s3-service';

// Get all photo-document records
export async function GET(request: Request) {
  try {
    const records = await db.photoDocumentProvingClosure.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Format the response to match frontend expectations
    const formattedRecords = records.map((record) => ({
      id: record.id,
      photo: record.photo,
      document: record.document,
      createdBy: record.createdBy,
      created_at: record.createdAt.toISOString(),
      updated_at: record.updatedAt.toISOString(),
    }));

    return NextResponse.json(formattedRecords);
  } catch (error) {
    console.error('Error fetching photo-document records:', error);
    return NextResponse.json(
      { error: 'Failed to fetch photo-document records' },
      { status: 500 }
    );
  }
}

// Create a new photo-document record with file uploads
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const createdBy = formData.get('createdBy') as string;
    const photoFile = formData.get('photo') as File;
    const documentFile = formData.get('document') as File;

    if (!createdBy || !photoFile || !documentFile) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Upload photo to S3
    const photoBuffer = Buffer.from(await photoFile.arrayBuffer());
    const photoUrl = await uploadToS3(
      photoBuffer,
      photoFile.name,
      photoFile.type
    );

    // Upload document to S3
    const documentBuffer = Buffer.from(await documentFile.arrayBuffer());
    const documentUrl = await uploadToS3(
      documentBuffer,
      documentFile.name,
      documentFile.type
    );

    // Create record in database
    const record = await db.photoDocumentProvingClosure.create({
      data: {
        photo: photoUrl,
        document: documentUrl,
        createdBy,
      },
    });

    // Format response
    const formattedRecord = {
      id: record.id,
      photo: record.photo,
      document: record.document,
      createdBy: record.createdBy,
      created_at: record.createdAt.toISOString(),
      updated_at: record.updatedAt.toISOString(),
    };

    return NextResponse.json(formattedRecord, { status: 201 });
  } catch (error) {
    console.error('Error creating photo-document record:', error);
    return NextResponse.json(
      { error: 'Failed to create photo-document record' },
      { status: 500 }
    );
  }
}

// Update a photo-document record
export async function PUT(request: Request) {
  try {
    const formData = await request.formData();
    const id = formData.get('id') as string;
    const createdBy = formData.get('createdBy') as string;
    const photoFile = formData.get('photo') as File | null;
    const documentFile = formData.get('document') as File | null;
    const currentPhotoUrl = formData.get('currentPhotoUrl') as string;
    const currentDocumentUrl = formData.get('currentDocumentUrl') as string;

    if (!id || !createdBy) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get existing record
    const existingRecord = await db.photoDocumentProvingClosure.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }

    let photoUrl = existingRecord.photo;
    let documentUrl = existingRecord.document;

    // If new photo uploaded, delete old one and upload new one
    if (photoFile && photoFile instanceof File) {
      // Delete old photo from S3 if it exists
      if (existingRecord.photo) {
        const photoKey = getKeyFromUrl(existingRecord.photo);
        if (photoKey) {
          await deleteFromS3(photoKey);
        }
      }

      // Upload new photo
      const photoBuffer = Buffer.from(await photoFile.arrayBuffer());
      photoUrl = await uploadToS3(photoBuffer, photoFile.name, photoFile.type);
    } else if (currentPhotoUrl) {
      photoUrl = currentPhotoUrl;
    }

    // If new document uploaded, delete old one and upload new one
    if (documentFile && documentFile instanceof File) {
      // Delete old document from S3 if it exists
      if (existingRecord.document) {
        const documentKey = getKeyFromUrl(existingRecord.document);
        if (documentKey) {
          await deleteFromS3(documentKey);
        }
      }

      // Upload new document
      const documentBuffer = Buffer.from(await documentFile.arrayBuffer());
      documentUrl = await uploadToS3(
        documentBuffer,
        documentFile.name,
        documentFile.type
      );
    } else if (currentDocumentUrl) {
      documentUrl = currentDocumentUrl;
    }

    // Update record
    const updatedRecord = await db.photoDocumentProvingClosure.update({
      where: { id },
      data: {
        photo: photoUrl,
        document: documentUrl,
        createdBy,
      },
    });

    // Format response
    const formattedRecord = {
      id: updatedRecord.id,
      photo: updatedRecord.photo,
      document: updatedRecord.document,
      createdBy: updatedRecord.createdBy,
      created_at: updatedRecord.createdAt.toISOString(),
      updated_at: updatedRecord.updatedAt.toISOString(),
    };

    return NextResponse.json(formattedRecord);
  } catch (error) {
    console.error('Error updating photo-document record:', error);
    return NextResponse.json(
      { error: 'Failed to update photo-document record' },
      { status: 500 }
    );
  }
}

// Delete a photo-document record
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing record ID' }, { status: 400 });
    }

    // Get record to delete
    const record = await db.photoDocumentProvingClosure.findUnique({
      where: { id },
    });

    if (!record) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }

    // Delete files from S3
    if (record.photo) {
      const photoKey = getKeyFromUrl(record.photo);
      if (photoKey) {
        await deleteFromS3(photoKey);
      }
    }

    if (record.document) {
      const documentKey = getKeyFromUrl(record.document);
      if (documentKey) {
        await deleteFromS3(documentKey);
      }
    }

    // Delete record from database
    await db.photoDocumentProvingClosure.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting photo-document record:', error);
    return NextResponse.json(
      { error: 'Failed to delete photo-document record' },
      { status: 500 }
    );
  }
}
