// Common types used across the application
export interface User {
  _id: string;
  id?: string; // For backward compatibility
  name: string;
  email: string;
  role: string;
  avatar?: string;
  preferences?: UserPreferences;
  isEmailVerified?: boolean;
  lastLogin?: string;
  isDemo?: boolean;
}

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  notifications?: NotificationSettings;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  desktop: boolean;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  title?: string;
  autoHideDuration?: number;
}

export interface WidgetProps {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  children?: React.ReactNode;
  onRefresh?: () => void;
  onDownload?: () => void;
  onSettings?: () => void;
  onFullscreen?: () => void;
}

export interface ChartData {
  id: string;
  value: number;
  label: string;
  color?: string;
  category?: string;
  date?: string | Date;
}
