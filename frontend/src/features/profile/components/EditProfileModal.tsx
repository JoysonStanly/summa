import { X, Upload, Plus, Trash2, Edit2, Save, Link, Github, Linkedin, Twitter, Globe, MapPin, School, User, Briefcase, Code, ExternalLink, Phone, Mail, Calendar, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Project {
  id: string;
  name: string;
  description: string;
  url?: string;
  credentials?: {
    username: string;
    password: string;
  };
}

interface SocialLinks {
  linkedin?: string;
  github?: string;
  twitter?: string;
  website?: string;
  resume?: string;
}

interface ProfileData {
  name: string;
  username: string;
  email: string;
  mobile: string;
  countryCode: string;
  location: string;
  university: string;
  educationYear: string;
  bio: string;
  skills: string[];
  socialLinks: SocialLinks;
  projects: Project[];
}

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: {
    name: string;
    username: string;
    email?: string;
    mobile?: string;
    countryCode?: string;
    location: string;
    university: string;
    educationYear?: string;
    skills: string[];
    bio?: string;
    socialLinks?: SocialLinks;
    projects?: Array<{
      name: string;
      description: string;
      url?: string;
      credentials?: {
        username: string;
        password: string;
      };
    }>;
  };
  onSave: (data: ProfileData) => void;
}

