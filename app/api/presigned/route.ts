import { NextRequest, NextResponse } from 'next/server';
import { createPresignedUploadUrl } from '@/lib/s3-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileName, contentType } = body;

    if (!fileName || !contentType) {
      return NextResponse.json(
        { error: 'fileName and contentType are required' },
        { status: 400 }
      );
    }

    const presignedData = await createPresignedUploadUrl(fileName, contentType);

    return NextResponse.json(presignedData);
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate presigned upload URL' },
      { status: 500 }
    );
  }
}
