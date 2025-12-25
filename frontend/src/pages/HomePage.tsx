import { Database, LayoutGrid, Monitor, BookOpen, Server, Network, PackageOpen } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sidebar } from '../components/navigation';
import { TrackCard, CalendarWidget } from '../components/session';
import { CategorySection, SubjectCard, DailyPlanner } from '../components/ui';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Mock icons for subject cards
const SubjectIcon = ({ icon: Icon, color }: { icon: LucideIcon; color: string }) => (
  <div className={`w-full h-full flex items-center justify-center ${color}`}>
    <Icon size={24} />
  </div>
);

const HomePage = () => {
  const { user } = useContext(AuthContext);
  
  return (
    <div className="flex min-h-screen bg-[#0f0f0f] text-white">
      {/* Sidebar */}
      <Sidebar activePage="home" />
      
      {/* Main content */}
      <main className="flex-1 pl-28 pr-5 py-8 lg:pr-[400px]">
        <header className="mb-10">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Recent Tracks</h1>
          </div>
          <p className="mt-2 text-gray-400">Welcome back, {user?.name || 'User'}! Continue your learning journey from where you left off</p>
        </header>
        
        {/* Recent Tracks */}
        <div className="grid grid-cols-1 gap-5 mb-16 sm:grid-cols-2 lg:grid-cols-3">
          <Link to="/dsa/arrays/linear-search">
            <TrackCard 
              title="DSA" 
              color="teal"
              topics={{ count: 19, label: "Topics" }}
              contests={{ count: 16, label: "Contests" }}
              problems={{ count: 473, label: "Problems" }}
              progress={61}
            />
          </Link>
          
          <TrackCard 
            title="DSA (Concept Revision)" 
            color="cyan"
            topics={{ count: 40, label: "Topics" }}
            problems={{ count: 199, label: "Problems" }}
            progress={41}
          />
          
          <Link to="/quiz">
            <TrackCard 
              title="Quantitative Aptitude" 
              color="purple"
              topics={{ count: 25, label: "Topics" }}
              problems={{ count: 1500, label: "Problems" }}
              progress={0}
            />
          </Link>
          
          <Link to="/operating-system">
            <TrackCard 
              title="Operating Systems" 
              color="blue"
              modules={{ count: 9, label: "Modules" }}
              quizzes={{ count: 9, label: "Quizzes" }}
              chapters={{ count: 83, label: "Chapters" }}
              progress={7}
            />
          </Link>
          
          <Link to="/low-level-design">
            <TrackCard 
              title="Low Level Design (LLD)" 
              color="pink"
              topics={{ count: 13, label: "Topics" }}
              problems={{ count: 49, label: "Problems" }}
              progress={2}
            />
          </Link>
          
          <Link to="/oops">
            <TrackCard 
              title="OOPS" 
              color="red"
              topics={{ count: 6, label: "Topics" }}
              problems={{ count: 52, label: "Problems" }}
              progress={0}
            />
          </Link>
        </div>
        
        {/* Data Structures and Algorithms Section */}
        <CategorySection title="Data Structures and Algorithm" viewAllLink="/dsa">
          <Link to="/dsa/arrays/linear-search">
            <SubjectCard
              title="DSA"
              icon={<SubjectIcon icon={Database} color="bg-teal-900" />}
              metadata={[
                { label: "Topics", value: "19+" },
                { label: "Contests", value: "16+" },
                { label: "Problems", value: "473+" }
              ]}
            />
          </Link>
          
          <SubjectCard
            title="Premium Problems"
            icon={<SubjectIcon icon={Database} color="bg-yellow-900" />}
            metadata={[
              { label: "problems with company tags and difficulty", value: "1000+" }
            ]}
          />
        </CategorySection>
        
        {/* Design Section */}
        <CategorySection title="Design" viewAllLink="#">
          <Link to="/low-level-design">
            <SubjectCard
              title="Low Level Design (LLD)"
              icon={<SubjectIcon icon={LayoutGrid} color="bg-pink-900" />}
              metadata={[
                { label: "Topics", value: "13+" },
                { label: "Problems", value: "49+" }
              ]}
            />
          </Link>
          
          <Link to="/oops">
            <SubjectCard
              title="OOPS"
              icon={<SubjectIcon icon={PackageOpen} color="bg-red-900" />}
              metadata={[
                { label: "Topics", value: "6+" },
                { label: "Quizzes", value: "10+" },
                { label: "Problems", value: "52+" }
              ]}
            />
          </Link>
        </CategorySection>
        
        {/* Core Subjects Section */}
        <CategorySection title="Core Subjects" viewAllLink="#">
          <Link to="/computer-network">
            <SubjectCard
              title="Computer Networks"
              icon={<SubjectIcon icon={Network} color="bg-purple-900" />}
              metadata={[
                { label: "Modules", value: "10+" },
                { label: "Quizzes", value: "12+" },
                { label: "Chapters", value: "50+" }
              ]}
            />
          </Link>
          
          <Link to="/dbms">
            <SubjectCard
              title="DBMS"
              icon={<SubjectIcon icon={Server} color="bg-blue-900" />}
              metadata={[
                { label: "Modules", value: "14+" },
                { label: "Quizzes", value: "14+" },
                { label: "Chapters", value: "106+" }
              ]}
            />
          </Link>
        </CategorySection>
        
        {/* Aptitude Section */}
        <CategorySection title="Aptitude" viewAllLink="#">
          <Link to="/logical-reasoning">
            <SubjectCard
              title="Logical Reasoning"
              icon={<SubjectIcon icon={BookOpen} color="bg-yellow-900" />}
              metadata={[
                { label: "Topics", value: "13+" },
                { label: "Contests", value: "4+" },
                { label: "Problems", value: "770+" }
              ]}
            />
          </Link>
          
          <Link to="/quiz">
            <SubjectCard
              title="Quantitative Aptitude"
              icon={<SubjectIcon icon={Monitor} color="bg-purple-900" />}
              metadata={[
                { label: "Topics", value: "25+" },
                { label: "Problems", value: "1500+" }
              ]}
            />
          </Link>
          
          <Link to="/verbal-ability">
            <SubjectCard
              title="Verbal Ability"
              icon={<SubjectIcon icon={BookOpen} color="bg-green-900" />}
              metadata={[
                { label: "Topics", value: "20+" },
                { label: "Problems", value: "1200+" }
              ]}
            />
          </Link>
          
          <Link to="/mock-test">
            <SubjectCard
              title="Mock Test"
              icon={<SubjectIcon icon={LayoutGrid} color="bg-orange-900" />}
              metadata={[
                { label: "Tests", value: "50+" },
                { label: "Questions", value: "2000+" }
              ]}
            />
          </Link>
        </CategorySection>
      </main>
      
      {/* Right sidebar */}
      <motion.aside 
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="fixed top-0 right-0 w-[380px] h-full bg-[#0f0f0f] py-8 px-6 border-l border-[#2a2a2a] hidden lg:block overflow-auto"
      >
        
      
        {/* Calendar Widget */}
        <div className="mb-10 -ml-3 -mr-3">
          <CalendarWidget />
        </div>
        
        {/* Leaderboard */}
        <div className="mb-10 -ml-3 -mr-3 bg-[#1a1a1a] border border-[#2a2a2a] p-4 rounded-lg">
          <div className="flex items-center justify-between pb-2 mb-5 border-b border-gray-800">
            <h3 className="text-lg font-medium">Leaderboard</h3>
            <span className="text-xs text-blue-400 cursor-pointer">Rules</span>
          </div>
          
          <div className="space-y-4">
            {[
              { name: "Sudhanshan Hegde", points: 189, position: 1 },
              { name: "Annie", points: 125, position: 2 },
              { name: "Dinesh Suthar", points: 121, position: 3 }
            ].map((user, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium 
                    ${user.position === 1 ? 'bg-yellow-500 text-black' : 
                      user.position === 2 ? 'bg-gray-400 text-black' : 'bg-amber-700 text-white'}`}>
                    {user.position}
                  </div>
                  <div className="flex items-center justify-center w-8 h-8 bg-gray-700 rounded-full">
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-sm">{user.name}</span>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 bg-gray-800 rounded-full">
                  <span className="text-orange-500">🔥</span>
                  <span className="text-sm font-medium">{user.points}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Daily Planner */}
        <DailyPlanner />
      </motion.aside>
    </div>
  );
};

export default HomePage;
