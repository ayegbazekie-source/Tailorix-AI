import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { createPageUrl } from '@/utils';
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
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import HelpOverlay from './HelpOverlay';

export default function FreeHome({ currentUser, progress }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--gradient-start)] via-[var(--gradient-middle)] to-[var(--gradient-end)] transition-colors duration-300 pb-20">
      {/* Profile Icon in Top Right */}
      <div className="fixed top-4 right-4 z-50">
        <Link to={createPageUrl('UserProfile')}>
          <Button
            size="icon"
            className="bg-[var(--card-bg)] hover:bg-[var(--card-bg)] shadow-lg border border-[var(--border-primary)] rounded-full"
          >
            <User className="w-5 h-5 text-[var(--text-primary)]" />
          </Button>
        </Link>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-rose-100/40 via-transparent to-transparent" />
        
        <div className="max-w-6xl mx-auto px-6 pt-10 pb-24">
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
            
            <h1 className="text-3xl md:text-5xl font-light text-[var(--text-primary)] tracking-tight mb-4">
              Welcome to <span className="font-semibold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
                Tailorix AI
              </span>
            </h1>

            <p className="text-sm md:text-base text-[var(--text-secondary)] font-light max-w-2xl mx-auto mb-8 leading-relaxed">
              Your complete AI-powered tailoring toolkit. Analyze garments, generate fashion illustrations, 
              visualize fabrics on templates, and get expert solutions for any fitting challenge.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl('ImageAnalysis')}>
                <Button 
                  size="lg" 
                  className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-6 text-lg rounded-2xl shadow-xl shadow-slate-900/10 transition-all hover:shadow-2xl hover:shadow-slate-900/20 hover:-translate-y-0.5"
                >
                  Analyze Garment
                  <Zap className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-24">
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
          <Link to={createPageUrl('DesignGenerator')}>
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
              iconUrl="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697d0c21476d1c06f4d428ff/7b1487fb4_Sewie-logo.png"
              title="Sewie Chat"
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
      
      <HelpOverlay />

      {/* Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--card-bg)] border-t border-[var(--border-primary)] backdrop-blur-lg">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <div className="flex items-center justify-around">
            <Link to={createPageUrl('Home')}>
              <Button
                variant="ghost"
                className="flex flex-col items-center gap-1 h-auto py-2 text-rose-600"
              >
                <HomeIcon className="w-6 h-6" />
                <span className="text-xs">Home</span>
              </Button>
            </Link>
            <Link to={createPageUrl('ImageAnalysis')}>
              <Button
                variant="ghost"
                className="flex flex-col items-center gap-1 h-auto py-2 text-[var(--text-secondary)]"
              >
                <Camera className="w-6 h-6" />
                <span className="text-xs">Analyze</span>
              </Button>
            </Link>
            <Link to={createPageUrl('DesignGenerator')}>
              <Button
                variant="ghost"
                className="flex flex-col items-center gap-1 h-auto py-2 text-[var(--text-secondary)]"
              >
                <Wand2 className="w-6 h-6" />
                <span className="text-xs">Design</span>
              </Button>
            </Link>
            <Link to={createPageUrl('AITutor')}>
              <Button
                variant="ghost"
                className="flex flex-col items-center gap-1 h-auto py-2 text-[var(--text-secondary)]"
              >
                <Bot className="w-6 h-6" />
                <span className="text-xs">Chat</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
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
    <div className="bg-[var(--card-bg)] rounded-2xl p-4 shadow-lg shadow-slate-200/50 dark:shadow-none border border-[var(--card-border)] hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer h-full">
      <div className={`w-10 h-10 rounded-xl ${colors[color]} flex items-center justify-center mb-3`}>
        {iconUrl ? (
          <img src={iconUrl} alt={title} className="w-6 h-6 object-contain" />
        ) : (
          <Icon className="w-5 h-5" />
        )}
      </div>
      <h3 className="text-base font-semibold text-[var(--text-primary)] mb-2">{title}</h3>
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