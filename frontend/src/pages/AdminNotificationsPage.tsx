import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Send, Users, Clock, CheckCircle } from 'lucide-react';
import Sidebar from '../components/navigation/Sidebar';

interface Notification {
  id: string;
  title: string;
  message: string;
  audience: string;
  sentAt: string;
  sentBy: string;
  status: 'sent' | 'scheduled';
}

const AdminNotificationsPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [audience, setAudience] = useState('all');
  const [isSending, setIsSending] = useState(false);

  // Mock data for recent notifications
  const recentNotifications: Notification[] = [
    {
      id: 'NOT-001',
      title: 'New DSA Problems Added',
      message: 'We have added 10 new dynamic programming problems. Check them out!',
      audience: 'All Users',
      sentAt: '2025-12-25T08:00:00',
      sentBy: 'admin',
      status: 'sent'
    },
    {
      id: 'NOT-002',
      title: 'Platform Maintenance',
      message: 'Scheduled maintenance on Dec 26, 2025 from 2:00 AM to 4:00 AM IST',
      audience: 'All Users',
      sentAt: '2025-12-24T18:30:00',
      sentBy: 'admin',
      status: 'sent'
    },
    {
      id: 'NOT-003',
      title: 'Live Session Tomorrow',
      message: 'Join our live coding session on Graph Algorithms tomorrow at 6 PM',
      audience: 'Students',
      sentAt: '2025-12-23T15:00:00',
      sentBy: 'admin',
      status: 'sent'
    },
    {
      id: 'NOT-004',
      title: 'Contest Announcement',
      message: 'Weekly coding contest starts this Saturday. Participate and win prizes!',
      audience: 'All Users',
      sentAt: '2025-12-22T12:00:00',
      sentBy: 'admin',
      status: 'sent'
    }
  ];

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      alert('Please fill in all fields');
      return;
    }

    setIsSending(true);
    // Simulate API call
    setTimeout(() => {
      console.log('Sending notification:', { title, message, audience });
      alert('Notification sent successfully!');
      setTitle('');
      setMessage('');
      setAudience('all');
      setIsSending(false);
    }, 1500);
  };

  const audienceOptions = [
    { value: 'all', label: 'All Users', description: 'Send to everyone on the platform' },
    { value: 'students', label: 'Students', description: 'Send to all student accounts' },
    { value: 'instructors', label: 'Instructors', description: 'Send to all instructor accounts' },
    { value: 'premium', label: 'Premium Users', description: 'Send to premium subscribers only' }
  ];

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex">
      <Sidebar />
      <div className="flex-1 ml-20">
        <div className="max-w-[1400px] mx-auto px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <Bell size={32} className="text-orange-500" />
              <h1 className="text-3xl font-bold">Send Notifications</h1>
            </div>
            <p className="text-gray-400">Broadcast announcements and updates to your users</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Notification Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <Send size={24} className="text-orange-500" />
                <h2 className="text-xl font-bold">Create Notification</h2>
              </div>

              <form onSubmit={handleSendNotification} className="space-y-6">
                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-2">
                    Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter notification title"
                    className="w-full px-4 py-3 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
                    maxLength={100}
                  />
                  <p className="text-xs text-gray-500 mt-1">{title.length}/100 characters</p>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter your message here..."
                    rows={6}
                    className="w-full px-4 py-3 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 resize-none"
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-500 mt-1">{message.length}/500 characters</p>
                </div>

                {/* Audience Selection */}
                <div>
                  <label className="block text-sm font-medium mb-3">
                    Target Audience
                  </label>
                  <div className="space-y-2">
                    {audienceOptions.map((option) => (
                      <label
                        key={option.value}
                        className={`flex items-start gap-3 p-4 bg-[#0f0f0f] border rounded-lg cursor-pointer transition-colors ${
                          audience === option.value
                            ? 'border-orange-500 bg-orange-500/5'
                            : 'border-[#2a2a2a] hover:border-orange-500/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="audience"
                          value={option.value}
                          checked={audience === option.value}
                          onChange={(e) => setAudience(e.target.value)}
                          className="mt-1 accent-orange-500"
                        />
                        <div className="flex-1">
                          <div className="font-medium">{option.label}</div>
                          <div className="text-xs text-gray-400">{option.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Preview */}
                {(title || message) && (
                  <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-2">Preview</p>
                    {title && <h3 className="font-semibold mb-2">{title}</h3>}
                    {message && <p className="text-sm text-gray-400">{message}</p>}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSending || !title.trim() || !message.trim()}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
                >
                  {isSending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Send Notification
                    </>
                  )}
                </button>
              </form>
            </motion.div>

            {/* Recent Notifications */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <Clock size={24} className="text-orange-500" />
                <h2 className="text-xl font-bold">Recent Notifications</h2>
              </div>

              <div className="space-y-4">
                {recentNotifications.length === 0 ? (
                  <div className="text-center py-12">
                    <Bell size={48} className="mx-auto mb-4 text-gray-600" />
                    <p className="text-gray-400">No notifications sent yet</p>
                  </div>
                ) : (
                  recentNotifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.05 }}
                      className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg p-4 hover:border-orange-500/30 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle size={16} className="text-green-400 flex-shrink-0" />
                          <h3 className="font-semibold text-sm">{notification.title}</h3>
                        </div>
                        <span className="text-xs text-gray-500">{notification.id}</span>
                      </div>
                      <p className="text-xs text-gray-400 mb-3">{notification.message}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Users size={12} />
                            <span>{notification.audience}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock size={12} />
                            <span>{new Date(notification.sentAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <span className="px-2 py-1 bg-green-500/10 border border-green-500/30 rounded text-green-400">
                          {notification.status}
                        </span>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNotificationsPage;
