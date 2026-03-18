import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { usePremium } from '@/components/PremiumProvider';
import { useLegalUrls } from '@/components/useLegalUrls';
import TrialStatusCard from '@/components/TrialStatusCard';
import { 
  User, 
  Mail, 
  Crown, 
  Image as ImageIcon, 
  Save,
  Upload,
  Sparkles,
  ArrowLeft,
  Trash2,
  X,
  Loader2,
  ChevronRight,
  Sun,
  Moon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

export default function UserProfile() {
  const { user: currentUser, isPremiumActive } = usePremium();
  const { privacyPolicyUrl, termsOfServiceUrl } = useLegalUrls();
  const [userData, setUserData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savedDesigns, setSavedDesigns] = useState([]);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showAllDesigns, setShowAllDesigns] = useState(false);
  const [showDeleteAccountDialog, setShowDeleteAccountDialog] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  // Dark mode toggle
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const toggleDarkMode = (val) => {
    setDarkMode(val);
    if (val) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Hidden developer override (5-tap version number → password popup)
  const [isProductionOverride, setIsProductionOverride] = useState(() =>
    localStorage.getItem('production_override') === 'true'
  );
  const [versionTapCount, setVersionTapCount] = useState(0);
  const [showDevPassword, setShowDevPassword] = useState(false);
  const [devPassword, setDevPassword] = useState('');
  const [devPasswordError, setDevPasswordError] = useState(false);
  const tapTimerRef = useRef(null);

  const handleVersionTap = () => {
    const newCount = versionTapCount + 1;
    setVersionTapCount(newCount);
    clearTimeout(tapTimerRef.current);
    if (newCount >= 5) {
      setVersionTapCount(0);
      setDevPassword('');
      setDevPasswordError(false);
      setShowDevPassword(true);
    } else {
      tapTimerRef.current = setTimeout(() => setVersionTapCount(0), 2000);
    }
  };

  const handleDevPasswordSubmit = () => {
    if (devPassword === 'KadiriDev2026') {
      const newVal = !isProductionOverride;
      setIsProductionOverride(newVal);
      localStorage.setItem('production_override', newVal ? 'true' : 'false');
      // Expose to window so backend function calls can read it
      window.__PRODUCTION_OVERRIDE__ = newVal;
      setShowDevPassword(false);
    } else {
      setDevPasswordError(true);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadUserData();
    }
  }, [currentUser]);

  const loadUserData = async () => {
    try {
      setUserData({ ...currentUser });

      // Fetch saved designs
      const designs = await base44.entities.GeneratedDesigns.filter(
        { user_id: currentUser.id },
        '-created_date'
      );
      setSavedDesigns(designs);
    } catch (error) {
      console.error('Error loading user:', error);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await base44.auth.updateMe({
        full_name: userData.full_name,
        profile_picture_url: userData.profile_picture_url
      });
      const updatedUser = await base44.auth.me();
      setUser(updatedUser);
      setUserData(updatedUser);
      setEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
    setSaving(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      await base44.auth.updateMe({ profile_picture_url: file_url });
      setUserData({ ...userData, profile_picture_url: file_url });
    } catch (error) {
      console.error('Error uploading image:', error);
    }
    setUploading(false);
  };

  const handleDeleteDesign = async () => {
    if (!selectedDesign) return;

    setDeleting(true);
    try {
      // Delete from database
      await base44.entities.GeneratedDesigns.delete(selectedDesign.id);

      // Update local state
      setSavedDesigns(savedDesigns.filter(d => d.id !== selectedDesign.id));
      
      // Close dialogs
      setShowDeleteConfirm(false);
      setSelectedDesign(null);
    } catch (error) {
      console.error('Error deleting design:', error);
      alert('Failed to delete design. Please try again.');
    }
    setDeleting(false);
  };

  const handleLogout = () => {
    base44.auth.logout();
  };

  const handleDeleteAccount = async () => {
    setDeletingAccount(true);
    try {
      // Delete all user's designs first
      const userDesigns = await base44.entities.GeneratedDesigns.filter({ user_id: currentUser.id });
      await Promise.all(userDesigns.map(d => base44.entities.GeneratedDesigns.delete(d.id)));
      
      // Logout and redirect
      alert('Your account data has been cleared. You will now be logged out.');
      base44.auth.logout();
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account. Please try again or contact support.');
      setDeletingAccount(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isPremiumActive ? 'bg-[#121212]' : 'bg-[var(--bg-primary)]'}`}>
        <div className="text-center">
          <div className={`w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4 ${isPremiumActive ? 'border-amber-400' : 'border-rose-400'}`} />
          <p className={isPremiumActive ? 'text-amber-300/70' : 'text-[var(--text-secondary)]'}>Loading profile...</p>
        </div>
      </div>
    );
  }

  const proStyle = isPremiumActive ? {
    background: 'linear-gradient(135deg, #121212 0%, #1a1a1a 50%, #121212 100%)',
    minHeight: '100vh'
  } : {};

  return (
    <div className={`min-h-screen py-12 px-6 ${isPremiumActive ? '' : 'bg-[var(--bg-primary)]'}`} style={proStyle}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <Link to={createPageUrl(isPremiumActive ? 'PremiumHome' : 'FreeHome')}>
                <Button variant="ghost" className={`-ml-4 ${isPremiumActive ? 'text-amber-300 hover:text-amber-200 hover:bg-amber-500/10' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>

              {/* Dark / Light Mode Toggle */}
              <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border shadow-sm ${isPremiumActive ? 'bg-[#2a2a2a] border-amber-500/40' : 'bg-[var(--bg-secondary)] border-[var(--border-primary)]'}`}>
                <Sun className="w-4 h-4 text-amber-500" />
                <Switch
                  checked={darkMode}
                  onCheckedChange={toggleDarkMode}
                  aria-label="Toggle dark mode"
                />
                <Moon className="w-4 h-4 text-[var(--text-secondary)]" />
                <span className={`text-xs font-medium ml-1 ${isPremiumActive ? 'text-amber-300/80' : 'text-[var(--text-secondary)]'}`}>
                  {darkMode ? 'Dark' : 'Light'}
                </span>
              </div>
            </div>

            <div className="text-center">
              <h1 className={`text-4xl font-bold mb-2 ${isPremiumActive ? 'text-amber-400' : 'text-[var(--text-primary)]'}`}>
                My Profile
              </h1>
              <p className={isPremiumActive ? 'text-amber-200/70' : 'text-[var(--text-secondary)]'}>
                Manage your account and subscription
              </p>
            </div>
          </div>

          {/* Profile Card */}
          <div className={`rounded-3xl p-8 shadow-xl mb-6 ${isPremiumActive ? 'bg-[#1e1e1e] border-2 border-amber-500/60' : 'bg-[var(--card-bg)] border border-[var(--card-border)]'}`}>
            <div className="flex flex-col md:flex-row gap-8">
              {/* Profile Picture */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-rose-400 to-pink-400 flex items-center justify-center overflow-hidden">
                    {userData?.profile_picture_url ? (
                      <img 
                        src={userData.profile_picture_url} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-16 h-16 text-white" />
                    )}
                  </div>
                  {editing && (
                    <label className="absolute bottom-0 right-0 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black p-2 rounded-full cursor-pointer shadow-lg">
                      <Upload className="w-4 h-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                {uploading && (
                  <p className="text-xs text-amber-200/60 mt-2">Uploading...</p>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1 space-y-4">
                <div>
                  <Label className={isPremiumActive ? 'text-amber-300/70' : 'text-[var(--text-secondary)]'}>Full Name</Label>
                  {editing ? (
                    <Input
                      value={userData?.full_name || ''}
                      onChange={(e) => setUserData({ ...userData, full_name: e.target.value })}
                      className="mt-1"
                    />
                  ) : (
                    <p className={`text-xl font-semibold mt-1 ${isPremiumActive ? 'text-white' : 'text-[var(--text-primary)]'}`}>
                      {currentUser?.full_name || 'Not set'}
                    </p>
                  )}
                  </div>

                  <div>
                  <Label className={isPremiumActive ? 'text-amber-300/70' : 'text-[var(--text-secondary)]'}>Email</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className={`w-4 h-4 ${isPremiumActive ? 'text-amber-400' : 'text-[var(--text-secondary)]'}`} />
                    <p className={isPremiumActive ? 'text-white' : 'text-[var(--text-primary)]'}>{currentUser?.email}</p>
                  </div>
                  </div>

                  <div>
                  <Label className={isPremiumActive ? 'text-amber-300/70' : 'text-[var(--text-secondary)]'}>Subscription Status</Label>
                  <div className="mt-3">
                    {isPremiumActive ? (
                      <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 p-[2px] rounded-2xl shadow-2xl">
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 px-6 py-4 rounded-2xl">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                              <Crown className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <p className="text-lg font-bold text-white">Tailorix AI Pro Active</p>
                              <p className="text-xs text-amber-300">All features unlocked</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Badge variant="outline" className="text-[var(--text-secondary)] border-[var(--border-primary)] px-4 py-2">
                          Free Plan
                        </Badge>
                        <div className="flex items-center gap-2 mt-2">
                          <Link to={createPageUrl('Payment')}>
                            <Button size="sm" className="bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold text-xs px-3 py-1 h-auto rounded-full">
                              <Crown className="w-3 h-3 mr-1" /> Upgrade to Pro — $10/month
                            </Button>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 mt-6 flex-wrap">
                  {editing ? (
                    <>
                      <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-rose-500 hover:bg-rose-600 text-white font-bold border-none"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {saving ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditing(false);
                          setUserData({ ...currentUser });
                        }}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={() => setEditing(true)}
                        variant="outline"
                      >
                        Edit Profile
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleLogout}
                        className="border-red-300 text-red-500 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                      >
                        Logout
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowDeleteAccountDialog(true)}
                        className="border-red-300 text-red-500 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                      >
                        Delete Account
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Trial Status Card */}
          <TrialStatusCard />

          {/* Premium Benefits - SHOW ONLY FOR PREMIUM */}
          {isPremiumActive && (
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 shadow-2xl border-2 border-amber-400 mb-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 mb-4 shadow-lg">
                <Crown className="w-10 h-10 text-white animate-pulse" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Tailorix AI Pro Active
              </h2>
              <p className="text-amber-300">
                You have unlimited access to all features
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/50 rounded-xl p-4 border border-amber-500/20">
                <p className="text-amber-400 text-sm mb-1">Analyses</p>
                <p className="text-white text-2xl font-bold">Unlimited</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4 border border-amber-500/20">
                <p className="text-amber-400 text-sm mb-1">Designs</p>
                <p className="text-white text-2xl font-bold">Unlimited</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4 border border-amber-500/20">
                <p className="text-amber-400 text-sm mb-1">Solutions</p>
                <p className="text-white text-2xl font-bold">Unlimited</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4 border border-amber-500/20">
                <p className="text-amber-400 text-sm mb-1">Collaboration</p>
                <p className="text-white text-2xl font-bold">Share & Co-edit</p>
              </div>
            </div>
          </div>
          )}

          {/* Saved Designs */}
          <div className={`rounded-3xl p-8 shadow-xl mb-6 ${isPremiumActive ? 'bg-[#1e1e1e] border-2 border-amber-500/60' : 'bg-[var(--card-bg)] border border-[var(--card-border)]'}`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-semibold ${isPremiumActive ? 'text-amber-400' : 'text-[var(--text-primary)]'}`}>
                Saved Designs
              </h2>
              {savedDesigns.length > 3 && !showAllDesigns && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAllDesigns(true)}
                  className="text-rose-500 hover:text-rose-600"
                >
                  View All ({savedDesigns.length})
                </Button>
              )}
              {showAllDesigns && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAllDesigns(false)}
                  className="text-rose-500 hover:text-rose-600"
                >
                  Show Less
                </Button>
              )}
            </div>

            {savedDesigns.length === 0 ? (
              <div className="text-center py-12">
                <ImageIcon className="w-16 h-16 mx-auto mb-4 text-[var(--text-tertiary)]" />
                <p className="text-[var(--text-secondary)]">
                  No saved designs yet.
                </p>
                <p className="text-sm text-[var(--text-tertiary)] mt-2">
                  Create and save your first design to see it here!
                </p>
              </div>
            ) : showAllDesigns ? (
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {savedDesigns.map((design) => (
                  <motion.div
                    key={design.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="group relative cursor-pointer"
                    onClick={() => setSelectedDesign(design)}
                  >
                    <div className="aspect-square rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700 border-2 border-transparent group-hover:border-rose-400 transition-all active:scale-95">
                      <img
                        src={design.image_url}
                        alt={design.prompt || 'Saved design'}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-xl flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-white dark:bg-slate-800 rounded-full p-2 shadow-lg">
                          <ImageIcon className="w-5 h-5 text-rose-500" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="relative">
                <div className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4 -mx-2 px-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  {savedDesigns.slice(0, 3).map((design) => (
                    <motion.div
                      key={design.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="group relative cursor-pointer flex-shrink-0 w-32 h-32 snap-start"
                      onClick={() => setSelectedDesign(design)}
                    >
                      <div className="w-full h-full rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700 border-2 border-transparent group-hover:border-rose-400 transition-all active:scale-95 shadow-md">
                        <img
                          src={design.image_url}
                          alt={design.prompt || 'Saved design'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-active:bg-black/10 transition-colors rounded-xl" />
                    </motion.div>
                  ))}
                  
                  {savedDesigns.length > 3 && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={() => setShowAllDesigns(true)}
                      className="flex-shrink-0 w-32 h-32 snap-start rounded-xl border-2 border-dashed border-rose-300 dark:border-rose-800/50 flex flex-col items-center justify-center gap-2 hover:border-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all active:scale-95"
                    >
                      <ChevronRight className="w-6 h-6 text-rose-400" />
                      <span className="text-xs text-[var(--text-secondary)] font-medium">
                        +{savedDesigns.length - 3} more
                      </span>
                    </motion.button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer Links */}
          <div className={`rounded-3xl p-8 shadow-xl ${isPremiumActive ? 'bg-[#1e1e1e] border-2 border-amber-500/60' : 'bg-[var(--card-bg)] border border-[var(--card-border)]'}`}>
            <h2 className={`text-2xl font-semibold mb-6 ${isPremiumActive ? 'text-amber-400' : 'text-[var(--text-primary)]'}`}>
              Information & Support
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className={`text-lg font-semibold mb-3 ${isPremiumActive ? 'text-white' : 'text-[var(--text-primary)]'}`}>About</h3>
                <Link to={createPageUrl('About')}>
                  <Button variant="outline" className="w-full justify-start mb-3">
                    <Sparkles className="w-4 h-4 mr-2" />
                    About the App
                  </Button>
                </Link>
              </div>

              <div>
                <h3 className={`text-lg font-semibold mb-3 ${isPremiumActive ? 'text-white' : 'text-[var(--text-primary)]'}`}>Legal</h3>
                <Link
                  to={createPageUrl('TermsOfService')}
                  className="block text-rose-500 hover:text-rose-600 transition-colors mb-2 font-medium"
                >
                  Agreement Summary
                </Link>
                <a
                  href={privacyPolicyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-rose-500 hover:text-rose-600 transition-colors mb-2 font-medium"
                >
                  Privacy Policy
                </a>
                <a
                  href={termsOfServiceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-rose-500 hover:text-rose-600 transition-colors mb-2 font-medium"
                >
                  Terms & Conditions
                </a>
              </div>

              <div>
                <h3 className={`text-lg font-semibold mb-3 ${isPremiumActive ? 'text-white' : 'text-[var(--text-primary)]'}`}>Contact</h3>
                <a 
                  href="mailto:dkadristailoringservice@gmail.com"
                  className={`block transition-colors mb-2 ${isPremiumActive ? 'text-amber-300/80 hover:text-amber-300' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                >
                  dkadristailoringservice@gmail.com
                </a>
              </div>

              <div>
                <h3 className={`text-lg font-semibold mb-3 ${isPremiumActive ? 'text-white' : 'text-[var(--text-primary)]'}`}>Follow Us</h3>
                <div className="flex items-center gap-4">
                  <a 
                    href="https://www.instagram.com/dkadris_tailoring?igsh=MW1jM2xud2Y1YW1xdw=="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-rose-500 hover:text-rose-600 transition-colors font-medium"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    Instagram
                  </a>
                  <a 
                    href="https://www.youtube.com/@TailorixAi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-rose-500 hover:text-rose-600 transition-colors font-medium"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    YouTube
                  </a>
                </div>
              </div>
            </div>

            <div className={`text-center text-sm mt-8 pt-6 border-t ${isPremiumActive ? 'text-amber-300/50 border-amber-500/30' : 'text-[var(--text-tertiary)] border-[var(--border-primary)]'}`}>
              © 2026 Tailorix AI. All rights reserved.
            </div>

            {/* Version number — tap 5× for dev override */}
            <div className="flex items-center justify-center gap-1.5 mt-4">
              <button
                onClick={handleVersionTap}
                className="text-xs text-slate-500 select-none focus:outline-none"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                Version 1.0.1
              </button>
              {isProductionOverride && (
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block" title="Production Override Active" />
              )}
            </div>
          </div>
        </motion.div>

        {/* Image Lightbox Modal */}
        <Dialog open={!!selectedDesign && !showDeleteConfirm} onOpenChange={(open) => !open && setSelectedDesign(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Saved Design</DialogTitle>
            </DialogHeader>
            {selectedDesign && (
              <div className="space-y-4">
                <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-4">
                  <img
                    src={selectedDesign.image_url}
                    alt={selectedDesign.prompt || 'Design'}
                    className="w-full h-auto max-h-[60vh] object-contain rounded-xl"
                  />
                </div>
                {selectedDesign.prompt && (
                  <div>
                    <Label className="text-[var(--text-secondary)]">Prompt</Label>
                    <p className="text-[var(--text-primary)] mt-1">{selectedDesign.prompt}</p>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm text-[var(--text-secondary)]">
                  <span>{selectedDesign.design_type || 'Design'}</span>
                  <span>{new Date(selectedDesign.created_date).toLocaleString()}</span>
                </div>
              </div>
            )}
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setSelectedDesign(null)}
              >
                <X className="w-4 h-4 mr-2" />
                Close
              </Button>
              <Button
                variant="destructive"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Design?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this image? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteDesign}
                disabled={deleting}
                className="bg-red-500 hover:bg-red-600"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Developer Override Password Dialog */}
        <Dialog open={showDevPassword} onOpenChange={setShowDevPassword}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-[var(--text-primary)]">🔐 Developer Mode</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <p className="text-sm text-[var(--text-secondary)]">
                {isProductionOverride
                  ? 'Override is currently ACTIVE. Enter password to deactivate.'
                  : 'Enter password to activate Production Override.'}
              </p>
              <Input
                type="password"
                placeholder="Enter password"
                value={devPassword}
                onChange={(e) => { setDevPassword(e.target.value); setDevPasswordError(false); }}
                onKeyDown={(e) => e.key === 'Enter' && handleDevPasswordSubmit()}
                className={devPasswordError ? 'border-red-500' : ''}
                autoFocus
              />
              {devPasswordError && (
                <p className="text-xs text-red-500">Incorrect password.</p>
              )}
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setShowDevPassword(false)}>Cancel</Button>
              <Button onClick={handleDevPasswordSubmit} className="bg-rose-500 hover:bg-rose-600 text-white border-none">
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Account Confirmation Dialog */}
        <AlertDialog open={showDeleteAccountDialog} onOpenChange={setShowDeleteAccountDialog}>
          <AlertDialogContent className="bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-red-900 dark:text-red-100">⚠️ Delete Account Permanently?</AlertDialogTitle>
              <AlertDialogDescription className="text-red-800 dark:text-red-200">
                This action is <strong>irreversible</strong>. All your saved designs, progress, and account data will be permanently deleted. You will be logged out immediately.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deletingAccount} className="border-slate-300">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteAccount}
                disabled={deletingAccount}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {deletingAccount ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Yes, Delete My Account'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}