import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Plus, Clock, Users, Video, Edit, Trash2, Filter, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import Sidebar from "@/shared/components/layout/Sidebar";

interface Session {
  id: string;
  title: string;
  description: string;
  instructor: string;
  date: string;
  time: string;
  duration: number; // in minutes
  type: 'live-coding' | 'bootcamp' | 'workshop' | 'webinar';
  maxParticipants: number;
  registeredCount: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  meetLink?: string;
}

const AdminSessionsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Mock data
  const sessions: Session[] = [
    {
      id: 'SES-001',
      title: 'Graph Algorithms Deep Dive',
      description: 'Master graph algorithms including BFS, DFS, Dijkstra, and more',
      instructor: 'Dr. Sarah Johnson',
      date: '2025-12-26',
      time: '18:00',
      duration: 120,
      type: 'live-coding',
      maxParticipants: 100,
      registeredCount: 78,
      status: 'upcoming',
      meetLink: 'https://meet.google.com/abc-defg-hij'
    },
    {
      id: 'SES-002',
      title: 'System Design Bootcamp',
      description: 'Learn to design scalable systems from scratch',
      instructor: 'John Smith',
      date: '2025-12-28',
      time: '10:00',
      duration: 240,
      type: 'bootcamp',
      maxParticipants: 50,
      registeredCount: 50,
      status: 'upcoming',
      meetLink: 'https://meet.google.com/xyz-abcd-efg'
    },
    {
      id: 'SES-003',
      title: 'Dynamic Programming Workshop',
      description: 'Solve complex DP problems with proven strategies',
      instructor: 'Dr. Sarah Johnson',
      date: '2025-12-24',
      time: '16:00',
      duration: 90,
      type: 'workshop',
      maxParticipants: 80,
      registeredCount: 65,
      status: 'completed'
    },
    {
      id: 'SES-004',
      title: 'React Best Practices',
      description: 'Modern React patterns and optimization techniques',
      instructor: 'Emily Chen',
      date: '2025-12-27',
      time: '14:00',
      duration: 60,
      type: 'webinar',
      maxParticipants: 200,
      registeredCount: 145,
      status: 'upcoming',
      meetLink: 'https://meet.google.com/pqr-stuv-wxy'
    },
    {
      id: 'SES-005',
      title: 'Database Optimization',
      description: 'Query optimization and indexing strategies',
      instructor: 'John Smith',
      date: '2025-12-23',
      time: '11:00',
      duration: 90,
      type: 'workshop',
      maxParticipants: 60,
      registeredCount: 42,
      status: 'completed'
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'live-coding':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'bootcamp':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
      case 'workshop':
        return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
      case 'webinar':
        return 'text-green-400 bg-green-500/10 border-green-500/30';
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'ongoing':
        return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'completed':
        return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
      case 'cancelled':
        return 'text-red-400 bg-red-500/10 border-red-500/30';
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  const handleDelete = (sessionId: string) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      console.log(`Deleting session ${sessionId}`);
      // TODO: Implement API call to delete session
    }
  };

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          session.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          session.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || session.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || session.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = {
    total: sessions.length,
    upcoming: sessions.filter(s => s.status === 'upcoming').length,
    completed: sessions.filter(s => s.status === 'completed').length,
    totalRegistrations: sessions.reduce((sum, s) => sum + s.registeredCount, 0)
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
              <div className="flex items-center gap-3">
                <Calendar size={32} className="text-purple-400" />
                <h1 className="text-3xl font-bold">Session Management</h1>
              </div>
              <Link
                to="/admin/sessions/new"
                className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold transition-colors"
              >
                <Plus size={20} />
                Schedule Session
              </Link>
            </div>
            <p className="text-gray-400">Manage live sessions, bootcamps, and workshops</p>
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
              <div className="text-sm text-gray-400">Total Sessions</div>
            </div>
            <div className="bg-[#1a1a1a] border border-blue-500/20 rounded-xl p-4">
              <div className="text-2xl font-bold text-blue-400">{stats.upcoming}</div>
              <div className="text-sm text-gray-400">Upcoming</div>
            </div>
            <div className="bg-[#1a1a1a] border border-gray-500/20 rounded-xl p-4">
              <div className="text-2xl font-bold text-gray-400">{stats.completed}</div>
              <div className="text-sm text-gray-400">Completed</div>
            </div>
            <div className="bg-[#1a1a1a] border border-green-500/20 rounded-xl p-4">
              <div className="text-2xl font-bold text-green-400">{stats.totalRegistrations}</div>
              <div className="text-sm text-gray-400">Total Registrations</div>
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
                  placeholder="Search sessions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Type Filter */}
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-orange-500"
              >
                <option value="all">All Types</option>
                <option value="live-coding">Live Coding</option>
                <option value="bootcamp">Bootcamp</option>
                <option value="workshop">Workshop</option>
                <option value="webinar">Webinar</option>
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-orange-500"
              >
                <option value="all">All Status</option>
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </motion.div>

          {/* Sessions List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            {filteredSessions.length === 0 ? (
              <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-12 text-center">
                <Calendar size={48} className="mx-auto mb-4 text-gray-600" />
                <p className="text-gray-400">No sessions found matching your filters</p>
              </div>
            ) : (
              filteredSessions.map((session, index) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 hover:border-orange-500/30 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">{session.title}</h3>
                        <span className="text-xs text-gray-500">{session.id}</span>
                      </div>
                      <p className="text-gray-400 text-sm mb-3">{session.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                          <Users size={16} />
                          <span>{session.instructor}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar size={16} />
                          <span>{new Date(session.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={16} />
                          <span>{session.time} ({session.duration} min)</span>
                        </div>
                        {session.meetLink && (
                          <div className="flex items-center gap-2">
                            <Video size={16} />
                            <a 
                              href={session.meetLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-orange-500 hover:text-orange-400"
                            >
                              Join Link
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${getTypeColor(session.type)}`}>
                        {session.type.toUpperCase().replace('-', ' ')}
                      </span>
                      <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${getStatusColor(session.status)}`}>
                        {session.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-[#2a2a2a]">
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-400">
                        {session.registeredCount}/{session.maxParticipants} registered
                      </span>
                      <div className="w-32 h-2 bg-[#0f0f0f] rounded-full overflow-hidden ml-2">
                        <div 
                          className="h-full bg-orange-500 rounded-full"
                          style={{ width: `${(session.registeredCount / session.maxParticipants) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/admin/sessions/${session.id}/edit`}
                        className="p-2 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-500/20 transition-colors"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(session.id)}
                        className="p-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
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

export default AdminSessionsPage;
