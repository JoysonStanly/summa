import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import UnifiedSidebar from "@shared/components/layout/UnifiedSidebar";
import { ProblemStatement, CodeEditor, TestCases, TestCaseDisplay, TestCasesSkeleton, Submissions } from '../components';
import { LoadingSpinner, AlertDialog } from '@shared/components/ui';
// import { getProblem } from '../data/problems'; // OLD: Static data
import {
  Play,
  Bookmark,
  FileText,
  MessageSquare,
  FileCode,
  ChevronLeft,
  ChevronRight,
  BrainCircuit,
  Settings,
  RotateCcw,
  Code,
  ThumbsUp,
  ThumbsDown,
  Bug,
  StickyNote,
  BookOpen,
  Clock,
  Users,
  Sparkles
} from 'lucide-react';
import Editorial from '../editorial/Editorial';
import Discussion from "@shared/components/ui/Discussion";
import NotesEditor from "@shared/components/ui/NotesEditor";
import Toast from "@shared/components/ui/Toast";
import { useProblemStore } from "@features/problems/stores/problemStore";
import submissionService from '../services/submissionService';
import problemService from '../services/problemService';
import { useUserStore } from "@features/profile/store/userStore";
import { useDSAProblems } from '../hooks/useDSAProblems';

const ProblemPage = () => {
  const { topicId = '', subtopicId = '', problemId = '' } = useParams<{ topicId: string; subtopicId?: string; problemId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const tabFromUrl = searchParams.get('tab') || 'problem';

  const [activeTab, setActiveTab] = useState(tabFromUrl);
  const [isStudyViewActive, setIsStudyViewActive] = useState(false);
  
  // Determine actual problemId - it could be in problemId or subtopicId param depending on route structure
  const actualProblemId = problemId || subtopicId || '';
  
  // Get all needed values from useProblemStore in one place
  const { 
    setLanguageForProblem, 
    getLanguageForProblem, 
    updateEditorContent,
    editorContent,
    currentProblem, 
    fetchProblem, 
    isLoading, 
    error: problemError,
    testResults,
    isRunningTests,
    runTests,
    clearTestResults,
    editorConfig,
    updateEditorConfig
  } = useProblemStore();
  
  const initialLang = getLanguageForProblem(actualProblemId) || 'java';
  const [language, setLanguage] = useState(initialLang);
  const [selectedTestCase, setSelectedTestCase] = useState('1');
  const [editorKey, setEditorKey] = useState(0);
  const codeEditorRef = useRef<any>(null);
  const [isCodeEditorFullscreen, setIsCodeEditorFullscreen] = useState(false);
  const [showTestResults, setShowTestResults] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [showFontSizeDropdown, setShowFontSizeDropdown] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  // Screen size tracking for responsive behavior
  const [isLg, setIsLg] = useState(() => typeof window !== 'undefined' ? window.innerWidth >= 1024 : true);

  // Debug: Log when fullscreen state changes
  useEffect(() => {
    console.log('Code editor fullscreen state changed:', isCodeEditorFullscreen);
  }, [isCodeEditorFullscreen]);

  // 🎯 Drag-to-overlay state (horizontal)
  const [leftPanelWidth, setLeftPanelWidth] = useState(600); // Default 600px
  const [isDraggingState, setIsDraggingState] = useState(false); // For UI feedback
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartWidth = useRef(0);

  const MIN_WIDTH = 40; // Minimum - keep handle visible
  const MAX_WIDTH = typeof window !== 'undefined' ? window.innerWidth - 700 : 900; // Leave minimum 600px for right panel

  // 🎯 Vertical splitter state (between editor and test cases)
  const [editorHeight, setEditorHeight] = useState(350); // Default 350px for editor (reduced to give more space to test cases)
  const [isVerticalDragging, setIsVerticalDragging] = useState(false);
  const verticalDragging = useRef(false);
  const verticalDragStartY = useRef(0);
  const verticalDragStartHeight = useRef(0);
  const rightPanelRef = useRef<HTMLDivElement>(null);

  const MIN_EDITOR_HEIGHT = 0; // Minimum editor height - allows near full collapse
  const MIN_TEST_HEIGHT = 50; // Minimum test cases height - allows near full collapse

  // const { addCompletedProblem, updateStreak } = useUserStore(); // OLD
  const { updateProgress } = useUserStore(); // NEW: Use API-based progress
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [toastVariant, setToastVariant] = useState<'success' | 'error' | 'info' | 'warning'>('info');

  // 🎯 Submission result state - stores latest submission to display in Submissions tab
  const [latestSubmission, setLatestSubmission] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state for Submit button

  // 🎯 Footer state - Like/Dislike/Checkbox for all tabs
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [isLoadingCheckbox, setIsLoadingCheckbox] = useState(true);

  // 🔥 NEW: Fetch DSA problems dynamically from backend
  const { topics: dsaTopics, loading: topicsLoading } = useDSAProblems();

  // 🔥 Handle checkbox change to update streak in calendar
  const handleCheckboxChange = async () => {
    if (!currentProblem?._id) {
      console.error('Cannot update streak: Problem not loaded yet');
      return;
    }

    // 🔍 Debug: Log entire problem object to see what fields it has
    console.log('📋 Current problem object:', {
      _id: currentProblem._id,
      id: currentProblem.id,
      slug: currentProblem.slug,
      title: currentProblem.title,
      fullObject: currentProblem
    });

    const newAutoPlayValue = !autoPlay;
    setAutoPlay(newAutoPlayValue);
    
    if (newAutoPlayValue) {
      // Checkbox is being checked - add streak
      try {
        console.log('Updating streak with problemId:', currentProblem._id);
        await updateProgress('streak', currentProblem._id);
        console.log('Streak updated successfully');
      } catch (error) {
        console.error('Failed to update streak:', error);
        // Revert checkbox on error
        setAutoPlay(false);
      }
    } else {
      // Checkbox is being unchecked - remove from daily checked problems
      try {
        console.log('Removing problem from checked list:', currentProblem._id);
        const response = await fetch('/api/v1/progress/uncheck', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ problemId: currentProblem._id })
        });
        
        if (!response.ok) {
          throw new Error('Failed to uncheck problem');
        }
        console.log('Problem unchecked successfully');
        
        // Trigger calendar refresh
        const { refreshStreak } = useUserStore.getState();
        refreshStreak();
      } catch (error) {
        console.error('Failed to uncheck problem:', error);
        // Revert checkbox on error
        setAutoPlay(true);
      }
    }
  };

  // Fetch problem from API
  useEffect(() => {
    if (actualProblemId) {
      fetchProblem(actualProblemId);
    }
  }, [actualProblemId, fetchProblem]);

  // Load checkbox state from database when problem changes
  useEffect(() => {
    const fetchCheckboxState = async () => {
      if (!currentProblem?._id) return;
      
      setIsLoadingCheckbox(true);
      try {
        const response = await fetch('/api/v1/progress/checked', {
          credentials: 'include',
        });
        
        if (response.ok) {
          const result = await response.json();
          const checkedProblems = result.data || [];
          setAutoPlay(checkedProblems.includes(currentProblem._id));
        }
      } catch (error) {
        console.error('Failed to fetch checkbox state:', error);
      } finally {
        setIsLoadingCheckbox(false);
      }
    };

    fetchCheckboxState();
  }, [currentProblem?._id]);

  const problem = currentProblem; // Use API data instead of static getProblem()

  const isInitialLoad = isLoading && !problem;
  const isSwitchingProblem = Boolean(isLoading && problem && actualProblemId && problem._id !== actualProblemId);

  // Debug logging
  useEffect(() => {
    console.log('Problem loaded:', problem);
    console.log('Test cases:', problem?.testCases);
    console.log('Problem ID:', actualProblemId);
    console.log('isRunningTests:', isRunningTests);
    console.log('showTestResults:', showTestResults);
    console.log('testResults:', testResults);
  }, [problem, actualProblemId, isRunningTests, showTestResults, testResults]);

  useEffect(() => {
    if (problem) {
      document.title = `${problem.title} - StudyIO`;
    }
  }, [problem]);

  useEffect(() => {
    setActiveTab(searchParams.get('tab') || 'problem');
  }, [searchParams]);

  // Track screen size for conditional widths
  useEffect(() => {
    const onResize = () => setIsLg(window.innerWidth >= 1024);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // 🎯 Horizontal drag handler implementation
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      
      // Calculate new width based on mouse position
      const deltaX = e.clientX - dragStartX.current;
      const newWidth = dragStartWidth.current + deltaX;
      
      // Clamp width between min and max
      const clampedWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, newWidth));
      setLeftPanelWidth(clampedWidth);
      
      // Prevent text selection while dragging
      e.preventDefault();
    };

    const handleMouseUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
        setIsDraggingState(false);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        document.body.style.pointerEvents = '';
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // 🎯 Vertical drag handler implementation (for editor/test cases splitter)
  useEffect(() => {
    const handleVerticalMouseMove = (e: MouseEvent) => {
      if (!verticalDragging.current) return;

      // Calculate actual available container height dynamically
      const rightPanel = rightPanelRef.current;
      const containerHeight = rightPanel 
        ? rightPanel.clientHeight - 50 // Subtract header height
        : window.innerHeight - 200; // Fallback

      // Calculate new height based on mouse position
      const deltaY = e.clientY - verticalDragStartY.current;
      const newHeight = verticalDragStartHeight.current + deltaY; // Dragging down increases editor height

      // Calculate max height (leave minimum space for test cases)
      const maxHeight = containerHeight - MIN_TEST_HEIGHT;

      // Clamp height between min and max
      const clampedHeight = Math.max(MIN_EDITOR_HEIGHT, Math.min(maxHeight, newHeight));
      setEditorHeight(clampedHeight);

      // Prevent text selection while dragging
      e.preventDefault();
    };

    const handleVerticalMouseUp = () => {
      if (verticalDragging.current) {
        verticalDragging.current = false;
        setIsVerticalDragging(false);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        document.body.style.pointerEvents = '';
      }
    };

    window.addEventListener('mousemove', handleVerticalMouseMove);
    window.addEventListener('mouseup', handleVerticalMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleVerticalMouseMove);
      window.removeEventListener('mouseup', handleVerticalMouseUp);
    };
  }, []);

  // 🎯 Start drag handler
  const handleDragStart = (e: React.MouseEvent) => {
    isDragging.current = true;
    setIsDraggingState(true);
    dragStartX.current = e.clientX;
    dragStartWidth.current = leftPanelWidth;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    document.body.style.pointerEvents = 'none'; // Disable all pointer events during drag
    e.preventDefault();
  };

  // 🎯 Double-click to reset width
  const handleDoubleClick = () => {
    setLeftPanelWidth(600);
  };

  // 🎯 Start vertical drag handler
  const handleVerticalDragStart = (e: React.MouseEvent) => {
    verticalDragging.current = true;
    setIsVerticalDragging(true);
    verticalDragStartY.current = e.clientY;
    verticalDragStartHeight.current = editorHeight;
    document.body.style.cursor = 'ns-resize';
    document.body.style.userSelect = 'none';
    document.body.style.pointerEvents = 'none';
    e.preventDefault();
  };

  // 🎯 Double-click to reset editor height
  const handleVerticalDoubleClick = () => {
    setEditorHeight(500);
  };

  // Show loading state (only on first load)
  if (isInitialLoad) {
    return (
      <div className="flex h-screen bg-[#0a0a0a] text-white items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <LoadingSpinner />
          </div>
          <p className="text-gray-400">Loading problem...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (problemError) {
    return (
      <div className="flex h-screen bg-[#0a0a0a] text-white items-center justify-center">
        <div className="max-w-md text-center">
          <div className="mb-4 text-6xl text-red-500">⚠️</div>
          <h2 className="mb-2 text-2xl font-bold">Error Loading Problem</h2>
          <p className="mb-6 text-gray-400">{problemError}</p>
          <button
            onClick={() => navigate('/dsa')}
            className="px-6 py-2 transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Back to Problems
          </button>
        </div>
      </div>
    );
  }

  if (!problem) return null;

  const languages = {
    java: 'Java',
    python: 'Python',
    javascript: 'JavaScript',
    cpp: 'C++'
  };

  const getLanguageKey = (value: string): keyof typeof languages =>
    (Object.keys(languages).find(key => languages[key as keyof typeof languages] === value) || 'typescript') as keyof typeof languages;

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const langKey = getLanguageKey(e.target.value);
    setLanguage(langKey);
    setLanguageForProblem(actualProblemId, langKey);
    // Force editor to re-mount with new starter code
    setEditorKey(prev => prev + 1);
  };

  const handleResetCode = () => {
    if (!problem) return;
    const starterCode = problem.starterCode?.[language as keyof typeof problem.starterCode] || 
      problem.starterCode?.typescript || 
      `// Write your solution here for ${problem.title}\n\nfunction solution() {\n  // Your code here\n}`;
    updateEditorContent(actualProblemId, starterCode);
    setEditorKey(prev => prev + 1);
  };

  // Use starterCode from API (not defaultCode from static data)
  const defaultCode = problem.starterCode?.[language as keyof typeof problem.starterCode] || 
    problem.starterCode?.typescript || 
    `// Write your solution here for ${problem.title}\n\nfunction solution() {\n  // Your code here\n}`;



  return (
    <>
      <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Conditional rendering: Show only Editorial in Study View */}
      {isStudyViewActive ? (
        isSwitchingProblem ? (
          <div className="flex flex-1 min-h-0 p-6">
            <div className="w-full flex-1 min-h-0 rounded-xl bg-[#141414] p-6 border border-[#1f1f1f] flex flex-col gap-5">
              <div>
                <div className="w-2/3 h-6 rounded-md skeleton" />
                <div className="w-1/2 h-4 mt-3 rounded-md skeleton" />
              </div>
              <div className="w-full h-28 rounded-xl skeleton" />
              <div className="w-full h-28 rounded-xl skeleton" />
              <div className="flex-1 w-full rounded-xl skeleton" />
            </div>
          </div>
        ) : (
          <EditorialView 
            problem={problem} 
            isStudyViewActive={isStudyViewActive}
            onStudyViewChange={setIsStudyViewActive}
          />
        )
      ) : (
        <>
          {/* Sidebar - Now using dynamic data from backend */}
          <UnifiedSidebar
            title="DSA Problems"
            categories={dsaTopics.map(topic => ({
              id: topic.id,
              name: topic.name,
              subCategories: topic.subtopics.map(subtopic => ({
                id: subtopic.id,
                name: subtopic.name,
                problems: subtopic.problems || []
              }))
            }))}
            basePath="/dsa"
            searchPlaceholder="Search DSA problems..."
            isActive={(categoryId, itemId) => {
              // categoryId = topic (e.g., "arrays")
              // itemId = problem id (e.g., "linear-search")
              // Check if we're viewing a problem under this category
              return categoryId === topicId && itemId === problemId;
            }}
            theme="dark"
          />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-h-0">
        {/* Top Header for Main Content */}
        <header className="sticky bg-white dark:bg-[#0F0F0F] top-0 border-b dark:border-zinc-800 border-zinc-200 z-30 block font-sans">
          <div className="px-4 sm:px-6 lg:pr-2">
            <div className="flex items-center justify-between h-16">
              <div className="block md:hidden">
                <img src="/images/logo.png" alt="StudyIO Logo" className="object-contain w-10 h-10" />
              </div>
              <div className="items-center justify-between hidden w-full gap-2 md:flex"></div>
              <div className="flex items-center space-x-3">
                <div className="flex flex-row items-center gap-3">
                  <div className="relative cursor-pointer group/deprecated">
                    <span className="flex items-center justify-center w-5 h-5 text-xs font-semibold text-orange-500 bg-transparent border border-orange-500 rounded-full">i</span>
                    <div className="absolute invisible opacity-0 group-hover/deprecated:visible group-hover/deprecated:opacity-100 transition-[opacity,visibility] duration-300 right-full top-2 mt-7 translate-x-20 w-52 text-[#E0990A] px-3 py-1 text-xs bg-[#FEF7E6] dark:bg-[#242019] rounded border border-orange-500 z-10">
                      Coins are now deprecated and will be replaced by an upcoming gamified experience.
                    </div>
                  </div>
                  <div className="relative group">
                    <a className="md:flex hidden flex-row gap-2 items-center bg-[#FEF7E6] dark:bg-[#271F11] p-1 rounded-md" href="/plus/leaderboard">
                      <p className="text-[#E0990A] text-lg ml-2">27121</p>
                      <div className="flex items-center justify-center text-xl w-7 h-7">
                        🪙
                      </div>
                    </a>
                    <div className="absolute opacity-0 invisible right-0 top-12 bg-gradient-to-br bg-white dark:from-zinc-800 dark:to-zinc-900 border dark:border-zinc-700 transform p-6 rounded-lg shadow-md w-80 z-50 transition-[opacity,visibility] duration-0 group-hover:transition-[opacity,visibility] group-hover:delay-[600ms] group-hover:duration-200 group-hover:opacity-100 group-hover:visible">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[#212B36] font-medium dark:text-gray-200">Problem solving</span>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-700 dark:text-gray-300">26000</span>
                            <div className="w-6 h-6 bg-yellow-400 rounded-full"></div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[#212B36] font-medium dark:text-gray-200">Quiz</span>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-700 dark:text-gray-300">121</span>
                            <div className="w-6 h-6 bg-yellow-400 rounded-full"></div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[#212B36] font-medium dark:text-gray-200">Example guess</span>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-700 dark:text-gray-300">310</span>
                            <div className="w-6 h-6 bg-yellow-400 rounded-full"></div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[#212B36] font-medium dark:text-gray-200">Contest</span>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-700 dark:text-gray-300">690</span>
                            <div className="w-6 h-6 bg-yellow-400 rounded-full"></div>
                          </div>
                        </div>
                        <div className="relative mt-4">
                          <div className="flex items-start gap-2 p-2 rounded-md bg-amber-50 dark:bg-amber-900/30">
                            <div className="w-5 h-5">💰</div>
                            <span className="text-[#637381] dark:text-gray-300 italic">Great going! Earn Coins—exclusive rewards coming soon!</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <button className="relative visible w-10 h-10 border-0 burger md:hidden" aria-label="Toggle menu" type="button">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu block absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 scale-100 text-gray-900 !opacity-100 duration-200 motion-reduce:transition-none dark:text-gray-100">
                    <line x1="4" x2="20" y1="12" y2="12"></line>
                    <line x1="4" x2="20" y1="6" y2="6"></line>
                    <line x1="4" x2="20" y1="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>
        
        {/* 🎯 OVERLAY LAYOUT - Left panel slides over right panel */}
        {isLg ? (
          <div className="relative flex-1 overflow-hidden">
            {/* =============== RIGHT PANEL (Absolute positioning for proper width constraint) =============== */}
            <div 
              ref={rightPanelRef}
              className={`absolute top-0 right-0 bottom-0 flex flex-col bg-[#0e0e0e] ${!isDraggingState ? 'transition-all duration-300 ease-out' : ''}`}
              style={{ 
                left: `${leftPanelWidth}px`,
                pointerEvents: isDraggingState ? 'none' : 'auto'
              }}
            >
              {/* Editor Header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-[#1f1f1f] sticky top-0 bg-[#0b0b0b] z-20">
                <div className="flex items-center gap-3">
                  <Code size={18} className="text-gray-400" />
                  <select
                    className="text-sm text-white bg-transparent outline-none cursor-pointer hover:text-gray-300"
                    value={languages[language as keyof typeof languages]}
                    onChange={handleLanguageChange}
                  >
                    {Object.entries(languages).map(([key, value]) => (
                      <option key={key} value={value} className="bg-[#0a0a0a]">
                        {value}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  {/* Font Size Dropdown */}
                  <div className="relative">
                    <button 
                      type="button"
                      onClick={() => setShowFontSizeDropdown(!showFontSizeDropdown)}
                      className="flex items-center gap-1.5 px-2 py-1 text-xs text-gray-400 hover:text-gray-300 bg-[#1f1f1f] hover:bg-[#2a2a2a] border border-[#2a2a2a] rounded transition-colors h-8"
                    >
                      <span>{editorConfig.fontSize}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m6 9 6 6 6-6"></path>
                      </svg>
                    </button>
                    
                    {showFontSizeDropdown && (
                      <div className="absolute top-full mt-1 left-0 bg-[#1a1a1a] border border-[#2a2a2a] rounded shadow-lg z-50 py-1 min-w-[60px]">
                        {[12, 13, 14, 15, 16, 17, 18, 19, 20].map(size => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => {
                              updateEditorConfig({ fontSize: size });
                              setShowFontSizeDropdown(false);
                            }}
                            className={`w-full px-3 py-1.5 text-xs text-left hover:bg-[#2a2a2a] transition-colors ${
                              editorConfig.fontSize === size ? 'text-orange-400 bg-[#2a2a2a]' : 'text-gray-300'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <button
                    className="h-8 px-4 rounded-md text-sm font-medium bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={async () => {
                      try {
                        console.log('Run button clicked');
                        const code = editorContent[actualProblemId] || defaultCode; // Get code from editor
                        
                        // Show skeleton immediately
                        setShowSkeleton(true);
                        setShowTestResults(false);
                        console.log('Skeleton shown, starting tests...');
                        
                        // Run tests in background
                        const testPromise = runTests(actualProblemId, code, language);
                        
                        // Wait for 3 seconds minimum for loading animation
                        await Promise.all([
                          testPromise,
                          new Promise(resolve => setTimeout(resolve, 3000))
                        ]);
                        
                        console.log('Tests completed, showing results');
                        // Hide skeleton and show results
                        setShowSkeleton(false);
                        setShowTestResults(true);
                      } catch (error) {
                        console.error('Error running tests:', error);
                        setShowSkeleton(false);
                        setToastVariant('error');
                        setToastMsg('Failed to run tests');
                        setShowTestResults(false);
                      }
                    }}
                    disabled={showSkeleton}
                  >
                    <Play size={14} />
                    {showSkeleton ? 'Running...' : 'Run'}
                  </button>
                  <button
                    className="h-8 px-5 rounded-md text-sm font-medium text-white bg-[#FF6D00] hover:bg-[#ff7a1a] disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={async () => {
                      try {
                        // 🎯 Auto-switch to Submissions tab when Submit is clicked (like LeetCode)
                        navigate(`/dsa/${topicId}/${subtopicId || actualProblemId}/${actualProblemId}?tab=submissions`);
                        setIsSubmitting(true);
                        setLatestSubmission(null); // Clear previous submission
                        const code = editorContent[actualProblemId] || defaultCode;
                        const problemIdToSend = problem?._id || actualProblemId;
                        const submissionData = {
                          problemId: problemIdToSend,
                          code,
                          language
                        };
                        // Only use the delayed mock for loading effect
                        const result = await problemService.submitSolution(submissionData);
                        // Add a 5 second delay before showing the result (in addition to any mock delay)
                        await new Promise(res => setTimeout(res, 2000));
                        setLatestSubmission({
                          status: result.status === 'accepted' ? 'Accepted' : 'Wrong Answer',
                          testCasesPassed: result.testResults?.filter((t: any) => t.passed).length || 0,
                          totalTestCases: problem?.testCases?.length || 0,
                          memoryUsed: result.memory ? `${result.memory} KB` : '',
                          language: language,
                          timestamp: new Date().toISOString()
                        });
                        setIsSubmitting(false);
                        if (result.status === 'accepted') {
                          await updateProgress('solved', actualProblemId);
                        }
                      } catch (error) {
                        console.error('Submission error:', error);
                        setIsSubmitting(false);
                      }
                    }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </div>

              {/* Code Editor with flexible height */}
              <div 
                className="relative overflow-hidden"
                style={{ 
                  height: `${editorHeight}px`,
                  minHeight: `${MIN_EDITOR_HEIGHT}px`,
                  flexShrink: 0
                }}
              >
                <CodeEditor
                  ref={codeEditorRef}
                  key={editorKey}
                  problemId={actualProblemId}
                  language={language}
                  defaultCode={defaultCode}
                  onChange={value => {
                    if (value !== undefined) updateEditorContent(actualProblemId, value);
                  }}
                />
              </div>

              {/* 🎯 VERTICAL SPLITTER (FlexLayout style) */}
              <div
                className="relative z-40 flex items-center justify-center flexlayout__splitter flexlayout__splitter_vert cursor-ns-resize group"
                style={{ 
                  height: '1px',
                  minHeight: '1px',
                  flexDirection: 'row',
                  backgroundColor: '#1f1f1f',
                  pointerEvents: 'auto',
                  transition: isVerticalDragging ? 'none' : 'background-color 0.2s'
                }}
                onMouseDown={handleVerticalDragStart}
                onDoubleClick={handleVerticalDoubleClick}
              >
                {/* Extra drag area for easier grabbing */}
                <div 
                  className="absolute inset-0 flexlayout__splitter_extra cursor-ns-resize"
                  style={{ 
                    height: '8px',
                    width: '100%',
                    transform: 'translateY(-50%)'
                  }}
                />
                
                {/* Visual indicator line */}
                <div 
                  className={`absolute w-full transition-all duration-200 ${
                    isVerticalDragging 
                      ? 'h-[2px] bg-[#FF6D00] shadow-[0_0_8px_rgba(255,109,0,0.8)]'
                      : 'h-[1px] bg-[#1f1f1f] group-hover:bg-[#FF6D00] group-hover:h-[2px]'
                  }`}
                  style={{ top: '50%', transform: 'translateY(-50%)' }}
                />
                
                {/* Center grip indicator */}
                <div 
                  className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-150 ${
                    isVerticalDragging
                      ? 'w-10 h-1 bg-[#FF6D00] shadow-[0_0_12px_rgba(255,109,0,1)]'
                      : 'w-8 h-[3px] bg-[#3a3a3a] group-hover:w-10 group-hover:bg-[#FF6D00] group-hover:shadow-[0_0_8px_rgba(255,109,0,0.8)]'
                  }`}
                />
              </div>

              {/* Test Cases Container - Takes remaining space */}
              <div 
                className="flex flex-col overflow-hidden flexlayout__tabset_container"
                style={{ 
                  flexGrow: 1,
                  minHeight: `${MIN_TEST_HEIGHT}px`,
                  maxHeight: '100%'
                }}
              >
                {/* Tab Bar */}
                

                {/* Test Cases Content */}
                <div className="flex-1 overflow-hidden flexlayout__tabset_content">
                  {(() => {
                    console.log('Test Cases render - showSkeleton:', showSkeleton, 'showTestResults:', showTestResults);
                    if (showSkeleton) {
                      return <TestCasesSkeleton rows={2} />;
                    } else if (!showTestResults) {
                      return (
                        <div className="relative h-full overflow-hidden">
                          {problem?.testCases ? (
                            <TestCases
                              testCases={problem.testCases || []}
                              selectedTestCase={selectedTestCase}
                              onSelectTestCase={setSelectedTestCase}
                              onReset={() => setShowResetDialog(true)}
                              onCopy={() => {
                                const currentCode = editorContent[actualProblemId] || defaultCode;
                                navigator.clipboard.writeText(currentCode);
                              }}
                              onFormat={() => {
                                codeEditorRef.current?.formatCode();
                              }}
                              onFullscreen={() => setIsCodeEditorFullscreen(true)}
                            />
                          ) : (
                            <div className="p-4 text-gray-400">No test cases available</div>
                          )}
                        </div>
                      );
                    } else {
                      console.log('Passing test cases to TestCaseDisplay:', problem?.testCases);
                      
                      return (
                        <div className="h-full overflow-hidden">
                          <TestCaseDisplay
                            testCases={problem?.testCases || []}
                            testResults={testResults}
                            onRunTests={async () => {
                              try {
                                const code = editorContent[actualProblemId] || defaultCode;
                                setShowSkeleton(true);
                                setShowTestResults(false);
                                
                                const testPromise = runTests(actualProblemId, code, language);
                                
                                await Promise.all([
                                  testPromise,
                                  new Promise(resolve => setTimeout(resolve, 3000))
                                ]);
                                
                                setShowSkeleton(false);
                                setShowTestResults(true);
                              } catch (error) {
                                console.error('Failed to run tests:', error);
                                setShowSkeleton(false);
                              }
                            }}
                            onResetTestCases={() => {
                              clearTestResults();
                              setShowTestResults(false);
                            }}
                            problemParams={[
                              { name: 'nums', label: 'Nums' },
                              { name: 'target', label: 'Target' }
                            ]}
                          />
                        </div>
                      );
                    }
                  })()}
                </div>
              </div>
            </div>

            {/* =============== LEFT PANEL (Absolute Overlay) =============== */}
            <div 
              className={`absolute top-0 left-0 h-full flex flex-col bg-[#0e0e0e] border-r border-[#1f1f1f] z-30 ${
                isDraggingState 
                  ? 'shadow-[0_0_40px_rgba(255,109,0,0.3)]' 
                  : 'shadow-2xl transition-shadow duration-300'
              }`}
              style={{ 
                width: `${leftPanelWidth}px`,
                pointerEvents: isDraggingState ? 'none' : 'auto',
                overflow: 'visible'
              }}
            >
              {/* Collapsed vertical icon bar (shown when width < 100px) */}
              {leftPanelWidth < 100 ? (
                <div className="flex flex-col items-center py-4 gap-4 h-full bg-[#0e0e0e]">
                  {/* Vertical tabs with text and icons */}
                  {[
                    { id: 'problem', icon: FileText, label: 'Problem' },
                    { id: 'editorial', icon: FileCode, label: 'Editorial' },
                    { id: 'submissions', icon: Play, label: 'Submissions' },
                    { id: 'discussion', icon: MessageSquare, label: 'Discussion' },
                    { id: 'notes', icon: Bookmark, label: 'Notes' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      className={`flex flex-col items-center gap-3 py-3 transition-colors group ${
                        activeTab === tab.id
                          ? 'text-[#FF6D00]'
                          : 'text-gray-500 hover:text-gray-300'
                      }`}
                      onClick={() => {
                        navigate(`/dsa/${topicId}/${subtopicId || actualProblemId}/${actualProblemId}?tab=${tab.id}`);
                        setLeftPanelWidth(600); // Auto-expand when clicking
                      }}
                      title={tab.label}
                    >
                      {/* Vertical text */}
                      <div 
                        className={`text-[10px] font-medium tracking-wider ${activeTab === tab.id ? 'text-[#FF6D00]' : 'text-gray-500 group-hover:text-gray-300'}`}
                        style={{ 
                          writingMode: 'vertical-rl',
                          transform: 'rotate(180deg)'
                        }}
                      >
                        {tab.label}
                      </div>
                      
                      {/* Icon */}
                      <tab.icon size={16} className={activeTab === tab.id ? 'text-[#FF6D00]' : 'text-gray-500 group-hover:text-gray-300'} />
                    </button>
                  ))}
                </div>
              ) : (
              <>
              {/* Expanded panel content (shown when width >= 100px) */}
              {/* Tabs */}
              <div className="flex border-b border-[#1f1f1f] px-4 sticky top-0 bg-[#0e0e0e] z-10 overflow-x-hidden">
                {[
                  { id: 'problem', icon: FileText, label: 'Problem' },
                  { id: 'editorial', icon: FileCode, label: 'Editorial' },
                  { id: 'submissions', icon: Play, label: 'Submissions' },
                  { id: 'discussion', icon: MessageSquare, label: 'Discussion' },
                  { id: 'notes', icon: Bookmark, label: 'Notes' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'text-white border-b-2 border-[#FF6D00]'
                        : 'text-gray-400 hover:text-gray-300'
                    }`}
                    onClick={() => navigate(`/dsa/${topicId}/${subtopicId || actualProblemId}/${actualProblemId}?tab=${tab.id}`)}
                  >
                    <tab.icon size={16} />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {isSwitchingProblem ? (
                  <div className="flex h-full min-h-0 p-6">
                    <div className="w-full flex-1 min-h-0 rounded-xl bg-[#141414] p-6 border border-[#1f1f1f] flex flex-col gap-5">
                      <div>
                        <div className="w-2/3 h-6 rounded-md skeleton" />
                        <div className="w-1/2 h-4 mt-3 rounded-md skeleton" />
                      </div>
                      <div className="w-full h-28 rounded-xl skeleton" />
                      <div className="w-full h-28 rounded-xl skeleton" />
                      <div className="flex-1 w-full rounded-xl skeleton" />
                    </div>
                  </div>
                ) : (
                  <>
                    {activeTab === 'problem' && (
                      <ProblemStatement
                        title={problem.title}
                        difficulty={(problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)) as 'Easy' | 'Medium' | 'Hard'}
                        coins={50}
                        description={problem.statement || problem.description}
                        examples={problem.examples || []}
                        constraints={(problem.constraints || []).map(text => ({ text }))}
                        hints={problem.hints || []}
                      />
                    )}
                    {activeTab === 'editorial' && (
                      <EditorialView
                        problem={problem}
                        isStudyViewActive={isStudyViewActive}
                        onStudyViewChange={setIsStudyViewActive}
                      />
                    )}
                    {activeTab === 'submissions' && <Submissions latestSubmission={latestSubmission} isSubmitting={isSubmitting} />}
                    {activeTab === 'discussion' && <Discussion problemId={problem._id} />}
                    {activeTab === 'notes' && <NotesEditor />}
                  </>
                )}
              </div>

              {/* 🎯 Sticky Footer Bar - Shows for all tabs */}
              <div className="sticky bottom-0 left-0 right-0 z-10 mt-auto border-t bg-[#0e0e0e] border-[#1f1f1f]">
                <div className="flex flex-row items-center justify-between px-4 py-1">
                  {/* Left side - Like, Dislike, Bug, Notes */}
                  <div className="flex items-center gap-x-3">
                    <button
                      onClick={() => {
                        setIsLiked(!isLiked);
                        if (isDisliked) setIsDisliked(false);
                      }}
                      className="flex items-center text-gray-400 cursor-pointer gap-x-2 hover:text-gray-300"
                      aria-pressed={isLiked}
                      aria-label="Like problem"
                    >
                      <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-current text-[#FF6D00]' : ''}`} />
                      <span className="text-sm">10</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsDisliked(!isDisliked);
                        if (isLiked) setIsLiked(false);
                      }}
                      className="flex items-center text-gray-400 cursor-pointer hover:text-gray-300"
                      aria-pressed={isDisliked}
                      aria-label="Dislike problem"
                    >
                      <ThumbsDown className={`w-4 h-4 ${isDisliked ? 'fill-current text-[#FF6D00]' : ''}`} />
                    </button>
                    <div className="h-[12px] w-[1px] bg-[#1f1f1f]"></div>
                    <button
                      type="button"
                      className="text-sm text-gray-400 transition-colors cursor-pointer hover:text-gray-300"
                      aria-label="Report a bug for this problem"
                    >
                      <Bug className="w-4 h-4" />
                    </button>
                   
                  </div>

                  {/* Right side - Auto-play, Prev/Next problem */}
                  <div className="flex items-center gap-x-3">
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={autoPlay}
                          onChange={handleCheckboxChange}
                          className="w-4 h-4 rounded border-2 border-gray-600 bg-gray-800 cursor-pointer accent-[#FF6D00] focus:ring-2 focus:ring-[#FF6D00] focus:ring-offset-0"
                          style={{
                            accentColor: '#FF6D00'
                          }}
                        />
                      </label>
                    </div>
                    <div className="h-[12px] w-[1px] bg-[#1f1f1f]"></div>
                    <div className="flex flex-row items-center justify-between text-gray-400 gap-x-2">
                      <button
                        type="button"
                        aria-label="Previous problem"
                        className="cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:text-gray-300"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <div className="h-[12px] w-[1px] bg-[#1f1f1f]"></div>
                      <button
                        type="button"
                        aria-label="Next problem"
                        className="cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:text-gray-300"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              </>
              )}
            </div>

            {/* 🎯 DRAG HANDLE (Positioned at right edge of left panel) */}
            <div
              className={`absolute top-0 h-full flex items-center justify-center cursor-col-resize z-40 group $${
                isDraggingState ? 'w-1' : 'w-3 hover:w-4'
              }`}
              style={{ 
                left: `${leftPanelWidth}px`,
                transform: 'translateX(-50%)', // Center the handle on the boundary
                pointerEvents: 'auto',
                transition: 'none'
              }}
              onMouseDown={handleDragStart}
              onDoubleClick={handleDoubleClick}
            >
              {/* Drag line */}
              <div className={`absolute h-full transition-all duration-200 ${
                isDraggingState 
                  ? 'w-[3px] bg-[#FF6D00] shadow-[0_0_10px_rgba(255,109,0,0.8)]'
                  : 'w-[2px] bg-[#2a2a2a] group-hover:bg-[#FF6D00] group-hover:w-[3px]'
              }`} />
              
              {/* Center circle button with glow */}
              <div className={`absolute top-1/2 -translate-y-1/2 rounded-full bg-[#FF6D00] border-2 border-[#0e0e0e] cursor-col-resize transition-all duration-150 ${
                isDraggingState
                  ? 'w-6 h-6 shadow-[0_0_20px_rgba(255,109,0,1)] scale-110'
                  : 'w-5 h-5 shadow-[0_0_10px_rgba(255,109,0,0.7)] group-hover:scale-125 group-hover:shadow-[0_0_16px_rgba(255,109,0,1)]'
              }`} />
            </div>
          </div>
        ) : (
          /* Mobile View - No Code Editor */
          <div className="flex flex-col flex-1 h-full overflow-hidden">
            {/* Mobile Tabs - Horizontal Scrollable */}
            <div className="flex border-b border-[#1f1f1f] px-0 sticky top-0 bg-[#0e0e0e] z-20 overflow-x-auto scrollbar-hide">
              {[
                { id: 'problem', icon: FileText, label: 'Problem' },
                { id: 'editorial', icon: BookOpen, label: 'Editorial' },
                { id: 'submissions', icon: Clock, label: 'Submissions' },
                { id: 'discussion', icon: Users, label: 'Discussion' },
                { id: 'notes', icon: Sparkles, label: 'Ai' }
              ].map(tab => (
                <button
                  key={tab.id}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium transition-colors relative whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-white border-b-2 border-[#FF6D00]'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                  onClick={() => navigate(`/dsa/${topicId}/${subtopicId || actualProblemId}/${actualProblemId}?tab=${tab.id}`)}
                >
                  <span>{tab.label}</span>
                  <tab.icon size={16} className="flex-shrink-0" />
                </button>
              ))}
            </div>

            {/* Mobile Content Area */}
            <div className="flex-1 overflow-y-auto bg-[#0e0e0e] pr-10">
              {isSwitchingProblem ? (
                <div className="flex h-full px-4 py-4">
                  <div className="w-full rounded-lg bg-[#141414] p-4 sm:p-5 border border-[#1f1f1f] flex flex-col gap-3 sm:gap-4">
                    <div>
                      <div className="w-2/3 h-4 rounded-md sm:h-5 skeleton" />
                      <div className="w-1/2 h-3 mt-2 rounded-md sm:h-4 skeleton" />
                    </div>
                    <div className="w-full h-20 rounded-lg sm:h-24 skeleton" />
                    <div className="w-full h-20 rounded-lg sm:h-24 skeleton" />
                    <div className="flex-1 w-full min-h-[100px] rounded-lg skeleton" />
                  </div>
                </div>
              ) : (
                <>
                  {activeTab === 'problem' && (
                    <ProblemStatement
                      title={problem.title}
                      difficulty={(problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)) as 'Easy' | 'Medium' | 'Hard'}
                      coins={50}
                      description={problem.statement || problem.description}
                      examples={problem.examples || []}
                      constraints={(problem.constraints || []).map(text => ({ text }))}
                      hints={problem.hints || []}
                    />
                  )}
                  {activeTab === 'editorial' && (
                    <EditorialView
                      problem={problem}
                      isStudyViewActive={isStudyViewActive}
                      onStudyViewChange={setIsStudyViewActive}
                    />
                  )}
                  {activeTab === 'submissions' && <Submissions latestSubmission={latestSubmission} isSubmitting={isSubmitting} />}
                  {activeTab === 'discussion' && <Discussion problemId={problem._id} />}
                  {activeTab === 'notes' && <NotesEditor />}
                </>
              )}
            </div>

            {/* Mobile Footer - Like/Dislike/Navigation */}
            <div className="sticky bottom-0 left-0 right-0 w-full border-t bg-[#0e0e0e] border-[#1f1f1f] z-10">
              <div className="flex flex-row items-center justify-between px-2 py-2 ml-2 sm:px-4 sm:py-1">
                {/* Left side - Like, Dislike, Bug */}
                <div className="flex items-center flex-shrink-0 gap-x-2 sm:gap-x-3">
                  <button
                    onClick={() => {
                      setIsLiked(!isLiked);
                      if (isDisliked) setIsDisliked(false);
                    }}
                    className="flex items-center text-gray-400 cursor-pointer gap-x-1.5 sm:gap-x-2 hover:text-gray-300"
                    aria-pressed={isLiked}
                    aria-label="Like problem"
                  >
                    <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-current text-[#FF6D00]' : ''}`} />
                    <span className="text-xs sm:text-sm">10</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsDisliked(!isDisliked);
                      if (isLiked) setIsLiked(false);
                    }}
                    className="flex items-center text-gray-400 cursor-pointer hover:text-gray-300"
                    aria-pressed={isDisliked}
                    aria-label="Dislike problem"
                  >
                    <ThumbsDown className={`w-4 h-4 ${isDisliked ? 'fill-current text-[#FF6D00]' : ''}`} />
                  </button>
                  <div className="h-[12px] w-[1px] bg-[#1f1f1f]"></div>
                  <button
                    type="button"
                    className="text-sm text-gray-400 transition-colors cursor-pointer hover:text-gray-300"
                    aria-label="Report a bug for this problem"
                  >
                    <Bug className="w-4 h-4" />
                  </button>
                </div>

                {/* Right side - Auto-play, Prev/Next problem */}
                <div className="flex items-center gap-x-1.5 sm:gap-x-3 pr-12 flex-shrink-0">
                  <div className="flex items-center">
                    <label className="flex items-center text-xs text-gray-400 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={autoPlay}
                        onChange={handleCheckboxChange}
                        className="w-4 h-4 rounded border-2 border-gray-600 bg-gray-800 cursor-pointer accent-[#FF6D00] focus:ring-2 focus:ring-[#FF6D00] focus:ring-offset-0"
                        style={{
                          accentColor: '#FF6D00'
                        }}
                      />
                    </label>
                  </div>
                  <div className="h-[12px] w-[1px] bg-[#1f1f1f]"></div>
                  <div className="flex flex-row items-center gap-x-1">
                    <button
                      type="button"
                      aria-label="Previous problem"
                      className="flex items-center justify-center text-gray-400 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:text-gray-300"
                    >
                      <ChevronLeft className="w-4 h-4 sm:w-3.5 sm:h-3.5" strokeWidth={2} />
                    </button>
                    <div className="h-[12px] w-[1px] bg-[#1f1f1f]"></div>
                    <button
                      type="button"
                      aria-label="Next problem"
                      className="flex items-center justify-center text-gray-400 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:text-gray-300"
                    >
                      <ChevronRight className="w-4 h-4 sm:w-3.5 sm:h-3.5" strokeWidth={2} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
        </>
      )}
      
      {/* Toast container */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-[100] pointer-events-none">
          <Toast message={toastMsg} variant={toastVariant} onClose={() => setToastMsg(null)} />
        </div>
      )}

      {/* Reset confirmation dialog */}
      <AlertDialog
        open={showResetDialog}
        onOpenChange={setShowResetDialog}
        title="Reset code"
        description="Are you sure you want to reset your code to the initial template for this language? This action cannot be undone."
        onConfirm={handleResetCode}
        confirmText="Reset"
        cancelText="Cancel"
      />
    </div>

    {/* Fullscreen Code Editor Overlay */}
    {isCodeEditorFullscreen && (
      <div className="fixed inset-0 z-[9999] bg-[#0e0e0e] flex flex-col">
        {/* Fullscreen Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-[#1f1f1f] bg-[#0b0b0b]">
          <div className="flex items-center gap-3">
            <select
              value={language}
              onChange={e => setLanguage(e.target.value)}
              className="px-3 py-1 text-xs bg-[#1f1f1f] border border-[#2a2a2a] rounded text-gray-300"
            >
              <option value="cpp">C++</option>
              <option value="java">Java</option>
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            {/* 4 Control Buttons */}
            <div className="flex items-center gap-1.5 border-r border-[#2a2a2a] pr-3">
              <button 
                onClick={() => {
                  setEditorKey(prev => prev + 1);
                }}
                className="p-1.5 text-gray-400 hover:text-gray-300 hover:bg-[#1f1f1f] rounded transition-colors" 
                title="Reset Code"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                  <path d="M21 3v5h-5"></path>
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                  <path d="M8 16H3v5"></path>
                </svg>
              </button>
              
              <button 
                onClick={() => {
                  navigator.clipboard.writeText('Code copied!');
                }}
                className="p-1.5 text-gray-400 hover:text-gray-300 hover:bg-[#1f1f1f] rounded transition-colors" 
                title="Copy Code"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                </svg>
              </button>
              
              <button 
                onClick={() => {
                  if (codeEditorRef.current) {
                    codeEditorRef.current.formatCode();
                  }
                }}
                className="p-1.5 text-gray-400 hover:text-gray-300 hover:bg-[#1f1f1f] rounded transition-colors" 
                title="Format Code"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="16" height="6" x="2" y="2" rx="2"></rect>
                  <path d="M10 16v-2a2 2 0 0 1 2-2h8a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"></path>
                  <rect width="4" height="6" x="8" y="16" rx="1"></rect>
                </svg>
              </button>
              
              <button 
                onClick={() => setIsCodeEditorFullscreen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-300 hover:bg-[#1f1f1f] rounded transition-colors" 
                title="Exit Fullscreen"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 3v3a2 2 0 0 1-2 2H3"></path>
                  <path d="M21 8h-3a2 2 0 0 1-2-2V3"></path>
                  <path d="M3 16h3a2 2 0 0 1 2 2v3"></path>
                  <path d="M16 21v-3a2 2 0 0 1 2-2h3"></path>
                </svg>
              </button>
            </div>
            
            {/* Font Size Dropdown */}
            <div className="relative">
              <button 
                type="button"
                onClick={() => setShowFontSizeDropdown(!showFontSizeDropdown)}
                className="flex items-center gap-1.5 px-2 py-1 text-xs text-gray-400 hover:text-gray-300 bg-[#1f1f1f] hover:bg-[#2a2a2a] border border-[#2a2a2a] rounded transition-colors h-8"
              >
                <span>{editorConfig.fontSize}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6"></path>
                </svg>
              </button>
              
              {showFontSizeDropdown && (
                <div className="absolute top-full mt-1 right-0 bg-[#1a1a1a] border border-[#2a2a2a] rounded shadow-lg z-50 py-1 min-w-[60px]">
                  {[12, 13, 14, 15, 16, 17, 18, 19, 20].map(size => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => {
                        updateEditorConfig({ fontSize: size });
                        setShowFontSizeDropdown(false);
                      }}
                      className={`w-full px-3 py-1.5 text-xs text-left hover:bg-[#2a2a2a] transition-colors ${
                        editorConfig.fontSize === size ? 'text-orange-400 bg-[#2a2a2a]' : 'text-gray-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Run Button */}
            <button
              className="h-8 px-4 rounded-md text-sm font-medium bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white flex items-center gap-1"
              onClick={async () => {
                try {
                  console.log('Run button clicked');
                  const code = editorContent[actualProblemId] || defaultCode;
                  setShowSkeleton(true);
                  setShowTestResults(false);
                  const testPromise = runTests(actualProblemId, code, language);
                  await Promise.all([
                    testPromise,
                    new Promise(resolve => setTimeout(resolve, 3000))
                  ]);
                  setShowSkeleton(false);
                  setShowTestResults(true);
                } catch (error) {
                  console.error('Error running tests:', error);
                  setShowSkeleton(false);
                  setToastVariant('error');
                  setToastMsg('Failed to run tests');
                  setShowTestResults(false);
                }
              }}
            >
              <Play size={14} />
              Run
            </button>
            
            {/* Submit Button */}
            <button
              className="h-8 px-5 rounded-md text-sm font-medium text-white bg-[#FF6D00] hover:bg-[#ff7a1a]"
              onClick={async () => {
                try {
                  const result = await submissionService.runLocally(
                    problem?.testCases || [],
                    editorContent[actualProblemId] || defaultCode,
                    language,
                    actualProblemId
                  );
                  if (result.status === 'accepted') {
                    await updateProgress('solved', actualProblemId);
                  }
                } catch {
                  // Error handling
                }
              }}
            >
              Submit
            </button>
          </div>
        </div>

        {/* Code Editor */}
        <div className="relative flex-1 overflow-hidden">
          <CodeEditor
            ref={codeEditorRef}
            key={editorKey}
            problemId={actualProblemId}
            language={language}
            defaultCode={defaultCode}
            onChange={value => {
              if (value !== undefined) updateEditorContent(actualProblemId, value);
            }}
          />
        </div>
      </div>
    )}
    </>
  );
};

// 📌 Editorial View Component
type EditorialViewProps = {
  problem: any; // Type from API - matches IProblem from backend
  isStudyViewActive?: boolean;
  onStudyViewChange?: (show: boolean) => void;
};

const EditorialView = ({ problem, isStudyViewActive, onStudyViewChange }: EditorialViewProps) => {
  // Debug: Log entire problem object
  console.log('=== EditorialView Debug ===');
  console.log('Full problem object:', problem);
  console.log('Has editorial?', !!problem.editorial);
  console.log('Editorial value:', problem.editorial);
  console.log('Editorial sections:', problem.editorial?.sections);
  console.log('Starter code:', problem.starterCode);
  console.log('========================');

  // If no editorial, show message
  if (!problem.editorial) {
    return (
      <div className="flex items-center justify-center h-full p-8 text-center">
        <div>
          <h2 className="mb-2 text-xl font-semibold text-gray-400">Editorial Not Available</h2>
          <p className="text-gray-500">This problem doesn't have an editorial yet.</p>
        </div>
      </div>
    );
  }

  const { editorial } = problem;

  return (
    <Editorial
      showStudyView={isStudyViewActive}
      onStudyViewChange={onStudyViewChange}
      title={problem.title}
      videoUrl={editorial.videoUrl}
      sections={editorial.sections || []}
      dryRunImages={editorial.dryRunImages || []}
      solutions={editorial.solutions || {}}
      timeComplexity={editorial.timeComplexity || "O(n)"}
      spaceComplexity={editorial.spaceComplexity || "O(1)"}
    />
  );
};

export default ProblemPage;
