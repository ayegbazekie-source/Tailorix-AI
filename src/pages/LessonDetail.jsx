import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { 
  ArrowLeft,
  PlayCircle,
  CheckCircle2,
  ChevronRight,
  Star,
  Target,
  Gauge,
  Lightbulb
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function LessonDetail() {
  const [lesson, setLesson] = useState(null);
  const [fabric, setFabric] = useState(null);
  const [stitch, setStitch] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const urlParams = new URLSearchParams(window.location.search);
  const lessonId = urlParams.get('lesson');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      if (lessonId) {
        const [lessonData] = await base44.entities.Lesson.filter({ id: lessonId });
        setLesson(lessonData);

        // Load fabric and stitch if specified
        if (lessonData?.fabric_id) {
          const [fabricData] = await base44.entities.Fabric.filter({ id: lessonData.fabric_id });
          setFabric(fabricData);
        } else {
          // Default to cotton for lessons without specific fabric
          const fabrics = await base44.entities.Fabric.filter({ name: 'Cotton' });
          if (fabrics.length > 0) setFabric(fabrics[0]);
        }

        if (lessonData?.stitch_type_id) {
          const [stitchData] = await base44.entities.StitchType.filter({ id: lessonData.stitch_type_id });
          setStitch(stitchData);
        } else {
          // Default to straight stitch
          const stitches = await base44.entities.StitchType.filter({ name: 'Straight Stitch' });
          if (stitches.length > 0) setStitch(stitches[0]);
        }
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const startLesson = () => {
    if (fabric && stitch) {
      navigate(createPageUrl('SewingSimulator') + `?mode=learn&fabric=${fabric.id}&stitch=${stitch.id}&length=2.5&lesson=${lessonId}`);
    }
  };

  const difficultyColors = {
    beginner: 'bg-emerald-100 text-emerald-700',
    intermediate: 'bg-amber-100 text-amber-700',
    advanced: 'bg-rose-100 text-rose-700'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50 p-6">
        <div className="max-w-3xl mx-auto">
          <Skeleton className="h-12 w-48 mb-8" />
          <Skeleton className="h-64 rounded-3xl mb-8" />
          <Skeleton className="h-96 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Lesson not found</h2>
          <Link to={createPageUrl('Lessons')}>
            <Button>Back to Lessons</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 text-slate-500 -ml-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Lesson Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-rose-500 to-pink-500 rounded-3xl p-8 text-white mb-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full transform translate-x-16 -translate-y-16" />
          
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <Badge className="bg-white/20 text-white border-0">
                Lesson {lesson.order}
              </Badge>
              <Badge className={`${difficultyColors[lesson.difficulty]} border-0`}>
                {lesson.difficulty}
              </Badge>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{lesson.title}</h1>
            <p className="text-rose-100 text-lg">{lesson.description}</p>

            <div className="flex items-center gap-6 mt-6">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-300 fill-current" />
                <span className="font-semibold">{lesson.xp_reward} XP</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                <span>{lesson.target_accuracy}% accuracy goal</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Objectives */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100 mb-6"
        >
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-rose-500" />
            Learning Objectives
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {lesson.objectives?.map((objective, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <span className="text-slate-700">{objective}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100 mb-6"
        >
          <h2 className="text-xl font-bold text-slate-900 mb-4">Step-by-Step Instructions</h2>
          <div className="space-y-4">
            {lesson.instructions?.map((instruction, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-rose-600 font-bold">{instruction.step}</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{instruction.text}</p>
                  {instruction.tip && (
                    <p className="text-sm text-rose-500 mt-1 flex items-center gap-1">
                      <Lightbulb className="w-3 h-3" />
                      {instruction.tip}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Materials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-50 rounded-3xl p-6 border border-slate-200 mb-8"
        >
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Materials for this Lesson</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {fabric && (
              <div className="bg-white rounded-xl p-4 border border-slate-200">
                <p className="text-sm text-slate-500 mb-1">Fabric</p>
                <p className="font-semibold text-slate-900">{fabric.name}</p>
              </div>
            )}
            {stitch && (
              <div className="bg-white rounded-xl p-4 border border-slate-200">
                <p className="text-sm text-slate-500 mb-1">Stitch Type</p>
                <p className="font-semibold text-slate-900">{stitch.name}</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Start Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            onClick={startLesson}
            size="lg"
            className="w-full bg-rose-500 hover:bg-rose-600 rounded-2xl py-8 text-xl"
          >
            <PlayCircle className="w-6 h-6 mr-3" />
            Start Lesson
          </Button>
        </motion.div>
      </div>
    </div>
  );
}