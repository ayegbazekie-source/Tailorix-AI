import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { 
  ArrowLeft,
  Lock,
  ChevronRight,
  Gauge,
  Layers,
  Zap,
  Wind,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function FabricSelect() {
  const [fabrics, setFabrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFabric, setSelectedFabric] = useState(null);
  const [userProgress, setUserProgress] = useState(null);
  const navigate = useNavigate();

  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get('mode') || 'practice';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [fabricData, user] = await Promise.all([
        base44.entities.Fabric.list(),
        base44.auth.me().catch(() => null)
      ]);
      
      setFabrics(fabricData);

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

  const isUnlocked = (fabric) => {
    if (!fabric.unlock_level) return true;
    if (!userProgress) return fabric.unlock_level <= 1;
    return userProgress.skill_level >= fabric.unlock_level;
  };

  const handleContinue = () => {
    if (selectedFabric) {
      navigate(createPageUrl('StitchSelect') + `?mode=${mode}&fabric=${selectedFabric.id}`);
    }
  };

  const difficultyColors = {
    beginner: 'bg-emerald-100 text-emerald-700',
    intermediate: 'bg-amber-100 text-amber-700',
    advanced: 'bg-rose-100 text-rose-700'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <Link to={createPageUrl('ModeSelect')}>
            <Button variant="ghost" className="mb-6 text-slate-500 -ml-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Modes
            </Button>
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4 bg-violet-100 text-violet-700 hover:bg-violet-100">
              Step 1 of 3
            </Badge>
            <h1 className="text-4xl md:text-5xl font-light text-slate-900 tracking-tight mb-4">
              Select Your <span className="font-semibold">Fabric</span>
            </h1>
            <p className="text-xl text-slate-500 font-light">
              Each fabric behaves differently. Choose wisely based on your skill level.
            </p>
          </motion.div>
        </div>

        {/* Fabric Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Skeleton key={i} className="h-80 rounded-3xl" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {fabrics.map((fabric, index) => {
              const unlocked = isUnlocked(fabric);
              const isSelected = selectedFabric?.id === fabric.id;

              return (
                <motion.div
                  key={fabric.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <div
                    onClick={() => unlocked && setSelectedFabric(fabric)}
                    className={`
                      relative rounded-3xl border-2 overflow-hidden transition-all duration-300 cursor-pointer
                      ${isSelected 
                        ? 'border-violet-500 shadow-xl shadow-violet-100 ring-4 ring-violet-100' 
                        : 'border-slate-200 hover:border-slate-300 shadow-lg'
                      }
                      ${!unlocked && 'opacity-60 cursor-not-allowed'}
                    `}
                  >
                    {/* Fabric Image */}
                    <div className="h-32 bg-gradient-to-br from-slate-100 to-slate-200 relative">
                      {fabric.image_url && (
                        <img 
                          src={fabric.image_url} 
                          alt={fabric.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                      {!unlocked && (
                        <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
                          <div className="text-center text-white">
                            <Lock className="w-8 h-8 mx-auto mb-2" />
                            <p className="text-sm">Level {fabric.unlock_level} required</p>
                          </div>
                        </div>
                      )}
                      {isSelected && (
                        <div className="absolute top-4 right-4 w-8 h-8 bg-violet-500 rounded-full flex items-center justify-center">
                          <Check className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 bg-white">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-semibold text-slate-900">{fabric.name}</h3>
                        <Badge className={difficultyColors[fabric.difficulty]}>
                          {fabric.difficulty}
                        </Badge>
                      </div>

                      <p className="text-slate-500 text-sm mb-4 line-clamp-2">
                        {fabric.description}
                      </p>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-3">
                        <StatItem 
                          icon={Gauge} 
                          label="Stiffness" 
                          value={fabric.stiffness} 
                        />
                        <StatItem 
                          icon={Layers} 
                          label="Thickness" 
                          value={fabric.thickness} 
                        />
                        <StatItem 
                          icon={Zap} 
                          label="Speed Tolerance" 
                          value={fabric.speed_tolerance} 
                        />
                        <StatItem 
                          icon={Wind} 
                          label="Slip Factor" 
                          value={fabric.slip_factor} 
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent"
        >
          <div className="max-w-6xl mx-auto flex justify-end">
            <Button
              onClick={handleContinue}
              disabled={!selectedFabric}
              size="lg"
              className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-6 text-lg rounded-2xl shadow-xl disabled:opacity-50"
            >
              Continue with {selectedFabric?.name || 'Selected Fabric'}
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function StatItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4 text-slate-400" />
      <span className="text-xs text-slate-500">{label}</span>
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-violet-400 to-violet-500 rounded-full"
          style={{ width: `${(value || 5) * 10}%` }}
        />
      </div>
    </div>
  );
}