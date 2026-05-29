import type { ApiResponse, PaginatedResponse } from "./common";

// ─── Entity ───────────────────────────────────────────────────────────────
export interface SalarySlip {
  id: string;
  user_id: string;
  payroll_id: string;
  user_name?: string;
  employee_id?: string;
  department?: string;
  basic_pay: number;
  allowances: number;
  deductions: number;
  net_pay: number;
  month: string;
  year: number;
  downloaded_at: string | null;
  created_at: string;
}

// ─── Request DTOs ─────────────────────────────────────────────────────────
export interface GenerateSlipRequest {
  payrollId: string;
}

export interface ListSlipsQuery {
  userId?: string;
  year?: number | string;
  page?: number | string;
  limit?: number | string;
}

// ─── Response DTOs ────────────────────────────────────────────────────────
export interface SlipGenerateResponse extends ApiResponse {
  slip: SalarySlip;
  message?: string;
}

export interface SlipListResponse extends PaginatedResponse<SalarySlip> {
  slips: SalarySlip[];
}

export interface SlipDownloadResponse extends ApiResponse {
  message: string;
}
