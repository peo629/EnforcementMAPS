import { z } from 'zod';

export const AuditEntryResponseSchema = z.object({
  id: z.string().uuid(),
  actorUserId: z.string().nullable(),
  actorDisplayName: z.string().nullable().optional(),
  entityType: z.string(),
  entityId: z.string(),
  action: z.string(),
  beforeJson: z.any().nullable(),
  afterJson: z.any().nullable(),
  createdAt: z.string(),
});
export type AuditEntryResponse = z.infer<typeof AuditEntryResponseSchema>;
