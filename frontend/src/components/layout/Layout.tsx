import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAppStore } from '../../stores/appStore';

export default function Layout() {
  const { sidebarOpen, toggleSidebar } = useAppStore();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-500">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={toggleSidebar} />
      
      {/* Main content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        {/* Header */}
        <Header onMenuClick={toggleSidebar} />
        
        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}