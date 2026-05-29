import type { ApiResponse, PaginatedResponse, UserRef } from "./common";

// ─── Entity ───────────────────────────────────────────────────────────────
export interface PayrollRecord {
  id: string;
  user_id: string;
  user_name?: string;
  employee_id?: string;
  department?: string;
  basic_pay: number;
  allowances: number;
  deductions: number;
  net_pay: number;
  pay_period_start: string;
  pay_period_end: string;
  payment_date: string | null;
  status: "processed" | "pending" | "cancelled";
  created_at: string;
  updated_at: string;
}

// ─── Request DTOs ─────────────────────────────────────────────────────────
export interface ProcessPayrollRequest {
  userId: string;
  basicPay?: number | string;
  allowances?: number | string;
  deductions?: number | string;
  payPeriodStart: string;
  payPeriodEnd: string;
  paymentDate?: string;
}

export interface ListPayrollQuery {
  userId?: string;
  status?: "processed" | "pending" | "cancelled";
  page?: number | string;
  limit?: number | string;
}

// ─── Response DTOs ────────────────────────────────────────────────────────
export interface PayrollProcessResponse extends ApiResponse {
  payroll: PayrollRecord;
}

export interface PayrollListResponse extends PaginatedResponse<PayrollRecord> {
  payroll: PayrollRecord[];
}

export interface PayrollGetResponse extends ApiResponse {
  payroll: PayrollRecord;
}

export interface PayrollDeleteResponse extends ApiResponse {
  message: string;
}
