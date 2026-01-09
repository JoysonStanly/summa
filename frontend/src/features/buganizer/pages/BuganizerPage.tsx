import { useEffect, useMemo, useState } from 'react';
import { Home, Settings, Bug, Calendar, ChevronDown, Plus, Eye, Trash2, BugOff, Clock, CircleCheckBig, MessageCircle, X, Upload, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { bugService, type BugPriority, type BugReport, type BugStatus } from '@/services/api/bugService';

const BuganizerPage = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'open' | 'in-progress' | 'resolved' | 'closed'>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<BugPriority>('low');
  const [bugs, setBugs] = useState<BugReport[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch user's own bug reports
  useEffect(() => {
    const fetchBugs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await bugService.getMyBugReports();
        setBugs(data);
      } catch (err) {
        console.error('Failed to fetch bugs:', err);
        setError(err instanceof Error ? err.message : 'Failed to load bug reports');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBugs();
  }, []);

  // Filter and count bugs
  const filteredBugs = useMemo(() => {
    if (activeFilter === 'all') return bugs;
    return bugs.filter((bug) => bug.status === activeFilter);
  }, [activeFilter, bugs]);

  const statusCounts = useMemo(() => ({
    all: bugs.length,
    open: bugs.filter((b) => b.status === 'open').length,
    'in-progress': bugs.filter((b) => b.status === 'in-progress').length,
    resolved: bugs.filter((b) => b.status === 'resolved').length,
    closed: bugs.filter((b) => b.status === 'closed').length,
  }), [bugs]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!category || !title || !description || !priority) {
      setError('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const newBug = await bugService.createBugReport({
        title,
        description,
        priority,
        category,
      });

      setBugs((prev) => [newBug, ...prev]);

      // Reset form
      setCategory('');
      setTitle('');
      setDescription('');
      setPriority('low');
      setIsFormOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit bug report');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPriorityColor = (priorityLevel: string) => {
    switch (priorityLevel.toLowerCase()) {
      case 'critical':
        return 'bg-red-500/10 text-red-400';
      case 'high':
        return 'bg-orange-500/10 text-orange-400';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-400';
      case 'low':
        return 'bg-green-500/10 text-green-400';
      default:
        return 'bg-gray-500/10 text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-purple-500/10 text-purple-400';
      case 'in-progress':
        return 'bg-blue-500/10 text-blue-400';
      case 'resolved':
        return 'bg-green-500/10 text-green-400';
      case 'closed':
        return 'bg-gray-500/10 text-gray-400';
      default:
        return 'bg-gray-500/10 text-gray-400';
    }
  };

  const getCategoryColor = (categoryType: string) => {
    const lowerCat = categoryType.toLowerCase();
    if (lowerCat.includes('problem')) return 'bg-blue-500/10 text-blue-400';
    if (lowerCat.includes('tech')) return 'bg-purple-500/10 text-purple-400';
    if (lowerCat.includes('editorial')) return 'bg-green-500/10 text-green-400';
    if (lowerCat.includes('video')) return 'bg-orange-500/10 text-orange-400';
    return 'bg-gray-500/10 text-gray-400';
  };

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Minimal Sidebar */}
      <aside className="hidden lg:block w-[90px] h-screen border-r border-zinc-800 bg-[#1a1a1a]">
        <div className="flex flex-col items-center h-full px-2 py-6">
          {/* Logo */}
          <div className="mb-6">
            <img
              src="/images/logo.png"
              alt="StudyIO Logo"
              className="object-contain w-12 h-12 transition-transform cursor-pointer mix-blend-lighten hover:scale-105"
              style={{ filter: 'brightness(1.2) contrast(1.1)' }}
              onClick={() => navigate('/')}
            />
          </div>

          <div className="w-3/4 h-[2px] bg-zinc-800 rounded-md mb-6"></div>

          {/* Home Icon */}
          <button
            onClick={() => navigate('/')}
            className="flex flex-col items-center justify-center w-10 h-10 gap-1 mb-4 transition-colors rounded-md hover:bg-zinc-800"
          >
            <Home size={16} />
            <span className="text-[10px]">Home</span>
          </button>

          {/* Bug Icon - Active */}
          <button className="flex flex-col items-center justify-center w-10 h-10 gap-1 mb-4 rounded-md bg-gradient-to-br from-[#EA763F]/20 to-[#EA763F]/10 border border-[#EA763F]/30">
            <Bug size={16} className="text-[#EA763F]" />
            <span className="text-[10px] text-[#EA763F]">Bug</span>
          </button>

          {/* Account Icon */}
          <button
            onClick={() => navigate('/account')}
            className="flex flex-col items-center justify-center w-10 h-10 gap-1 mb-4 transition-colors rounded-md hover:bg-zinc-800"
          >
            <Settings size={16} />
            <span className="text-[10px]">Account</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="flex flex-col h-full p-4 gap-6">
          {/* Top Controls */}
          <div className="flex flex-col md:flex-row items-end justify-end gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsFormOpen(true)}
                className="flex items-center gap-2 px-4 h-8 bg-zinc-900 border border-zinc-800 rounded-md text-sm transition-colors hover:bg-zinc-800"
              >
                <Plus className={`w-4 h-4 transition-transform duration-300 ${isFormOpen ? 'rotate-45' : ''}`} />
                {isFormOpen ? 'Close' : 'Report new bug'}
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 h-8 bg-zinc-900 border border-zinc-800 rounded-md text-sm transition-colors hover:bg-zinc-800">
                <Calendar className="w-4 h-4" />
                <span className="flex-1 text-left">Start date</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <button className="flex items-center gap-2 px-4 h-8 bg-zinc-900 border border-zinc-800 rounded-md text-sm transition-colors hover:bg-zinc-800">
                <Calendar className="w-4 h-4" />
                <span className="flex-1 text-left">End date</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Status Filter Cards */}
          <div className="flex w-full overflow-x-auto gap-4 pb-2">
            <button
              onClick={() => setActiveFilter('all')}
              className={`flex-1 flex items-center justify-between gap-2 text-sm px-4 py-1.5 h-16 rounded-lg transition-all duration-200 border min-w-[160px] flex-shrink-0 ${
                activeFilter === 'all'
                  ? 'bg-orange-500/20 dark:bg-orange-500/10 border-orange-500/60 dark:border-orange-500/40 !text-orange-600 dark:!text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.15)] dark:shadow-[0_0_15px_rgba(249,115,22,0.08)]'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
              }`}
            >
              <span className="flex items-center gap-2 font-medium">
                <Bug className="w-4 h-4" />
                All bugs
              </span>
              <span className="text-lg font-medium">{statusCounts.all}</span>
            </button>

            <button
              onClick={() => setActiveFilter('open')}
              className={`flex-1 flex items-center justify-between gap-2 text-sm px-4 py-1.5 h-16 rounded-lg transition-all duration-200 border min-w-[160px] flex-shrink-0 ${
                activeFilter === 'open'
                  ? 'bg-purple-500/20 border-purple-500/60 text-purple-400'
                  : 'bg-purple-500/10 dark:bg-purple-500/5 border-transparent text-purple-600 dark:text-purple-400 hover:bg-purple-500/15 dark:hover:bg-purple-500/10'
              }`}
            >
              <span className="flex items-center gap-2 font-medium">
                <BugOff className="w-4 h-4" />
                Open
              </span>
              <span className="text-lg font-medium">{statusCounts.open}</span>
            </button>

            <button
              onClick={() => setActiveFilter('in-progress')}
              className={`flex-1 flex items-center justify-between gap-2 text-sm px-4 py-1.5 h-16 rounded-lg transition-all duration-200 border min-w-[160px] flex-shrink-0 ${
                activeFilter === 'in-progress'
                  ? 'bg-blue-500/20 border-blue-500/60 text-blue-400'
                  : 'bg-blue-500/10 dark:bg-blue-500/5 border-transparent text-blue-600 dark:text-blue-400 hover:bg-blue-500/15 dark:hover:bg-blue-500/10'
              }`}
            >
              <span className="flex items-center gap-2 font-medium">
                <Clock className="w-4 h-4" />
                In Progress
              </span>
              <span className="text-lg font-medium">{statusCounts['in-progress']}</span>
            </button>

            <button
              onClick={() => setActiveFilter('resolved')}
              className={`flex-1 flex items-center justify-between gap-2 text-sm px-4 py-1.5 h-16 rounded-lg transition-all duration-200 border min-w-[160px] flex-shrink-0 ${
                activeFilter === 'resolved'
                  ? 'bg-green-500/20 border-green-500/60 text-green-400'
                  : 'bg-green-500/10 dark:bg-green-500/5 border-transparent text-green-600 dark:text-green-400 hover:bg-green-500/15 dark:hover:bg-green-500/10'
              }`}
            >
              <span className="flex items-center gap-2 font-medium">
                <CircleCheckBig className="w-4 h-4" />
                Resolved
              </span>
              <span className="text-lg font-medium">{statusCounts.resolved}</span>
            </button>

            <button
              onClick={() => setActiveFilter('closed')}
              className={`flex-1 flex items-center justify-between gap-2 text-sm px-4 py-1.5 h-16 rounded-lg transition-all duration-200 border min-w-[160px] flex-shrink-0 ${
                activeFilter === 'closed'
                  ? 'bg-yellow-600/20 border-yellow-600/60 text-yellow-500'
                  : 'bg-yellow-600/10 dark:bg-yellow-600/5 border-transparent text-yellow-700 dark:text-yellow-500 hover:bg-yellow-600/15 dark:hover:bg-yellow-600/10'
              }`}
            >
              <span className="flex items-center gap-2 font-medium">
                <MessageCircle className="w-4 h-4" />
                Closed
              </span>
              <span className="text-lg font-medium">{statusCounts.closed}</span>
            </button>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between text-sm text-zinc-400 px-2">
            <span>Showing {filteredBugs.length} of {statusCounts.all} bugs</span>
          </div>

          {/* Bugs Table */}
          <div className="flex-1 border rounded-lg border-zinc-800 overflow-hidden">
            <div className="h-full overflow-auto">
              {isLoading ? (
                <div className="p-12 text-center text-zinc-400">Loading your bug reports...</div>
              ) : error ? (
                <div className="p-12 text-center">
                  <p className="text-red-400 mb-2">{error}</p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="text-sm text-zinc-400 hover:text-white"
                  >
                    Retry
                  </button>
                </div>
              ) : filteredBugs.length === 0 ? (
                <div className="p-12 text-center text-zinc-400">
                  {activeFilter === 'all' ? 'No bug reports yet. Report your first bug!' : `No ${activeFilter} bugs found`}
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-[#0a0a0a] border-b border-zinc-800">
                    <tr>
                      <th className="h-10 px-6 text-left font-medium text-zinc-400 w-24">Id</th>
                      <th className="h-10 px-6 text-left font-medium text-zinc-400 w-80">Title</th>
                      <th className="h-10 px-6 text-left font-medium text-zinc-400 w-24">Category</th>
                      <th className="h-10 px-6 text-center font-medium text-zinc-400 w-20">Priority</th>
                      <th className="h-10 px-6 text-center font-medium text-zinc-400 w-20">Status</th>
                      <th className="h-10 px-6 text-center font-medium text-zinc-400 w-28">Reported on</th>
                      <th className="h-10 px-6 text-center font-medium text-zinc-400 w-28">Last updated</th>
                      <th className="h-10 px-6 text-center font-medium text-zinc-400 w-24">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBugs.map((bug) => (
                      <tr key={bug._id} className="border-b border-zinc-800 hover:bg-zinc-900/50 transition-colors">
                        <td className="px-6 py-3 font-medium text-xs">{bug._id.slice(-6)}</td>
                        <td className="px-6 py-3 max-w-0 truncate" title={bug.title}>
                          <span className="block truncate">{bug.title}</span>
                        </td>
                        <td className="px-6 py-3">
                          <span className={`px-2 py-1 rounded text-xs ${getCategoryColor(bug.category)}`}>
                            {bug.category}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-center">
                          <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(bug.priority)}`}>
                            {bug.priority}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-center">
                          <span className={`px-2 py-1 rounded text-xs ${getStatusColor(bug.status)}`}>
                            {bug.status}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-center text-sm text-zinc-400">
                          {new Date(bug.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-3 text-center text-sm text-zinc-400">
                          {new Date(bug.updatedAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <button className="p-1.5 hover:bg-zinc-800 rounded transition-colors group">
                              <Eye className="w-4 h-4 text-zinc-400 group-hover:text-white" />
                            </button>
                            <button 
                              onClick={async () => {
                                if (window.confirm('Delete this bug report?')) {
                                  try {
                                    await bugService.deleteBugReport(bug._id);
                                    setBugs((prev) => prev.filter((b) => b._id !== bug._id));
                                  } catch (err) {
                                    alert('Failed to delete bug report');
                                  }
                                }
                              }}
                              className="p-1.5 hover:bg-red-500/10 rounded transition-colors group"
                            >
                              <Trash2 className="w-4 h-4 text-zinc-400 group-hover:text-red-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Bug Report Form Side Panel */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-end">
            <div className="w-full max-w-2xl h-full bg-zinc-900 border-l border-zinc-800 overflow-y-auto animate-in slide-in-from-right">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Report a Bug</h2>
                  <button
                    onClick={() => setIsFormOpen(false)}
                    className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-zinc-400" />
                  </button>
                </div>

                {/* Category Info Accordion */}
                <div className="mb-6">
                  <details className="group">
                    <summary className="flex items-center gap-2 cursor-pointer text-zinc-400 hover:text-white transition-colors">
                      <Info className="w-4 h-4" />
                      <span className="text-sm">What do these categories mean?</span>
                      <ChevronDown className="w-4 h-4 ml-auto group-open:rotate-180 transition-transform" />
                    </summary>
                    <div className="mt-3 ml-6 space-y-2 text-sm text-zinc-400">
                      <p><strong className="text-white">Problem Bugs:</strong> Issues related to problem statements, test cases, or expected outputs</p>
                      <p><strong className="text-white">Tech Bugs:</strong> Technical issues with the website, editor, or submission system</p>
                      <p><strong className="text-white">Editorial Bugs:</strong> Errors or issues in problem editorials or solutions</p>
                      <p><strong className="text-white">Video:</strong> Problems with video playback or content</p>
                      <p><strong className="text-white">Others:</strong> Any other issues not covered above</p>
                    </div>
                  </details>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                      {error}
                    </div>
                  )}

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Category <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-[#EA763F] transition-colors"
                      required
                    >
                      <option value="">Select category</option>
                      <option value="problem">Problem Bugs</option>
                      <option value="tech">Tech Bugs</option>
                      <option value="editorial">Editorial Bugs</option>
                      <option value="video">Video</option>
                      <option value="others">Others</option>
                    </select>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Title <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Brief description of the issue"
                      className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-[#EA763F] transition-colors"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Description <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Provide detailed information about the bug..."
                      rows={6}
                      className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-[#EA763F] transition-colors resize-none"
                      required
                    />
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Priority <span className="text-red-400">*</span>
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {['low', 'medium', 'high', 'critical'].map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setPriority(level as BugPriority)}
                          className={`px-4 py-3 rounded-lg border transition-all capitalize ${
                            priority === level
                              ? level === 'low'
                                ? 'bg-green-500/20 border-green-500 text-green-400'
                                : level === 'medium'
                                ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400'
                                : level === 'high'
                                ? 'bg-orange-500/20 border-orange-500 text-orange-400'
                                : 'bg-red-500/20 border-red-500 text-red-400'
                              : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* File Upload */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Screenshots (Optional)
                    </label>
                    <div className="border-2 border-dashed border-zinc-700 rounded-lg p-8 text-center hover:border-zinc-600 transition-colors cursor-pointer">
                      <Upload className="w-8 h-8 text-zinc-500 mx-auto mb-3" />
                      <p className="text-sm text-zinc-400 mb-1">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-zinc-500">
                        PNG, JPG or JPEG (Max 5 images, each &lt;1MB)
                      </p>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/jpg"
                        multiple
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-[#EA763F] hover:bg-[#d86832] text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!category || !title || !description || !priority || isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Bug Report'}
                  </button>
                </form>

                {/* WhatsApp Support */}
                <div className="mt-6 pt-6 border-t border-zinc-800">
                  <p className="text-sm text-zinc-400 text-center">
                    Need immediate help?{' '}
                    <a
                      href="https://wa.me/your-number"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#EA763F] hover:underline"
                    >
                      Contact us on WhatsApp
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuganizerPage;
