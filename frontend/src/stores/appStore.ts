import { create } from 'zustand';
import type { User, Server, Alert, Theme } from '../types';

interface AppState {
  // User
  user: User | null;
  isAuthenticated: boolean;
  
  // Servers
  servers: Server[];
  selectedServerId: string | null;
  
  // Theme
  theme: Theme;
  sidebarOpen: boolean;
  
  // WebSocket
  wsConnected: boolean;
  
  // Alerts
  alerts: Alert[];
  
  // Actions
  setUser: (user: User | null) => void;
  setAuthenticated: (isAuth: boolean) => void;
  setServers: (servers: Server[]) => void;
  setSelectedServer: (serverId: string | null) => void;
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  setWsConnected: (connected: boolean) => void;
  setAlerts: (alerts: Alert[]) => void;
  addAlert: (alert: Alert) => void;
  markAlertRead: (alertId: string) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  servers: [],
  selectedServerId: null,
  theme: 'dark',
  sidebarOpen: true,
  wsConnected: false,
  alerts: [],
  
  // Actions
  setUser: (user) => set({ user }),
  setAuthenticated: (isAuth) => set({ isAuthenticated: isAuth }),
  
  setServers: (servers) => set({ servers }),
  setSelectedServer: (serverId) => set({ selectedServerId: serverId }),
  
  setTheme: (theme) => set({ theme }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  
  setWsConnected: (connected) => set({ wsConnected: connected }),
  
  setAlerts: (alerts) => set({ alerts }),
  addAlert: (alert) => set((state) => ({ alerts: [alert, ...state.alerts] })),
  markAlertRead: (alertId) => set((state) => ({
    alerts: state.alerts.map((a) => 
      a.id === alertId ? { ...a, read: true } : a
    )
  })),
  
  logout: () => set({
    user: null,
    isAuthenticated: false,
    servers: [],
    selectedServerId: null
  }),
}));