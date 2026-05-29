export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  pagination: Pagination;
  [items: string]: T[] | boolean | Pagination | undefined;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface UserRef {
  _id: string;
  id?: string;
  name: string;
  employee_id: string;
  employeeId?: string;
  department: string;
  role: UserRole;
  email?: string;
  avatar?: string;
}

export type UserRole = "root" | "admin" | "manager" | "hr" | "teamlead" | "developer";

export interface AuthUser extends UserRef {
  iat?: number;
  exp?: number;
}
