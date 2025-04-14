import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  AWS_REGION,
  AWS_S3_BUCKET,
  AWS_ACCESS_KEY,
  AWS_SECRET_KEY,
} from './aws-config';

// Initialize S3 client
const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY as string,
    secretAccessKey: AWS_SECRET_KEY as string,
  },
});

export const uploadToS3 = async (
  file: Buffer,
  fileName: string,
  contentType: string
) => {
  try {
    const key = `documents/${Date.now()}-${fileName}`;

    const params = {
      Bucket: AWS_S3_BUCKET as string,
      Key: key,
      Body: file,
      ContentType: contentType,
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    // Return the file URL
    return `https://${AWS_S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${key}`;
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw new Error('Failed to upload file to S3');
  }
};

export const getPresignedUrl = async (key: string, expiresIn = 3600) => {
  try {
    const command = new GetObjectCommand({
      Bucket: AWS_S3_BUCKET as string,
      Key: key,
    });

    return await getSignedUrl(s3Client, command, { expiresIn });
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    throw new Error('Failed to generate presigned URL');
  }
};

export const createPresignedUploadUrl = async (
  fileName: string,
  contentType: string,
  expiresIn = 3600
) => {
  try {
    const key = `documents/${Date.now()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: AWS_S3_BUCKET as string,
      Key: key,
      ContentType: contentType,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn });

    return {
      url,
      key,
      fileUrl: `https://${AWS_S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${key}`,
    };
  } catch (error) {
    console.error('Error generating presigned upload URL:', error);
    throw new Error('Failed to generate presigned upload URL');
  }
};

export const deleteFromS3 = async (key: string) => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: AWS_S3_BUCKET as string,
      Key: key,
    });

    await s3Client.send(command);
    return true;
  } catch (error) {
    console.error('Error deleting from S3:', error);
    throw new Error('Failed to delete file from S3');
  }
};

// Helper to extract key from S3 URL
export const getKeyFromUrl = (url: string) => {
  if (!url) return null;
  const baseUrl = `https://${AWS_S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/`;
  return url.startsWith(baseUrl) ? url.substring(baseUrl.length) : null;
};
