// ─── RBAC ────────────────────────────────────────────────────
export const UserRole = {
  ADMIN: 'ADMIN',
  DISPATCHER: 'DISPATCHER',
  SUPERVISOR: 'SUPERVISOR',
  OFFICER: 'OFFICER',
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

// ─── Zone assignment ─────────────────────────────────────────
export const AssignmentStatus = {
  ACTIVE: 'ACTIVE',
  ENDED: 'ENDED',
} as const;
export type AssignmentStatus = (typeof AssignmentStatus)[keyof typeof AssignmentStatus];

export const AssignmentSource = {
  ADMIN_UI: 'ADMIN_UI',
  SYSTEM: 'SYSTEM',
} as const;
export type AssignmentSource = (typeof AssignmentSource)[keyof typeof AssignmentSource];

// ─── Code21 ──────────────────────────────────────────────────
export const Code21Status = {
  NEW: 'NEW',
  DISPATCHED: 'DISPATCHED',
  ACKNOWLEDGED: 'ACKNOWLEDGED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  UNASSIGNED: 'UNASSIGNED',
} as const;
export type Code21Status = (typeof Code21Status)[keyof typeof Code21Status];

export const TravelMode = {
  FOOT: 'FOOT',
  VEHICLE: 'VEHICLE',
} as const;
export type TravelMode = (typeof TravelMode)[keyof typeof TravelMode];

// ─── Officer status events ───────────────────────────────────
export const OfficerEventType = {
  CODE2: 'CODE2',
  CODE6: 'CODE6',
  OFF_DUTY: 'OFF_DUTY',
  ACKNOWLEDGED_CODE21: 'ACKNOWLEDGED_CODE21',
} as const;
export type OfficerEventType = (typeof OfficerEventType)[keyof typeof OfficerEventType];

export const EventSource = {
  RADIO: 'RADIO',
  OFFICER_APP: 'OFFICER_APP',
  ADMIN_UI: 'ADMIN_UI',
  SYSTEM: 'SYSTEM',
} as const;
export type EventSource = (typeof EventSource)[keyof typeof EventSource];

// ─── Presence ────────────────────────────────────────────────
export const ClientType = {
  WEB: 'WEB',
  ANDROID: 'ANDROID',
  IOS: 'IOS',
} as const;
export type ClientType = (typeof ClientType)[keyof typeof ClientType];

// ─── Attachments ─────────────────────────────────────────────
export const UploadStatus = {
  PRESIGNED: 'PRESIGNED',
  UPLOADED: 'UPLOADED',
  FAILED: 'FAILED',
} as const;
export type UploadStatus = (typeof UploadStatus)[keyof typeof UploadStatus];

export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'application/pdf',
] as const;
export type AllowedMimeType = (typeof ALLOWED_MIME_TYPES)[number];

export const ATTACHMENT_LIMITS = {
  maxPerCode21: 5,
  maxImageBytes: 10 * 1024 * 1024,   // 10 MB
  maxPdfBytes: 20 * 1024 * 1024,     // 20 MB
} as const;

// ─── Notifications ───────────────────────────────────────────
export const NotificationType = {
  CODE21_ASSIGNED: 'CODE21_ASSIGNED',
} as const;
export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType];

export const NotificationProvider = {
  EXPO_PUSH: 'EXPO_PUSH',
  IN_APP: 'IN_APP',
} as const;
export type NotificationProvider = (typeof NotificationProvider)[keyof typeof NotificationProvider];

export const NotificationStatus = {
  PENDING: 'PENDING',
  SENT: 'SENT',
  DELIVERED: 'DELIVERED',
  FAILED: 'FAILED',
} as const;
export type NotificationStatus = (typeof NotificationStatus)[keyof typeof NotificationStatus];

export const DevicePlatform = {
  ANDROID: 'ANDROID',
  IOS: 'IOS',
  WEB: 'WEB',
} as const;
export type DevicePlatform = (typeof DevicePlatform)[keyof typeof DevicePlatform];

// ─── Audit ───────────────────────────────────────────────────
export const AuditEntityType = {
  ZONE_ASSIGNMENT: 'ZONE_ASSIGNMENT',
  CODE21: 'CODE21',
  ATTACHMENT: 'ATTACHMENT',
  CODE2_EVENT: 'CODE2_EVENT',
  USER: 'USER',
} as const;
export type AuditEntityType = (typeof AuditEntityType)[keyof typeof AuditEntityType];

export const AuditAction = {
  CREATE: 'CREATE',
  ASSIGN: 'ASSIGN',
  REASSIGN: 'REASSIGN',
  END: 'END',
  UPDATE: 'UPDATE',
  UPLOAD: 'UPLOAD',
  LOG_CODE2: 'LOG_CODE2',
  ACKNOWLEDGE: 'ACKNOWLEDGE',
  COMPLETE: 'COMPLETE',
  CANCEL: 'CANCEL',
  NOTIFY: 'NOTIFY',
} as const;
export type AuditAction = (typeof AuditAction)[keyof typeof AuditAction];
