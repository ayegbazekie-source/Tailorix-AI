import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PullToRefresh from '@/components/PullToRefresh';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { usePremium } from '@/components/PremiumProvider';
import { 
  Crown, 
  Camera, 
  Wand2, 
  HelpCircle,
  Shirt,
  Share2,
  Sparkles,
  Zap,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import HelpOverlay from '@/components/HelpOverlay';

export default function PremiumHome() {
  const navigate = useNavigate();
  const { user: currentUser, isPremiumActive } = usePremium();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showProActivation, setShowProActivation] = useState(false);

  useEffect(() => {
    if (currentUser && currentUser.isPro !== true) {
      navigate(createPageUrl('FreeHome'), { replace: true });
      return;
    }
    loadUserData();
  }, [currentUser, navigate]);

  const loadUserData = async () => {
    if (!currentUser) {
      navigate(createPageUrl('Landing'), { replace: true });
      return;
    }

    try {
      const proActivationShown = localStorage.getItem('pro_activation_shown');
      if (isPremiumActive && !proActivationShown) {
        setShowProActivation(true);
        localStorage.setItem('pro_activation_shown', 'true');
        setTimeout(() => setShowProActivation(false), 5000);
      }
      
      const progressData = await base44.entities.UserProgress.filter({ user_id: currentUser.id });
      if (progressData.length > 0) {
        setProgress(progressData[0]);
      }
    } catch (e) {
      console.error('Error loading data:', e);
    }
    setLoading(false);
  };

  const handleRefresh = async () => {
    await loadUserData();
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-2">SewSimple Pro</h2>
          <p className="text-slate-400">Loading your premium experience...</p>
        </div>
      </div>
    );
  }

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
      page: "WorkspaceList"
    },

    {
      icon: HelpCircle,
      title: "Problem Solver",
      description: "Unlimited access to expert fitting solutions",
      color: "gold",
      page: "ProblemSolver"
    },
    {
      iconUrl: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697d0c21476d1c06f4d428ff/169a0ecf8_TailorixChat.png",
      title: "Tailorix AI Chat Pro",
      description: "Priority AI assistance for all your tailoring questions",
      color: "gold",
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
    <PullToRefresh onRefresh={handleRefresh} isPremium={true}>
    <div className="min-h-screen bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#1E1E1E] relative overflow-hidden">
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

        <div className="max-w-6xl mx-auto px-4 pt-12 pb-16 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-900/30 to-yellow-900/30 border border-amber-500/30 rounded-full text-amber-400 text-xs font-semibold mb-4 shadow-sm">
              <Crown className="w-3.5 h-3.5" />
              Premium Member
            </div>
            
            <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-tight mb-3">
              <span className="bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
                Tailorix AI Pro
              </span>
            </h1>

            <p className="text-sm md:text-base text-amber-200/70 font-normal max-w-xl mx-auto mb-6 leading-relaxed">
              Unlimited AI design tools, advanced modification, team collaboration, and full creative control.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to={createPageUrl('ImageAnalysis')}>
                <Button 
                  className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-900 font-semibold px-6 py-2.5 text-sm rounded-xl shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
                >
                  Start Analyzing
                  <Zap className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Premium Features Grid */}
      <div className="max-w-6xl mx-auto px-4 pb-16 relative">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-xl md:text-2xl font-semibold text-white text-center mb-6"
        >
          Your Premium Features
        </motion.h2>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
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
            className="mt-8"
          >
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 shadow-sm border border-amber-500/20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  Your Progress
                </h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
          className="mt-8"
        >
          <div className="bg-gradient-to-r from-amber-900/30 to-yellow-900/30 border border-amber-500/30 rounded-xl p-6 text-center">
            <Crown className="w-12 h-12 mx-auto mb-3 text-amber-400" />
            <h3 className="text-xl font-semibold text-white mb-2">Premium Membership Active</h3>
            <p className="text-amber-200/70 text-sm max-w-xl mx-auto mb-4">
              Unlimited access to all features including team collaboration, version history, and priority support.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <div className="px-3 py-1.5 bg-slate-800/50 rounded-lg border border-amber-500/20">
                <span className="text-amber-400 text-xs font-semibold">✓ No Ads</span>
              </div>
              <div className="px-3 py-1.5 bg-slate-800/50 rounded-lg border border-amber-500/20">
                <span className="text-amber-400 text-xs font-semibold">✓ Unlimited Generations</span>
              </div>
              <div className="px-3 py-1.5 bg-slate-800/50 rounded-lg border border-amber-500/20">
                <span className="text-amber-400 text-xs font-semibold">✓ Team Collaboration</span>
              </div>
              <div className="px-3 py-1.5 bg-slate-800/50 rounded-lg border border-amber-500/20">
                <span className="text-amber-400 text-xs font-semibold">✓ Priority Support</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>



      {/* Help Overlay - Premium Styled */}
      <HelpOverlay isPremium={true} />
    </div>
    </PullToRefresh>
  );
}

function PremiumFeatureCard({ icon: Icon, iconUrl, title, description }) {
  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 shadow-sm border border-amber-500/20 hover:border-amber-500/30 transition-all cursor-pointer h-full group"
    >
      <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-lg flex items-center justify-center mb-3 shadow-sm shadow-amber-500/20 group-hover:shadow-amber-500/30 transition-shadow">
        {iconUrl ? (
          <img src={iconUrl} alt={title} className="w-6 h-6 object-contain" />
        ) : (
          <Icon className="w-5 h-5 text-slate-900" />
        )}
      </div>
      <h3 className="text-sm font-semibold text-white mb-1.5">{title}</h3>
      <p className="text-xs text-amber-200/60 leading-relaxed">{description}</p>
    </motion.div>
  );
}

function PremiumStatCard({ label, value, suffix = '' }) {
  return (
    <div className="text-center p-3 bg-slate-900/50 rounded-lg border border-amber-500/20">
      <div className="text-2xl font-semibold text-amber-400">
        {value}<span className="text-sm text-amber-500/70 ml-1">{suffix}</span>
      </div>
      <div className="text-xs text-amber-200/60 mt-0.5 font-medium">{label}</div>
    </div>
  );
}