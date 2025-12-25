import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bug, Filter, Search, Clock, CheckCircle, XCircle, AlertTriangle, User, Calendar } from 'lucide-react';
import Sidebar from '../components/navigation/Sidebar';

interface BugReport {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  reportedBy: string;
  reportedAt: string;
  assignedTo?: string;
  module: string;
}

const AdminBuganizerPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // Mock data
  const bugs: BugReport[] = [
    {
      id: 'BUG-001',
      title: 'Code editor not saving changes',
      description: 'When submitting code, changes are not being saved properly in the editor',
      status: 'pending',
      priority: 'critical',
      reportedBy: 'john.doe@example.com',
      reportedAt: '2025-12-24T10:30:00',
      module: 'Code Editor'
    },
    {
      id: 'BUG-002',
      title: 'Progress chart not updating',
      description: 'User progress chart shows outdated data even after completing problems',
      status: 'in-progress',
      priority: 'high',
      reportedBy: 'jane.smith@example.com',
      reportedAt: '2025-12-23T14:20:00',
      assignedTo: 'dev-team',
      module: 'Dashboard'
    },
    {
      id: 'BUG-003',
      title: 'Dark mode toggle not working on mobile',
      description: 'Theme toggle button not responsive on mobile devices',
      status: 'resolved',
      priority: 'medium',
      reportedBy: 'user123@example.com',
      reportedAt: '2025-12-22T09:15:00',
      assignedTo: 'dev-team',
      module: 'UI/UX'
    },
    {
      id: 'BUG-004',
      title: 'Login redirect issue',
      description: 'After login, users are redirected to wrong page',
      status: 'pending',
      priority: 'high',
      reportedBy: 'test.user@example.com',
      reportedAt: '2025-12-21T16:45:00',
      module: 'Authentication'
    },
    {
      id: 'BUG-005',
      title: 'Editorial page loading slow',
      description: 'Editorial content takes too long to load for some problems',
      status: 'in-progress',
      priority: 'medium',
      reportedBy: 'student@example.com',
      reportedAt: '2025-12-20T11:00:00',
      assignedTo: 'dev-team',
      module: 'Editorial'
    },
    {
      id: 'BUG-006',
      title: 'Syntax highlighting broken for Python',
      description: 'Python code not showing proper syntax highlighting',
      status: 'closed',
      priority: 'low',
      reportedBy: 'coder@example.com',
      reportedAt: '2025-12-19T13:30:00',
      assignedTo: 'dev-team',
      module: 'Code Editor'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock size={18} className="text-yellow-400" />;
      case 'in-progress':
        return <AlertTriangle size={18} className="text-blue-400" />;
      case 'resolved':
        return <CheckCircle size={18} className="text-green-400" />;
      case 'closed':
        return <XCircle size={18} className="text-gray-400" />;
      default:
        return null;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'text-red-500 bg-red-500/10 border-red-500/30';
      case 'high':
        return 'text-orange-500 bg-orange-500/10 border-orange-500/30';
      case 'medium':
        return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
      case 'low':
        return 'text-green-500 bg-green-500/10 border-green-500/30';
      default:
        return 'text-gray-500 bg-gray-500/10 border-gray-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'in-progress':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'resolved':
        return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'closed':
        return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
      default:
        return 'text-gray-500 bg-gray-500/10 border-gray-500/30';
    }
  };

  const handleStatusChange = (bugId: string, newStatus: string) => {
    console.log(`Updating bug ${bugId} to status: ${newStatus}`);
    // TODO: Implement API call to update bug status
  };

  const filteredBugs = bugs.filter(bug => {
    const matchesSearch = bug.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          bug.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          bug.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || bug.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || bug.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const stats = {
    total: bugs.length,
    pending: bugs.filter(b => b.status === 'pending').length,
    inProgress: bugs.filter(b => b.status === 'in-progress').length,
    resolved: bugs.filter(b => b.status === 'resolved').length
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex">
      <Sidebar />
      <div className="flex-1 ml-20">
        <div className="max-w-[1800px] mx-auto px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <Bug size={32} className="text-red-400" />
              <h1 className="text-3xl font-bold">Buganizer</h1>
            </div>
            <p className="text-gray-400">Review and manage bug reports from users</p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-4 gap-4 mb-6"
          >
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
              <div className="text-2xl font-bold text-white">{stats.total}</div>
              <div className="text-sm text-gray-400">Total Reports</div>
            </div>
            <div className="bg-[#1a1a1a] border border-yellow-500/20 rounded-xl p-4">
              <div className="text-2xl font-bold text-yellow-400">{stats.pending}</div>
              <div className="text-sm text-gray-400">Pending</div>
            </div>
            <div className="bg-[#1a1a1a] border border-blue-500/20 rounded-xl p-4">
              <div className="text-2xl font-bold text-blue-400">{stats.inProgress}</div>
              <div className="text-sm text-gray-400">In Progress</div>
            </div>
            <div className="bg-[#1a1a1a] border border-green-500/20 rounded-xl p-4">
              <div className="text-2xl font-bold text-green-400">{stats.resolved}</div>
              <div className="text-sm text-gray-400">Resolved</div>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 mb-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Filter size={20} className="text-orange-500" />
              <h2 className="text-lg font-semibold">Filters</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search bugs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-orange-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>

              {/* Priority Filter */}
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-4 py-2 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-orange-500"
              >
                <option value="all">All Priority</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </motion.div>

          {/* Bug List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            {filteredBugs.length === 0 ? (
              <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-12 text-center">
                <Bug size={48} className="mx-auto mb-4 text-gray-600" />
                <p className="text-gray-400">No bugs found matching your filters</p>
              </div>
            ) : (
              filteredBugs.map((bug, index) => (
                <motion.div
                  key={bug.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 hover:border-orange-500/30 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="mt-1">
                        {getStatusIcon(bug.status)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{bug.title}</h3>
                          <span className="text-xs text-gray-500">{bug.id}</span>
                        </div>
                        <p className="text-gray-400 text-sm mb-3">{bug.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <User size={14} />
                            <span>{bug.reportedBy}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span>{new Date(bug.reportedAt).toLocaleDateString()}</span>
                          </div>
                          <div className="px-2 py-1 bg-[#0f0f0f] border border-[#2a2a2a] rounded text-xs">
                            {bug.module}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${getPriorityColor(bug.priority)}`}>
                        {bug.priority.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-[#2a2a2a]">
                    <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${getStatusColor(bug.status)}`}>
                      {bug.status.replace('-', ' ').toUpperCase()}
                    </span>
                    <select
                      value={bug.status}
                      onChange={(e) => handleStatusChange(bug.id, e.target.value)}
                      className="px-3 py-1 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-sm text-white focus:outline-none focus:border-orange-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminBuganizerPage;
