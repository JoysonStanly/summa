import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import UnifiedSidebar from "@/shared/components/layout/UnifiedSidebar";
import { ProblemStatement, CodeEditor, TestCases, Submissions } from '../components';
// import { getProblem } from '../data/problems'; // OLD: Static data
import {
  Play,
  Bookmark,
  FileText,
  MessageSquare,
  FileCode,
  ChevronLeft,
  BrainCircuit,
  Settings,
  RotateCcw,
  Code
} from 'lucide-react';
import Editorial from '../editorial/Editorial';
import Discussion from "@/shared/components/ui/Discussion";
import NotesEditor from "@/shared/components/ui/NotesEditor";
import Toast from "@/shared/components/ui/Toast";
import { useProblemStore } from "@/store/problemStore";
import submissionService from '../services/submissionService';
import { useUserStore } from "@/store/userStore";
import { useDSAProblems } from '../hooks/useDSAProblems';

const ProblemPage = () => {
  const { topicId = '', subtopicId = '', problemId = '' } = useParams<{ topicId: string; subtopicId?: string; problemId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const tabFromUrl = searchParams.get('tab') || 'problem';

  const [activeTab, setActiveTab] = useState(tabFromUrl);
  const [isStudyViewActive, setIsStudyViewActive] = useState(false);
  const { setLanguageForProblem, getLanguageForProblem, updateEditorContent } = useProblemStore();
  
  // Determine actual problemId - it could be in problemId or subtopicId param depending on route structure
  const actualProblemId = problemId || subtopicId || '';
  const initialLang = getLanguageForProblem(actualProblemId) || 'java';
  const [language, setLanguage] = useState(initialLang);
  const [selectedTestCase, setSelectedTestCase] = useState('1');
  const [editorKey, setEditorKey] = useState(0);
  // Screen size tracking for responsive behavior
  const [isLg, setIsLg] = useState(() => typeof window !== 'undefined' ? window.innerWidth >= 1024 : true);

  // 🎯 Drag-to-overlay state
  const [leftPanelWidth, setLeftPanelWidth] = useState(600); // Default 600px
  const [isDraggingState, setIsDraggingState] = useState(false); // For UI feedback
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartWidth = useRef(0);

  const MIN_WIDTH = 40; // Minimum - keep handle visible
  const MAX_WIDTH = typeof window !== 'undefined' ? window.innerWidth - 400 : 900; // Leave 400px for right panel

  // const { addCompletedProblem, updateStreak } = useUserStore(); // OLD
  const { updateProgress } = useUserStore(); // NEW: Use API-based progress
  const { currentProblem, fetchProblem, isLoading, error: problemError } = useProblemStore();
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [toastVariant, setToastVariant] = useState<'success' | 'error' | 'info' | 'warning'>('info');

  // 🔥 NEW: Fetch DSA problems dynamically from backend
  const { topics: dsaTopics, loading: topicsLoading } = useDSAProblems();

  // Fetch problem from API
  useEffect(() => {
    if (actualProblemId) {
      fetchProblem(actualProblemId);
    }
  }, [actualProblemId, fetchProblem]);

  const problem = currentProblem; // Use API data instead of static getProblem()

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

  // 🎯 Drag handler implementation
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

  if (!problem) return null;

  const languages = {
    java: 'Java',
    python: 'Python',
    javascript: 'JavaScript',
    typescript: 'TypeScript',
    cpp: 'C++'
  };

  const getLanguageKey = (value: string): keyof typeof languages =>
    (Object.keys(languages).find(key => languages[key as keyof typeof languages] === value) || 'typescript') as keyof typeof languages;

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const langKey = getLanguageKey(e.target.value);
    setLanguage(langKey);
    setLanguageForProblem(actualProblemId, langKey);
  };

  // Use starterCode from API (not defaultCode from static data)
  const defaultCode = problem.starterCode?.[language as keyof typeof problem.starterCode] || 
    problem.starterCode?.typescript || 
    `// Write your solution here for ${problem.title}\n\nfunction solution() {\n  // Your code here\n}`;



  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Conditional rendering: Show only Editorial in Study View */}
      {isStudyViewActive ? (
        <EditorialView 
          problem={problem} 
          isStudyViewActive={isStudyViewActive}
          onStudyViewChange={setIsStudyViewActive}
        />
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
                      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 21 20" fill="none">
                        <g clipPath="url(#clip0_2952_20139)">
                          <path d="M10.5039 20.0039C16.0268 20.0039 20.5039 15.5268 20.5039 10.0039C20.5039 4.48106 16.0268 0.00390625 10.5039 0.00390625C4.98106 0.00390625 0.503906 4.48106 0.503906 10.0039C0.503906 15.5268 4.98106 20.0039 10.5039 20.0039Z" fill="#FACC15"></path>
                          <path d="M10.5057 18.3787C15.13 18.3787 18.8787 14.63 18.8787 10.0057C18.8787 5.3815 15.13 1.63281 10.5057 1.63281C5.8815 1.63281 2.13281 5.3815 2.13281 10.0057C2.13281 14.63 5.8815 18.3787 10.5057 18.3787Z" fill="#E0990A"></path>
                          <path d="M10.5028 17.6618C14.7327 17.6618 18.1618 14.2327 18.1618 10.0028C18.1618 5.77281 14.7327 2.34375 10.5028 2.34375C6.27281 2.34375 2.84375 5.77281 2.84375 10.0028C2.84375 14.2327 6.27281 17.6618 10.5028 17.6618Z" fill="#E0990A"></path>
                          <path opacity="0.1" d="M17.3951 2.76172L2.75391 16.3225C2.9842 16.6044 3.22976 16.8735 3.48866 17.1288L18.1435 3.55513C17.9088 3.27709 17.6586 3.01262 17.3951 2.76172Z" fill="#121212"></path>
                          <path opacity="0.1" d="M18.9004 4.57422L4.44922 17.959C5.16603 18.5054 5.95945 18.9558 6.80959 19.2942L20.0536 7.02743C19.7811 6.15135 19.3891 5.32861 18.9004 4.57422Z" fill="#121212"></path>
                          <path opacity="0.1" d="M14.1415 0.6875L0.9375 12.9172C1.22258 13.8541 1.64147 14.7322 2.17186 15.5302L16.6521 2.11822C15.8948 1.52697 15.0508 1.04312 14.1415 0.6875Z" fill="#121212"></path>
                          <path d="M3.16406 8.98659H4.58581L4.04596 11.7714H5.18409L5.68127 8.98659H7.07248L7.17987 8.44141H3.27242L3.16406 8.98659Z" fill="#E0990A"></path>
                          <path d="M7.5403 8.44141L7.09766 10.9336L7.78902 11.7714H10.8313L11.4121 8.44141H10.299L9.80807 11.2173H8.42535L8.20403 10.9475L8.63261 8.44141H7.5403Z" fill="#E0990A"></path>
                          <path d="M17.1807 8.44141L17.0815 9.01083H17.6349L17.5455 9.50657H16.9921L16.8929 10.0728H16.3683L16.4675 9.50657H15.9141L16.0004 9.01083H16.5569L16.6561 8.44141H17.1807Z" fill="#E0990A"></path>
                          <path d="M11.2031 11.7714H12.2996L12.477 10.6583H15.2514L15.3617 10.1065H12.5812L12.7097 9.26803L13.0343 8.98005H14.449L14.339 9.54972H15.4475L15.6434 8.44141H12.6118L11.638 9.27409L11.2031 11.7714Z" fill="#E0990A"></path>
                          <path d="M3.37891 8.7798H4.80066L4.2608 11.5646H5.39893L5.89612 8.7798H7.28732L7.39471 8.23438H3.48726L3.37891 8.7798Z" fill="#FACC15"></path>
                          <path d="M7.75515 8.23438L7.3125 10.7269L8.0041 11.5646H11.0464L11.6272 8.23438H10.5138L10.0229 11.0102H8.64019L8.41887 10.7407L8.84746 8.23438H7.75515Z" fill="#FACC15"></path>
                          <path d="M17.3994 8.23438L17.3003 8.8038H17.8537L17.7642 9.29954H17.2108L17.1117 9.86581H16.5871L16.6862 9.29954H16.1328L16.2191 8.8038H16.7757L16.8748 8.23438H17.3994Z" fill="#FACC15"></path>
                          <path d="M11.418 11.5646H12.5144L12.6918 10.4512H15.4663L15.5766 9.89951H12.7961L12.9246 9.061L13.2492 8.77326H14.6641L14.5538 9.34268H15.6624L15.8582 8.23438H12.8266L11.8529 9.06706L11.418 11.5646Z" fill="#FACC15"></path>
                        </g>
                        <defs>
                          <clipPath id="clip0_2952_20139">
                            <rect width="20" height="20" fill="white" transform="translate(0.5)"></rect>
                          </clipPath>
                        </defs>
                      </svg>
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
                            <span className="text-[#637381] dark:text-gray-300 italic">Great going! Earn TUF+ Coins—exclusive rewards coming soon!</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <button className="relative flex items-center gap-3 px-4 py-2 text-white transition-all duration-200 ease-in-out bg-gray-700 rounded-md hover:bg-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700" aria-label="Toggle To-Do Window">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 25 24" fill="none">
                    <path d="M12.5 22C12.8574 22 13.2149 21.98 13.5634 21.9401C14.1589 21.8719 14.3933 21.2073 14.115 20.6764C13.9048 20.2755 13.4476 19.9793 12.9952 19.9943C12.8229 20 12.654 20 12.5 20C8.1 20 4.5 16.4 4.5 12C4.5 7.6 8.1 4 12.5 4C13.0776 4 13.6031 4.05213 14.1141 4.15639C14.479 4.23085 14.8633 4.13667 15.1267 3.87332C15.6657 3.33425 15.4471 2.41754 14.7023 2.2549C13.9805 2.09727 13.2403 2 12.5 2C7 2 2.5 6.5 2.5 12C2.5 17.5 7 22 12.5 22ZM9.7 12.2C9.3134 11.8134 9.3134 11.1866 9.7 10.8C10.0866 10.4134 10.7134 10.4134 11.1 10.8L13.5 13.2L21.4 5.3C21.7866 4.9134 22.4134 4.9134 22.8 5.3C23.1866 5.6866 23.1866 6.3134 22.8 6.7L14.2071 15.2929C13.8166 15.6834 13.1834 15.6834 12.7929 15.2929L9.7 12.2Z" fill="#919EAB"></path>
                  </svg>
                </button>
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
                  
                  <button
                    className="h-8 px-4 rounded-md text-sm font-medium bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white flex items-center gap-1"
                    onClick={async () => {
                      const result = await submissionService.runLocally(actualProblemId, '', language);
                      setToastVariant(result.status === 'accepted' ? 'success' : 'warning');
                      setToastMsg(`${result.message} • ${result.timeTaken}ms • ${result.memory}MB`);
                    }}
                  >
                    <Play size={14} />
                    Run
                  </button>
                  <button
                    className="h-8 px-5 rounded-md text-sm font-medium text-white bg-[#FF6D00] hover:bg-[#ff7a1a]"
                    onClick={async () => {
                      try {
                        const result = await submissionService.runLocally(actualProblemId, '', language);
                        if (result.status === 'accepted') {
                          // Update progress via API
                          await updateProgress('solved', actualProblemId);
                        }
                        setToastVariant(result.status === 'accepted' ? 'success' : 'error');
                        setToastMsg(result.message || 'Submitted successfully!');
                      } catch (error) {
                        setToastVariant('error');
                        setToastMsg('Failed to submit solution');
                      }
                    }}
                  >
                    Submit
                  </button>
                </div>
              </div>

              {/* Code Editor */}
              <div className="flex-1 overflow-hidden">
                <CodeEditor
                  key={editorKey}
                  problemId={actualProblemId}
                  language={language}
                  defaultCode={defaultCode}
                  onChange={value => {
                    if (value !== undefined) updateEditorContent(actualProblemId, value);
                  }}
                />
              </div>

              {/* Test Cases */}
              <div className="border-t border-[#1f1f1f]">
                <TestCases
                  testCases={problem.testCases || []}
                  selectedTestCase={selectedTestCase}
                  onSelectTestCase={setSelectedTestCase}
                />
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
              {/* Header */}
              <div className="flex items-center gap-3 px-5 py-3 border-b border-[#1f1f1f] sticky top-0 bg-[#0e0e0e] z-20">
                <button
                  onClick={() => navigate('/dsa')}
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  <ChevronLeft size={20} />
                </button>
                <h1 className="text-lg font-semibold truncate">{problem.title}</h1>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-[#1f1f1f] px-4 sticky top-[52px] bg-[#0e0e0e] z-10 overflow-x-hidden">
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
                {activeTab === 'problem' && (
                  <ProblemStatement
                    title={problem.title}
                    difficulty={(problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)) as 'Easy' | 'Medium' | 'Hard'}
                    coins={50}
                    description={problem.description}
                    examples={problem.examples || []}
                    constraints={(problem.constraints || []).map(text => ({ text }))}
                  />
                )}
                {activeTab === 'editorial' && (
                  <EditorialView
                    problem={problem}
                    isStudyViewActive={isStudyViewActive}
                    onStudyViewChange={setIsStudyViewActive}
                  />
                )}
                {activeTab === 'submissions' && <Submissions />}
                {activeTab === 'discussion' && <Discussion />}
                {activeTab === 'notes' && <NotesEditor />}
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
          /* Mobile View - No Split */
          <div className="flex flex-col flex-1 h-full overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-3 border-b border-[#1f1f1f] sticky top-0 bg-[#0e0e0e] z-20">
              <button
                onClick={() => navigate('/dsa')}
                className="text-gray-400 transition-colors hover:text-white"
              >
                <ChevronLeft size={20} />
              </button>
              <h1 className="text-lg font-semibold truncate">{problem.title}</h1>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[#1f1f1f] px-4 sticky top-[52px] bg-[#0e0e0e] z-10 overflow-x-auto no-scrollbar">
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
                  onClick={() => navigate(`/dsa/${topicId}/${problemId}?tab=${tab.id}`)}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 px-6 py-4 overflow-y-auto">
              {activeTab === 'problem' && (
                <ProblemStatement
                  title={problem.title}
                  difficulty={(problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)) as 'Easy' | 'Medium' | 'Hard'}
                  coins={50}
                  description={problem.description}
                  examples={problem.examples || []}
                  constraints={(problem.constraints || []).map(text => ({ text }))}
                />
              )}
              {activeTab === 'editorial' && (
                <EditorialView
                  problem={problem}
                  isStudyViewActive={isStudyViewActive}
                  onStudyViewChange={setIsStudyViewActive}
                />
              )}
              {activeTab === 'submissions' && <Submissions />}
              {activeTab === 'discussion' && <Discussion />}
              {activeTab === 'notes' && <NotesEditor />}
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
    </div>
  );
};

