import { Linkedin } from 'lucide-react';
import { MapPin, School } from 'lucide-react';

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

interface ProfileSidebarProps {
  profile: UserProfile;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ profile }) => {
  return (
    <aside className="w-[350px] bg-[#111111] p-6 border-r border-[#2a2a2a] overflow-y-auto">
      {/* Profile info */}
      <div className="mb-6">
        <div className="flex flex-col items-center mb-4">
          {/* Profile avatar */}
          <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center text-xl font-bold mb-2">
            {profile.name.charAt(0)}
          </div>
          
          {/* Name and username */}
          <div className="text-center">
            <h2 className="text-xl font-bold">{profile.name}</h2>
            <p className="text-gray-400 text-sm">{profile.username}</p>
            <a href="#" className="text-blue-400 text-xs hover:underline">
              Edit Profile
            </a>
          </div>
        </div>
        
        {/* Location and university */}
        <div className="space-y-2">
          <div className="flex items-center text-gray-300">
            <MapPin size={14} className="mr-2" />
            <span className="text-sm">{profile.location}</span>
          </div>
          <div className="flex items-center text-gray-300">
            <School size={14} className="mr-2" />
            <span className="text-sm">{profile.university}</span>
          </div>
        </div>
        
        {/* Social links */}
        <div className="mt-4 flex">
          <a href="#" className="text-[#0077b5] hover:text-[#0077b5]/80">
            <Linkedin size={20} />
          </a>
        </div>
      </div>
      
      {/* Skills section */}
      <div className="mb-6">
        <h3 className="text-md font-medium mb-3">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {profile.skills.map((skill, index) => (
            <span 
              key={index} 
              className="text-xs px-2 py-1 rounded-full bg-[#333] text-white"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
      
      {/* Projects section */}
      <div>
        <h3 className="text-md font-medium mb-3">Projects</h3>
        <div className="space-y-4">
          {profile.projects.map((project, index) => (
            <div key={index} className="bg-[#1a1a1a] rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium">{project.name}</h4>
                <button className="bg-transparent hover:bg-[#333] p-1 rounded">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                </button>
              </div>
              {project.description && (
                <p className="text-xs text-gray-400">{project.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default ProfileSidebar;
