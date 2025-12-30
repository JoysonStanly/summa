import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Plus, Edit, Trash2, Filter, Search, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Sidebar from "@/shared/components/layout/Sidebar";

interface MCQQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  category: 'quantitative' | 'logical' | 'verbal';
  subCategory: string; // e.g., 'synonyms', 'analogies', 'numbers'
  difficulty: 'easy' | 'medium' | 'hard';
  explanation?: string;
  createdAt: string;
}

const AdminAptitudePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [subCategoryFilter, setSubCategoryFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

  // Mock data - represents questions from all three sections
  const questions: MCQQuestion[] = [
    // Quantitative Aptitude Questions
    {
      id: 'MCQ-001',
      question: 'If a train travels 120 km in 2 hours, what is its average speed?',
      options: ['50 km/h', '60 km/h', '70 km/h', '80 km/h'],
      correctAnswer: 1,
      category: 'quantitative',
      subCategory: 'numbers',
      difficulty: 'easy',
      explanation: 'Speed = Distance / Time = 120 / 2 = 60 km/h',
      createdAt: '2025-12-20T10:00:00'
    },
    {
      id: 'MCQ-004',
      question: 'What is 25% of 200?',
      options: ['25', '50', '75', '100'],
      correctAnswer: 1,
      category: 'quantitative',
      subCategory: 'percentage',
      difficulty: 'easy',
      explanation: '25% of 200 = (25/100) × 200 = 50',
      createdAt: '2025-12-17T16:45:00'
    },
    // Logical Reasoning Questions
    {
      id: 'MCQ-002',
      question: 'Complete the series: 2, 6, 12, 20, 30, ?',
      options: ['40', '42', '44', '46'],
      correctAnswer: 1,
      category: 'logical',
      subCategory: 'series',
      difficulty: 'medium',
      explanation: 'Pattern: n(n+1) where n = 1, 2, 3, 4, 5, 6. Next is 6*7 = 42',
      createdAt: '2025-12-19T14:30:00'
    },
    {
      id: 'MCQ-005',
      question: 'If all Bloops are Razzies and all Razzies are Lazzies, are all Bloops definitely Lazzies?',
      options: ['Yes', 'No', 'Cannot be determined', 'Sometimes'],
      correctAnswer: 0,
      category: 'logical',
      subCategory: 'syllogism',
      difficulty: 'hard',
      explanation: 'This is a transitive relationship: Bloops → Razzies → Lazzies, therefore Bloops → Lazzies',
      createdAt: '2025-12-16T11:20:00'
    },
    // Verbal Ability Questions
    {
      id: 'MCQ-003',
      question: 'Choose the word that is most similar to "Eloquent"',
      options: ['Silent', 'Articulate', 'Confused', 'Angry'],
      correctAnswer: 1,
      category: 'verbal',
      subCategory: 'synonyms',
      difficulty: 'medium',
      explanation: 'Eloquent means fluent or persuasive in speaking, similar to articulate',
      createdAt: '2025-12-18T09:15:00'
    },
    {
      id: 'MCQ-006',
      question: 'Identify the antonym of "Abundant"',
      options: ['Plentiful', 'Scarce', 'Generous', 'Rich'],
      correctAnswer: 1,
      category: 'verbal',
      subCategory: 'antonyms',
      difficulty: 'easy',
      explanation: 'Abundant means existing in large quantities. Scarce means insufficient or lacking.',
      createdAt: '2025-12-15T13:00:00'
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'quantitative':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'logical':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
      case 'verbal':
        return 'text-green-400 bg-green-500/10 border-green-500/30';
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'medium':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'hard':
        return 'text-red-400 bg-red-500/10 border-red-500/30';
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  const handleDelete = (questionId: string) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      console.log(`Deleting question ${questionId}`);
      // TODO: Implement API call to delete question
    }
  };

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          question.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || question.category === categoryFilter;
    const matchesSubCategory = subCategoryFilter === 'all' || question.subCategory === subCategoryFilter;
    const matchesDifficulty = difficultyFilter === 'all' || question.difficulty === difficultyFilter;
    return matchesSearch && matchesCategory && matchesSubCategory && matchesDifficulty;
  });

  const stats = {
    total: questions.length,
    quantitative: questions.filter(q => q.category === 'quantitative').length,
    logical: questions.filter(q => q.category === 'logical').length,
    verbal: questions.filter(q => q.category === 'verbal').length
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
                <Brain size={32} className="text-orange-500" />
                <h1 className="text-3xl font-bold">Question Bank Management</h1>
              </div>
            </div>
            <p className="text-gray-400">Manage questions for Aptitude, Verbal Ability & Logical Reasoning (Edit data files to add questions)</p>
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
              <div className="text-sm text-gray-400">Total Questions</div>
            </div>
            <div className="bg-[#1a1a1a] border border-blue-500/20 rounded-xl p-4">
              <div className="text-2xl font-bold text-blue-400">{stats.quantitative}</div>
              <div className="text-sm text-gray-400">Quantitative</div>
            </div>
            <div className="bg-[#1a1a1a] border border-purple-500/20 rounded-xl p-4">
              <div className="text-2xl font-bold text-purple-400">{stats.logical}</div>
              <div className="text-sm text-gray-400">Logical</div>
            </div>
            <div className="bg-[#1a1a1a] border border-green-500/20 rounded-xl p-4">
              <div className="text-2xl font-bold text-green-400">{stats.verbal}</div>
              <div className="text-sm text-gray-400">Verbal</div>
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-orange-500"
              >
                <option value="all">All Categories</option>
                <option value="quantitative">Quantitative Aptitude</option>
                <option value="logical">Logical Reasoning</option>
                <option value="verbal">Verbal Ability</option>
              </select>

              {/* Sub Category Filter */}
              <select
                value={subCategoryFilter}
                onChange={(e) => setSubCategoryFilter(e.target.value)}
                className="px-4 py-2 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-orange-500"
              >
                <option value="all">All Sub-Categories</option>
                <optgroup label="Quantitative">
                  <option value="numbers">Numbers</option>
                  <option value="percentage">Percentage</option>
                  <option value="ratio">Ratio & Proportion</option>
                  <option value="time-work">Time & Work</option>
                </optgroup>
                <optgroup label="Logical">
                  <option value="series">Series</option>
                  <option value="analogies">Analogies</option>
                  <option value="syllogism">Syllogism</option>
                  <option value="coding">Coding-Decoding</option>
                </optgroup>
                <optgroup label="Verbal">
                  <option value="synonyms">Synonyms</option>
                  <option value="antonyms">Antonyms</option>
                  <option value="sentence-completion">Sentence Completion</option>
                  <option value="para-jumbles">Para Jumbles</option>
                </optgroup>
              </select>

              {/* Difficulty Filter */}
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="px-4 py-2 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-orange-500"
              >
                <option value="all">All Difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </motion.div>

          {/* Questions List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            {filteredQuestions.length === 0 ? (
              <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-12 text-center">
                <Brain size={48} className="mx-auto mb-4 text-gray-600" />
                <p className="text-gray-400">No questions found matching your filters</p>
              </div>
            ) : (
              filteredQuestions.map((question, index) => (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 hover:border-orange-500/30 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs text-gray-500">{question.id}</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${getCategoryColor(question.category)}`}>
                          {question.category.toUpperCase()}
                        </span>
                        <span className="px-2 py-1 rounded text-xs bg-[#0f0f0f] border border-[#2a2a2a] text-gray-400">
                          {question.subCategory.replace('-', ' ').toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${getDifficultyColor(question.difficulty)}`}>
                          {question.difficulty.toUpperCase()}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold mb-3">{question.question}</h3>
                      <div className="space-y-2 mb-3">
                        {question.options.map((option, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            {idx === question.correctAnswer ? (
                              <CheckCircle size={16} className="text-green-400 flex-shrink-0" />
                            ) : (
                              <XCircle size={16} className="text-gray-600 flex-shrink-0" />
                            )}
                            <span className={idx === question.correctAnswer ? 'text-green-400 font-medium' : 'text-gray-400'}>
                              {String.fromCharCode(65 + idx)}. {option}
                            </span>
                          </div>
                        ))}
                      </div>
                      {question.explanation && (
                        <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg p-3">
                          <p className="text-xs text-gray-500 mb-1">Explanation:</p>
                          <p className="text-sm text-gray-400">{question.explanation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-[#2a2a2a]">
                    <span className="text-xs text-gray-500">
                      Created: {new Date(question.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/admin/aptitude/${question.id}/edit`}
                        className="p-2 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-500/20 transition-colors"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(question.id)}
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

export default AdminAptitudePage;
