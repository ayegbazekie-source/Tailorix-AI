import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { 
  ArrowLeft,
  Pause,
  Play,
  RotateCcw,
  Check,
  AlertCircle,
  Gauge,
  Target,
  Clock,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';

export default function SewingSimulator() {
  const canvasRef = useRef(null);
  const [fabric, setFabric] = useState(null);
  const [stitch, setStitch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [sessionData, setSessionData] = useState({
    totalStitches: 0,
    pathPoints: [],
    speedVariations: [],
    driftEvents: 0,
    corrections: 0,
    startTime: null,
    duration: 0
  });
  const [accuracy, setAccuracy] = useState(100);
  const [feedback, setFeedback] = useState([]);
  const [showComplete, setShowComplete] = useState(false);
  const navigate = useNavigate();

  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get('mode') || 'practice';
  const fabricId = urlParams.get('fabric');
  const stitchId = urlParams.get('stitch');
  const stitchLength = parseFloat(urlParams.get('length')) || 2.5;

  // Canvas state
  const [needlePos, setNeedlePos] = useState({ x: 100, y: 200 });
  const [stitchPath, setStitchPath] = useState([]);
  const [guidePath, setGuidePath] = useState([]);
  const [fabricOffset, setFabricOffset] = useState(0);
  const animationRef = useRef(null);

  useEffect(() => {
    loadData();
    generateGuidePath();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const loadData = async () => {
    try {
      const [fabricData, stitchData] = await Promise.all([
        fabricId ? base44.entities.Fabric.filter({ id: fabricId }) : Promise.resolve([]),
        stitchId ? base44.entities.StitchType.filter({ id: stitchId }) : Promise.resolve([])
      ]);
      
      if (fabricData.length > 0) setFabric(fabricData[0]);
      if (stitchData.length > 0) setStitch(stitchData[0]);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const generateGuidePath = () => {
    // Generate a simple curved guide path
    const points = [];
    for (let i = 0; i <= 100; i++) {
      points.push({
        x: 100 + i * 5,
        y: 200 + Math.sin(i * 0.05) * 30
      });
    }
    setGuidePath(points);
  };

  const startSewing = () => {
    setIsRunning(true);
    setSessionData(prev => ({ ...prev, startTime: Date.now() }));
    runAnimation();
  };

  const pauseSewing = () => {
    setIsRunning(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const resetSewing = () => {
    setIsRunning(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setNeedlePos({ x: 100, y: 200 });
    setStitchPath([]);
    setFabricOffset(0);
    setAccuracy(100);
    setFeedback([]);
    setSessionData({
      totalStitches: 0,
      pathPoints: [],
      speedVariations: [],
      driftEvents: 0,
      corrections: 0,
      startTime: null,
      duration: 0
    });
  };

  const runAnimation = useCallback(() => {
    if (!isRunning) return;

    setNeedlePos(prev => {
      const targetIdx = Math.min(Math.floor((prev.x - 100) / 5), guidePath.length - 1);
      const target = guidePath[targetIdx] || { x: prev.x, y: 200 };
      
      // Calculate drift based on fabric properties
      const slipFactor = (fabric?.slip_factor || 5) / 10;
      const speedFactor = speed / 100;
      const drift = (Math.random() - 0.5) * slipFactor * speedFactor * 4;
      
      const newX = prev.x + (speed / 30);
      const newY = prev.y + drift;

      // Add stitch point
      if (Math.floor(newX / (stitchLength * 4)) > Math.floor(prev.x / (stitchLength * 4))) {
        setStitchPath(path => [...path, { x: newX, y: newY }]);
        setSessionData(data => ({
          ...data,
          totalStitches: data.totalStitches + 1,
          pathPoints: [...data.pathPoints, { x: newX, y: newY }],
          speedVariations: [...data.speedVariations, speed]
        }));

        // Check accuracy
        const deviation = Math.abs(newY - target.y);
        if (deviation > 20) {
          setAccuracy(acc => Math.max(0, acc - 2));
          setSessionData(data => ({ ...data, driftEvents: data.driftEvents + 1 }));
          addFeedback('warning', 'Fabric drifting! Slow down.');
        }
      }

      // Move fabric
      setFabricOffset(newX - 100);

      // Check if reached end
      if (newX >= 580) {
        completeSewing();
        return prev;
      }

      return { x: newX, y: Math.max(150, Math.min(250, newY)) };
    });

    animationRef.current = requestAnimationFrame(runAnimation);
  }, [isRunning, speed, fabric, guidePath, stitchLength]);

  useEffect(() => {
    if (isRunning) {
      animationRef.current = requestAnimationFrame(runAnimation);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning, runAnimation]);

  const addFeedback = (type, message) => {
    const id = Date.now();
    setFeedback(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setFeedback(prev => prev.filter(f => f.id !== id));
    }, 2000);
  };

  const completeSewing = async () => {
    setIsRunning(false);
    const duration = sessionData.startTime ? Math.floor((Date.now() - sessionData.startTime) / 1000) : 0;
    
    setSessionData(prev => ({ ...prev, duration }));
    setShowComplete(true);

    // Save session and navigate to results
    try {
      const user = await base44.auth.me().catch(() => null);
      
      const session = await base44.entities.SewingSession.create({
        user_id: user?.id || 'anonymous',
        mode,
        fabric_id: fabricId,
        stitch_type_id: stitchId,
        stitch_length: stitchLength,
        duration_seconds: duration,
        stitch_data: {
          total_stitches: sessionData.totalStitches,
          path_points: sessionData.pathPoints,
          speed_variations: sessionData.speedVariations,
          drift_events: sessionData.driftEvents,
          corrections: sessionData.corrections
        },
        accuracy_score: accuracy,
        speed_score: Math.round(speed * 0.8),
        overall_score: Math.round((accuracy + speed * 0.5) / 1.5)
      });

      setTimeout(() => {
        navigate(createPageUrl('Results') + `?session=${session.id}`);
      }, 1500);
    } catch (e) {
      console.error(e);
    }
  };

  // Handle keyboard/touch for direction control
  const handleDirectionChange = (direction) => {
    if (!isRunning) return;
    
    setNeedlePos(prev => {
      const moveAmount = 3;
      const newY = direction === 'up' 
        ? Math.max(150, prev.y - moveAmount)
        : Math.min(250, prev.y + moveAmount);
      
      setSessionData(data => ({ ...data, corrections: data.corrections + 1 }));
      return { ...prev, y: newY };
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to={createPageUrl('StitchSelect') + `?mode=${mode}&fabric=${fabricId}`}>
                <Button variant="ghost" className="text-slate-400 hover:text-white -ml-4">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-semibold">{fabric?.name || 'Sewing'}</h1>
                <p className="text-sm text-slate-400">{stitch?.name} • {stitchLength}mm</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <StatDisplay icon={Target} label="Accuracy" value={`${accuracy}%`} color="emerald" />
              <StatDisplay icon={Gauge} label="Speed" value={speed} color="amber" />
              <StatDisplay icon={Zap} label="Stitches" value={sessionData.totalStitches} color="violet" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Sewing Area */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Canvas Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative bg-slate-800 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl mb-8"
        >
          {/* Sewing Canvas */}
          <div className="relative h-[400px] overflow-hidden">
            {/* Fabric Layer */}
            <div 
              className="absolute inset-0 transition-transform"
              style={{ 
                transform: `translateX(-${fabricOffset}px)`,
                backgroundImage: fabric?.image_url 
                  ? `url(${fabric.image_url})` 
                  : 'linear-gradient(45deg, #f1f5f9 25%, #e2e8f0 25%, #e2e8f0 50%, #f1f5f9 50%, #f1f5f9 75%, #e2e8f0 75%)',
                backgroundSize: fabric?.image_url ? 'cover' : '20px 20px'
              }}
            />

            {/* Guide Line */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <path
                d={`M ${guidePath.map(p => `${p.x},${p.y}`).join(' L ')}`}
                fill="none"
                stroke="rgba(236, 72, 153, 0.3)"
                strokeWidth="20"
                strokeLinecap="round"
                strokeDasharray="5,5"
              />
            </svg>

            {/* Stitch Path */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {stitchPath.length > 1 && (
                <path
                  d={`M ${stitchPath.map(p => `${p.x},${p.y}`).join(' L ')}`}
                  fill="none"
                  stroke="#1e293b"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              )}
              {stitchPath.map((point, i) => (
                <circle key={i} cx={point.x} cy={point.y} r="2" fill="#1e293b" />
              ))}
            </svg>

            {/* Needle */}
            <motion.div
              className="absolute w-1 h-16 bg-gradient-to-b from-slate-300 to-slate-500 rounded-full shadow-lg"
              style={{
                left: needlePos.x - 2,
                top: needlePos.y - 40,
              }}
              animate={{
                y: isRunning ? [0, -5, 0] : 0
              }}
              transition={{
                duration: 0.1,
                repeat: isRunning ? Infinity : 0
              }}
            >
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-400 rounded-full" />
            </motion.div>

            {/* Presser Foot */}
            <div 
              className="absolute w-12 h-8 bg-slate-600 rounded-lg border-2 border-slate-500 shadow-xl"
              style={{
                left: needlePos.x - 24,
                top: needlePos.y + 20,
              }}
            />

            {/* Feedback Messages */}
            <AnimatePresence>
              {feedback.map(f => (
                <motion.div
                  key={f.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full flex items-center gap-2 ${
                    f.type === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                >
                  {f.type === 'warning' ? <AlertCircle className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                  {f.message}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Completion Overlay */}
            <AnimatePresence>
              {showComplete && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-slate-900/90 flex items-center justify-center"
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center"
                  >
                    <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Sewing Complete!</h2>
                    <p className="text-slate-400">Analyzing your performance...</p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Direction Controls (touch) */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
            <Button
              variant="secondary"
              size="lg"
              className="w-14 h-14 rounded-xl bg-slate-700/80 hover:bg-slate-600"
              onMouseDown={() => handleDirectionChange('up')}
              onTouchStart={() => handleDirectionChange('up')}
            >
              ↑
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="w-14 h-14 rounded-xl bg-slate-700/80 hover:bg-slate-600"
              onMouseDown={() => handleDirectionChange('down')}
              onTouchStart={() => handleDirectionChange('down')}
            >
              ↓
            </Button>
          </div>
        </motion.div>

        {/* Controls */}
        <div className="bg-slate-800/50 rounded-3xl p-6 border border-slate-700">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Speed Control */}
            <div className="flex-1 w-full">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">Pedal Speed</span>
                <span className="text-lg font-bold">{speed}%</span>
              </div>
              <Slider
                value={[speed]}
                onValueChange={([v]) => setSpeed(v)}
                min={10}
                max={100}
                step={5}
                disabled={!isRunning}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>Slow & Precise</span>
                <span>Fast & Risky</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="lg"
                onClick={resetSewing}
                className="rounded-xl border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Reset
              </Button>
              
              {!isRunning ? (
                <Button
                  size="lg"
                  onClick={startSewing}
                  className="rounded-xl bg-rose-500 hover:bg-rose-600 px-8"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Sewing
                </Button>
              ) : (
                <Button
                  size="lg"
                  onClick={pauseSewing}
                  className="rounded-xl bg-amber-500 hover:bg-amber-600 px-8"
                >
                  <Pause className="w-5 h-5 mr-2" />
                  Pause
                </Button>
              )}
            </div>
          </div>

          {/* Tips */}
          <div className="mt-6 p-4 bg-slate-700/30 rounded-xl">
            <p className="text-sm text-slate-400">
              <span className="text-rose-400 font-medium">Tip:</span> Use the arrow buttons or keyboard arrows to guide the fabric. 
              Higher speed increases drift risk, especially with {fabric?.name || 'this fabric'}'s slip factor of {fabric?.slip_factor || 5}/10.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatDisplay({ icon: Icon, label, value, color }) {
  const colors = {
    emerald: 'text-emerald-400',
    amber: 'text-amber-400',
    violet: 'text-violet-400'
  };

  return (
    <div className="text-center">
      <div className="flex items-center gap-2 justify-center mb-1">
        <Icon className={`w-4 h-4 ${colors[color]}`} />
        <span className={`text-lg font-bold ${colors[color]}`}>{value}</span>
      </div>
      <span className="text-xs text-slate-500">{label}</span>
    </div>
  );
}