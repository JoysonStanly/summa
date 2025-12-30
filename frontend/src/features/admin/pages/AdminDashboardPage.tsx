import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Code, Bug, Bell, Calendar, Users, 
  AlertCircle, CheckCircle2, Zap, ArrowRight,
  Activity, FileText, Plus
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Sidebar } from "@/shared/components/layout";

const AdminDashboardPage = () => {
  const navigate = useNavigate();

  // Mock data - replace with real data from API
  const recentActivity = [
    { id: 1, type: 'bug', icon: Bug, color: 'text-red-400', message: 'Bug reported by user', time: '2 mins ago', priority: 'high' },
    { id: 2, type: 'problem', icon: CheckCircle2, color: 'text-green-400', message: 'Problem edited by admin', time: '5 mins ago' },
    { id: 3, type: 'user', icon: Users, color: 'text-blue-400', message: 'New user registered', time: '10 mins ago' },
    { id: 4, type: 'session', icon: Zap, color: 'text-orange-400', message: 'Session started', time: '15 mins ago', live: true },
    { id: 5, type: 'submission', icon: FileText, color: 'text-purple-400', message: 'New submissions received', time: '20 mins ago' },
  ];

  const quickActions = [
    { title: 'Add Problem', icon: Code, link: '/admin/problems/new', color: 'from-blue-500/20 to-blue-600/10 border-blue-500/30 hover:border-blue-500/50' },
    { title: 'Send Notification', icon: Bell, link: '/admin/notifications', color: 'from-orange-500/20 to-orange-600/10 border-orange-500/30 hover:border-orange-500/50' },
    { title: 'Review Bugs', icon: Bug, link: '/admin/buganizer', color: 'from-red-500/20 to-red-600/10 border-red-500/30 hover:border-red-500/50' },
    { title: 'Schedule Session', icon: Calendar, link: '/admin/sessions/new', color: 'from-purple-500/20 to-purple-600/10 border-purple-500/30 hover:border-purple-500/50' },
    { title: 'View Questions', icon: FileText, link: '/admin/aptitude', color: 'from-green-500/20 to-green-600/10 border-green-500/30 hover:border-green-500/50' },
    { title: 'Manage Users', icon: Users, link: '/admin/users', color: 'from-teal-500/20 to-teal-600/10 border-teal-500/30 hover:border-teal-500/50' },
  ];

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 ml-20">
        {/* Header */}
        <div className="border-b border-[#2a2a2a] bg-gradient-to-r from-[#1a1a1a] to-[#0f0f0f]">
          <div className="max-w-[1800px] mx-auto px-8 py-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-orange-500/20 to-orange-600/10 rounded-lg border border-orange-500/30">
                <LayoutDashboard size={24} className="text-orange-500" />
              </div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            </div>
            <p className="text-gray-400">Manage and monitor your StudyIO platform</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-[1800px] mx-auto px-8 py-8 space-y-8">
        {/* Welcome Section */}
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Zap size={24} className="text-orange-500" />
            <h2 className="text-2xl font-bold">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Link
                  to={action.link}
                  className={`flex items-center gap-4 p-5 bg-gradient-to-br ${action.color} border rounded-xl transition-all hover:scale-105 group`}
                >
                  <div className="p-3 bg-[#0f0f0f]/50 rounded-lg group-hover:scale-110 transition-transform">
                    <action.icon size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{action.title}</h3>
                  </div>
                  <Plus size={20} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <Activity size={24} className="text-orange-500" />
            <h2 className="text-xl font-bold">Recent Activity</h2>
          </div>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.4 + index * 0.1 }}
                className="flex items-start gap-3 p-4 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg hover:border-orange-500/30 transition-colors"
              >
                <div className={`p-2 bg-[#1a1a1a] rounded-lg ${activity.color}`}>
                  <activity.icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-300">{activity.message}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">{activity.time}</span>
                    {activity.live && (
                      <span className="flex items-center gap-1 text-xs text-red-400">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                        LIVE
                      </span>
                    )}
                    {activity.priority === 'high' && (
                      <span className="text-xs px-2 py-0.5 bg-red-500/20 text-red-400 rounded-full">
                        High Priority
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
