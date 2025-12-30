
import React, { useState } from "react";

type Category = {
  id: string;
  label: string;
  subtopics?: string[];
};

const categories: Category[] = [
  {
    id: "numbers",
    label: "Numbers",
    subtopics: ["Basic", "Advance"],
  },
  { id: "lcm-hcf", label: "LCM and HCF" },
  { id: "work-wages", label: "Work and Wages" },
  { id: "pipes-cisterns", label: "Pipes and Cisterns" },
  { id: "time-speed-distance", label: "Time, Speed and Distance" },
  { id: "trains-boats-streams", label: "Trains, Boats and Streams" },
  { id: "percentage", label: "Percentage" },
  { id: "ratio-proportion", label: "Ratio and Proportion" },
  { id: "partnership", label: "Partnership" },
  { id: "mixtures-alligation", label: "Mixtures and Alligation" },
  { id: "algebra", label: "Algebra" },
  { id: "average", label: "Average" },
  { id: "age", label: "Age" },
  { id: "profit-loss", label: "Profit and Loss" },
  { id: "simple-interest", label: "Simple Interest" },
  { id: "compound-interest", label: "Compound Interest" },
  { id: "mensuration-2d", label: "Mensuration 2D" },
  { id: "trigonometry-height-distance", label: "Trigonometry & Height and Distances" },
  { id: "progressions", label: "Progressions" },
  { id: "logarithms", label: "Logarithms" },
  { id: "permutation-combination", label: "permutation and Combination" },
  { id: "probability", label: "Probability" },
  { id: "geometry", label: "Geometry" },
  { id: "race", label: "Race" },
  { id: "simplification-approximation", label: "Simplification and Approximation" },
];

