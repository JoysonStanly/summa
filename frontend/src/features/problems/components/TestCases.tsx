import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, AlignJustify, RotateCcw, Expand } from 'lucide-react';

interface TestCase {
  id: string;
  input: string[];
  output: string;
}

interface TestCasesProps {
  testCases: TestCase[];
  selectedTestCase: string;
  onSelectTestCase: (id: string) => void;
  onReset?: () => void;
  onCopy?: () => void;
  onFormat?: () => void;
  onFullscreen?: () => void;
}

const TestCases = ({ testCases, selectedTestCase, onSelectTestCase, onReset, onCopy, onFormat, onFullscreen }: TestCasesProps) => {
  const [expanded, setExpanded] = useState(true);
  const [displayedTestCases, setDisplayedTestCases] = useState(testCases.slice(0, 2));

  useEffect(() => {
    setDisplayedTestCases(testCases.slice(0, 2));
  }, [testCases]);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    if (dragIndex === dropIndex) return;

    const newDisplayed = [...displayedTestCases];
    const [dragged] = newDisplayed.splice(dragIndex, 1);
    newDisplayed.splice(dropIndex, 0, dragged);
    setDisplayedTestCases(newDisplayed);
  };

  return (
    <div className="border-t border-[#1f1f1f] flex flex-col h-full">
      {/* Header with icons */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#1f1f1f] bg-[#0b0b0b]">
        <div className="flex items-center gap-2">
          <input type="checkbox" checked readOnly className="accent-[#FF6D00]" />
          <h3 className="text-sm font-medium text-gray-300">Test Case</h3>
        </div>
        <div className="flex items-center gap-1.5">
          <button 
            onClick={onReset}
            className="p-1.5 text-gray-400 hover:text-gray-300 hover:bg-[#1f1f1f] rounded transition-colors" 
            title="Reset"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
              <path d="M21 3v5h-5"></path>
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
              <path d="M8 16H3v5"></path>
            </svg>
          </button>
          
          <button 
            onClick={onCopy}
            className="p-1.5 text-gray-400 hover:text-gray-300 hover:bg-[#1f1f1f] rounded transition-colors" 
            title="Copy Code"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
            </svg>
          </button>
          
          <button 
            onClick={onFormat}
            className="p-1.5 text-gray-400 hover:text-gray-300 hover:bg-[#1f1f1f] rounded transition-colors" 
            title="Format"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="16" height="6" x="2" y="2" rx="2"></rect>
              <path d="M10 16v-2a2 2 0 0 1 2-2h8a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"></path>
              <rect width="4" height="6" x="8" y="16" rx="1"></rect>
            </svg>
          </button>
          
          <button 
            onClick={onFullscreen}
            className="p-1.5 text-gray-400 hover:text-gray-300 hover:bg-[#1f1f1f] rounded transition-colors" 
            title="Fullscreen Code Editor"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3H5a2 2 0 0 0-2 2v3"></path>
              <path d="M21 8V5a2 2 0 0 0-2-2h-3"></path>
              <path d="M3 16v3a2 2 0 0 0 2 2h3"></path>
              <path d="M16 21h3a2 2 0 0 0 2-2v-3"></path>
            </svg>
          </button>
        </div>
      </div>
      
      {/* Content area */}
      {expanded && (
        <div className="flex-1 px-4 py-2 overflow-y-auto">
          {testCases.length > 0 ? (
            <>
              <div className="flex mb-3">
                {displayedTestCases.map((testCase, index) => (
                  <button
                    key={testCase.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    className={`px-3 py-1.5 text-xs rounded-md mr-2 cursor-move ${
                      selectedTestCase === testCase.id
                        ? 'bg-[#2a2a2a] text-white border border-[#3a3a3a]'
                        : 'bg-[#141414] text-gray-300 hover:bg-[#1c1c1c] border border-[#242424]'
                    }`}
                    onClick={() => onSelectTestCase(testCase.id)}
                  >
                    Case {index + 1}
                  </button>
                ))}
                <button className="px-3 py-1.5 text-xs rounded-md bg-[#141414] text-gray-300 hover:bg-[#1c1c1c] border border-[#242424] flex items-center justify-center">
                  <span className="text-lg leading-none">+</span>
                </button>
              </div>
              
              {(() => {
                // Only search in first 2 test cases, default to first one if not found
                const visibleTestCases = testCases.slice(0, 2);
                const currentTestCase = visibleTestCases.find(tc => tc.id === selectedTestCase) || visibleTestCases[0];
                if (!currentTestCase) return <div className="text-sm text-gray-400">No test cases available</div>;
                
                return (
                  <div className="space-y-3">
                    {/* Display all inputs */}
                    {currentTestCase.input && currentTestCase.input.length > 0 ? (
                      currentTestCase.input.map((inputValue, index) => (
                        <div key={index}>
                          <h4 className="mb-1 text-xs text-gray-400">
                            {currentTestCase.input.length === 1 ? 'Input' : `Input ${index + 1}`}
                          </h4>
                          <div className="bg-[#0f0f0f] p-2 rounded-md border border-[#1f1f1f]">
                            <pre className="overflow-x-auto text-xs">{inputValue || 'No input'}</pre>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-gray-400">No input available</div>
                    )}
                    
                    {/* Display expected output */}
                    <div>
                      <h4 className="mb-1 text-xs text-gray-400">Expected Output</h4>
                      <div className="bg-[#0f0f0f] p-2 rounded-md border border-[#1f1f1f]">
                        <pre className="overflow-x-auto text-xs">{currentTestCase.output || 'No output'}</pre>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </>
          ) : (
            <div className="py-4 text-sm text-center text-gray-400">
              No test cases available
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TestCases;
