import { z } from 'zod';
import { ClientType } from '../schema/enums';

export const RegisterDeviceSchema = z.object({
  platform: z.enum(['ANDROID', 'IOS', 'WEB']),
  expoPushToken: z.string().optional(),
  appVersion: z.string().optional(),
});
export type RegisterDevice = z.infer<typeof RegisterDeviceSchema>;

export const HeartbeatSchema = z.object({
  clientType: z.enum([ClientType.WEB, ClientType.ANDROID, ClientType.IOS]),
});
export type Heartbeat = z.infer<typeof HeartbeatSchema>;
