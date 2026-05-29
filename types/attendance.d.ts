import type { ApiResponse } from "./common";

// ─── Entities ─────────────────────────────────────────────────────────────
export interface QrCheckinToken {
  id: string;
  token: string;
  user_id: string;
  used: boolean;
  used_by: string | null;
  used_at: string | null;
  expires_at: string;
  created_at: string;
}

export interface CheckinRecord {
  id: string;
  user_id: string;
  type: "checkin" | "checkout";
  ip_address: string | null;
  location: string | null;
  note: string | null;
  created_at: string;
}

// ─── Request DTOs ─────────────────────────────────────────────────────────
export interface GenerateQrTokenRequest {
  userId: string;
}

export interface QrCheckinRequest {
  qrToken: string;
}

export interface GeoCheckinRequest {
  latitude: number | string;
  longitude: number | string;
}

// ─── Response DTOs ────────────────────────────────────────────────────────
export interface GenerateQrTokenResponse extends ApiResponse {
  token: string;
  expires_at: string;
}

export interface QrCheckinResponse extends ApiResponse {
  message: string;
}

export interface GeoCheckinResponse extends ApiResponse {
  message: string;
  distance: number;
}
