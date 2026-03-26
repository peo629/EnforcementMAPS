/**
 * WebSocket event contracts shared between server, admin-web, and officer app.
 */

// ─── Channel names ───────────────────────────────────────────
export type WsChannel =
  | `user:${string}`
  | `zone:${string}`
  | 'admin:dashboard';

// ─── Event names ─────────────────────────────────────────────
export const WsEventName = {
  ASSIGNMENT_CREATED: 'assignment.created',
  ASSIGNMENT_ENDED: 'assignment.ended',
  ASSIGNMENT_CHANGED: 'assignment.changed',
  CODE21_CREATED: 'code21.created',
  CODE21_UPDATED: 'code21.updated',
  CODE21_ASSIGNED: 'code21.assigned',
  CODE21_ATTACHMENT_UPLOADED: 'code21.attachment.uploaded',
  OFFICER_CODE2_LOGGED: 'officer.code2.logged',
  PRESENCE_UPDATED: 'presence.updated',
} as const;
export type WsEventName = (typeof WsEventName)[keyof typeof WsEventName];

// ─── Envelope ────────────────────────────────────────────────
export interface WsMessage<T = unknown> {
  event: WsEventName;
  channel: WsChannel;
  payload: T;
  timestamp: string;
}
