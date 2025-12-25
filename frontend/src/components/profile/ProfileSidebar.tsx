import { Linkedin, Share2, X, Upload } from 'lucide-react';
import { MapPin, School } from 'lucide-react';
import { useState } from 'react';
import EditProfileModal from './EditProfileModal';

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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleSave = (formData: any) => {
    // Handle save logic here
    console.log('Saving profile:', formData);
  };

  return (
    <>
    <aside className="w-[360px] bg-[#111111] p-6 border-r border-[#2a2a2a] overflow-y-auto shadow-lg">
      {/* Profile Header Container */}
      <div className="mb-6 bg-[#1a1a1a] rounded-lg p-4 border border-[#2a2a2a]">
        {/* Profile Row */}
        <div className="flex items-center gap-4 mb-4">
          {/* Profile Icon Container */}
          <div className="relative flex-shrink-0 w-16 h-16 overflow-hidden rounded-full">
            <img 
              alt="Profile Picture" 
              loading="lazy" 
              decoding="async"
              className="object-cover w-full h-full"
              src="https://takeuforward-content-images.s3.ap-south-1.amazonaws.com/profile/joyson%20stanly?X-Amz-Algorithm=AWS4-HMAC-SHA256&amp;X-Amz-Checksum-Mode=ENABLED&amp;X-Amz-Credential=AKIA2LFMBNFQHZGEYE7P%2F20251224%2Fap-south-1%2Fs3%2Faws4_request&amp;X-Amz-Date=20251224T173043Z&amp;X-Amz-Expires=86400&amp;X-Amz-SignedHeaders=host&amp;x-id=GetObject&amp;X-Amz-Signature=9d550099c996918724179b47fb162fbc165de783112b89669306ce3c19af6084"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.className = 'relative flex items-center justify-center flex-shrink-0 w-16 h-16 text-lg font-bold rounded-full bg-gradient-to-br from-gray-600 to-gray-800';
                  parent.textContent = profile.name.charAt(0);
                }
              }}
            />
          </div>
          
          {/* Profile Name Display Container */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-white truncate">{profile.name}</h3>
            <p className="text-sm text-gray-400 truncate">{profile.username}</p>
          </div>
        </div>
        
        {/* Actions Container */}
        <div className="flex gap-2">
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#2a2a2a] hover:bg-[#333] border border-[#3a3a3a] rounded-md text-xs font-medium text-white transition-all duration-200 hover:shadow-md"
            aria-label="Edit Profile"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L14 4L5 13H3V11L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Edit Profile</span>
          </button>
          
          <button 
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#2a2a2a] hover:bg-[#333] border border-[#3a3a3a] rounded-md text-xs font-medium text-white transition-all duration-200 hover:shadow-md"
            aria-label="Share Profile"
          >
            <Share2 size={14} />
            <span>Share Profile</span>
          </button>
        </div>
      </div>
      
      {/* Location and university */}
      <div className="mb-6 bg-[#1a1a1a] rounded-lg p-4 border border-[#2a2a2a]">
        <div className="space-y-2.5">
          <div className="flex items-center text-gray-300 transition-colors duration-200 hover:text-white">
            <MapPin size={14} className="mr-2.5" />
            <span className="text-xs">{profile.location}</span>
          </div>
          <div className="flex items-center text-gray-300 transition-colors duration-200 hover:text-white">
            <School size={14} className="mr-2.5" />
            <span className="text-xs">{profile.university}</span>
          </div>
        </div>
      </div>
      
      {/* Social links */}
      <div className="mb-6 bg-[#1a1a1a] rounded-lg p-4 border border-[#2a2a2a]">
        <h3 className="mb-3 text-sm font-semibold">Social Links</h3>
        <div className="flex gap-2">
          <a href="#" className="text-[#0077b5] hover:text-[#0095e0] transition-colors duration-200 p-2 hover:bg-[#2a2a2a] rounded-lg">
            <Linkedin size={18} />
          </a>
        </div>
      </div>
      
      {/* Skills section */}
      <div className="mb-6 bg-[#1a1a1a] rounded-lg p-4 border border-[#2a2a2a]">
        <h3 className="mb-3 text-sm font-semibold">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {profile.skills.map((skill, index) => (
            <span 
              key={index} 
              className="text-[10px] px-2.5 py-1 rounded-full bg-[#2a2a2a] text-white border border-[#3a3a3a] hover:bg-[#333] hover:border-[#4a4a4a] transition-all duration-200 cursor-default hover:shadow-md"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
      
      {/* Projects section */}
      <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#2a2a2a]">
        <h3 className="mb-3 text-sm font-semibold">Projects</h3>
        <div className="space-y-3">
          {profile.projects.map((project, index) => (
            <div key={index} className="bg-[#2a2a2a] rounded-lg p-3.5 border border-[#3a3a3a] hover:border-[#4a4a4a] hover:shadow-md transition-all duration-200 group">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold transition-colors group-hover:text-white">{project.name}</h4>
                <button className="bg-transparent hover:bg-[#333] p-2 rounded transition-all duration-200">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                </button>
              </div>
              {project.description && (
                <p className="text-[10px] text-gray-400 leading-relaxed">{project.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </aside>

    <EditProfileModal 
      isOpen={isEditModalOpen}
      onClose={() => setIsEditModalOpen(false)}
      profile={profile}
      onSave={handleSave}
    />
    </>
  );
};

export default ProfileSidebar;
