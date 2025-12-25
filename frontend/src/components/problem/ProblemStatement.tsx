import { type FC, useState } from 'react';
import { ThumbsUp, ThumbsDown, Bug, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Example, Constraint } from '../../types/problem';

interface ProblemStatementProps {
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  coins: number;
  description: string;
  examples: Example[];
  constraints: Constraint[];
}

const ProblemStatement: FC<ProblemStatementProps> = ({ 
  title, 
  difficulty, 
  coins, 
  description, 
  examples, 
  constraints 
}) => {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [isCompleted, setIsCompleted] = useState(true);
  const [likeCount] = useState(4);

  const hints = [
    { id: 1, text: "Try iterating through the array from the beginning." },
    { id: 2, text: "Check each element against the target value." }
  ];

  const doubts = [
    { question: "What happens if the target is not found in the array?", answer: "Return -1 as specified in the problem." },
    { question: "Is linear search suitable for very large arrays?", answer: "For large arrays, binary search is more efficient if the array is sorted." }
  ];

  const followUps = [
    { question: "How would you modify the function to return all indices of the target instead of just the smallest?", answer: "Store all matching indices in an array and return it." },
    { question: "How can linear search be optimized for specific scenarios?", answer: "You can use sentinel linear search or move frequently accessed elements to the front." }
  ];

  const funFacts = [
    { id: 1, fact: "Linear search is one of the simplest searching algorithms with O(n) time complexity." },
    { id: 2, fact: "Despite being simple, linear search is optimal for unsorted arrays." },
    { id: 3, fact: "Linear search is also known as sequential search." }
  ];

  return (
    <div className="relative flex flex-col w-full h-full">
      <div className="relative flex-1 overflow-hidden">
        <div className="flex flex-col w-full h-full gap-4 p-6 overflow-y-auto">
          {/* Title and Badges */}
          <div className="flex flex-col gap-2">
            <div className="flex flex-row items-center justify-between w-full">
              <h1 className="text-xl font-bold text-white">{title}</h1>
            </div>
            <div className="flex items-center gap-x-2">
              <div className={`px-3 py-1 rounded text-xs font-medium ${
                difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' : 
                difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' : 
                'bg-red-500/20 text-red-400'
              }`}>
                {difficulty}
              </div>
              <button className="px-3 py-1 text-xs transition-colors rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300">
                Hints
              </button>
              <button className="px-3 py-1 text-xs transition-colors rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300">
                Company
              </button>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-zinc-300" dangerouslySetInnerHTML={{ __html: description }} />

          {/* Examples */}
          {examples.map((example, index) => (
            <div key={index} className="flex flex-col gap-2">
              <p className="text-sm font-medium text-zinc-300">Example {index + 1}</p>
              <div className="p-4 space-y-2 text-sm border rounded-lg border-zinc-800 text-zinc-400">
                <p><strong className="text-white">Input</strong>: {example.input}</p>
                <p><strong className="text-white">Output</strong>: {example.output}</p>
                {example.explanation && (
                  <>
                    <p><strong className="text-white">Explanation</strong>: </p>
                    <p>{example.explanation}</p>
                  </>
                )}
              </div>
            </div>
          ))}

          {/* Constraints */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-zinc-300">Constraints</p>
            <div className="p-4 border rounded-lg border-zinc-800">
              <ul className="space-y-1 text-sm list-disc list-inside text-zinc-400">
                {constraints.map((constraint, index) => (
                  <li key={index} dangerouslySetInnerHTML={{ __html: constraint.text }} />
                ))}
              </ul>
            </div>
          </div>

          {/* Hints Accordion */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-zinc-300">Hints</p>
            <div className="space-y-1">
              {hints.map((hint, index) => (
                <details key={hint.id} className="group">
                  <summary className={`flex items-center justify-between gap-4 ${
                    index === 0 ? 'rounded-t-lg' : index === hints.length - 1 ? 'rounded-b-lg' : ''
                  } ${hints.length === 1 ? 'rounded-lg' : ''} py-4 px-4 text-left text-sm font-medium border border-zinc-800 cursor-pointer hover:bg-zinc-800/50 transition-colors outline-none`}>
                    <span className="text-zinc-400">Hint {hint.id}</span>
                    <ChevronDown className="w-4 h-4 transition-transform text-zinc-400 group-open:rotate-180" />
                  </summary>
                  <div className="px-4 py-3 text-sm border-b text-zinc-300 border-x border-zinc-800">
                    {hint.text}
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* Frequently Occurring Doubts */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-zinc-300">Frequently Occurring Doubts</p>
            <div className="space-y-1">
              {doubts.map((doubt, index) => (
                <details key={index} className="group">
                  <summary className={`flex items-center justify-between gap-4 ${
                    index === 0 ? 'rounded-t-lg' : index === doubts.length - 1 ? 'rounded-b-lg' : ''
                  } py-4 px-4 text-left text-sm font-medium border border-zinc-800 cursor-pointer hover:bg-zinc-800/50 transition-colors outline-none`}>
                    <span className="text-zinc-400">{doubt.question}</span>
                    <ChevronDown className="w-4 h-4 transition-transform text-zinc-400 group-open:rotate-180" />
                  </summary>
                  <div className="px-4 py-3 text-sm border-b text-zinc-300 border-x border-zinc-800">
                    {doubt.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* Interview Follow-ups */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-zinc-300">Interview Follow-ups</p>
            <div className="space-y-1">
              {followUps.map((followUp, index) => (
                <details key={index} className="group">
                  <summary className={`flex items-center justify-between gap-4 ${
                    index === 0 ? 'rounded-t-lg' : index === followUps.length - 1 ? 'rounded-b-lg' : ''
                  } py-4 px-4 text-left text-sm font-medium border border-zinc-800 cursor-pointer hover:bg-zinc-800/50 transition-colors outline-none`}>
                    <span className="text-zinc-400">{followUp.question}</span>
                    <ChevronDown className="w-4 h-4 transition-transform text-zinc-400 group-open:rotate-180" />
                  </summary>
                  <div className="px-4 py-3 text-sm border-b text-zinc-300 border-x border-zinc-800">
                    {followUp.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* Fun Facts */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-zinc-300">Fun Facts</p>
            <div className="space-y-1">
              {funFacts.map((fact, index) => (
                <details key={fact.id} className="group">
                  <summary className={`flex items-center justify-between gap-4 ${
                    index === 0 ? 'rounded-t-lg' : index === funFacts.length - 1 ? 'rounded-b-lg' : 'rounded-none'
                  } py-4 px-4 text-left text-sm font-medium border border-zinc-800 cursor-pointer hover:bg-zinc-800/50 transition-colors outline-none`}>
                    <span className="text-zinc-400">Fact {fact.id}</span>
                    <ChevronDown className="w-4 h-4 transition-transform text-zinc-400 group-open:rotate-180" />
                  </summary>
                  <div className="px-4 py-3 text-sm border-b text-zinc-300 border-x border-zinc-800">
                    {fact.fact}
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* Extras (Company) */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-zinc-300">Extras</p>
            <div className="w-full">
              <details className="group">
                <summary className="flex items-center justify-between gap-4 px-4 py-4 text-sm font-medium text-left transition-colors border rounded-lg outline-none cursor-pointer border-zinc-800 hover:bg-zinc-800/50">
                  <span className="text-zinc-400">Company</span>
                  <ChevronDown className="w-4 h-4 transition-transform text-zinc-400 group-open:rotate-180" />
                </summary>
                <div className="px-4 py-3 text-sm border-b rounded-b-lg text-zinc-300 border-x border-zinc-800">
                  <p>This problem has been asked in: Google, Amazon, Microsoft</p>
                </div>
              </details>
            </div>
          </div>

        </div>
      </div>

      {/* Sticky Footer */}
      <div className="sticky bottom-0 left-0 right-0 z-10 mt-auto border-t bg-zinc-950 border-zinc-800">
        <div className="flex flex-row items-center justify-between px-4 py-2">
          <div className="flex items-center gap-x-3">
            <button 
              onClick={() => {
                setLiked(!liked);
                if (disliked) setDisliked(false);
              }}
              className="flex items-center transition-colors cursor-pointer gap-x-2 text-zinc-400 hover:text-white"
              aria-pressed={liked}
            >
              <ThumbsUp className={`w-4 h-4 ${liked ? 'fill-green-500 text-green-500' : ''}`} />
              <span className="text-sm">{likeCount}</span>
            </button>
            <button 
              onClick={() => {
                setDisliked(!disliked);
                if (liked) setLiked(false);
              }}
              className="flex items-center transition-colors cursor-pointer text-zinc-400 hover:text-white"
              aria-pressed={disliked}
            >
              <ThumbsDown className={`w-4 h-4 ${disliked ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
            <div className="h-3 w-[1px] bg-zinc-800"></div>
            <button className="transition-colors cursor-pointer text-zinc-400 hover:text-white">
              <Bug className="w-4 h-4" />
            </button>
            <div className="h-3 w-[1px] bg-zinc-800"></div>
            <button className="text-zinc-400 hover:text-[#EA763F] cursor-pointer transition-colors">
              <svg className="w-5 h-5" width="54" height="53" viewBox="0 0 54 53" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M47.4467 30.9595L48.6874 26.612C50.1368 21.5377 50.8639 19.0017 50.3192 16.8054C49.8875 15.0716 48.917 13.4967 47.5307 12.2801C45.7765 10.7387 43.0695 10.0591 37.6581 8.69998C32.2466 7.33857 29.5397 6.65899 27.1999 7.1698C25.3509 7.57465 23.6714 8.48462 22.374 9.7846C20.9654 11.1933 20.231 13.2568 19.1391 17.0057L18.5536 19.0422L17.3129 23.3897C15.8611 28.464 15.1363 31.0001 15.6811 33.1963C16.1128 34.9301 17.0833 36.505 18.4696 37.7216C20.2238 39.263 22.9308 39.9426 28.3422 41.304C33.2185 42.5281 35.8991 43.201 38.0948 42.9467C38.3348 42.9182 38.57 42.8792 38.8004 42.8297C40.6488 42.4261 42.3282 41.5177 43.6263 40.2194C45.2701 38.5722 45.9948 36.0339 47.4467 30.9595Z" stroke="currentColor" strokeWidth="2.5"/>
                <path d="M36.3341 42.3075C35.8725 43.7216 35.0613 44.9962 33.9756 46.0131C32.3613 47.5258 29.8703 48.1927 24.8906 49.5266C19.9108 50.8604 17.4198 51.5295 15.2666 51.026C13.5654 50.6293 12.0199 49.7371 10.8257 48.4622C9.31297 46.8479 8.64384 44.3569 7.31001 39.3771L6.1683 35.1106C4.83226 30.1308 4.16534 27.6398 4.66664 25.4867C5.06394 23.7851 5.95696 22.2396 7.23272 21.0457C8.84701 19.533 11.338 18.8661 16.3178 17.53C17.2571 17.2768 18.1146 17.0494 18.8905 16.8477" stroke="currentColor" strokeWidth="2.5"/>
                <path d="M25.8003 23.3008L36.4666 26.1584M24.0845 29.7005L30.4842 31.4142" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-x-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isCompleted}
                onChange={(e) => setIsCompleted(e.target.checked)}
                className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-[#EA763F] focus:ring-[#EA763F] focus:ring-offset-0 cursor-pointer"
              />
            </label>
            <div className="h-3 w-[1px] bg-zinc-800"></div>
            <div className="flex items-center gap-2">
              <button className="cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
                <ChevronLeft className="w-4 h-4 text-zinc-400 hover:text-white" />
              </button>
              <div className="h-3 w-[1px] bg-zinc-800"></div>
              <button className="cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
                <ChevronRight className="w-4 h-4 text-zinc-400 hover:text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemStatement;
