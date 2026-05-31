import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Server, 
  Users, 
  Network, 
  Settings, 
  CreditCard,
  Bell,
  Shield,
  LogOut,
  X
} from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { cn } from '../../lib/utils';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/servers', icon: Server, label: 'Servers' },
  { path: '/users', icon: Users, label: 'Users' },
  { path: '/inbounds', icon: Network, label: 'Inbounds' },
  { path: '/subscriptions', icon: CreditCard, label: 'Subscriptions' },
  { path: '/alerts', icon: Bell, label: 'Alerts' },
  { path: '/admin', icon: Shield, label: 'Admin' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar({ open, onClose }: SidebarProps) {
  const {} = useAppStore();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-50 h-screen bg-white dark:bg-dark-100 border-r border-gray-200 dark:border-dark-300",
        "transition-all duration-300 ease-in-out",
        "flex flex-col",
        open ? "w-64" : "w-20 lg:w-20",
        !open && "-translate-x-full lg:translate-x-0"
      )}>
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100 dark:border-dark-300">
          {open && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <span className="text-white font-bold text-sm">4X</span>
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">4X-UI</span>
            </div>
          )}
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-200 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-thin">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "sidebar-link",
                isActive && "active"
              )}
              onClick={onClose}
            >
              <item.icon size={20} />
              {open && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>
        
        {/* Bottom section */}
        <div className="p-4 border-t border-gray-100 dark:border-dark-300">
          {open ? (
            <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-200 rounded-lg transition-colors">
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          ) : (
            <button className="flex items-center justify-center w-full p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-200 rounded-lg transition-colors">
              <LogOut size={18} />
            </button>
          )}
        </div>
      </aside>
    </>
  );
}