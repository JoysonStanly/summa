import { ArrowLeft, Coins } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  coins?: number;
}

export const QuizHeader = ({ title, subtitle, coins = 2582 }: HeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center">
        <button className="mr-4 text-gray-400 hover:text-white">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-medium text-white">
          {title}
          {subtitle && <span> – {subtitle}</span>}
        </h1>
      </div>
      <div className="flex items-center">
        <button className="bg-[#8B4513] hover:bg-[#A0522D] text-white rounded-lg px-4 py-1.5 text-sm mr-4">
          Reset
        </button>
        <div className="flex items-center bg-[#1a1a1a] rounded-full px-3 py-1 border border-gray-700">
          <div className="bg-yellow-500 rounded-full p-0.5 mr-2">
            <Coins size={16} className="text-yellow-900" />
          </div>
          <span className="text-yellow-500 font-medium">{coins}</span>
        </div>
      </div>
    </div>
  );
};
