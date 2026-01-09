import { useState } from "react";
import { Bold, Italic, Code, List, Send, MessageCircle, User, Heart, Reply } from "lucide-react";

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
}

const Discussion = () => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      author: "You",
      content: comment,
      timestamp: new Date(),
      likes: 0,
      isLiked: false
    };

    setComments(prev => [newComment, ...prev]);
    setComment("");
  };

  const handleLike = (commentId: string, isReply = false, parentId?: string) => {
    setComments(prev => prev.map(c => {
      if (isReply && c.id === parentId) {
        return {
          ...c,
          replies: c.replies?.map(r => r.id === commentId ? {
            ...r,
            isLiked: !r.isLiked,
            likes: r.isLiked ? r.likes - 1 : r.likes + 1
          } : r)
        };
      } else if (c.id === commentId) {
        return {
          ...c,
          isLiked: !c.isLiked,
          likes: c.isLiked ? c.likes - 1 : c.likes + 1
        };
      }
      return c;
    }));
  };

  const insertFormat = (format: string) => {
    const textarea = document.getElementById('comment-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = comment.substring(start, end);
    
    let formattedText = '';
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText || 'bold text'}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText || 'italic text'}*`;
        break;
      case 'code':
        formattedText = `\`${selectedText || 'code'}\``;
        break;
      case 'list':
        formattedText = `\n- ${selectedText || 'list item'}`;
        break;
      default:
        return;
    }

    const newComment = comment.substring(0, start) + formattedText + comment.substring(end);
    setComment(newComment);
    
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + formattedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-orange-400" />
        <h3 className="text-lg font-semibold text-white">Discussion</h3>
        <span className="text-sm text-gray-400">({comments.length} comments)</span>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Formatting Toolbar */}
        <div className="flex items-center gap-1 p-2 bg-gray-800 rounded-lg">
          <button
            type="button"
            onClick={() => insertFormat('bold')}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormat('italic')}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormat('code')}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
            title="Code"
          >
            <Code className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormat('list')}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
            title="List"
          >
            <List className="w-4 h-4" />
          </button>
        </div>

        <div className="flex gap-3">
          <textarea
            id="comment-textarea"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Ask a Doubt..."
            className="flex-1 p-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 resize-none focus:outline-none focus:border-orange-500"
            rows={3}
          />
          <button
            type="submit"
            disabled={!comment.trim()}
            className="px-6 py-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Comment</span>
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((commentItem) => (
          <div key={commentItem.id} className="space-y-3">
            {/* Main Comment */}
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-gray-300" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{commentItem.author}</span>
                    <span className="text-xs text-gray-400">{formatTimestamp(commentItem.timestamp)}</span>
                  </div>
                  <p className="text-gray-300">{commentItem.content}</p>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleLike(commentItem.id)}
                      className={`flex items-center gap-1 text-sm transition-colors ${
                        commentItem.isLiked ? 'text-red-400' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${commentItem.isLiked ? 'fill-current' : ''}`} />
                      <span>{commentItem.likes}</span>
                    </button>
                    <button className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors">
                      <Reply className="w-4 h-4" />
                      <span>Reply</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Replies */}
            {commentItem.replies && commentItem.replies.length > 0 && (
              <div className="ml-8 space-y-3">
                {commentItem.replies.map((reply) => (
                  <div key={reply.id} className="bg-gray-800/50 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-3 h-3 text-gray-300" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white text-sm">{reply.author}</span>
                          <span className="text-xs text-gray-400">{formatTimestamp(reply.timestamp)}</span>
                        </div>
                        <p className="text-gray-300 text-sm">{reply.content}</p>
                        <button
                          onClick={() => handleLike(reply.id, true, commentItem.id)}
                          className={`flex items-center gap-1 text-xs transition-colors ${
                            reply.isLiked ? 'text-red-400' : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          <Heart className={`w-3 h-3 ${reply.isLiked ? 'fill-current' : ''}`} />
                          <span>{reply.likes}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Discussion;
