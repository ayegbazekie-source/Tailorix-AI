import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { createPageUrl } from '@/utils';
import { 
  BookOpen, 
  Target, 
  Flame,
  ChevronRight,
  ArrowLeft,
  GraduationCap,
  Repeat,
  Trophy
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ModeSelect() {
  const modes = [
    {
      id: 'learn',
      title: 'Learn',
      subtitle: 'Guided Lessons',
      description: 'Step-by-step tutorials with AI guidance. Perfect for beginners starting their sewing journey.',
      icon: GraduationCap,
      color: 'rose',
      features: ['Structured curriculum', 'Video explanations', 'Progressive difficulty'],
      link: createPageUrl('Lessons')
    },
    {
      id: 'practice',
      title: 'Practice',
      subtitle: 'Free Sewing',
      description: 'Practice on any fabric with any stitch. Get instant AI feedback on your technique.',
      icon: Repeat,
      color: 'violet',
      features: ['Choose any fabric', 'Unlimited practice', 'Real-time feedback'],
      link: createPageUrl('FabricSelect') + '?mode=practice'
    },
    {
      id: 'challenge',
      title: 'Challenge',
      subtitle: 'Test Skills',
      description: 'Put your skills to the test with timed challenges and earn achievements.',
      icon: Trophy,
      color: 'amber',
      features: ['Timed sessions', 'Earn XP & badges', 'Leaderboard'],
      link: createPageUrl('FabricSelect') + '?mode=challenge'
    }
  ];

  const colorClasses = {
    rose: {
      bg: 'bg-rose-50',
      icon: 'bg-rose-100 text-rose-500',
      border: 'border-rose-200',
      hover: 'hover:border-rose-300 hover:shadow-rose-100/50'
    },
    violet: {
      bg: 'bg-violet-50',
      icon: 'bg-violet-100 text-violet-500',
      border: 'border-violet-200',
      hover: 'hover:border-violet-300 hover:shadow-violet-100/50'
    },
    amber: {
      bg: 'bg-amber-50',
      icon: 'bg-amber-100 text-amber-500',
      border: 'border-amber-200',
      hover: 'hover:border-amber-300 hover:shadow-amber-100/50'
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <Link to={createPageUrl('Home')}>
            <Button variant="ghost" className="mb-6 text-slate-500 -ml-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-light text-slate-900 tracking-tight mb-4">
              Choose Your <span className="font-semibold">Mode</span>
            </h1>
            <p className="text-xl text-slate-500 font-light">
              How would you like to practice today?
            </p>
          </motion.div>
        </div>

        {/* Mode Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {modes.map((mode, index) => (
            <motion.div
              key={mode.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link to={mode.link}>
                <div 
                  className={`
                    h-full bg-white rounded-3xl p-8 border-2 
                    ${colorClasses[mode.color].border}
                    ${colorClasses[mode.color].hover}
                    shadow-lg transition-all duration-300
                    hover:shadow-xl hover:-translate-y-1 cursor-pointer
                  `}
                >
                  <div className={`
                    w-16 h-16 rounded-2xl flex items-center justify-center mb-6
                    ${colorClasses[mode.color].icon}
                  `}>
                    <mode.icon className="w-8 h-8" />
                  </div>

                  <div className="mb-6">
                    <p className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-1">
                      {mode.subtitle}
                    </p>
                    <h2 className="text-2xl font-semibold text-slate-900 mb-3">
                      {mode.title}
                    </h2>
                    <p className="text-slate-500 leading-relaxed">
                      {mode.description}
                    </p>
                  </div>

                  <ul className="space-y-2 mb-8">
                    {mode.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                        <div className={`w-1.5 h-1.5 rounded-full ${colorClasses[mode.color].icon.split(' ')[0]}`} />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center text-slate-900 font-medium">
                    Start {mode.title}
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}