type TabType = 'basic' | 'social' | 'skills' | 'projects';

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, profile, onSave }) => {
  const [activeTab, setActiveTab] = useState<TabType>('basic');
  const [isSaving, setIsSaving] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<ProfileData>({
    name: profile.name,
    username: profile.username,
    email: profile.email || '',
    mobile: profile.mobile || '',
    countryCode: profile.countryCode || '+91',
    location: profile.location,
    university: profile.university,
    educationYear: profile.educationYear || '',
    bio: profile.bio || '',
    skills: profile.skills,
    socialLinks: profile.socialLinks || {
      linkedin: '',
      github: '',
      twitter: '',
      website: '',
      resume: ''
    },
    projects: profile.projects?.map((p, idx) => ({
      id: `project-${idx}`,
      name: p.name,
      description: p.description,
      url: p.url || '',
      credentials: p.credentials
    })) || []
  });

  // Skill input state
  const [newSkill, setNewSkill] = useState('');
  
  // Project editing state
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [newProject, setNewProject] = useState<Project>({
    id: '',
    name: '',
    description: '',
    url: '',
    credentials: { username: '', password: '' }
  });
  const [showAddProject, setShowAddProject] = useState(false);

  // Reset form when profile changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: profile.name,
        username: profile.username,
        email: profile.email || '',
        mobile: profile.mobile || '',
        countryCode: profile.countryCode || '+91',
        location: profile.location,
        university: profile.university,
        educationYear: profile.educationYear || '',
        bio: profile.bio || '',
        skills: profile.skills,
        socialLinks: profile.socialLinks || {
          linkedin: '',
          github: '',
          twitter: '',
          website: '',
          resume: ''
        },
        projects: profile.projects?.map((p, idx) => ({
          id: `project-${idx}`,
          name: p.name,
          description: p.description,
          url: p.url || '',
          credentials: p.credentials
        })) || []
      });
      setActiveTab('basic');
      setShowAddProject(false);
      setEditingProject(null);
    }
  }, [isOpen, profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSocialLinkChange = (platform: keyof SocialLinks, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  // Skills handlers
  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  // Project handlers
  const addProject = () => {
    if (newProject.name.trim()) {
      const project: Project = {
        ...newProject,
        id: `project-${Date.now()}`
      };
      setFormData(prev => ({
        ...prev,
        projects: [...prev.projects, project]
      }));
      setNewProject({
        id: '',
        name: '',
        description: '',
        url: '',
        credentials: { username: '', password: '' }
      });
      setShowAddProject(false);
    }
  };

  const updateProject = (projectId: string, updates: Partial<Project>) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.map(p => 
        p.id === projectId ? { ...p, ...updates } : p
      )
    }));
  };

  const deleteProject = (projectId: string) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== projectId)
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      onSave(formData);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'basic', label: 'Basic Info', icon: <User size={16} /> },
    { id: 'social', label: 'Social Links', icon: <Link size={16} /> },
    { id: 'skills', label: 'Skills', icon: <Code size={16} /> },
    { id: 'projects', label: 'Projects', icon: <Briefcase size={16} /> }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="bg-[#141414] rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden border border-[#2a2a2a] shadow-2xl m-4"
        >
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-[#1a1a1a] to-[#222] border-b border-[#2a2a2a] px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-pink-500">
                <User size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Edit Profile</h2>
                <p className="text-xs text-gray-400">Update your personal information</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors group"
              aria-label="Close"
            >
              <X size={20} className="text-gray-400 transition-colors group-hover:text-white" />
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-[#2a2a2a] px-6 bg-[#1a1a1a]">
            <div className="flex gap-1 py-2 overflow-x-auto scrollbar-hide">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-[#2a2a2a]'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {/* Basic Info Tab */}
            {activeTab === 'basic' && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* Profile Picture */}
                <div className="flex flex-col items-center gap-4 pb-6 border-b border-[#2a2a2a]">
                  <div className="relative group">
                    <div className="flex items-center justify-center text-3xl font-bold text-white rounded-full shadow-xl w-28 h-28 bg-gradient-to-br from-orange-500 to-pink-500">
                      {formData.name.charAt(0).toUpperCase()}
                    </div>
                    <button 
                      aria-label="Upload profile picture"
                      className="absolute bottom-0 right-0 p-3 transition-all bg-orange-500 rounded-full shadow-lg hover:bg-orange-600 group-hover:scale-110"
                    >
                      <Upload size={18} className="text-white" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-400">Click to upload profile picture</p>
                </div>

                {/* Form Grid */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                      <User size={14} className="text-orange-500" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                      <Mail size={14} className="text-orange-500" />
                      Email ID
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="your@email.com"
                    />
                  </div>

                  {/* Mobile Number */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                      <Phone size={14} className="text-orange-500" />
                      Mobile Number
                    </label>
                    <div className="flex gap-2">
                      <select
                        name="countryCode"
                        aria-label="Country Code"
                        value={formData.countryCode}
                        onChange={(e) => setFormData(prev => ({ ...prev, countryCode: e.target.value }))}
                        className="w-24 px-3 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      >
                        <option value="+91">IN +91</option>
                        <option value="+1">US +1</option>
                        <option value="+44">UK +44</option>
                        <option value="+61">AU +61</option>
                        <option value="+971">UAE +971</option>
                        <option value="+65">SG +65</option>
                        <option value="+49">DE +49</option>
                        <option value="+33">FR +33</option>
                        <option value="+81">JP +81</option>
                        <option value="+86">CN +86</option>
                      </select>
                      <input
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleInputChange}
                        className="flex-1 px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        placeholder="82207 53024"
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                      <MapPin size={14} className="text-orange-500" />
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="City, Country"
                    />
                  </div>

                  {/* University */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                      <School size={14} className="text-orange-500" />
                      University/College
                    </label>
                    <input
                      type="text"
                      name="university"
                      value={formData.university}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="Enter your institution"
                    />
                  </div>

                  {/* Education Year */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                      <Calendar size={14} className="text-orange-500" />
                      Education Year (Graduation)
                    </label>
                    <select
                      name="educationYear"
                      aria-label="Education Year"
                      value={formData.educationYear}
                      onChange={(e) => setFormData(prev => ({ ...prev, educationYear: e.target.value }))}
                      className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    >
                      <option value="">Select Year</option>
                      <option value="2024">2024</option>
                      <option value="2025">2025</option>
                      <option value="2026">2026</option>
                      <option value="2027">2027</option>
                      <option value="2028">2028</option>
                      <option value="2029">2029</option>
                      <option value="2030">2030</option>
                    </select>
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                    <Edit2 size={14} className="text-orange-500" />
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </motion.div>
            )}

            {/* Social Links Tab */}
            {activeTab === 'social' && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-5"
              >
                <p className="mb-6 text-sm text-gray-400">Connect your social profiles to showcase your online presence</p>
                
                {/* LinkedIn */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                    <Linkedin size={16} className="text-[#0077b5]" />
                    LinkedIn
                  </label>
                  <div className="relative">
                    <span className="absolute text-sm text-gray-500 -translate-y-1/2 left-4 top-1/2">linkedin.com/in/</span>
                    <input
                      type="text"
                      value={formData.socialLinks.linkedin || ''}
                      onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                      className="w-full pl-36 pr-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0077b5] focus:border-transparent transition-all"
                      placeholder="your-profile"
                    />
                  </div>
                </div>

                {/* GitHub */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                    <Github size={16} className="text-white" />
                    GitHub
                  </label>
                  <div className="relative">
                    <span className="absolute text-sm text-gray-500 -translate-y-1/2 left-4 top-1/2">github.com/</span>
                    <input
                      type="text"
                      value={formData.socialLinks.github || ''}
                      onChange={(e) => handleSocialLinkChange('github', e.target.value)}
                      className="w-full pl-28 pr-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                      placeholder="username"
                    />
                  </div>
                </div>

                {/* Twitter */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                    <Twitter size={16} className="text-[#1DA1F2]" />
                    Twitter / X
                  </label>
                  <div className="relative">
                    <span className="absolute text-sm text-gray-500 -translate-y-1/2 left-4 top-1/2">twitter.com/</span>
                    <input
                      type="text"
                      value={formData.socialLinks.twitter || ''}
                      onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                      className="w-full pl-28 pr-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1DA1F2] focus:border-transparent transition-all"
                      placeholder="handle"
                    />
                  </div>
                </div>

                {/* Website */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                    <Globe size={16} className="text-green-500" />
                    Others / Personal Website
                  </label>
                  <input
                    type="url"
                    value={formData.socialLinks.website || ''}
                    onChange={(e) => handleSocialLinkChange('website', e.target.value)}
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="https://yourwebsite.com"
                  />
                </div>

                {/* Resume */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                    <FileText size={16} className="text-purple-500" />
                    Resume URL
                  </label>
                  <input
                    type="url"
                    value={formData.socialLinks.resume || ''}
                    onChange={(e) => handleSocialLinkChange('resume', e.target.value)}
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="https://drive.google.com/your-resume"
                  />
                </div>
              </motion.div>
            )}

            {/* Skills Tab */}
            {activeTab === 'skills' && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <p className="text-sm text-gray-400">Add your technical skills and expertise</p>
                
                {/* Add Skill Input */}
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                    className="flex-1 px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="Type a skill and press Enter"
                  />
                  <button
                    onClick={addSkill}
                    className="flex items-center gap-2 px-5 py-3 font-medium text-white transition-all bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-xl"
                  >
                    <Plus size={18} />
                    Add
                  </button>
                </div>

                {/* Skills List */}
                <div className="flex flex-wrap gap-2">
                  <AnimatePresence>
                    {formData.skills.map((skill) => (
                      <motion.span
                        key={skill}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="group flex items-center gap-2 px-4 py-2 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] text-sm text-white hover:border-orange-500 transition-all"
                      >
                        {skill}
                        <button
                          onClick={() => removeSkill(skill)}
                          aria-label={`Remove ${skill}`}
                          className="p-0.5 rounded-full hover:bg-red-500/20 transition-colors"
                        >
                          <X size={14} className="text-gray-400 hover:text-red-500" />
                        </button>
                      </motion.span>
                    ))}
                  </AnimatePresence>
                </div>

                {formData.skills.length === 0 && (
                  <div className="py-8 text-center text-gray-500">
                    <Code size={48} className="mx-auto mb-3 opacity-50" />
                    <p>No skills added yet</p>
                    <p className="text-sm">Start adding your technical skills above</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Projects Tab */}
            {activeTab === 'projects' && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-400">Showcase your best work</p>
                  <button
                    onClick={() => setShowAddProject(true)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-all bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-xl"
                  >
                    <Plus size={16} />
                    Add Project
                  </button>
                </div>

                {/* Add New Project Form */}
                <AnimatePresence>
                  {showAddProject && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5 space-y-4">
                        <h4 className="flex items-center gap-2 font-semibold text-white">
                          <Briefcase size={16} className="text-orange-500" />
                          New Project
                        </h4>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <input
                            type="text"
                            value={newProject.name}
                            onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                            className="px-4 py-3 bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                            placeholder="Project Name"
                          />
                          <input
                            type="url"
                            value={newProject.url || ''}
                            onChange={(e) => setNewProject(prev => ({ ...prev, url: e.target.value }))}
                            className="px-4 py-3 bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                            placeholder="Project URL (optional)"
                          />
                        </div>
                        <textarea
                          value={newProject.description}
                          onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                          rows={2}
                          className="w-full px-4 py-3 bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all resize-none"
                          placeholder="Brief description of your project"
                        />
                        
                        {/* Credentials Section */}
                        <div className="border-t border-[#2a2a2a] pt-4">
                          <p className="mb-3 text-xs text-gray-400">Demo Credentials (optional)</p>
                          <div className="grid grid-cols-2 gap-4">
                            <input
                              type="text"
                              value={newProject.credentials?.username || ''}
                              onChange={(e) => setNewProject(prev => ({ 
                                ...prev, 
                                credentials: { ...prev.credentials!, username: e.target.value }
                              }))}
                              className="px-4 py-2.5 bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                              placeholder="Demo Username"
                            />
                            <input
                              type="text"
                              value={newProject.credentials?.password || ''}
                              onChange={(e) => setNewProject(prev => ({ 
                                ...prev, 
                                credentials: { ...prev.credentials!, password: e.target.value }
                              }))}
                              className="px-4 py-2.5 bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                              placeholder="Demo Password"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                          <button
                            onClick={() => setShowAddProject(false)}
                            className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#333] rounded-xl text-sm text-white transition-all"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={addProject}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-all bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-xl"
                          >
                            <Save size={14} />
                            Save Project
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Projects List */}
                <div className="space-y-4">
                  <AnimatePresence>
                    {formData.projects.map((project) => (
                      <motion.div
                        key={project.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5 hover:border-[#3a3a3a] transition-all group"
                      >
                        {editingProject === project.id ? (
                          // Edit Mode
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                              <input
                                type="text"
                                value={project.name}
                                onChange={(e) => updateProject(project.id, { name: e.target.value })}
                                placeholder="Project Name"
                                className="px-4 py-2.5 bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                              />
                              <input
                                type="url"
                                value={project.url || ''}
                                onChange={(e) => updateProject(project.id, { url: e.target.value })}
                                className="px-4 py-2.5 bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                                placeholder="Project URL"
                              />
                            </div>
                            <textarea
                              value={project.description}
                              onChange={(e) => updateProject(project.id, { description: e.target.value })}
                              rows={2}
                              placeholder="Project Description"
                              className="w-full px-4 py-2.5 bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all resize-none"
                            />
                            <div className="grid grid-cols-2 gap-4">
                              <input
                                type="text"
                                value={project.credentials?.username || ''}
                                onChange={(e) => updateProject(project.id, { 
                                  credentials: { ...project.credentials!, username: e.target.value }
                                })}
                                className="px-4 py-2 bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                                placeholder="Demo Username"
                              />
                              <input
                                type="text"
                                value={project.credentials?.password || ''}
                                onChange={(e) => updateProject(project.id, { 
                                  credentials: { ...project.credentials!, password: e.target.value }
                                })}
                                className="px-4 py-2 bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                                placeholder="Demo Password"
                              />
                            </div>
                            <div className="flex justify-end">
                              <button
                                onClick={() => setEditingProject(null)}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-all bg-gradient-to-r from-green-500 to-green-600 rounded-xl"
                              >
                                <Save size={14} />
                                Done
                              </button>
                            </div>
                          </div>
                        ) : (
                          // View Mode
                          <>
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500/20 to-pink-500/20">
                                  <Briefcase size={18} className="text-orange-500" />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-white">{project.name}</h4>
                                  {project.url && (
                                    <a 
                                      href={project.url} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-1 text-xs text-blue-400 hover:underline"
                                    >
                                      <ExternalLink size={10} />
                                      {project.url}
                                    </a>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-2 transition-opacity opacity-0 group-hover:opacity-100">
                                <button
                                  onClick={() => setEditingProject(project.id)}
                                  aria-label={`Edit ${project.name}`}
                                  className="p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors"
                                >
                                  <Edit2 size={14} className="text-gray-400 hover:text-white" />
                                </button>
                                <button
                                  onClick={() => deleteProject(project.id)}
                                  aria-label={`Delete ${project.name}`}
                                  className="p-2 transition-colors rounded-lg hover:bg-red-500/20"
                                >
                                  <Trash2 size={14} className="text-gray-400 hover:text-red-500" />
                                </button>
                              </div>
                            </div>
                            <p className="mb-3 text-sm text-gray-400">{project.description}</p>
                            {project.credentials?.username && (
                              <div className="text-xs text-gray-500 bg-[#0d0d0d] rounded-lg px-3 py-2 inline-block">
                                Demo: {project.credentials.username} / {project.credentials.password}
                              </div>
                            )}
                          </>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {formData.projects.length === 0 && !showAddProject && (
                  <div className="py-8 text-center text-gray-500">
                    <Briefcase size={48} className="mx-auto mb-3 opacity-50" />
                    <p>No projects added yet</p>
                    <p className="text-sm">Click "Add Project" to showcase your work</p>
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="bg-[#1a1a1a] border-t border-[#2a2a2a] px-6 py-4 flex justify-between items-center">
            <p className="text-xs text-gray-500">
              Changes will be saved to your profile
            </p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-[#2a2a2a] hover:bg-[#333] border border-[#3a3a3a] rounded-xl text-white font-medium transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-xl text-white font-semibold transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-orange-500/25"
              >
                {isSaving ? (
                  <>
                    <span className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </span>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EditProfileModal;
