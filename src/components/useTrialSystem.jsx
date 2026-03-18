/**
 * useTrialSystem — centralized trial/premium logic.
 *
 * Trial start date is stored on the user's server-side profile (trialStartDate field)
 * so it cannot be reset by clearing localStorage.
 *
 * Rules:
 *  - If isPro === true  → premium forever, all features unlocked.
 *  - If trialStartDate is null → first use: set it now, unlock everything for 7 days.
 *  - If days since trialStartDate < 7 → trial active, all features unlocked.
 *  - If days since trialStartDate >= 7 → trial expired, standard restrictions apply.
 */

import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

export function useTrialSystem() {
  const [isPremium, setIsPremium] = useState(false);
  const [isTrialActive, setIsTrialActive] = useState(false);
  const [trialDaysLeft, setTrialDaysLeft] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initTrial();
  }, []);

  const initTrial = async () => {
    try {
      const user = await base44.auth.me();

      // Premium users bypass everything
      if (user.isPro === true) {
        setIsPremium(true);
        setIsTrialActive(false);
        setTrialDaysLeft(0);
        setLoading(false);
        return;
      }

      const now = new Date();

      // Set trial start date if this is the user's first session
      if (!user.trialStartDate) {
        await base44.auth.updateMe({ trialStartDate: now.toISOString() });
        setIsTrialActive(true);
        setTrialDaysLeft(7);
        setLoading(false);
        return;
      }

      const start = new Date(user.trialStartDate);
      const daysPassed = Math.floor((now - start) / (1000 * 60 * 60 * 24));
      const daysLeft = Math.max(0, 7 - daysPassed);

      setIsTrialActive(daysLeft > 0);
      setTrialDaysLeft(daysLeft);
    } catch (e) {
      console.error('Trial system error:', e);
    }
    setLoading(false);
  };

  // True when user has full access (either premium or in trial)
  const hasFullAccess = isPremium || isTrialActive;

  return { isPremium, isTrialActive, trialDaysLeft, hasFullAccess, loading };
}