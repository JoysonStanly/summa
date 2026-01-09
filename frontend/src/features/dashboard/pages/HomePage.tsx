import { Database, LayoutGrid, Monitor, BookOpen, Server, Network, PackageOpen, ChevronRight, ChevronLeft } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sidebar } from "@/shared/components/layout";
import BottomNavigation from "@/shared/components/layout/BottomNavigation";
import MobileTopBar from "@/shared/components/layout/MobileTopBar";
import { TrackCard, CalendarWidget } from "@/features/sessions/components";
import { CategorySection, SubjectCard } from "@/shared/components/ui";
import DailyPlanner from "@/features/profile/components/DailyPlanner";
import { useContext, useEffect, useState, useCallback, useRef } from 'react';
import { AuthContext } from "@/features/auth/stores/AuthContext";
import { useUserStore } from '@/store/userStore';
import leaderboardApi, { type LeaderboardUser } from '@/features/rankings/services/leaderboardService';
import { apiCache } from '@/utils/apiCache';

// Mock icons for subject cards
const SubjectIcon = ({ icon: Icon, color }: { icon: LucideIcon; color: string }) => (
  <div className={`w-full h-full flex items-center justify-center ${color}`}>
    <Icon size={24} />
  </div>
);

const HomePage = () => {
  const [isPlannerExpanded, setIsPlannerExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'streak' | 'daily-planner'>('home');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const { user } = useContext(AuthContext);
  const { progress, stats, fetchProgress, fetchStats, isLoadingProgress, streakRefreshTrigger } = useUserStore();
  
  // Initialize leaderboard with cached data immediately
  const [leaderboardUsers, setLeaderboardUsers] = useState<LeaderboardUser[]>(() => {
    const cached = apiCache.get<any>('leaderboard_3_0');
    return cached?.data || [];
  });
  const [leaderboardLoading, setLeaderboardLoading] = useState(() => {
    // Only show loading if no cached data exists
    const cached = apiCache.get<any>('leaderboard_3_0');
    return !cached;
  });
  
  const [startedTracks, setStartedTracks] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('startedTracks');
    return saved ? JSON.parse(saved) : {};
  });

  // Handle track start/resume
  const handleTrackClick = (trackId: string) => {
    setStartedTracks(prev => {
      const updated = { ...prev, [trackId]: true };
      localStorage.setItem('startedTracks', JSON.stringify(updated));
      return updated;
    });
  };

  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  // Fetch leaderboard data with caching and optimistic loading
  const fetchLeaderboard = useCallback(async () => {
    // Check if we have cached data
    const cachedData = apiCache.get<any>('leaderboard_3_0');
    
    // Only show loading if we don't have cached data
    if (!cachedData) {
      setLeaderboardLoading(true);
    }
    
    try {
      const response = await leaderboardApi.getLeaderboard(3, 0);
      setLeaderboardUsers(response.data);
      setLeaderboardLoading(false);
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err);
      // If we don't have cached data, show empty state
      if (!cachedData) {
        setLeaderboardUsers([]);
        setLeaderboardLoading(false);
      }
      // If we have cached data, just keep using it (already set in state initialization)
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);
  
  useEffect(() => {
    if (user) {
      fetchProgress();
      fetchStats();
    }
  }, [user, fetchProgress, fetchStats]);

  useEffect(() => {
    checkScrollPosition();
    window.addEventListener('resize', checkScrollPosition);
    return () => window.removeEventListener('resize', checkScrollPosition);
  }, []);

  // Calculate progress percentage
  const dsaProgress = stats ? Math.round(((stats.easySolved + stats.mediumSolved + stats.hardSolved) / stats.totalProblems) * 100) : 61;
  
  return (
    <div className="flex min-h-screen bg-[#0f0f0f] text-white overflow-x-hidden">
      {/* Sidebar - Desktop only */}
      <Sidebar activePage="home" />

      {/* Mobile Top Navigation */}
      <MobileTopBar activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Main content */}
      <main className="flex-1 px-4 py-8 pt-32 pb-20 lg:pt-8 lg:pl-28 lg:pr-5 lg:pb-8 xl:pr-[400px] overflow-x-hidden">
        {/* Main Home Content - Visible on desktop always, on mobile only when Home tab is active */}
        <div className={`${activeTab === 'home' ? 'block' : 'hidden'} lg:block`}>
        <header className="mb-10">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Recent Tracks</h1>
          </div>
        </header>
        
        {/* Recent Tracks */}
        <div className="relative w-full mb-16 overflow-hidden">
          <div 
            ref={scrollContainerRef}
            className="flex gap-5 overflow-x-scroll scrollbar-hide -mb-4 pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onScroll={checkScrollPosition}
          >
            <Link to="/dsa/arrays/fundamentals/linear-search" onClick={() => handleTrackClick('dsa')} className="flex-shrink-0 w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)]">
              <TrackCard 
                title="DSA" 
                color="teal"
                topics={{ count: 19, label: "Topics" }}
                contests={{ count: 16, label: "Contests" }}
                problems={{ count: stats?.totalProblems || 473, label: "Problems" }}
                progress={isLoadingProgress ? 0 : dsaProgress}
                buttonText={startedTracks['dsa'] ? 'Resume' : 'Start Learning'}
              />
            </Link>
            
            <Link to="/quiz" onClick={() => handleTrackClick('quantitative')} className="flex-shrink-0 w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)]">
              <TrackCard 
                title="Quantitative Aptitude" 
                color="purple"
                topics={{ count: 25, label: "Topics" }}
                problems={{ count: 1500, label: "Problems" }}
                progress={0}
                buttonText={startedTracks['quantitative'] ? 'Resume' : 'Start Learning'}
              />
            </Link>
            
            <Link to="/operating-system" onClick={() => handleTrackClick('os')} className="flex-shrink-0 w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)]">
              <TrackCard 
                title="Operating Systems" 
                color="blue"
                modules={{ count: 9, label: "Modules" }}
                quizzes={{ count: 9, label: "Quizzes" }}
                chapters={{ count: 83, label: "Chapters" }}
                progress={0}
                buttonText={startedTracks['os'] ? 'Resume' : 'Start Learning'}
              />
            </Link>
            
            <Link to="/low-level-design" onClick={() => handleTrackClick('lld')} className="flex-shrink-0 w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)]">
              <TrackCard 
                title="Low Level Design (LLD)" 
                color="pink"
                topics={{ count: 13, label: "Topics" }}
                problems={{ count: 49, label: "Problems" }}
                progress={0}
                buttonText={startedTracks['lld'] ? 'Resume' : 'Start Learning'}
              />
            </Link>
            
            <Link to="/oops" onClick={() => handleTrackClick('oops')} className="flex-shrink-0 w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)]">
              <TrackCard 
                title="OOPS" 
                color="red"
                topics={{ count: 6, label: "Topics" }}
                problems={{ count: 52, label: "Problems" }}
                progress={0}
                buttonText={startedTracks['oops'] ? 'Resume' : 'Start Learning'}
              />
            </Link>
          </div>
          
          {/* Scroll Left Button */}
          <button
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className={`absolute left-0 z-10 flex items-center justify-center w-10 h-10 transition-all -translate-y-1/2 bg-black border border-gray-700 rounded-full top-1/2 hover:bg-gray-900 ${
              canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          
          {/* Scroll Right Button */}
          <button
            onClick={scrollRight}
            disabled={!canScrollRight}
            className={`absolute right-0 z-10 flex items-center justify-center w-10 h-10 transition-all -translate-y-1/2 bg-black border border-gray-700 rounded-full top-1/2 hover:bg-gray-900 ${
              canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>
        
        {/* Data Structures and Algorithms Section */}
        <CategorySection title="Data Structures and Algorithm" viewAllLink="/dsa">
          <Link to="/dsa/arrays/fundamentals/linear-search">
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
          <Link to="/computer-networks">
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
          
          <Link to="/operating-system">
            <SubjectCard
              title="Operating Systems"
              icon={<SubjectIcon icon={Monitor} color="bg-teal-900" />}
              metadata={[
                { label: "Modules", value: "9+" },
                { label: "Quizzes", value: "9+" },
                { label: "Chapters", value: "83+" }
              ]}
            />
          </Link>
          
          <Link to="/dbms">
            <SubjectCard
              title="DBMS"
              icon={<SubjectIcon icon={Server} color="bg-gray-700" />}
              metadata={[
                { label: "Modules", value: "14+" },
                { label: "Quizzes", value: "14+" },
                { label: "Chapters", value: "106+" }
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
        </div>

        {/* Mobile Tab Content - Only visible on mobile below lg */}
        <div className="block mt-4 xl:hidden">
          {activeTab === 'streak' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-5"
            >
              {/* Calendar Widget on Mobile */}
              <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-4">
                <h3 className="mb-4 text-lg font-semibold">Monthly Streak</h3>
                <CalendarWidget refreshTrigger={streakRefreshTrigger} />
              </div>

              {/* Leaderboard on Mobile */}
              <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-4">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-800">
                  <h3 className="text-lg font-semibold">Leaderboard</h3>
                  <Link to="/rankings" className="text-xs text-gray-400 hover:text-gray-300">View All</Link>
                </div>
                
                <div className="space-y-3">
                  {leaderboardLoading ? (
                    <div className="flex items-center justify-center py-6">
                      <div className="w-5 h-5 border-2 border-gray-600 rounded-full border-t-orange-500 animate-spin"></div>
                    </div>
                  ) : leaderboardUsers.length === 0 ? (
                    <p className="py-6 text-sm text-center text-gray-400">No users yet</p>
                  ) : (
                    leaderboardUsers.map((leaderUser) => (
                      <Link 
                        key={leaderUser.userId} 
                        to={`/profile/${encodeURIComponent(leaderUser.name)}`}
                        className="flex items-center justify-between p-2 transition-colors rounded-lg hover:bg-gray-800/50"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold 
                            ${leaderUser.rank === 1 ? 'bg-yellow-500 text-black' : 
                              leaderUser.rank === 2 ? 'bg-gray-400 text-black' : 'bg-amber-700 text-white'}`}>
                            {leaderUser.rank}
                          </div>
                          <div className="flex items-center justify-center text-sm bg-gray-700 rounded-full w-9 h-9">
                            {leaderUser.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-medium">{leaderUser.name}</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-800 rounded-full">
                          <span className="text-orange-500">🔥</span>
                          <span className="text-sm font-medium">{leaderUser.currentStreak}</span>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'daily-planner' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden h-full" 
              style={{ height: 'calc(100vh - 240px)' }}
            >
              <DailyPlanner onExpandChange={() => {}} defaultExpanded={true} />
            </motion.div>
          )}
        </div>
      </main>
      
      {/* Right sidebar - Desktop only */}
      <motion.aside 
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="fixed top-0 right-0 w-[380px] h-screen bg-[#0f0f0f] py-8 px-5 border-l border-[#2a2a2a] hidden xl:flex xl:flex-col overflow-hidden"
        style={{ zIndex: 10 }}
      >
        {!isPlannerExpanded && (
          <>
            {/* Calendar Widget */}
            <div className="mb-5 -mx-1">
              <CalendarWidget refreshTrigger={streakRefreshTrigger} />
            </div>
            
            {/* Leaderboard */}
            <div className="mb-2 -mx-1 bg-[#1a1a1a] border border-[#2a2a2a] p-4 rounded-lg">
              <div className="flex items-center justify-between pb-2 mb-5 border-b border-gray-800">
                <h3 className="text-lg font-medium">Leaderboard</h3>
                <Link to="/rankings" className="text-xs text-gray-400 cursor-pointer hover:text-gray-300">View All</Link>
              </div>
              
              <div className="space-y-4">
                {leaderboardLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="w-5 h-5 border-2 border-gray-600 rounded-full border-t-orange-500 animate-spin"></div>
                  </div>
                ) : leaderboardUsers.length === 0 ? (
                  <p className="py-4 text-sm text-center text-gray-400">No users yet</p>
                ) : (
                  leaderboardUsers.map((leaderUser) => (
                    <Link 
                      key={leaderUser.userId} 
                      to={`/profile/${encodeURIComponent(leaderUser.name)}`}
                      className="flex items-center justify-between p-1 -mx-1 transition-colors rounded-lg hover:bg-gray-800/50"
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium 
                          ${leaderUser.rank === 1 ? 'bg-yellow-500 text-black' : 
                            leaderUser.rank === 2 ? 'bg-gray-400 text-black' : 'bg-amber-700 text-white'}`}>
                          {leaderUser.rank}
                        </div>
                        <div className="flex items-center justify-center w-8 h-8 text-sm bg-gray-700 rounded-full">
                          {leaderUser.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm">{leaderUser.name}</span>
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 bg-gray-800 rounded-full">
                        <span className="text-orange-500">🔥</span>
                        <span className="text-sm font-medium">{leaderUser.currentStreak}</span>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </>
        )}
        
        {/* Daily Planner */}
        <div className={isPlannerExpanded ? "flex-1 -mx-5 -mb-8 overflow-hidden" : "-mx-2 flex-shrink-0"}>
          <DailyPlanner onExpandChange={setIsPlannerExpanded} />
        </div>
        
      </motion.aside>

      {/* Bottom Navigation - Mobile only */}
      <BottomNavigation activePage="home" />
    </div>
  );
};

export default HomePage;
