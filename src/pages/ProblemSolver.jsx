import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { 
  ArrowLeft,
  HelpCircle,
  Upload,
  X,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Ruler,
  User,
  Shirt,
  ChevronRight,
  Sparkles,
  Crown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SelectItem } from '@/components/ui/select';
import { MobileSelect } from '@/components/ui/mobile-select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import CameraCapture from '../components/CameraCapture';
import UpgradeModal from '../components/UpgradeModal';
import { usePremium } from '@/components/PremiumProvider';

export default function ProblemSolver() {
  const navigate = useNavigate();
  const { isPremiumActive, hasFullAccess } = usePremium();
  const [step, setStep] = useState(1);
  const [problem, setProblem] = useState('');
  const [garmentType, setGarmentType] = useState('');
  const [fabricType, setFabricType] = useState('');
  const [gender, setGender] = useState('');
  const [measurements, setMeasurements] = useState({
    bust: '', waist: '', hips: '', shoulder: '',
    armLength: '', inseam: '', height: ''
  });
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [solution, setSolution] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const fileInputRef = useRef(null);

  const isPremium = isPremiumActive;
  const loading = false;

  const commonProblems = [
    "Customer says dress is too tight at the bust",
    "Trousers are pulling at the thighs",
    "Jacket shoulders are too wide",
    "Blouse is gaping at the buttons",
    "Dress waistline sits too high",
    "Sleeves are too long and bunching",
    "Back of garment has excess fabric",
    "Neckline is too low/high"
  ];

  const handleFileSelect = async (file) => {
    if (!file) return;

    setImage(file);
    setUploading(true);

    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setImageUrl(file_url);
    } catch (e) {
      console.error(e);
    }
    setUploading(false);
  };

  const analyzeProblem = async () => {
    if (!hasFullAccess) {
      setShowUpgradeModal(true);
      return;
    }

    setAnalyzing(true);
    try {
      const measurementText = Object.entries(measurements)
        .filter(([_, v]) => v)
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ');

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are Tailorix AI, a master tailor with 30+ years of experience. A customer has come to you with this fitting problem:

PROBLEM: ${problem}

DETAILS:
- Garment Type: ${garmentType || 'Not specified'}
- Fabric: ${fabricType || 'Not specified'}
- Customer Gender: ${gender || 'Not specified'}
- Measurements: ${measurementText || 'Not provided'}
${imageUrl ? '- Image provided for reference' : ''}

Please provide a comprehensive professional diagnosis and solution. Be specific with measurements and techniques. This advice is for working tailors.`,
        file_urls: imageUrl ? [imageUrl] : undefined,
        response_json_schema: {
          type: "object",
          properties: {
            diagnosis: {
              type: "object",
              properties: {
                primary_issue: { type: "string" },
                root_cause: { type: "string" },
                severity: { type: "string", enum: ["minor", "moderate", "major"] },
                affected_areas: { type: "array", items: { type: "string" } }
              }
            },
            solution: {
              type: "object",
              properties: {
                approach: { type: "string" },
                steps: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      step_number: { type: "number" },
                      action: { type: "string" },
                      details: { type: "string" },
                      measurement_adjustment: { type: "string" },
                      tools_needed: { type: "string" }
                    }
                  }
                },
                estimated_time: { type: "string" },
                difficulty: { type: "string", enum: ["easy", "intermediate", "advanced"] }
              }
            },
            alternative_solutions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  method: { type: "string" },
                  pros: { type: "string" },
                  cons: { type: "string" }
                }
              }
            },
            prevention_tips: {
              type: "array",
              items: { type: "string" }
            },
            customer_communication: { type: "string" },
            professional_notes: { type: "string" }
          }
        }
      });

      setSolution(response);
      setStep(4);
    } catch (e) {
      console.error(e);
    }
    setAnalyzing(false);
  };

  const clearImage = () => {
    setImage(null);
    setImageUrl(null);
  };

  const resetForm = () => {
    setStep(1);
    setProblem('');
    setGarmentType('');
    setFabricType('');
    setGender('');
    setMeasurements({ bust: '', waist: '', hips: '', shoulder: '', armLength: '', inseam: '', height: '' });
    setImage(null);
    setImageUrl(null);
    setSolution(null);
  };

  const severityColors = {
    minor: 'bg-amber-100 text-amber-700',
    moderate: 'bg-orange-100 text-orange-700',
    major: 'bg-rose-100 text-rose-700'
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
          <Loader2 className={`w-12 h-12 animate-spin mx-auto mb-4 ${isPremium ? 'text-amber-400' : 'text-amber-500'}`} />
          <p className={isPremium ? 'text-amber-200/80' : 'text-slate-600'}>Loading solver...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isPremiumTheme ? 'bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#1E1E1E]' : 'bg-gradient-to-br from-[var(--gradient-start)] via-[var(--gradient-middle)] to-[var(--gradient-end)]'}`}>
      <div className="max-w-4xl mx-auto px-4 py-8">
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
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4 ${isPremiumTheme ? 'bg-gradient-to-r from-amber-900/30 to-yellow-900/30 border border-amber-500/30 text-amber-400' : 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'}`}>
              <HelpCircle className="w-4 h-4" />
              {isPremiumTheme && <Crown className="w-4 h-4" />}
              Problem Solver {isPremiumTheme && 'Pro'}
            </div>
            <div className="flex items-center justify-between mb-3">
              <h1 className={`text-2xl md:text-3xl font-light tracking-tight ${isPremiumTheme ? 'text-white' : 'text-[var(--text-primary)]'}`}>
                Fitting <span className={`font-semibold ${isPremiumTheme ? 'bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent' : ''}`}>Problem Solver</span>
              </h1>
            </div>
            <p className={`text-base font-light ${isPremiumTheme ? 'text-amber-200/80' : 'text-[var(--text-secondary)]'}`}>
              Describe your customer's fitting issue and get professional diagnosis and solutions.
            </p>
          </motion.div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8 max-w-md mx-auto">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center font-semibold
                ${step >= s ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-500'}
              `}>
                {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
              </div>
              {s < 4 && (
                <div className={`w-12 h-1 ${step > s ? 'bg-amber-500' : 'bg-slate-200'}`} />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Problem Description */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={`rounded-2xl p-6 shadow-lg border ${isPremiumTheme ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-amber-500/20' : 'bg-[var(--card-bg)] border-[var(--card-border)]'}`}
            >
              <h2 className={`text-xl font-bold mb-4 ${isPremiumTheme ? 'text-white' : 'text-[var(--text-primary)]'}`}>What's the Problem?</h2>
              
              <div className="mb-6">
                <Label className={`text-sm font-medium mb-3 block ${isPremiumTheme ? 'text-amber-200/80' : 'text-[var(--text-secondary)]'}`}>
                  Describe the fitting issue
                </Label>
                <Textarea
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  placeholder="e.g., Customer says the dress is too tight at the bust and pulling across the chest..."
                  className={`min-h-[120px] ${isPremiumTheme ? 'bg-slate-900/50 border-amber-500/20 text-white' : ''}`}
                />
              </div>

              <div className="mb-6">
                <p className={`text-sm mb-3 ${isPremiumTheme ? 'text-amber-200/60' : 'text-[var(--text-tertiary)]'}`}>Common problems:</p>
                <div className="flex flex-wrap gap-2">
                  {commonProblems.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => setProblem(p)}
                      className={`text-sm px-3 py-2 hover:opacity-80 rounded-xl transition-colors text-left ${isPremiumTheme ? 'bg-slate-900/50 text-amber-200/70 border border-amber-500/20' : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={() => setStep(2)}
                disabled={!problem.trim()}
                className={`w-full rounded-xl py-3 ${isPremiumTheme ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-900 font-bold shadow-lg' : 'bg-amber-500 hover:bg-amber-600'}`}
              >
                Continue
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          )}

          {/* Step 2: Garment & Fabric Details */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={`rounded-2xl p-6 shadow-lg border ${isPremiumTheme ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-amber-500/20' : 'bg-[var(--card-bg)] border-[var(--card-border)]'}`}
            >
              <h2 className={`text-xl font-bold mb-4 ${isPremiumTheme ? 'text-white' : 'text-[var(--text-primary)]'}`}>Garment Details</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <Label className={`text-sm font-medium mb-2 block ${isPremiumTheme ? 'text-[#E6D9A5]' : 'text-[var(--text-secondary)]'}`}>
                    <Shirt className="w-4 h-4 inline mr-2" />
                    Garment Type
                  </Label>
                  <MobileSelect value={garmentType} onValueChange={setGarmentType} placeholder="Select garment type">
                    <SelectItem value="dress">Dress</SelectItem>
                    <SelectItem value="blouse">Blouse/Shirt</SelectItem>
                    <SelectItem value="trousers">Trousers/Pants</SelectItem>
                    <SelectItem value="skirt">Skirt</SelectItem>
                    <SelectItem value="jacket">Jacket/Blazer</SelectItem>
                    <SelectItem value="gown">Gown</SelectItem>
                    <SelectItem value="agbada">Agbada</SelectItem>
                    <SelectItem value="kaftan">Kaftan</SelectItem>
                    <SelectItem value="jumpsuit">Jumpsuit</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </MobileSelect>
                </div>

                <div>
                  <Label className={`text-sm font-medium mb-2 block ${isPremiumTheme ? 'text-[#E6D9A5]' : 'text-[var(--text-secondary)]'}`}>
                    Fabric Type
                  </Label>
                  <MobileSelect value={fabricType} onValueChange={setFabricType} placeholder="Select fabric">
                    <SelectItem value="cotton">Cotton</SelectItem>
                    <SelectItem value="ankara">Ankara</SelectItem>
                    <SelectItem value="lace">Lace</SelectItem>
                    <SelectItem value="silk">Silk</SelectItem>
                    <SelectItem value="chiffon">Chiffon</SelectItem>
                    <SelectItem value="velvet">Velvet</SelectItem>
                    <SelectItem value="denim">Denim</SelectItem>
                    <SelectItem value="wool">Wool</SelectItem>
                    <SelectItem value="aso-oke">Aso-Oke</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </MobileSelect>
                </div>
              </div>

              <div className="mb-6">
                <Label className={`text-sm font-medium mb-3 block ${isPremiumTheme ? 'text-[#E6D9A5]' : 'text-[var(--text-secondary)]'}`}>
                  <User className="w-4 h-4 inline mr-2" />
                  Customer Gender
                </Label>
                <RadioGroup value={gender} onValueChange={setGender} className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="child" id="child" />
                    <Label htmlFor="child">Child</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)} className="rounded-xl">
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  className={`flex-1 rounded-xl py-3 ${isPremiumTheme ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-900 font-bold shadow-lg' : 'bg-amber-500 hover:bg-amber-600'}`}
                >
                  Continue
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Measurements & Image */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={`rounded-2xl p-6 shadow-lg border ${isPremiumTheme ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-amber-500/20' : 'bg-[var(--card-bg)] border-[var(--card-border)]'}`}
            >
              <h2 className={`text-xl font-bold mb-4 ${isPremiumTheme ? 'text-white' : 'text-[var(--text-primary)]'}`}>
                <Ruler className="w-5 h-5 inline mr-2" />
                Measurements & Reference
              </h2>
              
              <p className={`text-sm mb-4 ${isPremiumTheme ? 'text-amber-200/70' : 'text-[var(--text-secondary)]'}`}>Optional but helps with accurate diagnosis</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { key: 'bust', label: 'Bust/Chest' },
                  { key: 'waist', label: 'Waist' },
                  { key: 'hips', label: 'Hips' },
                  { key: 'shoulder', label: 'Shoulder' },
                  { key: 'armLength', label: 'Arm Length' },
                  { key: 'inseam', label: 'Inseam' },
                  { key: 'height', label: 'Height' }
                ].map(({ key, label }) => (
                  <div key={key}>
                    <Label className={`text-xs ${isPremiumTheme ? 'text-[#E6D9A5]' : 'text-[var(--text-tertiary)]'}`}>{label}</Label>
                    <Input
                      value={measurements[key]}
                      onChange={(e) => setMeasurements({ ...measurements, [key]: e.target.value })}
                      placeholder="e.g., 36in"
                      className={`mt-1 ${isPremiumTheme ? 'bg-[#1E1E1E] border-[#D4AF37] text-[#F8F8F2]' : ''}`}
                    />
                  </div>
                ))}
              </div>

              {/* Image Upload */}
              <div className="mb-6">
                <Label className={`text-sm font-medium mb-3 block ${isPremiumTheme ? 'text-[#E6D9A5]' : 'text-[var(--text-secondary)]'}`}>
                  Upload Image (Optional)
                </Label>
                {!image ? (
                  <CameraCapture 
                    onCapture={handleFileSelect}
                    onFileSelect={handleFileSelect}
                  />
                ) : (
                  <div className="relative inline-block">
                    {uploading && (
                      <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-xl">
                        <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
                      </div>
                    )}
                    <img 
                      src={imageUrl || URL.createObjectURL(image)} 
                      alt="Reference"
                      className="h-48 object-contain rounded-xl"
                    />
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute top-2 right-2 rounded-full"
                      onClick={clearImage}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(2)} className="rounded-xl">
                  Back
                </Button>
                <Button
                  onClick={analyzeProblem}
                  disabled={analyzing}
                  className={`flex-1 rounded-xl py-3 ${isPremiumTheme ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-900 font-bold shadow-lg' : 'bg-amber-500 hover:bg-amber-600'}`}
                >
                  {analyzing ? (
                    <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Analyzing...</>
                  ) : (
                    <>Get Solution<ChevronRight className="w-5 h-5 ml-2" /></>
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Solution */}
          {step === 4 && solution && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Diagnosis */}
              <div className={`rounded-3xl p-6 shadow-lg border ${isPremiumTheme ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-amber-500/20' : 'bg-[var(--card-bg)] border-[var(--card-border)]'}`}>
                <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isPremiumTheme ? 'text-white' : 'text-[var(--text-primary)]'}`}>
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  Diagnosis
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className={`text-sm ${isPremiumTheme ? 'text-[#E6D9A5]' : 'text-[var(--text-tertiary)]'}`}>Primary Issue</p>
                      <p className={`font-semibold ${isPremiumTheme ? 'text-[#F8F8F2]' : 'text-[var(--text-primary)]'}`}>{solution.diagnosis?.primary_issue}</p>
                    </div>
                    <span className={`text-sm px-3 py-1 rounded-full ${severityColors[solution.diagnosis?.severity]}`}>
                      {solution.diagnosis?.severity}
                    </span>
                  </div>
                  
                  <div>
                    <p className={`text-sm ${isPremiumTheme ? 'text-[#E6D9A5]' : 'text-[var(--text-tertiary)]'}`}>Root Cause</p>
                    <p className={isPremiumTheme ? 'text-[#F8F8F2]' : 'text-[var(--text-secondary)]'}>{solution.diagnosis?.root_cause}</p>
                  </div>

                  {solution.diagnosis?.affected_areas?.length > 0 && (
                    <div>
                      <p className={`text-sm mb-2 ${isPremiumTheme ? 'text-[#E6D9A5]' : 'text-[var(--text-tertiary)]'}`}>Affected Areas</p>
                      <div className="flex flex-wrap gap-2">
                        {solution.diagnosis.affected_areas.map((area, i) => (
                          <span key={i} className={`text-sm px-3 py-1 rounded-full ${isPremiumTheme ? 'bg-slate-900/50 text-[#F8F8F2]' : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'}`}>
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Solution Steps */}
              <div className={`rounded-3xl p-6 shadow-lg border ${isPremiumTheme ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-amber-500/20' : 'bg-[var(--card-bg)] border-[var(--card-border)]'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className={`text-xl font-bold flex items-center gap-2 ${isPremiumTheme ? 'text-white' : 'text-[var(--text-primary)]'}`}>
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    Solution
                  </h2>
                  <div className="flex items-center gap-2 text-sm">
                    <span className={`px-3 py-1 rounded-full ${difficultyColors[solution.solution?.difficulty]}`}>
                      {solution.solution?.difficulty}
                    </span>
                    <span className={isPremiumTheme ? 'text-[#E6D9A5]' : 'text-[var(--text-tertiary)]'}>{solution.solution?.estimated_time}</span>
                  </div>
                </div>

                <p className={isPremiumTheme ? 'text-[#F8F8F2] mb-4' : 'text-[var(--text-secondary)] mb-4'}>{solution.solution?.approach}</p>

                <div className="space-y-4">
                  {solution.solution?.steps?.map((step, i) => (
                    <div key={i} className={`flex gap-4 p-4 rounded-xl ${isPremiumTheme ? 'bg-slate-900/50' : 'bg-[var(--bg-tertiary)]'}`}>
                      <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center flex-shrink-0 text-amber-600 dark:text-amber-400 font-bold text-sm">
                        {step.step_number || i + 1}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${isPremiumTheme ? 'text-[#F8F8F2]' : 'text-[var(--text-primary)]'}`}>{step.action}</p>
                        <p className={`text-sm mt-1 ${isPremiumTheme ? 'text-[#F8F8F2]' : 'text-[var(--text-secondary)]'}`}>{step.details}</p>
                        {step.measurement_adjustment && (
                          <p className={`text-sm mt-1 font-mono px-2 py-1 rounded inline-block ${isPremiumTheme ? 'text-amber-300 bg-amber-900/50' : 'text-amber-600 bg-amber-50'}`}>
                            {step.measurement_adjustment}
                          </p>
                        )}
                        {step.tools_needed && (
                          <p className={`text-xs mt-1 ${isPremiumTheme ? 'text-[#E6D9A5]' : 'text-[var(--text-tertiary)]'}`}>Tools: {step.tools_needed}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Alternative Solutions */}
              {solution.alternative_solutions?.length > 0 && (
                <div className={`rounded-3xl p-6 border ${isPremiumTheme ? 'bg-slate-900/50 border-amber-500/20' : 'bg-[var(--bg-tertiary)] border-[var(--border-primary)]'}`}>
                  <h3 className={`font-semibold mb-4 ${isPremiumTheme ? 'text-[#F8F8F2]' : 'text-[var(--text-primary)]'}`}>Alternative Approaches</h3>
                  <div className="space-y-3">
                    {solution.alternative_solutions.map((alt, i) => (
                      <div key={i} className={`p-3 rounded-xl ${isPremiumTheme ? 'bg-slate-800/50' : 'bg-[var(--card-bg)]'}`}>
                        <p className={`font-medium ${isPremiumTheme ? 'text-[#F8F8F2]' : 'text-[var(--text-primary)]'}`}>{alt.method}</p>
                        <p className="text-sm text-emerald-600">✓ {alt.pros}</p>
                        <p className="text-sm text-rose-600">✗ {alt.cons}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Prevention Tips */}
              {solution.prevention_tips?.length > 0 && (
                <div className="bg-amber-50 rounded-3xl p-6 border border-amber-100">
                  <h3 className="flex items-center gap-2 font-semibold text-amber-900 mb-4">
                    <Lightbulb className="w-5 h-5 text-amber-500" />
                    Prevention Tips
                  </h3>
                  <ul className="space-y-2">
                    {solution.prevention_tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-amber-800">
                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Customer Communication */}
              {solution.customer_communication && (
                <div className="bg-violet-50 rounded-3xl p-6 border border-violet-100">
                  <h3 className="font-semibold text-violet-900 mb-2">How to Explain to Customer</h3>
                  <p className="text-violet-700 italic">"{solution.customer_communication}"</p>
                </div>
              )}

              <Button onClick={resetForm} className={`w-full rounded-xl py-3 ${isPremiumTheme ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-900 font-bold shadow-lg' : 'bg-amber-500 hover:bg-amber-600'}`}>
                Solve Another Problem
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
        />
      </div>
    </div>
  );
}