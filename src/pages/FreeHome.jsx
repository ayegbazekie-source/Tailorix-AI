import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PullToRefresh from '@/components/PullToRefresh';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { usePremium } from '@/components/PremiumProvider';
import { 
  Trophy, 
  ChevronRight,
  Sparkles,
  Zap,
  Camera,
  Wand2,
  HelpCircle,
  Bot,
  Shirt,
  Home as HomeIcon,
  User,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import HelpOverlay from '../components/HelpOverlay';

export default function FreeHome() {
  const navigate = useNavigate();
  const { user: currentUser, isPremiumActive } = usePremium();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser?.isPro === true) {
      navigate(createPageUrl('PremiumHome'), { replace: true });
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <PullToRefresh onRefresh={handleRefresh} isPremium={false}>
    <div className="min-h-screen bg-gradient-to-br from-[var(--gradient-start)] via-[var(--gradient-middle)] to-[var(--gradient-end)] transition-colors duration-300">


      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-rose-100/40 via-transparent to-transparent" />
        
        <div className="max-w-6xl mx-auto px-4 pt-12 pb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 rounded-full text-rose-600 text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              Professional Tailoring Suite
            </div>
            
            <h1 className="text-2xl md:text-4xl font-light text-[var(--text-primary)] tracking-tight mb-3">
              Welcome to <span className="font-semibold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
                Tailorix AI
              </span>
            </h1>

            <p className="text-sm md:text-base text-[var(--text-secondary)] font-light max-w-2xl mx-auto mb-6 leading-relaxed">
              Your complete AI-powered tailoring toolkit. Analyze garments, generate fashion illustrations, 
              visualize fabrics on templates, and get expert solutions for any fitting challenge.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl('ImageAnalysis')}>
                <Button 
                  size="lg" 
                  className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 text-base rounded-xl shadow-xl shadow-slate-900/10 transition-all hover:shadow-2xl hover:shadow-slate-900/20 hover:-translate-y-0.5"
                >
                  Analyze Garment
                  <Zap className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 gap-4"
        >
          <Link to={createPageUrl('ImageAnalysis')}>
            <FeatureCard 
              icon={Camera}
              title="Professional Analysis"
              description="Upload garment photos for expert fitting diagnosis and alteration guidance"
              color="rose"
            />
          </Link>
          <Link to={createPageUrl('FreeDesignIllustrator')}>
            <FeatureCard 
              icon={Wand2}
              title="Fashion/Design Illustrator"
              description="Create, modify, and transform garment designs with AI assistance"
              color="violet"
            />
          </Link>
          <Link to={createPageUrl('ProblemSolver')}>
            <FeatureCard 
              icon={HelpCircle}
              title="Problem Solver"
              description="Get professional solutions for any fitting or construction issues"
              color="amber"
            />
          </Link>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 gap-4 mt-4"
        >
          <Link to={createPageUrl('AITutor')}>
            <FeatureCard 
              iconUrl="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697d0c21476d1c06f4d428ff/169a0ecf8_TailorixChat.png"
              title="Tailorix AI Chat"
              description="Ask any tailoring question and get detailed, beginner-friendly explanations"
              color="emerald"
            />
          </Link>

          <Link to={createPageUrl('FabricVisualizer')}>
            <FeatureCard 
              icon={Shirt}
              title="Fabric Visualizer"
              description="Preview your fabric on different garment styles with realistic overlay"
              color="blue"
            />
          </Link>
        </motion.div>

        {/* Progress Section */}
        {progress && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16"
          >
            <div className="bg-[var(--card-bg)] rounded-3xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-[var(--card-border)]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-[var(--text-primary)]">Your Progress</h2>
                <Link to={createPageUrl('Progress')}>
                  <Button variant="ghost" className="text-[var(--text-secondary)]">
                    View Details
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <StatCard label="Skill Level" value={progress.skill_level || 1} suffix="" />
                <StatCard label="Total XP" value={progress.total_xp || 0} suffix="xp" />
                <StatCard label="Sessions" value={progress.practice_sessions || 0} suffix="" />
                <StatCard label="Best Accuracy" value={progress.best_accuracy || 0} suffix="%" />
              </div>
            </div>
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-12 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-rose-500/20 via-transparent to-transparent" />
            
            <div className="relative">
              <Trophy className="w-12 h-12 mx-auto mb-6 text-rose-400" />
              <h2 className="text-3xl font-semibold mb-4">Ready to Master Sewing?</h2>
              <p className="text-slate-400 max-w-lg mx-auto mb-8">
                Join thousands of learners improving their sewing skills with AI-powered guidance
              </p>
              <Link to={createPageUrl('ComingSoon')}>
                <Button 
                  size="lg" 
                  className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-6 text-lg rounded-2xl"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
      
      <HelpOverlay isPremium={false} />
    </div>
    </PullToRefresh>
  );
}

function FeatureCard({ icon: Icon, iconUrl, title, description, color }) {
  const colors = {
    rose: 'bg-rose-50 dark:bg-rose-900/30 text-rose-500 dark:text-rose-400',
    violet: 'bg-violet-50 dark:bg-violet-900/30 text-violet-500 dark:text-violet-400',
    amber: 'bg-amber-50 dark:bg-amber-900/30 text-amber-500 dark:text-amber-400',
    emerald: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500 dark:text-emerald-400',
    blue: 'bg-blue-50 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400',
    purple: 'bg-purple-50 dark:bg-purple-900/30 text-purple-500 dark:text-purple-400'
  };

  return (
    <div className="bg-[var(--card-bg)] rounded-xl p-3 shadow-lg shadow-slate-200/50 dark:shadow-none border border-[var(--card-border)] hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer h-full">
      <div className={`w-8 h-8 rounded-lg ${colors[color]} flex items-center justify-center mb-2`}>
        {iconUrl ? (
          <img src={iconUrl} alt={title} className="w-5 h-5 object-contain" />
        ) : (
          <Icon className="w-4 h-4" />
        )}
      </div>
      <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1.5">{title}</h3>
      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{description}</p>
    </div>
  );
}

function StatCard({ label, value, suffix }) {
  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-[var(--text-primary)]">
        {value}<span className="text-lg text-[var(--text-tertiary)] ml-1">{suffix}</span>
      </div>
      <div className="text-sm text-[var(--text-secondary)] mt-1">{label}</div>
    </div>
  );
}