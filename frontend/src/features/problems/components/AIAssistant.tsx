import { useState } from 'react';
import { Bot, ChevronUp, ChevronDown, Lightbulb, Code, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AIAssistantProps {
  problemId: string;
  className?: string;
}

type AssistantTab = 'hint' | 'approach' | 'chat';

const AIAssistant = ({ problemId: _problemId, className = '' }: AIAssistantProps) => {
  // We'll use the problem ID later when connecting to a real API
  // For now, we're using mock data
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<AssistantTab>('hint');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  
  // Mock AI responses - would be replaced with actual API calls
  const getHint = () => {
    return "Try using a hash map to track frequencies of each element.";
  };
  
  const getApproach = () => {
    return [
      "Initialize a hash map to store frequency of elements",
      "Iterate through the array and update frequencies",
      "Find elements that satisfy the given condition",
      "Return the result in the required format"
    ];
  };
  
  const sendMessage = () => {
    if (!input.trim()) return;
    
    // Use explicit type to avoid TypeScript error
    const newUserMessage: { role: 'user' | 'assistant', content: string } = { 
      role: 'user', 
      content: input 
    };
    
    const newAssistantMessage: { role: 'user' | 'assistant', content: string } = { 
      role: 'assistant', 
      content: `This is a mock response to: ${input}` 
    };
    
    setMessages([...messages, newUserMessage, newAssistantMessage]);
    setInput('');
  };
  
  return (
    <div className={`fixed bottom-0 right-8 w-96 z-10 ${className}`}>
      <div 
        className="bg-[#1a1a1a] border border-gray-800 rounded-t-lg shadow-lg overflow-hidden"
        style={{ maxHeight: isExpanded ? '500px' : '48px' }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between px-4 py-3 bg-[#252525] cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2">
            <Bot size={18} className="text-orange-500" />
            <span className="font-medium">AI Assistant</span>
          </div>
          {isExpanded ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
        </div>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Tabs */}
              <div className="flex border-b border-gray-800">
                <button 
                  className={`flex-1 py-2 text-sm flex items-center justify-center ${activeTab === 'hint' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-400'}`}
                  onClick={() => setActiveTab('hint')}
                >
                  <Lightbulb size={16} className="mr-1" /> Hint
                </button>
                <button 
                  className={`flex-1 py-2 text-sm flex items-center justify-center ${activeTab === 'approach' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-400'}`}
                  onClick={() => setActiveTab('approach')}
                >
                  <Code size={16} className="mr-1" /> Approach
                </button>
                <button 
                  className={`flex-1 py-2 text-sm flex items-center justify-center ${activeTab === 'chat' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-400'}`}
                  onClick={() => setActiveTab('chat')}
                >
                  <MessageSquare size={16} className="mr-1" /> Chat
                </button>
              </div>
              
              {/* Content */}
              <div className="p-4 h-64 overflow-y-auto">
                {activeTab === 'hint' && (
                  <div>{getHint()}</div>
                )}
                
                {activeTab === 'approach' && (
                  <div>
                    <p className="mb-2">Here's a step-by-step approach:</p>
                    <ol className="list-decimal pl-5 space-y-2">
                      {getApproach().map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ol>
                  </div>
                )}
                
                {activeTab === 'chat' && (
                  <div className="flex flex-col h-full">
                    <div className="flex-1 overflow-y-auto mb-4">
                      {messages.length === 0 ? (
                        <div className="text-gray-500 text-center py-4">
                          Ask a question about this problem
                        </div>
                      ) : (
                        messages.map((msg, idx) => (
                          <div 
                            key={idx} 
                            className={`mb-3 ${msg.role === 'user' ? 'text-right' : ''}`}
                          >
                            <div 
                              className={`
                                inline-block p-2 rounded-lg text-sm max-w-[80%]
                                ${msg.role === 'user' ? 'bg-blue-900' : 'bg-gray-800'}
                              `}
                            >
                              {msg.content}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        className="flex-1 bg-[#252525] border border-gray-700 rounded px-3 py-2 text-sm"
                        placeholder="Ask a question..."
                      />
                      <button 
                        onClick={sendMessage}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded text-sm"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AIAssistant;