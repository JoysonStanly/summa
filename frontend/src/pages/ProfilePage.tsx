import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Component imports
import {
  ProfileTopBar,
  ProfileSidebar,
  DSAProgress,
  OtherSubjects,
  SubmissionsHeatmap,
  RecentlyCompleted
} from '../components/profile';

// Define mock data types
interface UserProfile {
  name: string;
  username: string;
  location: string;
  university: string;
  skills: string[];
  projects: Array<{
    name: string;
    description: string;
    credentials?: {
      username: string;
      password: string;
    };
  }>;
}

interface DSAStats {
  totalSolved: number;
  totalProblems: number;
  easy: {
    solved: number;
    total: number;
  };
  medium: {
    solved: number;
    total: number;
  };
  hard: {
    solved: number;
    total: number;
  };
}

interface SubjectProgress {
  name: string;
  completed: number;
  total: number;
}

interface CompletedProblem {
  name: string;
  topic: string;
  date: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

// Mock data
const userProfileData: UserProfile = {
  name: 'Joy',
  username: 'Jaydon Stanley',
  location: 'Tarikasi',
  university: 'Karunya University Coimbatore',
  skills: [
    'HTML', 'CSS', 'JavaScript', 'Bootstrap',
    'Node.js', 'Express.js', 'React.js', 'MySQL',
    'MongoDB', 'Mongoose', 'RESTful API',
    'JSON Web Tokens (JWT)', 'Python', 'Java'
  ],
  projects: [
    {
      name: 'nxtTrendz',
      description: 'Prime user: [username: rahul, password: rahul@2021]',
      credentials: {
        username: 'rahul',
        password: 'rahul@2021'
      }
    }
  ]
};

const dsaStatsData: DSAStats = {
  totalSolved: 263,
  totalProblems: 1000,
  easy: {
    solved: 133,
    total: 331
  },
  medium: {
    solved: 90,
    total: 422
  },
  hard: {
    solved: 40,
    total: 244
  }
};

const subjectProgressData: SubjectProgress[] = [
  { name: 'OOPS', completed: 44, total: 52 },
  { name: 'Operating System', completed: 4, total: 63 },
  { name: 'Low Level Design (LLD)', completed: 1, total: 67 },
  { name: 'Computer Networks', completed: 0, total: 60 },
  { name: 'DBMS', completed: 0, total: 62 },
  { name: 'Logical Reasoning', completed: 0, total: 840 },
  { name: 'Mock Test', completed: 0, total: 50 },
  { name: 'Quantitative Aptitude', completed: 0, total: 500 },
  { name: 'Verbal Ability', completed: 0, total: 480 }
];

const completedProblemsData: CompletedProblem[] = [
  { name: 'Linear Search', topic: 'DSA', date: '15/10/25', difficulty: 'Easy' },
  { name: 'Insert a given node in BST', topic: 'DSA', date: '13/10/25', difficulty: 'Medium' },
  { name: 'Floor and Ceil in a BST', topic: 'DSA', date: '12/10/25', difficulty: 'Easy' }
];

// Activity data for heatmap (representing submissions)
const generateActivityData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const activity: Record<string, number> = {};
  
  months.forEach((month) => {
    // Generate 30 days for each month
    for (let day = 1; day <= 30; day++) {
      const date = `${month}-${day}`;
      
      // Mostly empty for earlier months, more activity in recent months
      if (month === 'May' || month === 'Jun' || month === 'Jul' || month === 'Aug' || month === 'Sep') {
        // Higher probability of activity in recent months
        activity[date] = Math.random() > 0.7 ? Math.floor(Math.random() * 5) + 1 : 0;
      } else {
        // Lower probability in earlier months
        activity[date] = Math.random() > 0.95 ? Math.floor(Math.random() * 3) + 1 : 0;
      }
    }
  });
  
  return {
    activity,
    activeCount: 113, // Active days count
    maxStreak: 67 // Max streak
  };
};

const ProfilePage: React.FC = () => {
  const [activityData, setActivityData] = useState({ activity: {}, activeCount: 0, maxStreak: 0 });
  const { user } = useContext(AuthContext);
  
  useEffect(() => {
    // Generate the activity data on component mount
    setActivityData(generateActivityData());
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#0d0d0d] text-white">
      {/* Top Bar */}
      <ProfileTopBar />
      
      {/* Main content area */}
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <ProfileSidebar profile={user ? {
          name: user.name,
          username: user.email,
          location: userProfileData.location,
          university: userProfileData.university,
          skills: userProfileData.skills,
          projects: userProfileData.projects
        } : userProfileData} />
        
        {/* Main content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Top section - progress cards */}
          <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
            <DSAProgress stats={dsaStatsData} />
            <OtherSubjects subjects={subjectProgressData} />
          </div>
          
          {/* Middle section - submissions heatmap */}
          <div className="bg-[#1a1a1a] rounded-xl p-6 mb-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-[#2a2a2a]">
            <SubmissionsHeatmap 
              submissions={467} 
              year={2025} 
              activityData={activityData.activity} 
              activeCount={activityData.activeCount}
              maxStreak={activityData.maxStreak}
            />
          </div>
          
          {/* Bottom section - recently completed */}
          <div className="bg-[#1a1a1a] rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-[#2a2a2a]">
            <RecentlyCompleted problems={completedProblemsData} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
