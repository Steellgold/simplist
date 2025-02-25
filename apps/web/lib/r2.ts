// lib/r2.ts
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Configuration for Cloudflare R2
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || "";
const R2_ACCESS_KEY_ID = process.env.CLOUDFLARE_ACCESS_KEY_ID || "";
const R2_SECRET_ACCESS_KEY = process.env.CLOUDFLARE_SECRET_ACCESS_KEY || "";
const R2_BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME || "";
const CDN_DOMAIN = process.env.CDN_DOMAIN || "cdn.simplist.blog";

if (!CLOUDFLARE_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME) {
  console.warn("⚠️ Missing Cloudflare R2 configuration. File uploads will not work.");
}

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

/**
 * Uploads a file to R2
 * @param file The file to upload
 * @param key The unique name of the file in the bucket
 * @param contentType The MIME type of the file
 * @returns The URL of the uploaded file with custom domain
 */
const uploadFile = async (
  file: Buffer | Blob,
  key: string,
  contentType: string = "image/png"
): Promise<string> => {
  try {
    let fileBuffer: Buffer;
    if (file instanceof Blob) {
      fileBuffer = Buffer.from(await file.arrayBuffer());
    } else {
      fileBuffer = file;
    }

    const putCommand = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
    });

    await s3Client.send(putCommand);

    return `https://${CDN_DOMAIN}/${key}`;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

/**
 * Generates a URL for a file using the custom domain
 * @param key The name of the file in the bucket
 * @returns The URL with custom domain
 */
const getFileUrl = async (key: string): Promise<string> => {
  try {
    return `https://${CDN_DOMAIN}/${key}`;
  } catch (error) {
    console.error("Error generating URL:", error);
    throw error;
  }
};

/**
 * Gets a signed URL for a file (used when direct CDN access isn't available)
 * @param key The name of the file in the bucket
 * @param expiresIn Duration of URL validity in seconds (default: 3600)
 * @returns The signed URL to access the file
 */
const getSignedFileUrl = async (key: string, expiresIn: number = 3600): Promise<string> => {
  try {
    const getCommand = new GetObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    });

    return await getSignedUrl(s3Client, getCommand, { expiresIn });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    throw error;
  }
};

/**
 * Deletes a file from the bucket
 * @param key The name of the file to delete
 */
const deleteFile = async (key: string): Promise<void> => {
  try {
    const deleteCommand = new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(deleteCommand);
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};

const R2 = {
  uploadFile,
  getFileUrl,
  getSignedFileUrl,
  deleteFile,
  client: s3Client,
  bucketName: R2_BUCKET_NAME
};

export default R2;