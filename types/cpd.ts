export type UserRole =
  | "administrator"
  | "coordinator"
  | "technician"
  | "purchasing"
  | "viewer";

export type Priority = "low" | "medium" | "high" | "urgent";

export type DemandKind = "internal" | "field";

export type DemandStatus =
  | "open"
  | "in_progress"
  | "waiting_material"
  | "done"
  | "canceled";

export type RequestStatus =
  | "draft"
  | "sent"
  | "review"
  | "approved"
  | "buying"
  | "received"
  | "done"
  | "rejected"
  | "canceled";

export type StockMovementType = "entry" | "exit" | "transfer" | "write_off";

export type AssetCondition =
  | "active"
  | "maintenance"
  | "reserved"
  | "damaged"
  | "written_off";

export interface DashboardMetric {
  label: string;
  value: string;
  delta?: string;
  tone?: "blue" | "emerald" | "amber" | "violet" | "rose";
}

export interface DemandItem {
  id: string;
  kind: DemandKind;
  number: string;
  requester: string;
  sector?: string;
  owner: string;
  summary: string;
  date: string;
  priority: Priority;
  status: DemandStatus;
  attachments?: number;
  notes: string;
  patrimony?: string;
  equipment?: string;
  defect?: string;
  location?: string;
  phoneExtension?: string;
  openedBy?: string;
  openedAt?: string;
  closedAt?: string;
  report?: string;
}

export interface RequestItem {
  id: string;
  number: string;
  category: string;
  item: string;
  quantity: number;
  requester: string;
  justification: string;
  notes: string;
  priority: Priority;
  status: RequestStatus;
}

export type StockItem = {
  id: string;
  name: string;
  specification: string;
  type: string;
  categoryId: string;
  quantity: number;
};

export type StockCategory = {
  id: string;
  name: string;
  description?: string;
};

export type StockFormInput = {
  name: string;
  specification: string;
  type: string;
  categoryId: string;
  quantity: number;
};

export type StockPageData = {
  items: StockItem[];
  categories: StockCategory[];
};

export interface AssetItem {
  id: string;
  patrimonyNumber: string;
  equipment: string;
  model: string;
  brand: string;
  serialNumber: string;
  secretary: string;
  responsible: string;
  condition: AssetCondition;
  notes: string;
}

export interface ActivityItem {
  id: string;
  actor: string;
  action: string;
  target: string;
  previousValue: string;
  currentValue: string;
  timestamp: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: UserRole;
  active: boolean;
  email: string;
  lastAccess: string;
}

export interface ChartPoint {
  label: string;
  value: number;
}
