import { useState } from "react";
import {
  Home,
  Search,
  Bookmark,
  CheckCircle,
  CircleDot,
  Circle,
  ChevronDown,
  ChevronRight,
  User,
  ArrowLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { operatingSystemData, type Module, type Topic } from "../../data/operatingSystem";

interface CoreSubjectSidebarProps {
  activeModuleId?: string;
  activeTopicId?: string;
}

const CoreSubjectSidebar = ({ activeModuleId, activeTopicId }: CoreSubjectSidebarProps) => {
  const [expandedModules, setExpandedModules] = useState<string[]>([activeModuleId || 'basics-of-operating-systems']);

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const getStatusIcon = (status: Topic['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'current':
        return <CircleDot className="w-4 h-4 text-orange-400" />;
      default:
        return <Circle className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatDuration = (duration?: string) => {
    if (!duration) return '';
    return ` • ${duration}`;
  };

  return (
    <div className="w-80 bg-gray-900 border-r border-gray-800 flex flex-col h-screen">
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <Link to="/" className="flex items-center gap-3 mb-4 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Back to Home</span>
        </Link>
        <h1 className="text-xl font-bold text-white">{operatingSystemData.title}</h1>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-800">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-2">
          {operatingSystemData.modules.map((module: Module) => (
            <div key={module.id}>
              <button
                onClick={() => toggleModule(module.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                  activeModuleId === module.id
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {expandedModules.includes(module.id) ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
                <span className="flex-1 text-sm font-medium">{module.title}</span>
              </button>

              <AnimatePresence>
                {expandedModules.includes(module.id) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="ml-4 mt-2 space-y-1"
                  >
                    {module.topics.map((topic: Topic) => (
                      <Link
                        key={topic.id}
                        to={`/operating-system/${module.id}/${topic.id}`}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                          activeTopicId === topic.id
                            ? 'bg-orange-500/20 text-orange-400 border-l-2 border-orange-500'
                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                        }`}
                      >
                        {getStatusIcon(topic.status)}
                        <div className="flex-1">
                          <p className="text-sm font-medium">{topic.title}</p>
                          {topic.duration && (
                            <p className="text-xs text-gray-500">{formatDuration(topic.duration)}</p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="border-t border-gray-800 p-4">
        <div className="grid grid-cols-3 gap-2 mb-4">
          <Link
            to="/"
            className="flex flex-col items-center gap-1 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span className="text-xs">Home</span>
          </Link>
          <Link
            to="/sessions"
            className="flex flex-col items-center gap-1 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <Bookmark className="w-5 h-5" />
            <span className="text-xs">Track</span>
          </Link>
          <div className="flex flex-col items-center gap-1 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer">
            <User className="w-5 h-5" />
            <span className="text-xs">Profile</span>
          </div>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">J</span>
          </div>
          <div className="flex-1">
            <p className="text-white text-sm font-medium">Joy</p>
            <p className="text-gray-400 text-xs">25721 points</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoreSubjectSidebar;
