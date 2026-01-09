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
        <div className="w-full mx-4 max-w-7xl">
          <div className="flex justify-between items-center px-4 py-2.5 border border-white/10 bg-black/20 backdrop-blur-xl rounded-full">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                StudyIO
              </span>
            </div>
            
            {/* Center - Dashboard button (only when logged in) */}
            {isAuthenticated() && (
              <div className="absolute transform -translate-x-1/2 left-1/2">
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
                    className="px-4 py-2 transition-colors duration-300 text-white/80 hover:text-white"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup" 
                    className="px-6 py-2 font-semibold transition-all rounded-full bg-gradient-to-r from-orange-500 to-red-500 hover:shadow-lg hover:shadow-orange-500/50"
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
      <section className="px-6 pb-20 pt-36">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 border rounded-full bg-orange-500/10 border-orange-500/20">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium text-orange-500">Your Complete Interview Prep Platform</span>
            </div>
            
            <h1 className="mb-6 text-6xl font-bold leading-tight md:text-7xl">
              Master <span className="text-transparent bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text">
                Tech Interviews
              </span>
              <br />
              with Confidence
            </h1>
            
            <p className="max-w-3xl mx-auto mb-10 text-xl text-gray-400">
              Learn DSA, System Design, and Core CS Subjects with personalised roadmaps, expert videos, and practice built for results.
            </p>

            <div className="flex items-center justify-center gap-4 mb-16">
              <Link 
                to="/signup"
                className="flex items-center gap-2 px-8 py-4 text-lg font-semibold transition-all rounded-lg group bg-gradient-to-r from-orange-500 to-red-500 hover:shadow-xl hover:shadow-orange-500/50"
              >
                Start Learning
                <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-4xl font-bold md:text-5xl">
              Everything You Need to <span className="text-orange-500">Succeed</span>
            </h2>
            <p className="max-w-2xl mx-auto text-xl text-gray-400">
              A complete learning ecosystem designed to take you from basics to advanced
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2">
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
                <h3 className="mb-3 text-2xl font-bold transition-colors group-hover:text-orange-500">
                  {feature.title}
                </h3>
                <p className="leading-relaxed text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-6 py-20 bg-gradient-to-r from-orange-500/5 to-red-500/5">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="mb-6 text-4xl font-bold md:text-5xl">
                Why <span className="text-orange-500">StudyIO</span>?
              </h2>
              <p className="mb-8 text-xl text-gray-400">
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
                    <CheckCircle2 className="flex-shrink-0 w-6 h-6 mt-1 text-orange-500" />
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
              <div className="p-8 border bg-gradient-to-br from-orange-500/5 to-red-500/5 border-orange-500/20 rounded-3xl backdrop-blur-sm">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 border bg-black/20 rounded-xl border-white/5">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Lightning Fast Progress</h4>
                      <p className="text-sm text-gray-400">Learn at your own pace with structured roadmaps</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 border bg-black/20 rounded-xl border-white/5">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Expert-Crafted Content</h4>
                      <p className="text-sm text-gray-400">Industry professionals design every course</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 border bg-black/20 rounded-xl border-white/5">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Real Interview Experience</h4>
                      <p className="text-sm text-gray-400">Practice with questions from top companies</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 border bg-black/20 rounded-xl border-white/5">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Active Community</h4>
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
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative p-12 overflow-hidden text-center bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl"
          >
            <div className="absolute inset-0 bg-grid-white/10" />
            <div className="relative z-10">
              <h2 className="mb-4 text-4xl font-bold md:text-5xl">
                Ready to Start Your Journey?
              </h2>
              <p className="mb-8 text-xl text-white/90">
                Join StudyIO today and ace your next coding interview
              </p>
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold text-orange-500 transition-all bg-white rounded-lg hover:shadow-xl"
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
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 mb-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500">
                  <Code2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">StudyIO</span>
              </div>
              <p className="text-sm text-gray-400">
                Your complete platform for coding interview preparation
              </p>
            </div>
            
            <div>
              <h4 className="mb-4 font-semibold">Learn</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/dsa" className="transition-colors hover:text-orange-500">DSA</Link></li>
                <li><Link to="/core-subjects" className="transition-colors hover:text-orange-500">Core Subjects</Link></li>
                <li><Link to="/aptitude" className="transition-colors hover:text-orange-500">Aptitude</Link></li>
                <li><Link to="/mock-tests" className="transition-colors hover:text-orange-500">Mock Tests</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="mb-4 font-semibold">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="transition-colors hover:text-orange-500">About</a></li>
                <li><a href="#" className="transition-colors hover:text-orange-500">Careers</a></li>
                <li><a href="#" className="transition-colors hover:text-orange-500">Blog</a></li>
                <li><a href="#" className="transition-colors hover:text-orange-500">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="mb-4 font-semibold">Connect</h4>
              <div className="flex gap-3">
                <a href="#" className="flex items-center justify-center w-10 h-10 transition-colors rounded-lg bg-white/5 hover:bg-orange-500">
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className="flex items-center justify-center w-10 h-10 transition-colors rounded-lg bg-white/5 hover:bg-orange-500">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="flex items-center justify-center w-10 h-10 transition-colors rounded-lg bg-white/5 hover:bg-orange-500">
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-[#2a2a2a] pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>&copy; 2026 StudyIO. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="transition-colors hover:text-orange-500">Privacy Policy</a>
              <a href="#" className="transition-colors hover:text-orange-500">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
