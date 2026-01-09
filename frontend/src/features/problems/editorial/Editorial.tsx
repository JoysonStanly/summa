import { useState, useRef, useEffect, type FC } from 'react';
import type { EditorialProps, SolutionType } from './types';
import ImageCarousel from './ImageCarousel';
import CodeTabs from './CodeTabs';
import { ThumbsUp, ThumbsDown, Bug, StickyNote, X, Check } from 'lucide-react';

const Editorial: FC<EditorialProps> = ({
  title,
  videoUrl,
  sections,
  dryRunImages,
  solutions,
  timeComplexity,
  spaceComplexity,
  solutionTypes,
  showStudyView: externalShowStudyView,
  onStudyViewChange
}) => {
  // Get first available language from solutions
  const firstAvailableLanguage = Object.keys(solutions)[0] || 'cpp';
  const [activeLanguage, setActiveLanguage] = useState<string>(firstAvailableLanguage);
  const [internalShowStudyView, setInternalShowStudyView] = useState(false);
  const showStudyView = externalShowStudyView ?? internalShowStudyView;
  
  const [activeSolutionType, setActiveSolutionType] = useState<SolutionType>(
    solutionTypes && solutionTypes.length > 0 ? solutionTypes[0] : 'brute'
  );
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const [showDraggableNotice, setShowDraggableNotice] = useState(true);
  const [videoPosition, setVideoPosition] = useState({ top: 150, left: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ y: 0, startTop: 0 });
  
  const handleDragStart = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ y: e.clientY, startTop: videoPosition.top });
  };

  const handleDragMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaY = e.clientY - dragStart.y;
    const newTop = Math.max(0, Math.min(dragStart.startTop + deltaY, window.innerHeight - 400));
    setVideoPosition({ ...videoPosition, top: newTop });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };
  
  const handleStudyViewToggle = (newValue: boolean) => {
    if (onStudyViewChange) {
      onStudyViewChange(newValue);
    } else {
      setInternalShowStudyView(newValue);
    }
  };

  // Filter sections based on active solution type
  const filteredSections = solutionTypes && solutionTypes.length > 1
    ? sections.filter(section => !section.solutionType || section.solutionType === activeSolutionType)
    : sections;

  const solutionLabels: Record<SolutionType, string> = {
    brute: 'Brute',
    better: 'Better',
    optimal: 'Optimal'
  };

  return (
    <>
      {!showStudyView ? (
        // Normal Editorial View
        <div className="relative flex flex-col w-full h-full">
          <div className="relative flex-1 overflow-hidden">
            <div className="w-full h-full px-4 py-4 sm:px-5 sm:py-5 md:px-6 md:py-6 overflow-y-auto">
              {/* Top Bar with Solution Type Tabs and Study View Toggle */}
              <div className="flex flex-col items-start justify-between gap-3 mb-4 sm:flex-row sm:items-center sm:mb-3">
                {/* Solution Type Buttons */}
                {solutionTypes && solutionTypes.length > 0 ? (
                  <div className="flex flex-wrap items-center gap-1 px-2 py-1 rounded-lg sm:gap-2 bg-zinc-800/50 w-fit backdrop-blur-sm">
                    {solutionTypes.map((type, index) => (
                      <div key={type} className="flex items-center">
                        <button
                          type="button"
                          onClick={() => setActiveSolutionType(type)}
                          className={`text-xs sm:text-sm cursor-pointer transition-colors max-w-[120px] sm:max-w-[140px] truncate text-left py-1.5 px-2 sm:px-3 rounded ${
                            activeSolutionType === type ? 'text-white bg-zinc-700/50' : 'text-zinc-400'
                          }`}
                        >
                          {solutionLabels[type]}
                        </button>
                        {index < solutionTypes.length - 1 && (
                          <span className="mx-1 text-zinc-600">|</span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-2 px-2 py-1 rounded-lg bg-zinc-800/50 w-fit backdrop-blur-sm">
                    <button
                      type="button"
                      className="text-xs sm:text-sm cursor-pointer transition-colors max-w-[140px] truncate text-left py-1.5 px-2 sm:px-3 text-zinc-300"
                    >
                      Solution
                    </button>
                  </div>
                )}

                {/* Study View Toggle */}
                <div className="flex items-center justify-end flex-shrink-0 gap-2 px-4 py-2">
                  <p className="text-sm text-grayText">Study View</p>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={showStudyView}
                      onChange={(e) => handleStudyViewToggle(e.target.checked)}
                    />
                    <div className="w-10 h-6 transition-all bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:bg-primary"></div>
                    <div className="absolute w-4 h-4 transition-all transform bg-white rounded-full top-1 left-1 peer-checked:translate-x-4"></div>
                  </label>
                </div>
              </div>

              {/* Video Section */}
              <div className="relative mb-4 overflow-hidden rounded-lg sm:mb-6 video-container aspect-video bg-zinc-900">
                {videoUrl ? (
                  <iframe
                    src={videoUrl}
                    title="Editorial video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full border-0"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full">
                    <p className="text-zinc-500 text-sm">No video available</p>
                  </div>
                )}
              </div>

              {/* Editorial Content */}
              <div className="space-y-4 sm:space-y-6 editorial-content">
                {/* Sections (Intuition, Approach, etc.) */}
                {filteredSections.map((section, index) => (
                  <div key={index} className="space-y-2 sm:space-y-3">
                    <h1 className="text-lg font-bold text-white sm:text-xl">{section.title}:</h1>
                    {typeof section.content === 'string' ? (
                      <div className="space-y-2 text-sm leading-relaxed sm:text-base text-zinc-300">
                        {section.content.split('\n').map((line, i) => {
                          const trimmedLine = line.trim();
                          if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-')) {
                            return (
                              <li key={i} className="ml-4 list-disc list-inside">
                                {trimmedLine.substring(1).trim()}
                              </li>
                            );
                          }
                          return trimmedLine ? <p key={i}>{trimmedLine}</p> : null;
                        })}
                      </div>
                    ) : (
                      section.content
                    )}
                  </div>
                ))}

                {/* Dry Run Section */}
                {dryRunImages && dryRunImages.length > 0 && (
                  <div className="space-y-2 sm:space-y-3">
                    <h3 className="text-lg font-bold text-white sm:text-xl">Dry Run</h3>
                    <ImageCarousel images={dryRunImages} />
                  </div>
                )}

                {/* Solution Section */}
                <div className="space-y-2 sm:space-y-3">
                  <h3 className="text-lg font-bold text-white sm:text-xl">Solution</h3>
                  <CodeTabs
                    solutions={solutions}
                    activeLanguage={activeLanguage}
                    onLanguageChange={setActiveLanguage}
                  />
                </div>

                {/* Complexity Analysis */}
                <div className="pb-4 space-y-2 sm:space-y-3">
                  <h3 className="text-lg font-bold text-white sm:text-xl">Complexity Analysis</h3>
                  <div className="p-3 space-y-2 rounded-lg sm:space-y-3 bg-zinc-800/30 sm:p-4">
                    <div className="text-sm sm:text-base">
                      <span className="font-semibold text-white">Time Complexity: </span>
                      <span className="text-zinc-300">{timeComplexity}</span>
                    </div>
                    <div className="text-sm sm:text-base">
                      <span className="font-semibold text-white">Space Complexity: </span>
                      <span className="text-zinc-300">{spaceComplexity}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Study View Mode with React Split
        <div className="h-screen flex flex-col w-full overflow-hidden bg-[var(--layout-outer-bg)]">
          <div className="flex-1 flex overflow-hidden w-full bg-[var(--background)] p-2">
            <div className="flex w-full h-full">
              {/* Desktop View */}
              <div className="hidden w-full h-full md:flex">
                <SplitPane
                  title={title}
                  videoUrl={videoUrl}
                  showStudyView={showStudyView}
                  handleStudyViewToggle={handleStudyViewToggle}
                  showDraggableNotice={showDraggableNotice}
                  setShowDraggableNotice={setShowDraggableNotice}
                  videoPosition={videoPosition}
                  isDragging={isDragging}
                  handleDragStart={handleDragStart}
                  handleDragMove={handleDragMove}
                  handleDragEnd={handleDragEnd}
                  isLiked={isLiked}
                  setIsLiked={setIsLiked}
                  isDisliked={isDisliked}
                  setIsDisliked={setIsDisliked}
                  autoPlay={autoPlay}
                  setAutoPlay={setAutoPlay}
                  filteredSections={filteredSections}
                  dryRunImages={dryRunImages}
                  solutions={solutions}
                  activeLanguage={activeLanguage}
                  setActiveLanguage={setActiveLanguage}
                  timeComplexity={timeComplexity}
                  spaceComplexity={spaceComplexity}
                />
              </div>
              
              {/* Mobile View */}
              <div className="flex flex-col w-full h-full overflow-y-auto md:hidden">
                <div className="w-full py-3 px-4 bg-[var(--tab-content-bg)] border-b border-[var(--border)]">
                  <div className="flex flex-row items-center justify-between">
                    <p className="text-[var(--text)] font-medium">{title}</p>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={showStudyView}
                      onClick={() => handleStudyViewToggle(false)}
                      className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
                        showStudyView ? 'bg-[#FF6D00] text-white' : 'bg-zinc-700 text-zinc-300'
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
                          showStudyView ? 'translate-x-0' : '-translate-x-0'
                        }`}
                      />
                      <span>Study view</span>
                    </button>
                  </div>
                </div>
                
                <div className="flex-1 p-4 space-y-6 overflow-y-auto">
                  <div className="w-full aspect-video rounded-lg overflow-hidden bg-[var(--accent)]">
                    {videoUrl ? (
                      <iframe
                        src={videoUrl}
                        title="Editorial video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full border-0"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full">
                        <p className="text-zinc-500 text-sm">No video available</p>
                      </div>
                    )}
                  </div>
                  
                  {filteredSections.map((section, index) => (
                    <div key={index} className="space-y-3">
                      <h1 className="text-xl font-bold text-[var(--text)]">{section.title}:</h1>
                      {typeof section.content === 'string' ? (
                        <div className="text-sm text-[var(--muted-foreground)] leading-relaxed space-y-2">
                          {section.content.split('\n').map((line, i) => {
                            const trimmedLine = line.trim();
                            if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-')) {
                              return (
                                <li key={i} className="ml-4 list-disc list-inside">
                                  {trimmedLine.substring(1).trim()}
                                </li>
                              );
                            }
                            return trimmedLine ? <p key={i}>{trimmedLine}</p> : null;
                          })}
                        </div>
                      ) : (
                        section.content
                      )}
                    </div>
                  ))}
                  
                  {dryRunImages && dryRunImages.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-lg font-bold text-[var(--text)]">Dry Run</h3>
                      <ImageCarousel images={dryRunImages} />
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-[var(--text)]">Solution</h3>
                    <CodeTabs
                      solutions={solutions}
                      activeLanguage={activeLanguage}
                      onLanguageChange={setActiveLanguage}
                    />
                  </div>
                  
                  <div className="pb-8 space-y-3">
                    <h3 className="text-lg font-bold text-[var(--text)]">Complexity Analysis</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="font-semibold text-[var(--text)]">Time Complexity: </span>
                        <span className="text-[var(--muted-foreground)]">{timeComplexity}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-[var(--text)]">Space Complexity: </span>
                        <span className="text-[var(--muted-foreground)]">{spaceComplexity}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Split Pane Component for Study View
interface SplitPaneProps {
  title: string;
  videoUrl?: string;
  showStudyView: boolean;
  handleStudyViewToggle: (value: boolean) => void;
  showDraggableNotice: boolean;
  setShowDraggableNotice: (value: boolean) => void;
  videoPosition: { top: number; left: number };
  isDragging: boolean;
  handleDragStart: (e: React.MouseEvent) => void;
  handleDragMove: (e: React.MouseEvent) => void;
  handleDragEnd: () => void;
  isLiked: boolean;
  setIsLiked: (value: boolean) => void;
  isDisliked: boolean;
  setIsDisliked: (value: boolean) => void;
  autoPlay: boolean;
  setAutoPlay: (value: boolean) => void;
  filteredSections: EditorialProps['sections'];
  dryRunImages?: EditorialProps['dryRunImages'];
  solutions: EditorialProps['solutions'];
  activeLanguage: string;
  setActiveLanguage: (lang: string) => void;
  timeComplexity?: string;
  spaceComplexity?: string;
}

const SplitPane: FC<SplitPaneProps> = ({
  title,
  videoUrl,
  showStudyView,
  handleStudyViewToggle,
  showDraggableNotice,
  setShowDraggableNotice,
  videoPosition,
  isDragging,
  handleDragStart,
  handleDragMove,
  handleDragEnd,
  isLiked,
  setIsLiked,
  isDisliked,
  setIsDisliked,
  autoPlay,
  setAutoPlay,
  filteredSections,
  dryRunImages,
  solutions,
  activeLanguage,
  setActiveLanguage,
  timeComplexity,
  spaceComplexity,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [leftWidthPercent, setLeftWidthPercent] = useState<number>(50); // Start at 50%
  const [isResizing, setIsResizing] = useState(false);
  const startX = useRef(0);
  const startPercent = useRef(50);

  const handleResizeStart = (e: React.MouseEvent) => {
    setIsResizing(true);
    startX.current = e.clientX;
    startPercent.current = leftWidthPercent;
    e.preventDefault();
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  // Use useEffect for document-level mouse event handling
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !containerRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;
      const delta = e.clientX - startX.current;
      const deltaPercent = (delta / containerWidth) * 100;
      const newPercent = Math.max(35, Math.min(65, startPercent.current + deltaPercent));
      setLeftWidthPercent(newPercent);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, leftWidthPercent]);

  return (
    <div 
      ref={containerRef}
      className="react-split react-split--vertical"
      style={{ position: 'relative' }}
    >
      {/* Left Pane - Video */}
      <div className="react-split__pane" style={{ width: `${leftWidthPercent}%`, flexShrink: 0 }}>
        <div className="w-full h-full flex flex-col border border-[var(--border)] rounded-lg bg-[var(--tab-content-bg)]">
          {/* Header */}
          <div className="w-full rounded-t-lg py-2 px-3 border-b border-[var(--border)] bg-[var(--tab-content-bg)]">
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-row items-center flex-1 gap-x-2">
                <p className="ml-2 text-[var(--text)]">{title}</p>
                <div className="ml-2">
                  <button type="button" className="text-sm transition-colors cursor-pointer tuf-pill tuf-pill--active">
                    Solution
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-end flex-shrink-0 gap-3 px-2">
                <p className="text-sm font-medium text-[var(--muted-foreground)]">Study View</p>
                <label className="relative inline-flex items-center cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={showStudyView}
                    onChange={() => handleStudyViewToggle(false)}
                  />
                  <div className="w-11 h-6 bg-zinc-300 rounded-full peer dark:bg-zinc-700 peer-checked:bg-[#FF6D00] transition-all duration-300 ease-in-out border border-zinc-400 dark:border-zinc-600"></div>
                  <div className="absolute w-4 h-4 transition-all duration-300 ease-in-out bg-white border rounded-full shadow-lg top-1 left-1 peer-checked:translate-x-5 border-zinc-200 dark:border-zinc-300"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Video Content Area */}
          <div 
            className="relative flex-1 px-2 overflow-hidden select-none"
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            style={{ userSelect: isDragging ? 'none' : 'auto' }}
          >
            <div className="relative flex flex-col items-center justify-center w-full h-full">
              {/* Video Player */}
              <div 
                className={`w-full max-w-4xl px-2 py-1 absolute rounded-lg bg-[var(--accent)] gap-y-1 flex flex-col ${isDragging ? '' : 'transition-all duration-300 ease-out'} will-change-auto`}
                style={{ top: `${videoPosition.top}px`, left: '50%', transform: 'translateX(-50%)' }}
              >
                <div 
                  className="drag-handle rounded-full flex flex-row justify-center items-center h-[8px] transition duration-200 cursor-ns-resize"
                  onMouseDown={handleDragStart}
                >
                  <div className="rounded-full mx-auto w-8 h-[4px] bg-[var(--background)]"></div>
                </div>
                <div className="relative w-full overflow-hidden rounded-lg aspect-video">
                  <div 
                    className="absolute inset-0 z-20 pointer-events-auto" 
                    style={{ pointerEvents: 'auto', boxShadow: 'rgba(0, 0, 0, 0.35) 0px -50px 36px -28px inset' }}
                  ></div>
                  <div className="w-full h-full">
                    <div className="video-tab-content bg-[var(--background)]">
                      <div className="relative w-full h-full video-container aspect-video">
                        {videoUrl ? (
                          <iframe
                            src={videoUrl}
                            title="Editorial video"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            style={{ border: '0px', maxWidth: '100%', position: 'absolute', top: '0px', left: '0px', height: '100%', width: '100%' }}
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full">
                            <p className="text-zinc-500 text-sm">No video available</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Bar */}
          <div className="mt-auto bg-[var(--tab-content-bg)] border-t border-[var(--border)]">
            <div className="flex flex-row items-center justify-between px-4 py-1">
              <div className="flex items-center gap-x-3">
                <button
                  onClick={() => {
                    setIsLiked(!isLiked);
                    if (isDisliked) setIsDisliked(false);
                  }}
                  className="flex items-center gap-x-2 text-[var(--table-heading-text)] cursor-pointer"
                  aria-pressed={isLiked}
                  aria-label="Like problem"
                >
                  <ThumbsUp className={`w-4 h-4 stroke-[var(--table-heading-text)] ${isLiked ? 'fill-[var(--brand)] stroke-[var(--brand)]' : ''}`} />
                  <span className="text-sm interview-interaction-count">4</span>
                </button>
                <button
                  onClick={() => {
                    setIsDisliked(!isDisliked);
                    if (isLiked) setIsLiked(false);
                  }}
                  className="flex items-center text-[var(--table-heading-text)] cursor-pointer"
                  aria-pressed={isDisliked}
                  aria-label="Dislike problem"
                >
                  <ThumbsDown className={`w-4 h-4 stroke-[var(--table-heading-text)] ${isDisliked ? 'fill-[var(--brand)] stroke-[var(--brand)]' : ''}`} />
                </button>
                <div className="h-[12px] w-[1px] bg-[var(--border)]"></div>
                <button type="button" className="text-sm transition-colors text-[var(--table-heading-text)] cursor-pointer" aria-label="Report a bug for this problem">
                  <Bug className="w-4 h-4" />
                </button>
                <div className="h-[12px] w-[1px] bg-[var(--border)]"></div>
                <button type="button" className="text-sm text-[var(--table-heading-text)] hover:text-[var(--brand)] transition-colors cursor-pointer" aria-label="Open notes">
                  <StickyNote className="w-5 h-5 text-[var(--table-heading-text)]" />
                </button>
              </div>
              <div className="flex items-center gap-x-3">
                <div className="flex items-center gap-4">
                  <label className="flex select-none items-center gap-2 text-xs text-[var(--table-heading-text)] cursor-pointer">
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={autoPlay}
                      data-state={autoPlay ? 'checked' : 'unchecked'}
                      onClick={() => setAutoPlay(!autoPlay)}
                      className={`peer size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none cursor-pointer ${
                        autoPlay 
                          ? 'bg-[var(--brand)] border-[var(--brand)] text-white' 
                          : 'border-[var(--border)] dark:bg-zinc-800/30'
                      }`}
                    >
                      {autoPlay && (
                        <span className="flex items-center justify-center text-current transition-none" style={{ pointerEvents: 'none' }}>
                          <Check className="size-3.5" />
                        </span>
                      )}
                    </button>
                  </label>
                </div>
                <div className="h-[12px] w-[1px] bg-[var(--border)]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resizer */}
      <div 
        role="Resizer" 
        className="react-split__sash react-split__sash--vertical" 
        style={{ left: `calc(${leftWidthPercent}% - 4px)` }}
        onMouseDown={handleResizeStart}
      >
        <div className="h-full rounded-full flex flex-row justify-center items-center w-[8px] transition duration-200">
          <div className="rounded-full my-auto h-8 w-[4px] bg-[var(--muted-foreground)]"></div>
        </div>
      </div>

      {/* Right Pane - Editorial Content */}
      <div 
        className="react-split__pane" 
        style={{ width: `${100 - leftWidthPercent}%`, flexShrink: 0 }}
      >
        <div className="w-full h-full pl-1">
          <div className="h-full bg-[var(--tab-content-bg)] border border-[var(--border)] w-full rounded-lg overflow-hidden">
            <div className="w-full h-full px-4 py-3 overflow-y-auto">
              {/* Editorial Content */}
              <div className="space-y-6">
                {/* Sections */}
                {filteredSections.map((section, index) => (
                  <div key={index} className="space-y-3">
                    <h1 className="text-xl font-bold text-[var(--text)]">{section.title}:</h1>
                    {typeof section.content === 'string' ? (
                      <div className="text-sm text-[var(--muted-foreground)] leading-relaxed space-y-2">
                        {section.content.split('\n').map((line, i) => {
                          const trimmedLine = line.trim();
                          if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-')) {
                            return (
                              <li key={i} className="ml-4 list-disc list-inside">
                                {trimmedLine.substring(1).trim()}
                              </li>
                            );
                          }
                          return trimmedLine ? <p key={i}>{trimmedLine}</p> : null;
                        })}
                      </div>
                    ) : (
                      section.content
                    )}
                  </div>
                ))}

                {/* Dry Run Section */}
                {dryRunImages && dryRunImages.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-[var(--text)]">Dry Run</h3>
                    <ImageCarousel images={dryRunImages} />
                  </div>
                )}

                {/* Solution Section */}
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-[var(--text)]">Solution</h3>
                  <CodeTabs
                    solutions={solutions}
                    activeLanguage={activeLanguage}
                    onLanguageChange={setActiveLanguage}
                  />
                </div>

                {/* Complexity Analysis */}
                <div className="pb-8 space-y-3">
                  <h3 className="text-lg font-bold text-[var(--text)]">Complexity Analysis</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="font-semibold text-[var(--text)]">Time Complexity: </span>
                      <span className="text-[var(--muted-foreground)]">{timeComplexity}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-[var(--text)]">Space Complexity: </span>
                      <span className="text-[var(--muted-foreground)]">{spaceComplexity}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editorial;
