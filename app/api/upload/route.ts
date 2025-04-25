import { NextResponse } from 'next/server';
import { uploadToS3 } from '@/lib/s3-service';

// Maximum file size (5MB)
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: Request) {
  try {
    // Get the multipart form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { message: 'File is required' },
        { status: 400 }
      );
    }

    // Check file size
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { message: 'File size exceeds 5MB limit' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Upload to S3
    const fileUrl = await uploadToS3(fileBuffer, file.name, file.type);

    return NextResponse.json({ fileUrl }, { status: 201 });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { message: 'Error uploading file', error: String(error) },
      { status: 500 }
    );
  }
}
