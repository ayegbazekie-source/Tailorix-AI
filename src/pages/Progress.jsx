import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { 
  ArrowLeft,
  Trophy,
  Target,
  Zap,
  Clock,
  Star,
  Medal,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProgressPage() {
  const [userProgress, setUserProgress] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const user = await base44.auth.me();
      
      const [progressData, sessionData] = await Promise.all([
        base44.entities.UserProgress.filter({ user_id: user.id }),
        base44.entities.SewingSession.filter({ user_id: user.id }, '-created_date', 10)
      ]);

      if (progressData.length > 0) {
        setUserProgress(progressData[0]);
      }
      setSessions(sessionData);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const getLevelTitle = (level) => {
    if (level >= 90) return 'Master Tailor';
    if (level >= 70) return 'Expert Seamstress';
    if (level >= 50) return 'Skilled Crafter';
    if (level >= 30) return 'Apprentice';
    if (level >= 10) return 'Beginner';
    return 'Novice';
  };

  const getNextLevelXP = (currentXP) => {
    const levels = [0, 100, 250, 500, 1000, 2000, 3500, 5000, 7500, 10000];
    for (let i = 0; i < levels.length; i++) {
      if (currentXP < levels[i]) return levels[i];
    }
    return levels[levels.length - 1];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-12 w-48 mb-8" />
          <Skeleton className="h-48 rounded-3xl mb-8" />
          <Skeleton className="h-64 rounded-3xl" />
        </div>
      </div>
    );
  }

  const currentXP = userProgress?.total_xp || 0;
  const nextLevelXP = getNextLevelXP(currentXP);
  const xpProgress = nextLevelXP > 0 ? (currentXP / nextLevelXP) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link to={createPageUrl('Home')}>
            <Button variant="ghost" className="mb-6 text-slate-500 -ml-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-light text-slate-900 tracking-tight mb-4">
              Your <span className="font-semibold">Progress</span>
            </h1>
          </motion.div>
        </div>

        {/* Level Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-3xl p-8 text-white mb-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full transform translate-x-16 -translate-y-16" />
          
          <div className="relative">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Trophy className="w-8 h-8" />
              </div>
              <div>
                <p className="text-amber-100">Current Rank</p>
                <h2 className="text-3xl font-bold">{getLevelTitle(userProgress?.skill_level || 1)}</h2>
              </div>
            </div>

            <div className="mb-2 flex items-center justify-between">
              <span className="text-amber-100">Level {Math.floor((userProgress?.skill_level || 1) / 10) + 1}</span>
              <span className="font-semibold">{currentXP} / {nextLevelXP} XP</span>
            </div>
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, xpProgress)}%` }}
                transition={{ duration: 1 }}
                className="h-full bg-white rounded-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <StatCard 
            icon={Target} 
            label="Best Accuracy" 
            value={`${userProgress?.best_accuracy || 0}%`}
            color="emerald"
          />
          <StatCard 
            icon={Zap} 
            label="Total Stitches" 
            value={userProgress?.total_stitches || 0}
            color="violet"
          />
          <StatCard 
            icon={Clock} 
            label="Sessions" 
            value={userProgress?.practice_sessions || 0}
            color="rose"
          />
          <StatCard 
            icon={Star} 
            label="Total XP" 
            value={userProgress?.total_xp || 0}
            color="amber"
          />
        </motion.div>

        {/* Achievements */}
        {userProgress?.achievements && userProgress.achievements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100 mb-8"
          >
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Medal className="w-5 h-5 text-amber-500" />
              Achievements
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {userProgress.achievements.map((achievement, i) => (
                <div key={i} className="p-4 bg-amber-50 rounded-xl text-center border border-amber-100">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Trophy className="w-6 h-6 text-amber-500" />
                  </div>
                  <p className="font-semibold text-slate-900 text-sm">{achievement.name}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Recent Sessions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100"
        >
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-slate-400" />
            Recent Sessions
          </h2>
          
          {sessions.length > 0 ? (
            <div className="space-y-3">
              {sessions.map((session, i) => (
                <div key={session.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                  <div className={`
                    w-10 h-10 rounded-lg flex items-center justify-center
                    ${session.passed ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'}
                  `}>
                    {session.passed ? <TrendingUp className="w-5 h-5" /> : <Target className="w-5 h-5" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 capitalize">{session.mode} Session</p>
                    <p className="text-sm text-slate-500">
                      Accuracy: {session.accuracy_score || 0}% • {session.stitch_data?.total_stitches || 0} stitches
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-amber-500">+{session.xp_earned || 0} XP</p>
                    <p className="text-xs text-slate-400">
                      {new Date(session.created_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <p>No sessions yet. Start practicing to see your history!</p>
              <Link to={createPageUrl('ModeSelect')}>
                <Button className="mt-4 bg-rose-500 hover:bg-rose-600">Start Practicing</Button>
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  const colors = {
    emerald: 'bg-emerald-100 text-emerald-600',
    violet: 'bg-violet-100 text-violet-600',
    rose: 'bg-rose-100 text-rose-600',
    amber: 'bg-amber-100 text-amber-600'
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-lg border border-slate-100 text-center">
      <div className={`w-12 h-12 rounded-xl ${colors[color]} flex items-center justify-center mx-auto mb-3`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      <div className="text-sm text-slate-500">{label}</div>
    </div>
  );
}