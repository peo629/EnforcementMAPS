import { z } from 'zod';
import { AssignmentStatus, AssignmentSource } from '../schema/enums';

export const CreateAssignmentSchema = z.object({
  zoneId: z.string().min(1),
  officerUserId: z.string().uuid(),
});
export type CreateAssignment = z.infer<typeof CreateAssignmentSchema>;

export const AssignmentResponseSchema = z.object({
  id: z.string().uuid(),
  zoneId: z.string(),
  zoneName: z.string().optional(),
  officerUserId: z.string(),
  officerDisplayName: z.string().optional(),
  officerNumber: z.string().nullable().optional(),
  status: z.enum([AssignmentStatus.ACTIVE, AssignmentStatus.ENDED]),
  assignedByUserId: z.string(),
  assignedAt: z.string(),
  endedByUserId: z.string().nullable(),
  endedAt: z.string().nullable(),
  source: z.enum([AssignmentSource.ADMIN_UI, AssignmentSource.SYSTEM]),
  // Presence + Code2 enrichment for dashboard
  isOnline: z.boolean().optional(),
  lastSeenAt: z.string().nullable().optional(),
  hasCode2: z.boolean().optional(),
  lastCode2At: z.string().nullable().optional(),
});
export type AssignmentResponse = z.infer<typeof AssignmentResponseSchema>;
