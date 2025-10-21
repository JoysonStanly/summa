import { useState } from 'react';
import { Search, Filter, TrendingUp, Award, Star, Users, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Sidebar } from '../components/navigation';

// Mock user data for rankings
const MOCK_USERS = [
  {
    id: 1,
    name: 'Alexandra Chen',
    username: 'alexa_code',
    avatar: 'https://i.pravatar.cc/150?img=1',
    rank: 1,
    score: 9870,
    solved: 438,
    streak: 76,
    badges: ['Top Contributor', 'DSA Expert', 'Contest Winner'],
  },
  {
    id: 2,
    name: 'Marcus Johnson',
    username: 'mj_developer',
    avatar: 'https://i.pravatar.cc/150?img=3',
    rank: 2,
    score: 9730,
    solved: 425,
    streak: 90,
    badges: ['Algorithm Master', '100 Day Streak'],
  },
  {
    id: 3,
    name: 'Sophia Lee',
    username: 'sophia_dev',
    avatar: 'https://i.pravatar.cc/150?img=5',
    rank: 3,
    score: 9580,
    solved: 419,
    streak: 65,
    badges: ['Dynamic Programming Pro', 'Graph Theory Expert'],
  },
  {
    id: 4,
    name: 'David Kim',
    username: 'davidk',
    avatar: 'https://i.pravatar.cc/150?img=7',
    rank: 4,
    score: 9350,
    solved: 412,
    streak: 50,
    badges: ['Tree Specialist', 'Hard Problem Solver'],
  },
  {
    id: 5,
    name: 'Emily Rodriguez',
    username: 'em_rod',
    avatar: 'https://i.pravatar.cc/150?img=9',
    rank: 5,
    score: 9290,
    solved: 405,
    streak: 45,
    badges: ['SQL Expert', 'Database Master'],
  },
  {
    id: 6,
    name: 'James Wilson',
    username: 'jwilson',
    avatar: 'https://i.pravatar.cc/150?img=11',
    rank: 6,
    score: 9150,
    solved: 398,
    streak: 60,
    badges: ['Recursion Master', 'Backtracking Pro'],
  },
  {
    id: 7,
    name: 'Olivia Taylor',
    username: 'o_taylor',
    avatar: 'https://i.pravatar.cc/150?img=13',
    rank: 7,
    score: 8980,
    solved: 387,
    streak: 40,
    badges: ['Array Specialist', 'String Algorithms Expert'],
  },
  {
    id: 8,
    name: 'Ethan Brown',
    username: 'ethan_b',
    avatar: 'https://i.pravatar.cc/150?img=15',
    rank: 8,
    score: 8870,
    solved: 379,
    streak: 55,
    badges: ['Greedy Algorithms Pro', 'Binary Search Expert'],
  },
  {
    id: 9,
    name: 'Ava Martinez',
    username: 'ava_m',
    avatar: 'https://i.pravatar.cc/150?img=17',
    rank: 9,
    score: 8790,
    solved: 371,
    streak: 38,
    badges: ['OS Concepts Master', 'Networking Expert'],
  },
  {
    id: 10,
    name: 'William Davis',
    username: 'will_davis',
    avatar: 'https://i.pravatar.cc/150?img=19',
    rank: 10,
    score: 8720,
    solved: 368,
    streak: 42,
    badges: ['DP Challenge Winner', 'Graph Contest Champion'],
  },
  {
    id: 11,
    name: 'Isabella Lopez',
    username: 'bella_dev',
    avatar: 'https://i.pravatar.cc/150?img=20',
    rank: 11,
    score: 8650,
    solved: 360,
    streak: 35,
    badges: ['Hash Table Expert', 'Stack & Queue Master'],
  },
  {
    id: 12,
    name: 'Noah Garcia',
    username: 'noah_g',
    avatar: 'https://i.pravatar.cc/150?img=22',
    rank: 12,
    score: 8590,
    solved: 355,
    streak: 28,
    badges: ['Linked List Pro', 'Tree Traversal Expert'],
  },
];

