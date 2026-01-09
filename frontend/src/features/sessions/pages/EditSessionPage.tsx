import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Sidebar from "@/shared/components/layout/Sidebar";
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { sessionService } from '@/features/sessions/services/sessionService';
import { useToast } from '@/shared/hooks/ToastContext';

const EditSessionPage: React.FC = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { success: toastSuccess, error: toastError } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    thumbnailUrl: '',
    date: '',
    time: '',
    endTime: '',
    meetLink: '',
    recordedVideoUrl: ''
  });

  // Load session data from API
  useEffect(() => {
    const loadSession = async () => {
      if (!sessionId) {
        toastError('Session ID not found');
        navigate('/admin/sessions');
        return;
      }

      try {
        setIsLoading(true);
        const session = await sessionService.getSession(sessionId);
        
        // Parse timeRange to extract start and end times
        let startTime = '00:00';
        let endTime = '00:00';
        if ((session as any).timeRange) {
          // Parse timeRange string like "14:00 - 16:00"
          const timeRangeParts = (session as any).timeRange.split('-').map((t: string) => t.trim());
          if (timeRangeParts.length === 2) {
            startTime = timeRangeParts[0];
            endTime = timeRangeParts[1];
          }
        } else if ((session as any).startTime && (session as any).endTime) {
          startTime = (session as any).startTime;
          endTime = (session as any).endTime;
        }
        
        setFormData({
          title: session.title,
          thumbnailUrl: (session as any).thumbnailUrl || '',
          date: session.date.split('T')[0], // Extract date part
          time: startTime,
          endTime: endTime,
          meetLink: session.meetingLink || (session as any).meetLink || '',
          recordedVideoUrl: (session as any).videoRecordingUrl || ''
        });
      } catch (err: any) {
        console.error('Error loading session:', err);
        toastError(err.message || 'Failed to load session');
        navigate('/admin/sessions');
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, [sessionId, navigate, toastError]);

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
    if (!formData.title.trim() || !formData.date || !formData.time || !formData.endTime || !formData.meetLink.trim()) {
      setError('Please fill in all required fields (Title, Date, Times, and Meet Link are required)');
      toastError('Please fill in all required fields');
      return;
    }

    // Validate end time is after start time
    if (formData.time && formData.endTime && formData.time >= formData.endTime) {
      setError('End time must be after start time');
      toastError('End time must be after start time');
      return;
    }

    if (!sessionId) {
      toastError('Session ID not found');
      return;
    }

    setIsSaving(true);
    setError(null);
    
    try {
      // Calculate duration in minutes
      const [startHour, startMin] = formData.time.split(':').map(Number);
      const [endHour, endMin] = formData.endTime.split(':').map(Number);
      const duration = (endHour * 60 + endMin) - (startHour * 60 + startMin);

      // Prepare session data for API matching backend model
      const sessionData = {
        title: formData.title,
        description: 'Session details', // Default description
        category: 'workshop', // Default category
        date: formData.date,
        timeRange: `${formData.time} - ${formData.endTime}`,
        duration: duration,
        meetLink: formData.meetLink,
        thumbnailUrl: formData.thumbnailUrl || '',
        videoRecordingUrl: formData.recordedVideoUrl || '',
        maxParticipants: 100,
        tags: ['session'],
        isLive: false
      };

      await sessionService.updateSession(sessionId, sessionData as any);
      
      // Success - show toast and navigate back
      toastSuccess('Session updated successfully!');
      navigate('/admin/sessions');
    } catch (err: any) {
      console.error('Error updating session:', err);
      const errorMessage = err.message || 'Failed to update session. Please try again.';
      setError(errorMessage);
      toastError(errorMessage);
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center">
        <LoadingSpinner />
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
              className="inline-flex items-center gap-2 mb-4 text-gray-400 transition-colors hover:text-white"
            >
              <ArrowLeft size={20} />
              Back to Sessions
            </Link>
            <div className="flex items-center gap-3">
              <Calendar size={32} className="text-purple-400" />
              <h1 className="text-3xl font-bold">Edit Session</h1>
            </div>
            <p className="mt-2 text-gray-400">Update session details and add recorded video</p>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-8"
          >
            {/* Error Message */}
            {error && (
              <div className="p-4 mb-6 border rounded-lg bg-red-500/10 border-red-500/30">
                <div className="flex items-center gap-3">
                  <AlertCircle size={20} className="flex-shrink-0 text-red-400" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block mb-2 text-sm font-medium">
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

              {/* Thumbnail Image URL */}
              <div>
                <label htmlFor="thumbnailUrl" className="block mb-2 text-sm font-medium">
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
                <p className="mt-1 text-xs text-gray-500">Recommended size: 1200x630px for best display</p>
                {formData.thumbnailUrl && (
                  <div className="mt-3">
                    <p className="mb-2 text-xs text-gray-500">Image Preview:</p>
                    <div className="relative w-full max-w-md h-40 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg overflow-hidden">
                      <img
                        src={formData.thumbnailUrl}
                        alt="Thumbnail preview"
                        className="object-cover w-full h-full"
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

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Date */}
                <div>
                  <label htmlFor="date" className="block mb-2 text-sm font-medium">
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
                  <label htmlFor="time" className="block mb-2 text-sm font-medium">
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
                  <label htmlFor="endTime" className="block mb-2 text-sm font-medium">
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
                  <p className="mt-1 text-xs text-gray-500">Session duration will be calculated automatically</p>
                </div>
              </div>

              {/* Meet Link */}
              <div>
                <label htmlFor="meetLink" className="block mb-2 text-sm font-medium">
                  Meeting Link <span className="text-red-500">*</span>
                </label>
                <input
                  id="meetLink"
                  name="meetLink"
                  type="url"
                  value={formData.meetLink}
                  onChange={handleChange}
                  placeholder="https://meet.google.com/abc-defg-hij"
                  className="w-full px-4 py-3 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">Google Meet, Zoom, or other video conferencing link</p>
              </div>

              {/* Recorded Video URL */}
              <div>
                <label htmlFor="recordedVideoUrl" className="block mb-2 text-sm font-medium">
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
                <p className="mt-1 text-xs text-gray-500">Add recorded video link after the live session ends (YouTube, Vimeo, etc.)</p>
              </div>

              {/* Preview */}
              {formData.title && (
                <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg p-6">
                  <p className="mb-3 text-xs text-gray-500">Session Preview</p>
                  <div className="flex flex-col gap-4 md:flex-row">
                    {formData.thumbnailUrl && (
                      <div className="w-full md:w-48 h-32 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={formData.thumbnailUrl}
                          alt="Thumbnail"
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="mb-1 text-xl font-semibold">{formData.title}</h3>
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
                        <p className="mb-3 text-sm text-gray-400">
                          {formData.time} - {formData.endTime}
                        </p>
                      )}
                      {formData.description && <p className="mb-3 text-sm text-gray-400">{formData.description}</p>}
                      {formData.recordedVideoUrl && (
                        <div className="inline-flex items-center gap-1 px-2 py-1 text-xs text-green-400 border rounded bg-green-500/10 border-green-500/30">
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
                  className="flex items-center gap-2 px-8 py-3 font-semibold transition-colors bg-orange-500 rounded-lg hover:bg-orange-600 disabled:bg-gray-700 disabled:cursor-not-allowed"
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
