import { type FC, useState } from 'react';
import { Highlight, themes, type Language } from 'prism-react-renderer';
import { Copy, ClipboardPaste, Maximize2, Check } from 'lucide-react';
import type { CodeTabsProps } from './types';

const CodeTabs: FC<CodeTabsProps> = ({ solutions, activeLanguage, onLanguageChange }) => {
  const [copied, setCopied] = useState(false);
  
  const languages = [
    { id: 'cpp', label: 'C++' },
    { id: 'java', label: 'Java' },
    { id: 'python', label: 'Python' },
    { id: 'javascript', label: 'JavaScript' },
    { id: 'csharp', label: 'C#' },
    { id: 'go', label: 'Go' }
  ];

  // Filter to only show languages that have solutions
  const availableLanguages = languages.filter(lang => solutions[lang.id]);

  const getLanguageForPrism = (lang: string): Language => {
    switch (lang) {
      case 'cpp': return 'cpp';
      case 'java': return 'java';
      case 'python': return 'python';
      case 'javascript': return 'javascript';
      case 'csharp': return 'csharp';
      case 'go': return 'go';
      default: return 'javascript';
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(solutions[activeLanguage] || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-section border border-zinc-800 rounded-lg overflow-hidden">
      {/* Code Tabs Header */}
      <div className="flex items-center justify-between bg-zinc-900/50 border-b border-zinc-800">
        <div className="flex overflow-x-auto no-scrollbar">
          {availableLanguages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => onLanguageChange(lang.id)}
              className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors ${
                activeLanguage === lang.id
                  ? 'text-white bg-zinc-800/50'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/30'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
        
        {/* Code Editor Utils */}
        <div className="flex items-center gap-1 px-2">
          <button
            onClick={handleCopy}
            className="p-2 text-zinc-400 hover:text-white transition-colors"
            title="Copy code"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </button>
          <button
            className="p-2 text-zinc-400 hover:text-white transition-colors"
            title="Paste to editor"
          >
            <ClipboardPaste size={18} />
          </button>
          <button
            className="p-2 text-zinc-400 hover:text-white transition-colors"
            title="Maximize"
          >
            <Maximize2 size={16} />
          </button>
        </div>
      </div>

      {/* Code Content */}
      <div className="relative">
        <Highlight
          theme={themes.vsDark}
          code={solutions[activeLanguage] || '// No solution available for this language'}
          language={getLanguageForPrism(activeLanguage)}
        >
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <div className="flex">
              {/* Line Numbers */}
              <div className="flex-shrink-0 py-4 px-2 bg-zinc-900/30 text-zinc-600 text-sm font-mono select-none">
                {tokens.map((_, i) => (
                  <div key={i} className="text-right leading-6">{i + 1}</div>
                ))}
              </div>
              
              {/* Code */}
              <pre 
                className={`${className} flex-1 p-4 overflow-x-auto`} 
                style={{ ...style, backgroundColor: 'transparent', margin: 0 }}
              >
                {tokens.map((line, i) => (
                  <div key={i} {...getLineProps({ line, key: i })} className="leading-6">
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token, key })} />
                    ))}
                  </div>
                ))}
              </pre>
            </div>
          )}
        </Highlight>
      </div>
    </div>
  );
};

export default CodeTabs;
