export type {
  ApiResponse,
  PaginatedResponse,
  Pagination,
  UserRef,
  AuthUser,
  UserRole,
} from "./common";

export type {
  PayrollRecord,
  ProcessPayrollRequest,
  ListPayrollQuery,
  PayrollProcessResponse,
  PayrollListResponse,
  PayrollGetResponse,
  PayrollDeleteResponse,
} from "./payroll";

export type {
  SalarySlip,
  GenerateSlipRequest,
  ListSlipsQuery,
  SlipGenerateResponse,
  SlipListResponse,
  SlipDownloadResponse,
} from "./salarySlip";

export type {
  Resignation,
  SubmitResignationRequest,
  UpdateResignationStatusRequest,
  ListResignationsQuery,
  ResignationSubmitResponse,
  ResignationListResponse,
  ResignationStatusResponse,
} from "./resignation";

export type {
  OnboardingTask,
  OnboardingChecklistItem,
  CreateTaskRequest,
  UpdateTaskStatusRequest,
  ListTasksQuery,
  CreateChecklistItemRequest,
  ListChecklistQuery,
  TaskCreateResponse,
  TaskListResponse,
  TaskStatusResponse,
  ChecklistCreateResponse,
  ChecklistListResponse,
  ChecklistToggleResponse,
} from "./onboarding";

export type {
  QrCheckinToken,
  CheckinRecord,
  GenerateQrTokenRequest,
  QrCheckinRequest,
  GeoCheckinRequest,
  GenerateQrTokenResponse,
  QrCheckinResponse,
  GeoCheckinResponse,
} from "./attendance";
