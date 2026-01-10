import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Tag,
  FolderOpen,
  Plus
} from 'lucide-react';
import { Sidebar } from "@shared/components/layout";
import { useToast } from "@shared/hooks/ToastContext";
import { dsaTopics, getSubtopicsForTopic } from '@features/problems/data/dsaTopics';
import { problemsApi } from '@shared/api/api';


const AddProblemPage = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    difficulty: 'Easy',
    coins: 100,
    category: 'arrays',
    subcategory: 'fundamentals',
    tags: '',
    contentPath: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['basic', 'category', 'content']));

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  // Auto-generate slug from title
  const handleTitleChange = (value: string) => {
    const slug = value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    setFormData({
      ...formData,
      title: value,
      slug: slug
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.slug.trim()) newErrors.slug = 'Slug is required';
    if (!formData.contentPath.trim()) newErrors.contentPath = 'Content path is required (e.g., data/problems/two-sum.json)';
    if (!formData.tags.trim()) newErrors.tags = 'At least one tag is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert tags string to array
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const problemData = {
        ...formData,
        difficulty: formData.difficulty.toLowerCase(), // Backend expects lowercase
        tags: tagsArray,
        likes: 0,
        dislikes: 0
      };

      await problemsApi.createProblem(problemData);
      
      toast.success('Problem metadata created successfully. Make sure the JSON file exists at the specified path.');
      navigate('/admin/problems');
    } catch (error) {
      console.error('Failed to create problem:', error);
      toast.error('Failed to create problem. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const subtopics = getSubtopicsForTopic(formData.category);

  // Section Header Component
  const SectionHeader = ({ 
    icon: Icon, 
    title, 
    subtitle, 
    sectionKey 
  }: { 
    icon: React.ElementType; 
    title: string; 
    subtitle: string; 
    sectionKey: string;
  }) => (
    <button
      type="button"
      onClick={() => toggleSection(sectionKey)}
      className="w-full flex items-center justify-between p-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl hover:border-orange-500/50 transition-all group"
    >
      <div className="flex items-center gap-4">
        <div className="p-2.5 bg-orange-500/10 rounded-xl">
          <Icon className="text-orange-500" size={22} />
        </div>
        <div className="text-left">
          <h3 className="text-base font-semibold text-white">{title}</h3>
          <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
        </div>
      </div>
      {expandedSections.has(sectionKey) ? (
        <ChevronUp className="text-gray-400 transition-colors group-hover:text-orange-500" size={22} />
      ) : (
        <ChevronDown className="text-gray-400 transition-colors group-hover:text-orange-500" size={22} />
      )}
    </button>
  );

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
          <Link 
            to="/admin/problems"
            className="inline-flex items-center gap-2 mb-6 text-gray-400 transition-colors hover:text-orange-500 group"
          >
            <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
            <span className="text-sm font-medium">Back to Problems</span>
          </Link>
          
          <div className="text-center">
            <h1 className="mb-3 text-5xl font-bold text-transparent bg-gradient-to-r from-orange-500 via-orange-400 to-orange-300 bg-clip-text">
              Add New Problem
            </h1>
            <p className="text-lg text-gray-400">Create a new DSA problem with metadata</p>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit} className="max-w-4xl pb-12 mx-auto space-y-6">
          {/* Basic Information Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <SectionHeader
              icon={Sparkles}
              title="Basic Information"
              subtitle="Problem title, slug, and difficulty"
              sectionKey="basic"
            />
            
            <AnimatePresence>
              {expandedSections.has('basic') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-4 space-y-5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6"
                >
                  {/* Title */}
                  <div>
                    <label className="block mb-3 text-sm font-semibold text-gray-300">
                      Problem Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="e.g., Two Sum"
                      className="w-full px-4 py-3.5 bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all text-white placeholder:text-gray-600"
                    />
                    {errors.title && <p className="flex items-center gap-1 mt-2 text-sm text-red-500"><span>⚠</span>{errors.title}</p>}
                  </div>

                  {/* Slug */}
                  <div>
                    <label className="block mb-3 text-sm font-semibold text-gray-300">
                      URL Slug <span className="text-red-500">*</span> <span className="font-normal text-gray-500">(auto-generated)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="two-sum"
                      className="w-full px-4 py-3.5 bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all text-white placeholder:text-gray-600"
                    />
                    {errors.slug && <p className="flex items-center gap-1 mt-2 text-sm text-red-500"><span>⚠</span>{errors.slug}</p>}
                    <p className="mt-2 text-xs text-gray-500">
                      Used in URL: /dsa/{formData.category}/{formData.slug || 'problem-slug'}
                    </p>
                  </div>

                  {/* Difficulty */}
                  <div>
                    <label className="block mb-3 text-sm font-semibold text-gray-300">Difficulty</label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                      className="w-full px-4 py-3.5 bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all cursor-pointer text-white"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>

                  {/* Coins Reward */}
                  <div>
                    <label className="block mb-3 text-sm font-semibold text-gray-300">
                      Coins Reward <span className="text-gray-500 font-normal">(earned on completion)</span>
                    </label>
                    <input
                      type="number"
                      value={formData.coins}
                      onChange={(e) => setFormData({ ...formData, coins: parseInt(e.target.value) || 0 })}
                      min="0"
                      step="50"
                      className="w-full px-4 py-3.5 bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all text-white"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Suggested: Easy (100), Medium (200), Hard (300)
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Category & Tags Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <SectionHeader
              icon={Tag}
              title="Category & Tags"
              subtitle="Topic classification and tags"
              sectionKey="category"
            />
            
            <AnimatePresence>
              {expandedSections.has('category') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-4 space-y-5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6"
                >
                  {/* Category and Subcategory */}
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block mb-3 text-sm font-semibold text-gray-300">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          category: e.target.value,
                          subcategory: getSubtopicsForTopic(e.target.value)[0]?.id || ''
                        })}
                        className="w-full px-4 py-3.5 bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all cursor-pointer text-white"
                      >
                        {dsaTopics.map(topic => (
                          <option key={topic.id} value={topic.id}>
                            {topic.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block mb-3 text-sm font-semibold text-gray-300">Subcategory</label>
                      <select
                        value={formData.subcategory}
                        onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                        className="w-full px-4 py-3.5 bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all cursor-pointer text-white"
                      >
                        {subtopics.map(subtopic => (
                          <option key={subtopic.id} value={subtopic.id}>
                            {subtopic.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block mb-3 text-sm font-semibold text-gray-300">
                      Tags <span className="text-red-500">*</span> <span className="font-normal text-gray-500">(comma-separated)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="e.g., hash-table, two-pointer, sliding-window"
                      className="w-full px-4 py-3.5 bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all text-white placeholder:text-gray-600"
                    />
                    {errors.tags && <p className="flex items-center gap-1 mt-2 text-sm text-red-500"><span>⚠</span>{errors.tags}</p>}
                    <p className="mt-2 text-xs text-gray-500">
                      Use hyphens for multi-word tags: "hash-table" not "hash table"
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Content Path Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <SectionHeader
              icon={FolderOpen}
              title="Content Path"
              subtitle="JSON file location for problem content"
              sectionKey="content"
            />
            
            <AnimatePresence>
              {expandedSections.has('content') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-4 space-y-5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6"
                >
                  <div>
                    <label className="block mb-3 text-sm font-semibold text-gray-300">
                      Content Path <span className="text-red-500">*</span> <span className="font-normal text-gray-500">(relative to backend root)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.contentPath}
                      onChange={(e) => setFormData({ ...formData, contentPath: e.target.value })}
                      placeholder={`data/DSA/${formData.category.charAt(0).toUpperCase() + formData.category.slice(1)}/${formData.subcategory}/${formData.slug || 'problem-name'}.json`}
                      className="w-full px-4 py-3.5 bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all text-white placeholder:text-gray-600"
                    />
                    {errors.contentPath && <p className="flex items-center gap-1 mt-2 text-sm text-red-500"><span>⚠</span>{errors.contentPath}</p>}
                    <div className="mt-3 p-3 bg-[#0f0f0f] rounded-lg border border-[#2a2a2a]">
                      <p className="text-xs text-orange-400 font-semibold mb-2">📁 Path Format:</p>
                      <code className="text-xs text-gray-300">data/DSA/{'{Topic}'}/{'{Subtopic}'}/{'{problem-slug}'}.json</code>
                      <p className="text-xs text-gray-500 mt-2">
                        Example: <code className="text-orange-300">data/DSA/Arrays/fundamentals/linear-search.json</code>
                      </p>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      JSON file must contain: statement, examples, constraints, testCases, hints, starterCode, approaches
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Submit Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-4 pt-6"
          >
            <motion.button
              type="button"
              onClick={() => navigate('/admin/problems')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3.5 bg-[#1a1a1a] border border-[#2a2a2a] hover:border-gray-600 rounded-xl font-medium transition-all text-gray-300 hover:text-white"
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 px-10 py-3.5 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 hover:from-orange-600 hover:via-orange-700 hover:to-orange-600 rounded-xl font-semibold shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white rounded-full animate-spin border-t-transparent" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus size={20} />
                  Create Problem
                </>
              )}
            </motion.button>
          </motion.div>
        </form>
      </main>
    </div>
  );
};

export default AddProblemPage;
