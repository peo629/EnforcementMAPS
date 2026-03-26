import { z } from 'zod';

export const DashboardSnapshotSchema = z.object({
  activeZones: z.number(),
  totalZones: z.number(),
  onlineOfficers: z.number(),
  totalOfficers: z.number(),
  code2LoggedCount: z.number(),
  unassignedCode21Count: z.number(),
  activeCode21Count: z.number(),
  assignedZones: z.array(z.object({
    zoneId: z.string(),
    zoneName: z.string(),
    officerName: z.string().nullable(),
    officerUserId: z.string().nullable(),
    isOnline: z.boolean(),
    hasCode2: z.boolean(),
  })),
  recentCode21s: z.array(z.object({
    id: z.string(),
    addressLabel: z.string(),
    status: z.string(),
    zoneId: z.string().nullable(),
    createdAt: z.string(),
  })),
});
export type DashboardSnapshot = z.infer<typeof DashboardSnapshotSchema>;
