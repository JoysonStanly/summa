import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Bug, Filter, Search, Clock, CheckCircle, XCircle, AlertTriangle, User, Calendar, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Sidebar from "@shared/components/layout/Sidebar";
import { bugService, type BugPriority, type BugReport, type BugStatus } from '@shared/api/bugService';

const AdminBuganizerPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<BugStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<BugPriority | 'all'>('all');
  const [bugs, setBugs] = useState<BugReport[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [updatingBugId, setUpdatingBugId] = useState<string | null>(null);

  const fetchBugs = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await bugService.getBugReports({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        priority: priorityFilter !== 'all' ? priorityFilter : undefined,
      });

      setBugs(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load bug reports';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [priorityFilter, statusFilter]);

  useEffect(() => {
    fetchBugs();
  }, [fetchBugs]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
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
      case 'open':
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

  const handleStatusChange = async (bugId: string, newStatus: BugStatus) => {
    setUpdatingBugId(bugId);
    setError(null);

    try {
      const updatedBug = await bugService.updateBugReport(bugId, { status: newStatus });
      setBugs((prev) => prev.map((bug) => (bug._id === bugId ? updatedBug : bug)));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update bug status';
      setError(message);
    } finally {
      setUpdatingBugId(null);
    }
  };

  const filteredBugs = useMemo(() => {
    return bugs.filter((bug) => {
      const matchesSearch = bug.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bug.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bug._id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || bug.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || bug.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [bugs, priorityFilter, searchQuery, statusFilter]);

  const stats = useMemo(() => ({
    total: bugs.length,
    open: bugs.filter((b) => b.status === 'open').length,
    inProgress: bugs.filter((b) => b.status === 'in-progress').length,
    resolved: bugs.filter((b) => b.status === 'resolved').length,
    closed: bugs.filter((b) => b.status === 'closed').length,
  }), [bugs]);

  const formatReporter = (reportedBy: BugReport['reportedBy']) => {
    if (!reportedBy) return 'Unknown reporter';
    if (typeof reportedBy === 'string') return reportedBy;
    return reportedBy.name || reportedBy.email || 'Unknown reporter';
  };

  const getBugCategory = (bug: BugReport) => {
    if (bug.problemId?.title) return `Problem • ${bug.problemId.title}`;
    return bug.category || 'General';
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
            <div className="flex items-center justify-between mb-2">
              <Link to="/admin" className="flex items-center gap-2 px-4 py-2 transition-colors rounded-lg hover:bg-zinc-800" title="Go back">
                <ArrowLeft size={20} />
              </Link>
              <div className="flex-1 flex items-center justify-center gap-3">
                <Bug size={32} className="text-red-400" />
                <h1 className="text-3xl font-bold">Buganizer</h1>
              </div>
              <div className="w-[84px]"></div>
            </div>
            {error && (
              <div className="mt-3 text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                {error}
              </div>
            )}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6"
          >
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
              <div className="text-2xl font-bold text-white">{stats.total}</div>
              <div className="text-sm text-gray-400">Total Reports</div>
            </div>
            <div className="bg-[#1a1a1a] border border-yellow-500/20 rounded-xl p-4">
              <div className="text-2xl font-bold text-yellow-400">{stats.open}</div>
              <div className="text-sm text-gray-400">Open</div>
            </div>
            <div className="bg-[#1a1a1a] border border-blue-500/20 rounded-xl p-4">
              <div className="text-2xl font-bold text-blue-400">{stats.inProgress}</div>
              <div className="text-sm text-gray-400">In Progress</div>
            </div>
            <div className="bg-[#1a1a1a] border border-green-500/20 rounded-xl p-4">
              <div className="text-2xl font-bold text-green-400">{stats.resolved}</div>
              <div className="text-sm text-gray-400">Resolved</div>
            </div>
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
              <div className="text-2xl font-bold text-gray-300">{stats.closed}</div>
              <div className="text-sm text-gray-400">Closed</div>
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
                onChange={(e) => setStatusFilter(e.target.value as BugStatus | 'all')}
                className="px-4 py-2 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-orange-500"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>

              {/* Priority Filter */}
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as BugPriority | 'all')}
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
            {isLoading ? (
              <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-12 text-center text-gray-400">
                Loading bug reports...
              </div>
            ) : filteredBugs.length === 0 ? (
              <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-12 text-center">
                <Bug size={48} className="mx-auto mb-4 text-gray-600" />
                <p className="text-gray-400">No bugs found matching your filters</p>
              </div>
            ) : (
              filteredBugs.map((bug, index) => (
                <motion.div
                  key={bug._id}
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
                          <span className="text-xs text-gray-500">{bug._id}</span>
                        </div>
                        <p className="text-gray-400 text-sm mb-3">{bug.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <User size={14} />
                            <span>{formatReporter(bug.reportedBy)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span>{new Date(bug.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="px-2 py-1 bg-[#0f0f0f] border border-[#2a2a2a] rounded text-xs">
                            {getBugCategory(bug)}
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
                      onChange={(e) => handleStatusChange(bug._id, e.target.value as BugStatus)}
                      disabled={updatingBugId === bug._id}
                      className="px-3 py-1 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-sm text-white focus:outline-none focus:border-orange-500 disabled:opacity-60"
                    >
                      <option value="open">Open</option>
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
