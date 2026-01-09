import { Linkedin, Share2, Github, Twitter, Globe, ExternalLink, User, Mail, Phone, Calendar, FileText } from 'lucide-react';
import { MapPin, School } from 'lucide-react';
import { useState } from 'react';
import EditProfileModal from './EditProfileModal';

interface SocialLinks {
  linkedin?: string;
  github?: string;
  twitter?: string;
  website?: string;
  resume?: string;
}

interface UserProfile {
  name: string;
  username: string;
  email?: string;
  mobile?: string;
  countryCode?: string;
  location: string;
  university: string;
  educationYear?: string;
  bio?: string;
  skills: string[];
  socialLinks?: SocialLinks;
  projects: Array<{
    name: string;
    description?: string;
    url?: string;
    credentials?: {
      username: string;
      password: string;
    };
  }>;
}

interface ProfileSidebarProps {
  profile: UserProfile;
  isOwnProfile?: boolean;
  onProfileUpdate?: (profile: UserProfile) => void;
  onClose?: () => void;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ profile, isOwnProfile = true, onProfileUpdate, onClose }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentProfile, setCurrentProfile] = useState<UserProfile>(profile);
  const [expandedSections, setExpandedSections] = useState({
    details: true,
    social: true,
    skills: true,
    projects: true
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSave = (formData: any) => {
    // Update local state with new profile data
    const updatedProfile: UserProfile = {
      name: formData.name,
      username: formData.username,
      email: formData.email,
      mobile: formData.mobile,
      countryCode: formData.countryCode,
      location: formData.location,
      university: formData.university,
      educationYear: formData.educationYear,
      bio: formData.bio,
      skills: formData.skills,
      socialLinks: formData.socialLinks,
      projects: formData.projects.map((p: any) => ({
        name: p.name,
        description: p.description,
        url: p.url,
        credentials: p.credentials
      }))
    };
    
    setCurrentProfile(updatedProfile);
    
    // Call parent update handler if provided
    if (onProfileUpdate) {
      onProfileUpdate(updatedProfile);
    }
    
    // TODO: Integrate with backend API
    console.log('Profile updated:', updatedProfile);
  };

  // Check if any social links exist
  const hasSocialLinks = currentProfile.socialLinks && (
    currentProfile.socialLinks.linkedin || 
    currentProfile.socialLinks.github || 
    currentProfile.socialLinks.twitter || 
    currentProfile.socialLinks.website ||
    currentProfile.socialLinks.resume
  );

  return (
    <>
    <aside className="h-full bg-[#111111] flex flex-col border-r border-[#2a2a2a] shadow-lg">
      {/* Mobile Header with Close Button */}
      <div className="lg:hidden sticky top-0 z-10 bg-[#111111] border-b border-[#2a2a2a] p-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Profile</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors"
          aria-label="Close Profile"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {/* Profile Header Container */}
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#252525] rounded-xl p-4 sm:p-5 border border-[#2a2a2a] shadow-md">
          {/* Profile Row */}
          <div className="flex items-center gap-3 sm:gap-4 mb-4">
            {/* Profile Icon Container */}
            <div className="relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center shadow-lg">
              <span className="text-2xl sm:text-3xl font-bold text-white">
                {currentProfile.name.charAt(0).toUpperCase()}
              </span>
            </div>
            
            {/* Profile Name Display Container */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl font-bold text-white truncate">{currentProfile.name}</h3>
              <p className="text-sm text-gray-400 truncate">{currentProfile.username}</p>
            </div>
          </div>

          {/* Bio */}
          {currentProfile.bio && (
            <p className="text-xs sm:text-sm text-gray-300 mb-4 leading-relaxed">{currentProfile.bio}</p>
          )}
          
          {/* Actions Container */}
          <div className="flex gap-2 sm:gap-3">
            {isOwnProfile && (
              <button 
                onClick={() => setIsEditModalOpen(true)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-lg text-sm font-medium text-white transition-all duration-200 hover:shadow-lg active:scale-95"
                aria-label="Edit Profile"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L14 4L5 13H3V11L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Edit Profile</span>
              </button>
            )}
            
            <button 
              className={`${
                isOwnProfile ? 'flex-1' : 'w-full'
              } flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 bg-[#2a2a2a] hover:bg-[#333] border border-[#3a3a3a] rounded-lg text-sm font-medium text-white transition-all duration-200 hover:shadow-md active:scale-95`}
              aria-label="Share Profile"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                // Could show toast here
              }}
            >
              <Share2 size={16} />
              <span>Share</span>
            </button>
          </div>
        </div>
      
        {/* Personal Details - Collapsible */}
        <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] overflow-hidden">
          <button
            onClick={() => toggleSection('details')}
            className="w-full flex items-center justify-between p-4 hover:bg-[#252525] transition-colors"
            aria-expanded={expandedSections.details}
          >
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <User size={16} className="text-orange-500" />
              Personal Details
            </h3>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`text-gray-400 transition-transform duration-200 ${expandedSections.details ? 'rotate-180' : ''}`}
            >
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {expandedSections.details && (
            <div className="px-4 pb-4 space-y-3">
              {currentProfile.email && (
                <div className="flex items-start sm:items-center gap-3 p-2 rounded-lg hover:bg-[#252525] transition-colors">
                  <Mail size={16} className="text-orange-500 flex-shrink-0 mt-0.5 sm:mt-0" />
                  <span className="text-xs sm:text-sm text-gray-300 break-all">{currentProfile.email}</span>
                </div>
              )}
              {currentProfile.mobile && (
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#252525] transition-colors">
                  <Phone size={16} className="text-orange-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-gray-300">{currentProfile.countryCode || '+91'} {currentProfile.mobile}</span>
                </div>
              )}
              <div className="flex items-start sm:items-center gap-3 p-2 rounded-lg hover:bg-[#252525] transition-colors">
                <MapPin size={16} className="text-orange-500 flex-shrink-0 mt-0.5 sm:mt-0" />
                <span className="text-xs sm:text-sm text-gray-300">{currentProfile.location || 'Add your location'}</span>
              </div>
              <div className="flex items-start sm:items-center gap-3 p-2 rounded-lg hover:bg-[#252525] transition-colors">
                <School size={16} className="text-orange-500 flex-shrink-0 mt-0.5 sm:mt-0" />
                <span className="text-xs sm:text-sm text-gray-300">{currentProfile.university || 'Add your university'}</span>
              </div>
              {currentProfile.educationYear && (
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#252525] transition-colors">
                  <Calendar size={16} className="text-orange-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-gray-300">Graduating: {currentProfile.educationYear}</span>
                </div>
              )}
            </div>
          )}
        </div>
      
        {/* Social Links - Collapsible */}
        <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] overflow-hidden">
          <button
            onClick={() => toggleSection('social')}
            className="w-full flex items-center justify-between p-4 hover:bg-[#252525] transition-colors"
            aria-expanded={expandedSections.social}
          >
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Globe size={16} className="text-orange-500" />
              Social Links
            </h3>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`text-gray-400 transition-transform duration-200 ${expandedSections.social ? 'rotate-180' : ''}`}
            >
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {expandedSections.social && (
            <div className="px-4 pb-4">
              {hasSocialLinks ? (
                <div className="grid grid-cols-5 gap-2">
                  {currentProfile.socialLinks?.linkedin && (
                    <a 
                      href={`https://linkedin.com/in/${currentProfile.socialLinks.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn Profile"
                      className="flex items-center justify-center p-3 bg-[#2a2a2a] hover:bg-[#0077b5]/20 border border-[#3a3a3a] hover:border-[#0077b5] rounded-lg transition-all duration-200 active:scale-95"
                    >
                      <Linkedin size={20} className="text-[#0077b5]" />
                    </a>
                  )}
                  {currentProfile.socialLinks?.github && (
                    <a 
                      href={`https://github.com/${currentProfile.socialLinks.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="GitHub Profile"
                      className="flex items-center justify-center p-3 bg-[#2a2a2a] hover:bg-white/10 border border-[#3a3a3a] hover:border-white rounded-lg transition-all duration-200 active:scale-95"
                    >
                      <Github size={20} className="text-gray-400 hover:text-white" />
                    </a>
                  )}
                  {currentProfile.socialLinks?.twitter && (
                    <a 
                      href={`https://twitter.com/${currentProfile.socialLinks.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Twitter Profile"
                      className="flex items-center justify-center p-3 bg-[#2a2a2a] hover:bg-[#1DA1F2]/20 border border-[#3a3a3a] hover:border-[#1DA1F2] rounded-lg transition-all duration-200 active:scale-95"
                    >
                      <Twitter size={20} className="text-[#1DA1F2]" />
                    </a>
                  )}
                  {currentProfile.socialLinks?.website && (
                    <a 
                      href={currentProfile.socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Personal Website"
                      className="flex items-center justify-center p-3 bg-[#2a2a2a] hover:bg-green-500/20 border border-[#3a3a3a] hover:border-green-500 rounded-lg transition-all duration-200 active:scale-95"
                    >
                      <Globe size={20} className="text-green-500" />
                    </a>
                  )}
                  {currentProfile.socialLinks?.resume && (
                    <a 
                      href={currentProfile.socialLinks.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Resume"
                      className="flex items-center justify-center p-3 bg-[#2a2a2a] hover:bg-purple-500/20 border border-[#3a3a3a] hover:border-purple-500 rounded-lg transition-all duration-200 active:scale-95"
                    >
                      <FileText size={20} className="text-purple-500" />
                    </a>
                  )}
                </div>
              ) : (
                <p className="text-xs text-gray-500 p-2">No social links added yet. {isOwnProfile && 'Click Edit Profile to add.'}</p>
              )}
            </div>
          )}
        </div>
      
        {/* Skills - Collapsible */}
        <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] overflow-hidden">
          <button
            onClick={() => toggleSection('skills')}
            className="w-full flex items-center justify-between p-4 hover:bg-[#252525] transition-colors"
            aria-expanded={expandedSections.skills}
          >
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-orange-500">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Skills
              {currentProfile.skills.length > 0 && (
                <span className="ml-1 text-xs text-gray-500">({currentProfile.skills.length})</span>
              )}
            </h3>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`text-gray-400 transition-transform duration-200 ${expandedSections.skills ? 'rotate-180' : ''}`}
            >
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {expandedSections.skills && (
            <div className="px-4 pb-4">
              {currentProfile.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {currentProfile.skills.map((skill, index) => (
                    <span 
                      key={index} 
                      className="text-xs px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-500/20 to-pink-500/20 text-orange-300 border border-orange-500/30 hover:border-orange-500/50 hover:shadow-md transition-all duration-200 cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500 p-2">No skills added yet. {isOwnProfile && 'Click Edit Profile to add.'}</p>
              )}
            </div>
          )}
        </div>
      
        {/* Projects - Collapsible */}
        <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] overflow-hidden">
          <button
            onClick={() => toggleSection('projects')}
            className="w-full flex items-center justify-between p-4 hover:bg-[#252525] transition-colors"
            aria-expanded={expandedSections.projects}
          >
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-orange-500">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="9 22 9 12 15 12 15 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Projects
              {currentProfile.projects.length > 0 && (
                <span className="ml-1 text-xs text-gray-500">({currentProfile.projects.length})</span>
              )}
            </h3>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`text-gray-400 transition-transform duration-200 ${expandedSections.projects ? 'rotate-180' : ''}`}
            >
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {expandedSections.projects && (
            <div className="px-4 pb-4">
              {currentProfile.projects.length > 0 ? (
                <div className="space-y-3">
                  {currentProfile.projects.map((project, index) => (
                    <div key={index} className="bg-gradient-to-br from-[#2a2a2a] to-[#252525] rounded-lg p-4 border border-[#3a3a3a] hover:border-orange-500/50 hover:shadow-lg transition-all duration-200 group">
                      <div className="flex items-start justify-between mb-2 gap-2">
                        <h4 className="text-sm font-semibold text-white group-hover:text-orange-400 transition-colors flex-1">{project.name}</h4>
                        {project.url && (
                          <a 
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`View ${project.name}`}
                            className="flex-shrink-0 bg-[#333] hover:bg-[#444] p-2 rounded-lg transition-all duration-200 text-gray-400 hover:text-orange-400 active:scale-95"
                          >
                            <ExternalLink size={14} />
                          </a>
                        )}
                      </div>
                      {project.description && (
                        <p className="text-xs text-gray-400 leading-relaxed mb-3">{project.description}</p>
                      )}
                      {project.credentials && (
                        <div className="text-[10px] text-gray-500 bg-[#1a1a1a] rounded-lg px-3 py-2 border border-[#3a3a3a]">
                          <div className="flex items-center gap-1 mb-1">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                              <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                            <span className="font-medium">Demo Credentials:</span>
                          </div>
                          <div className="ml-4">
                            <div>Username: <span className="text-orange-400">{project.credentials.username}</span></div>
                            <div>Password: <span className="text-orange-400">{project.credentials.password}</span></div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500 p-2">{isOwnProfile !== false ? 'No projects added yet. Click Edit Profile to add.' : 'No projects added yet.'}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </aside>

    {isOwnProfile !== false && (
      <EditProfileModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profile={currentProfile}
        onSave={handleSave}
      />
    )}
    </>
  );
};

export default ProfileSidebar;
