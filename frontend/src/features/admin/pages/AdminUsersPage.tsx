import { useState, useEffect, useMemo, useCallback } from 'react';
import { useToast } from '@/shared/hooks/ToastContext';
import { motion } from 'framer-motion';
import { userService, type User, type UserRole, type UserStatus } from '@/services/api/userService';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Shield, 
  Ban, 
  CheckCircle,
  UserCheck,
  UserX,
  Calendar,
  TrendingUp,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Sidebar } from "@/shared/components/layout";

const AdminUsersPage = () => {
  const { success: toastSuccess, error: toastError } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<UserRole | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<UserStatus | 'all'>('all');
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  // Fetch users from API
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await userService.getAllUsers({
        role: filterRole !== 'all' ? filterRole : undefined,
        status: filterStatus !== 'all' ? filterStatus : undefined,
      });

      setUsers(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load users';
      setError(message);
      toastError(message);
    } finally {
      setIsLoading(false);
    }
  }, [filterRole, filterStatus, toastError]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Filter users based on search
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [users, searchQuery]);

  // Calculate stats
  const stats = useMemo(() => ({
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    suspended: users.filter(u => u.status === 'suspended').length,
    pending: users.filter(u => u.status === 'pending').length,
  }), [users]);

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'instructor':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'student':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'suspended':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const handleStatusChange = async (userId: string, newStatus: UserStatus) => {
    setUpdatingUserId(userId);
    setError(null);

    try {
      const updatedUser = await userService.updateUser(userId, { status: newStatus });
      setUsers((prev) => prev.map((user) => (user._id === userId ? updatedUser : user)));
      toastSuccess(`User status changed to ${newStatus}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update user status';
      setError(message);
      toastError(message);
    } finally {
      setUpdatingUserId(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0f0f0f]">
      <Sidebar />
      
      <div className="flex-1 ml-20">
        <div className="p-8 mx-auto max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <Link to="/admin" className="flex items-center gap-2 px-4 py-2 transition-colors rounded-lg hover:bg-zinc-800" title="Go back">
                <ArrowLeft size={20} />
              </Link>
              <div className="flex-1 text-center">
                <h1 className="mb-2 text-3xl font-bold text-white">User Management</h1>
              </div>
              <div className="w-[84px]"></div>
            </div>
            {error && (
              <div className="mt-3 text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                {error}
              </div>
            )}
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Total Users</span>
                <UserCheck className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-3xl font-bold text-white">{stats.total}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Active</span>
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-3xl font-bold text-white">{stats.active}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Suspended</span>
                <Ban className="w-5 h-5 text-red-400" />
              </div>
              <p className="text-3xl font-bold text-white">{stats.suspended}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Pending</span>
                <UserX className="w-5 h-5 text-yellow-400" />
              </div>
              <p className="text-3xl font-bold text-white">{stats.pending}</p>
            </motion.div>
          </div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 mb-6"
          >
            <div className="flex flex-col gap-4 md:flex-row">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Role Filter */}
              <div className="relative">
                <Filter className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="pl-10 pr-8 py-2 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-orange-500 appearance-none cursor-pointer min-w-[150px]"
                >
                  <option value="all">All Roles</option>
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="relative">
                <Filter className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-10 pr-8 py-2 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-orange-500 appearance-none cursor-pointer min-w-[150px]"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Users Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full table-fixed">
                <colgroup>
                  <col style={{ width: '35%' }} />
                  <col style={{ width: '15%' }} />
                  <col style={{ width: '15%' }} />
                  <col style={{ width: '15%' }} />
                  <col style={{ width: '20%' }} />
                </colgroup>
                <thead>
                  <tr className="border-b border-[#2a2a2a]">
                    <th className="px-4 py-3 text-xs font-semibold text-left text-gray-400 uppercase tracking-wider">User</th>
                    <th className="px-4 py-3 text-xs font-semibold text-left text-gray-400 uppercase tracking-wider">Role</th>
                    <th className="px-4 py-3 text-xs font-semibold text-left text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-xs font-semibold text-left text-gray-400 uppercase tracking-wider">Joined</th>
                    <th className="px-4 py-3 text-xs font-semibold text-left text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                        Loading users...
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                        No users found matching your filters
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user, index) => (
                      <motion.tr
                        key={user._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * Math.min(index, 10) }}
                      className="border-b border-[#2a2a2a] hover:bg-[#0f0f0f] transition-colors"
                    >
                      {/* User Info */}
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-white truncate">{user.name}</span>
                          <span className="flex items-center gap-1 text-xs text-gray-400 truncate">
                            <Mail className="w-3 h-3 flex-shrink-0" />
                            {user.email}
                          </span>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(user.role)}`}>
                          <Shield className="w-3 h-3" />
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(user.status || 'active')}`}>
                          {user.status === 'active' && <CheckCircle className="w-3 h-3" />}
                          {user.status === 'suspended' && <Ban className="w-3 h-3" />}
                          {user.status === 'pending' && <Calendar className="w-3 h-3" />}
                          {(user.status || 'active').charAt(0).toUpperCase() + (user.status || 'active').slice(1)}
                        </span>
                      </td>

                      {/* Joined Date */}
                      <td className="px-4 py-3">
                        <span className="text-xs text-gray-400">
                          {new Date(user.createdAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <select
                            value={user.status || 'active'}
                            onChange={(e) => handleStatusChange(user._id, e.target.value as UserStatus)}
                            disabled={updatingUserId === user._id}
                            className="px-2.5 py-1 bg-[#0f0f0f] border border-[#2a2a2a] rounded-md text-white text-xs focus:outline-none focus:border-orange-500 cursor-pointer disabled:opacity-60"
                          >
                            <option value="active">Active</option>
                            <option value="suspended">Suspend</option>
                            <option value="pending">Pending</option>
                          </select>
                          
                          <button className="p-1.5 text-gray-400 hover:text-white hover:bg-[#2a2a2a] rounded-md transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;
