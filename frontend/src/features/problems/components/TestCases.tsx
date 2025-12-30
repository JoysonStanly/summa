import { useState } from 'react';
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
}

const TestCases = ({ testCases, selectedTestCase, onSelectTestCase }: TestCasesProps) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="border-t border-[#1f1f1f] flex flex-col h-full">
      {/* Header with icons */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#1f1f1f] bg-[#0b0b0b]">
        <div className="flex items-center gap-2">
          <input type="checkbox" checked readOnly className="accent-[#FF6D00]" />
          <h3 className="text-sm font-medium text-gray-300">Test Case</h3>
        </div>
        <div className="flex items-center gap-2">
          <button 
            className="p-1 text-gray-400 hover:text-white transition-colors"
            title="Format Code"
          >
            <AlignJustify size={14} />
          </button>
          <button 
            className="p-1 text-gray-400 hover:text-white transition-colors"
            title="Expand/Collapse"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          <button 
            className="p-1 text-gray-400 hover:text-white transition-colors"
            title="Refresh"
          >
            <RotateCcw size={14} />
          </button>
          <button 
            className="p-1 text-gray-400 hover:text-white transition-colors"
            title="Fullscreen"
          >
            <Expand size={14} />
          </button>
        </div>
      </div>
      
      {/* Content area */}
      {expanded && (
        <div className="flex-1 overflow-y-auto px-4 py-2">
          {testCases.length > 0 ? (
            <>
              <div className="flex mb-3">
                {testCases.map(testCase => (
                  <button
                    key={testCase.id}
                    className={`px-3 py-1.5 text-xs rounded-md mr-2 ${
                      selectedTestCase === testCase.id 
                        ? 'bg-[#2a2a2a] text-white border border-[#3a3a3a]'
                        : 'bg-[#141414] text-gray-300 hover:bg-[#1c1c1c] border border-[#242424]'
                    }`}
                    onClick={() => onSelectTestCase(testCase.id)}
                  >
                    Case {testCase.id}
                  </button>
                ))}
                <button className="px-3 py-1.5 text-xs rounded-md bg-[#141414] text-gray-300 hover:bg-[#1c1c1c] border border-[#242424] flex items-center justify-center">
                  <span className="text-lg leading-none">+</span>
                </button>
              </div>
              
              <div className="mb-3">
                <h4 className="text-xs text-gray-400 mb-1">Nums</h4>
                <div className="bg-[#0f0f0f] p-2 rounded-md border border-[#1f1f1f]">
                  <pre className="text-xs overflow-x-auto">
                    {testCases.find(tc => tc.id === selectedTestCase)?.input?.[0] || 'No input'}
                  </pre>
                </div>
              </div>
              
              <div>
                <h4 className="text-xs text-gray-400 mb-1">Target</h4>
                <div className="bg-[#0f0f0f] p-2 rounded-md border border-[#1f1f1f]">
                  <pre className="text-xs overflow-x-auto">
                    {testCases.find(tc => tc.id === selectedTestCase)?.input?.[1] || 'No target'}
                  </pre>
                </div>
              </div>
            </>
          ) : (
            <div className="text-sm text-gray-400 text-center py-4">
              No test cases available
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TestCases;
