import { z } from 'zod';
import { Code21Status, TravelMode } from '../schema/enums';

export const CreateCode21Schema = z.object({
  serviceRequestNumber: z.string().optional(),
  addressLabel: z.string().min(1),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  offenceDate: z.string().optional(),
  offenceTime: z.string().optional(),
  offenceType: z.string().min(1),
  code21Type: z.string().min(1),
  dispatchNotes: z.string().default(''),
  attendanceNotes: z.string().optional(),
  travelMode: z.enum([TravelMode.FOOT, TravelMode.VEHICLE]).default(TravelMode.FOOT),
  description: z.string().min(1),
});
export type CreateCode21 = z.infer<typeof CreateCode21Schema>;

export const Code21ResponseSchema = z.object({
  id: z.string().uuid(),
  serviceRequestNumber: z.string().nullable(),
  addressLabel: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  zoneId: z.string().nullable(),
  zoneName: z.string().nullable().optional(),
  assignedOfficerUserId: z.string().nullable(),
  assignedOfficerName: z.string().nullable().optional(),
  createdByUserId: z.string(),
  requestTime: z.string(),
  offenceDate: z.string().nullable(),
  offenceTime: z.string().nullable(),
  offenceType: z.string(),
  code21Type: z.string(),
  dispatchNotes: z.string(),
  attendanceNotes: z.string().nullable(),
  travelMode: z.enum([TravelMode.FOOT, TravelMode.VEHICLE]),
  description: z.string(),
  status: z.enum([
    Code21Status.NEW,
    Code21Status.DISPATCHED,
    Code21Status.ACKNOWLEDGED,
    Code21Status.IN_PROGRESS,
    Code21Status.COMPLETED,
    Code21Status.CANCELLED,
    Code21Status.UNASSIGNED,
  ]),
  notifiedAt: z.string().nullable(),
  acknowledgedAt: z.string().nullable(),
  completedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  attachments: z.array(z.object({
    id: z.string().uuid(),
    originalFilename: z.string(),
    mimeType: z.string(),
    sizeBytes: z.number(),
    uploadStatus: z.string(),
    createdAt: z.string(),
  })).optional(),
});
export type Code21Response = z.infer<typeof Code21ResponseSchema>;

export const UpdateCode21Schema = z.object({
  status: z.enum([
    Code21Status.NEW,
    Code21Status.DISPATCHED,
    Code21Status.ACKNOWLEDGED,
    Code21Status.IN_PROGRESS,
    Code21Status.COMPLETED,
    Code21Status.CANCELLED,
    Code21Status.UNASSIGNED,
  ]).optional(),
  dispatchNotes: z.string().optional(),
  attendanceNotes: z.string().optional(),
});
export type UpdateCode21 = z.infer<typeof UpdateCode21Schema>;

export const ReassignCode21Schema = z.object({
  targetZoneId: z.string().optional(),
  targetOfficerUserId: z.string().uuid().optional(),
});
export type ReassignCode21 = z.infer<typeof ReassignCode21Schema>;
