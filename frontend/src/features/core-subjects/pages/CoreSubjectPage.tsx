import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Split from 'react-split';
import { 
  ThumbsUp, 
  ThumbsDown, 
  ArrowLeft, 
  ArrowRight, 
  MessageSquare,
  ChevronDown,
  MoreVertical,
  Play,
  Pause,
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import UnifiedSidebar from "@/shared/components/layout/UnifiedSidebar";
import { findTopicByPath, findModuleByPath, getSubjectData, getDefaultRoute } from "../data/subjects";
import type { Topic, Module, Subject } from "../data/subjects";
import { subjectService } from '../services/subjectService';

const CoreSubjectPage: React.FC = () => {
  const { subjectId, moduleId, topicId } = useParams<{
    subjectId: string;
    moduleId: string;
    topicId: string;
  }>();
  
  const navigate = useNavigate();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [module, setModule] = useState<Module | null>(null);
  const [subject, setSubject] = useState<Subject | null>(null);
  const [activeTab, setActiveTab] = useState('about');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isStudyView, setIsStudyView] = useState(false);
  const [loading, setLoading] = useState(false);

  // Try to fetch subject from API, fallback to static data
  useEffect(() => {
    const fetchSubject = async () => {
      if (!subjectId) return;
      try {
        setLoading(true);
        const apiSubject = await subjectService.getSubjectByCode(subjectId);
        if (apiSubject) {
          console.log('Using API subject data:', apiSubject);
        }
      } catch (error) {
        console.log('Using static subject data');
      } finally {
        setLoading(false);
      }
    };
    fetchSubject();
  }, [subjectId]);

  useEffect(() => {
    if (!subjectId) return;

    const subjectData = getSubjectData(subjectId);
    if (!subjectData) {
      navigate('/operating-system/basics-of-operating-systems/operating-system-introduction', { replace: true });
      return;
    }

    setSubject(subjectData);

    // If no module or topic is provided, redirect to default
    if (!moduleId || !topicId) {
      const defaultRoute = getDefaultRoute(subjectId);
      if (defaultRoute) {
        navigate(`/${subjectId}/${defaultRoute.moduleId}/${defaultRoute.topicId}`, { replace: true });
      }
      return;
    }

    const foundTopic = findTopicByPath(subjectId, moduleId, topicId);
    const foundModule = findModuleByPath(subjectId, moduleId);
    
    if (foundTopic && foundModule) {
      setTopic(foundTopic);
      setModule(foundModule);
    } else {
      // Redirect to default route for this subject
      const defaultRoute = getDefaultRoute(subjectId);
      if (defaultRoute) {
        navigate(`/${subjectId}/${defaultRoute.moduleId}/${defaultRoute.topicId}`, { replace: true });
      }
    }
  }, [subjectId, moduleId, topicId, navigate]);

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

  const carouselImages = [
    'https://static.takeuforward.org/premium///OS_P1_OperatingSystem_and_MainFunctions_2.jpg-DFnp6oj3',
    'https://static.takeuforward.org/premium///OS_P1_OperatingSystem_and_MainFunctions_3.jpg-jJiazdQl',
    'https://static.takeuforward.org/premium///OS_P1_OperatingSystem_and_MainFunctions_4.jpg-_rwblDCr',
    'https://static.takeuforward.org/premium///OS_P1_OperatingSystem_and_MainFunctions_5.jpg-gK3zf7d1',
    'https://static.takeuforward.org/premium///OS_P1_OperatingSystem_and_MainFunctions_6.jpg-ytYzht0m',
    'https://static.takeuforward.org/premium///OS_P1_OperatingSystem_and_MainFunctions_7.jpg-k022fLsK',
    'https://static.takeuforward.org/premium///OS_P1_OperatingSystem_and_MainFunctions_8.jpg-lQzQ0k9g',
    'https://static.takeuforward.org/premium///OS_P1_OperatingSystem_and_MainFunctions_9.jpg-aZ545Z0e'
  ];

  const handleMarkComplete = (completed: boolean) => {
    console.log(`Marking topic ${topicId} as ${completed ? 'completed' : 'incomplete'}`);
  };

  const handleNavigation = (direction: 'previous' | 'next') => {
    if (!subject || !moduleId || !topicId) return;
    
    const currentModule = subject.modules.find(m => m.id === moduleId);
    if (!currentModule) return;

    const currentTopicIndex = currentModule.topics.findIndex(t => t.id === topicId);
    if (currentTopicIndex === -1) return;

    let nextTopic: Topic | null = null;
    let nextModuleId = moduleId;

    if (direction === 'next') {
      if (currentTopicIndex < currentModule.topics.length - 1) {
        nextTopic = currentModule.topics[currentTopicIndex + 1];
      } else {
        const currentModuleIndex = subject.modules.findIndex(m => m.id === moduleId);
        if (currentModuleIndex < subject.modules.length - 1) {
          const nextModule = subject.modules[currentModuleIndex + 1];
          nextTopic = nextModule.topics[0];
          nextModuleId = nextModule.id;
        }
      }
    } else {
      if (currentTopicIndex > 0) {
        nextTopic = currentModule.topics[currentTopicIndex - 1];
      } else {
        const currentModuleIndex = subject.modules.findIndex(m => m.id === moduleId);
        if (currentModuleIndex > 0) {
          const prevModule = subject.modules[currentModuleIndex - 1];
          nextTopic = prevModule.topics[prevModule.topics.length - 1];
          nextModuleId = prevModule.id;
        }
      }
    }

    if (nextTopic && subjectId) {
      navigate(`/${subjectId}/${nextModuleId}/${nextTopic.id}`);
    }
  };

  const canNavigatePrevious = () => {
    if (!subject || !moduleId || !topicId) return false;
    const currentModuleIndex = subject.modules.findIndex(m => m.id === moduleId);
    const currentTopicIndex = module?.topics.findIndex(t => t.id === topicId) ?? -1;
    return currentModuleIndex > 0 || currentTopicIndex > 0;
  };

  const canNavigateNext = () => {
    if (!subject || !moduleId || !topicId) return false;
    const currentModuleIndex = subject.modules.findIndex(m => m.id === moduleId);
    const currentTopicIndex = module?.topics.findIndex(t => t.id === topicId) ?? -1;
    const isLastModule = currentModuleIndex === subject.modules.length - 1;
    const isLastTopic = currentTopicIndex === (module?.topics.length ?? 0) - 1;
    return !(isLastModule && isLastTopic);
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : carouselImages.length - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev < carouselImages.length - 1 ? prev + 1 : 0));
  };

  return (
    <>
      <style>{`
        .carousel-container {
          position: relative;
          overflow: hidden;
          border-radius: 12px;
          background: #1a1a1a;
          height: 280px;
        }
        .carousel {
          display: flex;
          transition: transform 0.3s ease;
          height: 100%;
        }
        .carousel-image {
          min-width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
        }
        .carousel-image img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          border-radius: 12px;
        }
        .control-container {
          position: absolute;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(0, 0, 0, 0.7);
          padding: 8px 16px;
          border-radius: 24px;
        }
        .control-container-2 {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .control-buttons {
          display: flex;
          gap: 4px;
        }
        .image-carousel-arrow, .image-carousel-control-button {
          padding: 4px;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: white;
          cursor: pointer;
          transition: background 0.2s;
        }
        .image-carousel-arrow:hover, .image-carousel-control-button:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        .img-number {
          color: white;
          font-size: 14px;
          min-width: 40px;
          text-align: center;
        }
        .vertical-view {
          display: none;
          flex-direction: column;
          gap: 16px;
          width: 100%;
        }
        .vertical-view img {
          width: 100%;
          height: auto;
          border-radius: 12px;
        }
        .no-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      
      <style>{`
        .split {
          display: flex;
          flex-direction: row;
          gap: 0;
        }
        .gutter {
          background-color: #2a2a2a;
          background-repeat: no-repeat;
          background-position: 50%;
          cursor: col-resize;
          position: relative;
          transition: all 0.2s ease;
          border-left: 1px solid #3a3a3a;
          border-right: 1px solid #3a3a3a;
        }
        .gutter::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 3px;
          height: 40px;
          background: linear-gradient(to bottom, transparent, #666, transparent);
          border-radius: 2px;
          opacity: 0.5;
          transition: opacity 0.2s ease;
        }
        .gutter:hover {
          background-color: #f97316;
          border-color: #f97316;
        }
        .gutter:hover::before {
          opacity: 1;
          background: linear-gradient(to bottom, transparent, #fff, transparent);
        }
        .gutter.gutter-horizontal {
          cursor: col-resize;
          width: 8px !important;
        }
        .gutter:active {
          background-color: #fb923c;
        }
      `}</style>
      
      <div className="flex h-screen overflow-hidden bg-background">
        {/* Sidebar - Hidden in Study View */}
        {!isStudyView && subject && (
          <div className="flex-shrink-0">
            <UnifiedSidebar
              title={subject.title}
              categories={subject.modules.map(module => ({
                id: module.id,
                name: module.title,
                topics: module.topics.map(t => ({
                  id: t.id,
                  name: t.title,
                  isCompleted: t.status === 'completed'
                }))
              }))}
              searchPlaceholder={`Search ${subject.title} Topics...`}
              basePath={`/${subjectId}`}
              isActive={(modId, topId) => modId === moduleId && topId === topicId}
            />
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex flex-1 h-screen transition-all duration-300" style={{ marginLeft: '0' }}>
          {/* Normal Mode with Split Layout */}
          {!isStudyView && (
            <Split
              className="split"
              sizes={[58, 42]}
              minSize={[450, 380]}
              gutterSize={8}
              gutterAlign="center"
              snapOffset={30}
              dragInterval={1}
              direction="horizontal"
              cursor="col-resize"
            >
              {/* Left Pane - Video and Discussion */}
              <div className="flex flex-col h-screen overflow-y-auto no-scrollbar bg-background">
                <div className="flex-1">
              
              {/* Title Section */}
              <div className="flex items-center justify-between w-full gap-3 px-6 py-4 bg-gradient-to-b from-sidebar/50 to-transparent border-b border-borders/50">
                <h1 className="relative max-w-lg text-2xl font-bold tracking-tight text-white truncate">
                  {topic.title}
                </h1>
              </div>

              {/* Video Section */}
              <div className="px-6 pt-6 pb-4">
                <div className="w-full">
                  <div className="overflow-hidden rounded-xl shadow-2xl video-iframe ring-1 ring-white/10">
                    <div style={{ paddingTop: '56.25%', position: 'relative' }}>
                      <iframe
                        src="https://app.tpstreams.com/embed/atsjxr/6ASexDGAD8m/?access_token=17ad20dc-4d59-4804-bdc9-e910a47c5e56"
                        style={{
                          border: 0,
                          maxWidth: '100%',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          height: '100%',
                          width: '100%',
                          borderRadius: '8px'
                        }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        frameBorder="0"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Controls Section */}
              <div className="flex items-center justify-between w-full px-6 py-4 mx-4 mt-4 rounded-lg bg-sidebar/30 backdrop-blur-sm border border-borders/50">
                <div className="flex items-center gap-x-4">
                  {/* Like/Dislike Buttons */}
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background/50 hover:bg-background transition-all">
                    <button className="transition-transform hover:scale-110 active:scale-95">
                      <ThumbsUp className="w-5 h-5 transition-all duration-300 ease-in-out stroke-grayText hover:stroke-primary" />
                    </button>
                    <span className="text-sm font-medium text-grayText">189</span>
                  </div>
                  
                  <button className="px-3 py-1.5 rounded-lg bg-background/50 hover:bg-background transition-all active:scale-95">
                    <ThumbsDown className="w-5 h-5 transition-all duration-300 ease-in-out stroke-grayText hover:stroke-red-500" />
                  </button>

                  {/* Navigation Buttons */}
                  <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-background/50">
                    <button
                      onClick={() => handleNavigation('previous')}
                      disabled={!canNavigatePrevious()}
                      className="flex items-center p-2 transition-all rounded-md hover:bg-primary/20 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
                      title="Previous Topic"
                    >
                      <ArrowLeft className="w-5 h-5 stroke-grayText hover:stroke-primary" />
                    </button>

                    <div className="w-px h-6 bg-borders"></div>

                    <button
                      onClick={() => handleNavigation('next')}
                      disabled={!canNavigateNext()}
                      className="flex items-center p-2 transition-all rounded-md hover:bg-primary/20 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
                      title="Next Topic"
                    >
                      <ArrowRight className="w-5 h-5 stroke-grayText hover:stroke-primary" />
                    </button>
                  </div>
                </div>

                {/* Mark as Completed */}
                <label className="flex items-center gap-x-3 px-4 py-2 rounded-lg bg-background/50 hover:bg-background cursor-pointer transition-all group">
                  <input
                    id="markComplete"
                    name="complete"
                    type="checkbox"
                    checked={topic.status === 'completed'}
                    onChange={(e) => handleMarkComplete(e.target.checked)}
                    className="w-5 h-5 rounded cursor-pointer text-primary ring-0 focus:ring-2 focus:ring-primary/50 focus:outline-none transition-all"
                  />
                  <p className="text-sm font-medium text-grayText group-hover:text-white transition-colors">Mark as Completed</p>
                </label>
              </div>

              {/* Discussion Section */}
              <div className="w-full md:block">
                <div className="pt-6">
                  <div className="flex flex-col h-full">
                    <div className="flex-grow">
                      
                      {/* Rich Text Editor for Comments */}
                      <form className="relative flex flex-col p-4 gap-y-7">
                        <div className="quill v2discussion-height">
                          <div className="border rounded-lg bg-sidebar border-borders">
                            <div className="p-3 border-b border-borders">
                              <div className="flex gap-2">
                                <button type="button" className="p-1 rounded hover:bg-background">
                                  <strong>B</strong>
                                </button>
                                <button type="button" className="p-1 italic rounded hover:bg-background">
                                  <em>I</em>
                                </button>
                                <button type="button" className="p-1 underline rounded hover:bg-background">
                                  <u>U</u>
                                </button>
                              </div>
                            </div>
                            <div className="p-4">
                              <textarea
                                placeholder="Ask a Doubt..."
                                className="w-full min-h-[190px] bg-transparent text-white placeholder-grayText resize-none focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="relative items-center justify-end md:flex">
                          <div className="flex items-end justify-end mb-8 gap-x-2">
                            <button
                              type="submit"
                              className="px-4 py-2 mr-4 -mt-0 text-xs transition-colors border rounded cursor-pointer w-fit md:text-base border-primary text-primary hover:bg-primary hover:text-white"
                            >
                              Comment
                            </button>
                          </div>
                        </div>
                      </form>

                      {/* Discussion Tabs */}
                      <div className="flex items-center justify-between mx-4 mt-4 border-b border-borders">
                        <div className="flex flex-row h-12 gap-2 list-none">
                          <div className="flex items-center justify-center px-2 text-base leading-normal border-b-2 cursor-pointer gap-x-2 text-primary border-primary">
                            Community
                          </div>
                          <div className="flex items-center justify-center px-2 text-base leading-normal cursor-pointer gap-x-2 text-grayText">
                            Mine
                          </div>
                        </div>
                        <div className="flex items-center text-grayText">
                          <button className="relative flex items-center justify-between px-4 py-1 border rounded min-w-32 border-borders bg-sidebar">
                            Upvoted
                            <ChevronDown className="w-5 h-5 transition-transform cursor-pointer" />
                          </button>
                        </div>
                      </div>

                      {/* Comments List */}
                      <div className="px-6 mt-4 border-borders">
                        {/* Sample Comments */}
                        <div className="py-4">
                          <div className="flex flex-col">
                            <div className="flex items-center justify-between">
                              <div className="relative flex items-center justify-center gap-2">
                                <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-pink-200 rounded-full">
                                  <span className="font-medium text-gray-600">MV</span>
                                </div>
                                <a className="font-medium text-white" href="#">Munagala Vamsi</a>
                                <span className="text-xs text-grayText">6 months ago</span>
                              </div>
                              <div className="relative cursor-pointer">
                                <button aria-label="Menu options">
                                  <MoreVertical className="w-6 h-6 fill-grayText" />
                                </button>
                              </div>
                            </div>
                            <div className="flex-grow ml-12">
                              <div className="text-white">
                                <p>i don't know why but these core subjects are not good</p>
                                <p><br /></p>
                                <p>except oops module where striver is explaining the concepts but remaining one's are reading the content</p>
                              </div>
                              <div className="flex items-center mt-2 space-x-4 text-white">
                                <button className="flex items-center space-x-1">
                                  <ThumbsUp className="w-6 h-6 stroke-grayText" />
                                  <span>52</span>
                                </button>
                                <button className="flex items-center space-x-1">
                                  <MessageSquare className="w-6 h-6 fill-none stroke-grayText" />
                                  <span>1 replies</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="py-4">
                          <div className="flex flex-col">
                            <div className="flex items-center justify-between">
                              <div className="relative flex items-center justify-center gap-2">
                                <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-green-200 rounded-full">
                                  <span className="font-medium text-gray-600">PS</span>
                                </div>
                                <a className="font-medium text-white" href="#">Pulkit Sinha</a>
                                <span className="text-xs text-grayText">3 months ago</span>
                              </div>
                              <div className="relative cursor-pointer">
                                <button aria-label="Menu options">
                                  <MoreVertical className="w-6 h-6 fill-grayText" />
                                </button>
                              </div>
                            </div>
                            <div className="flex-grow ml-12">
                              <div className="text-white">
                                <p>Hi Striver. It's a humble request to record and upload videos of OS in which you teach us this subject!</p>
                              </div>
                              <div className="flex items-center mt-2 space-x-4 text-white">
                                <button className="flex items-center space-x-1">
                                  <ThumbsUp className="w-6 h-6 stroke-grayText" />
                                  <span>26</span>
                                </button>
                                <button className="flex items-center space-x-1">
                                  <MessageSquare className="w-6 h-6 fill-none stroke-grayText" />
                                  <span>0 replies</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Pane - Theory Content */}
          <div className="flex-shrink-0 h-screen overflow-y-auto border-l-2 border-borders/30 bg-gradient-to-br from-sidebar/20 via-background to-background">
            <div className="flex flex-col h-full">
                
                {/* Tab Navigation */}
                <div className="flex flex-row flex-shrink-0 list-none border-b-2 border-borders/30 backdrop-blur-sm" role="tablist">
                  {/* About Tab */}
                  <div className="flex-auto -mb-px text-center bg-sidebar/50">
                    <span 
                      className={`text-base py-3 px-4 flex gap-x-2 justify-center items-center leading-normal cursor-pointer transition-all duration-200 ${
                        activeTab === 'about' ? 'text-primary border-b-[3px] border-primary bg-primary/5' : 'text-grayText hover:text-white hover:bg-sidebar/70'
                      }`}
                      onClick={() => setActiveTab('about')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M7.50016 15.0013H12.5002C12.7363 15.0013 12.9342 14.9214 13.0939 14.7617C13.2536 14.602 13.3335 14.4041 13.3335 14.168C13.3335 13.9319 13.2536 13.7339 13.0939 13.5742C12.9342 13.4145 12.7363 13.3346 12.5002 13.3346H7.50016C7.26405 13.3346 7.06613 13.4145 6.90641 13.5742C6.74669 13.7339 6.66683 13.9319 6.66683 14.168C6.66683 14.4041 6.74669 14.602 6.90641 14.7617C7.06613 14.9214 7.26405 15.0013 7.50016 15.0013ZM7.50016 11.668H12.5002C12.7363 11.668 12.9342 11.5881 13.0939 11.4284C13.2536 11.2687 13.3335 11.0707 13.3335 10.8346C13.3335 10.5985 13.2536 10.4006 13.0939 10.2409C12.9342 10.0812 12.7363 10.0013 12.5002 10.0013H7.50016C7.26405 10.0013 7.06613 10.0812 6.90641 10.2409C6.74669 10.4006 6.66683 10.5985 6.66683 10.8346C6.66683 11.0707 6.74669 11.2687 6.90641 11.4284C7.06613 11.5881 7.26405 11.668 7.50016 11.668ZM5.00016 18.3346C4.54183 18.3346 4.14947 18.1714 3.82308 17.8451C3.49669 17.5187 3.3335 17.1263 3.3335 16.668V3.33464C3.3335 2.8763 3.49669 2.48394 3.82308 2.15755C4.14947 1.83116 4.54183 1.66797 5.00016 1.66797H10.9793C11.2016 1.66797 11.4134 1.70964 11.6147 1.79297C11.8161 1.8763 11.9932 1.99436 12.146 2.14714L16.1877 6.1888C16.3404 6.34158 16.4585 6.51866 16.5418 6.72005C16.6252 6.92144 16.6668 7.13325 16.6668 7.35547V16.668C16.6668 17.1263 16.5036 17.5187 16.1772 17.8451C15.8509 18.1714 15.4585 18.3346 15.0002 18.3346H5.00016ZM10.8335 6.66797V3.33464H5.00016V16.668H15.0002V7.5013H11.6668C11.4307 7.5013 11.2328 7.42144 11.0731 7.26172C10.9134 7.102 10.8335 6.90408 10.8335 6.66797Z" fill="currentColor" />
                      </svg>
                      <span>About</span>
                    </span>
                  </div>

                  {/* Notes Tab */}
                  <div className="flex-auto -mb-px text-center bg-gray-50 dark:bg-sidebar">
                    <span 
                      className={`text-base py-[10.5px] px-2 flex gap-x-2 justify-center items-center leading-normal cursor-pointer ${
                        activeTab === 'notes' ? 'text-primary border-b-[3px] border-primary' : 'text-grayText'
                      }`}
                      onClick={() => setActiveTab('notes')}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 21V19.35C14 19.2167 14.025 19.0875 14.075 18.9625C14.125 18.8375 14.2 18.725 14.3 18.625L19.525 13.425C19.675 13.275 19.8417 13.1667 20.025 13.1C20.2083 13.0333 20.3917 13 20.575 13C20.775 13 20.9667 13.0375 21.15 13.1125C21.3333 13.1875 21.5 13.3 21.65 13.45L22.575 14.375C22.7083 14.525 22.8125 14.6917 22.8875 14.875C22.9625 15.0583 23 15.2417 23 15.425C23 15.6083 22.9667 15.7958 22.9 15.9875C22.8333 16.1792 22.725 16.35 22.575 16.5L17.375 21.7C17.275 21.8 17.1625 21.875 17.0375 21.925C16.9125 21.975 16.7833 22 16.65 22H15C14.7167 22 14.4792 21.9042 14.2875 21.7125C14.0958 21.5208 14 21.2833 14 21ZM15.5 20.5H16.45L19.475 17.45L18.55 16.525L15.5 19.55V20.5ZM6 22C5.45 22 4.97917 21.8042 4.5875 21.4125C4.19583 21.0208 4 20.55 4 20V4C4 3.45 4.19583 2.97917 4.5875 2.5875C4.97917 2.19583 5.45 2 6 2H13.175C13.4417 2 13.6958 2.05 13.9375 2.15C14.1792 2.25 14.3917 2.39167 14.575 2.575L19.425 7.425C19.6083 7.60833 19.75 7.82083 19.85 8.0625C19.95 8.30417 20 8.55833 20 8.825V10.25C20 10.5333 19.9042 10.7708 19.7125 10.9625C19.5208 11.1542 19.2833 11.25 19 11.25C18.7167 11.25 18.4792 11.1542 18.2875 10.9625C18.0958 10.7708 18 10.5333 18 10.25V9H14C13.7167 9 13.4792 8.90417 13.2875 8.7125C13.0958 8.52083 13 8.28333 13 8V4H6V20H11C11.2833 20 11.5208 20.0958 11.7125 20.2875C11.9042 20.4792 12 20.7167 12 21C12 21.2833 11.9042 21.5208 11.7125 21.7125C11.5208 21.9042 11.2833 22 11 22H6ZM19.025 16.975L18.55 16.525L19.475 17.45L19.025 16.975Z" fill="#808080" />
                      </svg>
                      <span>Notes</span>
                    </span>
                  </div>

                  {/* Study View Toggle */}
                  <div className="flex items-center justify-end flex-shrink-0 gap-2 px-4 py-2 bg-gray-50 dark:bg-sidebar">
                    <p className="text-sm text-grayText">Study View</p>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={isStudyView}
                        onChange={(e) => setIsStudyView(e.target.checked)}
                      />
                      <div className="w-10 h-6 transition-all bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:bg-primary"></div>
                      <div className="absolute w-4 h-4 transition-all transform bg-white rounded-full top-1 left-1 peer-checked:translate-x-4"></div>
                    </label>
                  </div>
                </div>

                {/* Tab Content */}
                <div className="flex-1 min-h-0">
                  <div className={`h-full tab-content tab-space ${
                    isStudyView ? 'flex justify-center' : ''
                  }`}>
                    <div className={`flex flex-col bg-white dark:bg-background ${
                      isStudyView ? 'max-w-[900px] w-full h-screen' : 'h-full'
                    }`}>
                      
                      {/* About Tab Content */}
                      {activeTab === 'about' && (
                        <div className={`mt-4 editorial-content ${
                          isStudyView ? 'px-4' : 'px-4'
                        }`}>
                          <div className="coreSubject dark:text-zinc-300">
                            
                            {/* Image Carousel */}
                            <div className="mb-6 image-carousel-container">
                              <div className="border carousel-container border-borders">
                                <div className="carousel" style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}>
                                  {carouselImages.map((imageSrc, index) => (
                                    <div key={index} className="carousel-image">
                                      <img src={imageSrc} alt={`Image ${index + 1}`} />
                                    </div>
                                  ))}
                                </div>
                                
                                <div className="control-container">
                                  <div className="control-container-2">
                                    <button 
                                      className="image-carousel-arrow image-carousel-left-arrow group"
                                      onClick={handlePreviousImage}
                                    >
                                      <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <span className="img-number">{currentImageIndex + 1}/{carouselImages.length}</span>
                                    <button 
                                      className="image-carousel-arrow image-carousel-right-arrow group"
                                      onClick={handleNextImage}
                                    >
                                      <ChevronRight className="w-5 h-5" />
                                    </button>
                                  </div>
                                  <div className="control-buttons">
                                    <button className="image-carousel-control-button image-carousel-play-button group">
                                      <Play className="w-5 h-5" />
                                    </button>
                                    <button className="image-carousel-control-button image-carousel-pause-button group">
                                      <Pause className="w-5 h-5" />
                                    </button>
                                  </div>
                                  <button className="image-carousel-control-button image-carousel-down-button group">
                                    <ExternalLink className="w-5 h-5" />
                                  </button>
                                </div>
                                
                                {/* Vertical View for Study Mode */}
                                <div className="vertical-view">
                                  {carouselImages.map((imageSrc, index) => (
                                    <img key={index} src={imageSrc} alt={`Image ${index + 1}`} />
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Content */}
                            <h1 className="mb-4 text-2xl font-bold text-white">Operating System Introduction</h1>
                            <p className="mb-4 leading-relaxed text-gray-300">
                              An <b>Operating System (OS)</b> is the <u>core software</u> that manages all the hardware and software resources in a computer system. It acts as an intermediary between the user and the computer hardware, enabling you to run applications, manage files, and perform other computing tasks seamlessly. Without an OS, you'd have to directly handle each hardware component yourself, which would be extremely tedious and prone to errors.
                            </p>
                            <p className="mb-4 text-gray-300">

                              <strong className="text-white">Real-Life Analogy:</strong>
                              Think of an OS like the event coordinator at a big concert:
                            </p>
                            <ol className="pl-6 mb-6 space-y-2 text-gray-300">
                              <li>The coordinator (OS) ensures that each performer (application) has the required resources (stage, microphones, instruments).</li>
                              <li>They also manage the crowd flow (CPU and memory) to prevent chaos.</li>
                              <li>They handle behind-the-scenes logistics like security and scheduling (system security and process management).</li>
                            </ol>
                            
                            <div className="flex justify-center my-6">
                              <img src="https://static.takeuforward.org/premium/Basics of Operating Systems/Operating System Introduction/Image_1-BI_GUi80" alt="Operating System Diagram" className="h-auto max-w-full rounded-lg" />
                            </div>

                            <h2 className="mb-4 text-xl font-semibold text-white">Core Components of an Operating System</h2>
                            <p className="mb-4 text-gray-300">When the OS loads into memory, it provides several core features that make computing convenient and efficient:</p>
                            <ol className="pl-6 space-y-3 text-gray-300">
                              <li><strong className="text-white">Process Management:</strong> Creates, schedules, and terminates processes (running programs).</li>
                              <li><strong className="text-white">Memory Management:</strong> Allocates and deallocates memory space, ensuring each program gets what it needs without interfering with others.</li>
                              <li><strong className="text-white">File System Management:</strong> Organizes data in files and folders on storage devices for easy access and management.</li>
                              <li><strong className="text-white">Device Management:</strong> Coordinates hardware components (like printers, disks, USB devices) so multiple applications can share them.</li>
                              <li><strong className="text-white">Security & Access Control:</strong> Protects against unauthorized access and ensures user data privacy.</li>
                            </ol>
                          </div>
                        </div>
                      )}

                      {/* Notes Tab Content */}
                      {activeTab === 'notes' && (
                        <div className="max-w-3xl px-4 mt-2 editorial-content">
                          <div className="coreSubject dark:text-zinc-300">
                            <br />
                            <h1>Notes Editor</h1>
                            <p>Take notes for this topic. Your notes will be saved automatically.</p>
                            <div className="mt-4 border rounded-lg bg-sidebar border-borders">
                              <div className="p-3 border-b border-borders">
                                <div className="flex gap-2">
                                  <button type="button" className="p-1 rounded hover:bg-background">
                                    <strong>B</strong>
                                  </button>
                                  <button type="button" className="p-1 italic rounded hover:bg-background">
                                    <em>I</em>
                                  </button>
                                  <button type="button" className="p-1 underline rounded hover:bg-background">
                                    <u>U</u>
                                  </button>
                                </div>
                              </div>
                              <div className="p-4">
                                <textarea
                                  placeholder="Write your notes here..."
                                  className="w-full min-h-[400px] bg-transparent text-white placeholder-grayText resize-none focus:outline-none"
                                />
                              </div>
                            </div>
                            
                            {/* Save Button */}
                            <div className="flex justify-end mt-4">
                              <button 
                                type="button"
                                className="px-6 py-2 font-medium text-white transition-colors rounded-lg bg-primary hover:bg-primary/90"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                </div>
              </div>
          </div>
            </Split>
          )}

          {/* Study View Mode - Full Width Centered Content */}
          {isStudyView && (
            <div className="flex-shrink-0 w-full h-screen overflow-hidden">
              <div className="flex flex-col h-full">
                
                {/* Tab Navigation */}
                <div className="flex flex-row flex-shrink-0 list-none border-b-2 border-borders/30 backdrop-blur-sm" role="tablist">
                  {/* About Tab */}
                  <div className="flex-auto -mb-px text-center bg-sidebar/50">
                    <span 
                      className={`text-base py-3 px-4 flex gap-x-2 justify-center items-center leading-normal cursor-pointer transition-all duration-200 ${
                        activeTab === 'about' ? 'text-primary border-b-[3px] border-primary bg-primary/5' : 'text-grayText hover:text-white hover:bg-sidebar/70'
                      }`}
                      onClick={() => setActiveTab('about')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M7.50016 15.0013H12.5002C12.7363 15.0013 12.9342 14.9214 13.0939 14.7617C13.2536 14.602 13.3335 14.4041 13.3335 14.168C13.3335 13.9319 13.2536 13.7339 13.0939 13.5742C12.9342 13.4145 12.7363 13.3346 12.5002 13.3346H7.50016C7.26405 13.3346 7.06613 13.4145 6.90641 13.5742C6.74669 13.7339 6.66683 13.9319 6.66683 14.168C6.66683 14.4041 6.74669 14.602 6.90641 14.7617C7.06613 14.9214 7.26405 15.0013 7.50016 15.0013ZM7.50016 11.668H12.5002C12.7363 11.668 12.9342 11.5881 13.0939 11.4284C13.2536 11.2687 13.3335 11.0707 13.3335 10.8346C13.3335 10.5985 13.2536 10.4006 13.0939 10.2409C12.9342 10.0812 12.7363 10.0013 12.5002 10.0013H7.50016C7.26405 10.0013 7.06613 10.0812 6.90641 10.2409C6.74669 10.4006 6.66683 10.5985 6.66683 10.8346C6.66683 11.0707 6.74669 11.2687 6.90641 11.4284C7.06613 11.5881 7.26405 11.668 7.50016 11.668ZM5.00016 18.3346C4.54183 18.3346 4.14947 18.1714 3.82308 17.8451C3.49669 17.5187 3.3335 17.1263 3.3335 16.668V3.33464C3.3335 2.8763 3.49669 2.48394 3.82308 2.15755C4.14947 1.83116 4.54183 1.66797 5.00016 1.66797H10.9793C11.2016 1.66797 11.4134 1.70964 11.6147 1.79297C11.8161 1.8763 11.9932 1.99436 12.146 2.14714L16.1877 6.1888C16.3404 6.34158 16.4585 6.51866 16.5418 6.72005C16.6252 6.92144 16.6668 7.13325 16.6668 7.35547V16.668C16.6668 17.1263 16.5036 17.5187 16.1772 17.8451C15.8509 18.1714 15.4585 18.3346 15.0002 18.3346H5.00016ZM10.8335 6.66797V3.33464H5.00016V16.668H15.0002V7.5013H11.6668C11.4307 7.5013 11.2328 7.42144 11.0731 7.26172C10.9134 7.102 10.8335 6.90408 10.8335 6.66797Z" fill="currentColor" />
                      </svg>
                      <span>About</span>
                    </span>
                  </div>

                  {/* Notes Tab */}
                  <div className="flex-auto -mb-px text-center bg-sidebar/50">
                    <span 
                      className={`text-base py-3 px-4 flex gap-x-2 justify-center items-center leading-normal cursor-pointer transition-all duration-200 ${
                        activeTab === 'notes' ? 'text-primary border-b-[3px] border-primary bg-primary/5' : 'text-grayText hover:text-white hover:bg-sidebar/70'
                      }`}
                      onClick={() => setActiveTab('notes')}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 21V19.35C14 19.2167 14.025 19.0875 14.075 18.9625C14.125 18.8375 14.2 18.725 14.3 18.625L19.525 13.425C19.675 13.275 19.8417 13.1667 20.025 13.1C20.2083 13.0333 20.3917 13 20.575 13C20.775 13 20.9667 13.0375 21.15 13.1125C21.3333 13.1875 21.5 13.3 21.65 13.45L22.575 14.375C22.7083 14.525 22.8125 14.6917 22.8875 14.875C22.9625 15.0583 23 15.2417 23 15.425C23 15.6083 22.9667 15.7958 22.9 15.9875C22.8333 16.1792 22.725 16.35 22.575 16.5L17.375 21.7C17.275 21.8 17.1625 21.875 17.0375 21.925C16.9125 21.975 16.7833 22 16.65 22H15C14.7167 22 14.4792 21.9042 14.2875 21.7125C14.0958 21.5208 14 21.2833 14 21ZM15.5 20.5H16.45L19.475 17.45L18.55 16.525L15.5 19.55V20.5ZM6 22C5.45 22 4.97917 21.8042 4.5875 21.4125C4.19583 21.0208 4 20.55 4 20V4C4 3.45 4.19583 2.97917 4.5875 2.5875C4.97917 2.19583 5.45 2 6 2H13.175C13.4417 2 13.6958 2.05 13.9375 2.15C14.1792 2.25 14.3917 2.39167 14.575 2.575L19.425 7.425C19.6083 7.60833 19.75 7.82083 19.85 8.0625C19.95 8.30417 20 8.55833 20 8.825V10.25C20 10.5333 19.9042 10.7708 19.7125 10.9625C19.5208 11.1542 19.2833 11.25 19 11.25C18.7167 11.25 18.4792 11.1542 18.2875 10.9625C18.0958 10.7708 18 10.5333 18 10.25V9H14C13.7167 9 13.4792 8.90417 13.2875 8.7125C13.0958 8.52083 13 8.28333 13 8V4H6V20H11C11.2833 20 11.5208 20.0958 11.7125 20.2875C11.9042 20.4792 12 20.7167 12 21C12 21.2833 11.9042 21.5208 11.7125 21.7125C11.5208 21.9042 11.2833 22 11 22H6ZM19.025 16.975L18.55 16.525L19.475 17.45L19.025 16.975Z" fill="#808080" />
                      </svg>
                      <span>Notes</span>
                    </span>
                  </div>

                  {/* Study View Toggle */}
                  <div className="flex items-center justify-end flex-shrink-0 gap-3 px-6 py-3 bg-sidebar/50 border-l border-borders/30">
                    <p className="text-sm font-medium text-grayText">Study View</p>
                    <label className="relative inline-flex items-center cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={isStudyView}
                        onChange={(e) => setIsStudyView(e.target.checked)}
                      />
                      <div className="w-11 h-6 transition-all bg-gray-700 rounded-full peer peer-checked:bg-primary shadow-inner"></div>
                      <div className="absolute w-4 h-4 transition-all transform bg-white rounded-full shadow-lg top-1 left-1 peer-checked:translate-x-5 peer-checked:bg-white"></div>
                    </label>
                  </div>
                </div>

                {/* Tab Content */}
                <div className="flex-1 min-h-0">
                  <div className="flex justify-center h-full tab-content tab-space">
                    <div className="flex flex-col max-w-[900px] w-full h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-300 dark:scrollbar-thumb-[#474d59] dark:scrollbar-track-[#020612] bg-white dark:bg-background">
                      
                      {/* About Tab Content */}
                      {activeTab === 'about' && (
                        <div className="px-4 mt-4 editorial-content">
                          <div className="coreSubject dark:text-zinc-300">
                            
                            {/* Image Carousel */}
                            <div className="mb-6 image-carousel-container">
                              <div className="border carousel-container border-borders">
                                <div className="carousel" style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}>
                                  {carouselImages.map((imageSrc, index) => (
                                    <div key={index} className="carousel-image">
                                      <img src={imageSrc} alt={`Image ${index + 1}`} />
                                    </div>
                                  ))}
                                </div>
                                
                                <div className="control-container">
                                  <div className="control-container-2">
                                    <button 
                                      className="image-carousel-arrow image-carousel-left-arrow group"
                                      onClick={handlePreviousImage}
                                    >
                                      <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <span className="img-number">{currentImageIndex + 1}/{carouselImages.length}</span>
                                    <button 
                                      className="image-carousel-arrow image-carousel-right-arrow group"
                                      onClick={handleNextImage}
                                    >
                                      <ChevronRight className="w-5 h-5" />
                                    </button>
                                  </div>
                                  <div className="control-buttons">
                                    <button className="image-carousel-control-button image-carousel-play-button group">
                                      <Play className="w-5 h-5" />
                                    </button>
                                    <button className="image-carousel-control-button image-carousel-pause-button group">
                                      <Pause className="w-5 h-5" />
                                    </button>
                                  </div>
                                  <button className="image-carousel-control-button image-carousel-down-button group">
                                    <ExternalLink className="w-5 h-5" />
                                  </button>
                                </div>
                                
                                {/* Vertical View for Study Mode */}
                                <div className="vertical-view">
                                  {carouselImages.map((imageSrc, index) => (
                                    <img key={index} src={imageSrc} alt={`Image ${index + 1}`} />
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Content */}
                            <h1 className="mb-4 text-2xl font-bold text-white">Operating System Introduction</h1>
                            <p className="mb-4 leading-relaxed text-gray-300">
                              An <b>Operating System (OS)</b> is the <u>core software</u> that manages all the hardware and software resources in a computer system. It acts as an intermediary between the user and the computer hardware, enabling you to run applications, manage files, and perform other computing tasks seamlessly. Without an OS, you'd have to directly handle each hardware component yourself, which would be extremely tedious and prone to errors.
                            </p>
                            <p className="mb-4 text-gray-300">

                              <strong className="text-white">Real-Life Analogy:</strong>
                              Think of an OS like the event coordinator at a big concert:
                            </p>
                            <ol className="pl-6 mb-6 space-y-2 text-gray-300">
                              <li>The coordinator (OS) ensures that each performer (application) has the required resources (stage, microphones, instruments).</li>
                              <li>They also manage the crowd flow (CPU and memory) to prevent chaos.</li>
                              <li>They handle behind-the-scenes logistics like security and scheduling (system security and process management).</li>
                            </ol>
                            
                            <div className="flex justify-center my-6">
                              <img src="https://static.takeuforward.org/premium/Basics of Operating Systems/Operating System Introduction/Image_1-BI_GUi80" alt="Operating System Diagram" className="h-auto max-w-full rounded-lg" />
                            </div>

                            <h2 className="mb-4 text-xl font-semibold text-white">Core Components of an Operating System</h2>
                            <p className="mb-4 text-gray-300">When the OS loads into memory, it provides several core features that make computing convenient and efficient:</p>
                            <ol className="pl-6 space-y-3 text-gray-300">
                              <li><strong className="text-white">Process Management:</strong> Creates, schedules, and terminates processes (running programs).</li>
                              <li><strong className="text-white">Memory Management:</strong> Allocates and deallocates memory space, ensuring each program gets what it needs without interfering with others.</li>
                              <li><strong className="text-white">File System Management:</strong> Organizes data in files and folders on storage devices for easy access and management.</li>
                              <li><strong className="text-white">Device Management:</strong> Coordinates hardware components (like printers, disks, USB devices) so multiple applications can share them.</li>
                              <li><strong className="text-white">Security & Access Control:</strong> Protects against unauthorized access and ensures user data privacy.</li>
                            </ol>
                          </div>
                        </div>
                      )}

                      {/* Notes Tab Content */}
                      {activeTab === 'notes' && (
                        <div className="max-w-3xl px-4 mt-2 editorial-content">
                          <div className="coreSubject dark:text-zinc-300">
                            <br />
                            <h1>Notes Editor</h1>
                            <p>Take notes for this topic. Your notes will be saved automatically.</p>
                            <div className="mt-4 border rounded-lg bg-sidebar border-borders">
                              <div className="p-3 border-b border-borders">
                                <div className="flex gap-2">
                                  <button type="button" className="p-1 rounded hover:bg-background">
                                    <strong>B</strong>
                                  </button>
                                  <button type="button" className="p-1 italic rounded hover:bg-background">
                                    <em>I</em>
                                  </button>
                                  <button type="button" className="p-1 underline rounded hover:bg-background">
                                    <u>U</u>
                                  </button>
                                </div>
                              </div>
                              <div className="p-4">
                                <textarea
                                  placeholder="Write your notes here..."
                                  className="w-full min-h-[400px] bg-transparent text-white placeholder-grayText resize-none focus:outline-none"
                                />
                              </div>
                            </div>
                            
                            {/* Save Button */}
                            <div className="flex justify-end mt-4">
                              <button 
                                type="button"
                                className="px-6 py-2 font-medium text-white transition-colors rounded-lg bg-primary hover:bg-primary/90"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CoreSubjectPage;
