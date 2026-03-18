import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { 
  ArrowLeft,
  Lock,
  CheckCircle2,
  PlayCircle,
  Clock,
  Star,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

export default function Lessons() {
  const [lessons, setLessons] = useState([]);
  const [userProgress, setUserProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const lessonData = await base44.entities.Lesson.list('order');
      setLessons(lessonData);

      const user = await base44.auth.me().catch(() => null);
      if (user) {
        const progress = await base44.entities.UserProgress.filter({ user_id: user.id });
        if (progress.length > 0) {
          setUserProgress(progress[0]);
        }
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const isCompleted = (lessonId) => {
    return userProgress?.completed_lessons?.includes(lessonId);
  };

  const isUnlocked = (lesson, index) => {
    if (index === 0) return true;
    // Unlock if previous lesson is completed
    const prevLesson = lessons[index - 1];
    return isCompleted(prevLesson?.id);
  };

  const completedCount = lessons.filter(l => isCompleted(l.id)).length;
  const progressPercentage = lessons.length > 0 ? (completedCount / lessons.length) * 100 : 0;

  const difficultyColors = {
    beginner: 'bg-emerald-100 text-emerald-700',
    intermediate: 'bg-amber-100 text-amber-700',
    advanced: 'bg-rose-100 text-rose-700'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link to={createPageUrl('ModeSelect')}>
            <Button variant="ghost" className="mb-6 text-slate-500 -ml-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Modes
            </Button>
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-light text-slate-900 tracking-tight mb-4">
              Sewing <span className="font-semibold">Curriculum</span>
            </h1>
            <p className="text-xl text-slate-500 font-light">
              Master sewing through structured, progressive lessons.
            </p>
          </motion.div>
        </div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Your Progress</h2>
              <p className="text-sm text-slate-500">{completedCount} of {lessons.length} lessons completed</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold text-rose-500">{Math.round(progressPercentage)}%</span>
            </div>
          </div>
          <Progress value={progressPercentage} className="h-3" />
        </motion.div>

        {/* Lessons List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {lessons.map((lesson, index) => {
              const completed = isCompleted(lesson.id);
              const unlocked = isUnlocked(lesson, index);

              return (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link 
                    to={unlocked ? createPageUrl('LessonDetail') + `?lesson=${lesson.id}` : '#'}
                    className={!unlocked ? 'pointer-events-none' : ''}
                  >
                    <div 
                      className={`
                        bg-white rounded-2xl p-6 border-2 transition-all
                        ${completed 
                          ? 'border-emerald-200 bg-emerald-50/30' 
                          : unlocked 
                            ? 'border-slate-200 hover:border-rose-300 hover:shadow-lg cursor-pointer' 
                            : 'border-slate-100 opacity-60'
                        }
                      `}
                    >
                      <div className="flex items-start gap-4">
                        {/* Status Icon */}
                        <div className={`
                          w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
                          ${completed 
                            ? 'bg-emerald-100' 
                            : unlocked 
                              ? 'bg-rose-100' 
                              : 'bg-slate-100'
                          }
                        `}>
                          {completed ? (
                            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                          ) : unlocked ? (
                            <PlayCircle className="w-6 h-6 text-rose-500" />
                          ) : (
                            <Lock className="w-6 h-6 text-slate-400" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm text-slate-400">Lesson {lesson.order || index + 1}</span>
                            <Badge className={difficultyColors[lesson.difficulty]}>
                              {lesson.difficulty}
                            </Badge>
                          </div>
                          <h3 className="text-lg font-semibold text-slate-900 mb-1">{lesson.title}</h3>
                          <p className="text-sm text-slate-500 line-clamp-2">{lesson.description}</p>
                          
                          {lesson.objectives && lesson.objectives.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {lesson.objectives.slice(0, 3).map((obj, i) => (
                                <span key={i} className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                                  {obj}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* XP & Arrow */}
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex items-center gap-1 text-amber-500">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-sm font-semibold">{lesson.xp_reward || 50} XP</span>
                          </div>
                          {unlocked && !completed && (
                            <ChevronRight className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

        {lessons.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-slate-500">No lessons available yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}