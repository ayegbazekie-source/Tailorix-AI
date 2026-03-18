import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import toast, { Toaster } from 'react-hot-toast';
import { 
  ArrowLeft,
  Sparkles,
  Wand2,
  Upload,
  X,
  Download,
  RefreshCw,
  Loader2,
  Palette,
  Shirt,
  Scissors,
  Save,
  Check,
  Play,
  Users,
  MessageCircle,
  History,
  Crown,
  Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SelectItem } from '@/components/ui/select';
import { MobileSelect } from '@/components/ui/mobile-select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import CameraCapture from '../components/CameraCapture';
import CreditDisplay from '../components/CreditDisplay';
import AdWatchModal from '../components/AdWatchModal';
import UpgradeModal from '../components/UpgradeModal';
import LockedFeatureOverlay from '../components/LockedFeatureOverlay';
import ShareDesignModal from '../components/collaboration/ShareDesignModal';
import DesignComments from '../components/collaboration/DesignComments';
import VersionHistory from '../components/collaboration/VersionHistory';
import HelpOverlay from '../components/HelpOverlay';

export default function DesignGenerator() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [referenceImage, setReferenceImage] = useState(null);
  const [referenceUrl, setReferenceUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [fabricImage1, setFabricImage1] = useState(null);
  const [fabricUrl1, setFabricUrl1] = useState(null);
  const [fabricImage2, setFabricImage2] = useState(null);
  const [fabricUrl2, setFabricUrl2] = useState(null);
  const [uploadingFabric, setUploadingFabric] = useState(false);
  const [convertDescription, setConvertDescription] = useState('');
  const [designType, setDesignType] = useState('create');
  const [currentWorkspace, setCurrentWorkspace] = useState(null);
  const [workspaceRole, setWorkspaceRole] = useState(null);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(null);
  const [userWorkspaces, setUserWorkspaces] = useState([]);
  const [currentDesignId, setCurrentDesignId] = useState(null);
  const [bodyType, setBodyType] = useState('');
  const [fabricType, setFabricType] = useState('');
  const [occasion, setOccasion] = useState('');
  const [saving, setSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [user, setUser] = useState(null);
  const [credits, setCredits] = useState(3);
  const [isPremium, setIsPremium] = useState(false);
  const [adsWatchedToday, setAdsWatchedToday] = useState(0);
  const [showAdModal, setShowAdModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState('default');
  const [showShareModal, setShowShareModal] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [currentDesign, setCurrentDesign] = useState(null);
  const [loadingInitialData, setLoadingInitialData] = useState(true);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const currentUser = await base44.auth.me();

        if (!currentUser) {
          navigate(createPageUrl('Landing'), { replace: true });
          return;
        }

        setUser(currentUser);

        const [{ data: proStatusData }, { data: creditsData }] = await Promise.all([
          base44.functions.invoke('checkProStatus'),
          base44.functions.invoke('checkAndResetCredits')
        ]);

        if (!proStatusData.isPro) {
          navigate(createPageUrl('FreeHome'), { replace: true });
          return;
        }

        setIsPremium(proStatusData.isPro);
        setCredits(creditsData.credits.illustrator || 0);
        setAdsWatchedToday(creditsData.adsWatchedToday || 0);

        await loadUserWorkspaces(currentUser.id);
      } catch (error) {
        console.error('Initial data fetch failed:', error);
        navigate(createPageUrl('Landing'), { replace: true });
      } finally {
        setLoadingInitialData(false);
      }
    };
    fetchInitialData();
  }, []);

  const loadUserWorkspaces = async (userId) => {
    try {
      const members = await base44.entities.WorkspaceMember.filter({
        user_id: userId
      });
      
      const workspaceIds = members.map(m => m.workspace_id);
      const workspaces = await Promise.all(
        workspaceIds.map(id => base44.entities.Workspace.filter({ id }))
      );
      
      setUserWorkspaces(workspaces.flat());
    } catch (error) {
      console.error('Failed to load workspaces:', error);
    }
  };

  const handleRewardCredit = async () => {
    try {
      const { data } = await base44.functions.invoke('rewardUserWithCredit', {
        feature_type: 'illustrator'
      });
      
      if (data.success) {
        setCredits(data.newCredits);
        setAdsWatchedToday(data.adsWatchedToday);
        setShowAdModal(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleTabChange = (value) => {
    if ((value === 'modify' || value === 'convert') && !isPremium) {
      toast.error('Only available in premium', {
        duration: 4000,
        style: {
          background: '#FEF3C7',
          color: '#92400E',
          fontWeight: '500',
        },
      });
      setUpgradeReason('locked');
      setShowUpgradeModal(true);
      return;
    }
    setDesignType(value);
  };

  const examplePrompts = [
    "Ankara and denim casual outfit for women",
    "Elegant evening gown with lace details",
    "Professional blazer with African print lining",
    "Modern two-piece outfit with flared pants",
    "Traditional agbada with contemporary twist",
    "Casual summer dress with pockets"
  ];

  const handleFileSelect = async (file) => {
    if (!file) return;

    setReferenceImage(file);
    setUploading(true);

    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setReferenceUrl(file_url);
    } catch (e) {
      console.error(e);
    }
    setUploading(false);
  };

  const handleFabricSelect = async (file, fabricNum) => {
    if (!file) return;

    setUploadingFabric(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      
      if (fabricNum === 1) {
        setFabricImage1(file);
        setFabricUrl1(file_url);
      } else {
        setFabricImage2(file);
        setFabricUrl2(file_url);
      }
    } catch (e) {
      console.error(e);
    }
    setUploadingFabric(false);
  };

  const clearFabric = (fabricNum) => {
    if (fabricNum === 1) {
      setFabricImage1(null);
      setFabricUrl1(null);
    } else {
      setFabricImage2(null);
      setFabricUrl2(null);
    }
  };

  const generateDesign = async () => {
    if (!prompt.trim()) return;

    if ((designType === 'modify' || designType === 'convert') && !isPremium) {
      toast.error('Only available in premium', {
        duration: 4000,
        style: {
          background: '#FEF3C7',
          color: '#92400E',
          fontWeight: '500',
        },
      });
      setUpgradeReason('locked');
      setShowUpgradeModal(true);
      return;
    }

    if (designType === 'create' && !isPremium && credits <= 0) {
      if (adsWatchedToday >= 5) {
        setUpgradeReason('adLimit');
        setShowUpgradeModal(true);
      } else {
        setShowAdModal(true);
      }
      return;
    }

    if (designType === 'create' && !isPremium) {
      try {
        const { data } = await base44.functions.invoke('deductCredit', {
          feature_type: 'illustrator'
        });
        
        if (!data.success) {
          return;
        }
        
        setCredits(data.remainingCredits);
      } catch (e) {
        console.error(e);
        return;
      }
    }

    setGenerating(true);
    try {
      let fullPrompt = '';
      
      const watermark = "Include subtle watermark text 'Tailorix AI Illustration' in the bottom corner of the image.";
      
      if (designType === 'create') {
        fullPrompt = `Fashion design illustration: ${prompt}. ${bodyType ? `Designed for ${bodyType} body type.` : ''} ${fabricType ? `Using ${fabricType} fabric.` : ''} ${occasion ? `For ${occasion} occasion.` : ''} Professional fashion sketch style, clear garment details, front view, clean background. ${watermark}`;
      } else if (designType === 'modify') {
        const fabricInstructions = [];
        if (fabricUrl1 || fabricUrl2) {
          fabricInstructions.push('Apply the provided fabric patterns to the garment');
        }
        if (prompt.trim()) {
          fabricInstructions.push(prompt);
        }
        fullPrompt = `Modify ONLY the fabric/pattern of this garment illustration. ${fabricInstructions.join('. ')}. Keep the garment structure, silhouette, and style exactly the same - only change the fabric design/pattern/texture. Professional fashion illustration style. ${watermark}`;
      } else if (designType === 'convert') {
        const convertInstructions = convertDescription.trim() || prompt.trim();
        fullPrompt = `Convert this garment design: ${convertInstructions}. Transform the garment style while maintaining professional quality. Clear fashion illustration, detailed. ${watermark}`;
      }

      const imageUrls = [];
      if (referenceUrl) imageUrls.push(referenceUrl);
      if (fabricUrl1) imageUrls.push(fabricUrl1);
      if (fabricUrl2) imageUrls.push(fabricUrl2);

      const response = await base44.integrations.Core.GenerateImage({
        prompt: fullPrompt,
        existing_image_urls: imageUrls.length > 0 ? imageUrls : undefined
      });

      setGeneratedImage(response.url);
      setIsSaved(false);

      if (selectedWorkspaceId && currentDesignId && designType === 'modify') {
        await createWorkspaceVersion(response.url);
      }
    } catch (e) {
      console.error(e);
    }
    setGenerating(false);
  };

  const createWorkspaceVersion = async (imageUrl) => {
    if (!selectedWorkspaceId || !currentDesignId) return;
    
    try {
      const currentUser = await base44.auth.me();
      if (!currentUser) return;
      
      const existingVersions = await base44.entities.WorkspaceVersion.filter({
        workspace_id: selectedWorkspaceId,
        design_id: currentDesignId
      });

      const versionNumber = existingVersions.length + 1;

      await base44.entities.WorkspaceVersion.create({
        workspace_id: selectedWorkspaceId,
        design_id: currentDesignId,
        version_number: versionNumber,
        preview_url: imageUrl,
        edited_by_id: currentUser.id,
        edited_by_name: currentUser.full_name || currentUser.email,
        change_description: designType === 'modify' ? 'Fabric modification' : 'Design conversion'
      });

      toast.success(`Version ${versionNumber} created`);
    } catch (error) {
      console.error('Failed to create version:', error);
    }
  };

  const saveImage = async () => {
    if (!generatedImage || !user) return;

    // Optimistic UI update
    setIsSaved(true);
    setSaving(true);

    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const file = new File([blob], 'design.png', { type: 'image/png' });

      const { file_url } = await base44.integrations.Core.UploadFile({ file });

      const savedDesign = await base44.entities.GeneratedDesigns.create({
        user_id: user.id,
        image_url: file_url,
        prompt: prompt,
        design_type: designType
      });

      if (isPremium) {
        await base44.entities.DesignVersion.create({
          design_id: savedDesign.id,
          version_number: 1,
          image_url: file_url,
          prompt: prompt,
          changed_by: user.full_name || user.email,
          change_description: 'Initial version'
        });
      }

      if (selectedWorkspaceId) {
        await base44.entities.WorkspaceDesign.create({
          workspace_id: selectedWorkspaceId,
          design_id: savedDesign.id,
          title: prompt.substring(0, 50) || 'Untitled Design',
          preview_url: file_url,
          created_by_id: user.id,
          created_by_name: user.full_name || user.email,
          last_edited_by: user.full_name || user.email
        });

        await base44.entities.WorkspaceVersion.create({
          workspace_id: selectedWorkspaceId,
          design_id: savedDesign.id,
          version_number: 1,
          preview_url: file_url,
          edited_by_id: user.id,
          edited_by_name: user.full_name || user.email,
          change_description: 'Initial version'
        });

        setCurrentDesignId(savedDesign.id);
        toast.success('Design saved and added to workspace');
      } else {
        toast.success('Design saved to gallery');
      }

      setCurrentDesign(savedDesign);
    } catch (e) {
      console.error(e);
      toast.error('Failed to save image. Please try again.');
      // Rollback on error
      setIsSaved(false);
    }
    setSaving(false);
  };

  const handleRestoreVersion = async (version) => {
    setGeneratedImage(version.image_url);
    setPrompt(version.prompt);
    toast.success('Version restored');
  };

  const clearReference = () => {
    setReferenceImage(null);
    setReferenceUrl(null);
  };

  const resetModifyInputs = () => {
    setPrompt('');
    clearFabric(1);
    clearFabric(2);
    clearReference();
  };

  const resetConvertInputs = () => {
    setPrompt('');
    setConvertDescription('');
    clearReference();
  };

  const isPremiumTheme = isPremium;

  if (loadingInitialData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#1E1E1E] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#D4AF37] animate-spin mx-auto mb-4" />
          <p className="text-[#F8F8F2] text-lg">Loading AI Design Studio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isPremiumTheme ? 'bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#1E1E1E]' : 'bg-gradient-to-br from-[var(--gradient-start)] via-[var(--gradient-middle)] to-[var(--gradient-end)]'}`}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            className={`mb-6 -ml-4 hidden md:flex ${isPremiumTheme ? 'text-[#F8F8F2] hover:text-[#D4AF37]' : 'text-[var(--text-secondary)]'}`}
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4 ${isPremiumTheme ? 'bg-gradient-to-r from-amber-900/30 to-yellow-900/30 border border-amber-500/30 text-[#D4AF37]' : 'bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400'}`}>
              <Wand2 className="w-4 h-4" />
              {isPremiumTheme && <Crown className="w-4 h-4" />}
              AI Design Studio {isPremiumTheme && 'Pro'}
            </div>
            <div className="flex items-center justify-between mb-4">
              <h1 className={`text-2xl md:text-3xl font-light tracking-tight ${isPremiumTheme ? 'text-[#F8F8F2]' : 'text-[var(--text-primary)]'}`}>
                Fashion/Design <span className={`font-semibold ${isPremiumTheme ? 'bg-gradient-to-r from-[#D4AF37] to-yellow-500 bg-clip-text text-transparent' : ''}`}>Illustrator</span>
              </h1>
              <CreditDisplay credits={credits} featureName="Illustrator" isPremium={isPremium} />
            </div>
            <p className={`text-base font-light ${isPremiumTheme ? 'text-[#F8F8F2]/80' : 'text-[var(--text-secondary)]'}`}>
              Create, modify, and transform garment designs with AI assistance.
            </p>

            {/* Workspace Assignment */}
            {isPremium && userWorkspaces && userWorkspaces.length > 0 && (
              <div className="mt-4 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-3 border-2 border-[#D4AF37]/20">
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase className="w-4 h-4 text-[#D4AF37]" />
                  <Label className="text-[#D4AF37] font-semibold text-sm">Assign to Workspace (Optional)</Label>
                </div>
                <MobileSelect value={selectedWorkspaceId || ''} onValueChange={setSelectedWorkspaceId} placeholder="Select a workspace..." className="bg-slate-900/50 border-[#D4AF37]/20 text-[#F8F8F2]">
                    <SelectItem value={null}>None (Personal Design)</SelectItem>
                    {userWorkspaces.map(ws => (
                      <SelectItem key={ws.id} value={ws.id}>{ws.name}</SelectItem>
                    ))}
                </MobileSelect>
                {selectedWorkspaceId && (
                  <p className="text-xs text-[#F8F8F2]/60 mt-2">
                    Design will be added to workspace and version tracked
                  </p>
                )}
              </div>
            )}
            
            {/* Important Notice */}
            <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
              <p className="text-xs text-amber-800 dark:text-amber-300">
                <span className="font-semibold">⚠️ Important:</span> Please download and save your generated designs immediately. Once you close this page or generate a new design, previous images cannot be recovered.
              </p>
            </div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Design Type Tabs */}
            <Tabs value={designType} onValueChange={handleTabChange}>
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="create" className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Create New
                </TabsTrigger>
                <TabsTrigger value="modify" className="flex items-center gap-2 relative">
                  <Palette className="w-4 h-4" />
                  Modify
                  {!isPremium && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center text-[9px] text-white font-bold">
                      P
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="convert" className="flex items-center gap-2 relative">
                  <Scissors className="w-4 h-4" />
                  Convert
                  {!isPremium && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center text-[9px] text-white font-bold">
                      P
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Locked Feature Overlay for Premium Tabs */}
            {!isPremium && (designType === 'modify' || designType === 'convert') && (
              <div className="relative bg-[var(--card-bg)] rounded-2xl p-6 border border-[var(--card-border)] min-h-[400px]">
                <LockedFeatureOverlay onUpgradeClick={() => {
                  toast.error('Only available in premium', {
                    duration: 4000,
                    style: {
                      background: '#FEF3C7',
                      color: '#92400E',
                      fontWeight: '500',
                    },
                  });
                  setUpgradeReason('locked');
                  setShowUpgradeModal(true);
                }} />
              </div>
            )}

            {/* MODIFY SECTION - Premium Only */}
            {isPremium && designType === 'modify' && (
              <>
                {/* Garment Reference Upload - Required */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 border-2 border-[#D4AF37]/20">
                  <Label className="text-sm font-medium text-[#D4AF37] mb-2 block">
                    Upload Garment Illustration (Required)
                  </Label>
                  <p className="text-xs text-[#F8F8F2]/60 mb-2">Upload the garment design you want to modify</p>
                  {!referenceImage ? (
                    <CameraCapture 
                      onCapture={handleFileSelect}
                      onFileSelect={handleFileSelect}
                    />
                  ) : (
                    <div className="relative">
                      {uploading && (
                        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10 rounded-xl">
                          <Loader2 className="w-6 h-6 animate-spin text-[#D4AF37]" />
                        </div>
                      )}
                      <img 
                        src={referenceUrl || URL.createObjectURL(referenceImage)} 
                        alt="Garment"
                        className="w-full h-48 object-contain rounded-xl bg-slate-900/50"
                      />
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute top-2 right-2 rounded-full bg-slate-900 hover:bg-slate-800"
                        onClick={clearReference}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Fabric Modification Options */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 border-2 border-[#D4AF37]/20 space-y-3">
                  <h3 className="font-semibold text-[#D4AF37] text-sm">Modify Fabric Design</h3>
                  
                  {/* Text Description */}
                  <div>
                    <Label className="text-sm font-medium text-[#F8F8F2]/80 mb-2 block">
                      Option 1: Describe Fabric Changes
                    </Label>
                    <Textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="e.g., Change to floral Ankara print, Use vibrant geometric pattern, Apply denim texture..."
                      className="min-h-[100px] resize-none bg-slate-900/50 border-[#D4AF37]/20 text-white"
                    />
                  </div>

                  {/* OR Divider */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-[#D4AF37]/20" />
                    <span className="text-xs text-[#F8F8F2]/60 font-medium">OR</span>
                    <div className="flex-1 h-px bg-[#D4AF37]/20" />
                  </div>

                  {/* Fabric Image Uploads */}
                  <div>
                    <Label className="text-sm font-medium text-[#F8F8F2]/80 mb-2 block">
                      Option 2: Upload Fabric Images (Max 2)
                    </Label>
                    <div className="grid grid-cols-2 gap-4">
                      {/* Fabric 1 */}
                      <div>
                        <Label className="text-xs text-[#F8F8F2]/60 mb-2 block">Fabric 1</Label>
                        {!fabricImage1 ? (
                          <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-[#D4AF37]/30 rounded-xl cursor-pointer hover:border-[#D4AF37]/50 transition-colors bg-slate-900/30">
                            <Upload className="w-6 h-6 text-[#D4AF37]/70 mb-2" />
                            <span className="text-xs text-[#F8F8F2]/60">Upload Fabric</span>
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={(e) => handleFabricSelect(e.target.files[0], 1)}
                            />
                          </label>
                        ) : (
                          <div className="relative">
                            <img 
                              src={fabricUrl1 || URL.createObjectURL(fabricImage1)} 
                              alt="Fabric 1"
                              className="w-full h-32 object-cover rounded-xl"
                            />
                            <Button
                              variant="secondary"
                              size="icon"
                              className="absolute top-1 right-1 rounded-full h-6 w-6 bg-slate-900"
                              onClick={() => clearFabric(1)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* Fabric 2 */}
                      <div>
                        <Label className="text-xs text-[#F8F8F2]/60 mb-2 block">Fabric 2 (Optional)</Label>
                        {!fabricImage2 ? (
                          <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-[#D4AF37]/30 rounded-xl cursor-pointer hover:border-[#D4AF37]/50 transition-colors bg-slate-900/30">
                            <Upload className="w-6 h-6 text-[#D4AF37]/70 mb-2" />
                            <span className="text-xs text-[#F8F8F2]/60">Upload Fabric</span>
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={(e) => handleFabricSelect(e.target.files[0], 2)}
                            />
                          </label>
                        ) : (
                          <div className="relative">
                            <img 
                              src={fabricUrl2 || URL.createObjectURL(fabricImage2)} 
                              alt="Fabric 2"
                              className="w-full h-32 object-cover rounded-xl"
                            />
                            <Button
                              variant="secondary"
                              size="icon"
                              className="absolute top-1 right-1 rounded-full h-6 w-6 bg-slate-900"
                              onClick={() => clearFabric(2)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-[#F8F8F2]/50 mt-2">Upload 1-2 fabric images to merge and apply to the garment</p>
                  </div>
                </div>
              </>
            )}

            {/* CONVERT SECTION - Premium Only */}
            {isPremium && designType === 'convert' && (
              <>
                {/* Text Conversion */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 border-2 border-[#D4AF37]/20">
                  <Label className="text-sm font-medium text-[#D4AF37] mb-2 block">
                    Option 1: Text Description
                  </Label>
                  <Textarea
                    value={convertDescription}
                    onChange={(e) => setConvertDescription(e.target.value)}
                    placeholder="e.g., Convert this dress into a two-piece crop top and skirt set, Transform to a modern jumpsuit..."
                    className="min-h-[120px] resize-none bg-slate-900/50 border-[#D4AF37]/20 text-white"
                  />
                </div>

                {/* OR Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-[#D4AF37]/20" />
                  <span className="text-sm text-[#F8F8F2]/60 font-medium">OR</span>
                  <div className="flex-1 h-px bg-[#D4AF37]/20" />
                </div>

                {/* Image Conversion */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 border-2 border-[#D4AF37]/20">
                  <Label className="text-sm font-medium text-[#D4AF37] mb-2 block">
                    Option 2: Upload Reference Image
                  </Label>
                  <p className="text-xs text-[#F8F8F2]/60 mb-2">Upload an image to convert its style</p>
                  {!referenceImage ? (
                    <CameraCapture 
                      onCapture={handleFileSelect}
                      onFileSelect={handleFileSelect}
                    />
                  ) : (
                    <div className="relative">
                      {uploading && (
                        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10 rounded-xl">
                          <Loader2 className="w-6 h-6 animate-spin text-[#D4AF37]" />
                        </div>
                      )}
                      <img 
                        src={referenceUrl || URL.createObjectURL(referenceImage)} 
                        alt="Convert Reference"
                        className="w-full h-48 object-contain rounded-xl bg-slate-900/50"
                      />
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute top-2 right-2 rounded-full bg-slate-900 hover:bg-slate-800"
                        onClick={clearReference}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Prompt Input for Create */}
            {designType === 'create' && (
            <div className={`rounded-xl p-4 border ${isPremiumTheme ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-[#D4AF37]/20' : 'bg-[var(--card-bg)] border-[var(--card-border)]'}`}>
              <Label className={`text-sm font-medium mb-2 block ${isPremiumTheme ? 'text-[#D4AF37]' : 'text-[var(--text-secondary)]'}`}>
                Describe your design
              </Label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., Elegant A-line dress with floral Ankara print and modern neckline..."
                className={`min-h-[120px] resize-none ${isPremiumTheme ? 'bg-slate-900/50 border-[#D4AF37]/20 text-white' : ''}`}
              />
              
              {/* Quick prompts */}
              {designType === 'create' && (
                <div className="mt-3">
                  <p className={`text-xs mb-2 ${isPremiumTheme ? 'text-[#F8F8F2]/60' : 'text-[var(--text-tertiary)]'}`}>Quick ideas:</p>
                  <div className="flex flex-wrap gap-2">
                    {examplePrompts.slice(0, 4).map((example, i) => (
                      <button
                        key={i}
                        onClick={() => setPrompt(example)}
                        className={`text-xs px-3 py-1.5 rounded-full transition-colors ${isPremiumTheme ? 'bg-slate-700 hover:bg-slate-600 text-[#F8F8F2]' : 'bg-[var(--bg-tertiary)] hover:opacity-80 text-[var(--text-secondary)]'}`}
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            )}

            {/* Additional Options */}
            {designType === 'create' && (
              <div className={`rounded-xl p-4 border space-y-3 ${isPremiumTheme ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-[#D4AF37]/20' : 'bg-[var(--card-bg)] border-[var(--card-border)]'}`}>
                <h3 className={`font-medium text-sm ${isPremiumTheme ? 'text-[#D4AF37]' : 'text-[var(--text-primary)]'}`}>Design Parameters</h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className={`text-xs ${isPremiumTheme ? 'text-[#E6D9A5]' : 'text-[var(--text-tertiary)]'}`}>Body Type</Label>
                    <MobileSelect value={bodyType} onValueChange={setBodyType} placeholder="Any" className="mt-1">
                      <SelectItem value={null}>Any</SelectItem>
                      <SelectItem value="slim">Slim</SelectItem>
                      <SelectItem value="athletic">Athletic</SelectItem>
                      <SelectItem value="curvy">Curvy</SelectItem>
                      <SelectItem value="plus-size">Plus Size</SelectItem>
                      <SelectItem value="petite">Petite</SelectItem>
                      <SelectItem value="tall">Tall</SelectItem>
                    </MobileSelect>
                  </div>

                  <div>
                    <Label className={`text-xs ${isPremiumTheme ? 'text-[#E6D9A5]' : 'text-[var(--text-tertiary)]'}`}>Fabric</Label>
                    <MobileSelect value={fabricType} onValueChange={setFabricType} placeholder="Any" className="mt-1">
                      <SelectItem value={null}>Any</SelectItem>
                      <SelectItem value="cotton">Cotton</SelectItem>
                      <SelectItem value="silk">Silk</SelectItem>
                      <SelectItem value="ankara">Ankara</SelectItem>
                      <SelectItem value="lace">Lace</SelectItem>
                      <SelectItem value="denim">Denim</SelectItem>
                      <SelectItem value="velvet">Velvet</SelectItem>
                      <SelectItem value="chiffon">Chiffon</SelectItem>
                    </MobileSelect>
                  </div>

                  <div>
                    <Label className={`text-xs ${isPremiumTheme ? 'text-[#E6D9A5]' : 'text-[var(--text-tertiary)]'}`}>Occasion</Label>
                    <MobileSelect value={occasion} onValueChange={setOccasion} placeholder="Any" className="mt-1">
                      <SelectItem value={null}>Any</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="formal">Formal</SelectItem>
                      <SelectItem value="wedding">Wedding</SelectItem>
                      <SelectItem value="party">Party</SelectItem>
                      <SelectItem value="work">Work</SelectItem>
                      <SelectItem value="traditional">Traditional</SelectItem>
                    </MobileSelect>
                  </div>
                </div>
              </div>
            )}

            {/* Generate Button for Modify */}
            {isPremium && designType === 'modify' && (
              <Button
                onClick={generateDesign}
                disabled={generating || !referenceUrl || (!prompt.trim() && !fabricUrl1)}
                className="w-full bg-gradient-to-r from-[#D4AF37] to-yellow-500 hover:from-[#D4AF37] hover:to-yellow-400 text-black font-bold rounded-xl py-3 text-base shadow-lg shadow-[#D4AF37]/30"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Modifying Fabric...
                  </>
                ) : (
                  <>
                    <Palette className="w-5 h-5 mr-2" />
                    Modify Fabric Design
                  </>
                )}
              </Button>
            )}

            {/* Generate Button for Convert */}
            {isPremium && designType === 'convert' && (
              <Button
                onClick={generateDesign}
                disabled={generating || (!convertDescription.trim() && !referenceUrl)}
                className="w-full bg-gradient-to-r from-[#D4AF37] to-yellow-500 hover:from-[#D4AF37] hover:to-yellow-400 text-black font-bold rounded-xl py-3 text-base shadow-lg shadow-[#D4AF37]/30"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Converting Design...
                  </>
                ) : (
                  <>
                    <Scissors className="w-5 h-5 mr-2" />
                    Convert Design
                  </>
                )}
              </Button>
            )}

            {/* Generate Button for Create */}
            {designType === 'create' && (
              <>
                {!isPremium && credits <= 0 ? (
                  adsWatchedToday >= 5 ? (
                    <Button
                      onClick={() => {
                        setUpgradeReason('adLimit');
                        setShowUpgradeModal(true);
                      }}
                      className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 rounded-2xl py-6 text-lg"
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                      Upgrade to Tailorix AI Pro
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setShowAdModal(true)}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-2xl py-6 text-lg"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Watch Ad to Earn +1 Credit ({5 - adsWatchedToday} left today)
                    </Button>
                  )
                ) : (
                  <Button
                    onClick={generateDesign}
                    disabled={generating || !prompt.trim()}
                    className={`w-full rounded-xl py-3 text-base font-bold ${isPremiumTheme ? 'bg-gradient-to-r from-[#D4AF37] to-yellow-500 hover:from-[#D4AF37] hover:to-yellow-400 text-black shadow-lg shadow-[#D4AF37]/30' : 'bg-pink-500 hover:bg-pink-600'}`}
                  >
                    {generating ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Generating Design...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-5 h-5 mr-2" />
                        Generate Design
                      </>
                    )}
                  </Button>
                )}
              </>
            )}
          </motion.div>

          {/* Output Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className={`rounded-3xl border overflow-hidden h-full min-h-[500px] flex flex-col ${isPremiumTheme ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-[#D4AF37]/20' : 'bg-[var(--card-bg)] border-[var(--card-border)]'}`}>
              {generating ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 ${isPremiumTheme ? 'bg-amber-900/30' : 'bg-pink-100 dark:bg-pink-900/30'}`}>
                      <Loader2 className={`w-6 h-6 animate-spin ${isPremiumTheme ? 'text-[#D4AF37]' : 'text-pink-500'}`} />
                    </div>
                    <h3 className={`font-semibold mb-2 text-base ${isPremiumTheme ? 'text-[#F8F8F2]' : 'text-[var(--text-primary)]'}`}>Creating Your Design</h3>
                    <p className={`text-sm ${isPremiumTheme ? 'text-[#F8F8F2]/60' : 'text-[var(--text-secondary)]'}`}>This may take a few moments...</p>
                  </div>
                </div>
              ) : generatedImage ? (
                <>
                  <div className="flex-1 p-4">
                    <img 
                      src={generatedImage} 
                      alt="Generated design"
                      className="w-full h-full object-contain rounded-2xl"
                    />
                  </div>
                  <div className="p-4 border-t border-slate-200 space-y-3">
                    <Button
                      onClick={saveImage}
                      disabled={saving || isSaved}
                      className={`w-full rounded-xl ${isPremiumTheme ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-black font-bold shadow-lg' : 'bg-green-500 hover:bg-green-600'}`}
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : isSaved ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          {selectedWorkspaceId ? 'Saved to Workspace' : 'Saved to Gallery'}
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Design
                        </>
                      )}
                    </Button>
                    
                    {/* Workspace Actions - Premium Only */}
                    {isPremium && isSaved && selectedWorkspaceId && (
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(createPageUrl('WorkspaceDetail') + `?id=${selectedWorkspaceId}`)}
                          className={`rounded-xl ${isPremiumTheme ? 'border-[#D4AF37]/30 text-[#D4AF37] hover:bg-amber-900/20' : ''}`}
                        >
                          <Briefcase className="w-4 h-4 mr-1" />
                          Workspace
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowVersionHistory(true)}
                          className={`rounded-xl ${isPremiumTheme ? 'border-[#D4AF37]/30 text-[#D4AF37] hover:bg-amber-900/20' : ''}`}
                        >
                          <History className="w-4 h-4 mr-1" />
                          Versions
                        </Button>
                      </div>
                    )}
                    
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        className={`flex-1 rounded-xl ${isPremiumTheme ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-[#000000] border-none font-bold' : ''}`}
                        onClick={() => window.open(generatedImage, '_blank')}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button
                        variant="outline"
                        className={`flex-1 rounded-xl ${isPremiumTheme ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-[#000000] border-none font-bold' : ''}`}
                        onClick={generateDesign}
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Regenerate
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center p-6">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${isPremiumTheme ? 'bg-slate-700' : 'bg-[var(--bg-tertiary)]'}`}>
                      <Shirt className={`w-8 h-8 ${isPremiumTheme ? 'text-[#D4AF37]' : 'text-[var(--text-tertiary)]'}`} />
                    </div>
                    <h3 className={`text-lg font-semibold mb-2 ${isPremiumTheme ? 'text-[#F8F8F2]' : 'text-[var(--text-primary)]'}`}>
                      Your Design Will Appear Here
                    </h3>
                    <p className={`text-sm max-w-sm ${isPremiumTheme ? 'text-[#F8F8F2]/70' : 'text-[var(--text-secondary)]'}`}>
                      Describe your vision and Tailorix AI will generate a professional fashion illustration.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <AdWatchModal 
        isOpen={showAdModal}
        onClose={() => setShowAdModal(false)}
        onReward={handleRewardCredit}
        featureType="illustrator"
      />

      <UpgradeModal 
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        reason={upgradeReason}
        country={user?.country || 'Nigeria'}
      />

      {/* Version History Modal */}
      {isPremium && showVersionHistory && selectedWorkspaceId && (
        <Dialog open={showVersionHistory} onOpenChange={setShowVersionHistory}>
          <DialogContent className="bg-gradient-to-br from-slate-800 to-slate-900 border-[#D4AF37]/30 text-white max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl text-[#D4AF37]">Workspace Version History</DialogTitle>
            </DialogHeader>
            <div className="pt-4">
              <p className="text-[#F8F8F2]/60 text-sm mb-4">
                View all versions in the workspace. Go to the workspace to restore previous versions.
              </p>
              <Button
                onClick={() => navigate(createPageUrl('WorkspaceDetail') + `?id=${selectedWorkspaceId}`)}
                className="bg-gradient-to-r from-[#D4AF37] to-yellow-500 hover:from-[#D4AF37] hover:to-yellow-400 text-black font-bold"
              >
                <Briefcase className="w-4 h-4 mr-2" />
                Open Workspace
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
      
      <Toaster position="top-center" />
      
      {/* Help Overlay - Premium Styled */}
      {isPremium && <HelpOverlay isPremium={true} />}
    </div>
  );
}