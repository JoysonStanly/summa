import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Plus, Clock, Users, Video, Edit, Trash2, Search, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Sidebar from "@shared/components/layout/Sidebar";
import { sessionService } from '@features/sessions/services/sessionService';
import { useToast } from '@shared/hooks/ToastContext';

interface Session {
  id: string;
  title: string;
  description: string;
  instructor: string;
  date: string;
  time: string;
  endTime: string;
  duration: number; // in minutes
  maxParticipants: number;
  registeredCount: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  meetLink?: string;
}

const AdminSessionsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const { success: toastSuccess, error: toastError } = useToast();

  // Fetch sessions from API - refetch when location changes (e.g., navigating back from create/edit)
  useEffect(() => {
    fetchSessions();
  }, [location.pathname]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await sessionService.getSessions(undefined, true);
      
      // Transform API data to match UI format
      const transformedSessions: Session[] = data.map((session) => {
        const now = new Date();
        
        // Extract start time from timeRange or startTime
        let sessionTime = '00:00';
        if ((session as any).timeRange) {
          const timeRangeParts = (session as any).timeRange.split('-').map((t: string) => t.trim());
          if (timeRangeParts.length > 0) {
            sessionTime = timeRangeParts[0];
          }
        } else if (session.startTime) {
          sessionTime = session.startTime;
        }
        
        // Create a proper datetime by combining date and start time
        const sessionDateOnly = session.date.split('T')[0]; // Get just the date part
        const sessionDateTime = new Date(`${sessionDateOnly}T${sessionTime}:00`);
        
        // Determine status based on date and time
        let status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled' = 'upcoming';
        if (session.status) {
          status = session.status;
        } else if (sessionDateTime < now) {
          status = 'completed';
        }
        
        // Extract time from timeRange or startTime
        let time = '00:00';
        let endTime = '01:00';
        let duration = 60; // default
        
        if ((session as any).timeRange) {
          // Parse timeRange string like "14:00 - 16:00"
          const timeRangeParts = (session as any).timeRange.split('-').map((t: string) => t.trim());
          if (timeRangeParts.length === 2) {
            time = timeRangeParts[0];
            endTime = timeRangeParts[1];
            // Calculate duration
            const [startHour, startMin] = time.split(':').map(Number);
            const [endHour, endMin] = endTime.split(':').map(Number);
            duration = (endHour * 60 + endMin) - (startHour * 60 + startMin);
          }
        } else if (session.startTime) {
          time = session.startTime;
          // Calculate end time from duration
          if (session.startTime) {
            const [startHour, startMin] = session.startTime.split(':').map(Number);
            const totalMinutes = startHour * 60 + startMin + duration;
            const calcEndHour = Math.floor(totalMinutes / 60);
            const calcEndMin = totalMinutes % 60;
            endTime = `${String(calcEndHour).padStart(2, '0')}:${String(calcEndMin).padStart(2, '0')}`;
          }
          // Calculate duration from start and end time if available
          if (session.startTime && session.endTime) {
            const [startHour, startMin] = session.startTime.split(':').map(Number);
            const [endHour, endMin] = session.endTime.split(':').map(Number);
            duration = (endHour * 60 + endMin) - (startHour * 60 + startMin);
            endTime = session.endTime;
          }
        }
        
        // Determine type from tags or category
        let type: 'live-coding' | 'bootcamp' | 'workshop' | 'webinar' = 'workshop';
        if (session.tags && session.tags.length > 0) {
          const tag = session.tags[0].toLowerCase();
          if (tag.includes('live') || tag.includes('coding')) type = 'live-coding';
          else if (tag.includes('bootcamp')) type = 'bootcamp';
          else if (tag.includes('webinar')) type = 'webinar';
        }
        
        return {
          id: session._id,
          title: session.title,
          description: session.description,
          instructor: typeof session.instructor === 'string' 
            ? session.instructor 
            : (session.instructor as any)?.name || 'Unknown',
          date: session.date,
          time: time,
          endTime: endTime,
          duration: duration,
          type: type,
          maxParticipants: session.maxParticipants || 100,
          registeredCount: session.enrolledUsers?.length || 0,
          status: status,
          meetLink: session.meetingLink
        };
      });
      
      setSessions(transformedSessions);
    } catch (err: any) {
      console.error('Error fetching sessions:', err);
      setError(err.message || 'Failed to fetch sessions');
    } finally {
      setLoading(false);
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

  const handleDelete = async (sessionId: string) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      try {
        await sessionService.deleteSession(sessionId);
        toastSuccess('Session deleted successfully!');
        // Refresh sessions list after deletion
        await fetchSessions();
      } catch (err: any) {
        const errorMessage = err.message || 'Failed to delete session';
        toastError(errorMessage);
      }
    }
  };

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchQuery.toLowerCase())
                          
    return matchesSearch;
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
              <Link
                to="/admin"
                className="flex items-center gap-2 px-4 py-2 transition-colors rounded-lg hover:bg-zinc-800"
                title="Go back"
              >
                <ArrowLeft size={20} />
              </Link>
              <div className="flex-1 text-center">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <Calendar size={32} className="text-purple-400" />
                  <h1 className="text-3xl font-bold">Session Management</h1>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  to="/admin/sessions/new"
                  className="flex items-center gap-2 px-6 py-3 font-semibold transition-colors bg-orange-500 rounded-lg hover:bg-orange-600"
                >
                  <Plus size={20} />
                  Schedule Session
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 size={48} className="mx-auto mb-4 text-orange-500 animate-spin" />
                <p className="text-gray-400">Loading sessions...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 mb-6 border bg-red-500/10 border-red-500/30 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <AlertCircle size={24} className="text-red-400" />
                <div>
                  <h3 className="font-semibold text-red-400">Error Loading Sessions</h3>
                  <p className="text-sm text-gray-400">{error}</p>
                </div>
              </div>
              <button
                onClick={fetchSessions}
                className="px-4 py-2 mt-4 text-red-400 transition-colors border rounded-lg bg-red-500/20 hover:bg-red-500/30 border-red-500/30"
              >
                Try Again
              </button>
            </motion.div>
          )}

          {/* Show content only when not loading */}
          {!loading && !error && (
            <>
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

              {/* Search Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-6"
              >
                <div className="relative">
                  <Search size={18} className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                  <input
                    type="text"
                    placeholder="Search sessions by title, description, or instructor..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
                  />
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
                      <p className="mb-3 text-sm text-gray-400">{session.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} />
                          <span>{new Date(session.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={16} />
                          <span>{session.time} - {session.endTime}</span>
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
                        className="p-2 text-blue-400 transition-colors border rounded-lg bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(session.id)}
                        className="p-2 text-red-400 transition-colors border rounded-lg bg-red-500/10 border-red-500/30 hover:bg-red-500/20"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSessionsPage;
