import { type FC, useState } from 'react';
import { ThumbsUp, ThumbsDown, Bug, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Example, Constraint } from "@/shared/types/problem";

interface ProblemStatementProps {
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  coins: number;
  description: string;
  examples: Example[];
  constraints: Constraint[];
  hints?: string[];
}

const ProblemStatement: FC<ProblemStatementProps> = ({ 
  title, 
  difficulty, 
  coins, 
  description, 
  examples, 
  constraints,
  hints: hintsFromProps
}) => {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [isCompleted, setIsCompleted] = useState(true);
  const [likeCount] = useState(4);

  const hints = (hintsFromProps || ["Try iterating through the array from the beginning.", "Check each element against the target value."]).map((text, idx) => ({
    id: idx + 1,
    text
  }));

  

  return (
    <div className="relative flex flex-col w-full h-full">
      <div className="relative flex-1 overflow-hidden">
        <div className="flex flex-col w-full h-full gap-3 sm:gap-4 px-4 py-4 sm:px-5 sm:py-5 md:px-6 md:py-6 overflow-y-auto">
          {/* Title and Badges */}
          <div className="flex flex-col gap-2">
            <div className="flex flex-row items-start sm:items-center justify-between w-full">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-tight">{title}</h1>
            </div>
            <div className="flex items-center gap-x-2 flex-wrap">
              <div className={`px-2.5 sm:px-3 py-1 rounded text-xs font-medium ${
                difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' : 
                difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' : 
                'bg-red-500/20 text-red-400'
              }`}>
                {difficulty}
              </div>
              <button className="px-2.5 sm:px-3 py-1 text-xs transition-colors rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300">
                Hints
              </button>
              <button className="px-2.5 sm:px-3 py-1 text-xs transition-colors rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300">
                Company
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="text-sm sm:text-base text-zinc-300 prose prose-sm sm:prose-base prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: description }} />

          {/* Examples */}
          {examples.map((example, index) => (
            <div key={index} className="flex flex-col gap-2">
              <p className="text-sm sm:text-base font-medium text-zinc-300">Example {index + 1}</p>
              <div className="p-3 sm:p-4 space-y-2 text-xs sm:text-sm border rounded-lg border-zinc-800 text-zinc-400 overflow-x-auto">
                <p><strong className="text-white">Input</strong>: {example.input}</p>
                <p><strong className="text-white">Output</strong>: {example.output}</p>
                {example.explanation && (
                  <>
                    <p><strong className="text-white">Explanation</strong>: </p>
                    <p className="whitespace-pre-wrap break-words">{example.explanation}</p>
                  </>
                )}
              </div>
            </div>
          ))}

          {/* Constraints */}
          <div className="flex flex-col gap-2">
            <p className="text-sm sm:text-base font-medium text-zinc-300">Constraints</p>
            <div className="p-3 sm:p-4 border rounded-lg border-zinc-800">
              <ul className="space-y-1 text-xs sm:text-sm list-disc list-inside text-zinc-400">
                {constraints.map((constraint, index) => (
                  <li key={index} className="break-words" dangerouslySetInnerHTML={{ __html: constraint.text }} />
                ))}
              </ul>
            </div>
          </div>

          {/* Hints Accordion */}
          <div className="flex flex-col gap-2">
            <p className="text-sm sm:text-base font-medium text-zinc-300">Hints</p>
            <div className="space-y-1">
              {hints.map((hint, index) => (
                <details key={hint.id} className="group">
                  <summary className={`flex items-center justify-between gap-2 sm:gap-4 ${
                    index === 0 ? 'rounded-t-lg' : index === hints.length - 1 ? 'rounded-b-lg' : ''
                  } ${hints.length === 1 ? 'rounded-lg' : ''} py-3 sm:py-4 px-3 sm:px-4 text-left text-xs sm:text-sm font-medium border border-zinc-800 cursor-pointer hover:bg-zinc-800/50 transition-colors outline-none`}>
                    <span className="text-zinc-400">Hint {hint.id}</span>
                    <ChevronDown className="w-4 h-4 flex-shrink-0 transition-transform text-zinc-400 group-open:rotate-180" />
                  </summary>
                  <div className="px-3 sm:px-4 py-3 text-xs sm:text-sm border-b text-zinc-300 border-x border-zinc-800 break-words">
                    {hint.text}
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* Extras (Company) */}
          <div className="flex flex-col gap-2">
            <p className="text-sm sm:text-base font-medium text-zinc-300">Extras</p>
            <div className="w-full">
              <details className="group">
                <summary className="flex items-center justify-between gap-2 sm:gap-4 px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm font-medium text-left transition-colors border rounded-lg outline-none cursor-pointer border-zinc-800 hover:bg-zinc-800/50">
                  <span className="text-zinc-400">Company</span>
                  <ChevronDown className="w-4 h-4 flex-shrink-0 transition-transform text-zinc-400 group-open:rotate-180" />
                </summary>
                <div className="px-3 sm:px-4 py-3 text-xs sm:text-sm border-b rounded-b-lg text-zinc-300 border-x border-zinc-800 break-words">
                  <p>This problem has been asked in: Google, Amazon, Microsoft</p>
                </div>
              </details>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProblemStatement;
