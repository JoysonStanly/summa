import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowLeft, Save } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../components/navigation/Sidebar';

const EditSessionPage: React.FC = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnailUrl: '',
    date: '',
    time: '',
    endTime: '',
    meetLink: '',
    recordedVideoUrl: ''
  });

  // Load session data
  useEffect(() => {
    // Simulate loading session data
    setTimeout(() => {
      // TODO: Replace with actual API call
      setFormData({
        title: 'Amazon Interview Experience with Mridul SDE-1',
        description: '',
        thumbnailUrl: '',
        date: '2025-12-26',
        time: '18:00',
        endTime: '19:30',
        meetLink: 'https://meet.google.com/abc-defg-hij',
        recordedVideoUrl: ''
      });
      setIsLoading(false);
    }, 500);
  }, [sessionId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim() || !formData.date || !formData.time || !formData.endTime) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate end time is after start time
    if (formData.time && formData.endTime && formData.time >= formData.endTime) {
      alert('End time must be after start time');
      return;
    }

    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      console.log('Updating session:', formData);
      alert('Session updated successfully!');
      setIsSaving(false);
      navigate('/admin/sessions');
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex">
      <Sidebar />
      <div className="flex-1 ml-20">
        <div className="max-w-[1200px] mx-auto px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link
              to="/admin/sessions"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Sessions
            </Link>
            <div className="flex items-center gap-3">
              <Calendar size={32} className="text-purple-400" />
              <h1 className="text-3xl font-bold">Edit Session</h1>
            </div>
            <p className="text-gray-400 mt-2">Update session details and add recorded video</p>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-2">
                  Session Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Amazon Interview Experience with Mridul SDE-1"
                  className="w-full px-4 py-3 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-2">
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe what will be covered in this session... (optional)"
                  rows={4}
                  className="w-full px-4 py-3 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 resize-none"
                />
              </div>

              {/* Thumbnail Image URL */}
              <div>
                <label htmlFor="thumbnailUrl" className="block text-sm font-medium mb-2">
                  Thumbnail Image URL
                </label>
                <input
                  id="thumbnailUrl"
                  name="thumbnailUrl"
                  type="url"
                  value={formData.thumbnailUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
                />
                <p className="text-xs text-gray-500 mt-1">Recommended size: 1200x630px for best display</p>
                {formData.thumbnailUrl && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-2">Image Preview:</p>
                    <div className="relative w-full max-w-md h-40 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg overflow-hidden">
                      <img
                        src={formData.thumbnailUrl}
                        alt="Thumbnail preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.parentElement!.innerHTML = '<div class="flex items-center justify-center h-full text-red-400 text-sm">Invalid image URL</div>';
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Date */}
                <div>
                  <label htmlFor="date" className="block text-sm font-medium mb-2">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>

                {/* Start Time */}
                <div>
                  <label htmlFor="time" className="block text-sm font-medium mb-2">
                    Start Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="time"
                    name="time"
                    type="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>

                {/* End Time */}
                <div className="md:col-span-2">
                  <label htmlFor="endTime" className="block text-sm font-medium mb-2">
                    End Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="endTime"
                    name="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-orange-500"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Session duration will be calculated automatically</p>
                </div>
              </div>

              {/* Meet Link */}
              <div>
                <label htmlFor="meetLink" className="block text-sm font-medium mb-2">
                  Meeting Link (Optional)
                </label>
                <input
                  id="meetLink"
                  name="meetLink"
                  type="url"
                  value={formData.meetLink}
                  onChange={handleChange}
                  placeholder="https://meet.google.com/abc-defg-hij"
                  className="w-full px-4 py-3 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
                />
                <p className="text-xs text-gray-500 mt-1">Link for live session attendance</p>
              </div>

              {/* Recorded Video URL */}
              <div>
                <label htmlFor="recordedVideoUrl" className="block text-sm font-medium mb-2">
                  Recorded Video URL (Optional)
                </label>
                <input
                  id="recordedVideoUrl"
                  name="recordedVideoUrl"
                  type="url"
                  value={formData.recordedVideoUrl}
                  onChange={handleChange}
                  placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                  className="w-full px-4 py-3 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
                />
                <p className="text-xs text-gray-500 mt-1">Add recorded video link after the live session ends (YouTube, Vimeo, etc.)</p>
              </div>

              {/* Preview */}
              {formData.title && (
                <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg p-6">
                  <p className="text-xs text-gray-500 mb-3">Session Preview</p>
                  <div className="flex flex-col md:flex-row gap-4">
                    {formData.thumbnailUrl && (
                      <div className="w-full md:w-48 h-32 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={formData.thumbnailUrl}
                          alt="Thumbnail"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-1">{formData.title}</h3>
                      {formData.date && (
                        <p className="text-sm text-gray-400">
                          {new Date(formData.date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </p>
                      )}
                      {(formData.time && formData.endTime) && (
                        <p className="text-sm text-gray-400 mb-3">
                          {formData.time} - {formData.endTime}
                        </p>
                      )}
                      {formData.description && <p className="text-sm text-gray-400 mb-3">{formData.description}</p>}
                      {formData.recordedVideoUrl && (
                        <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/10 border border-green-500/30 rounded text-green-400 text-xs">
                          🎥 Recorded video available
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 px-8 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
                >
                  {isSaving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      Update Session
                    </>
                  )}
                </button>
                <Link
                  to="/admin/sessions"
                  className="px-8 py-3 bg-[#0f0f0f] border border-[#2a2a2a] hover:border-orange-500/50 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EditSessionPage;
