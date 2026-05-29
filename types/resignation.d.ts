import type { ApiResponse, PaginatedResponse } from "./common";

// ─── Entity ───────────────────────────────────────────────────────────────
export interface Resignation {
  id: string;
  user_id: string;
  user_name?: string;
  employee_id?: string;
  department?: string;
  reason: string;
  last_working_day: string;
  status: "Pending" | "Approved" | "Rejected";
  approved_by: string | null;
  approved_by_name?: string;
  approved_at: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Request DTOs ─────────────────────────────────────────────────────────
export interface SubmitResignationRequest {
  reason: string;
  lastWorkingDay: string;
}

export interface UpdateResignationStatusRequest {
  status: "Approved" | "Rejected";
  adminNotes?: string;
}

export interface ListResignationsQuery {
  status?: "Pending" | "Approved" | "Rejected";
  page?: number | string;
  limit?: number | string;
}

// ─── Response DTOs ────────────────────────────────────────────────────────
export interface ResignationSubmitResponse extends ApiResponse {
  resignation: Resignation;
}

export interface ResignationListResponse extends PaginatedResponse<Resignation> {
  resignations: Resignation[];
}

export interface ResignationStatusResponse extends ApiResponse {
  message: string;
}
