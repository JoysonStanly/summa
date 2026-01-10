import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Filter,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft
} from 'lucide-react';
import { Sidebar } from "@shared/components/layout";
import LoadingSpinner from '@shared/components/ui/LoadingSpinner';
import { problemsApi } from '@shared/api/api';
import { useToast } from '@shared/hooks/ToastContext';

interface Problem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topicId: string;
  coins: number;
  totalSubmissions?: number;
  acceptedSubmissions?: number;
  createdAt?: string;
}

const AdminProblemsPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [filterTopic, setFilterTopic] = useState<string>('all');

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const response = await problemsApi.getProblems();
      
      if (response?.data) {
        // Map the API response to our Problem interface
        const mappedProblems: Problem[] = response.data.map((p: any) => {
          // Capitalize first letter of difficulty
          const capitalizedDifficulty = p.difficulty 
            ? p.difficulty.charAt(0).toUpperCase() + p.difficulty.slice(1).toLowerCase()
            : 'Easy';
          
          return {
            id: p.slug || p._id,
            title: p.title,
            difficulty: capitalizedDifficulty as 'Easy' | 'Medium' | 'Hard',
            topicId: p.topicId || p.category,
            coins: p.coins || 100,
            
            createdAt: p.createdAt
          };
        });
        setProblems(mappedProblems);
      }
    } catch (error) {
      console.error('Failed to fetch problems:', error);
      toast.error('Failed to load problems');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (problemId: string) => {
    if (!confirm('Are you sure you want to delete this problem? This action cannot be undone.')) return;
    
    try {
      await problemsApi.deleteProblem(problemId);
      setProblems(problems.filter(p => p.id !== problemId));
      toast.success('Problem deleted successfully');
    } catch (error) {
      console.error('Failed to delete problem:', error);
      toast.error('Failed to delete problem');
    }
  };

  const filteredProblems = problems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = filterDifficulty === 'all' || problem.difficulty === filterDifficulty;
    const matchesTopic = filterTopic === 'all' || problem.topicId === filterTopic;
    return matchesSearch && matchesDifficulty && matchesTopic;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-900/30 text-green-400 border-green-800';
      case 'Medium': return 'bg-yellow-900/30 text-yellow-400 border-yellow-800';
      case 'Hard': return 'bg-red-900/30 text-red-400 border-red-800';
      default: return 'bg-gray-900/30 text-gray-400 border-gray-800';
    }
  };

  const calculateAcceptanceRate = (accepted?: number, total?: number) => {
    if (!total || total === 0) return '0';
    return ((accepted! / total) * 100).toFixed(1);
  };

  // Stats cards
  const stats = {
    total: problems.length,
    easy: problems.filter(p => p.difficulty === 'Easy').length,
    medium: problems.filter(p => p.difficulty === 'Medium').length,
    hard: problems.filter(p => p.difficulty === 'Hard').length,
  };

  return (
    <div className="flex min-h-screen bg-[#0f0f0f] text-white">
      <Sidebar activePage="home" />
      
      <main className="flex-1 py-8 pr-8 pl-28">
        {/* Header */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <Link to="/admin" className="flex items-center gap-2 px-4 py-2 hover:bg-zinc-800 rounded-lg transition-colors" title="Go back">
              <ArrowLeft size={20} />
            </Link>
            <div className="flex-1 text-center">
              <h1 className="mb-2 text-4xl font-bold text-transparent bg-gradient-to-r from-orange-500 to-orange-300 bg-clip-text">
                Problem Management
              </h1>
            </div>
            <Link to="/admin/problems/new">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-6 py-3 font-medium transition-all rounded-lg shadow-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-orange-500/20"
              >
                <Plus size={20} />
                Add New Problem
              </motion.button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="p-4 border rounded-lg bg-gradient-to-br from-blue-900/20 to-blue-800/10 border-blue-800/30"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Problems</p>
                  <p className="text-3xl font-bold text-blue-400">{stats.total}</p>
                </div>
                <TrendingUp className="text-blue-400" size={32} />
              </div>
            </motion.div>

            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="p-4 border rounded-lg bg-gradient-to-br from-green-900/20 to-green-800/10 border-green-800/30"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Easy</p>
                  <p className="text-3xl font-bold text-green-400">{stats.easy}</p>
                </div>
                <CheckCircle className="text-green-400" size={32} />
              </div>
            </motion.div>

            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="p-4 border rounded-lg bg-gradient-to-br from-yellow-900/20 to-yellow-800/10 border-yellow-800/30"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Medium</p>
                  <p className="text-3xl font-bold text-yellow-400">{stats.medium}</p>
                </div>
                <Clock className="text-yellow-400" size={32} />
              </div>
            </motion.div>

            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="p-4 border rounded-lg bg-gradient-to-br from-red-900/20 to-red-800/10 border-red-800/30"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Hard</p>
                  <p className="text-3xl font-bold text-red-400">{stats.hard}</p>
                </div>
                <XCircle className="text-red-400" size={32} />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-4 mb-6"
        >
          <div className="flex flex-wrap gap-4">
            {/* Search */}
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2" size={20} />
                <input
                  type="text"
                  placeholder="Search problems..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-400" />
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="px-4 py-2 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg focus:outline-none focus:border-orange-500 transition-colors cursor-pointer"
              >
                <option value="all">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            {/* Topic Filter */}
            <select
              value={filterTopic}
              onChange={(e) => setFilterTopic(e.target.value)}
              className="px-4 py-2 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg focus:outline-none focus:border-orange-500 transition-colors cursor-pointer"
            >
              <option value="all">All Topics</option>
              <option value="arrays">Arrays</option>
              <option value="strings">Strings</option>
              <option value="trees">Trees</option>
              <option value="graphs">Graphs</option>
            </select>
          </div>
        </motion.div>

        {/* Problems Table */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg overflow-hidden"
        >
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : filteredProblems.length === 0 ? (
            <div className="py-12 text-center">
              <p className="mb-4 text-gray-400">No problems found</p>
              <Link to="/admin/problems/new">
                <button className="px-4 py-2 transition-colors bg-orange-500 rounded-lg hover:bg-orange-600">
                  Add Your First Problem
                </button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#0f0f0f] border-b border-[#2a2a2a]">
                  <tr>
                    <th className="px-6 py-4 text-sm font-semibold text-left text-gray-400">Title</th>
                    <th className="px-6 py-4 text-sm font-semibold text-left text-gray-400">Difficulty</th>
                    <th className="px-6 py-4 text-sm font-semibold text-left text-gray-400">Topic</th>
                    <th className="px-6 py-4 text-sm font-semibold text-left text-gray-400">Coins</th>
                    <th className="px-6 py-4 text-sm font-semibold text-right text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProblems.map((problem, index) => (
                    <motion.tr
                      key={problem.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-[#2a2a2a] hover:bg-[#222] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium">{problem.title}</div>
                        <div className="text-sm text-gray-500">ID: {problem.id}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(problem.difficulty)}`}>
                          {problem.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 text-xs text-blue-400 rounded-full bg-blue-900/30">
                          {problem.topicId}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-400">🪙</span>
                          <span className="font-semibold">{problem.coins}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/dsa/${problem.topicId}/${problem.id}`}
                            className="p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors group"
                            title="View Problem"
                          >
                            <Eye size={18} className="text-gray-400 group-hover:text-blue-400" />
                          </Link>
                          <Link
                            to={`/admin/problems/${problem.id}/edit`}
                            className="p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors group"
                            title="Edit Problem"
                          >
                            <Edit size={18} className="text-gray-400 group-hover:text-orange-400" />
                          </Link>
                          <button
                            onClick={() => handleDelete(problem.id)}
                            className="p-2 transition-colors rounded-lg hover:bg-red-900/20 group"
                            title="Delete Problem"
                          >
                            <Trash2 size={18} className="text-gray-400 group-hover:text-red-400" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-sm text-center text-gray-500"
        >
          Showing {filteredProblems.length} of {problems.length} problems
        </motion.div>
      </main>
    </div>
  );
};

export default AdminProblemsPage;
