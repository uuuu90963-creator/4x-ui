import { useState } from 'react';
import { Menu, Bell, Search, Moon, Sun, ChevronDown } from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { cn } from '../../lib/utils';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { theme, setTheme, alerts, user } = useAppStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const unreadAlerts = alerts.filter(a => !a.read).length;

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-dark-100 border-b border-gray-200 dark:border-dark-300 backdrop-blur-sm bg-white/80 dark:bg-dark-100/80">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-200 lg:hidden"
          >
            <Menu size={20} />
          </button>
          
          {/* Search */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-dark-200 rounded-lg w-80">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 w-full"
            />
          </div>
        </div>
        
        {/* Right section */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-200 transition-colors"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          {/* Alerts */}
          <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-200 transition-colors">
            <Bell size={20} />
            {unreadAlerts > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadAlerts}
              </span>
            )}
          </button>
          
          {/* User dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-200 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-medium text-sm">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-200">
                {user?.username || 'User'}
              </span>
              <ChevronDown size={16} className={cn("transition-transform", dropdownOpen && "rotate-180")} />
            </button>
            
            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-100 rounded-lg shadow-lg border border-gray-200 dark:border-dark-300 py-1 z-20">
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-200">
                    Profile
                  </a>
                  <a href="/settings" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-200">
                    Settings
                  </a>
                  <hr className="my-1 border-gray-100 dark:border-dark-300" />
                  <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-dark-200">
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}