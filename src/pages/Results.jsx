import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { 
  ArrowLeft,
  Trophy,
  Target,
  Gauge,
  Clock,
  Zap,
  ChevronRight,
  RotateCcw,
  Eye,
  Lightbulb,
  AlertCircle,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

export default function Results() {
  const [session, setSession] = useState(null);
  const [fabric, setFabric] = useState(null);
  const [stitch, setStitch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiFeedback, setAiFeedback] = useState(null);

  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get('session');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      if (!sessionId) {
        setLoading(false);
        return;
      }

      const [sessionData] = await base44.entities.SewingSession.filter({ id: sessionId });
      setSession(sessionData);

      if (sessionData) {
        const [fabricData, stitchData] = await Promise.all([
          sessionData.fabric_id ? base44.entities.Fabric.filter({ id: sessionData.fabric_id }) : Promise.resolve([]),
          sessionData.stitch_type_id ? base44.entities.StitchType.filter({ id: sessionData.stitch_type_id }) : Promise.resolve([])
        ]);

        if (fabricData.length > 0) setFabric(fabricData[0]);
        if (stitchData.length > 0) setStitch(stitchData[0]);

        // Generate AI feedback
        if (!sessionData.ai_feedback) {
          generateAIFeedback(sessionData, fabricData[0], stitchData[0]);
        } else {
          setAiFeedback(sessionData.ai_feedback);
        }
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const generateAIFeedback = async (sessionData, fabricData, stitchData) => {
    setAnalyzing(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are Sewie, an expert AI sewing tutor. Analyze this sewing session and provide feedback.

Session Data:
- Fabric: ${fabricData?.name || 'Unknown'} (Stiffness: ${fabricData?.stiffness}/10, Slip: ${fabricData?.slip_factor}/10)
- Stitch Type: ${stitchData?.name || 'Unknown'}
- Stitch Length: ${sessionData.stitch_length}mm
- Total Stitches: ${sessionData.stitch_data?.total_stitches || 0}
- Duration: ${sessionData.duration_seconds} seconds
- Accuracy Score: ${sessionData.accuracy_score}%
- Speed Score: ${sessionData.speed_score}%
- Drift Events: ${sessionData.stitch_data?.drift_events || 0}
- Corrections Made: ${sessionData.stitch_data?.corrections || 0}

Provide constructive, encouraging feedback for a beginner learning to sew.`,
        response_json_schema: {
          type: "object",
          properties: {
            diagnosis: {
              type: "string",
              description: "Overall assessment of the performance (2-3 sentences)"
            },
            strengths: {
              type: "array",
              items: { type: "string" },
              description: "2-3 things the user did well"
            },
            improvements: {
              type: "array",
              items: { type: "string" },
              description: "2-3 specific areas to improve"
            },
            tips: {
              type: "array",
              items: { type: "string" },
              description: "2-3 actionable tips for next session"
            },
            encouragement: {
              type: "string",
              description: "A short encouraging message"
            }
          }
        }
      });

      setAiFeedback(response);

      // Save feedback to session
      await base44.entities.SewingSession.update(sessionId, {
        ai_feedback: response
      });
    } catch (e) {
      console.error(e);
      setAiFeedback({
        diagnosis: "Great effort on this sewing session! Keep practicing to improve your technique.",
        strengths: ["Completed the full sewing path", "Maintained steady control"],
        improvements: ["Work on keeping a consistent speed", "Practice guiding the fabric more smoothly"],
        tips: ["Try a slower speed first", "Focus on the guide line", "Take breaks if you feel rushed"],
        encouragement: "You're making great progress! Every stitch brings you closer to mastery."
      });
    }
    setAnalyzing(false);
  };

  const getGrade = (score) => {
    if (score >= 90) return { grade: 'A+', color: 'text-emerald-500', bg: 'bg-emerald-500' };
    if (score >= 80) return { grade: 'A', color: 'text-emerald-500', bg: 'bg-emerald-500' };
    if (score >= 70) return { grade: 'B', color: 'text-amber-500', bg: 'bg-amber-500' };
    if (score >= 60) return { grade: 'C', color: 'text-orange-500', bg: 'bg-orange-500' };
    return { grade: 'D', color: 'text-rose-500', bg: 'bg-rose-500' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-12 w-48 mb-8" />
          <Skeleton className="h-64 rounded-3xl mb-8" />
          <Skeleton className="h-96 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Session not found</h2>
          <Link to={createPageUrl('Home')}>
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const overallGrade = getGrade(session.overall_score || 0);

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
        </div>

        {/* Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 mb-8"
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Grade Circle */}
            <div className="relative">
              <div className={`w-32 h-32 rounded-full ${overallGrade.bg} flex items-center justify-center`}>
                <span className="text-5xl font-bold text-white">{overallGrade.grade}</span>
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="absolute -top-2 -right-2 w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center"
              >
                <Trophy className="w-5 h-5 text-white" />
              </motion.div>
            </div>

            {/* Scores */}
            <div className="flex-1 w-full">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Session Complete!</h1>
              <p className="text-slate-500 mb-6">
                {fabric?.name} • {stitch?.name} • {session.stitch_length}mm
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <ScoreItem 
                  icon={Target} 
                  label="Accuracy" 
                  value={session.accuracy_score || 0} 
                  suffix="%" 
                  color="emerald"
                />
                <ScoreItem 
                  icon={Gauge} 
                  label="Speed" 
                  value={session.speed_score || 0} 
                  suffix="%" 
                  color="amber"
                />
                <ScoreItem 
                  icon={Zap} 
                  label="Stitches" 
                  value={session.stitch_data?.total_stitches || 0} 
                  suffix="" 
                  color="violet"
                />
                <ScoreItem 
                  icon={Clock} 
                  label="Time" 
                  value={session.duration_seconds || 0} 
                  suffix="s" 
                  color="rose"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* AI Feedback */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-500 rounded-2xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">SewSimple Feedback</h2>
            <p className="text-sm text-slate-500">AI-powered analysis of your session</p>
          </div>
          </div>

          {analyzing ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="animate-spin w-5 h-5 border-2 border-rose-500 border-t-transparent rounded-full" />
                <span className="text-slate-500">Analyzing your performance...</span>
              </div>
              <Skeleton className="h-20 rounded-xl" />
              <Skeleton className="h-32 rounded-xl" />
            </div>
          ) : aiFeedback ? (
            <div className="space-y-6">
              {/* Diagnosis */}
              <div className="p-4 bg-slate-50 rounded-2xl">
                <p className="text-slate-700 leading-relaxed">{aiFeedback.diagnosis}</p>
              </div>

              {/* Strengths */}
              <div>
                <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  What You Did Well
                </h3>
                <ul className="space-y-2">
                  {aiFeedback.strengths?.map((strength, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2" />
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Improvements */}
              <div>
                <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900 mb-3">
                  <AlertCircle className="w-5 h-5 text-amber-500" />
                  Areas to Improve
                </h3>
                <ul className="space-y-2">
                  {aiFeedback.improvements?.map((improvement, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2" />
                      {improvement}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tips */}
              <div className="p-4 bg-violet-50 rounded-2xl border border-violet-100">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-violet-900 mb-3">
                  <Lightbulb className="w-5 h-5 text-violet-500" />
                  Tips for Next Time
                </h3>
                <ul className="space-y-2">
                  {aiFeedback.tips?.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-violet-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-2" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Encouragement */}
              {aiFeedback.encouragement && (
                <div className="p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl border border-rose-100 text-center">
                  <p className="text-rose-700 font-medium italic">"{aiFeedback.encouragement}"</p>
                </div>
              )}
            </div>
          ) : null}
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link to={createPageUrl('SewingSimulator') + `?mode=${session.mode}&fabric=${session.fabric_id}&stitch=${session.stitch_type_id}&length=${session.stitch_length}`} className="flex-1">
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full rounded-2xl border-2 py-6"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Try Again
            </Button>
          </Link>
          
          <Link to={createPageUrl('GarmentViewer') + `?session=${sessionId}`} className="flex-1">
            <Button 
              size="lg" 
              className="w-full bg-slate-900 hover:bg-slate-800 rounded-2xl py-6"
            >
              <Eye className="w-5 h-5 mr-2" />
              View 3D Result
            </Button>
          </Link>

          <Link to={createPageUrl('ModeSelect')} className="flex-1">
            <Button 
              size="lg" 
              className="w-full bg-rose-500 hover:bg-rose-600 rounded-2xl py-6"
            >
              New Session
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

function ScoreItem({ icon: Icon, label, value, suffix, color }) {
  const colors = {
    emerald: 'bg-emerald-100 text-emerald-600',
    amber: 'bg-amber-100 text-amber-600',
    violet: 'bg-violet-100 text-violet-600',
    rose: 'bg-rose-100 text-rose-600'
  };

  return (
    <div className="text-center p-4 rounded-2xl bg-slate-50">
      <div className={`w-10 h-10 rounded-xl ${colors[color]} flex items-center justify-center mx-auto mb-2`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-2xl font-bold text-slate-900">{value}{suffix}</div>
      <div className="text-sm text-slate-500">{label}</div>
    </div>
  );
}