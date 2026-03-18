import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { 
  ArrowLeft,
  Lock,
  ChevronRight,
  Check,
  Minus,
  Plus,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Slider } from '@/components/ui/slider';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function StitchSelect() {
  const [stitches, setStitches] = useState([]);
  const [selectedFabric, setSelectedFabric] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStitch, setSelectedStitch] = useState(null);
  const [stitchLength, setStitchLength] = useState(2.5);
  const navigate = useNavigate();

  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get('mode') || 'practice';
  const fabricId = urlParams.get('fabric');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [stitchData, fabricData] = await Promise.all([
        base44.entities.StitchType.list(),
        fabricId ? base44.entities.Fabric.filter({ id: fabricId }) : Promise.resolve([])
      ]);
      
      setStitches(stitchData);
      if (fabricData.length > 0) {
        setSelectedFabric(fabricData[0]);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleContinue = () => {
    if (selectedStitch && selectedFabric) {
      navigate(createPageUrl('SewingSimulator') + `?mode=${mode}&fabric=${selectedFabric.id}&stitch=${selectedStitch.id}&length=${stitchLength}`);
    }
  };

  const difficultyColors = {
    beginner: 'bg-emerald-100 text-emerald-700',
    intermediate: 'bg-amber-100 text-amber-700',
    advanced: 'bg-rose-100 text-rose-700'
  };

  // Stitch pattern visualization
  const StitchPattern = ({ type }) => {
    const patterns = {
      straight: (
        <svg viewBox="0 0 100 20" className="w-full h-6">
          <line x1="0" y1="10" x2="100" y2="10" stroke="currentColor" strokeWidth="2" strokeDasharray="8,4"/>
        </svg>
      ),
      zigzag: (
        <svg viewBox="0 0 100 20" className="w-full h-6">
          <polyline points="0,15 10,5 20,15 30,5 40,15 50,5 60,15 70,5 80,15 90,5 100,15" fill="none" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      backstitch: (
        <svg viewBox="0 0 100 20" className="w-full h-6">
          <line x1="0" y1="10" x2="100" y2="10" stroke="currentColor" strokeWidth="3"/>
        </svg>
      )
    };
    return patterns[type] || patterns.straight;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50 pb-32">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <Link to={createPageUrl('FabricSelect') + `?mode=${mode}`}>
            <Button variant="ghost" className="mb-6 text-slate-500 -ml-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Fabrics
            </Button>
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4 bg-rose-100 text-rose-700 hover:bg-rose-100">
              Step 2 of 3
            </Badge>
            <h1 className="text-4xl md:text-5xl font-light text-slate-900 tracking-tight mb-4">
              Select Your <span className="font-semibold">Stitch</span>
            </h1>
            <p className="text-xl text-slate-500 font-light">
              {selectedFabric && (
                <span>
                  Sewing on <span className="text-slate-700 font-medium">{selectedFabric.name}</span> — 
                  recommended stitch length: {selectedFabric.recommended_stitch_length || 2.5}mm
                </span>
              )}
            </p>
          </motion.div>
        </div>

        {/* Stitch Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-48 rounded-3xl" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {stitches.map((stitch, index) => {
                const isSelected = selectedStitch?.id === stitch.id;

                return (
                  <motion.div
                    key={stitch.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <div
                      onClick={() => {
                        setSelectedStitch(stitch);
                        setStitchLength(stitch.default_length || 2.5);
                      }}
                      className={`
                        relative rounded-3xl border-2 p-6 transition-all duration-300 cursor-pointer bg-white
                        ${isSelected 
                          ? 'border-rose-500 shadow-xl shadow-rose-100 ring-4 ring-rose-100' 
                          : 'border-slate-200 hover:border-slate-300 shadow-lg'
                        }
                      `}
                    >
                      {isSelected && (
                        <div className="absolute top-4 right-4 w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center">
                          <Check className="w-5 h-5 text-white" />
                        </div>
                      )}

                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-slate-900 mb-1">{stitch.name}</h3>
                          <Badge className={difficultyColors[stitch.difficulty]}>
                            {stitch.difficulty}
                          </Badge>
                        </div>
                      </div>

                      {/* Stitch Pattern Preview */}
                      <div className="bg-slate-50 rounded-xl p-4 mb-4 text-slate-400">
                        <StitchPattern type={stitch.icon} />
                      </div>

                      <p className="text-slate-500 text-sm mb-4">
                        {stitch.description}
                      </p>

                      {stitch.best_for && stitch.best_for.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {stitch.best_for.map((use, i) => (
                            <span key={i} className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                              {use}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Stitch Length Adjustment */}
            {selectedStitch && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl border-2 border-slate-200 p-8 shadow-lg"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-semibold text-slate-900">Stitch Length</h3>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-4 h-4 text-slate-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Shorter stitches are stronger but take longer. 
                            Longer stitches are faster but less secure.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="text-3xl font-bold text-slate-900">
                    {stitchLength.toFixed(1)}<span className="text-lg text-slate-400 ml-1">mm</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setStitchLength(Math.max(selectedStitch.min_length || 1, stitchLength - 0.5))}
                    className="rounded-xl"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  
                  <Slider
                    value={[stitchLength]}
                    onValueChange={([v]) => setStitchLength(v)}
                    min={selectedStitch.min_length || 1}
                    max={selectedStitch.max_length || 5}
                    step={0.1}
                    className="flex-1"
                  />

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setStitchLength(Math.min(selectedStitch.max_length || 5, stitchLength + 0.5))}
                    className="rounded-xl"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex justify-between text-sm text-slate-500 mt-2">
                  <span>Fine detail ({selectedStitch.min_length || 1}mm)</span>
                  <span>Basting ({selectedStitch.max_length || 5}mm)</span>
                </div>
              </motion.div>
            )}
          </>
        )}

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent"
        >
          <div className="max-w-5xl mx-auto flex justify-end">
            <Button
              onClick={handleContinue}
              disabled={!selectedStitch}
              size="lg"
              className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-6 text-lg rounded-2xl shadow-xl disabled:opacity-50"
            >
              Start Sewing
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}