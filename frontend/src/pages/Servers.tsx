import { useState } from 'react';
import { 
  Server, 
  Plus, 
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Activity,
  Eye,
  EyeOff,
  Copy,
  Shield
} from 'lucide-react';
import { cn, formatBytes, getStatusColor, getStatusBgColor, copyToClipboard } from '../../lib/utils';

// Mock data
const mockServers = [
  { id: '1', name: 'US Server 1', host: 'us1.example.com', port: 22, status: 'online' as const, cpuUsage: 45, memoryUsage: 62, bandwidthIn: 1024000000, bandwidthOut: 2048000000, users: 234, createdAt: '2024-01-15' },
  { id: '2', name: 'EU Server 1', host: 'eu1.example.com', port: 22, status: 'degraded' as const, cpuUsage: 78, memoryUsage: 85, bandwidthIn: 512000000, bandwidthOut: 1024000000, users: 189, createdAt: '2024-02-20' },
  { id: '3', name: 'Asia Server 1', host: 'asia1.example.com', port: 22, status: 'online' as const, cpuUsage: 23, memoryUsage: 41, bandwidthIn: 2048000000, bandwidthOut: 4096000000, users: 456, createdAt: '2024-03-10' },
  { id: '4', name: 'Japan Server 1', host: 'jp1.example.com', port: 22, status: 'offline' as const, cpuUsage: 0, memoryUsage: 0, bandwidthIn: 0, bandwidthOut: 0, users: 0, createdAt: '2024-04-05' },
  { id: '5', name: 'Singapore Server 1', host: 'sg1.example.com', port: 22, status: 'online' as const, cpuUsage: 56, memoryUsage: 48, bandwidthIn: 1536000000, bandwidthOut: 3072000000, users: 312, createdAt: '2024-05-12' },
];

export default function Servers() {
  const [servers, setServers] = useState(mockServers);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedServer, setSelectedServer] = useState<string | null>(null);

  const filteredServers = servers.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.host.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleHealthCheck = async (id: string) => {
    // Simulate health check
    console.log('Health check for', id);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this server?')) {
      setServers(servers.filter(s => s.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Servers</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your proxy server nodes
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary"
        >
          <Plus size={18} />
          Add Server
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <Server className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Servers</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{servers.length}</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Online</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {servers.filter(s => s.status === 'online').length}
              </p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Degraded</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {servers.filter(s => s.status === 'degraded').length}
              </p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Offline</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {servers.filter(s => s.status === 'offline').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="card">
        <div className="p-4 border-b border-gray-100 dark:border-dark-300">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search servers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Server</th>
                <th>Status</th>
                <th>CPU</th>
                <th>Memory</th>
                <th>Traffic</th>
                <th>Users</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredServers.map((server) => (
                <tr key={server.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className={cn("w-3 h-3 rounded-full", getStatusBgColor(server.status))} />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{server.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {server.host}:{server.port}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={cn("badge", 
                      server.status === 'online' ? 'badge-success' : 
                      server.status === 'degraded' ? 'badge-warning' : 'badge-danger'
                    )}>
                      {server.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-gray-100 dark:bg-dark-200 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full",
                            server.cpuUsage > 80 ? "bg-red-500" : server.cpuUsage > 60 ? "bg-yellow-500" : "bg-green-500"
                          )}
                          style={{ width: `${server.cpuUsage}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 w-10">{server.cpuUsage}%</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-gray-100 dark:bg-dark-200 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full",
                            server.memoryUsage > 80 ? "bg-red-500" : server.memoryUsage > 60 ? "bg-yellow-500" : "bg-green-500"
                          )}
                          style={{ width: `${server.memoryUsage}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 w-10">{server.memoryUsage}%</span>
                    </div>
                  </td>
                  <td>
                    <div className="text-xs">
                      <p className="text-gray-900 dark:text-white">↑ {formatBytes(server.bandwidthOut)}/s</p>
                      <p className="text-gray-500 dark:text-gray-400">↓ {formatBytes(server.bandwidthIn)}/s</p>
                    </div>
                  </td>
                  <td>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{server.users}</span>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => handleHealthCheck(server.id)}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-200 text-gray-600 dark:text-gray-400"
                        title="Health Check"
                      >
                        <RefreshCw size={16} />
                      </button>
                      <button 
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-200 text-gray-600 dark:text-gray-400"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(server.id)}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-200 text-red-600"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Server Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowAddModal(false)} />
          <div className="relative card w-full max-w-lg p-6 z-10">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Add New Server</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Server Name</label>
                <input type="text" className="input" placeholder="US Server 1" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Host</label>
                  <input type="text" className="input" placeholder="us1.example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">SSH Port</label>
                  <input type="number" className="input" placeholder="22" defaultValue={22} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">SSH Key Path (optional)</label>
                <input type="text" className="input" placeholder="/path/to/key" />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary flex-1">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary flex-1">
                  Add Server
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}