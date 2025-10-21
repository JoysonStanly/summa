import { useState } from 'react';
import { Bold, Italic, Underline, Quote, FileCode, ThumbsUp, Clock } from 'lucide-react';

// Define types
interface DiscussionPost {
  id: string;
  username: string;
  userInitials: string;
  timeAgo: string;
  content: string;
  upvotes: number;
  codeSnippet?: string;
}

const mockPosts: DiscussionPost[] = [
  {
    id: '1',
    username: 'P Pavan kumar',
    userInitials: 'PK',
    timeAgo: '4 months ago',
    content: '',
    upvotes: 5,
    codeSnippet: `class Solution {
  public List<List<Integer>> fourSum(int[] nums, int target) {
    Arrays.sort(nums);
    int n = nums.length;
    List<List<Integer>> result = new ArrayList<>();
    
    for(int i = 0; i < n; i++){
      if(i > 0 && nums[i] == nums[i - 1]) continue;
    }
  }`
  },
  {
    id: '2',
    username: 'Rahul Sharma',
    userInitials: 'RS',
    timeAgo: '2 weeks ago',
    content: 'Can someone explain why the time complexity is O(n^3)? I thought we would need 4 nested loops for a 4Sum problem.',
    upvotes: 12
  },
  {
    id: '3',
    username: 'Maya Patel',
    userInitials: 'MP',
    timeAgo: '1 week ago',
    content: 'I found a way to optimize this solution using a hashmap approach.',
    upvotes: 8,
    codeSnippet: `// Optimized approach
Map<Integer, List<int[]>> map = new HashMap<>();
// Map sum of pair to the indices
for (int i = 0; i < nums.length - 1; i++) {
    for (int j = i + 1; j < nums.length; j++) {
        // store pairs with same sum
    }
}`
  }
];

const Discussion = () => {
  const [activeTab, setActiveTab] = useState<'community' | 'mine'>('community');
  const [sortBy, setSortBy] = useState<'upvoted' | 'time'>('upvoted');
  const [commentText, setCommentText] = useState('');
  
  const handleTabChange = (tab: 'community' | 'mine') => {
    setActiveTab(tab);
  };
  
  const handleSortChange = (sort: 'upvoted' | 'time') => {
    setSortBy(sort);
  };
  
  const handleCommentSubmit = () => {
    if (commentText.trim()) {
      console.log('Submitting comment:', commentText);
      setCommentText('');
    }
  };
  
  // Sort posts based on the selected option
  const sortedPosts = [...mockPosts].sort((a, b) => {
    if (sortBy === 'upvoted') {
      return b.upvotes - a.upvotes;
    } else {
      // Simple sorting by timeAgo string for demo purposes
      return a.timeAgo.localeCompare(b.timeAgo);
    }
  });
  
  return (
    <div className="w-full">
      {/* Comment Input Section */}
      <div className="mb-6 rounded-lg border border-[#2a2a2a] overflow-hidden bg-[#0D0D0D]">
        {/* Formatting toolbar */}
        <div className="flex items-center px-3 py-2 border-b border-[#2a2a2a]">
          <button className="p-2 text-gray-400 hover:text-white">
            <Bold size={18} />
          </button>
          <button className="p-2 text-gray-400 hover:text-white">
            <Italic size={18} />
          </button>
          <button className="p-2 text-gray-400 hover:text-white">
            <Underline size={18} />
          </button>
          <button className="p-2 text-gray-400 hover:text-white">
            <Quote size={18} />
          </button>
          <button className="p-2 text-gray-400 hover:text-white">
            <FileCode size={18} />
          </button>
        </div>
        
        {/* Text area */}
        <div>
          <textarea
            placeholder="Ask a Doubt..."
            className="w-full bg-transparent border-0 text-gray-300 p-4 min-h-[120px] focus:outline-none resize-none"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          
          <div className="flex justify-end p-3 border-t border-[#2a2a2a]">
            <button
              onClick={handleCommentSubmit}
              className="px-5 py-2 rounded-md border border-[#FF6D00] text-[#FF6D00] hover:bg-[#FF6D00] hover:text-white transition-colors font-medium"
            >
              Comment
            </button>
          </div>
        </div>
      </div>
      
      {/* Community/Mine tabs */}
      <div className="flex border-b border-[#2a2a2a] mb-4">
        <button
          className={`px-4 py-2 text-sm ${
            activeTab === 'community' 
              ? 'border-b-2 border-[#FF6D00] text-white' 
              : 'text-gray-400'
          }`}
          onClick={() => handleTabChange('community')}
        >
          Community
        </button>
        <button
          className={`px-4 py-2 text-sm ${
            activeTab === 'mine' 
              ? 'border-b-2 border-[#FF6D00] text-white' 
              : 'text-gray-400'
          }`}
          onClick={() => handleTabChange('mine')}
        >
          Mine
        </button>
        
        {/* Sort dropdown */}
        <div className="ml-auto relative">
          <div className="inline-block">
            <div className="px-2 py-1 rounded-md text-sm flex items-center">
              <button 
                className={`px-3 py-1 rounded-md ${sortBy === 'upvoted' ? 'bg-[#FF6D00] text-white' : 'text-gray-400 hover:text-white'} flex items-center gap-1`}
                onClick={() => handleSortChange('upvoted')}
              >
                <ThumbsUp size={14} />
                <span>Upvoted</span>
              </button>
              <button 
                className={`px-3 py-1 rounded-md ${sortBy === 'time' ? 'bg-[#FF6D00] text-white' : 'text-gray-400 hover:text-white'} flex items-center gap-1 ml-1`}
                onClick={() => handleSortChange('time')}
              >
                <Clock size={14} />
                <span>Time</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Discussion Posts */}
      <div className="space-y-6">
        {sortedPosts.map((post) => (
          <div key={post.id} className="mb-8">
            {/* User info */}
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-[#2a2a2a] flex items-center justify-center text-white font-medium">
                {post.userInitials}
              </div>
              <div className="ml-3">
                <span className="text-white font-medium">{post.username}</span>
                <span className="text-gray-400 text-xs ml-2">{post.timeAgo}</span>
              </div>
            </div>
            
            {/* Post content */}
            <div className="pl-12">
              {post.content && (
                <p className="text-gray-300 mb-3">{post.content}</p>
              )}
              
              {post.codeSnippet && (
                <div className="bg-[#1a1a1a] rounded-md p-4 font-mono text-sm text-gray-200 overflow-x-auto border border-[#2a2a2a]">
                  <pre className="whitespace-pre-wrap">{post.codeSnippet}</pre>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Discussion;
