import { z } from 'zod';
import { ALLOWED_MIME_TYPES } from '../schema/enums';

export const PresignRequestSchema = z.object({
  filename: z.string().min(1),
  mimeType: z.enum(ALLOWED_MIME_TYPES as unknown as [string, ...string[]]),
  sizeBytes: z.number().positive(),
});
export type PresignRequest = z.infer<typeof PresignRequestSchema>;

export const PresignResponseSchema = z.object({
  attachmentId: z.string().uuid(),
  uploadUrl: z.string().url(),
  objectKey: z.string(),
});
export type PresignResponse = z.infer<typeof PresignResponseSchema>;

export const ConfirmUploadSchema = z.object({
  attachmentId: z.string().uuid(),
});
export type ConfirmUpload = z.infer<typeof ConfirmUploadSchema>;
