import { NextRequest, NextResponse } from 'next/server';
import { uploadToS3 } from '@/lib/s3-service';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload file to S3
    const fileUrl = await uploadToS3(buffer, file.name, file.type);

    return NextResponse.json({ fileUrl });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
