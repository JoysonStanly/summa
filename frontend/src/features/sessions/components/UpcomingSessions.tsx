import { type FC, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Laptop, Users, Clock, Send, MessageCircle, Edit2, Trash2, Check, X } from 'lucide-react';
import { type Session } from "../data/sessions";
import { questionService, type Question } from '../services/questionService';
import { sessionService } from '../services/sessionService';
import { useToast } from '@shared/hooks/ToastContext';
import { useAuth } from '@features/auth/stores/AuthContext';

interface UpcomingSessionsProps {
  sessions: Session[];
}

const UpcomingSessions: FC<UpcomingSessionsProps> = ({ sessions }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      {sessions.length === 0 ? (
        <NoSessionsPlaceholder />
      ) : (
        <div className="space-y-8">
          {sessions.map(session => (
            <SessionCard key={session._id || session.id} session={session} />
          ))}
        </div>
      )}
    </motion.div>
  );
};

const NoSessionsPlaceholder: FC = () => {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center bg-gradient-to-br from-[#111111] to-[#0a0a0a] border border-[#2a2a2a] rounded-2xl p-8 sm:p-12 md:p-16 text-center"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center bg-gradient-to-br from-orange-500/20 to-orange-600/10 rounded-full mb-4 sm:mb-6">
        <Laptop size={32} className="sm:w-10 sm:h-10 md:w-12 md:h-12 text-orange-400" />
      </div>
      <h3 className="text-lg sm:text-xl font-bold mb-2">No Sessions Scheduled Yet</h3>
      <p className="text-sm sm:text-base text-gray-400 max-w-md px-4">Check back soon for upcoming live sessions, workshops, and coding bootcamps!</p>
    </motion.div>
  );
};

interface SessionCardProps {
  session: Session;
}

