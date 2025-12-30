import { useState } from 'react';
import { Settings, Users, SlidersVertical, Shield, MessageSquare, History, ChevronDown, Home, Link2, Copy, TrendingUp, Wallet, DollarSign, Calendar, Star, Monitor, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AccountPage = () => {
  const [activeSection, setActiveSection] = useState('summary');
  const [hideDifficulty, setHideDifficulty] = useState(false);
  const [hideCompany, setHideCompany] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const navigate = useNavigate();

  const sidebarItems = [
    { id: 'summary', label: 'Summary', icon: Settings },
    { id: 'affiliate', label: 'Affiliate Dashboard', icon: Users },
    { id: 'preferences', label: 'Preferences', icon: SlidersVertical },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'review', label: 'Review', icon: MessageSquare },
    { id: 'history', label: 'Login History', icon: History },
  ];

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Minimal Sidebar */}
      <aside className="hidden lg:block w-[90px] h-screen border-r border-zinc-800 bg-[#1a1a1a]">
        <div className="flex flex-col items-center h-full px-2 py-6">
          {/* Logo */}
          <div className="mb-6">
            <img
              src="/images/logo.png"
              alt="StudyIO Logo"
              className="object-contain w-12 h-12 transition-transform cursor-pointer mix-blend-lighten hover:scale-105"
              style={{ filter: 'brightness(1.2) contrast(1.1)' }}
              onClick={() => navigate('/')}
            />
          </div>

          <div className="w-3/4 h-[2px] bg-zinc-800 rounded-md mb-6"></div>

          {/* Home Icon */}
          <button
            onClick={() => navigate('/')}
            className="flex flex-col items-center justify-center w-10 h-10 gap-1 mb-4 transition-colors rounded-md hover:bg-zinc-800"
          >
            <Home size={16} />
            <span className="text-[10px]">Home</span>
          </button>

          {/* Account Icon - Active */}
          <button className="flex flex-col items-center justify-center w-10 h-10 gap-1 mb-4 rounded-md bg-gradient-to-br from-[#EA763F]/20 to-[#EA763F]/10 border border-[#EA763F]/30">
            <Settings size={16} className="text-[#EA763F]" />
            <span className="text-[10px] text-[#EA763F]">Account</span>
          </button>
        </div>
      </aside>

      <div className="flex flex-col flex-1 w-full min-h-0 overflow-hidden">
        <div className="flex flex-col h-full p-3 overflow-hidden md:flex-row gap-4 md:gap-10 lg:p-[10px]">
          {/* Sidebar Navigation */}
          <div className="flex-shrink-0 w-full md:w-1/5">
            <div className="flex flex-col gap-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`relative flex items-center gap-3 px-4 py-3 rounded-lg transition-all group ${
                      isActive
                        ? 'bg-gradient-to-r from-[#EA763F]/20 to-[#EA763F]/10 border border-[#EA763F]/30'
                        : 'hover:bg-zinc-800/50 border border-transparent'
                    }`}
                  >
                    {isActive && (
                      <div
                        className="absolute inset-0 w-full h-full glass-effect-2"
                        style={{ '--glass-mask-angle': '165deg' } as React.CSSProperties}
                      />
                    )}
                    <div className="relative flex items-center gap-3">
                      <Icon
                        size={18}
                        className={`${
                          isActive ? 'text-[#EA763F]' : 'text-gray-400 group-hover:text-white'
                        }`}
                      />
                      <span
                        className={`text-sm ${
                          isActive ? 'text-white font-medium' : 'text-gray-400 group-hover:text-white'
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 w-full overflow-y-auto md:w-4/5">
            {activeSection === 'summary' && (
              <div className="p-6 border rounded-xl bg-zinc-900/50 border-zinc-800">
                <h1 className="mb-6 text-2xl font-bold">Plan Information</h1>

                {/* Member Badge */}
                <div className="inline-block px-4 py-2 mb-6 text-sm rounded-full bg-gradient-to-r from-[#EA763F]/20 to-purple-500/20 border border-[#EA763F]/30">
                  <span className="text-white">Member since April 26, 2025</span>
                </div>

                {/* Plan Details */}
                <div className="p-6 mb-6 border rounded-lg bg-zinc-800/50 border-zinc-700">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between font-medium">
                      <span className="text-gray-300">Plan:</span>
                      <span className="text-white">Pinnacle (Lifetime)</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>Validity: Lifetime</span>
                      <span>|</span>
                      <span>Purchased on: April 26, 2025</span>
                    </div>
                  </div>
                </div>

                {/* Accordions */}
                <div className="flex flex-col gap-4">
                  {/* Payment History */}
                  <div className="border rounded-lg border-zinc-700">
                    <button className="flex items-center justify-between w-full gap-4 px-4 py-4 text-left transition-all rounded-md hover:bg-zinc-800/50">
                      <span className="text-base font-medium text-white">Payment History</span>
                      <ChevronDown size={20} className="text-gray-400" />
                    </button>
                  </div>

                  {/* Upgrade Plan */}
                  <div className="border rounded-lg border-zinc-700">
                    <button className="flex items-center justify-between w-full gap-4 px-4 py-4 text-left transition-all rounded-md hover:bg-zinc-800/50">
                      <span className="text-base font-medium text-white">Upgrade Plan</span>
                      <ChevronDown size={20} className="text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'affiliate' && (
              <div className="p-6 border rounded-xl bg-zinc-900/50 border-zinc-800">
                <div className="mb-6">
                  <h1 className="mb-2 text-2xl font-bold">Affiliate Dashboard</h1>
                  <span className="text-sm text-gray-400">Track your earnings and manage affiliate info easily</span>
                </div>

                {/* Commission Banner */}
                <div className="relative flex items-center gap-4 p-6 mb-6 border rounded-lg bg-gradient-to-r from-[#EA763F]/10 to-purple-500/10 border-[#EA763F]/30">
                  <span className="mr-4">
                    <svg width="44" height="44" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15.9999 1.46484C7.97294 1.46484 1.46594 7.97184 1.46594 15.9988C1.46594 24.0258 7.97294 30.5328 15.9999 30.5328C24.0269 30.5328 30.5339 24.0258 30.5339 15.9988C30.5339 7.97184 24.0269 1.46484 15.9999 1.46484ZM17.2549 23.8788V25.9258H15.2969V23.9018C12.0839 23.4618 10.6769 20.8218 10.6769 20.8218L12.6769 19.1488C12.6769 19.1488 13.9539 21.3718 16.2639 21.3718C17.5399 21.3718 18.5079 20.6888 18.5079 19.5218C18.5079 16.7938 11.1579 17.1248 11.1579 12.0638C11.1579 9.86384 12.8979 8.27884 15.2959 7.90384V5.85884H17.2539V7.90384C18.9259 8.12384 20.9059 9.00384 20.9059 10.8968V12.3488H18.3099V11.6448C18.3099 10.9188 17.3849 10.4348 16.3499 10.4348C15.0299 10.4348 14.0629 11.0948 14.0629 12.0188C14.0629 14.8128 21.4129 14.1308 21.4129 19.4338C21.4129 21.6138 19.7849 23.5038 17.2549 23.8788Z" fill="#EA763F"/>
                    </svg>
                  </span>
                  <div>
                    <span className="text-lg font-semibold text-white">Earn 15% Commission Per Sale</span>
                    <p className="text-sm text-gray-400">Refer 7 friends → Get back more than your subscription cost</p>
                  </div>
                </div>

                {/* Details Section */}
                <div className="mb-6">
                  <h2 className="flex items-center gap-2 mb-4 text-xl font-bold">Details</h2>
                  <div className="relative flex items-center justify-between gap-4 p-4 border rounded-lg bg-zinc-800/50 border-zinc-700">
                    <div className="flex items-center gap-3">
                      <Link2 size={20} className="text-[#EA763F]" />
                      <span className="text-sm text-gray-300">https://takeuforward.org/plus?affiliate=joyson stanly</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 transition-colors rounded hover:bg-zinc-700" aria-label="Copy link">
                        <Copy size={18} className="text-gray-400" />
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 text-sm transition-colors border rounded-lg bg-gradient-to-r from-[#EA763F]/20 to-[#EA763F]/10 border-[#EA763F]/30 hover:from-[#EA763F]/30 hover:to-[#EA763F]/20">
                        <svg width="18" height="18" viewBox="0 0 19 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1.25 6.24961H3.125V11.2496H1.875C1.70924 11.2496 1.55027 11.3155 1.43306 11.4327C1.31585 11.5499 1.25 11.7089 1.25 11.8746C1.25 12.0404 1.31585 12.1993 1.43306 12.3166C1.55027 12.4338 1.70924 12.4996 1.875 12.4996H16.875C17.0408 12.4996 17.1997 12.4338 17.3169 12.3166C17.4342 12.1993 17.5 12.0404 17.5 11.8746C17.5 11.7089 17.4342 11.5499 17.3169 11.4327C17.1997 11.3155 17.0408 11.2496 16.875 11.2496H15.625V6.24961H17.5C17.636 6.24947 17.7682 6.20499 17.8766 6.1229C17.9851 6.04082 18.0637 5.92561 18.1008 5.79476C18.1378 5.6639 18.1311 5.52455 18.0818 5.39783C18.0324 5.27111 17.9431 5.16394 17.8273 5.09258L9.70234 0.09258C9.60389 0.0320472 9.49058 0 9.375 0C9.25942 0 9.14611 0.0320472 9.04766 0.09258L0.922656 5.09258C0.806897 5.16394 0.71757 5.27111 0.668227 5.39783C0.618883 5.52455 0.612216 5.6639 0.649236 5.79476C0.686256 5.92561 0.764944 6.04082 0.873362 6.1229C0.98178 6.20499 1.11401 6.24947 1.25 6.24961ZM4.375 6.24961H6.875V11.2496H4.375V6.24961ZM10.625 6.24961V11.2496H8.125V6.24961H10.625ZM14.375 11.2496H11.875V6.24961H14.375V11.2496ZM9.375 1.3582L15.2922 4.99961H3.45781L9.375 1.3582ZM18.75 14.3746C18.75 14.5404 18.6842 14.6993 18.5669 14.8166C18.4497 14.9338 18.2908 14.9996 18.125 14.9996H0.625C0.45924 14.9996 0.300268 14.9338 0.183058 14.8166C0.065848 14.6993 0 14.5404 0 14.3746C0 14.2089 0.065848 14.0499 0.183058 13.9327C0.300268 13.8155 0.45924 13.7496 0.625 13.7496H18.125C18.2908 13.7496 18.4497 13.8155 18.5669 13.9327C18.6842 14.0499 18.75 14.2089 18.75 14.3746Z" fill="currentColor"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Sales Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Sales</h2>
                    <div className="flex gap-2">
                      <button className="flex items-center gap-2 px-3 py-2 text-sm transition-colors border rounded-lg bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800">
                        <Calendar size={16} />
                        <span className="text-gray-400">Start date</span>
                        <ChevronDown size={16} />
                      </button>
                      <button className="flex items-center gap-2 px-3 py-2 text-sm transition-colors border rounded-lg bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800">
                        <Calendar size={16} />
                        <span className="text-gray-400">End date</span>
                        <ChevronDown size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Sales Stats */}
                  <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3">
                    <div className="p-6 border rounded-lg bg-gradient-to-br from-[#EA763F]/10 to-[#EA763F]/5 border-[#EA763F]/30">
                      <div className="flex items-center gap-3 mb-3">
                        <TrendingUp size={20} className="text-[#EA763F]" />
                        <span className="text-sm text-gray-400">Amount Earned</span>
                      </div>
                      <span className="text-2xl font-bold">₹ 0</span>
                    </div>

                    <div className="p-6 border rounded-lg bg-zinc-800/50 border-zinc-700">
                      <div className="flex items-center gap-3 mb-3">
                        <Wallet size={20} className="text-gray-400" />
                        <span className="text-sm text-gray-400">Amount Received</span>
                      </div>
                      <span className="text-2xl font-bold text-gray-300">₹ 0</span>
                    </div>

                    <div className="p-6 border rounded-lg bg-zinc-800/50 border-zinc-700">
                      <div className="flex items-center gap-3 mb-3">
                        <DollarSign size={20} className="text-gray-400" />
                        <span className="text-sm text-gray-400">Amount Due</span>
                      </div>
                      <span className="text-2xl font-bold text-gray-300">₹ 0</span>
                    </div>
                  </div>

                  {/* Info Banner */}
                  <div className="p-4 border rounded-lg bg-zinc-800/30 border-zinc-700/50">
                    <p className="text-sm text-gray-400">
                      You'll get last month's payment by 15th of this month. The "Due" section shows this month's earnings
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'preferences' && (
              <div className="p-6 border rounded-xl bg-zinc-900/50 border-zinc-800">
                <h2 className="mb-6 text-2xl font-bold">Preferences</h2>
                
                <div className="flex flex-col gap-4">
                  {/* Hide Question Difficulty Tags */}
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-zinc-800/30 border-zinc-700">
                    <label htmlFor="pref-difficulty" className="text-base text-white cursor-pointer">
                      Hide Question Difficulty Tags
                    </label>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={hideDifficulty}
                      onClick={() => setHideDifficulty(!hideDifficulty)}
                      className={`relative inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none cursor-pointer ${
                        hideDifficulty ? 'bg-[#EA763F]' : 'bg-zinc-700'
                      }`}
                      id="pref-difficulty"
                    >
                      <span
                        className={`pointer-events-none block size-4 rounded-full bg-white transition-transform ${
                          hideDifficulty ? 'translate-x-[calc(100%-2px)]' : 'translate-x-0'
                        }`}
                        style={{ '--glass-mask-angle': '135deg' } as React.CSSProperties}
                      />
                    </button>
                  </div>

                  {/* Hide Company Tags */}
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-zinc-800/30 border-zinc-700">
                    <label htmlFor="pref-company" className="text-base text-white cursor-pointer">
                      Hide Company Tags
                    </label>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={hideCompany}
                      onClick={() => setHideCompany(!hideCompany)}
                      className={`relative inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none cursor-pointer ${
                        hideCompany ? 'bg-[#EA763F]' : 'bg-zinc-700'
                      }`}
                      id="pref-company"
                    >
                      <span
                        className={`pointer-events-none block size-4 rounded-full bg-white transition-transform ${
                          hideCompany ? 'translate-x-[calc(100%-2px)]' : 'translate-x-0'
                        }`}
                        style={{ '--glass-mask-angle': '135deg' } as React.CSSProperties}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Security Section */}
            {activeSection === 'security' && (
              <div className="w-full md:w-4/5 overflow-y-auto">
                <div className="max-w-4xl mx-auto p-6">
                  {/* Header */}
                  <div className="mb-6">
                    <h1 className="text-2xl font-semibold mb-2">Security Notice</h1>
                    <p className="text-sm text-zinc-400">
                      Last updated: May 6, 2025 – This policy is non-negotiable and subject to enforcement at any time
                    </p>
                  </div>

                  {/* Security Cards */}
                  <div className="rounded-lg border border-zinc-800 overflow-hidden">
                    {/* Card 1: Account Sharing Violation */}
                    <div>
                      <div className="flex flex-col gap-3 p-4 items-start">
                        <div className="flex gap-3 items-center">
                          <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M8.94262 2.37085L14.1279 7.55685C14.3779 7.80689 14.5183 8.14597 14.5183 8.49952C14.5183 8.85307 14.3779 9.19215 14.1279 9.44218L8.94262 14.6275C8.69258 14.8775 8.3535 15.0179 7.99995 15.0179C7.6464 15.0179 7.30732 14.8775 7.05728 14.6275L1.87195 9.44218C1.62199 9.19215 1.48157 8.85307 1.48157 8.49952C1.48157 8.14597 1.62199 7.80689 1.87195 7.55685L7.05728 2.37085C7.30732 2.12089 7.6464 1.98047 7.99995 1.98047C8.3535 1.98047 8.69258 2.12089 8.94262 2.37085ZM8.00128 10.4995C7.83125 10.4994 7.66758 10.5642 7.54377 10.6807C7.41995 10.7973 7.34534 10.9567 7.33521 11.1264C7.32507 11.2962 7.38018 11.4634 7.48925 11.5938C7.59831 11.7243 7.7531 11.8081 7.92195 11.8282L8.00195 11.8329C8.17876 11.8329 8.34833 11.7626 8.47335 11.6376C8.59838 11.5126 8.66862 11.343 8.66862 11.1662C8.66862 10.9894 8.59838 10.8198 8.47335 10.6948C8.34833 10.5698 8.17876 10.4995 8.00195 10.4995H8.00128ZM7.99995 5.83285C7.87132 5.83279 7.74398 5.85858 7.62551 5.90869C7.50704 5.9588 7.39984 6.0322 7.3103 6.12455C7.22075 6.2169 7.15067 6.3263 7.10423 6.44625C7.05779 6.56621 7.03593 6.69428 7.03995 6.82285L7.04662 6.91285L7.33862 9.24885C7.35787 9.40363 7.43078 9.54675 7.54466 9.65333C7.65854 9.7599 7.80618 9.82317 7.96189 9.83213C8.1176 9.84109 8.27153 9.79517 8.39688 9.70236C8.52223 9.60955 8.61107 9.47573 8.64795 9.32418L8.66128 9.24885L8.95328 6.91285C8.97032 6.77765 8.95837 6.64036 8.91824 6.51013C8.87811 6.3799 8.81071 6.25971 8.72053 6.15755C8.63034 6.05538 8.51944 5.97359 8.3952 5.9176C8.27096 5.86162 8.13622 5.83273 7.99995 5.83285Z" fill="#EA763F"/>
                          </svg>
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-[#EA763F]">Account Sharing Violation</p>
                          </div>
                        </div>
                        <p className="text-sm text-zinc-400">
                          Account sharing is strictly prohibited. Our security team is implementing enhanced monitoring protocols effective immediately. Violation will result in immediate account termination without prior notice.
                        </p>
                      </div>
                      <div className="h-[1px] mx-auto w-[97%] bg-zinc-800"></div>
                    </div>

                    {/* Card 2: Active Monitoring */}
                    <div>
                      <div className="flex flex-col gap-3 p-4 items-start">
                        <div className="flex gap-3 items-center">
                          <svg width="15" height="13" viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.41667 1.0567C6.06336 0.851241 6.73812 0.747778 7.41667 0.750036C10.2047 0.750036 12.102 2.4167 13.2333 3.88604C13.8 4.62337 14.0833 4.9907 14.0833 6.08337C14.0833 7.1767 13.8 7.54404 13.2333 8.2807C12.102 9.75004 10.2047 11.4167 7.41667 11.4167C4.62867 11.4167 2.73133 9.75004 1.6 8.2807C1.03333 7.5447 0.75 7.17604 0.75 6.08337C0.75 4.99004 1.03333 4.6227 1.6 3.88604C1.94567 3.43459 2.33049 3.01451 2.75 2.6307" stroke="#EA763F" strokeWidth="1.5" strokeLinecap="round"/>
                            <path d="M9.41663 6.08203C9.41663 6.61246 9.20591 7.12117 8.83084 7.49625C8.45577 7.87132 7.94706 8.08203 7.41663 8.08203C6.88619 8.08203 6.37748 7.87132 6.00241 7.49625C5.62734 7.12117 5.41663 6.61246 5.41663 6.08203C5.41663 5.5516 5.62734 5.04289 6.00241 4.66782C6.37748 4.29274 6.88619 4.08203 7.41663 4.08203C7.94706 4.08203 8.45577 4.29274 8.83084 4.66782C9.20591 5.04289 9.41663 5.5516 9.41663 6.08203Z" stroke="#EA763F" strokeWidth="1.5"/>
                          </svg>
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-[#EA763F]">Active Monitoring In Place</p>
                          </div>
                        </div>
                        <p className="text-sm text-zinc-400">
                          Our systems actively track IP addresses, device fingerprints, geographic locations, browser identifiers and login patterns to detect unauthorised access. All suspicious activities are automatically flagged for security review.
                        </p>
                      </div>
                      <div className="h-[1px] mx-auto w-[97%] bg-zinc-800"></div>
                    </div>

                    {/* Card 3: Zero Tolerance Policy */}
                    <div>
                      <div className="flex flex-col gap-3 p-4 items-start">
                        <div className="flex gap-3 items-center">
                          <svg width="16" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_1267_147)">
                              <path d="M8.00005 0H7.98071C3.56271 0 -0.0192871 3.582 -0.0192871 8C-0.0192871 12.418 3.56271 16 7.98071 16H8.00005C12.418 16 16 12.418 16 8C16 3.582 12.418 0 8.00005 0ZM8.00005 15.36H7.98071C3.91605 15.36 0.620713 12.0647 0.620713 8C0.620713 3.93533 3.91605 0.64 7.98071 0.64H8.00005C12.0647 0.64 15.36 3.93533 15.36 8C15.36 12.0647 12.0647 15.36 8.00005 15.36Z" fill="#EA763F"/>
                              <path d="M10.55 4.76231C9.88997 4.92898 9.12597 5.03698 8.34064 5.06231L8.32331 5.06298V7.68231H10.9233C10.9075 6.66708 10.7757 5.65698 10.5306 4.67165L10.55 4.76231ZM8.31931 1.32765V4.47765C9.04072 4.45649 9.75784 4.35884 10.4586 4.18631L10.3886 4.20098C9.88464 2.60765 9.09997 1.56231 8.31931 1.32765ZM5.59264 4.19698C6.20997 4.35165 6.92597 4.45298 7.66064 4.47698L7.67731 4.47765V1.32031C6.89664 1.54698 6.09997 2.59365 5.59264 4.19698ZM12.792 3.28498C11.9214 2.39521 10.8199 1.76586 9.61131 1.46765L9.56531 1.45831C10.208 2.19228 10.6782 3.06087 10.9413 4.00031L10.952 4.04631C11.6084 3.84922 12.2429 3.58517 12.8453 3.25831L12.792 3.28498ZM11.5113 7.68231H14.7153C14.6504 6.23171 14.1136 4.84196 13.1866 3.72431L13.1953 3.73565C12.602 4.07031 11.9133 4.36765 11.192 4.59231L11.1153 4.61298C11.3506 5.52965 11.494 6.58498 11.5106 7.67165L11.5113 7.68231ZM5.05731 7.68231H7.67997V5.06298C6.8971 5.04077 6.11897 4.93347 5.35931 4.74298L5.43397 4.75898C5.19585 5.7122 5.06945 6.68988 5.05731 7.67231V7.68231ZM10.9233 8.32031H8.31931V10.9336C9.12197 10.957 9.88797 11.065 10.624 11.2496L10.5506 11.2343C10.772 10.3643 10.9066 9.36231 10.9233 8.33165V8.32031ZM5.43464 11.2396C6.10131 11.0696 6.87197 10.9596 7.66464 10.9363L7.68064 10.9356V8.32231H5.05731C5.07264 9.36498 5.20931 10.3683 5.45331 11.329L5.43464 11.2396ZM7.68131 14.6783V11.5203C6.92797 11.545 6.21131 11.6456 5.52131 11.8156L5.59264 11.801C6.10064 13.405 6.89664 14.4536 7.68131 14.6783ZM9.56531 14.5436C10.7918 14.2474 11.9107 13.6134 12.7953 12.7136L12.7966 12.7123C12.2336 12.4075 11.6418 12.1589 11.03 11.9703L10.958 11.951C10.6941 12.9121 10.2159 13.801 9.55931 14.551L9.56531 14.5436ZM6.41131 1.46631C5.19511 1.76405 4.08602 2.39501 3.20864 3.28831L3.20731 3.28965C3.72397 3.57231 4.32597 3.82831 4.95531 4.02431L5.02664 4.04365C5.29042 3.08887 5.76572 2.20571 6.41731 1.45965L6.41064 1.46698L6.41131 1.46631ZM11.1153 11.3896C11.9146 11.633 12.6053 11.931 13.254 12.2943L13.2 12.2663C14.1197 11.1556 14.6528 9.77557 14.7186 8.33498L14.7193 8.31965H11.5153C11.4964 9.38779 11.3552 10.4503 11.0946 11.4863L11.1153 11.3896ZM8.31931 11.5203V14.6736C9.09997 14.439 9.88464 13.3936 10.3886 11.797C9.71558 11.6329 9.02712 11.5402 8.33464 11.5203H8.31931ZM4.86931 4.60831C4.1323 4.3864 3.42183 4.08437 2.75064 3.70765L2.80331 3.73498C1.88361 4.84574 1.35052 6.22572 1.28464 7.66631L1.28397 7.68165H4.47197C4.48731 6.58365 4.63131 5.52631 4.88931 4.51431L4.86931 4.60831ZM4.46864 8.32031H1.28064C1.35197 9.83098 1.91397 11.1976 2.80931 12.2783L2.80064 12.267C3.38931 11.9343 4.07397 11.6383 4.78997 11.4143L4.86597 11.3936C4.61747 10.3919 4.48439 9.36499 4.46931 8.33298L4.46864 8.32031ZM3.20397 12.7123C4.07017 13.597 5.16435 14.2246 6.36531 14.5256L6.41131 14.5356C5.76979 13.8037 5.2999 12.9378 5.03597 12.001L5.02464 11.9543C4.375 12.1538 3.74663 12.4168 3.14864 12.7396L3.20397 12.7123Z" fill="#EA763F"/>
                            </g>
                            <defs>
                              <clipPath id="clip0_1267_147">
                                <rect width="16" height="16" fill="white"/>
                              </clipPath>
                            </defs>
                          </svg>
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-[#EA763F]">Zero Tolerance Policy</p>
                          </div>
                        </div>
                        <p className="text-sm text-zinc-400">
                          There will be no exceptions to our account sharing prohibition. Detected violations result in permanent suspension of service and forfeiture of all account privileges without refund or appeal.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Review Section */}
            {activeSection === 'review' && (
              <div className="w-full md:w-4/5 overflow-y-auto">
                <div className="max-w-4xl mx-auto p-6">
                  {/* Header */}
                  <div className="mb-6">
                    <h2 className="text-2xl font-semibold mb-2">Hey, Take a moment to review us</h2>
                    <span className="text-sm text-zinc-400">
                      Your feedback matters! It helps us grow and serve you better
                    </span>
                  </div>

                  {/* Review Form */}
                  <div className="space-y-6">
                    {/* Star Rating */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-zinc-300">How would you like to rate us?</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            className="transition-colors"
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(star)}
                          >
                            <Star
                              className="w-8 h-8 transition-colors"
                              fill={(hoverRating || rating) >= star ? '#EA763F' : 'transparent'}
                              stroke={(hoverRating || rating) >= star ? '#EA763F' : '#71717a'}
                              strokeWidth={1.5}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Review Textarea */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-zinc-300">Write your review</label>
                      <textarea
                        className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#EA763F] focus:ring-1 focus:ring-[#EA763F] resize-none"
                        placeholder="Tell us about your experience..."
                        rows={5}
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                      />
                    </div>

                    {/* Optional Accordion */}
                    <div className="mt-4 rounded-lg border border-zinc-800">
                      <button
                        type="button"
                        onClick={() => setIsAccordionOpen(!isAccordionOpen)}
                        className="flex w-full items-start justify-between gap-4 p-4 py-3 text-left text-sm transition-all hover:bg-zinc-900/50 rounded-lg"
                      >
                        <span className="text-sm text-zinc-400">
                          Could you please share your feedback for the different sections below? (Optional)
                        </span>
                        <ChevronDown
                          className={`size-4 shrink-0 text-zinc-400 transition-transform duration-200 ${
                            isAccordionOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {isAccordionOpen && (
                        <div className="px-4 pb-4 space-y-3">
                          <div className="pt-2 border-t border-zinc-800">
                            <textarea
                              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-md text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#EA763F] focus:ring-1 focus:ring-[#EA763F] resize-none"
                              placeholder="Additional feedback for specific sections..."
                              rows={3}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Submit Button */}
                    <div className="flex items-center gap-3">
                      <button
                        disabled={!rating || !reviewText.trim()}
                        className="px-4 py-2 bg-[#EA763F] text-white text-sm font-medium rounded-md transition-all hover:bg-[#EA763F]/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                      >
                        Post Feedback
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Login History Section */}
            {activeSection === 'history' && (
              <div className="w-full md:w-4/5 overflow-y-auto">
                <div className="max-w-6xl mx-auto p-6">
                  {/* Header */}
                  <div className="mb-6">
                    <h1 className="text-2xl font-semibold mb-2">Login History</h1>
                    <span className="text-sm text-zinc-400">
                      Track your recent sign-ins and activity.
                    </span>
                  </div>

                  {/* Table */}
                  <div className="mt-6 rounded-xl border border-zinc-800 overflow-hidden">
                    <div className="relative w-full overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-zinc-800">
                            <th className="h-10 px-2 text-left font-medium text-zinc-400">Device</th>
                            <th className="h-10 px-2 text-left font-medium text-zinc-400">Time of login</th>
                            <th className="h-10 px-2 text-left font-medium text-zinc-400">Type of login</th>
                            <th className="h-10 px-2 text-left font-medium text-zinc-400">Location</th>
                            <th className="h-10 px-2 text-left font-medium text-zinc-400">IP</th>
                            <th className="h-10 px-2 text-left font-medium text-zinc-400">Coordinates</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* Current Session - Highlighted */}
                          <tr className="border-b border-zinc-800 hover:bg-zinc-900/50 transition-colors text-[#EA763F]">
                            <td className="p-2">
                              <div className="flex items-center gap-2">
                                <Monitor className="w-4 h-4" />
                                <span>Windows PC</span>
                              </div>
                            </td>
                            <td className="p-2">Dec 23, 2025 3:22 pm</td>
                            <td className="p-2">Google</td>
                            <td className="p-2">TsSBcm5hdW5k, IN</td>
                            <td className="p-2">2401:4900:67bf:1af1:8dbe:d5fb:277f:b4fa</td>
                            <td className="p-2">76.15831, 29.07358</td>
                          </tr>

                          {/* Previous Sessions */}
                          <tr className="border-b border-zinc-800 hover:bg-zinc-900/50 transition-colors text-zinc-400">
                            <td className="p-2">
                              <div className="flex items-center gap-2">
                                <Monitor className="w-4 h-4" />
                                <span>Windows PC</span>
                              </div>
                            </td>
                            <td className="p-2">Dec 22, 2025 8:37 pm</td>
                            <td className="p-2">Google</td>
                            <td className="p-2">TsSBcm5hdW5k, IN</td>
                            <td className="p-2">2401:4900:cac6:e177:717a:47c3:526b:505e</td>
                            <td className="p-2">76.15831, 29.07358</td>
                          </tr>

                          <tr className="border-b border-zinc-800 hover:bg-zinc-900/50 transition-colors text-zinc-400">
                            <td className="p-2">
                              <div className="flex items-center gap-2">
                                <Monitor className="w-4 h-4" />
                                <span>Windows PC</span>
                              </div>
                            </td>
                            <td className="p-2">Dec 21, 2025 7:55 pm</td>
                            <td className="p-2">Otp</td>
                            <td className="p-2">TsSBcm5hdW5k, IN</td>
                            <td className="p-2">2401:4900:925e:2d49:8952:4277:7e94:a009</td>
                            <td className="p-2">76.15831, 29.07358</td>
                          </tr>

                          <tr className="border-b border-zinc-800 hover:bg-zinc-900/50 transition-colors text-zinc-400">
                            <td className="p-2">
                              <div className="flex items-center gap-2">
                                <Monitor className="w-4 h-4" />
                                <span>Windows PC</span>
                              </div>
                            </td>
                            <td className="p-2">Dec 20, 2025 2:48 pm</td>
                            <td className="p-2">Otp</td>
                            <td className="p-2">TsSBcm5hdW5k, IN</td>
                            <td className="p-2">2401:4900:cacf:6c5a:1c26:fcfc:c41:5a94</td>
                            <td className="p-2">76.15831, 29.07358</td>
                          </tr>

                          <tr className="border-b border-zinc-800 hover:bg-zinc-900/50 transition-colors text-zinc-400">
                            <td className="p-2">
                              <div className="flex items-center gap-2">
                                <Monitor className="w-4 h-4" />
                                <span>Windows PC</span>
                              </div>
                            </td>
                            <td className="p-2">Dec 15, 2025 8:29 pm</td>
                            <td className="p-2">Otp</td>
                            <td className="p-2">Tambaram, IN</td>
                            <td className="p-2">14.139.187.145</td>
                            <td className="p-2">80.12707, 12.92460</td>
                          </tr>

                          <tr className="border-b border-zinc-800 hover:bg-zinc-900/50 transition-colors text-zinc-400">
                            <td className="p-2">
                              <div className="flex items-center gap-2">
                                <Smartphone className="w-4 h-4" />
                                <span>Android Phone</span>
                              </div>
                            </td>
                            <td className="p-2">Dec 15, 2025 11:04 am</td>
                            <td className="p-2">Otp</td>
                            <td className="p-2">SG9zxaty, IN</td>
                            <td className="p-2">2401:4900:924e:8664:3006:6f33:39f4:22d7</td>
                            <td className="p-2">77.83264, 12.73647</td>
                          </tr>

                          <tr className="border-b border-zinc-800 hover:bg-zinc-900/50 transition-colors text-zinc-400">
                            <td className="p-2">
                              <div className="flex items-center gap-2">
                                <Monitor className="w-4 h-4" />
                                <span>Windows PC</span>
                              </div>
                            </td>
                            <td className="p-2">Dec 14, 2025 10:09 pm</td>
                            <td className="p-2">Otp</td>
                            <td className="p-2">Tambaram, IN</td>
                            <td className="p-2">14.139.187.145</td>
                            <td className="p-2">80.12707, 12.92460</td>
                          </tr>

                          <tr className="border-b border-zinc-800 hover:bg-zinc-900/50 transition-colors text-zinc-400">
                            <td className="p-2">
                              <div className="flex items-center gap-2">
                                <Monitor className="w-4 h-4" />
                                <span>Windows PC</span>
                              </div>
                            </td>
                            <td className="p-2">Dec 14, 2025 3:23 pm</td>
                            <td className="p-2">Otp</td>
                            <td className="p-2">Tambaram, IN</td>
                            <td className="p-2">14.139.187.145</td>
                            <td className="p-2">80.12707, 12.92460</td>
                          </tr>

                          <tr className="border-b border-zinc-800 hover:bg-zinc-900/50 transition-colors text-zinc-400">
                            <td className="p-2">
                              <div className="flex items-center gap-2">
                                <Monitor className="w-4 h-4" />
                                <span>Windows PC</span>
                              </div>
                            </td>
                            <td className="p-2">Dec 14, 2025 2:18 pm</td>
                            <td className="p-2">Otp</td>
                            <td className="p-2">Tambaram, IN</td>
                            <td className="p-2">14.139.187.145</td>
                            <td className="p-2">80.12707, 12.92460</td>
                          </tr>

                          <tr className="hover:bg-zinc-900/50 transition-colors text-zinc-400">
                            <td className="p-2">
                              <div className="flex items-center gap-2">
                                <Monitor className="w-4 h-4" />
                                <span>Windows PC</span>
                              </div>
                            </td>
                            <td className="p-2">Dec 13, 2025 10:08 am</td>
                            <td className="p-2">Otp</td>
                            <td className="p-2">Tambaram, IN</td>
                            <td className="p-2">14.139.187.145</td>
                            <td className="p-2">80.12707, 12.92460</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-4 flex items-center justify-between text-sm text-zinc-400">
                    <div>Showing 10 out of 10 sessions</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
