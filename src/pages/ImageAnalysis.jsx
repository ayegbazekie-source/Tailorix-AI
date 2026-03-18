import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { 
  ArrowLeft,
  Upload,
  Camera,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  X,
  Image as ImageIcon,
  Loader2,
  Ruler,
  Scissors,
  Target,
  Crown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CameraCapture from '../components/CameraCapture';
import UpgradeModal from '../components/UpgradeModal';
import { usePremium } from '@/components/PremiumProvider';

export default function ImageAnalysis() {
  const navigate = useNavigate();
  const { isPremiumActive, hasFullAccess } = usePremium();
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [analysisType, setAnalysisType] = useState('fitting');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const isPremium = isPremiumActive;

  useEffect(() => {
    if (imageUrl && analysisType) {
      analyzeImage();
    }
  }, [analysisType]);

  const handleFileSelect = async (file) => {
    if (!file) return;

    setImage(file);
    setUploading(true);
    setAnalysis(null);

    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setImageUrl(file_url);
    } catch (e) {
      console.error(e);
    }
    setUploading(false);
  };

  const analyzeImage = async () => {
    if (!imageUrl) return;

    // Require full access (premium or active trial)
    if (!hasFullAccess) {
      setShowUpgradeModal(true);
      return;
    }

    setAnalyzing(true);
    try {
      const prompts = {
        fitting: `You are Tailorix AI, a master tailor with 30+ years of experience. Carefully analyze this garment image for PROFESSIONAL TAILORING purposes.

CRITICAL SCORING RULE: You MUST assign a fit_score that honestly reflects what you actually see in this specific image. 
- If the garment fits nearly perfectly (great drape, no tension lines, balanced proportions, clean seams) → score between 82–97
- If the fit is good with only minor issues → score between 65–81
- If there are moderate fitting problems → score between 45–64
- If there are significant issues → score between 20–44
Do NOT use a fixed or default score. Vary your score genuinely based on what you observe. Encourage users when deserved.

Focus on:
1. FITTING PROBLEMS - Identify specific issues like:
   - Pulling/tension lines (indicate where fabric is too tight)
   - Excess fabric/pooling (indicate where it's too loose)
   - Shoulder alignment issues
   - Dart placement problems
   - Waistline issues
   - Bust/chest fitting problems
   - Back fitting issues
   - Armhole/sleeve fit
   - Hem alignment

2. PRECISE CORRECTIONS - Give exact measurements when possible:
   - "Reduce dart intake by 1.5cm"
   - "Let out side seam by 2cm"
   - "Raise shoulder seam by 1cm"

3. ALTERATION STEPS - Detailed professional instructions

4. PREVENTIVE ADVICE - How to avoid this in future garments

Be specific, professional, and genuinely encouraging when the work is good.`,
        
        seams: `You are Tailorix AI, a master tailor. Analyze the SEAM QUALITY and CONSTRUCTION in this garment image.

CRITICAL SCORING RULE: Assign a fit_score that honestly reflects seam/construction quality observed:
- Near-perfect seams, consistent stitch tension, professional finish → score 82–97
- Good seams with minor inconsistencies → score 65–81
- Moderate construction issues → score 45–64
- Poor seam quality or significant construction problems → score 20–44
Do NOT use a fixed score — vary it based on what you actually see.

Examine:
1. Seam alignment and straightness
2. Stitch consistency and tension
3. Seam finishing quality
4. Thread matching
5. Pressing quality
6. Professional vs amateur indicators

Be encouraging when the work is genuinely good. Provide honest, specific improvement suggestions.`,

        general: `You are Tailorix AI, a master tailor. Provide a comprehensive analysis of this garment.

CRITICAL SCORING RULE: Assign a fit_score that reflects the overall quality of this specific garment:
- Excellent overall (great fit, construction, style) → score 82–97
- Good with minor improvements needed → score 65–81
- Average, moderate issues → score 45–64
- Needs significant work → score 20–44
Score must be genuine and varied — never use a fixed default.

Include:
1. Garment type and style identification
2. Fabric assessment
3. Overall fit evaluation
4. Construction quality
5. Style suggestions
6. Care recommendations`
      };

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: prompts[analysisType],
        file_urls: [imageUrl],
        response_json_schema: {
          type: "object",
          properties: {
            garment_type: { type: "string" },
            overall_assessment: { type: "string" },
            fit_score: { type: "number" },
            fitting_problems: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  area: { type: "string" },
                  problem: { type: "string" },
                  severity: { type: "string", enum: ["minor", "moderate", "major"] },
                  visual_indicator: { type: "string" },
                  correction: { type: "string" },
                  measurement_adjustment: { type: "string" }
                }
              }
            },
            alteration_steps: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  step_number: { type: "number" },
                  action: { type: "string" },
                  details: { type: "string" },
                  tools_needed: { type: "string" },
                  difficulty: { type: "string", enum: ["easy", "intermediate", "advanced"] }
                }
              }
            },
            preventive_advice: {
              type: "array",
              items: { type: "string" }
            },
            positive_aspects: {
              type: "array",
              items: { type: "string" }
            },
            professional_notes: { type: "string" }
          }
        }
      });

      setAnalysis(response);
    } catch (e) {
      console.error(e);
    }
    setAnalyzing(false);
  };

  const clearImage = () => {
    setImage(null);
    setImageUrl(null);
    setAnalysis(null);
  };

  const severityColors = {
    minor: 'bg-amber-100 text-amber-700 border-amber-200',
    moderate: 'bg-orange-100 text-orange-700 border-orange-200',
    major: 'bg-rose-100 text-rose-700 border-rose-200'
  };

  const difficultyColors = {
    easy: 'bg-emerald-100 text-emerald-700',
    intermediate: 'bg-amber-100 text-amber-700',
    advanced: 'bg-rose-100 text-rose-700'
  };

  const isPremiumTheme = isPremium;

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isPremium ? 'bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#1E1E1E]' : 'bg-gradient-to-br from-slate-50 to-slate-100'}`}>
        <div className="text-center">
          <Loader2 className={`w-12 h-12 animate-spin mx-auto mb-4 ${isPremium ? 'text-amber-400' : 'text-violet-500'}`} />
          <p className={isPremium ? 'text-amber-200/80' : 'text-slate-600'}>Loading analysis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isPremiumTheme ? 'bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#1E1E1E]' : 'bg-gradient-to-br from-[var(--gradient-start)] via-[var(--gradient-middle)] to-[var(--gradient-end)]'}`}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className={`mb-6 -ml-4 flex ${isPremiumTheme ? 'text-amber-200/60 hover:text-amber-300' : 'text-[var(--text-secondary)]'}`}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4 ${isPremiumTheme ? 'bg-gradient-to-r from-amber-900/30 to-yellow-900/30 border border-amber-500/30 text-amber-400' : 'bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400'}`}>
              <Camera className="w-4 h-4" />
              {isPremiumTheme && <Crown className="w-4 h-4" />}
              Professional Analysis {isPremiumTheme && 'Pro'}
            </div>
            <div className="flex items-center justify-between mb-3">
              <h1 className={`text-2xl md:text-3xl font-light tracking-tight ${isPremiumTheme ? 'text-white' : 'text-[var(--text-primary)]'}`}>
                Professional <span className={`font-semibold ${isPremiumTheme ? 'bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent' : ''}`}>Garment Analysis</span>
              </h1>
            </div>
            <p className={`text-base font-light ${isPremiumTheme ? 'text-amber-200/80' : 'text-[var(--text-secondary)]'}`}>
              Upload garment photos for expert fitting diagnosis, alteration guidance, and professional tailoring advice.
            </p>
          </motion.div>
        </div>

        {/* Analysis Type Tabs */}
        <Tabs value={analysisType} onValueChange={setAnalysisType} className="mb-8">
          <TabsList className={`grid grid-cols-3 w-full max-w-md ${isPremiumTheme ? 'bg-slate-800/50 border border-amber-500/20' : ''}`}>
            <TabsTrigger value="fitting" className={`flex items-center gap-2 ${isPremiumTheme ? 'data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-yellow-500 data-[state=active]:text-slate-900' : ''}`}>
              <Target className="w-4 h-4" />
              Fitting Issues
            </TabsTrigger>
            <TabsTrigger value="seams" className={`flex items-center gap-2 ${isPremiumTheme ? 'data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-yellow-500 data-[state=active]:text-slate-900' : ''}`}>
              <Scissors className="w-4 h-4" />
              Seam Quality
            </TabsTrigger>
            <TabsTrigger value="general" className={`flex items-center gap-2 ${isPremiumTheme ? 'data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-yellow-500 data-[state=active]:text-slate-900' : ''}`}>
              <Ruler className="w-4 h-4" />
              General
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div 
              className={`
                relative rounded-3xl border-2 border-dashed transition-all overflow-hidden
                ${!image ? (isPremiumTheme ? 'border-amber-500/30 bg-gradient-to-br from-slate-800 to-slate-900' : 'border-[var(--border-primary)] bg-[var(--card-bg)]') : (isPremiumTheme ? 'border-amber-500 bg-amber-900/20' : 'border-violet-500 bg-violet-50 dark:bg-violet-900/20')}
              `}
            >
              {!image ? (
                <div className="p-8 text-center">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${isPremiumTheme ? 'bg-amber-900/30' : 'bg-violet-100 dark:bg-violet-900/30'}`}>
                    <Upload className={`w-8 h-8 ${isPremiumTheme ? 'text-amber-400' : 'text-violet-500'}`} />
                  </div>
                  <h3 className={`text-lg font-semibold mb-2 ${isPremiumTheme ? 'text-white' : 'text-[var(--text-primary)]'}`}>
                    Upload Garment Photo
                  </h3>
                  <p className={`text-sm mb-3 ${isPremiumTheme ? 'text-amber-200/70' : 'text-[var(--text-secondary)]'}`}>
                    For best results, upload clear photos showing:
                  </p>
                  <ul className={`text-xs space-y-1 mb-4 ${isPremiumTheme ? 'text-amber-200/60' : 'text-[var(--text-secondary)]'}`}>
                    <li>• Full garment on body or dress form</li>
                    <li>• Problem areas close-up</li>
                    <li>• Seams, darts, or fitting issues</li>
                  </ul>
                  <CameraCapture 
                    onCapture={handleFileSelect}
                    onFileSelect={handleFileSelect}
                  />
                </div>
              ) : (
                <div className="relative">
                  {uploading && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                      <div className="text-center">
                        <Loader2 className="w-8 h-8 animate-spin text-violet-500 mx-auto mb-2" />
                        <p className="text-slate-600">Uploading...</p>
                      </div>
                    </div>
                  )}
                  
                  <img 
                    src={imageUrl || URL.createObjectURL(image)} 
                    alt="Uploaded garment"
                    className="w-full h-auto max-h-[500px] object-contain"
                  />
                  
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute top-4 right-4 rounded-full bg-white/80 hover:bg-white"
                    onClick={(e) => { e.stopPropagation(); clearImage(); }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            {image && !analysis && (
              <Button
                onClick={analyzeImage}
                disabled={uploading || analyzing}
                className={`w-full mt-4 rounded-xl py-3 text-base ${isPremiumTheme ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-900 font-bold shadow-lg shadow-amber-500/30' : 'bg-violet-600 hover:bg-violet-700'}`}
              >
                {analyzing ? (
                  <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Analyzing...</>
                ) : (
                  <><Sparkles className="w-5 h-5 mr-2" />Analyze {analysisType === 'fitting' ? 'Fitting' : analysisType === 'seams' ? 'Seams' : 'Garment'}</>
                )}
              </Button>
            )}
          </motion.div>

          {/* Analysis Results */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <AnimatePresence mode="wait">
              {analyzing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`rounded-3xl p-8 shadow-lg border ${isPremiumTheme ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-amber-500/20' : 'bg-[var(--card-bg)] border-[var(--card-border)]'}`}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isPremiumTheme ? 'bg-amber-900/30' : 'bg-violet-100 dark:bg-violet-900/30'}`}>
                      <Loader2 className={`w-6 h-6 animate-spin ${isPremiumTheme ? 'text-amber-400' : 'text-violet-500'}`} />
                    </div>
                    <div>
                      <h3 className={`font-semibold ${isPremiumTheme ? 'text-white' : 'text-[var(--text-primary)]'}`}>Tailorix AI is Analyzing</h3>
                      <p className={`text-sm ${isPremiumTheme ? 'text-amber-200/70' : 'text-[var(--text-secondary)]'}`}>Professional assessment in progress...</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {['Identifying garment type...', 'Detecting fitting issues...', 'Calculating adjustments...', 'Generating alteration steps...'].map((step, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full animate-pulse ${isPremiumTheme ? 'bg-amber-400' : 'bg-violet-400'}`} />
                        <span className={`text-sm ${isPremiumTheme ? 'text-amber-200/60' : 'text-[var(--text-secondary)]'}`}>{step}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {analysis && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto pr-2"
                >
                  {/* Overview */}
                  <div className={`rounded-2xl p-5 shadow-lg border ${isPremiumTheme ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-amber-500/20' : 'bg-[var(--card-bg)] border-[var(--card-border)]'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className={`text-sm ${isPremiumTheme ? 'text-amber-200/60' : 'text-[var(--text-secondary)]'}`}>Identified</span>
                        <h3 className={`text-xl font-semibold ${isPremiumTheme ? 'text-white' : 'text-[var(--text-primary)]'}`}>{analysis.garment_type}</h3>
                      </div>
                      <div className="text-right">
                        <span className={`text-sm ${isPremiumTheme ? 'text-amber-200/60' : 'text-[var(--text-secondary)]'}`}>Fit Score</span>
                        <div className={`text-3xl font-bold ${isPremiumTheme ? 'text-amber-400' : 'text-violet-600'}`}>{analysis.fit_score}%</div>
                      </div>
                    </div>
                    <p className={isPremiumTheme ? 'text-amber-200/70 mb-4' : 'text-[var(--text-secondary)] mb-4'}>{analysis.overall_assessment}</p>
                    
                    {/* Fit Score Explanation */}
                    <div className={`mt-4 p-4 rounded-xl border ${isPremiumTheme ? 'bg-amber-900/20 border-amber-500/30' : 'bg-violet-50 dark:bg-violet-900/20 border-violet-100 dark:border-violet-800'}`}>
                      <p className={`text-sm font-medium mb-1 ${isPremiumTheme ? 'text-amber-300' : 'text-violet-900 dark:text-violet-300'}`}>Expert Note:</p>
                      <p className={`text-sm italic ${isPremiumTheme ? 'text-amber-200/80' : 'text-violet-700 dark:text-violet-400'}`}>
                        As a master tailor, I've assessed this garment at {analysis.fit_score}% based on fabric tension, seam placement, proportion balance, and overall drape. This score reflects how well the garment conforms to the body while maintaining professional construction standards. Scores above 80% indicate excellent fit with minor tweaks needed, 60-80% suggests moderate alterations, and below 60% requires significant reconstruction.
                      </p>
                    </div>
                  </div>

                  {/* Fitting Problems */}
                  {analysis.fitting_problems?.length > 0 && (
                    <div className={`rounded-2xl p-5 shadow-lg border ${isPremiumTheme ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-amber-500/20' : 'bg-[var(--card-bg)] border-[var(--card-border)]'}`}>
                      <h3 className={`flex items-center gap-2 font-semibold mb-4 ${isPremiumTheme ? 'text-white' : 'text-[var(--text-primary)]'}`}>
                        <AlertTriangle className={`w-5 h-5 ${isPremiumTheme ? 'text-amber-400' : 'text-amber-500'}`} />
                        Fitting Problems Detected
                      </h3>
                      <div className="space-y-4">
                        {analysis.fitting_problems.map((problem, i) => (
                          <div key={i} className={`p-4 rounded-xl border ${isPremiumTheme ? 'bg-slate-900/50 border-amber-500/20' : 'bg-[var(--bg-tertiary)] border-[var(--border-primary)]'}`}>
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <span className={`font-semibold ${isPremiumTheme ? 'text-white' : 'text-[var(--text-primary)]'}`}>{problem.area}</span>
                                <span className={`ml-2 text-xs px-2 py-1 rounded-full border ${severityColors[problem.severity]}`}>
                                  {problem.severity}
                                </span>
                              </div>
                            </div>
                            <p className={isPremiumTheme ? 'text-amber-200/70 mb-2' : 'text-[var(--text-secondary)] mb-2'}>{problem.problem}</p>
                            {problem.visual_indicator && (
                              <p className={`text-sm mb-2 ${isPremiumTheme ? 'text-amber-200/60' : 'text-[var(--text-tertiary)]'}`}>
                                <span className="font-medium">Visual indicator:</span> {problem.visual_indicator}
                              </p>
                            )}
                            <div className={`mt-3 p-3 rounded-lg border ${isPremiumTheme ? 'bg-amber-900/30 border-amber-500/30' : 'bg-violet-50 dark:bg-violet-900/20 border-violet-100 dark:border-violet-800'}`}>
                              <p className={`text-sm font-medium ${isPremiumTheme ? 'text-amber-300' : 'text-violet-900 dark:text-violet-300'}`}>Correction:</p>
                              <p className={`text-sm ${isPremiumTheme ? 'text-amber-200/80' : 'text-violet-700 dark:text-violet-400'}`}>{problem.correction}</p>
                              {problem.measurement_adjustment && (
                                <p className={`text-sm mt-1 font-mono px-2 py-1 rounded inline-block ${isPremiumTheme ? 'text-amber-300 bg-amber-900/50' : 'text-violet-600 dark:text-violet-400 bg-violet-100 dark:bg-violet-900/40'}`}>
                                  {problem.measurement_adjustment}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Alteration Steps */}
                  {analysis.alteration_steps?.length > 0 && (
                    <div className={`rounded-2xl p-5 shadow-lg border ${isPremiumTheme ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-amber-500/20' : 'bg-[var(--card-bg)] border-[var(--card-border)]'}`}>
                      <h3 className={`flex items-center gap-2 font-semibold mb-4 ${isPremiumTheme ? 'text-white' : 'text-[var(--text-primary)]'}`}>
                        <Scissors className={`w-5 h-5 ${isPremiumTheme ? 'text-amber-400' : 'text-violet-500'}`} />
                        Alteration Steps
                      </h3>
                      <div className="space-y-4">
                        {analysis.alteration_steps.map((step, i) => (
                          <div key={i} className="flex gap-4">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-sm ${isPremiumTheme ? 'bg-amber-900/30 text-amber-400' : 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400'}`}>
                              {step.step_number || i + 1}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className={`font-medium ${isPremiumTheme ? 'text-white' : 'text-[var(--text-primary)]'}`}>{step.action}</p>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${difficultyColors[step.difficulty]}`}>
                                  {step.difficulty}
                                </span>
                              </div>
                              <p className={`text-sm ${isPremiumTheme ? 'text-amber-200/70' : 'text-[var(--text-secondary)]'}`}>{step.details}</p>
                              {step.tools_needed && (
                                <p className={`text-xs mt-1 ${isPremiumTheme ? 'text-amber-200/60' : 'text-[var(--text-tertiary)]'}`}>
                                  <span className="font-medium">Tools:</span> {step.tools_needed}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Preventive Advice */}
                  {analysis.preventive_advice?.length > 0 && (
                    <div className="bg-amber-50 rounded-3xl p-6 border border-amber-100">
                      <h3 className="flex items-center gap-2 font-semibold text-amber-900 mb-4">
                        <Lightbulb className="w-5 h-5 text-amber-500" />
                        Preventive Advice for Future
                      </h3>
                      <ul className="space-y-2">
                        {analysis.preventive_advice.map((advice, i) => (
                          <li key={i} className="flex items-start gap-2 text-amber-800">
                            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2" />
                            {advice}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Positive Aspects */}
                  {analysis.positive_aspects?.length > 0 && (
                    <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-100">
                      <h3 className="flex items-center gap-2 font-semibold text-emerald-900 mb-4">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        What's Working Well
                      </h3>
                      <ul className="space-y-2">
                        {analysis.positive_aspects.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-emerald-800">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Professional Notes */}
                  {analysis.professional_notes && (
                    <div className={`rounded-3xl p-6 border ${isPremiumTheme ? 'bg-slate-900/50 border-amber-500/20' : 'bg-[var(--bg-tertiary)] border-[var(--border-primary)]'}`}>
                      <h3 className={`font-semibold mb-2 ${isPremiumTheme ? 'text-white' : 'text-[var(--text-primary)]'}`}>Professional Notes</h3>
                      <p className={`italic leading-relaxed ${isPremiumTheme ? 'text-[#E0E0E0]' : 'text-[var(--text-secondary)]'}`}>{analysis.professional_notes}</p>
                    </div>
                  )}

                  <Button
                    onClick={clearImage}
                    variant="outline"
                    className="w-full rounded-2xl py-6 border-2"
                  >
                    Analyze Another Garment
                  </Button>
                </motion.div>
              )}

              {!analyzing && !analysis && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`rounded-3xl p-8 shadow-lg border text-center ${isPremiumTheme ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-amber-500/20' : 'bg-[var(--card-bg)] border-[var(--card-border)]'}`}
                >
                  <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 ${isPremiumTheme ? 'bg-amber-900/30' : 'bg-[var(--bg-tertiary)]'}`}>
                    <ImageIcon className={`w-10 h-10 ${isPremiumTheme ? 'text-amber-400' : 'text-[var(--text-tertiary)]'}`} />
                  </div>
                  <h3 className={`text-xl font-semibold mb-2 ${isPremiumTheme ? 'text-white' : 'text-[var(--text-primary)]'}`}>
                    Professional Analysis Awaits
                  </h3>
                  <p className={`mb-4 ${isPremiumTheme ? 'text-amber-200/70' : 'text-[var(--text-secondary)]'}`}>
                    Upload a garment photo to receive:
                  </p>
                  <ul className={`text-sm text-left space-y-2 max-w-xs mx-auto ${isPremiumTheme ? 'text-amber-200/70' : 'text-[var(--text-secondary)]'}`}>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className={`w-4 h-4 ${isPremiumTheme ? 'text-amber-400' : 'text-violet-500'}`} />
                      Precise fitting diagnosis
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className={`w-4 h-4 ${isPremiumTheme ? 'text-amber-400' : 'text-violet-500'}`} />
                      Measurement adjustments
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className={`w-4 h-4 ${isPremiumTheme ? 'text-amber-400' : 'text-violet-500'}`} />
                      Step-by-step alteration guide
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className={`w-4 h-4 ${isPremiumTheme ? 'text-amber-400' : 'text-violet-500'}`} />
                      Preventive advice
                    </li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
    </div>
  );
}