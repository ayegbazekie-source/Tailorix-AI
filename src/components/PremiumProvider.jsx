import React, { createContext, useContext, useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

const TRIAL_DAYS = 7;
const PremiumContext = createContext(null);

export const usePremium = () => {
  const context = useContext(PremiumContext);
  if (!context) throw new Error('usePremium must be used within PremiumProvider');
  return context;
};

export default function PremiumProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPremiumActive, setIsPremiumActive] = useState(false);
  const [trialActive, setTrialActive] = useState(false);
  const [trialDaysRemaining, setTrialDaysRemaining] = useState(0);
  const [hasFullAccess, setHasFullAccess] = useState(false);

  useEffect(() => { loadUserState(); }, []);

  const loadUserState = async () => {
    try {
      let currentUser = await base44.auth.me();
      const isPremium = currentUser?.isPro === true;

      // Ensure trialStartDate is set server-side (permanent, can't be reset)
      let trialStartDate = currentUser?.trialStartDate;
      if (!trialStartDate) {
        const now = new Date().toISOString();
        await base44.auth.updateMe({ trialStartDate: now });
        currentUser = await base44.auth.me(); // refresh
        trialStartDate = currentUser?.trialStartDate || now;
      }

      const diffDays = (new Date() - new Date(trialStartDate)) / (1000 * 60 * 60 * 24);
      const daysLeft = Math.max(0, Math.ceil(TRIAL_DAYS - diffDays));
      const inTrial = diffDays < TRIAL_DAYS;
      const fullAccess = inTrial || isPremium;

      setUser(currentUser);
      setIsPremiumActive(isPremium);
      setTrialActive(inTrial);
      setTrialDaysRemaining(daysLeft);
      setHasFullAccess(fullAccess);

      // Apply theme
      if (isPremium) {
        document.documentElement.classList.add('pro-mode');
        document.documentElement.classList.remove('free-mode');
        document.body.setAttribute('data-premium', 'true');
      } else {
        document.documentElement.classList.remove('pro-mode');
        document.documentElement.classList.add('free-mode');
        document.body.setAttribute('data-premium', 'false');
      }

      window.__PREMIUM_ACTIVE__ = isPremium;
      window.__CURRENT_USER__ = currentUser;
      window.__TRIAL_ACTIVE__ = inTrial;

    } catch (error) {
      console.error('Failed to load user:', error);
      setUser(null);
      setIsPremiumActive(false);
      setTrialActive(false);
      setHasFullAccess(false);
      document.documentElement.classList.remove('pro-mode');
      window.__PREMIUM_ACTIVE__ = false;
    }
    setLoading(false);
  };

  const refreshPremiumStatus = async () => { await loadUserState(); };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-2">Tailorix AI</h2>
          <p className="text-slate-400">Loading your experience...</p>
        </div>
      </div>
    );
  }

  return (
    <PremiumContext.Provider value={{
      user,
      isPremiumActive,
      trialActive,
      trialDaysRemaining,
      hasFullAccess,
      refreshPremiumStatus,
    }}>
      {children}
    </PremiumContext.Provider>
  );
}