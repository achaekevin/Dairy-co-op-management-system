import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import config from '@config/env.js';
import { BadRequestError } from '@core/errors.js';
import logger from '@core/logger.js';

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

interface UploadOptions {
  folder?: string;
  transformation?: Record<string, unknown>;
}

class UploadService {
  async uploadImage(
    fileBuffer: Buffer,
    fileName: string,
    options: UploadOptions = {}
  ): Promise<UploadApiResponse> {
    try {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: options.folder || 'dairy-coop',
            public_id: fileName,
            resource_type: 'image',
            transformation: options.transformation,
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else if (result) {
              resolve(result);
            }
          }
        );

        uploadStream.end(fileBuffer);
      });
    } catch (error) {
      logger.error('Image upload failed:', error);
      throw new BadRequestError('Failed to upload image');
    }
  }

  async uploadDocument(
    fileBuffer: Buffer,
    fileName: string,
    options: UploadOptions = {}
  ): Promise<UploadApiResponse> {
    try {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: options.folder || 'dairy-coop/documents',
            public_id: fileName,
            resource_type: 'raw',
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else if (result) {
              resolve(result);
            }
          }
        );

        uploadStream.end(fileBuffer);
      });
    } catch (error) {
      logger.error('Document upload failed:', error);
      throw new BadRequestError('Failed to upload document');
    }
  }

  async deleteFile(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
      logger.info(`File deleted: ${publicId}`);
    } catch (error) {
      logger.error('File deletion failed:', error);
      throw new BadRequestError('Failed to delete file');
    }
  }

  async deleteMultipleFiles(publicIds: string[]): Promise<void> {
    try {
      await cloudinary.api.delete_resources(publicIds);
      logger.info(`Files deleted: ${publicIds.join(', ')}`);
    } catch (error) {
      logger.error('Multiple files deletion failed:', error);
      throw new BadRequestError('Failed to delete files');
    }
  }

  validateImageFile(mimetype: string, size: number): void {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(mimetype)) {
      throw new BadRequestError('Invalid file type. Only JPEG, PNG, and WebP are allowed');
    }

    if (size > maxSize) {
      throw new BadRequestError('File size exceeds 5MB limit');
    }
  }

  validateDocumentFile(mimetype: string, size: number): void {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];
    const maxSize = 10 * 1024 * 1024;

    if (!allowedTypes.includes(mimetype)) {
      throw new BadRequestError('Invalid file type. Only PDF, DOC, DOCX, XLS, and XLSX are allowed');
    }

    if (size > maxSize) {
      throw new BadRequestError('File size exceeds 10MB limit');
    }
  }
}

export default new UploadService();