// Filter options
const FILTER_OPTIONS = {
  timeframes: ['All Time', 'This Week', 'This Month', 'Today'],
  categories: ['Overall', 'DSA', 'OS', 'DBMS', 'System Design', 'Aptitude'],
  regions: ['Global', 'Country', 'City', 'My Network']
};

const RankingsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTimeframe, setActiveTimeframe] = useState(FILTER_OPTIONS.timeframes[0]);
  const [activeCategory, setActiveCategory] = useState(FILTER_OPTIONS.categories[0]);
  const [activeRegion, setActiveRegion] = useState(FILTER_OPTIONS.regions[0]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUser, setSelectedUser] = useState<typeof MOCK_USERS[0] | null>(null);

  // Filter users based on search query
  const filteredUsers = MOCK_USERS.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex min-h-screen bg-[#0f0f0f] text-white">
      {/* Sidebar */}
      <Sidebar activePage="rankings" />
      
      {/* Main content */}
      <main className="flex-1 pl-20 pr-4 py-6 lg:px-8">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto"
        >
          <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Award className="text-yellow-500" /> 
                Community Rankings
              </h1>
              <p className="text-gray-400 mt-2">
                See how you stack up against the TUF community
              </p>
            </div>

            {/* Search bar */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </header>

          {/* Filter section */}
          <div className="mb-6 bg-[#1a1a1a] p-4 rounded-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-2">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <TrendingUp size={20} className="text-blue-500" />
                Leaderboard
              </h2>
              
              <button 
                onClick={() => setShowFilters(!showFilters)} 
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#252525] hover:bg-[#333] transition-colors"
              >
                <Filter size={16} />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>
            
            {showFilters && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="pt-4 border-t border-[#333] mt-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Timeframe filter */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Timeframe</h3>
                    <div className="flex flex-wrap gap-2">
                      {FILTER_OPTIONS.timeframes.map(timeframe => (
                        <button
                          key={timeframe}
                          onClick={() => setActiveTimeframe(timeframe)}
                          className={`px-3 py-1 rounded-full text-sm ${
                            activeTimeframe === timeframe 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-[#252525] text-gray-300 hover:bg-[#333]'
                          }`}
                        >
                          {timeframe}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Category filter */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Category</h3>
                    <div className="flex flex-wrap gap-2">
                      {FILTER_OPTIONS.categories.map(category => (
                        <button
                          key={category}
                          onClick={() => setActiveCategory(category)}
                          className={`px-3 py-1 rounded-full text-sm ${
                            activeCategory === category 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-[#252525] text-gray-300 hover:bg-[#333]'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Region filter */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Region</h3>
                    <div className="flex flex-wrap gap-2">
                      {FILTER_OPTIONS.regions.map(region => (
                        <button
                          key={region}
                          onClick={() => setActiveRegion(region)}
                          className={`px-3 py-1 rounded-full text-sm ${
                            activeRegion === region 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-[#252525] text-gray-300 hover:bg-[#333]'
                          }`}
                        >
                          {region}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Ranking stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: <Users size={20} className="text-blue-500" />, label: 'Total Users', value: '25,432' },
              { icon: <Star size={20} className="text-yellow-500" />, label: 'Your Rank', value: '#157' },
              { icon: <Award size={20} className="text-green-500" />, label: 'Your Score', value: '7,849' },
              { icon: <Clock size={20} className="text-purple-500" />, label: 'Current Streak', value: '24 days' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                className="bg-gradient-to-br from-[#1a1a1a] to-[#222] p-4 rounded-xl border border-[#333] flex items-center gap-4"
              >
                <div className="h-10 w-10 rounded-full bg-[#111] flex items-center justify-center">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                  <p className="text-xl font-bold">{stat.value}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Rankings table */}
          <div className="bg-[#1a1a1a] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#222]">
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Rank</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">User</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Score</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Problems Solved</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Streak</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <motion.tr 
                      key={user.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * index }}
                      className={`border-b border-[#2a2a2a] hover:bg-[#222] cursor-pointer ${
                        user.rank <= 3 ? 'bg-[#1c1c26]' : ''
                      }`}
                      onClick={() => setSelectedUser(user)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {user.rank <= 3 ? (
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                              user.rank === 1 ? 'bg-yellow-500' :
                              user.rank === 2 ? 'bg-gray-300' :
                              'bg-amber-700'
                            }`}>
                              <span className="font-bold text-[#111]">{user.rank}</span>
                            </div>
                          ) : (
                            <span className="font-medium w-8 text-center mr-2">{user.rank}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img 
                            src={user.avatar} 
                            alt={user.name} 
                            className="w-10 h-10 rounded-full mr-3 object-cover border-2 border-[#333]" 
                          />
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-gray-400">@{user.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-blue-400">{user.score.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span>{user.solved}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <span className="text-yellow-500 mr-1">🔥</span>
                          <span>{user.streak} days</span>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredUsers.length === 0 && (
              <div className="py-16 text-center">
                <p className="text-gray-400">No users found matching "{searchQuery}"</p>
              </div>
            )}
          </div>
          
          {/* User Detail Modal */}
          {selectedUser && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#1a1a1a] rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img 
                          src={selectedUser.avatar} 
                          alt={selectedUser.name} 
                          className="w-20 h-20 rounded-full object-cover border-2 border-[#333]" 
                        />
                        {selectedUser.rank <= 3 && (
                          <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center ${
                            selectedUser.rank === 1 ? 'bg-yellow-500' :
                            selectedUser.rank === 2 ? 'bg-gray-300' :
                            'bg-amber-700'
                          }`}>
                            <span className="font-bold text-[#111]">{selectedUser.rank}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">{selectedUser.name}</h2>
                        <p className="text-gray-400">@{selectedUser.username}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedUser(null)}
                      className="p-2 rounded-full hover:bg-[#333]"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-[#252525] p-4 rounded-xl">
                      <p className="text-gray-400 text-sm">Rank</p>
                      <p className="text-2xl font-bold">#{selectedUser.rank}</p>
                    </div>
                    <div className="bg-[#252525] p-4 rounded-xl">
                      <p className="text-gray-400 text-sm">Score</p>
                      <p className="text-2xl font-bold text-blue-400">{selectedUser.score.toLocaleString()}</p>
                    </div>
                    <div className="bg-[#252525] p-4 rounded-xl">
                      <p className="text-gray-400 text-sm">Problems Solved</p>
                      <p className="text-2xl font-bold">{selectedUser.solved}</p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">Badges & Achievements</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {selectedUser.badges.map((badge, index) => (
                        <div 
                          key={index}
                          className="flex items-center gap-1.5 px-2 py-1 bg-[#252525] rounded-full text-xs"
                        >
                          <span>🏆</span>
                          <span>{badge}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-[#252525] p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-yellow-500">🔥</span>
                        <p className="font-medium">{selectedUser.streak} Day Streak</p>
                      </div>
                      <div className="w-full bg-[#333] h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-yellow-500 to-red-500 h-full"
                          style={{ width: `${(selectedUser.streak / 100) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Next milestone: 100 days</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Recent Activity</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 bg-[#252525] p-3 rounded-lg">
                        <div className="w-10 h-10 bg-green-900 rounded-full flex items-center justify-center text-green-400">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                          </svg>
                        </div>
                        <div>
                          <p>Solved "Maximum Subarray" problem</p>
                          <p className="text-xs text-gray-400">Yesterday at 5:30 PM</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 bg-[#252525] p-3 rounded-lg">
                        <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center text-blue-400">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                          </svg>
                        </div>
                        <div>
                          <p>Completed "Advanced Graph Algorithms" course</p>
                          <p className="text-xs text-gray-400">2 days ago</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 bg-[#252525] p-3 rounded-lg">
                        <div className="w-10 h-10 bg-yellow-900 rounded-full flex items-center justify-center text-yellow-400">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="8" r="7"></circle>
                            <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                          </svg>
                        </div>
                        <div>
                          <p>Earned "Tree Specialist" badge</p>
                          <p className="text-xs text-gray-400">3 days ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default RankingsPage;