const QuizSidebar: React.FC = () => {
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>("numbers");
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [showContestModal, setShowContestModal] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  const handleToggleCategory = (id: string) => {
    setExpandedCategoryId((prev) => (prev === id ? null : id));
  };

  const handleToggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  // Track click → open Contest modal
  const handleOpenContestModal = () => {
    setShowContestModal(true);
  };

  const handleCloseContestModal = () => {
    setShowContestModal(false);
  };

  const handleOpenConfirmModal = () => {
    setShowContestModal(false);
    setShowConfirmModal(true);
  };

  const handleCloseConfirmModal = () => {
    setShowConfirmModal(false);
  };

  return (
    <div>
      <div className="relative hidden h-screen font-dmSans md:flex">
        {/* Sidebar */}
        <div
          className={`flex flex-col dark:bg-[#111418] bg-[#F4F6F8] w-[250px] p-4 border-zinc-200 transform transition-transform duration-300 ${
            isCollapsed ? "-translate-x-full" : "translate-x-0"
          }`}
          style={{ marginLeft: "0px" }}
        >
          {/* Logo */}
          <div className="flex justify-start pb-4">
            <img
              src="/static/media/TufDarkCircleLogo.876d63ea7e9c6b8336e9.png"
              alt="tuf_logo"
              className="object-contain cursor-pointer w-11 h-11"
            />
          </div>

          {/* Search + Heading */}
          <div>
            <div className="relative flex items-center mb-3">
              <div className="relative w-full group">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="absolute transform -translate-y-1/2 lucide lucide-search left-3 top-1/2 text-new_tertiary"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </svg>

                <input
                  type="text"
                  className="w-full py-1.5 pl-10 pr-8 dark:bg-[#161A20] bg-[#e2e7eb] dark:text-white text-black rounded-md border-none outline-none focus:ring-1 focus:ring-gray-600 transition-shadow duration-200"
                  placeholder="Search..."
                />
              </div>
            </div>

            <div className="dark:text-white text-black w-full text-xl sm:text-lg md:text-base font-dmSans mb-2 border border-[#CAD3DB] dark:border-[#434343] rounded-md p-2 shadow-[0_0_8px_2px_#EA763F33] dark:shadow-none text-center">
              Quantitative Aptitude
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-col space-y-6 text-sm font-normal tracking-[-0.28px] leading-[18.9px] premium-scrollbar-orange-2 overflow-y-auto mt-4">
            {categories.map((category) => {
              const isExpanded = expandedCategoryId === category.id;
              const hasSubtopics = category.subtopics && category.subtopics.length > 0;
              const isNumbers = category.id === "numbers";

              return (
                <div key={category.id}>
                  <div
                    className={`flex items-center cursor-pointer transition-colors ${
                      isNumbers
                        ? "dark:hover:text-white hover:text-black dark:text-white text-black"
                        : "dark:hover:text-white hover:text-black text-[#676A6D]"
                    }`}
                    onClick={() => handleToggleCategory(category.id)}
                  >
                    <span
                      className="mr-2"
                      style={isNumbers ? { transform: "scale(1.05) translateZ(0px)" } : undefined}
                    >
                      {/* Icon: Numbers has different icon; others share card icon */}
                      {isNumbers ? (
                        <svg
                          width="25"
                          height="25"
                          viewBox="0 0 25 25"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M23.0811 10.9848C22.9419 10.7918 22.7587 10.6347 22.5468 10.5265C22.3349 10.4182 22.1003 10.362 21.8623 10.3623H20.3623V8.8623C20.3623 8.46448 20.2043 8.08295 19.923 7.80165C19.6417 7.52034 19.2601 7.3623 18.8623 7.3623H12.3626L9.76293 5.4123C9.50285 5.21841 9.18733 5.11324 8.86293 5.1123H3.8623C3.46448 5.1123 3.08295 5.27034 2.80164 5.55164C2.52034 5.83295 2.3623 6.21448 2.3623 6.6123V20.1123C2.3623 20.3112 2.44132 20.502 2.58197 20.6426C2.72263 20.7833 2.91339 20.8623 3.1123 20.8623H19.9029C20.0604 20.8623 20.2138 20.8128 20.3415 20.7208C20.4692 20.6287 20.5647 20.4988 20.6145 20.3495L23.2854 12.3367C23.3605 12.1112 23.3812 11.8712 23.3457 11.6362C23.3101 11.4012 23.2195 11.178 23.0811 10.9848ZM8.86293 6.6123L11.4626 8.56231C11.7226 8.75632 12.0382 8.8615 12.3626 8.8623H18.8623V10.3623H13.8401C13.5438 10.3623 13.2541 10.45 13.0076 10.6145L11.1326 11.8623H6.62043C6.32037 11.8615 6.02702 11.951 5.77854 12.1192C5.53007 12.2874 5.33799 12.5265 5.2273 12.8054L3.8623 16.2179V6.6123H8.86293ZM19.3629 19.3623H4.22043L6.62043 13.3623H11.1354C11.4317 13.3623 11.7214 13.2746 11.9679 13.1101L13.8429 11.8623H21.8623L19.3629 19.3623Z"
                            fill="currentColor"
                          ></path>
                        </svg>
                      ) : (
                        <svg
                          width="25"
                          height="25"
                          viewBox="0 0 25 25"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M20.3623 7.3623H12.3626L9.76199 5.4123C9.50197 5.21829 9.18642 5.11311 8.86199 5.1123H3.8623C3.46448 5.1123 3.08295 5.27034 2.80164 5.55164C2.52034 5.83295 2.3623 6.21448 2.3623 6.6123V19.3623C2.3623 19.7601 2.52034 20.1417 2.80164 20.423C3.08295 20.7043 3.46448 20.8623 3.8623 20.8623H20.3623C20.7601 20.8623 21.1417 20.7043 21.423 20.423C21.7043 20.1417 21.8623 19.7601 21.8623 19.3623V8.8623C21.8623 8.46448 21.7043 8.08295 21.423 7.80165C21.1417 7.52034 20.7601 7.3623 20.3623 7.3623ZM3.8623 6.6123H8.86199L10.8626 8.1123L8.86199 9.61231H3.8623V6.6123ZM20.3623 19.3623H3.8623V11.1123H8.86199C9.18642 11.1115 9.50197 11.0063 9.76199 10.8123L12.3626 8.8623H20.3623V19.3623Z"></path>
                        </svg>
                      )}
                    </span>
                    <span className="w-full text-sm break-words">{category.label}</span>
                  </div>

                  {/* Dropdown for categories that have subtopics (Numbers) */}
                  {hasSubtopics && isExpanded && (
                    <div className="mt-4 ml-6 space-y-4" style={{ height: "auto", opacity: 1 }}>
                      {/* Basic (selected) */}
                      <div className="flex items-center text-[#676A6D] cursor-pointer dark:hover:text-white hover:text-black transition-colors dark:text-white text-black dark:bg-[#13171C] bg-gradient-to-r from-[#FACC15]/[0.05] to-[#EA763F]/[0.09] p-1 pl-3 py-1 mr-3 border-l-2 border-[#EA763F]">
                        <span className="mr-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="26"
                            height="23"
                            className="-ml-[11px]"
                            viewBox="0 0 21 21"
                            fill="none"
                          >
                            <circle
                              cx="10.1123"
                              cy="10.6123"
                              r="7.54411"
                              stroke="#EA763F"
                              strokeWidth="0.911789"
                            ></circle>
                            <circle cx="10.1123" cy="10.6123" r="4" fill="#EA763F"></circle>
                          </svg>
                        </span>
                        <span className="w-full text-sm break-words">Basic</span>
                      </div>

                      {/* Advance */}
                      <div className="flex items-center text-[#676A6D] cursor-pointer dark:hover:text-white hover:text-black transition-colors">
                        <span className="mr-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-circle mr-1 ml-[5px]"
                          >
                            <circle cx="12" cy="12" r="10"></circle>
                          </svg>
                        </span>
                        <span className="w-full text-sm break-words">Advance</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Section */}
          <div className="mt-auto">
            {/* Track / Home pill */}
            <div
              className="flex items-center justify-center dark:bg-[#020612] bg-white backdrop-blur-xl rounded-xl border dark:border-[#161A20] border-[#CAD3DB] w-[215px] h-10 mt-2"
              style={{ boxShadow: "rgba(234, 118, 63, 0.2) 0px 0px 8px 2px" }}
            >
              <div className="relative flex items-center justify-between w-full h-full px-2">
                {/* Home icon */}
                <div
                  className="absolute flex items-center justify-center px-0 overflow-hidden transition-all ease-out bg-transparent border-none cursor-pointer rounded-xl duration-400"
                  style={{ left: 0, width: 28, top: 0, bottom: 0, zIndex: 1 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-400 lucide lucide-house"
                  >
                    <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
                    <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  </svg>
                </div>

                {/* Track segment – click to open Contest modal */}
                <div
                  className="absolute flex items-center justify-center cursor-pointer rounded-xl overflow-hidden transition-all duration-400 ease-out dark:bg-[#121212] bg-[#fbfbf4] border dark:border-white/20 border-[#CAD3DB] px-2"
                  style={{ left: 28, width: 186, top: 0, bottom: 0, zIndex: 10 }}
                  onClick={handleOpenContestModal}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-black lucide lucide-file-text dark:text-white"
                  >
                    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
                    <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                    <path d="M10 9H8"></path>
                    <path d="M16 13H8"></path>
                    <path d="M16 17H8"></path>
                  </svg>
                  <span className="ml-2 text-sm font-medium text-black dark:text-white">
                    Track
                  </span>
                </div>
              </div>
            </div>

            {/* Profile */}
            <div className="flex flex-wrap items-center mt-2 -mb-2 w-[215px] dark:hover:bg-[#13171C] hover:bg-gradient-to-r from-[#FACC15]/[0.08] to-[#EA763F]/[0.12] rounded-lg cursor-pointer py-1">
              <div className="pl-2">
                <img
                  src="https://takeuforward-content-images.s3.ap-south-1.amazonaws.com/profile/joyson%20stanly?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA2LFMBNFQHZGEYE7P%2F20251206%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20251206T053402Z&X-Amz-Expires=86400&X-Amz-Signature=1594f21d50879ea9da15955f5a90edb6bf37dc8c13369dc5f10ff64c5c494c26&X-Amz-SignedHeaders=host&x-id=GetObject"
                  className="object-cover w-5 h-5 rounded-full"
                  alt=""
                />
              </div>

              <div className="pl-2 max-w-[calc(100%-80px)] break-words">
                <div className="text-sm text-black dark:text-white">joy</div>
              </div>

              <div className="flex flex-col justify-end pr-2 ml-auto rounded-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-chevron-right text-[#ADADAD] scale-90"
                >
                  <path d="m9 18 6-6-6-6"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Toggle Button */}
        <button
          className="cursor-pointer absolute top-5 -right-[20px] z-[60] transition-transform duration-300"
          onClick={handleToggleSidebar}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="#141414"
            stroke="#EA763F"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`-ml-16 scale-90 lucide lucide-arrow-left-from-line transition-transform duration-300 ${
              isCollapsed ? "rotate-180" : ""
            }`}
          >
            <path d="m9 6-6 6 6 6"></path>
            <path d="M3 12h14"></path>
            <path d="M21 19V5"></path>
          </svg>
        </button>

        {/* Tooltip container (empty placeholder) */}
        <div className="tooltip-container"></div>

        {/* Contest Modal */}
        {showContestModal && (
          <>
            <div
              className="fixed inset-0 z-50 transition-opacity bg-gray-900 bg-opacity-30"
              aria-hidden="true"
              onClick={handleCloseContestModal}
            ></div>

            <div
              className="fixed inset-0 z-50 flex items-center justify-center px-4 my-4 transform sm:px-6"
              role="dialog"
              aria-modal="true"
            >
              <div className="bg-white dark:bg-dark_50 rounded-xl shadow-lg overflow-y-auto scrollbar-none max-w-[975px] w-full max-h-full border border-gray-200 dark:border-zinc-800">
                <div className="h-full py-8 px-9">
                  <div className="flex items-center justify-between">
                    <div className="text-xl font-semibold text-zinc-800 dark:text-zinc-100">
                      Contest
                    </div>
                    <button onClick={handleCloseContestModal}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-x"
                      >
                        <path d="M18 6 6 18"></path>
                        <path d="m6 6 12 12"></path>
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col p-9 gap-y-8 font-dmSans">
                  <div className="flex flex-row items-center justify-between">
                    <div className="flex flex-row gap-x-4 items-center bg-[#fafafa] border border-zinc-300 dark:border-zinc-700 dark:bg-dark_40 py-2 px-4 rounded-md">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="19"
                        height="19"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-clock stroke-[#7A7A7A]"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      <span className="text-[#7A7A7A]">
                        Duration: <strong>2 hours</strong>
                      </span>
                    </div>

                    <button
                      className="py-3 text-white rounded-lg text-md bg-new_Brand px-14"
                      onClick={handleOpenConfirmModal}
                    >
                      Start
                    </button>
                  </div>

                  <div className="flex flex-col mt-4">
                    <span className="text-2xl font-semibold">Rules and Regulations:</span>

                    <ul className="mt-6 space-y-4">
                      <li>The contest will last for 2 hours &amp; you will have 3 challenges to solve.</li>
                      <li>For each correct solution, you will earn +100 points.</li>
                      <li>For each incorrect submission, there will be a 10-point deduction.</li>
                      <li>
                        Final score will be calculated as +100 points per correct answer minus the penalty for
                        incorrect submissions.
                      </li>
                      <li>Once the contest begins, there is no option to pause it.</li>
                      <li>
                        The contest can only be attempted once; however, after submission, you can review the
                        problems at any time.
                      </li>
                      <li>A stable internet connection is essential to ensure a smooth contest experience.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Confirm Modal */}
        {showConfirmModal && (
          <>
            <div
              className="fixed inset-0 z-50 transition-opacity bg-gray-900 bg-opacity-30"
              aria-hidden="true"
              onClick={handleCloseConfirmModal}
            ></div>

            <div
              className="fixed inset-0 z-50 flex items-center justify-center px-4 my-4 transform sm:px-6"
              role="dialog"
              aria-modal="true"
            >
              <div className="bg-white dark:bg-dark_50 rounded-xl shadow-lg overflow-y-auto scrollbar-none max-w-[975px] w-full max-h-full border border-gray-200 dark:border-zinc-800">
                <div className="h-full py-8 px-9">
                  <div className="flex items-center justify-between">
                    <div className="text-xl font-semibold"></div>
                    <button onClick={handleCloseConfirmModal}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-x"
                      >
                        <path d="M18 6 6 18"></path>
                        <path d="m6 6 12 12"></path>
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center p-9 font-dmSans">
                  <p className="text-2xl font-semibold">Are you sure you want to start?</p>
                  <p className="mt-2">
                    Once you start the contest, you won&apos;t be able to attempt it again. Are you sure you want
                    to proceed?
                  </p>

                  <button
                    className="w-1/2 px-10 py-3 mt-4 text-white rounded-lg text-md bg-new_Brand"
                    onClick={handleCloseConfirmModal}
                  >
                    Yes, start contest
                  </button>

                  <button
                    className="w-1/2 mt-4 text-md rounded-lg border border-[#7A7A7A] text-[#7A7A7A] px-14 py-3"
                    onClick={handleCloseConfirmModal}
                  >
                    Maybe Later
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export { QuizSidebar };
