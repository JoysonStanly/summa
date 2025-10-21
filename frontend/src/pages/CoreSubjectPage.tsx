import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Bot } from "lucide-react";
import CoreSubjectSidebar from "../components/navigation/CoreSubjectSidebar";
import { VideoPlayer, SlideViewer, NotesEditor } from "../components/core-subject";
import { findTopicByPath, findModuleByPath, operatingSystemData } from "../data/operatingSystem";
import type { Topic, Module } from "../data/operatingSystem";

const CoreSubjectPage = () => {
  const { subjectId, moduleId, topicId } = useParams<{
    subjectId: string;
    moduleId: string;
    topicId: string;
  }>();
  
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'about' | 'notes' | 'ai'>('about');
  const [isTheoryView, setIsTheoryView] = useState(false);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [module, setModule] = useState<Module | null>(null);

  // Default values when no specific topic is provided
  const defaultSubjectId = subjectId || 'operating-system';
  const defaultModuleId = moduleId || 'basics-of-operating-systems';
  const defaultTopicId = topicId || 'operating-system-introduction';

  useEffect(() => {
    if (subjectId === 'operating-system' && (!moduleId || !topicId)) {
      navigate('/operating-system/basics-of-operating-systems/operating-system-introduction', { replace: true });
      return;
    }

    const foundTopic = findTopicByPath(defaultSubjectId, defaultModuleId, defaultTopicId);
    const foundModule = findModuleByPath(defaultSubjectId, defaultModuleId);
    
    if (foundTopic && foundModule) {
      setTopic(foundTopic);
      setModule(foundModule);
    } else if (subjectId === 'operating-system') {
      navigate('/operating-system/basics-of-operating-systems/operating-system-introduction', { replace: true });
    }
  }, [subjectId, moduleId, topicId, navigate, defaultSubjectId, defaultModuleId, defaultTopicId]);

  if (!topic || !module) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-white">Topic Not Found</h1>
          <p className="mb-6 text-gray-400">The requested topic could not be found.</p>
          <button
            onClick={() => navigate('/operating-system/basics-of-operating-systems/operating-system-introduction')}
            className="px-6 py-3 text-white transition-colors bg-orange-500 rounded-lg hover:bg-orange-600"
          >
            Go to OS Introduction
          </button>
        </div>
      </div>
    );
  }

  const handleMarkComplete = (completed: boolean) => {
    console.log(`Marking topic ${defaultTopicId} as ${completed ? 'completed' : 'incomplete'}`);
  };

  const handleNavigation = (direction: 'previous' | 'next') => {
    const currentModule = operatingSystemData.modules.find(m => m.id === defaultModuleId);
    if (!currentModule) return;

    const currentTopicIndex = currentModule.topics.findIndex(t => t.id === defaultTopicId);
    if (currentTopicIndex === -1) return;

    let nextTopic: Topic | null = null;
    let nextModuleId = defaultModuleId;

    if (direction === 'next') {
      if (currentTopicIndex < currentModule.topics.length - 1) {
        nextTopic = currentModule.topics[currentTopicIndex + 1];
      } else {
        const currentModuleIndex = operatingSystemData.modules.findIndex(m => m.id === defaultModuleId);
        if (currentModuleIndex < operatingSystemData.modules.length - 1) {
          const nextModule = operatingSystemData.modules[currentModuleIndex + 1];
          nextTopic = nextModule.topics[0];
          nextModuleId = nextModule.id;
        }
      }
    } else {
      if (currentTopicIndex > 0) {
        nextTopic = currentModule.topics[currentTopicIndex - 1];
      } else {
        const currentModuleIndex = operatingSystemData.modules.findIndex(m => m.id === defaultModuleId);
        if (currentModuleIndex > 0) {
          const prevModule = operatingSystemData.modules[currentModuleIndex - 1];
          nextTopic = prevModule.topics[prevModule.topics.length - 1];
          nextModuleId = prevModule.id;
        }
      }
    }

    if (nextTopic) {
      navigate(`/operating-system/${nextModuleId}/${nextTopic.id}`);
    }
  };

  const canNavigatePrevious = () => {
    const currentModuleIndex = operatingSystemData.modules.findIndex(m => m.id === defaultModuleId);
    const currentTopicIndex = module?.topics.findIndex(t => t.id === defaultTopicId) ?? -1;
    return currentModuleIndex > 0 || currentTopicIndex > 0;
  };

  const canNavigateNext = () => {
    const currentModuleIndex = operatingSystemData.modules.findIndex(m => m.id === defaultModuleId);
    const currentTopicIndex = module?.topics.findIndex(t => t.id === defaultTopicId) ?? -1;
    const isLastModule = currentModuleIndex === operatingSystemData.modules.length - 1;
    const isLastTopic = currentTopicIndex === (module?.topics.length ?? 0) - 1;
    return !(isLastModule && isLastTopic);
  };

  return (
    <div className="flex min-h-screen bg-gray-900">
      {/* Sidebar */}
      <CoreSubjectSidebar activeModuleId={defaultModuleId} activeTopicId={defaultTopicId} />

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Video Area */}
        <div className="flex-1 p-8">
          <VideoPlayer
            title={topic.title}
            isCompleted={topic.status === 'completed'}
            onMarkComplete={handleMarkComplete}
            onPrevious={() => handleNavigation('previous')}
            onNext={() => handleNavigation('next')}
            hasPrevious={canNavigatePrevious()}
            hasNext={canNavigateNext()}
          />
        </div>

        {/* Right Panel */}
        <div className="flex flex-col h-screen border-l border-gray-800 w-96">
          {/* Tabs */}
          <div className="border-b border-gray-800">
            <div className="flex">
              <button
                onClick={() => setActiveTab('about')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === 'about'
                    ? 'text-orange-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                About
                {activeTab === 'about' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-400" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === 'notes'
                    ? 'text-orange-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Notes
                {activeTab === 'notes' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-400" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('ai')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === 'ai'
                    ? 'text-orange-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-center gap-1">
                  <Bot className="w-4 h-4" />
                  <span>AI</span>
                </div>
                {activeTab === 'ai' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-400" />
                )}
              </button>
              <button
                onClick={() => setIsTheoryView(!isTheoryView)}
                className="flex items-center px-4 py-3 text-gray-400 transition-colors hover:text-white"
                title="Toggle Theory View"
              >
                <span className="mr-1 text-xs">Theory View</span>
                <div className={`w-8 h-4 rounded-full transition-colors ${isTheoryView ? 'bg-orange-500' : 'bg-gray-600'} relative`}>
                  <div className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-transform ${isTheoryView ? 'translate-x-4' : 'translate-x-0.5'}`} />
                </div>
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {activeTab === 'about' && (
                <div>
                  <SlideViewer slides={topic.slides} />
                  <div className="mt-6 space-y-4">
                    <h3 className="text-xl font-bold text-white">{topic.title}</h3>
                    <div className="leading-relaxed text-gray-300">
                      <p>
                        An <strong className="text-white">Operating System (OS)</strong> is the{' '}
                        <span className="text-blue-400 underline cursor-pointer">core software</span>{' '}
                        that manages all the hardware and software resources in a computer system.
                      </p>
                      <p className="mt-4">
                        <strong className="text-white">Real-Life Analogy:</strong> Think of an OS like the event coordinator at a big concert:
                      </p>
                      <p className="mt-2">
                        The coordinator (OS) ensures that each performer (application) has the required resources.
                      </p>
                      <p className="mt-2">
                        They also manage the crowd flow (CPU and memory) to prevent chaos.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'notes' && (
                <NotesEditor 
                  topicId={topic.id} 
                  initialNotes={localStorage.getItem(`notes-${topic.id}`) || ''} 
                />
              )}
              
              {activeTab === 'ai' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Bot className="w-5 h-5 text-orange-400" />
                    <h3 className="text-lg font-semibold text-white">AI Assistant</h3>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4 text-center">
                    <Bot className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-400 mb-4">
                      Ask me anything about {topic.title}
                    </p>
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Ask a question..."
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
                      />
                      <button className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                        Ask AI
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom AI Chat - replacing Discussion */}
          <div className="h-40 p-4 overflow-y-auto border-t border-gray-800">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-orange-400" />
                <span className="text-sm font-medium text-white">Quick AI Help</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask a doubt..."
                  className="flex-1 p-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:border-orange-500"
                />
                <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm">
                  Ask
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoreSubjectPage;
