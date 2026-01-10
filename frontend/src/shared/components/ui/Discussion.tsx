import { useState, useEffect } from 'react';
import { Bold, Italic, Code, Link as LinkIcon, List, ThumbsUp, Clock, Loader2, AlertCircle } from 'lucide-react';
import { 
  getProblemDiscussions, 
  createDiscussion, 
  toggleLike,
  getUserDiscussions
} from '@shared/api/discussionService';
import type { Discussion as DiscussionType } from '@shared/api/discussionService';
import { useAuth } from '@features/auth/stores/AuthContext';

interface DiscussionProps {
  problemId: string;
}

// Helper function to get user initials
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Helper function to format time ago
const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };
  
  for (const [key, value] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / value);
    if (interval >= 1) {
      return `${interval} ${key}${interval === 1 ? '' : 's'} ago`;
    }
  }
  
  return 'just now';
};

const Discussion = ({ problemId }: DiscussionProps) => {
  const [activeTab, setActiveTab] = useState<'community' | 'mine'>('community');
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');
  const [commentText, setCommentText] = useState('');
  const [titleText, setTitleText] = useState('');
  const [discussions, setDiscussions] = useState<DiscussionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  
  // Fetch discussions
  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let response;
        if (activeTab === 'mine' && user?._id) {
          response = await getUserDiscussions(user._id);
        } else {
          response = await getProblemDiscussions(problemId, { sortBy });
        }
        
        setDiscussions(response.data || []);
      } catch (err: any) {
        console.error('Error fetching discussions:', err);
        setError(err.response?.data?.message || 'Failed to load discussions');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDiscussions();
  }, [problemId, activeTab, sortBy, user?._id]);
  
  const handleTabChange = (tab: 'community' | 'mine') => {
    setActiveTab(tab);
  };
  
  const handleSortChange = (sort: 'recent' | 'popular') => {
    setSortBy(sort);
  };
  
  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;
    
    if (!user) {
      alert('Please login to post a discussion');
      return;
    }
    
    // Use first line as title or generate one (must be at least 5 chars per backend validation)
    let title = titleText.trim() || commentText.trim().split('\n')[0].slice(0, 100);
    if (!title || title.length < 5) {
      title = 'Discussion about this problem';
    }
    
    try {
      setSubmitting(true);
      await createDiscussion({
        problemId,
        title,
        content: commentText.trim(),
        category: 'discussion',
      });
      
      setCommentText('');
      setTitleText('');
      
      // Refresh discussions
      const response = await getProblemDiscussions(problemId, { sortBy });
      setDiscussions(response.data || []);
    } catch (err: any) {
      console.error('Error creating discussion:', err);
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to post discussion';
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleToggleLike = async (discussionId: string) => {
    if (!user) {
      alert('Please login to like discussions');
      return;
    }
    
    try {
      await toggleLike(discussionId);
      
      // Update local state
      setDiscussions(prev => 
        prev.map(d => {
          if (d._id === discussionId) {
            const isLiked = d.likes.includes(user._id);
            return {
              ...d,
              likes: isLiked 
                ? d.likes.filter(id => id !== user._id)
                : [...d.likes, user._id]
            };
          }
          return d;
        })
      );
    } catch (err: any) {
      console.error('Error toggling like:', err);
    }
  };
  
  // Extract code snippets from content (if wrapped in ``` blocks)
  const extractCodeSnippet = (content: string): { text: string; code?: string } => {
    const codeMatch = content.match(/```[\s\S]*?```/);
    if (codeMatch) {
      const code = codeMatch[0].replace(/```/g, '').trim();
      const text = content.replace(/```[\s\S]*?```/, '').trim();
      return { text, code };
    }
    return { text: content };
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Comment Input Section */}
      <div className="mb-8 rounded-lg border border-[#2a2a2a] overflow-hidden bg-[#0D0D0D]">
        {/* Title Input */}
        <div className="border-b border-[#2a2a2a]">
          <input
            type="text"
            placeholder={user ? "Title (optional - min 5 characters, or auto-generated)" : "Please login to post"}
            className="w-full bg-transparent border-0 text-gray-300 px-4 py-3 focus:outline-none"
            value={titleText}
            onChange={(e) => setTitleText(e.target.value)}
            disabled={!user || submitting}
          />
        </div>
        
        {/* Formatting toolbar */}
        <div className="flex items-center gap-1 px-4 py-2.5 border-b border-[#2a2a2a]">
          <button 
            className="p-2 text-gray-400 hover:text-white hover:bg-[#2a2a2a] rounded transition-colors"
            title="Use ``` for code blocks"
          >
            <Bold size={16} />
          </button>
          <button className="p-2 text-gray-400 hover:text-white hover:bg-[#2a2a2a] rounded transition-colors">
            <Italic size={16} />
          </button>
          <button className="p-2 text-gray-400 hover:text-white hover:bg-[#2a2a2a] rounded transition-colors">
            <Code size={16} />
          </button>
          <button className="p-2 text-gray-400 hover:text-white hover:bg-[#2a2a2a] rounded transition-colors">
            <LinkIcon size={16} />
          </button>
          <button className="p-2 text-gray-400 hover:text-white hover:bg-[#2a2a2a] rounded transition-colors">
            <List size={16} />
          </button>
        </div>
        
        {/* Text area */}
        <div>
          <textarea
            placeholder={user ? "Ask a question or share your approach... (Use ``` for code blocks)" : "Please login to post a discussion"}
            className="w-full bg-transparent border-0 text-gray-300 p-4 min-h-[120px] focus:outline-none resize-none"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            disabled={!user || submitting}
          />
          
          <div className="flex justify-end p-4 border-t border-[#2a2a2a]">
            <button
              onClick={handleCommentSubmit}
              disabled={!user || !commentText.trim() || submitting}
              className="px-6 py-2 rounded-lg bg-[#FF6D00] text-white hover:bg-[#FF8533] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Posting...
                </>
              ) : (
                'Comment'
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Tabs and Sort Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2a2a2a] mb-6 pb-px">
        {/* Community/Mine tabs */}
        <div className="flex gap-1">
          <button
            className={`px-5 py-2.5 text-sm font-medium transition-colors relative ${
              activeTab === 'community' 
                ? 'text-white' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => handleTabChange('community')}
          >
            Community
            {activeTab === 'community' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6D00]" />
            )}
          </button>
          <button
            className={`px-5 py-2.5 text-sm font-medium transition-colors relative ${
              activeTab === 'mine' 
                ? 'text-white' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => handleTabChange('mine')}
            disabled={!user}
          >
            Mine
            {activeTab === 'mine' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6D00]" />
            )}
          </button>
        </div>
        
        {/* Sort buttons */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Sort by:</span>
          <button 
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              sortBy === 'popular' 
                ? 'bg-[#FF6D00] text-white' 
                : 'text-gray-400 hover:text-white hover:bg-[#2a2a2a]'
            } flex items-center gap-1.5`}
            onClick={() => handleSortChange('popular')}
          >
            <ThumbsUp size={14} />
            <span>Popular</span>
          </button>
          <button 
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              sortBy === 'recent' 
                ? 'bg-[#FF6D00] text-white' 
                : 'text-gray-400 hover:text-white hover:bg-[#2a2a2a]'
            } flex items-center gap-1.5`}
            onClick={() => handleSortChange('recent')}
          >
            <Clock size={14} />
            <span>Recent</span>
          </button>
        </div>
      </div>
      
      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#FF6D00]" />
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 mb-6">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      )}
      
      {/* Discussion Posts */}
      {!loading && !error && (
        <div className="space-y-6">
          {discussions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No discussions yet. Be the first to start one!</p>
            </div>
          ) : (
            discussions.map((discussion) => {
              const { text, code } = extractCodeSnippet(discussion.content);
              const isLiked = user ? discussion.likes.includes(user._id) : false;
              
              return (
                <div key={discussion._id} className="pb-6 border-b border-[#2a2a2a] last:border-b-0">
                  {/* User info */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#FF6D00] to-[#FF8533] flex items-center justify-center text-white font-semibold shadow-lg">
                      {getInitials(discussion.userId.name)}
                    </div>
                    <div>
                      <div className="text-white font-medium text-base">{discussion.userId.name}</div>
                      <div className="text-gray-500 text-sm">{formatTimeAgo(discussion.createdAt)}</div>
                    </div>
                  </div>
                  
                  {/* Post content */}
                  <div className="pl-14">
                    {text && (
                      <p className="text-gray-300 mb-4 leading-relaxed whitespace-pre-wrap">{text}</p>
                    )}
                    
                    {code && (
                      <div className="bg-[#1a1a1a] rounded-lg p-4 font-mono text-sm text-gray-200 overflow-x-auto border border-[#2a2a2a] mb-4">
                        <pre className="whitespace-pre">{code}</pre>
                      </div>
                    )}
                    
                    {/* Upvote button */}
                    <div className="mt-4">
                      <button 
                        onClick={() => handleToggleLike(discussion._id)}
                        disabled={!user}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                          isLiked 
                            ? 'bg-[#FF6D00]/10 text-[#FF6D00]' 
                            : 'text-gray-400 hover:text-[#FF6D00] hover:bg-[#2a2a2a]'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <ThumbsUp size={16} className={isLiked ? 'fill-current' : ''} />
                        <span className="text-sm font-medium">{discussion.likes.length}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default Discussion;