const SessionCard: FC<SessionCardProps> = ({ session }) => {
  const [question, setQuestion] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [editedQuestionText, setEditedQuestionText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [enrolledCount, setEnrolledCount] = useState(0);
  const [isRegistering, setIsRegistering] = useState(false);
  const { success: toastSuccess, error: toastError } = useToast();
  const { user, isAuthenticated } = useAuth();

  const getMessage = (error: unknown, fallback: string) =>
    error instanceof Error ? error.message : fallback;

  const loadQuestions = useCallback(async () => {
    try {
      setLoading(true);
      const sessionId = (session._id || session.id) as string;
      const fetchedQuestions = await questionService.getQuestions(sessionId);
      setQuestions(fetchedQuestions);
    } catch (error: unknown) {
      toastError(getMessage(error, 'Failed to load questions'));
    } finally {
      setLoading(false);
    }
  }, [session._id, session.id, toastError]);

  // Check registration status on mount and when user changes
  useEffect(() => {
    const checkRegistrationStatus = async () => {
      if (!isAuthenticated() || !session._id) return;
      
      try {
        const sessionId = (session._id || session.id) as string;
        const registered = await sessionService.checkRegistration(sessionId);
        setIsRegistered(registered);
      } catch (error) {
        console.error('Failed to check registration:', error);
      }
    };

    checkRegistrationStatus();
  }, [session, user, isAuthenticated]);

  // Fetch session data for enrolled count (with polling every 5 seconds)
  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const sessionId = (session._id || session.id) as string;
        const latestSession = await sessionService.getSession(sessionId);
        setEnrolledCount(latestSession.participants?.length || 0);
      } catch {
        // Fallback to prop data
        setEnrolledCount(session.participants?.length || session.enrolledUsers?.length || 0);
      }
    };

    // Initial fetch
    fetchSessionData();

    // Poll every 5 seconds for real-time updates
    const interval = setInterval(fetchSessionData, 5000);

    return () => clearInterval(interval);
  }, [session]);

  // Fetch total users count on mount
  useEffect(() => {
    const fetchTotalUsers = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'}/auth/users/count`, {
          credentials: 'include'
        });
        const data = await response.json();
        if (data.success) {
          setTotalUsers(data.data.count);
        }
      } catch (error) {
        console.error('Failed to fetch total users:', error);
      }
    };
    fetchTotalUsers();
  }, []);

  // Fetch questions when comments section is opened
  useEffect(() => {
    if (showComments && (session._id || session.id)) {
      loadQuestions();
    }
  }, [showComments, loadQuestions, session._id, session.id]);

  // Handle timeRange from API (stored as "14:00 - 16:00") or from session data
  const timeRange = session.timeRange || `${session.startTime || ''} - ${session.endTime || ''}`;
  
  const { title, date, thumbnailUrl, isLive } = session;

  const handleSubmitQuestion = async () => {
    if (!question.trim()) return;
    
    if (!isAuthenticated()) {
      toastError('Please login to ask questions');
      return;
    }

    try {
      const sessionId = (session._id || session.id) as string;
      const newQuestion = await questionService.createQuestion(sessionId, question);
      setQuestions([...questions, newQuestion]);
      setQuestion('');
      toastSuccess('Question posted successfully!');
    } catch (error: unknown) {
      toastError(getMessage(error, 'Failed to post question'));
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    try {
      await questionService.deleteQuestion(questionId);
      setQuestions(questions.filter(q => q._id !== questionId));
      toastSuccess('Question deleted successfully!');
    } catch (error: unknown) {
      toastError(getMessage(error, 'Failed to delete question'));
    }
  };

  const handleStartEdit = (questionId: string, currentText: string) => {
    setEditingQuestionId(questionId);
    setEditedQuestionText(currentText);
  };

  const handleSaveEdit = async (questionId: string) => {
    if (!editedQuestionText.trim()) return;

    try {
      const updatedQuestion = await questionService.updateQuestion(questionId, editedQuestionText);
      setQuestions(questions.map(q => 
        q._id === questionId ? updatedQuestion : q
      ));
      setEditingQuestionId(null);
      setEditedQuestionText('');
      toastSuccess('Question updated successfully!');
    } catch (error: unknown) {
      toastError(getMessage(error, 'Failed to update question'));
    }
  };

  const handleCancelEdit = () => {
    setEditingQuestionId(null);
    setEditedQuestionText('');
  };

  const handleRegister = async () => {
    if (!isAuthenticated()) {
      toastError('Please login to register for sessions');
      return;
    }

    if (isRegistering) return; // Prevent double-click
    
    try {
      setIsRegistering(true);
      const sessionId = (session._id || session.id) as string;
      const updatedSession = await sessionService.enrollInSession(sessionId);
      
      // Update local state immediately
      setIsRegistered(true);
      setEnrolledCount(updatedSession.participants?.length || 0);
      toastSuccess('Successfully registered for the session!');
    } catch (error: unknown) {
      // Handle "already registered" error gracefully
      const message = getMessage(error, 'Failed to register for session');
      if (message.includes('Already registered')) {
        setIsRegistered(true);
        toastSuccess('You are already registered for this session');
      } else {
        toastError(message);
      }
    } finally {
      setIsRegistering(false);
    }
  };
  
  return (
    <>
      <motion.div 
        className="bg-gradient-to-br from-[#1a1a1a] to-[#111111] border-2 border-[#2a2a2a] rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ 
          borderColor: '#ff6b35',
          boxShadow: '0 20px 40px rgba(255, 107, 53, 0.15)'
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 p-4 sm:p-6 md:p-8 lg:p-10">
          {/* Thumbnail Section - Side */}
          <div className="relative w-full lg:w-80 h-48 sm:h-52 lg:h-auto flex-shrink-0 rounded-lg sm:rounded-xl overflow-hidden bg-gradient-to-br from-gray-800 via-gray-900 to-black">
            {thumbnailUrl ? (
              <img src={thumbnailUrl} alt={title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center">
                <Calendar size={40} className="sm:w-12 sm:h-12 text-gray-700 mb-3" />
                <span className="text-gray-600 text-xs">No Preview</span>
              </div>
            )}
            
            {/* Live Badge Overlay */}
            {isLive && (
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-gradient-to-r from-red-600 to-red-500 text-white text-xs font-bold px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full flex items-center gap-1.5 sm:gap-2 shadow-lg animate-pulse">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></span>
                LIVE
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="flex-1">
            {/* Header */}
            <div className="mb-4 sm:mb-6">
              <h3 className="font-bold text-xl sm:text-2xl md:text-3xl mb-3 sm:mb-4 text-white leading-tight">{title}</h3>
              
              <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-3 sm:gap-4 md:gap-6 mb-3 sm:mb-4">
                <div className="flex items-center gap-2 text-gray-400 text-sm sm:text-base">
                  <Calendar size={18} className="sm:w-5 sm:h-5" />
                  <span>{new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-sm sm:text-base">
                  <Clock size={18} className="sm:w-5 sm:h-5" />
                  <span className="font-medium">{timeRange}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-sm sm:text-base">
                  <Users size={18} className="sm:w-5 sm:h-5" />
                  <span className="font-medium">{enrolledCount}/{totalUsers} Students</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              {!isRegistered ? (
                <button 
                  onClick={handleRegister}
                  disabled={isRegistering}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-orange-500/50 text-sm sm:text-base"
                >
                  {isRegistering ? 'Registering...' : 'Register'}
                </button>
              ) : (
                <div className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl shadow-lg flex items-center justify-center text-sm sm:text-base">
                  <span>✓ Registered</span>
                </div>
              )}
              <button 
                onClick={() => setShowComments(!showComments)}
                className="flex items-center justify-center sm:justify-start gap-2 px-4 sm:px-6 py-3 sm:py-4 bg-[#1a1a1a] hover:bg-[#222222] border border-[#2a2a2a] rounded-lg sm:rounded-xl transition-all font-semibold text-sm sm:text-base whitespace-nowrap"
              >
                <MessageCircle size={18} className="sm:w-5 sm:h-5 text-orange-400" />
                <span className="hidden sm:inline">Questions ({questions.length})</span>
                <span className="sm:hidden">({questions.length})</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Questions Section - Separate Box Below */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-[#1a1a1a] to-[#111111] border-2 border-[#2a2a2a] rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl"
          >
            <div className="space-y-3 sm:space-y-4">
              {/* Info Banner */}
              <div className="p-3 sm:p-4 bg-gradient-to-r from-orange-500/10 to-orange-600/5 border border-orange-500/30 rounded-lg sm:rounded-xl">
                <p className="text-xs sm:text-sm text-orange-400 flex items-center gap-2">
                  <MessageCircle size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                  <span>Ask questions before the session - the instructor will answer them live!</span>
                </p>
              </div>

              {/* Question Input */}
              <div className="flex gap-2 sm:gap-3">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmitQuestion()}
                  placeholder="Type your question here..."
                  className="flex-1 px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 md:py-3.5 bg-[#0f0f0f] border-2 border-[#2a2a2a] rounded-lg sm:rounded-xl text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                />
                <button
                  onClick={handleSubmitQuestion}
                  disabled={!question.trim()}
                  aria-label="Send question"
                  title="Send question"
                  className="px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 md:py-3.5 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg sm:rounded-xl transition-all"
                >
                  <Send size={18} className="sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* Questions List */}
              {loading ? (
                <div className="text-center py-6 sm:py-8">
                  <div className="inline-block w-6 h-6 sm:w-8 sm:h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-gray-400 mt-2 text-sm sm:text-base">Loading questions...</p>
                </div>
              ) : questions.length === 0 ? (
                <div className="text-center py-6 sm:py-8 text-gray-400">
                  <MessageCircle size={40} className="sm:w-12 sm:h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm sm:text-base">No questions yet. Be the first to ask!</p>
                </div>
              ) : (
                <div className="space-y-2 sm:space-y-3 max-h-80 sm:max-h-96 overflow-y-auto pr-1 sm:pr-2 custom-scrollbar">
                  {questions.map((q, index) => {
                    const isOwner = user && q.user._id === user._id;
                    const questionTime = new Date(q.createdAt).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    });
                    
                    return (
                      <motion.div
                        key={q._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-3 sm:p-4 md:p-5 bg-[#0f0f0f] rounded-lg sm:rounded-xl border border-[#2a2a2a] hover:border-orange-500/50 transition-all"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                              <span className="text-xs sm:text-sm font-bold text-orange-400 truncate">{q.user.name}</span>
                              <span className="text-xs text-gray-600 sm:hidden">{questionTime}</span>
                            </div>
                            
                            {editingQuestionId === q._id ? (
                              <div className="space-y-2">
                                <input
                                  type="text"
                                  value={editedQuestionText}
                                  onChange={(e) => setEditedQuestionText(e.target.value)}
                                  aria-label="Edit question"
                                  placeholder="Edit your question..."
                                  className="w-full px-3 sm:px-4 py-1.5 sm:py-2 bg-[#1a1a1a] border-2 border-orange-500 rounded-lg text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none"
                                  autoFocus
                                />
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleSaveEdit(q._id)}
                                    disabled={!editedQuestionText.trim()}
                                    className="flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg text-xs sm:text-sm transition-all"
                                  >
                                    <Check size={12} className="sm:w-3.5 sm:h-3.5" />
                                    Save
                                  </button>
                                  <button
                                    onClick={handleCancelEdit}
                                    className="flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs sm:text-sm transition-all"
                                  >
                                    <X size={12} className="sm:w-3.5 sm:h-3.5" />
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm sm:text-base text-gray-300 leading-relaxed break-words">{q.text}</p>
                            )}
                          </div>
                          
                          {/* Time and Edit/Delete buttons */}
                          <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 mt-1 sm:mt-0">
                            <span className="text-xs text-gray-600 hidden sm:inline">{questionTime}</span>
                            
                            {/* Edit/Delete buttons - only show if user is question owner */}
                            {isOwner && editingQuestionId !== q._id && (
                              <div className="flex gap-1.5 sm:gap-2">
                                <button
                                  onClick={() => handleStartEdit(q._id, q.text)}
                                  className="p-1.5 sm:p-2 hover:bg-[#1a1a1a] rounded-lg transition-all group"
                                  title="Edit question"
                                >
                                  <Edit2 size={14} className="sm:w-4 sm:h-4 text-gray-500 group-hover:text-orange-400 transition-colors" />
                                </button>
                                <button
                                  onClick={() => handleDeleteQuestion(q._id)}
                                  className="p-1.5 sm:p-2 hover:bg-[#1a1a1a] rounded-lg transition-all group"
                                  title="Delete question"
                                >
                                  <Trash2 size={14} className="sm:w-4 sm:h-4 text-gray-500 group-hover:text-red-400 transition-colors" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default UpcomingSessions;
