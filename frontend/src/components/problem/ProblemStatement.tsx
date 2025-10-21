import { type FC } from 'react';
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
  return (
    <div className="problem-statement p-4">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-xl font-bold">{title}</h1>
          <span className={`px-2.5 py-0.5 text-xs rounded-full ${
            difficulty === 'Easy' ? 'bg-green-900/20 text-green-500' : 
            difficulty === 'Medium' ? 'bg-yellow-900/20 text-yellow-500' : 
            'bg-red-900/20 text-red-500'
          }`}>{difficulty}</span>
          <div className="flex items-center gap-1 bg-yellow-900/20 px-2 py-0.5 rounded-full">
            <span className="text-yellow-500 text-xs">{coins}</span>
            <span className="text-xs">🪙</span>
          </div>
        </div>
        
        <p className="text-gray-300 whitespace-pre-line">{description}</p>
      </div>
      
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-2">Examples:</h2>
        <div className="space-y-4">
          {examples.map((example, index) => (
            <div key={index} className="bg-[#1a1a1a] rounded-md p-4">
              <div className="mb-2">
                <span className="text-sm font-medium text-gray-400">Input:</span>
                <pre className="mt-1 bg-[#111] p-2 rounded text-sm overflow-x-auto">{example.input}</pre>
              </div>
              <div className="mb-2">
                <span className="text-sm font-medium text-gray-400">Output:</span>
                <pre className="mt-1 bg-[#111] p-2 rounded text-sm overflow-x-auto">{example.output}</pre>
              </div>
              {example.explanation && (
                <div>
                  <span className="text-sm font-medium text-gray-400">Explanation:</span>
                  <p className="mt-1 text-sm text-gray-300">{example.explanation}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-4">
        <h2 className="text-lg font-medium mb-2">Constraints:</h2>
        <ul className="list-disc list-inside space-y-1">
          {constraints.map((constraint, index) => (
            <li key={index} className="text-sm text-gray-300">{constraint.text}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProblemStatement;
