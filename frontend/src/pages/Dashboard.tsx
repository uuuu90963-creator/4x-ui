import { useState, useEffect } from 'react';
import { 
  Server, 
  Users, 
  Activity, 
  TrendingUp, 
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Wifi,
  WifiOff,
  Clock,
  AlertCircle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { cn, formatBytes, getStatusColor, getStatusBgColor } from '../../lib/utils';
import { useAppStore } from '../../stores/appStore';

// Mock data for demo
const mockServers = [
  { id: '1', name: 'US Server 1', host: 'us1.example.com', status: 'online' as const, cpuUsage: 45, memoryUsage: 62, bandwidthIn: 1024000000, bandwidthOut: 2048000000 },
  { id: '2', name: 'EU Server 1', host: 'eu1.example.com', status: 'degraded' as const, cpuUsage: 78, memoryUsage: 85, bandwidthIn: 512000000, bandwidthOut: 1024000000 },
  { id: '3', name: 'Asia Server 1', host: 'asia1.example.com', status: 'online' as const, cpuUsage: 23, memoryUsage: 41, bandwidthIn: 2048000000, bandwidthOut: 4096000000 },
];

const mockTrafficData = [
  { time: '00:00', upload: 1.2, download: 2.4 },
  { time: '04:00', upload: 0.8, download: 1.6 },
  { time: '08:00', upload: 2.1, download: 3.8 },
  { time: '12:00', upload: 3.5, download: 6.2 },
  { time: '16:00', upload: 4.2, download: 7.1 },
  { time: '20:00', upload: 3.8, download: 5.9 },
  { time: '24:00', upload: 2.5, download: 4.2 },
];

const mockStats = {
  totalServers: 12,
  onlineServers: 10,
  totalUsers: 3458,
  activeUsers: 847,
  totalBandwidth: 1024000000000,
  totalTrafficUsed: 512000000000,
};

export default function Dashboard() {
  const { servers, setServers } = useAppStore();
  const [trafficPeriod, setTrafficPeriod] = useState<'day' | 'week' | 'month'>('day');

  useEffect(() => {
    // Simulate loading servers
    if (servers.length === 0) {
      setServers(mockServers);
    }
  }, []);

  const activeServers = mockServers.filter(s => s.status === 'online').length;
  const totalCpu = mockServers.reduce((acc, s) => acc + s.cpuUsage, 0) / mockServers.length;
  const totalMem = mockServers.reduce((acc, s) => acc + s.memoryUsage, 0) / mockServers.length;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Welcome back! Here's an overview of your proxy network.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Servers */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Servers</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{mockStats.totalServers}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <Server className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className={cn("flex items-center gap-1 text-xs font-medium",
              activeServers === mockStats.totalServers ? 'text-green-600' : 'text-yellow-600')}>
              {activeServers === mockStats.totalServers ? <ArrowUpRight size={14} /> : <AlertCircle size={14} />}
              {activeServers} online
            </span>
            <span className="text-xs text-gray-400">/ {mockStats.totalServers} total</span>
          </div>
        </div>

        {/* Total Users */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {mockStats.totalUsers.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="flex items-center gap-1 text-xs font-medium text-green-600">
              <TrendingUp size={14} />
              {mockStats.activeUsers} active
            </span>
            <span className="text-xs text-gray-400">right now</span>
          </div>
        </div>

        {/* Total Bandwidth */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Bandwidth</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {formatBytes(mockStats.totalBandwidth)}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
              <Activity className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="flex items-center gap-1 text-xs font-medium text-purple-600">
              <TrendingUp size={14} />
              {formatBytes(mockStats.totalBandwidth - mockStats.totalTrafficUsed)} available
            </span>
          </div>
        </div>

        {/* Traffic Used */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Traffic Used</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {formatBytes(mockStats.totalTrafficUsed)}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
              <Wifi className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs text-gray-400">
              {((mockStats.totalTrafficUsed / mockStats.totalBandwidth) * 100).toFixed(1)}% of total
            </span>
          </div>
        </div>
      </div>

      {/* Charts and servers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Traffic chart */}
        <div className="lg:col-span-2 card">
          <div className="card-header flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-white">Traffic Overview</h3>
            <div className="flex gap-2">
              {(['day', 'week', 'month'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setTrafficPeriod(period)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors",
                    trafficPeriod === period
                      ? "bg-primary-600 text-white"
                      : "bg-gray-100 dark:bg-dark-200 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-300"
                  )}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="card-body">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockTrafficData}>
                  <defs>
                    <linearGradient id="colorUpload" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorDownload" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-dark-300" />
                  <XAxis dataKey="time" className="text-xs" tick={{ fill: '#9ca3af' }} />
                  <YAxis className="text-xs" tick={{ fill: '#9ca3af' }} tickFormatter={(v) => `${v}GB`} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                    labelStyle={{ color: '#9ca3af' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="download"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    fill="url(#colorDownload)"
                    name="Download"
                  />
                  <Area
                    type="monotone"
                    dataKey="upload"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    fill="url(#colorUpload)"
                    name="Upload"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* System health */}
        <div className="card">
          <div className="card-header">
            <h3 className="font-semibold text-gray-900 dark:text-white">System Health</h3>
          </div>
          <div className="card-body space-y-6">
            {/* CPU */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">CPU Usage</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{totalCpu.toFixed(1)}%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 dark:bg-dark-200 rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    totalCpu > 80 ? "bg-red-500" : totalCpu > 60 ? "bg-yellow-500" : "bg-green-500"
                  )}
                  style={{ width: `${totalCpu}%` }}
                />
              </div>
            </div>

            {/* Memory */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Memory Usage</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{totalMem.toFixed(1)}%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 dark:bg-dark-200 rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    totalMem > 80 ? "bg-red-500" : totalMem > 60 ? "bg-yellow-500" : "bg-green-500"
                  )}
                  style={{ width: `${totalMem}%` }}
                />
              </div>
            </div>

            {/* Uptime */}
            <div className="pt-4 border-t border-gray-100 dark:border-dark-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">99.98% Uptime</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Last 30 days</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Server list */}
      <div className="card">
        <div className="card-header">
          <h3 className="font-semibold text-gray-900 dark:text-white">Active Servers</h3>
          <a href="/servers" className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400">
            View all →
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Server</th>
                <th>Status</th>
                <th>CPU</th>
                <th>Memory</th>
                <th>Upload</th>
                <th>Download</th>
              </tr>
            </thead>
            <tbody>
              {mockServers.map((server) => (
                <tr key={server.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className={cn("w-2 h-2 rounded-full", getStatusBgColor(server.status))} />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{server.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{server.host}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={cn("badge", `badge-${server.status === 'online' ? 'success' : server.status === 'degraded' ? 'warning' : 'danger'}`)}>
                      {server.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-gray-100 dark:bg-dark-200 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full",
                            server.cpuUsage > 80 ? "bg-red-500" : server.cpuUsage > 60 ? "bg-yellow-500" : "bg-green-500"
                          )}
                          style={{ width: `${server.cpuUsage}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">{server.cpuUsage}%</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-gray-100 dark:bg-dark-200 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full",
                            server.memoryUsage > 80 ? "bg-red-500" : server.memoryUsage > 60 ? "bg-yellow-500" : "bg-green-500"
                          )}
                          style={{ width: `${server.memoryUsage}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">{server.memoryUsage}%</span>
                    </div>
                  </td>
                  <td className="text-sm text-gray-500 dark:text-gray-400">
                    {formatBytes(server.bandwidthOut)}/s
                  </td>
                  <td className="text-sm text-gray-500 dark:text-gray-400">
                    {formatBytes(server.bandwidthIn)}/s
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}