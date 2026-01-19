import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@shared/hooks/ToastContext';
import { AuthContext } from "@features/auth/stores/AuthContext";
import { profileService, type UserProfile, type ProfileStats, type ProfileActivity } from '../services/profileService';
import LoadingSpinner from '@shared/components/ui/LoadingSpinner';
import BottomNavigation from '@shared/components/layout/BottomNavigation';
import MobileTopBar from '@shared/components/layout/MobileTopBar';

// Component imports
import {
  ProfileTopBar,
  ProfileSidebar,
  DSAProgress,
  OtherSubjects,
  SubmissionsHeatmap,
  RecentlyCompleted
} from '../components';

// Types for component props
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

// Subject progress - will be fetched from API in future
const subjectProgressData: SubjectProgress[] = [
  { name: 'OOPS', completed: 0, total: 52 },
  { name: 'Operating System', completed: 0, total: 63 },
  { name: 'Low Level Design (LLD)', completed: 0, total: 67 },
  { name: 'Computer Networks', completed: 0, total: 60 },
  { name: 'DBMS', completed: 0, total: 62 },
  { name: 'Logical Reasoning', completed: 0, total: 840 },
  { name: 'Mock Test', completed: 0, total: 50 },
  { name: 'Quantitative Aptitude', completed: 0, total: 500 },
  { name: 'Verbal Ability', completed: 0, total: 480 }
];

