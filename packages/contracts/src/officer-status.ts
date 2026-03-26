import { z } from 'zod';
import { OfficerEventType, EventSource } from '../schema/enums';

export const LogCode2Schema = z.object({
  officerUserId: z.string().uuid(),
  notes: z.string().optional(),
  source: z.enum([EventSource.RADIO, EventSource.OFFICER_APP, EventSource.ADMIN_UI, EventSource.SYSTEM]).default(EventSource.ADMIN_UI),
});
export type LogCode2 = z.infer<typeof LogCode2Schema>;

export const OfficerLogCode2Schema = z.object({
  notes: z.string().optional(),
});
export type OfficerLogCode2 = z.infer<typeof OfficerLogCode2Schema>;

export const OfficerStatusEventResponseSchema = z.object({
  id: z.string().uuid(),
  officerUserId: z.string(),
  zoneAssignmentId: z.string().uuid(),
  zoneId: z.string(),
  eventType: z.enum([OfficerEventType.CODE2, OfficerEventType.CODE6, OfficerEventType.OFF_DUTY, OfficerEventType.ACKNOWLEDGED_CODE21]),
  source: z.enum([EventSource.RADIO, EventSource.OFFICER_APP, EventSource.ADMIN_UI, EventSource.SYSTEM]),
  notes: z.string().nullable(),
  createdByUserId: z.string().nullable(),
  createdAt: z.string(),
});
export type OfficerStatusEventResponse = z.infer<typeof OfficerStatusEventResponseSchema>;
