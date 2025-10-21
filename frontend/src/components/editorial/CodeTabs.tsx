import { type FC } from 'react';
import { Highlight, themes, type Language } from 'prism-react-renderer';
import type { CodeTabsProps } from './types';

const CodeTabs: FC<CodeTabsProps> = ({ solutions, activeLanguage, onLanguageChange }) => {
  const languages = [
    { id: 'cpp', label: 'Cpp' },
    { id: 'java', label: 'Java' },
    { id: 'python', label: 'Python' },
    { id: 'javascript', label: 'Javascript' },
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

  return (
    <div className="mb-6">
      <div className="flex border-b border-[#2a2a2a] mb-1 overflow-x-auto">
        {availableLanguages.map((lang) => (
          <button
            key={lang.id}
            onClick={() => onLanguageChange(lang.id)}
            className={`px-4 py-2 text-sm whitespace-nowrap ${
              activeLanguage === lang.id
                ? 'text-white border-b-2 border-white'
                : 'text-[#9ca3af] hover:text-white'
            }`}
          >
            {lang.label}
          </button>
        ))}
      </div>

      <div className="relative mt-3 rounded-md overflow-hidden">
        <Highlight
          theme={themes.vsDark}
          code={solutions[activeLanguage] || '// No solution available for this language'}
          language={getLanguageForPrism(activeLanguage)}
        >
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre className={`${className} p-4 overflow-auto max-h-[500px]`} style={style}>
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line, key: i })}>
                  <span className="mr-4 inline-block w-8 text-right opacity-50">{i + 1}</span>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token, key })} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </div>
    </div>
  );
};

export default CodeTabs;