// 📌 Editorial View Component
type EditorialViewProps = {
  problem: any; // Type from API - matches IProblem from backend
  isStudyViewActive?: boolean;
  onStudyViewChange?: (show: boolean) => void;
};

const EditorialView = ({ problem, isStudyViewActive, onStudyViewChange }: EditorialViewProps) => {
  // Content from your EditorialPage
  const intuitionContent = `
The naive way is to think of a data structure that does not store duplicate elements — HashSet.
Keep track of unique elements in the hashset, and at last copy all the elements from the HashSet
back to the original array.
  `;

  const approachContent = `
• Traverse through the array, similar to the idea of scanning each book serially.
• Check if the current element of array is equal to the target element.
• If so, return the index and stop scanning further.
• In case the target value is not found, return -1 marking that the target element is missing.
  `;

  return (
    <Editorial
      showStudyView={isStudyViewActive}
      onStudyViewChange={onStudyViewChange}
      // Main header content
      title={problem.title}
      subtitle="Brute force approach"
      videoThumbnail="/images/session-dp.jpg"
      videoUrl="https://example.com/video"

      // Editorial explanation sections
      sections={[
        {
          title: 'Intuition',
          content: intuitionContent,
        },
        {
          title: 'Approach',
          content: approachContent,
        },
      ]}

      // Dry run images (optional)
      dryRunImages={[
        {
          id: '1',
          src: '/images/session-dp.jpg',
          alt: 'Dry run step 1',
        },
        {
          id: '2',
          src: '/images/session-graph.jpg',
          alt: 'Dry run step 2',
        },
      ]}

      // Solutions in different languages (using problem's starter code from API)
      solutions={problem.starterCode || {}}

      // Complexity analysis
      timeComplexity="O(N), in worst case the entire array will be traversed, taking time N where N is the size of the array."
      spaceComplexity="O(1), no extra space is used apart from the input array."
    />
  );
};

export default ProblemPage;