const ProfilePage: React.FC = () => {
  const { username: urlUsername } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { error: toastError, success: toastSuccess } = useToast();

  // Profile state
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [profileStats, setProfileStats] = useState<ProfileStats | null>(null);
  const [activityData, setActivityData] = useState<ProfileActivity | null>(null);
  
  // UI state
  const [isOwnProfile, setIsOwnProfile] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMobileProfile, setShowMobileProfile] = useState(false);

  // Fetch profile data
  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (urlUsername) {
          // Viewing profile by username in URL
          let decodedUsername = decodeURIComponent(urlUsername);
          // Substitute 'User' with 'joy' for MVP demo
          if (decodedUsername.toLowerCase() === 'user') {
            decodedUsername = 'joy';
          }
          const isOwn = user && (user.name === decodedUsername || user.email === decodedUsername);
          setIsOwnProfile(!!isOwn);

          if (isOwn && user) {
            // Own profile - use /profile/me endpoint
            const { user: userData, stats } = await profileService.getMyProfile();
            setProfileData(userData);
            setProfileStats(stats);
            // Fetch activity
            const activity = await profileService.getMyActivity();
            setActivityData(activity);
          } else {
            // Other user's profile - fetch by username
            const { user: userData, stats } = await profileService.getProfileByUsername(decodedUsername);
            setProfileData(userData);
            setProfileStats(stats);
            // Fetch activity for other user
            if (userData.id) {
              const activity = await profileService.getActivity(userData.id);
              setActivityData(activity);
            }
          }
        } else if (user) {
          // No username in URL, redirect to own profile URL
          const encodedUsername = encodeURIComponent(user.name);
          navigate(`/profile/${encodedUsername}`, { replace: true });
          return;
        } else {
          // Not logged in and no username - show guest profile
          setIsOwnProfile(false);
          setProfileData({
            id: 'guest',
            name: 'Guest User',
            email: '',
            avatar: '',
            bio: 'Welcome to StudyIO! Sign up to track your progress.',
            role: 'student',
            // Add other required UserProfile fields with defaults
          } as UserProfile);
          setProfileStats({
            problemsSolved: 0,
            submissions: 0,
            streak: 0,
            // Add other required ProfileStats fields with defaults
          } as ProfileStats);
          setActivityData(null);
        }
      } catch (err: unknown) {
        console.error('Error loading profile:', err);
        const message = err instanceof Error ? err.message : 'Failed to load profile';
        setError(message);
        toastError(message);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [urlUsername, user, navigate, toastError]);

  // Convert API stats to DSA stats format
  const dsaStats: DSAStats = profileStats ? {
    totalSolved: (profileStats.problemsSolved || 0),
    totalProblems: 1000, // Total problems in platform
    easy: {
      solved: Math.floor((profileStats.problemsSolved || 0) * 0.5), // Estimate
      total: 331
    },
    medium: {
      solved: Math.floor((profileStats.problemsSolved || 0) * 0.35),
      total: 422
    },
    hard: {
      solved: Math.floor((profileStats.problemsSolved || 0) * 0.15),
      total: 244
    }
  } : {
    totalSolved: 0,
    totalProblems: 1000,
    easy: { solved: 0, total: 331 },
    medium: { solved: 0, total: 422 },
    hard: { solved: 0, total: 244 }
  };

  // Convert recent submissions to completed problems format
  const completedProblems: CompletedProblem[] = activityData?.recentSubmissions
    ?.filter(sub => sub.status === 'accepted')
    .slice(0, 10)
    .map(sub => ({
      name: sub.problemId?.title || 'Unknown Problem',
      topic: 'DSA',
      date: new Date(sub.createdAt).toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: '2-digit', 
        year: '2-digit' 
      }).replace(/\//g, '/'),
      difficulty: (sub.problemId?.difficulty?.charAt(0).toUpperCase() + 
                  sub.problemId?.difficulty?.slice(1)) as 'Easy' | 'Medium' | 'Hard' || 'Easy'
    })) || [];

  // Convert activity heatmap to expected format
  const heatmapActivity: Record<string, number> = {};
  if (activityData?.activityHeatmap) {
    Object.entries(activityData.activityHeatmap).forEach(([dateStr, count]) => {
      const date = new Date(dateStr);
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const key = `${monthNames[date.getMonth()]}-${date.getDate()}`;
      heatmapActivity[key] = count;
    });
  }

  // Calculate active days from heatmap
  const activeDays = activityData?.activityHeatmap 
    ? Object.values(activityData.activityHeatmap).filter(v => v > 0).length 
    : 0;

  // Handle profile update
  interface ProfileUpdatePayload {
    name: string;
    bio?: string;
    mobile?: string;
    countryCode?: string;
    location?: string;
    university?: string;
    educationYear?: string;
    skills?: string[];
    socialLinks?: {
      linkedin?: string;
      github?: string;
      twitter?: string;
      website?: string;
      resume?: string;
    };
    projects?: Array<{
      name: string;
      description?: string;
      url?: string;
      credentials?: {
        username: string;
        password: string;
      };
    }>;
  }

  const handleProfileUpdate = async (updatedProfile: ProfileUpdatePayload) => {
    try {
      const savedProfile = await profileService.updateProfile({
        name: updatedProfile.name,
        bio: updatedProfile.bio,
        mobile: updatedProfile.mobile,
        countryCode: updatedProfile.countryCode,
        location: updatedProfile.location,
        university: updatedProfile.university,
        educationYear: updatedProfile.educationYear,
        skills: updatedProfile.skills,
        socialLinks: updatedProfile.socialLinks,
        projects: updatedProfile.projects,
      });
      
      setProfileData(prev => prev ? { ...prev, ...savedProfile } : savedProfile);
      toastSuccess('Profile updated successfully!');
      
      // Update URL if name changed
      if (updatedProfile.name !== profileData?.name) {
        navigate(`/profile/${encodeURIComponent(updatedProfile.name)}`, { replace: true });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update profile';
      toastError(message);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#0d0d0d] text-white">
        {/* Mobile Top Bar - Only on mobile */}
        <MobileTopBar showLogo={true} showTabs={false} />
        
        {/* Desktop Top Bar - Only on desktop */}
        <div className="hidden lg:block">
          <ProfileTopBar />
        </div>
        
        <div className="flex items-center justify-center flex-1 pt-32 lg:pt-0">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !profileData) {
    return (
      <div className="flex flex-col min-h-screen bg-[#0d0d0d] text-white">
        {/* Mobile Top Bar - Only on mobile */}
        <MobileTopBar showLogo={true} showTabs={false} />
        
        {/* Desktop Top Bar - Only on desktop */}
        <div className="hidden lg:block">
          <ProfileTopBar />
        </div>
        
        <div className="flex items-center justify-center flex-1 pt-32 lg:pt-0">
          <div className="text-center">
            <p className="mb-4 text-red-400">{error || 'Profile not found'}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0d0d0d] text-white">
      {/* Mobile Top Bar - Only on mobile */}
      <MobileTopBar showLogo={true} showTabs={false} />
      
      {/* Desktop Top Bar - Only on desktop */}
      <div className="hidden lg:block">
        <ProfileTopBar />
      </div>

      {/* Mobile Profile Drawer Overlay */}
      {showMobileProfile && (
        <div 
          className="fixed inset-0 z-40 lg:hidden bg-black/60 backdrop-blur-sm"
          onClick={() => setShowMobileProfile(false)}
        />
      )}
      
      {/* Main content area */}
      <div className="relative flex flex-1">
        {/* Left Sidebar - Desktop: always visible, Mobile: slide-in drawer */}
        <div className={`
          fixed lg:static inset-y-0 left-0 z-50
          transform transition-transform duration-300 ease-in-out
          ${showMobileProfile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          w-full sm:w-[360px] lg:w-[360px]
          overflow-y-auto
        `}>
          <ProfileSidebar 
            profile={{
              name: profileData.name,
              username: profileData.name,
              email: profileData.email,
              mobile: profileData.mobile,
              countryCode: profileData.countryCode,
              location: profileData.location || '',
              university: profileData.university || '',
              educationYear: profileData.educationYear,
              bio: profileData.bio || '',
              skills: profileData.skills || [],
              socialLinks: profileData.socialLinks || {},
              projects: profileData.projects || []
            }} 
            isOwnProfile={isOwnProfile}
            onProfileUpdate={isOwnProfile ? handleProfileUpdate : undefined}
            onClose={() => setShowMobileProfile(false)}
          />
        </div>
        
        {/* Main content */}
        <main className="flex-1 p-3 sm:p-4 lg:p-6 overflow-y-auto pb-16 lg:pb-6 pt-[72px] lg:pt-6">
          {/* Mobile Profile Header - Compact Info */}
          <div className="lg:hidden mb-3 bg-gradient-to-r from-[#1a1a1a] to-[#252525] rounded-xl p-4 border border-[#2a2a2a] shadow-lg">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-pink-500">
                <span className="text-xl font-bold text-white">
                  {profileData.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-bold text-white truncate">{profileData.name}</h2>
                <p className="text-xs text-gray-400 truncate">{profileData.email}</p>
              </div>
              <button
                onClick={() => setShowMobileProfile(true)}
                className="p-2 bg-[#2a2a2a] hover:bg-[#333] rounded-lg transition-colors"
                aria-label="View Profile"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400">
                  <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Top section - progress cards */}
          <div className="grid grid-cols-1 gap-3 mb-3 sm:gap-4 lg:gap-6 sm:mb-4 lg:mb-6 md:grid-cols-2">
            <DSAProgress stats={dsaStats} />
            <OtherSubjects subjects={subjectProgressData} />
          </div>
          
          {/* Middle section - submissions heatmap */}
          <div className="bg-[#1a1a1a] rounded-xl p-3 sm:p-4 lg:p-6 mb-3 sm:mb-4 lg:mb-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-[#2a2a2a]">
            <SubmissionsHeatmap 
              submissions={profileStats?.totalSubmissions || 0} 
              year={new Date().getFullYear()} 
              activityData={heatmapActivity} 
              activeCount={activeDays}
              maxStreak={profileStats?.maxStreak || 0}
            />
          </div>
          
          {/* Bottom section - recently completed */}
          <div className="bg-[#1a1a1a] rounded-xl p-3 sm:p-4 lg:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-[#2a2a2a]">
            <RecentlyCompleted problems={completedProblems} />
          </div>
        </main>
      </div>

      {/* Bottom Navigation - Mobile Only */}
      <BottomNavigation activePage="profile" />
    </div>
  );
};

export default ProfilePage;
