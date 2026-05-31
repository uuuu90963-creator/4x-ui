export type Theme = 'light' | 'dark' | 'auto';

// User types
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'moderator' | 'user';
  createdAt: string;
  updatedAt: string;
}

// Server types
export interface Server {
  id: string;
  name: string;
  host: string;
  port: number;
  sshKeyPath?: string;
  status: 'online' | 'offline' | 'degraded' | 'unknown';
  lastHealthCheck: string | null;
  cpuUsage: number;
  memoryUsage: number;
  bandwidthIn: number;
  bandwidthOut: number;
  createdAt: string;
  updatedAt: string;
}

// Inbound types
export type Protocol = 'vmess' | 'vless' | 'trojan' | 'shadowsocks' | 'wireguard' | 'hysteria' | 'grpc' | 'http';

export interface Inbound {
  id: string;
  serverId: string;
  protocol: Protocol;
  port: number;
  remark: string;
  settings: string; // JSON string of inbound settings
  enable: boolean;
  streamSettings?: StreamSettings;
  createdAt: string;
  updatedAt: string;
}

export interface StreamSettings {
  network: 'tcp' | 'udp' | 'ws' | 'grpc' | 'h2';
  security: 'tls' | 'reality' | 'none';
  wsPath?: string;
  wsHost?: string;
  sni?: string;
  alpn?: string[];
}

// Client types
export interface Client {
  id: string;
  inboundId: string;
  email: string;
  uuid: string;
  enable: boolean;
  flow?: string;
  alterId?: number;
  expiryTime: string | null;
  totalLimitGB: number | null; // in GB
  reset: number; // traffic reset interval in days
  upload: number;
  download: number;
  createdAt: string;
  updatedAt: string;
}

// Stats types
export interface ServerStats {
  serverId: string;
  timestamp: string;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  bandwidthIn: number;
  bandwidthOut: number;
  activeConnections: number;
}

export interface TrafficStats {
  clientId: string;
  upload: number;
  download: number;
  timestamp: string;
}

// Subscription types
export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  durationDays: number;
  bandwidthLimitGB: number | null;
  description: string;
  features: string[];
  active: boolean;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'expired' | 'cancelled';
  startDate: string;
  expiryDate: string;
  autoRenew: boolean;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// WebSocket event types
export interface WsEvent {
  type: 'stats:update' | 'user:joined' | 'alert:triggered' | 'traffic:threshold' | 'server:status';
  payload: unknown;
  timestamp: string;
}

// Alert types
export interface Alert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  message: string;
  serverId?: string;
  read: boolean;
  createdAt: string;
}

// Settings types
export interface PanelSettings {
  panelName: string;
  panelUrl: string;
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  smtpEnabled: boolean;
  smtpHost?: string;
  smtpPort?: number;
  telegramEnabled: boolean;
  telegramBotToken?: string;
  telegramChatId?: string;
  maintenanceMode: boolean;
}

// Authentication types
export interface LoginCredentials {
  username: string;
  password: string;
  totpCode?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface Session {
  user: User;
  tokens: AuthTokens;
  expiresAt: string;
}