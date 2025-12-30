import { useState } from 'react';
import { motion } from 'framer-motion';
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
  TrendingUp
} from 'lucide-react';
import { Sidebar } from "@/shared/components/layout";

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  status: 'active' | 'suspended' | 'pending';
  joinedDate: string;
  lastActive: string;
  problemsSolved?: number;
  streak?: number;
  coins?: number;
}

const AdminUsersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Mock data - replace with actual API call
  const mockUsers: User[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'student',
      status: 'active',
      joinedDate: '2024-01-15',
      lastActive: '2024-12-24',
      problemsSolved: 45,
      streak: 12,
      coins: 4500
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'instructor',
      status: 'active',
      joinedDate: '2023-11-20',
      lastActive: '2024-12-25',
      problemsSolved: 120,
      streak: 25,
      coins: 12000
    },
    {
      id: '3',
      name: 'Bob Johnson',
      email: 'bob.j@example.com',
      role: 'student',
      status: 'suspended',
      joinedDate: '2024-06-10',
      lastActive: '2024-12-10',
      problemsSolved: 8,
      streak: 0,
      coins: 800
    },
    {
      id: '4',
      name: 'Alice Williams',
      email: 'alice.w@example.com',
      role: 'admin',
      status: 'active',
      joinedDate: '2023-01-05',
      lastActive: '2024-12-25',
      problemsSolved: 200,
      streak: 100,
      coins: 25000
    },
    {
      id: '5',
      name: 'Charlie Brown',
      email: 'charlie.b@example.com',
      role: 'student',
      status: 'pending',
      joinedDate: '2024-12-20',
      lastActive: '2024-12-23',
      problemsSolved: 2,
      streak: 1,
      coins: 200
    },
    {
      id: '6',
      name: 'Diana Prince',
      email: 'diana.p@example.com',
      role: 'instructor',
      status: 'active',
      joinedDate: '2024-03-15',
      lastActive: '2024-12-24',
      problemsSolved: 85,
      streak: 30,
      coins: 8500
    }
  ];

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const stats = {
    total: mockUsers.length,
    active: mockUsers.filter(u => u.status === 'active').length,
    suspended: mockUsers.filter(u => u.status === 'suspended').length,
    pending: mockUsers.filter(u => u.status === 'pending').length,
  };

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

  const handleStatusChange = (userId: string, newStatus: string) => {
    console.log(`Changing user ${userId} status to ${newStatus}`);
    // Add API call here
  };

  return (
    <div className="flex min-h-screen bg-[#0f0f0f]">
      <Sidebar />
      
      <div className="flex-1 ml-20">
        <div className="max-w-7xl mx-auto p-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
            <p className="text-gray-400">Manage platform users, roles, and permissions</p>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Total Users</span>
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
                <span className="text-gray-400 text-sm">Active</span>
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
                <span className="text-gray-400 text-sm">Suspended</span>
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
                <span className="text-gray-400 text-sm">Pending</span>
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
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
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
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
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
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
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
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#2a2a2a]">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">User</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Role</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Stats</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Joined</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Last Active</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="border-b border-[#2a2a2a] hover:bg-[#0f0f0f] transition-colors"
                    >
                      {/* User Info */}
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-white font-medium">{user.name}</p>
                          <p className="text-gray-400 text-sm flex items-center gap-1 mt-1">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </p>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(user.role)}`}>
                          <Shield className="w-3 h-3" />
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(user.status)}`}>
                          {user.status === 'active' && <CheckCircle className="w-3 h-3" />}
                          {user.status === 'suspended' && <Ban className="w-3 h-3" />}
                          {user.status === 'pending' && <Calendar className="w-3 h-3" />}
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </span>
                      </td>

                      {/* Stats */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1 text-sm">
                          <span className="text-gray-400">
                            <TrendingUp className="w-3 h-3 inline mr-1" />
                            {user.problemsSolved} solved
                          </span>
                          <span className="text-orange-400">🔥 {user.streak} day streak</span>
                          <span className="text-yellow-400">🪙 {user.coins} coins</span>
                        </div>
                      </td>

                      {/* Joined Date */}
                      <td className="px-6 py-4">
                        <span className="text-gray-400 text-sm">{user.joinedDate}</span>
                      </td>

                      {/* Last Active */}
                      <td className="px-6 py-4">
                        <span className="text-gray-400 text-sm">{user.lastActive}</span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <select
                            value={user.status}
                            onChange={(e) => handleStatusChange(user.id, e.target.value)}
                            className="px-3 py-1 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-white text-sm focus:outline-none focus:border-orange-500 cursor-pointer"
                          >
                            <option value="active">Active</option>
                            <option value="suspended">Suspend</option>
                            <option value="pending">Pending</option>
                          </select>
                          
                          <button className="p-2 text-gray-400 hover:text-white hover:bg-[#2a2a2a] rounded-lg transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400">No users found matching your filters</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;
