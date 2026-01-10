import { type FC, useEffect, useState } from 'react';
import { useToast } from '@shared/hooks/ToastContext';
import { Sidebar } from "@shared/components/layout";
import { Menu, Code2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import BottomNavigation from '@shared/components/layout/BottomNavigation';
import { UpcomingSessions, PreviousSessions } from "@features/sessions/components";
import { sessionService, type Session } from '../services/sessionService';
import LoadingSpinner from '@shared/components/ui/LoadingSpinner';
import { apiCache } from '@shared/utils/apiCache';

const SessionsPage: FC = () => {
  const { error: toastError } = useToast();
  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([]);
  const [previousSessions, setPreviousSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingCache, setUsingCache] = useState(false);
  const [mobileTab, setMobileTab] = useState<'sessions' | 'previous'>('sessions');

  useEffect(() => {
    const loadSessions = async () => {
      setLoading(true);
      
      // Try to load cached data immediately (optimistic loading)
      const cachedAll = apiCache.get<Session[]>('sessions_all');
      if (cachedAll) {
        const now = new Date();
        const upcoming = cachedAll.filter(s => {
          // Get the session end time from timeRange and date
          const sessionStartDate = new Date(s.date);
          
          // Extract end time from timeRange (format: "HH:MM - HH:MM")
          const timeRange = (s as any).timeRange || '';
          const timeRangeParts = timeRange.split('-').map((t: string) => t.trim());
          
          if (timeRangeParts.length === 2) {
            const endTime = timeRangeParts[1]; // Get end time
            const [endHour, endMin] = endTime.split(':').map(Number);
            
            // Create end datetime
            const sessionEndDate = new Date(sessionStartDate);
            sessionEndDate.setHours(endHour, endMin, 0, 0);
            
            return s.status === 'upcoming' || sessionEndDate > now;
          }
          
          // Fallback to start date if timeRange is not available
          return s.status === 'upcoming' || sessionStartDate > now;
        });
        const past = cachedAll.filter(s => {
          // Get the session end time from timeRange and date
          const sessionStartDate = new Date(s.date);
          
          // Extract end time from timeRange (format: "HH:MM - HH:MM")
          const timeRange = (s as any).timeRange || '';
          const timeRangeParts = timeRange.split('-').map((t: string) => t.trim());
          
          if (timeRangeParts.length === 2) {
            const endTime = timeRangeParts[1]; // Get end time
            const [endHour, endMin] = endTime.split(':').map(Number);
            
            // Create end datetime
            const sessionEndDate = new Date(sessionStartDate);
            sessionEndDate.setHours(endHour, endMin, 0, 0);
            
            return s.status === 'completed' || sessionEndDate <= now;
          }
          
          // Fallback to start date if timeRange is not available
          return s.status === 'completed' || sessionStartDate <= now;
        });
        setUpcomingSessions(upcoming);
        setPreviousSessions(past);
        setUsingCache(true);
        setLoading(false);
      }
      
      try {
        const allSessions = await sessionService.getSessions();
        // Split into upcoming and past based on status and date+time
        const now = new Date();
        const upcoming = allSessions.filter(s => {
          // Get the session end time from timeRange and date
          const sessionStartDate = new Date(s.date);
          
          // Extract end time from timeRange (format: "HH:MM - HH:MM")
          const timeRange = (s as any).timeRange || '';
          const timeRangeParts = timeRange.split('-').map((t: string) => t.trim());
          
          if (timeRangeParts.length === 2) {
            const endTime = timeRangeParts[1]; // Get end time
            const [endHour, endMin] = endTime.split(':').map(Number);
            
            // Create end datetime
            const sessionEndDate = new Date(sessionStartDate);
            sessionEndDate.setHours(endHour, endMin, 0, 0);
            
            return s.status === 'upcoming' || sessionEndDate > now;
          }
          
          // Fallback to start date if timeRange is not available
          return s.status === 'upcoming' || sessionStartDate > now;
        });
        const past = allSessions.filter(s => {
          // Get the session end time from timeRange and date
          const sessionStartDate = new Date(s.date);
          
          // Extract end time from timeRange (format: "HH:MM - HH:MM")
          const timeRange = (s as any).timeRange || '';
          const timeRangeParts = timeRange.split('-').map((t: string) => t.trim());
          
          if (timeRangeParts.length === 2) {
            const endTime = timeRangeParts[1]; // Get end time
            const [endHour, endMin] = endTime.split(':').map(Number);
            
            // Create end datetime
            const sessionEndDate = new Date(sessionStartDate);
            sessionEndDate.setHours(endHour, endMin, 0, 0);
            
            return s.status === 'completed' || sessionEndDate <= now;
          }
          
          // Fallback to start date if timeRange is not available
          return s.status === 'completed' || sessionStartDate <= now;
        });
        setUpcomingSessions(upcoming);
        setPreviousSessions(past);
        setUsingCache(false);
        setError(null);
      } catch (err) {
        // If we have cache, don't show error
        if (!cachedAll) {
          setError(err instanceof Error ? err.message : 'Failed to load sessions');
        }
      } finally {
        setLoading(false);
      }
    };
    loadSessions();
  }, []);

  // Show toast on error
  useEffect(() => {
    if (error) {
      toastError(typeof error === 'string' ? error : 'Failed to load sessions');
    }
  }, [error, toastError]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#0f0f0f] text-white">
        <Sidebar activePage="sessions" />
        
        {/* Custom Mobile Top Bar */}
        <div className="fixed top-0 left-0 right-0 z-50 w-full lg:hidden bg-[#1a1a1a] border-b border-[#2a2a2a]">
          <div className="flex items-center justify-between w-full px-4 py-3">
            <Link to="/home" className="flex items-center">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500">
                  <Code2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">StudyIO</span>
              </div>
            </Link>
            <button className="flex items-center justify-center w-8 h-8 transition-colors rounded-md hover:bg-zinc-800">
              <Menu className="w-5 h-5 text-zinc-400" />
            </button>
          </div>
        </div>

        <main className="flex items-center justify-center flex-1 pt-20 pb-20 lg:pt-0 lg:pb-0">
          <LoadingSpinner />
        </main>
        <BottomNavigation activePage="sessions" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-[#0f0f0f] text-white">
        <Sidebar activePage="sessions" />
        
        {/* Custom Mobile Top Bar */}
        <div className="fixed top-0 left-0 right-0 z-50 w-full lg:hidden bg-[#1a1a1a] border-b border-[#2a2a2a]">
          <div className="flex items-center justify-between w-full px-4 py-3">
            <Link to="/home" className="flex items-center">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500">
                  <Code2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">StudyIO</span>
              </div>
            </Link>
            <button className="flex items-center justify-center w-8 h-8 transition-colors rounded-md hover:bg-zinc-800">
              <Menu className="w-5 h-5 text-zinc-400" />
            </button>
          </div>
        </div>

        <main className="flex items-center justify-center flex-1 pt-20 pb-20 lg:pt-0 lg:pb-0">
          <div className="text-center">
            <p className="mb-4 text-red-400">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        </main>
        <BottomNavigation activePage="sessions" />
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen bg-[#0f0f0f] text-white">
      {/* Sidebar - Desktop only */}
      <Sidebar activePage="sessions" />

      {/* Custom Mobile Top Navigation with Session Tabs */}
      <div className="fixed top-0 left-0 right-0 z-50 w-full lg:hidden bg-[#1a1a1a] border-b border-[#2a2a2a]">
        {/* Top Section: Logo + Menu */}
        <div className="flex items-center justify-between w-full px-4 py-3 border-b border-[#2a2a2a]">
          <Link to="/home" className="flex items-center">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">StudyIO</span>
            </div>
          </Link>
          <button className="flex items-center justify-center w-8 h-8 transition-colors rounded-md hover:bg-zinc-800">
            <Menu className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        {/* Tabs Section: Sessions / Previous Sessions */}
        <div className="flex justify-center px-3 py-2">
          <div className="inline-flex items-center gap-1 bg-[#1a1a1a] rounded-full p-0.5 border border-[#2a2a2a] w-full max-w-md">
            {/* Sessions Tab */}
            <button
              onClick={() => setMobileTab('sessions')}
              className="relative flex-1 px-4 py-2 text-sm font-medium transition-colors rounded-full"
            >
              {mobileTab === 'sessions' && (
                <motion.div
                  layoutId="session-mobile-tab-background"
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.25), rgba(234, 88, 12, 0.15))',
                  }}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className={`relative z-10 ${mobileTab === 'sessions' ? 'text-orange-400' : 'text-gray-400'}`}>
                Sessions
              </span>
            </button>

            {/* Previous Sessions Tab */}
            <button
              onClick={() => setMobileTab('previous')}
              className="relative flex-1 px-4 py-2 text-sm font-medium transition-colors rounded-full"
            >
              {mobileTab === 'previous' && (
                <motion.div
                  layoutId="session-mobile-tab-background"
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.25), rgba(234, 88, 12, 0.15))',
                  }}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className={`relative z-10 ${mobileTab === 'previous' ? 'text-orange-400' : 'text-gray-400'}`}>
                Previous
              </span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <main className="flex-1 px-4 sm:px-6 md:pl-40 md:pr-6 py-4 sm:py-6 pt-32 pb-20 lg:pt-6 lg:pb-6 lg:pr-[450px]">
        <header className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold">Sessions</h1>
        </header>
        
        {/* Upcoming Sessions - Show on desktop always, on mobile only when 'sessions' tab active */}
        <div className={`mb-6 sm:mb-8 mt-2 ${mobileTab === 'sessions' ? 'block' : 'hidden'} lg:block`}>
          <UpcomingSessions sessions={upcomingSessions} />
        </div>
        
        {/* Previous Sessions - Show on mobile when 'previous' tab active, hidden on desktop (shows in sidebar) */}
        <div className={`mt-8 sm:mt-10 ${mobileTab === 'previous' ? 'block' : 'hidden'} lg:hidden`}>
          <PreviousSessions sessions={previousSessions} />
        </div>
      </main>
      
      {/* Right sidebar - Desktop only */}
      <div className="fixed top-0 right-0 w-[400px] h-full bg-[#0f0f0f] p-6 pt-10 border-l border-[#2a2a2a] hidden lg:block overflow-auto">
        <PreviousSessions sessions={previousSessions} />
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNavigation activePage="sessions" />
    </div>
  );
};

export default SessionsPage;
