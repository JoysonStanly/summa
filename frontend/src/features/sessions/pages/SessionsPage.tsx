import { type FC, useEffect, useState } from 'react';
import { Sidebar } from "@/shared/components/layout";
import { UpcomingSessions, PreviousSessions } from "@/features/sessions/components";
import { sessionService, type Session } from '../services/sessionService';

const SessionsPage: FC = () => {
  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([]);
  const [previousSessions, setPreviousSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSessions = async () => {
      setLoading(true);
      try {
        const allSessions = await sessionService.getSessions();
        
        // Split into upcoming and past based on status
        const now = new Date();
        const upcoming = allSessions.filter(s => 
          s.status === 'upcoming' || new Date(s.date) > now
        );
        const past = allSessions.filter(s => 
          s.status === 'completed' || new Date(s.date) <= now
        );
        
        setUpcomingSessions(upcoming);
        setPreviousSessions(past);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load sessions');
      } finally {
        setLoading(false);
      }
    };

    loadSessions();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#0f0f0f] text-white">
        <Sidebar activePage="sessions" />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading sessions...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-[#0f0f0f] text-white">
        <Sidebar activePage="sessions" />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen bg-[#0f0f0f] text-white">
      {/* Sidebar */}
      <Sidebar activePage="sessions" />
      
      {/* Main content */}
      <main className="flex-1 pl-40 pr-3 py-6 lg:pr-[450px]">
        <header className="mb-8">
          <h1 className="text-2xl font-bold">Sessions</h1>
        </header>
        
        {/* Upcoming Sessions */}
        <div className="mb-8">
          <UpcomingSessions sessions={upcomingSessions} />
        </div>
      </main>
      
      {/* Right sidebar */}
      <div className="fixed top-0 right-0 w-[400px] h-full bg-[#0f0f0f] p-6 pt-10 border-l border-[#2a2a2a] hidden lg:block overflow-auto">
        <PreviousSessions sessions={previousSessions} />
      </div>
      
      {/* Mobile/Tablet view for Previous Sessions (shown below content) */}
      <div className="px-4 pb-8 mt-8 lg:hidden">
        <PreviousSessions sessions={previousSessions} />
      </div>
    </div>
  );
};

export default SessionsPage;
