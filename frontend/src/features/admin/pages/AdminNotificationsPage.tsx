import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Send, Users, Clock, CheckCircle, ArrowLeft, Edit2, Trash2, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import Sidebar from "@shared/components/layout/Sidebar";
import { useToast } from "@shared/hooks/ToastContext";

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
  const { success, error } = useToast();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [audience, setAudience] = useState('all');
  const [selectedUser, setSelectedUser] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [recentNotifications, setRecentNotifications] = useState<Notification[]>([]);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editMessage, setEditMessage] = useState('');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Fetch recent notifications
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setIsLoadingNotifications(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/notifications/admin/all', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setRecentNotifications(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setRecentNotifications([]);
    } finally {
      setIsLoadingNotifications(false);
    }
  };

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      error('Please fill in all fields');
      return;
    }

    if (audience === 'particular' && !selectedUser.trim()) {
      error('Please select a user');
      return;
    }

    setIsSending(true);
    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/v1/notifications/admin/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          title,
          message,
          audience,
          recipientUser: audience === 'particular' ? selectedUser : null
        })
      });

      if (response.ok) {
        success('Notification sent successfully!');
        setTitle('');
        setMessage('');
        setAudience('all');
        setSelectedUser('');
        fetchNotifications(); // Refresh the list
      } else {
        const errorData = await response.json();
        error('Failed to send notification: ' + (errorData.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error sending notification:', err);
      error('Error sending notification');
    } finally {
      setIsSending(false);
    }
  };

  const handleEditNotification = (notification: Notification) => {
    setEditingId(notification.id);
    setEditTitle(notification.title);
    setEditMessage(notification.message);
  };

  const handleSaveEdit = async (notificationId: string) => {
    if (!editTitle.trim() || !editMessage.trim()) {
      error('Please fill in all fields');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/v1/notifications/admin/${notificationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: editTitle,
          message: editMessage
        })
      });

      if (response.ok) {
        success('Notification updated successfully!');
        setEditingId(null);
        fetchNotifications(); // Refresh the list
      } else {
        const errorData = await response.json();
        error('Failed to update notification: ' + (errorData.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error updating notification:', err);
      error('Error updating notification');
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    if (!confirm('Are you sure you want to delete this notification?')) {
      return;
    }

    try {
      setIsDeleting(notificationId);
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/v1/notifications/admin/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        success('Notification deleted successfully!');
        fetchNotifications(); // Refresh the list
      } else {
        const errorData = await response.json();
        error('Failed to delete notification: ' + (errorData.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
      error('Error deleting notification');
    } finally {
      setIsDeleting(null);
    }
  };

  const audienceOptions = [
    { value: 'all', label: 'All Users', description: 'Send to everyone on the platform' },
    { value: 'particular', label: 'Particular User', description: 'Send to a specific user' }
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
            <div className="flex items-center justify-between mb-2">
              <Link to="/admin" className="flex items-center gap-2 px-4 py-2 transition-colors rounded-lg hover:bg-zinc-800" title="Go back">
                <ArrowLeft size={20} />
              </Link>
              <div className="flex-1 text-center">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <Bell size={32} className="text-orange-500" />
                  <h1 className="text-3xl font-bold">Send Notifications</h1>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
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
                  <label htmlFor="title" className="block mb-2 text-sm font-medium">
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
                  <p className="mt-1 text-xs text-gray-500">{title.length}/100 characters</p>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block mb-2 text-sm font-medium">
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
                  <p className="mt-1 text-xs text-gray-500">{message.length}/500 characters</p>
                </div>

                {/* Audience Selection */}
                <div>
                  <label className="block mb-3 text-sm font-medium">
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

                {/* User Selection - Show when Particular User is selected */}
                {audience === 'particular' && (
                  <div>
                    <label htmlFor="selectedUser" className="block mb-2 text-sm font-medium">
                      Select User
                    </label>
                    <input
                      id="selectedUser"
                      type="text"
                      value={selectedUser}
                      onChange={(e) => setSelectedUser(e.target.value)}
                      placeholder="Enter username or email"
                      className="w-full px-4 py-3 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
                    />
                    <p className="mt-1 text-xs text-gray-500">Search by username or email address</p>
                  </div>
                )}

                {/* Preview */}
                {(title || message) && (
                  <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg p-4">
                    <p className="mb-2 text-xs text-gray-500">Preview</p>
                    {title && <h3 className="mb-2 font-semibold">{title}</h3>}
                    {message && <p className="text-sm text-gray-400">{message}</p>}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSending || !title.trim() || !message.trim()}
                  className="flex items-center justify-center w-full gap-2 px-6 py-3 font-semibold transition-colors bg-orange-500 rounded-lg hover:bg-orange-600 disabled:bg-gray-700 disabled:cursor-not-allowed"
                >
                  {isSending ? (
                    <>
                      <span className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <span
                            key={i}
                            className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"
                            style={{ animationDelay: `${i * 0.15}s` }}
                          />
                        ))}
                      </span>
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
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Clock size={24} className="text-orange-500" />
                  <h2 className="text-xl font-bold">Recent Notifications</h2>
                </div>
                <button
                  onClick={fetchNotifications}
                  disabled={isLoadingNotifications}
                  className="p-2 transition-colors rounded-lg hover:bg-zinc-800 disabled:opacity-50"
                  title="Refresh notifications"
                >
                  <Loader size={20} className={isLoadingNotifications ? 'animate-spin' : ''} />
                </button>
              </div>

              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {isLoadingNotifications ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader size={32} className="text-orange-500 animate-spin" />
                  </div>
                ) : recentNotifications.length === 0 ? (
                  <div className="py-12 text-center">
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
                      {editingId === notification.id ? (
                        // Edit Mode
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            placeholder="Edit title"
                            maxLength={100}
                            className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 text-sm"
                          />
                          <textarea
                            value={editMessage}
                            onChange={(e) => setEditMessage(e.target.value)}
                            placeholder="Edit message"
                            maxLength={500}
                            rows={3}
                            className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 text-sm resize-none"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSaveEdit(notification.id)}
                              className="flex-1 px-3 py-2 text-sm font-medium transition-colors bg-green-600 rounded hover:bg-green-700"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="flex-1 px-3 py-2 text-sm font-medium transition-colors bg-gray-700 rounded hover:bg-gray-600"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        // View Mode
                        <>
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center flex-1 gap-2">
                              <CheckCircle size={16} className="flex-shrink-0 text-green-400" />
                              <h3 className="text-sm font-semibold">{notification.title}</h3>
                            </div>
                            <div className="px-2 py-1 text-xs text-orange-400 border rounded bg-orange-500/10 border-orange-500/30 whitespace-nowrap">
                              {new Date(notification.sentAt).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                year: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                              }).replace(',', ' -')}
                            </div>
                          </div>
                          <p className="mb-3 text-xs text-gray-400">{notification.message}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <Users size={12} />
                                <span>{notification.audience}</span>
                              </div>
                              <span className="px-2 py-1 text-green-400 border rounded bg-green-500/10 border-green-500/30">
                                {notification.status}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditNotification(notification)}
                                className="p-1.5 hover:bg-zinc-800 rounded transition-colors"
                                title="Edit notification"
                              >
                                <Edit2 size={14} className="text-blue-400" />
                              </button>
                              <button
                                onClick={() => handleDeleteNotification(notification.id)}
                                disabled={isDeleting === notification.id}
                                className="p-1.5 hover:bg-zinc-800 rounded transition-colors disabled:opacity-50"
                                title="Delete notification"
                              >
                                {isDeleting === notification.id ? (
                                  <Loader size={14} className="text-red-400 animate-spin" />
                                ) : (
                                  <Trash2 size={14} className="text-red-400" />
                                )}
                              </button>
                            </div>
                          </div>
                        </>
                      )}
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
