import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { usePremium } from '@/components/PremiumProvider';
import toast, { Toaster } from 'react-hot-toast';
import { 
  ArrowLeft,
  Sparkles,
  Wand2,
  Loader2,
  Shirt,
  Download,
  RefreshCw,
  Lock,
  Crown,
  Upload,
  Scissors
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import UpgradeModal from '../components/UpgradeModal';

export default function FreeDesignIllustrator() {
  const navigate = useNavigate();
  const { hasFullAccess, isPremiumActive } = usePremium();
  const [activeTab, setActiveTab] = useState('create');
  const [prompt, setPrompt] = useState('');
  const [modifyImage, setModifyImage] = useState(null);
  const [modifyPrompt, setModifyPrompt] = useState('');
  const [convertImage, setConvertImage] = useState(null);
  const [convertPrompt, setConvertPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [uploadingModify, setUploadingModify] = useState(false);
  const [uploadingConvert, setUploadingConvert] = useState(false);

  const examplePrompts = [
    "Ankara and denim casual outfit for women",
    "Elegant evening gown with lace details",
    "Professional blazer with African print lining",
    "Modern two-piece outfit with flared pants"
  ];

  const handleFileUpload = async (file, setter, setUploading) => {
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setter(file_url);
    } catch (e) {
      console.error(e);
      toast.error('Upload failed. Please try again.');
    }
    setUploading(false);
  };

  const generateDesign = async (promptText, referenceUrl = null) => {
    if (!promptText.trim()) return;
    if (!hasFullAccess) {
      setShowUpgradeModal(true);
      return;
    }

    setGenerating(true);
    try {
      const fullPrompt = `Fashion design illustration: ${promptText}. Professional fashion sketch style, clear garment details, front view, clean background. Include subtle watermark text 'Tailorix AI Illustration' in the bottom corner of the image.`;

      const response = await base44.integrations.Core.GenerateImage({
        prompt: fullPrompt,
        existing_image_urls: referenceUrl ? [referenceUrl] : undefined
      });

      setGeneratedImage(response.url);
    } catch (e) {
      console.error(e);
      toast.error('Failed to generate design. Please try again.');
    }
    setGenerating(false);
  };

  const tabClass = (tab) =>
    `px-6 py-3 rounded-full font-medium transition-all ${
      activeTab === tab
        ? 'bg-pink-500 text-white shadow-lg'
        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
    }`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--gradient-start)] via-[var(--gradient-middle)] to-[var(--gradient-end)]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            className="mb-4 -ml-4 text-[var(--text-secondary)]"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4 bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400">
              <Wand2 className="w-4 h-4" />
              AI Design Studio
            </div>
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-2xl md:text-3xl font-light tracking-tight text-[var(--text-primary)]">
                Fashion/Design <span className="font-semibold">Illustrator</span>
              </h1>
            </div>
            <p className="text-base font-light text-[var(--text-secondary)]">
              Create beautiful garment designs with AI assistance.
            </p>

            {!hasFullAccess && (
              <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <p className="text-xs text-amber-800 dark:text-amber-300">
                  <span className="font-semibold">⚠️ Trial expired.</span> Upgrade to Pro to continue generating designs.
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 mb-6 flex-wrap"
        >
          <button onClick={() => setActiveTab('create')} className={tabClass('create')}>Create New</button>
          <button onClick={() => setActiveTab('modify')} className={tabClass('modify')}>Modify Design</button>
          <button onClick={() => setActiveTab('convert')} className={tabClass('convert')}>Convert Style</button>
        </motion.div>

        <div className="space-y-6">
          {/* Create Tab */}
          {activeTab === 'create' && (
            <motion.div key="create" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--card-border)] shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Wand2 className="w-5 h-5 text-pink-500" />
                    <h2 className="text-lg font-semibold text-[var(--text-primary)]">Create New Design</h2>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold ${hasFullAccess ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {hasFullAccess ? 'ACTIVE' : 'PRO REQUIRED'}
                  </span>
                </div>

                <Label className="text-sm font-medium mb-2 block text-[var(--text-secondary)]">
                  Describe your design
                </Label>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., Elegant A-line dress with floral Ankara print and modern neckline..."
                  className="min-h-[120px] resize-none"
                />

                <div className="mt-4">
                  <p className="text-xs mb-2 text-[var(--text-tertiary)]">Quick ideas:</p>
                  <div className="flex flex-wrap gap-2">
                    {examplePrompts.map((ex, i) => (
                      <button
                        key={i}
                        onClick={() => setPrompt(ex)}
                        className="text-xs px-3 py-1.5 rounded-full transition-colors bg-[var(--bg-tertiary)] hover:opacity-80 text-[var(--text-secondary)]"
                      >
                        {ex}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  {!hasFullAccess ? (
                    <Button
                      onClick={() => setShowUpgradeModal(true)}
                      className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 rounded-xl py-3 text-base"
                    >
                      <Crown className="w-4 h-4 mr-2" />
                      Upgrade to Pro to Generate
                    </Button>
                  ) : (
                    <Button
                      onClick={() => generateDesign(prompt)}
                      disabled={generating || !prompt.trim()}
                      className="w-full rounded-xl py-3 text-base font-bold bg-pink-500 hover:bg-pink-600"
                    >
                      {generating ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating Design...</>
                      ) : (
                        <><Wand2 className="w-4 h-4 mr-2" />Generate Design</>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Modify Tab */}
          {activeTab === 'modify' && (
            <motion.div key="modify" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className={`bg-[var(--card-bg)] rounded-xl p-6 border shadow-lg ${!hasFullAccess ? 'border-2 border-amber-200 opacity-70 relative' : 'border-[var(--card-border)]'}`}>
                {!hasFullAccess && (
                  <div className="absolute top-4 right-4 z-10">
                    <Lock className="w-6 h-6 text-amber-500" />
                  </div>
                )}

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Scissors className="w-5 h-5 text-amber-600" />
                    <h2 className="text-lg font-semibold text-[var(--text-primary)]">Modify Existing Design</h2>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold ${hasFullAccess ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {hasFullAccess ? 'ACTIVE' : 'PRO REQUIRED'}
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block text-[var(--text-secondary)]">
                      Upload Design Image
                    </Label>
                    {modifyImage ? (
                      <div className="relative">
                        <img src={modifyImage} alt="Design to modify" className="w-full h-32 object-cover rounded-lg" />
                        <Button size="sm" variant="secondary" className="absolute top-2 right-2" onClick={() => setModifyImage(null)}>
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        disabled={!hasFullAccess || uploadingModify}
                        className="w-full rounded-xl"
                        onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*'; i.onchange = e => handleFileUpload(e.target.files[0], setModifyImage, setUploadingModify); i.click(); }}
                      >
                        {uploadingModify ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                        {uploadingModify ? 'Uploading...' : 'Upload Image'}
                      </Button>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2 block text-[var(--text-secondary)]">
                      Describe Modifications
                    </Label>
                    <Textarea
                      disabled={!hasFullAccess}
                      value={modifyPrompt}
                      onChange={(e) => setModifyPrompt(e.target.value)}
                      placeholder="e.g., Change fabric to floral print, adjust neckline..."
                      className="min-h-[100px] resize-none"
                    />
                  </div>

                  {!hasFullAccess ? (
                    <Button
                      onClick={() => setShowUpgradeModal(true)}
                      className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-900 font-bold"
                    >
                      <Crown className="w-4 h-4 mr-2" />
                      Upgrade to Pro to Modify
                    </Button>
                  ) : (
                    <Button
                      onClick={() => generateDesign(modifyPrompt, modifyImage)}
                      disabled={generating || !modifyPrompt.trim()}
                      className="w-full rounded-xl py-3 font-bold bg-pink-500 hover:bg-pink-600"
                    >
                      {generating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating...</> : <><Wand2 className="w-4 h-4 mr-2" />Modify Design</>}
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Convert Tab */}
          {activeTab === 'convert' && (
            <motion.div key="convert" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className={`bg-[var(--card-bg)] rounded-xl p-6 border shadow-lg ${!hasFullAccess ? 'border-2 border-amber-200 opacity-70 relative' : 'border-[var(--card-border)]'}`}>
                {!hasFullAccess && (
                  <div className="absolute top-4 right-4 z-10">
                    <Lock className="w-6 h-6 text-amber-500" />
                  </div>
                )}

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-5 h-5 text-amber-600" />
                    <h2 className="text-lg font-semibold text-[var(--text-primary)]">Convert Design Style</h2>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold ${hasFullAccess ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {hasFullAccess ? 'ACTIVE' : 'PRO REQUIRED'}
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block text-[var(--text-secondary)]">
                      Upload Design Image
                    </Label>
                    {convertImage ? (
                      <div className="relative">
                        <img src={convertImage} alt="Design to convert" className="w-full h-32 object-cover rounded-lg" />
                        <Button size="sm" variant="secondary" className="absolute top-2 right-2" onClick={() => setConvertImage(null)}>
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        disabled={!hasFullAccess || uploadingConvert}
                        className="w-full rounded-xl"
                        onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*'; i.onchange = e => handleFileUpload(e.target.files[0], setConvertImage, setUploadingConvert); i.click(); }}
                      >
                        {uploadingConvert ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                        {uploadingConvert ? 'Uploading...' : 'Upload Image'}
                      </Button>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2 block text-[var(--text-secondary)]">
                      Describe Style Conversion
                    </Label>
                    <Textarea
                      disabled={!hasFullAccess}
                      value={convertPrompt}
                      onChange={(e) => setConvertPrompt(e.target.value)}
                      placeholder="e.g., Convert this dress into a two-piece set with modern style..."
                      className="min-h-[100px] resize-none"
                    />
                  </div>

                  {!hasFullAccess ? (
                    <Button
                      onClick={() => setShowUpgradeModal(true)}
                      className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-900 font-bold"
                    >
                      <Crown className="w-4 h-4 mr-2" />
                      Upgrade to Pro to Convert
                    </Button>
                  ) : (
                    <Button
                      onClick={() => generateDesign(convertPrompt, convertImage)}
                      disabled={generating || !convertPrompt.trim()}
                      className="w-full rounded-xl py-3 font-bold bg-pink-500 hover:bg-pink-600"
                    >
                      {generating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating...</> : <><RefreshCw className="w-4 h-4 mr-2" />Convert Design</>}
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Preview Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6"
        >
          <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--card-border)] overflow-hidden min-h-[500px] flex flex-col shadow-lg">
            {generating ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 bg-pink-100 dark:bg-pink-900/30">
                    <Loader2 className="w-6 h-6 animate-spin text-pink-500" />
                  </div>
                  <h3 className="font-semibold mb-2 text-base text-[var(--text-primary)]">Creating Your Design</h3>
                  <p className="text-sm text-[var(--text-secondary)]">This may take a few moments...</p>
                </div>
              </div>
            ) : generatedImage ? (
              <>
                <div className="flex-1 p-4">
                  <img src={generatedImage} alt="Generated design" className="w-full h-full object-contain rounded-xl" />
                </div>
                <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1 rounded-xl" onClick={() => window.open(generatedImage, '_blank')}>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setGeneratedImage(null)}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      New Design
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center p-6">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-[var(--bg-tertiary)]">
                    <Shirt className="w-8 h-8 text-[var(--text-tertiary)]" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-[var(--text-primary)]">
                    Your Design Will Appear Here
                  </h3>
                  <p className="text-sm max-w-sm text-[var(--text-secondary)]">
                    Describe your vision and Tailorix AI will generate a professional fashion illustration.
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />

      <Toaster position="top-center" />
    </div>
  );
}