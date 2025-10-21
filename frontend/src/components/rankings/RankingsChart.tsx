import { type FC } from 'react';
import { motion } from 'framer-motion';

interface User {
  id: number;
  name: string;
  username: string;
  avatar: string;
  rank: number;
  score: number;
  solved: number;
  streak: number;
  badges: string[];
}

interface RankingsChartProps {
  users: User[];
  limit?: number;
}

const RankingsChart: FC<RankingsChartProps> = ({ users, limit = 5 }) => {
  // Take top N users
  const topUsers = users.slice(0, limit);
  
  // Get max score for scaling
  const maxScore = Math.max(...topUsers.map(user => user.score));
  
  return (
    <div className="p-6 bg-[#1a1a1a] rounded-xl">
      <h2 className="text-xl font-semibold mb-6">Top Performers</h2>
      
      <div className="relative h-80">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500">
          <span>10000</span>
          <span>7500</span>
          <span>5000</span>
          <span>2500</span>
          <span>0</span>
        </div>
        
        {/* Chart area */}
        <div className="absolute left-12 right-0 top-0 bottom-0">
          {/* Horizontal grid lines */}
          {[0, 1, 2, 3, 4].map((i) => (
            <div 
              key={i} 
              className="absolute w-full border-t border-[#333] border-dashed"
              style={{ top: `${i * 25}%` }}
            />
          ))}
          
          {/* Bars */}
          <div className="flex justify-around h-full items-end pt-6 pb-10">
            {topUsers.map((user, index) => {
              const heightPercentage = (user.score / maxScore) * 100;
              
              return (
                <motion.div 
                  key={user.id}
                  className="flex flex-col items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <div className="relative">
                    <motion.div 
                      className={`w-16 rounded-t-md ${
                        index === 0 ? 'bg-gradient-to-t from-yellow-600 to-yellow-400' :
                        index === 1 ? 'bg-gradient-to-t from-gray-500 to-gray-300' :
                        index === 2 ? 'bg-gradient-to-t from-amber-800 to-amber-600' :
                        'bg-gradient-to-t from-blue-800 to-blue-600'
                      }`}
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPercentage}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                    
                    {/* Score label */}
                    <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 text-xs font-medium">
                      {user.score.toLocaleString()}
                    </div>
                  </div>
                  
                  {/* User avatar */}
                  <div className="mt-3 w-10 h-10 rounded-full overflow-hidden border-2 border-[#333]">
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  
                  {/* Username */}
                  <div className="mt-1 text-xs font-medium max-w-20 text-center truncate">
                    {user.username}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RankingsChart;
