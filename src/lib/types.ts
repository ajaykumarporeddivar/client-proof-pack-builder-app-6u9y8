export type ClientStatus = 'Active' | 'Paused' | 'Archived';
export type ProofPackStatus = 'Draft' | 'Ready for Review' | 'Approved' | 'Exported';
export type CampaignStatus = 'Running' | 'Completed' | 'Paused';
export type ResultType = 'Impressions' | 'Clicks' | 'Conversions' | 'Spend' | 'ROI';
export type ActivityType = 'created' | 'updated' | 'exported' | 'commented' | 'assigned';
export type TaskStatus = 'Pending' | 'In Progress' | 'Completed' | 'Blocked';
export type UserRole = 'Agency Owner' | 'Manager' | 'Editor' | 'Viewer';
export type MessageVariant = 'info' | 'success' | 'warning' | 'error';
export type Theme = 'light' | 'dark' | 'system';

export interface Client {
  id: string;
  name: string;
  contactEmail: string;
  status: ClientStatus;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  campaigns?: Campaign[]; // Optional for easier data management
}

export interface Campaign {
  id: string;
  clientId: string;
  name: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  status: CampaignStatus;
  budget: number;
  currency: string;
  platform: string;
  results?: Result[]; // Optional for easier data management
}

export interface Result {
  id: string;
  campaignId: string;
  date: string; // ISO date string of result measurement
  type: ResultType;
  value: number;
  unit?: string; // e.g., %, $, count
}

export interface ProofPack {
  id: string;
  clientId: string;
  campaignId: string;
  name: string;
  status: ProofPackStatus;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  generatedAt?: string; // ISO date string when exported
  content: {
    summary: string;
    keyMetrics: { type: ResultType; value: number; unit?: string }[];
    insights: string[];
    recommendations: string[];
    files?: string[]; // URLs or file names for attachments
  };
  dueDate?: string;
  assigneeId?: string;
}

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  plan: string;
  avatar: string; // e.g., initials 'SC'
  joinedAt: string;
}

export interface ActivityItem {
  id: string;
  type: ActivityType;
  userId: string;
  userName: string;
  targetId: string; // ID of the item being acted on (e.g., ProofPack ID)
  targetName: string; // Name of the item being acted on
  timestamp: string; // ISO date string
  message: string;
}

export interface StatCardData {
  id: string;
  title: string;
  value: string;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  description: string;
}

export interface ChartDataPoint {
  name: string; // e.g., month, day
  value: number;
}

export interface ChartData {
  title: string;
  description?: string;
  labels: string[]; // e.g., month names
  datasets: {
    label: string;
    data: number[];
    color?: string; // Tailwind color class, e.g., 'bg-zinc-900'
  }[];
}

export interface SparklineData {
  id: string;
  title: string;
  value: string;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  data: number[];
}

export interface FilterState {
  search: string;
  status: string | null;
  client: string | null;
  campaign: string | null;
  sort: string;
  order: 'asc' | 'desc';
}

export interface ToastOptions {
  id?: string;
  title: string;
  message: string;
  variant?: MessageVariant;
  duration?: number; // ms
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface FeatureContent {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType; // Lucide icon component
  status: 'active' | 'locked';
  path: string;
  cta?: string;
}

export interface Task {
  id: string;
  name: string;
  status: TaskStatus;
  dueDate?: string;
  priority: 'High' | 'Medium' | 'Low';
  assignedTo?: string; // User ID
  description?: string;
}

export interface ProofPackInput {
  clientId: string;
  campaignId: string;
  name: string;
  summary: string;
  insights: string[];
  recommendations: string[];
  dueDate?: string;
}