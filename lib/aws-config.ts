// AWS S3 Configuration
export const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
export const AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;
export const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
export const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;

// Validate required environment variables
if (!AWS_S3_BUCKET || !AWS_ACCESS_KEY || !AWS_SECRET_KEY) {
  console.error('Missing required AWS environment variables');
}
