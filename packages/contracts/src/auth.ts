import { z } from 'zod';
import { UserRole } from '../schema/enums';

export const LoginRequestSchema = z.object({
  email: z.string().email().optional(),
  officerNumber: z.coerce.number().int().positive().optional(),
  password: z.string().min(1),
}).refine((value) => Boolean(value.email || value.officerNumber), {
  message: 'Either email or officerNumber is required',
  path: ['email'],
});
export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const UserResponseSchema = z.object({
  id: z.union([z.string(), z.number()]),
  email: z.string().email(),
  displayName: z.string(),
  officerNumber: z.number().int().positive().nullable(),
  role: z.enum([UserRole.ADMIN, UserRole.DISPATCHER, UserRole.SUPERVISOR, UserRole.OFFICER]),
  isActive: z.boolean(),
});
export type UserResponse = z.infer<typeof UserResponseSchema>;

export const AuthResponseSchema = z.object({
  user: UserResponseSchema,
  token: z.string(),
});
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
