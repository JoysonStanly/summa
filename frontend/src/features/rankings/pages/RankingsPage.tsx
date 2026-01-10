import { useState, useEffect, useCallback, useContext } from 'react';
import { Search, Award, Star, Users, Clock, ChevronLeft, ChevronRight, User, Menu, Code2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sidebar } from "@shared/components/layout";
import BottomNavigation from '@shared/components/layout/BottomNavigation';
import leaderboardApi from '../services/leaderboardService';
import type { LeaderboardUser } from '../services/leaderboardService';
import { AuthContext } from '@features/auth/stores/AuthContext';
import LoadingSpinner from '@shared/components/ui/LoadingSpinner';

const USERS_PER_PAGE = 10;

const RankingsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserRank, setCurrentUserRank] = useState<LeaderboardUser | null>(null);
  
  const { user: authUser } = useContext(AuthContext);

  // Fetch leaderboard data
  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const skip = (currentPage - 1) * USERS_PER_PAGE;
      const response = await leaderboardApi.getLeaderboard(USERS_PER_PAGE, skip);
      setUsers(response.data);
      setTotalUsers(response.total);
    } catch (err: any) {
      setError(err.message || 'Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  // Fetch current user's rank
  const fetchCurrentUserRank = useCallback(async () => {
    if (authUser?.id) {
      try {
        const response = await leaderboardApi.getUserRank(authUser.id);
        setCurrentUserRank(response.data);
      } catch (err) {
        // User might not have a rank yet
        console.log('Could not fetch user rank');
      }
    }
  }, [authUser?.id]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  useEffect(() => {
    fetchCurrentUserRank();
  }, [fetchCurrentUserRank]);

  // Filter users based on search query (client-side for current page)
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(totalUsers / USERS_PER_PAGE);

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  // Handle user selection - navigate to profile in new tab
  const handleUserClick = (user: LeaderboardUser) => {
    // Open user's profile page in a new tab using their name (URL encoded)
    const encodedUsername = encodeURIComponent(user.name);
    window.open(`/profile/${encodedUsername}`, '_blank');
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex h-screen bg-[#0f0f0f] text-white overflow-hidden">
      {/* Sidebar - Desktop only */}
      <Sidebar activePage="rankings" />

      {/* Mobile Top Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 w-full lg:hidden bg-[#1a1a1a] border-b border-[#2a2a2a]">
        <div className="flex items-center justify-between w-full px-4 py-3">
          <Link to="/home" className="flex items-center">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">StudyIO</span>
            </div>
          </Link>
          <button className="flex items-center justify-center w-8 h-8 transition-colors rounded-md hover:bg-zinc-800">
            <Menu className="w-5 h-5 text-zinc-400" />
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <main className="flex-1 px-4 py-4 pt-20 pb-20 lg:pt-4 lg:pb-4 lg:pl-28 lg:pr-8 overflow-hidden flex flex-col">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto w-full flex flex-col h-full"
        >
          <header className="mb-4 sm:mb-6 flex flex-col gap-3 sm:gap-4 flex-shrink-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
                  <Award className="text-yellow-500 w-6 h-6 sm:w-7 sm:h-7" /> 
                  Rankings
                </h1>
              </div>

              {/* Search bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 bg-[#1a1a1a] border border-[#333] rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </header>

          {/* Ranking stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-4 flex-shrink-0">
            {[
              { icon: <Users size={18} className="sm:w-5 sm:h-5 text-blue-500" />, label: 'Total Users', value: totalUsers.toLocaleString() },
              { icon: <Star size={18} className="sm:w-5 sm:h-5 text-yellow-500" />, label: 'Your Rank', value: currentUserRank ? `#${currentUserRank.rank}` : '-' },
              { icon: <Award size={18} className="sm:w-5 sm:h-5 text-green-500" />, label: 'Your Score', value: currentUserRank ? currentUserRank.coins.toLocaleString() : '-' },
              { icon: <Clock size={18} className="sm:w-5 sm:h-5 text-purple-500" />, label: 'Streak', value: currentUserRank ? `${currentUserRank.currentStreak}d` : '-' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                className="bg-gradient-to-br from-[#1a1a1a] to-[#222] p-3 sm:p-4 rounded-lg sm:rounded-xl border border-[#333] flex items-center gap-2 sm:gap-4"
              >
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-[#111] flex items-center justify-center flex-shrink-0">
                  {stat.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-400 truncate">{stat.label}</p>
                  <p className="text-base sm:text-xl font-bold truncate">{stat.value}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Rankings table - Desktop */}
          <div className="hidden lg:block bg-[#1a1a1a] rounded-xl overflow-hidden border border-[#2a2a2a] flex-1 min-h-0">
            <div className="overflow-x-auto h-full overflow-y-auto scrollbar-thin scrollbar-thumb-[#444] scrollbar-track-[#1a1a1a]">
              <table className="w-full table-fixed">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-[#222] border-b border-[#333]">
                    <th className="w-[10%] px-4 py-4 text-center text-sm font-semibold text-gray-300 uppercase tracking-wider">Rank</th>
                    <th className="w-[35%] px-4 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">User</th>
                    <th className="w-[15%] px-4 py-4 text-center text-sm font-semibold text-gray-300 uppercase tracking-wider">Score</th>
                    <th className="w-[20%] px-4 py-4 text-center text-sm font-semibold text-gray-300 uppercase tracking-wider">Problems Solved</th>
                    <th className="w-[20%] px-4 py-4 text-center text-sm font-semibold text-gray-300 uppercase tracking-wider">Streak</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2a2a2a]">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="py-16 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <LoadingSpinner />
                        </div>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={5} className="py-16 text-center">
                        <p className="text-red-400">{error}</p>
                        <button 
                          onClick={fetchLeaderboard}
                          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                        >
                          Retry
                        </button>
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-16 text-center">
                        <p className="text-gray-400">
                          {searchQuery ? `No users found matching "${searchQuery}"` : 'No users found'}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user, index) => (
                      <motion.tr 
                        key={user.userId}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 * index }}
                        className={`hover:bg-[#252525] cursor-pointer transition-colors ${
                          user.rank <= 3 ? 'bg-[#1c1c26]' : ''
                        }`}
                        onClick={() => handleUserClick(user)}
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-center">
                            {user.rank <= 3 ? (
                              <div className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md ${
                                user.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                                user.rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-400' :
                                'bg-gradient-to-br from-amber-600 to-amber-800'
                              }`}>
                                <span className="font-bold text-[#111] text-sm">{user.rank}</span>
                              </div>
                            ) : (
                              <span className="font-semibold text-gray-300 text-base">{user.rank}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-zinc-300 dark:bg-zinc-600 border-2 border-zinc-400 dark:border-zinc-800 flex items-center justify-center flex-shrink-0">
                              <User className="w-5 h-5 text-zinc-600 dark:text-zinc-300" />
                            </div>
                            <p className="font-medium text-white truncate">{user.name}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="font-semibold text-blue-400 text-base">{user.coins.toLocaleString()}</span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="font-medium text-gray-200 text-base">{user.problemsSolved}</span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-center gap-1">
                            <span className="text-yellow-500">🔥</span>
                            <span className="font-medium text-gray-200">{user.currentStreak} days</span>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {!loading && !error && totalUsers > 0 && (
              <div className="flex items-center justify-center gap-2 px-4 py-4 border-t border-[#2a2a2a]">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                      currentPage === 1
                        ? 'bg-[#252525] text-gray-500 cursor-not-allowed'
                        : 'bg-[#252525] text-white hover:bg-[#333]'
                    }`}
                  >
                    <ChevronLeft size={18} />
                    Previous
                  </button>
                  <span className="text-gray-400 px-3">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                      currentPage === totalPages
                        ? 'bg-[#252525] text-gray-500 cursor-not-allowed'
                        : 'bg-[#252525] text-white hover:bg-[#333]'
                    }`}
                  >
                    Next
                    <ChevronRight size={18} />
                  </button>
              </div>
            )}  
          </div>

          {/* Rankings Table - Mobile */}
          <div className="lg:hidden flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#444] scrollbar-track-transparent">
            <div className="bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] overflow-hidden">
              {/* Mobile Table Header */}
              <div className="bg-[#222] border-b border-[#333] px-2 py-3 sticky top-0 z-10">
                <div className="grid grid-cols-5 gap-2 text-xs font-semibold text-gray-300 uppercase">
                  <div className="text-center">Rank</div>
                  <div className="text-left col-span-1">User</div>
                  <div className="text-center">Score</div>
                  <div className="text-center">Solved</div>
                  <div className="text-center">Streak</div>
                </div>
              </div>

              {/* Mobile Table Body */}
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <LoadingSpinner />
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                  <p className="text-red-400 mb-4">{error}</p>
                  <button 
                    onClick={fetchLeaderboard}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    Retry
                  </button>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="flex items-center justify-center py-16 text-center px-4">
                  <p className="text-gray-400">
                    {searchQuery ? `No users found matching "${searchQuery}"` : 'No users found'}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[#2a2a2a]">
                  {filteredUsers.map((user, index) => (
                    <motion.div
                      key={user.userId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * index }}
                      onClick={() => handleUserClick(user)}
                      className={`grid grid-cols-5 gap-2 px-2 py-3 hover:bg-[#252525] cursor-pointer transition-colors ${
                        user.rank <= 3 ? 'bg-[#1c1c26]' : ''
                      }`}
                    >
                      {/* Rank */}
                      <div className="flex items-center justify-center">
                        {user.rank <= 3 ? (
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md ${
                            user.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                            user.rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-400' :
                            'bg-gradient-to-br from-amber-600 to-amber-800'
                          }`}>
                            <span className="font-bold text-[#111] text-xs">{user.rank}</span>
                          </div>
                        ) : (
                          <span className="font-semibold text-gray-300 text-sm">{user.rank}</span>
                        )}
                      </div>

                      {/* User */}
                      <div className="flex items-center min-w-0 col-span-1">
                        <div className="w-7 h-7 rounded-full bg-zinc-600 flex items-center justify-center flex-shrink-0 mr-1.5">
                          <User className="w-3.5 h-3.5 text-zinc-300" />
                        </div>
                        <p className="font-medium text-white text-xs truncate">{user.name}</p>
                      </div>

                      {/* Score */}
                      <div className="flex items-center justify-center">
                        <span className="font-semibold text-blue-400 text-xs">{user.coins.toLocaleString()}</span>
                      </div>

                      {/* Problems Solved */}
                      <div className="flex items-center justify-center">
                        <span className="font-medium text-gray-200 text-xs">{user.problemsSolved}</span>
                      </div>

                      {/* Streak */}
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-sm">🔥</span>
                        <span className="font-medium text-gray-200 text-xs">{user.currentStreak}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Pagination - Mobile & Desktop */}
          {!loading && !error && totalUsers > 0 && (
            <div className="flex items-center justify-center gap-2 px-2 sm:px-4 py-3 sm:py-4 mt-3 sm:mt-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] flex-shrink-0">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`flex items-center gap-1 px-3 sm:px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  currentPage === 1
                    ? 'bg-[#252525] text-gray-500 cursor-not-allowed'
                    : 'bg-[#252525] text-white hover:bg-[#333]'
                }`}
              >
                <ChevronLeft size={16} className="sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Previous</span>
              </button>
              <span className="text-gray-400 px-2 sm:px-3 text-xs sm:text-sm">
                <span className="hidden sm:inline">Page </span>{currentPage} / {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`flex items-center gap-1 px-3 sm:px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  currentPage === totalPages
                    ? 'bg-[#252525] text-gray-500 cursor-not-allowed'
                    : 'bg-[#252525] text-white hover:bg-[#333]'
                }`}
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight size={16} className="sm:w-4 sm:h-4" />
              </button>
            </div>
          )}
        </motion.div>
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNavigation activePage="rankings" />
    </div>
  );
};

export default RankingsPage;
