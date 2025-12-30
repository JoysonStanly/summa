import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getSubjectData, type Module, type Topic, type Subject } from "../../data/subjects";

interface CoreSubjectSidebarProps {
  subjectId?: string;
  activeModuleId?: string;
  activeTopicId?: string;
}

const CoreSubjectSidebar = ({ subjectId, activeModuleId, activeTopicId }: CoreSubjectSidebarProps) => {
  const navigate = useNavigate();
  const subjectData: Subject | null = subjectId ? getSubjectData(subjectId) : null;
  
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const [searchValue, setSearchValue] = useState('');

  // Initialize expanded modules when subject data changes
  useState(() => {
    if (subjectData) {
      const initialExpanded = subjectData.modules.reduce((acc, module) => {
        acc[module.id] = true;
        return acc;
      }, {} as Record<string, boolean>);
      setExpandedModules(initialExpanded);
    }
  });

  if (!subjectData) {
    return null;
  }

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  // Icon components similar to MySidebar
  const CheckIcon = ({ isActive }: { isActive: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="23" viewBox="0 0 21 21" fill="none">
      <circle cx="10.1123" cy="10.6123" r="8" fill={isActive ? "#EA763F" : "#22c55e"} />
      <path d="M9.30338 11.9387L7.68508 10.3204C7.54709 10.1824 7.37146 10.1134 7.15819 10.1134C6.94493 10.1134 6.7693 10.1824 6.63131 10.3204C6.49331 10.4584 6.42432 10.634 6.42432 10.8473C6.42432 11.0605 6.49331 11.2362 6.63131 11.3742L8.77649 13.5194C8.92703 13.6699 9.10266 13.7452 9.30338 13.7452C9.5041 13.7452 9.67973 13.6699 9.83027 13.5194L14.083 9.26662C14.221 9.12863 14.29 8.953 14.29 8.73974C14.29 8.52647 14.221 8.35085 14.083 8.21285C13.945 8.07486 13.7694 8.00586 13.5561 8.00586C13.3428 8.00586 13.1672 8.07486 13.0292 8.21285L11.1663 10.0758L9.30338 11.9387Z" fill="white" />
    </svg>
  );

  const FolderIcon = () => (
    <svg width="25" height="25" viewBox="0 0 25 25" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.3623 7.3623H12.3626L9.76199 5.4123C9.50197 5.21829 9.18642 5.11311 8.86199 5.1123H3.8623C3.46448 5.1123 3.08295 5.27034 2.80164 5.55164C2.52034 5.83295 2.3623 6.21448 2.3623 6.6123V19.3623C2.3623 19.7601 2.52034 20.1417 2.80164 20.423C3.08295 20.7043 3.46448 20.8623 3.8623 20.8623H20.3623C20.7601 20.8623 21.1417 20.7043 21.423 20.423C21.7043 20.1417 21.8623 19.7601 21.8623 19.3623V8.8623C21.8623 8.46448 21.7043 8.08295 21.423 7.80165C21.1417 7.52034 20.7601 7.3623 20.3623 7.3623ZM3.8623 6.6123H8.86199L10.8626 8.1123L8.86199 9.61231H3.8623V6.6123ZM20.3623 19.3623H3.8623V11.1123H8.86199C9.18642 11.1115 9.50197 11.0063 9.76199 10.8123L12.3626 8.8623H20.3623V19.3623Z" fill="currentColor" />
    </svg>
  );

  return (
    <div className="fixed left-0 top-0 h-screen font-dmSans md:flex hidden z-40">
      <div 
        className="flex flex-col w-[250px] p-4 border-zinc-200 dark:bg-[#111418] bg-[#111418] h-full"
        style={{ marginLeft: '0px' }}
      >
        {/* Logo */}
        <div className="flex justify-start pb-4">
          <img
            src="/images/logo.png"
            alt="StudyIO Logo"
            className="object-contain cursor-pointer w-11 h-11"
            onClick={() => navigate('/')}
          />
        </div>

        {/* Search */}
        <div className="relative flex items-center mb-3">
          <div className="relative w-full group">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className="absolute transform -translate-y-1/2 lucide lucide-search left-3 top-1/2 text-new_tertiary"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              className="w-full py-1.5 pl-10 pr-8 rounded-md border-none outline-none focus:ring-1 focus:ring-gray-600 transition-shadow duration-200 dark:bg-[#161A20] bg-[#161A20] dark:text-white text-white"
            placeholder={`Search ${subjectData.title} Topics...`}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
        </div>

        {/* Subject Title */}
        <div className="flex justify-between mb-6 rounded-lg text-[15px] px-1 dark:bg-[#161A20] bg-[#161A20]">
          <div className="relative py-1 px-4 m-1 rounded-lg p-2 dark:text-white text-white dark:bg-[#020612] bg-[#020612]">
            {subjectData.title}
            <div className="absolute inset-0 border-[1.5px] rounded-lg p-1 border-[#676A6D]" />
          </div>
        </div>

        {/* Menu Items - Subject Modules and Topics */}
        <div className="flex flex-col pr-1 -mr-2 space-y-6 overflow-y-auto text-sm font-normal">
          {subjectData.modules.map((module: Module) => (
            <div key={module.id} className="mr-2">
              <div
                className={`flex items-center cursor-pointer dark:hover:text-white hover:text-black group ${
                  activeModuleId === module.id 
                    ? 'dark:text-white text-white' 
                    : 'text-[#676A6D]'
                }`}
                onClick={() => toggleModule(module.id)}
              >
                <span className="mr-2">
                  <FolderIcon />
                </span>
                <span className="w-full break-words group-hover:font-medium">
                  {module.title}
                </span>
              </div>

              {/* Topics within module */}
              {expandedModules[module.id] && (
                <div className="mt-4 ml-1 space-y-4">
                  {module.topics.map((topic: Topic) => (
                    <Link
                      key={topic.id}
                      to={`/${subjectId}/${module.id}/${topic.id}`}
                      className={`flex cursor-pointer py-2 pl-3 ${
                        activeTopicId === topic.id
                          ? 'text-white dark:bg-[#13171C] bg-[#13171C] border-l-2 border-[#EA763F]'
                          : 'text-[#676A6D]'
                      } hover:text-white`}
                    >
                      <span className="mr-2">
                        <CheckIcon isActive={activeTopicId === topic.id} />
                      </span>
                      <div className="flex items-start w-full">
                        <span className="text-[14px] break-words w-full dark:text-white text-white">
                          {topic.title}
                        </span>
                        <div onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                        }}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                            className="w-5 h-5 cursor-pointer stroke-[#EA763F] fill-transparent scale-90"
                          >
                            <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* User Profile - Similar to MySidebar */}
        <div className="mt-auto flex items-center mt-2 w-[215px] rounded-lg cursor-pointer py-1 hover:bg-[#13171C]">
          <div className="pl-2">
            <img 
              src="https://takeuforward-content-images.s3.ap-south-1.amazonaws.com/profile/joyson%20stanly?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA2LFMBNFQHZGEYE7P%2F20251018%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20251018T055233Z&X-Amz-Expires=86400&X-Amz-Signature=45e6714f9177e646c668b9d30aa91b362cc3354dbfff0218d329feb18105762e&X-Amz-SignedHeaders=host&x-id=GetObject" 
              className="object-cover w-5 h-5 rounded-full" 
              alt="User avatar" 
            />
          </div>
          <div className="pl-2">
            <div className="text-sm dark:text-white text-white">
              joy
            </div>
          </div>
          <div className="pr-2 ml-auto">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#ADADAD] scale-90">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </div>
        </div>
      </div>

      {/* Collapse Button */}
      <button className="cursor-pointer absolute top-5 -right-[20px] z-[60]">
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="#141414" stroke="#EA763F" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="-ml-16 scale-90">
          <path d="m9 6-6 6 6 6" />
          <path d="M3 12h14" />
          <path d="M21 19V5" />
        </svg>
      </button>
    </div>
  );
};

export default CoreSubjectSidebar;
