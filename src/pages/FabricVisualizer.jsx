import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { usePremium } from '@/components/PremiumProvider';
import {
  ArrowLeft, Upload, Download, RefreshCw, Loader2,
  Shirt, ZoomIn, RotateCw, Crown, Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import CameraCapture from '../components/CameraCapture';

// First 4 = free during trial / always free for premium. Last 3 = locked after trial ends.
const TEMPLATE_GALLERY = [
  { id: 'flared_gown',     name: 'Female Flared Gown',           premium: false, imageUrl: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697d0c21476d1c06f4d428ff/71635e725_FlaredGown.png' },
  { id: 'fitted_dress',    name: 'Fitted Midi Dress',             premium: false, imageUrl: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697d0c21476d1c06f4d428ff/30ef4a6c7_FittedGown.png' },
  { id: 'button_down',     name: 'Button Down Shirt',             premium: false, imageUrl: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697d0c21476d1c06f4d428ff/20f851ae3_ButtonDownshirt.png' },
  { id: 'mens_kaftan',     name: "Men's Native Kaftan",           premium: false, imageUrl: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697d0c21476d1c06f4d428ff/05785cd62_MensNativeKaftan.png' },
  // --- Premium templates (locked after trial) ---
  { id: 'denim_jacket',    name: 'Denim Jacket',                  premium: true,  imageUrl: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697d0c21476d1c06f4d428ff/69918323b_DenimJacket.png' },
  { id: 'mens_trouser',    name: "Men's Baggy/Fitted Trouser",    premium: true,  imageUrl: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697d0c21476d1c06f4d428ff/7b26aaba7_MensBaggyandfittedTrouser.png' },
  { id: 'womens_trouser',  name: "Female's Baggy/Fitted Trouser", premium: true,  imageUrl: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697d0c21476d1c06f4d428ff/78a93f203_FemalesBaggyandfittedTrouser.png' },
];

export default function FabricVisualizer() {
  const { isPremiumActive, hasFullAccess } = usePremium();
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState('flared_gown');
  const [fabricUrl, setFabricUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [fabricScale, setFabricScale] = useState(1);
  const [fabricRotation, setFabricRotation] = useState(0);
  const [showLockedPopup, setShowLockedPopup] = useState(false);
  const canvasRef = useRef(null);

  const currentTemplate = TEMPLATE_GALLERY.find(t => t.id === selectedTemplate);

  const handleTemplateSelect = (template) => {
    if (template.premium && !hasFullAccess) {
      setShowLockedPopup(true);
      return;
    }
    setSelectedTemplate(template.id);
  };

  const handleFileSelect = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFabricUrl(file_url);
    } catch (e) {
      console.error(e);
    }
    setUploading(false);
  };

  const downloadPreview = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 1000;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (fabricUrl) {
      const fabricImg = new Image();
      fabricImg.crossOrigin = 'anonymous';
      fabricImg.onload = () => {
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((fabricRotation * Math.PI) / 180);
        ctx.scale(fabricScale, fabricScale);
        ctx.drawImage(fabricImg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
        ctx.restore();
        if (currentTemplate?.imageUrl) {
          const templateImg = new Image();
          templateImg.crossOrigin = 'anonymous';
          templateImg.onload = () => {
            ctx.globalCompositeOperation = 'multiply';
            ctx.drawImage(templateImg, 0, 0, canvas.width, canvas.height);
            ctx.globalCompositeOperation = 'source-over';
            const link = document.createElement('a');
            link.download = `fabric-preview-${selectedTemplate}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
          };
          templateImg.src = currentTemplate.imageUrl;
        }
      };
      fabricImg.src = fabricUrl;
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 -ml-4 text-slate-400 hover:text-[#D4AF37] flex">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37]">
            <Shirt className="w-4 h-4" />
            {isPremiumActive && <Crown className="w-4 h-4" />}
            Fabric Visualizer {isPremiumActive && 'Pro'}
          </div>
          <h1 className="text-2xl md:text-3xl font-light tracking-tight mb-2 text-white">
            Preview Your <span className="font-semibold text-[#D4AF37]">Fabric</span>
          </h1>
          <p className="text-base font-light text-slate-400">
            See how your fabric will look on different garment styles instantly
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Template Grid */}
            <div className="bg-[#1e1e1e] rounded-2xl p-6 border border-[#D4AF37]/20">
              <Label className="text-sm font-semibold mb-4 block text-[#D4AF37]">
                1. Select Garment Style
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {TEMPLATE_GALLERY.map((template) => {
                  const isLocked = template.premium && !hasFullAccess;
                  const isSelected = selectedTemplate === template.id;
                  return (
                    <button
                      key={template.id}
                      onClick={() => handleTemplateSelect(template)}
                      className={`relative p-3 rounded-xl border-2 text-left text-xs font-medium transition-all ${
                        isSelected
                          ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]'
                          : isLocked
                          ? 'border-slate-700 bg-slate-800/50 text-slate-500'
                          : 'border-slate-700 bg-slate-800/30 text-slate-300 hover:border-[#D4AF37]/50'
                      }`}
                    >
                      {isLocked && (
                        <div className="absolute top-1.5 right-1.5">
                          <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
                        </div>
                      )}
                      <div className="text-[11px] leading-tight mt-1">{template.name}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Fabric Upload */}
            <div className="bg-[#1e1e1e] rounded-2xl p-6 border border-[#D4AF37]/20">
              <Label className="text-sm font-semibold mb-4 block text-[#D4AF37]">
                2. Upload Fabric
              </Label>
              {!fabricUrl ? (
                uploading ? (
                  <div className="w-full border-2 border-dashed border-slate-700 rounded-xl p-8 text-center">
                    <Loader2 className="w-8 h-8 text-[#D4AF37] mx-auto animate-spin" />
                  </div>
                ) : (
                  <CameraCapture onCapture={handleFileSelect} onFileSelect={handleFileSelect} />
                )
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <img src={fabricUrl} alt="Uploaded fabric" className="w-full h-24 object-cover rounded-lg" />
                    <Button size="sm" variant="secondary" className="absolute top-2 right-2" onClick={() => setFabricUrl(null)}>
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs flex items-center gap-1 text-slate-400"><ZoomIn className="w-3 h-3" /> Scale</span>
                        <span className="text-xs text-slate-400">{fabricScale.toFixed(1)}x</span>
                      </div>
                      <Slider value={[fabricScale]} onValueChange={([v]) => setFabricScale(v)} min={0.3} max={3} step={0.1} className="w-full" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs flex items-center gap-1 text-slate-400"><RotateCw className="w-3 h-3" /> Rotation</span>
                        <span className="text-xs text-slate-400">{fabricRotation}°</span>
                      </div>
                      <Slider value={[fabricRotation]} onValueChange={([v]) => setFabricRotation(v)} min={0} max={360} step={15} className="w-full" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-3">
            <div className="bg-[#1e1e1e] rounded-3xl p-6 border border-[#D4AF37]/20 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-white">Preview: {currentTemplate?.name}</h2>
                {fabricUrl && (
                  <Button size="sm" onClick={downloadPreview} className="gap-2 bg-[#D4AF37] hover:bg-yellow-400 text-[#121212] font-bold border-none">
                    <Download className="w-4 h-4" /> Download
                  </Button>
                )}
              </div>

              <div ref={canvasRef} className="bg-white rounded-2xl overflow-hidden min-h-[550px] relative" style={{ isolation: 'isolate' }}>
                {fabricUrl && currentTemplate?.imageUrl && (
                  <img
                    src={fabricUrl}
                    alt="Fabric pattern"
                    style={{
                      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                      objectFit: 'contain',
                      transform: `scale(${fabricScale}) rotate(${fabricRotation}deg)`,
                      transformOrigin: 'center',
                      WebkitMaskImage: `url(${currentTemplate.imageUrl})`,
                      maskImage: `url(${currentTemplate.imageUrl})`,
                      WebkitMaskSize: 'contain', maskSize: 'contain',
                      WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat',
                      WebkitMaskPosition: 'center', maskPosition: 'center',
                      zIndex: 1,
                    }}
                  />
                )}
                {currentTemplate?.imageUrl && (
                  <img
                    src={currentTemplate.imageUrl}
                    alt={currentTemplate.name}
                    style={{
                      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                      objectFit: 'contain', mixBlendMode: 'multiply', pointerEvents: 'none', zIndex: 10,
                    }}
                  />
                )}
                {!currentTemplate && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-8">
                      <Shirt className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-500">Select a garment style to preview</p>
                    </div>
                  </div>
                )}
              </div>

              {!fabricUrl && (
                <p className="text-center text-sm mt-4 text-slate-500">
                  Upload a fabric photo to see it on the template
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Locked Template Popup */}
      <AnimatePresence>
        {showLockedPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setShowLockedPopup(false)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', bounce: 0.35 }}
              className="bg-[#1e1e1e] rounded-3xl p-8 max-w-sm w-full text-center border-2 border-[#D4AF37]/50"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-16 h-16 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-[#121212]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Template Locked</h3>
              <p className="text-slate-400 mb-6 text-sm leading-relaxed">
                Your 7-day free access has expired. Upgrade to Pro to unlock all templates and every feature.
              </p>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowLockedPopup(false)} className="flex-1 border-slate-600 text-slate-300">
                  Cancel
                </Button>
                <Button
                  onClick={() => { setShowLockedPopup(false); navigate(createPageUrl('Payment')); }}
                  className="flex-1 bg-[#D4AF37] hover:bg-yellow-400 text-[#121212] font-bold border-none"
                >
                  <Crown className="w-4 h-4 mr-2" /> Upgrade
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}