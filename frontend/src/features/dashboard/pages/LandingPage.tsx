import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Code2, 
  Brain, 
  Trophy, 
  Users, 
  ChevronRight, 
  Sparkles,
  BookOpen,
  Target,
  Zap,
  CheckCircle2,
  Github,
  Linkedin,
  Twitter,
  LayoutDashboard
} from 'lucide-react';
import { useAuth } from '@/features/auth/stores/AuthContext';
import { UserDropdown } from '@/shared/components/ui';

const LandingPage = () => {
  const { user, isAuthenticated, logout } = useAuth();

  const features = [
    {
      icon: Code2,
      title: "DSA Mastery",
      description: "473+ curated problems across 19+ topics with in-depth editorials and video solutions",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: BookOpen,
      title: "Core CS Subjects",
      description: "Master Operating Systems, DBMS, Computer Networks, OOPS, and Low Level Design",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Brain,
      title: "Aptitude Excellence",
      description: "1500+ problems covering Quantitative, Logical Reasoning, and Verbal Ability",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Target,
      title: "Biweekly Sessions",
      description: "Attend live sessions every two weeks, interact with experts, receive personalized feedback, and strengthen coding and interview preparation",
      gradient: "from-green-500 to-emerald-500"
    }
  ];

  const stats = [
    { value: "2000+", label: "Problems" },
    { value: "50+", label: "Topics Covered" },
    { value: "10K+", label: "Active Learners" },
    { value: "95%", label: "Success Rate" }
  ];

  const benefits = [
    "Track your progress with detailed analytics",
    "Maintain coding streaks and build consistency",
    "Access comprehensive editorials with multiple approaches",
    "Practice with real interview questions",
    "Interactive learning with quizzes and mock tests",
    "Personalized learning roadmaps"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0f0f] via-[#1a1a1a] to-[#0f0f0f] text-white">
      {/* Navigation */}
      <nav className="fixed left-0 right-0 z-50 flex justify-center mt-4">
        <div className="w-full max-w-7xl mx-4">
          <div className="flex justify-between items-center px-4 py-2.5 border border-white/10 bg-black/20 backdrop-blur-xl rounded-full">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                StudyIO
              </span>
            </div>
            
            {/* Center - Dashboard button (only when logged in) */}
            {isAuthenticated() && (
              <div className="absolute left-1/2 transform -translate-x-1/2">
                <Link
                  to="/home"
                  className="group flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#252525] text-white text-sm px-5 py-2 rounded-lg font-medium transition-all duration-200 border border-[#3a3a3a] hover:border-orange-500/50 hover:shadow-[0_0_12px_rgba(249,115,22,0.15)]"
                >
                  <LayoutDashboard className="w-4 h-4 text-orange-500 transition-colors group-hover:text-orange-400" />
                  <span>Dashboard</span>
                </Link>
              </div>
            )}
            
            <div className="flex items-center gap-4">
              {isAuthenticated() ? (
                <UserDropdown 
                  user={user} 
                  onLogout={logout} 
                  position="bottom-right"
                  avatarSize="md"
                />
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="px-4 py-2 text-white/80 hover:text-white transition-colors duration-300"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup" 
                    className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full font-semibold hover:shadow-lg hover:shadow-orange-500/50 transition-all"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-36 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span className="text-sm text-orange-500 font-medium">Your Complete Interview Prep Platform</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
              Master <span className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
                Tech Interviews
              </span>
              <br />
              with Confidence
            </h1>
            
            <p className="text-xl text-gray-400 mb-10 max-w-3xl mx-auto">
              Learn DSA, System Design, and Core CS Subjects with personalised roadmaps, expert videos, and practice built for results.
            </p>

            <div className="flex items-center justify-center gap-4 mb-16">
              <Link 
                to="/signup"
                className="group px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg font-semibold text-lg hover:shadow-xl hover:shadow-orange-500/50 transition-all flex items-center gap-2"
              >
                Start Learning
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need to <span className="text-orange-500">Succeed</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              A complete learning ecosystem designed to take you from basics to advanced
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group p-8 bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-[#2a2a2a] rounded-2xl hover:border-orange-500/50 transition-all"
              >
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.gradient} mb-4`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 group-hover:text-orange-500 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-orange-500/5 to-red-500/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Why <span className="text-orange-500">StudyIO</span>?
              </h2>
              <p className="text-xl text-gray-400 mb-8">
                Join thousands of developers who have transformed their coding skills and landed their dream jobs.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
                    <span className="text-lg text-gray-300">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-orange-500/5 to-red-500/5 border border-orange-500/20 rounded-3xl p-8 backdrop-blur-sm">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-black/20 rounded-xl border border-white/5">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">Lightning Fast Progress</h4>
                      <p className="text-sm text-gray-400">Learn at your own pace with structured roadmaps</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-black/20 rounded-xl border border-white/5">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">Expert-Crafted Content</h4>
                      <p className="text-sm text-gray-400">Industry professionals design every course</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-black/20 rounded-xl border border-white/5">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">Real Interview Experience</h4>
                      <p className="text-sm text-gray-400">Practice with questions from top companies</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-black/20 rounded-xl border border-white/5">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">Active Community</h4>
                      <p className="text-sm text-gray-400">Join thousands of learners worldwide</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-12 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-grid-white/10" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Ready to Start Your Journey?
              </h2>
              <p className="text-xl mb-8 text-white/90">
                Join StudyIO today and ace your next coding interview
              </p>
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-orange-500 rounded-lg font-semibold text-lg hover:shadow-xl transition-all"
              >
                Create Account
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#2a2a2a] py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <Code2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">StudyIO</span>
              </div>
              <p className="text-gray-400 text-sm">
                Your complete platform for coding interview preparation
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Learn</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/dsa" className="hover:text-orange-500 transition-colors">DSA</Link></li>
                <li><Link to="/core-subjects" className="hover:text-orange-500 transition-colors">Core Subjects</Link></li>
                <li><Link to="/aptitude" className="hover:text-orange-500 transition-colors">Aptitude</Link></li>
                <li><Link to="/mock-tests" className="hover:text-orange-500 transition-colors">Mock Tests</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-orange-500 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-colors">
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-[#2a2a2a] pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>&copy; 2025 StudyIO. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-orange-500 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-orange-500 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
