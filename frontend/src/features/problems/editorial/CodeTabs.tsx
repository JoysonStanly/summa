import { type FC, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, ClipboardPaste, Maximize2, Check } from 'lucide-react';
import type { CodeTabsProps } from './types';

const CodeTabs: FC<CodeTabsProps> = ({ solutions, activeLanguage, onLanguageChange }) => {
  const [copied, setCopied] = useState(false);
  
  const languages = [
    { id: 'cpp', label: 'C++' },
    { id: 'java', label: 'Java' },
    { id: 'python', label: 'Python' },
    { id: 'javascript', label: 'JavaScript' },
    
  ];

  // Filter to only show languages that have solutions
  const availableLanguages = languages.filter(lang => solutions[lang.id]);

  const getLanguageForHighlighter = (lang: string): string => {
    switch (lang) {
      case 'cpp': return 'cpp';
      case 'java': return 'java';
      case 'python': return 'python';
      case 'javascript': return 'javascript';
      default: return 'javascript';
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(solutions[activeLanguage] || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="overflow-hidden border rounded-lg code-section border-zinc-800">
      {/* Code Tabs Header */}
      <div className="flex items-center justify-between border-b bg-zinc-900/50 border-zinc-800">
        <div className="flex overflow-x-auto scrollbar-hide">
          {availableLanguages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => onLanguageChange(lang.id)}
              className={`px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
                activeLanguage === lang.id
                  ? 'text-white bg-zinc-800/50 border-b-2 border-[#FF6D00]'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/30'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
        
        {/* Code Editor Utils */}
        <div className="flex items-center gap-0.5 sm:gap-1 px-1 sm:px-2 flex-shrink-0">
          <button
            onClick={handleCopy}
            className="p-1.5 sm:p-2 transition-colors text-zinc-400 hover:text-white"
            title="Copy code"
          >
            {copied ? <Check size={16} className="sm:w-[18px] sm:h-[18px]" /> : <Copy size={16} className="sm:w-[18px] sm:h-[18px]" />}
          </button>
          <button
            className="p-1.5 sm:p-2 transition-colors text-zinc-400 hover:text-white hidden xs:block"
            title="Paste to editor"
          >
            <ClipboardPaste size={16} className="sm:w-[18px] sm:h-[18px]" />
          </button>
          <button
            className="p-1.5 sm:p-2 transition-colors text-zinc-400 hover:text-white hidden xs:block"
            title="Maximize"
          >
            <Maximize2 size={14} className="sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>

      {/* Code Content */}
      <div className="relative bg-[#1e1e1e] overflow-x-auto">
        <SyntaxHighlighter
          language={getLanguageForHighlighter(activeLanguage)}
          style={vscDarkPlus}
          showLineNumbers={true}
          customStyle={{
            margin: 0,
            padding: '0.75rem',
            background: '#1e1e1e',
            fontSize: '0.75rem',
            borderRadius: 0,
          }}
          lineNumberStyle={{
            minWidth: '2.5em',
            paddingRight: '0.75em',
            color: '#858585',
            textAlign: 'right',
          }}
          codeTagProps={{
            style: {
              fontSize: '0.75rem',
              lineHeight: '1.5',
            }
          }}
        >
          {solutions[activeLanguage] || '// No solution available for this language'}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default CodeTabs;
