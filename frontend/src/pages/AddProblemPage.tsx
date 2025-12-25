import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Save, 
  X, 
  Plus, 
  Trash2,
  ArrowLeft,
  FileCode,
  TestTube,
  BookOpen,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ImageIcon,
  AlertCircle,
  Lightbulb,
  Building2,
  Link2,
  Code
} from 'lucide-react';
import { Sidebar } from '../components/navigation';
import ImageUpload from '../components/ui/ImageUpload';
import { useToast } from '../context/ToastContext';
import { dsaTopics, getSubtopicsForTopic } from '../data/dsaTopics';

interface Example {
  input: string;
  output: string;
  explanation: string;
}

interface TestCase {
  id: string;
  input: string[];
  output: string;
  isHidden: boolean;
}

interface Approach {
  id: string;
  name: string;
  type: 'brute' | 'better' | 'optimal' | 'optimal-1' | 'optimal-2' | 'optimal-3';
  videoUrl: string;
  intuition: string;
  explanation: string;
  timeComplexity: string;
  spaceComplexity: string;
  code: {
    javascript: string;
    python: string;
    java: string;
    cpp: string;
    typescript: string;
  };
}

const AddProblemPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [activeSection, setActiveSection] = useState<string>('basic');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['basic']));
  const [activeApproach, setActiveApproach] = useState<string>('0');

  const [formData, setFormData] = useState({
    title: '',
    difficulty: 'Easy',
    topicId: 'arrays',
    subtopicId: 'fundamentals',
    description: '',
    coins: 100,
    examples: [{ input: '', output: '', explanation: '' }] as Example[],
    constraints: [''],
    hints: [''],
    images: [] as string[],
    companies: [''],
    similarProblems: [''],
    approaches: [
      {
        id: '1',
        name: 'Brute Force',
        type: 'brute' as const,
        videoUrl: '',
        intuition: '',
        explanation: '',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        code: {
          javascript: '// Write your solution here\nfunction solve() {\n    \n}',
          python: '# Write your solution here\ndef solve():\n    pass',
          java: '// Write your solution here\nclass Solution {\n    public void solve() {\n        \n    }\n}',
          cpp: '// Write your solution here\nclass Solution {\npublic:\n    void solve() {\n        \n    }\n};',
          typescript: '// Write your solution here\nfunction solve(): void {\n    \n}'
        }
      }
    ] as Approach[],
    defaultCode: {
      javascript: '// Write your solution here\nfunction solve() {\n    \n}',
      python: '# Write your solution here\ndef solve():\n    pass',
      java: '// Write your solution here\nclass Solution {\n    public void solve() {\n        \n    }\n}',
      cpp: '// Write your solution here\nclass Solution {\npublic:\n    void solve() {\n        \n    }\n};',
      typescript: '// Write your solution here\nfunction solve(): void {\n    \n}'
    },
    testCases: [{ id: '1', input: ['', ''], output: '', isHidden: false }] as TestCase[]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.examples.length === 0) newErrors.examples = 'At least one example is required';
    if (formData.testCases.length === 0) newErrors.testCases = 'At least one test case is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      toast.error('Validation Failed', 'Please fill in all required fields');
      return;
    }

    try {
      toast.info('Creating...', 'Creating problem');
      
      // API call will go here
      console.log('Submitting problem:', formData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Success!', 'Problem created successfully');
      navigate('/admin/problems');
    } catch (error) {
      console.error('Failed to create problem:', error);
      toast.error('Creation Failed', 'Failed to create problem. Please try again.');
    }
  };

  const addExample = () => {
    setFormData({
      ...formData,
      examples: [...formData.examples, { input: '', output: '', explanation: '' }]
    });
  };

  const removeExample = (index: number) => {
    setFormData({
      ...formData,
      examples: formData.examples.filter((_, i) => i !== index)
    });
  };

  const addTestCase = () => {
    setFormData({
      ...formData,
      testCases: [...formData.testCases, { 
        id: String(formData.testCases.length + 1), 
        input: ['', ''], 
        output: '',
        isHidden: false
      }]
    });
  };

  const removeTestCase = (index: number) => {
    setFormData({
      ...formData,
      testCases: formData.testCases.filter((_, i) => i !== index)
    });
  };

  const addConstraint = () => {
    setFormData({
      ...formData,
      constraints: [...formData.constraints, '']
    });
  };

  const removeConstraint = (index: number) => {
    setFormData({
      ...formData,
      constraints: formData.constraints.filter((_, i) => i !== index)
    });
  };

  const addHint = () => {
    setFormData({
      ...formData,
      hints: [...formData.hints, '']
    });
  };

  const removeHint = (index: number) => {
    setFormData({
      ...formData,
      hints: formData.hints.filter((_, i) => i !== index)
    });
  };

  const addCompany = () => {
    setFormData({
      ...formData,
      companies: [...formData.companies, '']
    });
  };

  const removeCompany = (index: number) => {
    setFormData({
      ...formData,
      companies: formData.companies.filter((_, i) => i !== index)
    });
  };

  const addSimilarProblem = () => {
    setFormData({
      ...formData,
      similarProblems: [...formData.similarProblems, '']
    });
  };

  const removeSimilarProblem = (index: number) => {
    setFormData({
      ...formData,
      similarProblems: formData.similarProblems.filter((_, i) => i !== index)
    });
  };

  const addApproach = () => {
    const newId = String(formData.approaches.length + 1);
    setFormData({
      ...formData,
      approaches: [
        ...formData.approaches,
        {
          id: newId,
          name: 'New Approach',
          type: 'optimal' as const,
          videoUrl: '',
          intuition: '',
          explanation: '',
          timeComplexity: 'O(n)',
          spaceComplexity: 'O(1)',
          code: {
            javascript: '// Write your solution here\nfunction solve() {\n    \n}',
            python: '# Write your solution here\ndef solve():\n    pass',
            java: '// Write your solution here\nclass Solution {\n    public void solve() {\n        \n    }\n}',
            cpp: '// Write your solution here\nclass Solution {\npublic:\n    void solve() {\n        \n    }\n};',
            typescript: '// Write your solution here\nfunction solve(): void {\n    \n}'
          }
        }
      ]
    });
    setActiveApproach(newId);
  };

  const removeApproach = (index: number) => {
    if (formData.approaches.length === 1) {
      toast.warning('Cannot Delete', 'At least one approach is required');
      return;
    }
    setFormData({
      ...formData,
      approaches: formData.approaches.filter((_, i) => i !== index)
    });
    setActiveApproach('0');
  };

  const updateApproach = (index: number, updates: Partial<Approach>) => {
    const newApproaches = [...formData.approaches];
    newApproaches[index] = { ...newApproaches[index], ...updates };
    setFormData({ ...formData, approaches: newApproaches });
  };

  const SectionHeader = ({ 
    icon: Icon, 
    title, 
    subtitle, 
    sectionKey 
  }: { 
    icon: any, 
    title: string, 
    subtitle: string, 
    sectionKey: string 
  }) => (
    <button
      type="button"
      onClick={() => toggleSection(sectionKey)}
      className="w-full flex items-center justify-between p-5 bg-gradient-to-r from-[#1a1a1a] to-[#171717] border border-[#2a2a2a] rounded-xl hover:border-orange-500/40 hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-300 group"
    >
      <div className="flex items-center gap-4">
        <div className="p-2.5 bg-gradient-to-br from-orange-500/20 to-orange-600/10 rounded-xl border border-orange-500/20 group-hover:border-orange-500/40 transition-colors">
          <Icon className="text-orange-500" size={22} />
        </div>
        <div className="text-left">
          <h3 className="font-semibold text-base text-white">{title}</h3>
          <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
        </div>
      </div>
      {expandedSections.has(sectionKey) ? (
        <ChevronUp className="text-gray-400 group-hover:text-orange-500 transition-colors" size={22} />
      ) : (
        <ChevronDown className="text-gray-400 group-hover:text-orange-500 transition-colors" size={22} />
      )}
    </button>
  );

  return (
    <div className="flex min-h-screen bg-[#0f0f0f] text-white">
      <Sidebar activePage="home" />
      
      <main className="flex-1 pl-28 pr-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <Link 
            to="/admin/problems"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-orange-500 mb-6 transition-colors group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Problems</span>
          </Link>
          
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-300 bg-clip-text text-transparent">
              Add New Problem
            </h1>
            <p className="text-gray-400 text-lg">Create a new DSA problem with test cases and solutions</p>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-8 max-w-6xl mx-auto pb-12">
          {/* Basic Information */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <SectionHeader
              icon={Sparkles}
              title="Basic Information"
              subtitle="Problem title, difficulty, and description"
              sectionKey="basic"
            />
            
            <AnimatePresence>
              {expandedSections.has('basic') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-5 space-y-6 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-8"
                >
                  <div>
                    <label className="block text-sm font-semibold mb-3 text-gray-300">
                      Problem Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Two Sum"
                      className="w-full px-4 py-3.5 bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all text-white placeholder:text-gray-600"
                      required
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-2 flex items-center gap-1"><span>⚠</span>{errors.title}</p>}
                  </div>

                  <div className="grid grid-cols-3 gap-5">
                    <div>
                      <label className="block text-sm font-semibold mb-3 text-gray-300">Difficulty</label>
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

                    <div>
                      <label className="block text-sm font-semibold mb-3 text-gray-300">Coins Reward</label>
                      <input
                        type="number"
                        value={formData.coins}
                        onChange={(e) => setFormData({ ...formData, coins: parseInt(e.target.value) })}
                        className="w-full px-4 py-3.5 bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all text-white"
                        min="0"
                        step="50"
                      />
                    </div>
                  </div>

                  {/* Topic and Subtopic Selection */}
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold mb-3 text-gray-300">Topic</label>
                      <select
                        value={formData.topicId}
                        onChange={(e) => {
                          const newTopicId = e.target.value;
                          const firstSubtopic = getSubtopicsForTopic(newTopicId)[0]?.id || '';
                          setFormData({ 
                            ...formData, 
                            topicId: newTopicId,
                            subtopicId: firstSubtopic
                          });
                        }}
                        className="w-full px-4 py-3.5 bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all cursor-pointer text-white"
                      >
                        {dsaTopics.map(topic => (
                          <option key={topic.id} value={topic.id}>{topic.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-3 text-gray-300">Subtopic</label>
                      <select
                        value={formData.subtopicId}
                        onChange={(e) => setFormData({ ...formData, subtopicId: e.target.value })}
                        className="w-full px-4 py-3.5 bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all cursor-pointer text-white"
                      >
                        {getSubtopicsForTopic(formData.topicId).map(subtopic => (
                          <option key={subtopic.id} value={subtopic.id}>{subtopic.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-3 text-gray-300">
                      Problem Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={10}
                      placeholder="Describe the problem statement clearly...\n\nInclude:\n• Problem context\n• Input format\n• Output format\n• Any special conditions"
                      className="w-full px-4 py-3.5 bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all font-mono text-sm leading-relaxed text-white placeholder:text-gray-600"
                      required
                    />
                    {errors.description && <p className="text-red-500 text-sm mt-2 flex items-center gap-1"><span>⚠</span>{errors.description}</p>}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Images Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            <SectionHeader
              icon={ImageIcon}
              title="Problem Illustrations"
              subtitle="Add images to help explain the problem visually"
              sectionKey="images"
            />
            
            <AnimatePresence>
              {expandedSections.has('images') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-8"
                >
                  <ImageUpload
                    label="Upload Problem Images"
                    value={formData.images}
                    onChange={(urls) => setFormData({ ...formData, images: urls })}
                    maxImages={5}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* )}
            </AnimatePresence>
          </motion.div>

          {/* Examples */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <SectionHeader
              icon={BookOpen}
              title="Examples"
              subtitle="Add input/output examples to help users understand"
              sectionKey="examples"
            />
            
            <AnimatePresence>
              {expandedSections.has('examples') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-4 space-y-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6"
                >
                  {formData.examples.map((example, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="p-4 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg space-y-3"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-orange-500">Example {index + 1}</span>
                        {formData.examples.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeExample(index)}
                            className="p-1 hover:bg-red-900/20 rounded transition-colors"
                          >
                            <Trash2 size={16} className="text-red-400" />
                          </button>
                        )}
                      </div>
                      
                      <input
                        type="text"
                        placeholder="Input (e.g., nums = [2,7,11,15], target = 9)"
                        value={example.input}
                        onChange={(e) => {
                          const newExamples = [...formData.examples];
                          newExamples[index].input = e.target.value;
                          setFormData({ ...formData, examples: newExamples });
                        }}
                        className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded focus:outline-none focus:border-orange-500 transition-colors"
                      />
                      <input
                        type="text"
                        placeholder="Output (e.g., [0,1])"
                        value={example.output}
                        onChange={(e) => {
                          const newExamples = [...formData.examples];
                          newExamples[index].output = e.target.value;
                          setFormData({ ...formData, examples: newExamples });
                        }}
                        className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded focus:outline-none focus:border-orange-500 transition-colors"
                      />
                      <textarea
                        placeholder="Explanation (optional)"
                        value={example.explanation}
                        onChange={(e) => {
                          const newExamples = [...formData.examples];
                          newExamples[index].explanation = e.target.value;
                          setFormData({ ...formData, examples: newExamples });
                        }}
                        rows={2}
                        className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded focus:outline-none focus:border-orange-500 transition-colors"
                      />
                    </motion.div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={addExample}
                    className="w-full py-3 border-2 border-dashed border-[#2a2a2a] hover:border-orange-500 rounded-lg transition-colors flex items-center justify-center gap-2 text-gray-400 hover:text-orange-500"
                  >
                    <Plus size={20} />
                    Add Another Example
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Constraints */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            <SectionHeader
              icon={AlertCircle}
              title="Constraints"
              subtitle="Define input constraints and limitations"
              sectionKey="constraints"
            />
            
            <AnimatePresence>
              {expandedSections.has('constraints') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-4 space-y-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6"
                >
                  {formData.constraints.map((constraint, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g., 1 <= nums.length <= 10^5"
                        value={constraint}
                        onChange={(e) => {
                          const newConstraints = [...formData.constraints];
                          newConstraints[index] = e.target.value;
                          setFormData({ ...formData, constraints: newConstraints });
                        }}
                        className="flex-1 px-3 py-2 bg-[#0f0f0f] border border-[#2a2a2a] rounded focus:outline-none focus:border-orange-500 transition-colors font-mono text-sm"
                      />
                      {formData.constraints.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeConstraint(index)}
                          className="p-2 hover:bg-red-900/20 rounded transition-colors"
                        >
                          <Trash2 size={18} className="text-red-400" />
                        </button>
                      )}
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={addConstraint}
                    className="w-full py-2 border-2 border-dashed border-[#2a2a2a] hover:border-orange-500 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-orange-500"
                  >
                    <Plus size={16} />
                    Add Constraint
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Hints */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.27 }}
          >
            <SectionHeader
              icon={Lightbulb}
              title="Hints"
              subtitle="Provide helpful hints to guide users"
              sectionKey="hints"
            />
            
            <AnimatePresence>
              {expandedSections.has('hints') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-4 space-y-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6"
                >
                  {formData.hints.map((hint, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-orange-500">Hint {index + 1}</span>
                        {formData.hints.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeHint(index)}
                            className="p-1 hover:bg-red-900/20 rounded transition-colors"
                          >
                            <Trash2 size={16} className="text-red-400" />
                          </button>
                        )}
                      </div>
                      <textarea
                        placeholder="e.g., Try iterating through the array from the beginning."
                        value={hint}
                        onChange={(e) => {
                          const newHints = [...formData.hints];
                          newHints[index] = e.target.value;
                          setFormData({ ...formData, hints: newHints });
                        }}
                        rows={2}
                        className="w-full px-3 py-2 bg-[#0f0f0f] border border-[#2a2a2a] rounded focus:outline-none focus:border-orange-500 transition-colors text-sm"
                      />
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={addHint}
                    className="w-full py-2 border-2 border-dashed border-[#2a2a2a] hover:border-orange-500 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-orange-500"
                  >
                    <Plus size={16} />
                    Add Hint
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Extras: Companies & Similar Problems */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.29 }}
          >
            <SectionHeader
              icon={Building2}
              title="Extras"
              subtitle="Companies asking this problem and similar problems"
              sectionKey="extras"
            />
            
            <AnimatePresence>
              {expandedSections.has('extras') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-4 space-y-6 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6"
                >
                  {/* Companies */}
                  <div>
                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <Building2 size={16} className="text-blue-400" />
                      Companies
                    </h4>
                    <div className="space-y-2">
                      {formData.companies.map((company, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            placeholder="e.g., Google, Microsoft, Amazon"
                            value={company}
                            onChange={(e) => {
                              const newCompanies = [...formData.companies];
                              newCompanies[index] = e.target.value;
                              setFormData({ ...formData, companies: newCompanies });
                            }}
                            className="flex-1 px-3 py-2 bg-[#0f0f0f] border border-[#2a2a2a] rounded focus:outline-none focus:border-orange-500 transition-colors text-sm"
                          />
                          {formData.companies.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeCompany(index)}
                              className="p-2 hover:bg-red-900/20 rounded transition-colors"
                            >
                              <Trash2 size={16} className="text-red-400" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addCompany}
                        className="w-full py-2 border-2 border-dashed border-[#2a2a2a] hover:border-orange-500 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-orange-500"
                      >
                        <Plus size={16} />
                        Add Company
                      </button>
                    </div>
                  </div>

                  {/* Similar Problems */}
                  <div>
                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <Link2 size={16} className="text-green-400" />
                      Similar Problems
                    </h4>
                    <div className="space-y-2">
                      {formData.similarProblems.map((problem, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            placeholder="e.g., Majority Element II"
                            value={problem}
                            onChange={(e) => {
                              const newProblems = [...formData.similarProblems];
                              newProblems[index] = e.target.value;
                              setFormData({ ...formData, similarProblems: newProblems });
                            }}
                            className="flex-1 px-3 py-2 bg-[#0f0f0f] border border-[#2a2a2a] rounded focus:outline-none focus:border-orange-500 transition-colors text-sm"
                          />
                          {formData.similarProblems.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeSimilarProblem(index)}
                              className="p-2 hover:bg-red-900/20 rounded transition-colors"
                            >
                              <Trash2 size={16} className="text-red-400" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addSimilarProblem}
                        className="w-full py-2 border-2 border-dashed border-[#2a2a2a] hover:border-orange-500 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-orange-500"
                      >
                        <Plus size={16} />
                        Add Similar Problem
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Starter Code (for students to begin with) */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.31 }}
          >
            <SectionHeader
              icon={FileCode}
              title="Starter Code"
              subtitle="Initial code template students see when solving (not the solution)"
              sectionKey="starterCode"
            />
            
            <AnimatePresence>
              {expandedSections.has('starterCode') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-4 space-y-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6"
                >
                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-sm text-blue-300">
                    ℹ️ This is the starting code template students will see in the editor. It should be minimal (just function signature).
                  </div>
                  {Object.entries(formData.defaultCode).map(([lang, code]) => (
                    <div key={lang}>
                      <label className="block text-sm font-medium mb-2 capitalize flex items-center gap-2">
                        <span className="px-2 py-1 bg-[#0f0f0f] rounded text-xs">{lang}</span>
                      </label>
                      <textarea
                        value={code}
                        onChange={(e) => setFormData({
                          ...formData,
                          defaultCode: {
                            ...formData.defaultCode,
                            [lang]: e.target.value
                          }
                        })}
                        rows={8}
                        className="w-full px-4 py-3 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg focus:outline-none focus:border-orange-500 transition-colors font-mono text-sm"
                      />
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Test Cases */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            <SectionHeader
              icon={TestTube}
              title="Test Cases"
              subtitle="Define test cases to validate solutions"
              sectionKey="testCases"
            />
            
            <AnimatePresence>
              {expandedSections.has('testCases') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-4 space-y-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6"
                >
                  {formData.testCases.map((testCase, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="p-4 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg space-y-3"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-blue-400">Test Case {index + 1}</span>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={testCase.isHidden}
                              onChange={(e) => {
                                const newTestCases = [...formData.testCases];
                                newTestCases[index].isHidden = e.target.checked;
                                setFormData({ ...formData, testCases: newTestCases });
                              }}
                              className="w-4 h-4 rounded border-[#2a2a2a] bg-[#1a1a1a] text-orange-500 focus:ring-orange-500 focus:ring-offset-0"
                            />
                            <span className="text-xs text-gray-400">Hidden from users</span>
                          </label>
                        </div>
                        {formData.testCases.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeTestCase(index)}
                            className="p-1 hover:bg-red-900/20 rounded transition-colors"
                          >
                            <Trash2 size={16} className="text-red-400" />
                          </button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Input 1 (e.g., [2,7,11,15])"
                          value={testCase.input[0]}
                          onChange={(e) => {
                            const newTestCases = [...formData.testCases];
                            newTestCases[index].input[0] = e.target.value;
                            setFormData({ ...formData, testCases: newTestCases });
                          }}
                          className="px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded focus:outline-none focus:border-orange-500 transition-colors"
                        />
                        <input
                          type="text"
                          placeholder="Input 2 (e.g., 9)"
                          value={testCase.input[1]}
                          onChange={(e) => {
                            const newTestCases = [...formData.testCases];
                            newTestCases[index].input[1] = e.target.value;
                            setFormData({ ...formData, testCases: newTestCases });
                          }}
                          className="px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded focus:outline-none focus:border-orange-500 transition-colors"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Expected Output (e.g., [0,1])"
                        value={testCase.output}
                        onChange={(e) => {
                          const newTestCases = [...formData.testCases];
                          newTestCases[index].output = e.target.value;
                          setFormData({ ...formData, testCases: newTestCases });
                        }}
                        className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded focus:outline-none focus:border-orange-500 transition-colors"
                      />
                    </motion.div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={addTestCase}
                    className="w-full py-3 border-2 border-dashed border-[#2a2a2a] hover:border-orange-500 rounded-lg transition-colors flex items-center justify-center gap-2 text-gray-400 hover:text-orange-500"
                  >
                    <Plus size={20} />
                    Add Test Case
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Solution Approaches */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <SectionHeader
              icon={Code}
              title="Solution Approaches (Editorial)"
              subtitle="Add multiple solution approaches for the editorial (brute, better, optimal-1, optimal-2, etc.)"
              sectionKey="approaches"
            />
            
            <AnimatePresence>
              {expandedSections.has('approaches') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6 space-y-4"
                >
                  {/* Approach Tabs */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    {formData.approaches.map((approach, index) => (
                      <button
                        key={approach.id}
                        type="button"
                        onClick={() => setActiveApproach(String(index))}
                        className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                          activeApproach === String(index)
                            ? 'bg-orange-500 text-white'
                            : 'bg-[#0f0f0f] text-gray-400 hover:text-white border border-[#2a2a2a]'
                        }`}
                      >
                        {approach.name}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={addApproach}
                      className="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap bg-[#0f0f0f] text-gray-400 hover:text-orange-500 border border-dashed border-[#2a2a2a] hover:border-orange-500 transition-colors flex items-center gap-1"
                    >
                      <Plus size={16} />
                      Add Approach
                    </button>
                  </div>

                  {/* Active Approach Content */}
                  {formData.approaches.map((approach, index) => (
                    activeApproach === String(index) && (
                      <motion.div
                        key={approach.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4 p-4 bg-[#0f0f0f] rounded-lg"
                      >
                        {/* Approach Settings */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Approach Name</label>
                            <input
                              type="text"
                              value={approach.name}
                              onChange={(e) => updateApproach(index, { name: e.target.value })}
                              placeholder="e.g., Brute Force, Optimal"
                              className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded focus:outline-none focus:border-orange-500 transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Type</label>
                            <select
                              value={approach.type}
                              onChange={(e) => updateApproach(index, { type: e.target.value as Approach['type'] })}
                              className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded focus:outline-none focus:border-orange-500 transition-colors cursor-pointer"
                            >
                              <option value="brute">Brute Force</option>
                              <option value="better">Better</option>
                              <option value="optimal">Optimal</option>
                              <option value="optimal-1">Optimal-1</option>
                              <option value="optimal-2">Optimal-2</option>
                              <option value="optimal-3">Optimal-3</option>
                            </select>
                          </div>
                        </div>

                        {/* Video URL */}
                        <div>
                          <label className="block text-sm font-medium mb-2">Video Explanation URL (Optional)</label>
                          <input
                            type="url"
                            value={approach.videoUrl}
                            onChange={(e) => updateApproach(index, { videoUrl: e.target.value })}
                            placeholder="e.g., https://youtube.com/watch?v=... or https://vimeo.com/..."
                            className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded focus:outline-none focus:border-orange-500 transition-colors text-sm"
                          />
                        </div>

                        {/* Intuition */}
                        <div>
                          <label className="block text-sm font-medium mb-2">Intuition</label>
                          <textarea
                            value={approach.intuition}
                            onChange={(e) => updateApproach(index, { intuition: e.target.value })}
                            placeholder="Explain the intuition behind this approach..."
                            rows={3}
                            className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded focus:outline-none focus:border-orange-500 transition-colors text-sm"
                          />
                        </div>

                        {/* Explanation */}
                        <div>
                          <label className="block text-sm font-medium mb-2">Approach Explanation</label>
                          <textarea
                            value={approach.explanation}
                            onChange={(e) => updateApproach(index, { explanation: e.target.value })}
                            placeholder="Step-by-step explanation of the algorithm..."
                            rows={4}
                            className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded focus:outline-none focus:border-orange-500 transition-colors text-sm"
                          />
                        </div>

                        {/* Complexity */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Time Complexity</label>
                            <input
                              type="text"
                              value={approach.timeComplexity}
                              onChange={(e) => updateApproach(index, { timeComplexity: e.target.value })}
                              placeholder="e.g., O(n^2)"
                              className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded focus:outline-none focus:border-orange-500 transition-colors font-mono text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Space Complexity</label>
                            <input
                              type="text"
                              value={approach.spaceComplexity}
                              onChange={(e) => updateApproach(index, { spaceComplexity: e.target.value })}
                              placeholder="e.g., O(1)"
                              className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded focus:outline-none focus:border-orange-500 transition-colors font-mono text-sm"
                            />
                          </div>
                        </div>

                        {/* Code for Each Language */}
                        <div className="space-y-3">
                          <label className="block text-sm font-medium">Implementation Code</label>
                          {Object.entries(approach.code).map(([lang, code]) => (
                            <div key={lang}>
                              <div className="flex items-center justify-between mb-2">
                                <span className="px-2 py-1 bg-[#1a1a1a] rounded text-xs capitalize">{lang}</span>
                              </div>
                              <textarea
                                value={code}
                                onChange={(e) => updateApproach(index, {
                                  code: { ...approach.code, [lang]: e.target.value }
                                })}
                                rows={10}
                                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg focus:outline-none focus:border-orange-500 transition-colors font-mono text-sm"
                              />
                            </div>
                          ))}
                        </div>

                        {/* Delete Approach Button */}
                        {formData.approaches.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeApproach(index)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-900/20 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                            Delete This Approach
                          </button>
                        )}
                      </motion.div>
                    )
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-end gap-4 pt-10 border-t border-[#2a2a2a]"
          >
            <Link to="/admin/problems">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                className="px-10 py-4 bg-[#1a1a1a] border border-[#2a2a2a] hover:border-gray-500 rounded-xl transition-all font-medium text-gray-300 hover:text-white"
              >
                Cancel
              </motion.button>
            </Link>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 hover:from-orange-600 hover:via-orange-700 hover:to-orange-600 rounded-xl font-semibold shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all"
            >
              <Save size={20} />
              Save Problem
            </motion.button>
          </motion.div>
        </form>
      </main>
    </div>
  );
};

export default AddProblemPage;
