import { type FC } from 'react';
import { Sidebar } from '../components/navigation';
import { UpcomingSessions, PreviousSessions } from '../components/session';
import { upcomingSessions, previousSessions } from '../data/sessions';

const SessionsPage: FC = () => {
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
