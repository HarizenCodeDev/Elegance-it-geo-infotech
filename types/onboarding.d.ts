import type { ApiResponse, PaginatedResponse } from "./common";

// ─── Entities ─────────────────────────────────────────────────────────────
export interface OnboardingTask {
  id: string;
  user_id: string;
  user_name?: string;
  employee_id?: string;
  task_name: string;
  description: string | null;
  assigned_to: string | null;
  assigned_to_name?: string;
  due_date: string | null;
  status: "pending" | "in_progress" | "completed";
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface OnboardingChecklistItem {
  id: string;
  user_id: string;
  item: string;
  is_completed: boolean;
  completed_at: string | null;
  created_at: string;
}

// ─── Request DTOs ─────────────────────────────────────────────────────────
export interface CreateTaskRequest {
  userId: string;
  taskName: string;
  description?: string;
  assignedTo?: string;
  dueDate?: string;
}

export interface UpdateTaskStatusRequest {
  status: "pending" | "in_progress" | "completed";
}

export interface ListTasksQuery {
  userId?: string;
  status?: "pending" | "in_progress" | "completed";
  page?: number | string;
  limit?: number | string;
}

export interface CreateChecklistItemRequest {
  userId: string;
  item: string;
}

export interface ListChecklistQuery {
  userId?: string;
}

// ─── Response DTOs ────────────────────────────────────────────────────────
export interface TaskCreateResponse extends ApiResponse {
  task: OnboardingTask;
}

export interface TaskListResponse extends PaginatedResponse<OnboardingTask> {
  tasks: OnboardingTask[];
}

export interface TaskStatusResponse extends ApiResponse {
  message: string;
}

export interface ChecklistCreateResponse extends ApiResponse {
  checklistItem: OnboardingChecklistItem;
}

export interface ChecklistListResponse extends ApiResponse {
  checklist: OnboardingChecklistItem[];
}

export interface ChecklistToggleResponse extends ApiResponse {
  is_completed: boolean;
}
