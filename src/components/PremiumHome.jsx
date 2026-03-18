import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { createPageUrl } from '@/utils';
import { 
  Crown, 
  Camera, 
  Wand2, 
  HelpCircle, 
  Bot, 
  Shirt,
  Users,
  MessageSquare,
  History,
  Share2,
  Sparkles,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PremiumHome({ currentUser, progress, showProActivation }) {
  const premiumFeatures = [
    {
      icon: Camera,
      title: "Professional Analysis",
      description: "Unlimited garment analysis with advanced AI diagnostics",
      color: "gold",
      page: "ImageAnalysis"
    },
    {
      icon: Wand2,
      title: "Fashion Illustrator",
      description: "Unlimited design creation, modification & style conversion",
      color: "gold",
      page: "DesignGenerator"
    },
    {
      icon: Share2,
      title: "Team Collaboration",
      description: "Share designs with your team and collaborate in real-time",
      color: "gold",
      page: "TeamCollaboration"
    },
    {
      icon: MessageSquare,
      title: "Design Comments",
      description: "Add annotations and feedback directly on designs",
      color: "gold",
      page: "DesignComments"
    },
    {
      icon: History,
      title: "Version History",
      description: "Track changes and restore previous design versions",
      color: "gold",
      page: "VersionControl"
    },
    {
      icon: HelpCircle,
      title: "Problem Solver",
      description: "Unlimited access to expert fitting solutions",
      color: "gold",
      page: "ProblemSolver"
    },
    {
      icon: Bot,
      title: "Sewie Chat Pro",
      description: "Priority AI assistance for all your tailoring questions",
      color: "gold",
      iconUrl: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697d0c21476d1c06f4d428ff/7b1487fb4_Sewie-logo.png",
      page: "AITutor"
    },
    {
      icon: Shirt,
      title: "Fabric Visualizer Pro",
      description: "Advanced fabric preview with premium templates",
      color: "gold",
      page: "FabricVisualizer"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#1E1E1E] relative overflow-hidden pb-20">
      {/* Luxury Texture Overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `repeating-linear-gradient(0deg, rgba(212, 175, 55, 0.05) 0px, transparent 1px, transparent 2px, rgba(212, 175, 55, 0.05) 3px),
                          repeating-linear-gradient(90deg, rgba(212, 175, 55, 0.05) 0px, transparent 1px, transparent 2px, rgba(212, 175, 55, 0.05) 3px)`
      }} />

      {/* Pro Activation Success Message */}
      {showProActivation && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 px-6 py-4 rounded-xl shadow-2xl"
        >
          <div className="flex items-center gap-3">
            <Crown className="w-6 h-6 animate-pulse" />
            <span className="font-bold text-lg">🎉 SewSimple Pro activated successfully!</span>
          </div>
        </motion.div>
      )}

      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-900/20 via-transparent to-transparent" />
        
        <div className="max-w-6xl mx-auto px-6 pt-10 pb-24 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-900/30 to-yellow-900/30 border border-amber-500/30 rounded-full text-amber-400 text-sm font-bold mb-8 shadow-lg">
              <Crown className="w-4 h-4" />
              Premium Member
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-4">
              Welcome to <span className="bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
                Tailorix AI Pro
              </span>
            </h1>

            <p className="text-base md:text-lg text-amber-200/80 font-light max-w-2xl mx-auto mb-8 leading-relaxed">
              Unlimited access to all premium features. Professional AI-powered tailoring toolkit with team collaboration, 
              version control, and advanced design tools.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl('ImageAnalysis')}>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-900 font-bold px-8 py-6 text-lg rounded-2xl shadow-2xl shadow-amber-500/30 transition-all hover:shadow-amber-500/50 hover:-translate-y-0.5"
                >
                  Start Analyzing
                  <Zap className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Premium Features Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-24 relative">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-2xl md:text-3xl font-bold text-white text-center mb-8"
        >
          Your Premium Features
        </motion.h2>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {premiumFeatures.map((feature, index) => (
            <Link key={index} to={createPageUrl(feature.page)}>
              <PremiumFeatureCard {...feature} />
            </Link>
          ))}
        </motion.div>

        {/* Premium Stats */}
        {progress && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16"
          >
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 shadow-2xl border-2 border-amber-500/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-amber-400" />
                  Your Progress
                </h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <PremiumStatCard label="Skill Level" value={progress.skill_level || 1} />
                <PremiumStatCard label="Total XP" value={progress.total_xp || 0} suffix="xp" />
                <PremiumStatCard label="Sessions" value={progress.practice_sessions || 0} />
                <PremiumStatCard label="Best Accuracy" value={progress.best_accuracy || 0} suffix="%" />
              </div>
            </div>
          </motion.div>
        )}

        {/* Premium Perks Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16"
        >
          <div className="bg-gradient-to-r from-amber-900/30 to-yellow-900/30 border-2 border-amber-500/30 rounded-3xl p-8 text-center">
            <Crown className="w-16 h-16 mx-auto mb-4 text-amber-400" />
            <h3 className="text-2xl font-bold text-white mb-3">Premium Membership Active</h3>
            <p className="text-amber-200/80 max-w-2xl mx-auto mb-6">
              You have unlimited access to all features including team collaboration, version history, 
              and priority support. Your subscription renews automatically.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="px-4 py-2 bg-slate-800/50 rounded-lg border border-amber-500/20">
                <span className="text-amber-400 font-bold">✓ No Ads</span>
              </div>
              <div className="px-4 py-2 bg-slate-800/50 rounded-lg border border-amber-500/20">
                <span className="text-amber-400 font-bold">✓ Unlimited Generations</span>
              </div>
              <div className="px-4 py-2 bg-slate-800/50 rounded-lg border border-amber-500/20">
                <span className="text-amber-400 font-bold">✓ Team Collaboration</span>
              </div>
              <div className="px-4 py-2 bg-slate-800/50 rounded-lg border border-amber-500/20">
                <span className="text-amber-400 font-bold">✓ Priority Support</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 border-t-2 border-amber-500/20 backdrop-blur-lg">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <div className="flex items-center justify-around">
            <Link to={createPageUrl('Home')}>
              <Button
                variant="ghost"
                className="flex flex-col items-center gap-1 h-auto py-2 text-amber-400 hover:text-amber-300 hover:bg-amber-900/20"
              >
                <Crown className="w-6 h-6" />
                <span className="text-xs font-bold">Home</span>
              </Button>
            </Link>
            <Link to={createPageUrl('ImageAnalysis')}>
              <Button
                variant="ghost"
                className="flex flex-col items-center gap-1 h-auto py-2 text-amber-200/60 hover:text-amber-300 hover:bg-amber-900/20"
              >
                <Camera className="w-6 h-6" />
                <span className="text-xs">Analyze</span>
              </Button>
            </Link>
            <Link to={createPageUrl('DesignGenerator')}>
              <Button
                variant="ghost"
                className="flex flex-col items-center gap-1 h-auto py-2 text-amber-200/60 hover:text-amber-300 hover:bg-amber-900/20"
              >
                <Wand2 className="w-6 h-6" />
                <span className="text-xs">Design</span>
              </Button>
            </Link>
            <Link to={createPageUrl('TeamCollaboration')}>
              <Button
                variant="ghost"
                className="flex flex-col items-center gap-1 h-auto py-2 text-amber-200/60 hover:text-amber-300 hover:bg-amber-900/20"
              >
                <Users className="w-6 h-6" />
                <span className="text-xs">Team</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function PremiumFeatureCard({ icon: Icon, iconUrl, title, description }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 shadow-2xl border-2 border-amber-500/20 hover:border-amber-500/40 transition-all cursor-pointer h-full group"
    >
      <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-amber-500/30 group-hover:shadow-amber-500/50 transition-shadow">
        {iconUrl ? (
          <img src={iconUrl} alt={title} className="w-7 h-7 object-contain" />
        ) : (
          <Icon className="w-6 h-6 text-slate-900" />
        )}
      </div>
      <h3 className="text-base font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-amber-200/70 leading-relaxed">{description}</p>
    </motion.div>
  );
}

function PremiumStatCard({ label, value, suffix = '' }) {
  return (
    <div className="text-center p-4 bg-slate-900/50 rounded-xl border border-amber-500/20">
      <div className="text-3xl font-bold text-amber-400">
        {value}<span className="text-lg text-amber-500/70 ml-1">{suffix}</span>
      </div>
      <div className="text-sm text-amber-200/60 mt-1 font-medium">{label}</div>
    </div>
  );
}