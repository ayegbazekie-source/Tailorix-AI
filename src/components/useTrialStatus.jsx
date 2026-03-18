import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

const TRIAL_DAYS = 7;

/**
 * Central trial logic.
 * trialStartDate is stored on the USER record (server-side) so it cannot be
 * reset by clearing localStorage or reinstalling the app.
 *
 * Returns:
 *   trialActive      — true if within the 7-day window
 *   trialExpired     — true if trial window has closed
 *   daysRemaining    — integer 0-7
 *   isPremium        — true if isPro=true (overrides everything)
 *   hasFullAccess    — trialActive || isPremium
 */
export function useTrialStatus() {
  const [status, setStatus] = useState({
    trialActive: false,
    trialExpired: false,
    daysRemaining: 0,
    isPremium: false,
    hasFullAccess: false,
    loading: true,
  });

  useEffect(() => {
    initTrial();
  }, []);

  const initTrial = async () => {
    try {
      const user = await base44.auth.me();
      const isPremium = user?.isPro === true;

      let trialStartDate = user?.trialStartDate;

      // If no trialStartDate yet, set it now (first login)
      if (!trialStartDate) {
        const now = new Date().toISOString();
        await base44.auth.updateMe({ trialStartDate: now });
        trialStartDate = now;
      }

      const start = new Date(trialStartDate);
      const now = new Date();
      const diffMs = now - start;
      const diffDays = diffMs / (1000 * 60 * 60 * 24);
      const daysRemaining = Math.max(0, Math.ceil(TRIAL_DAYS - diffDays));
      const trialActive = diffDays < TRIAL_DAYS;
      const trialExpired = !trialActive && !isPremium;

      setStatus({
        trialActive,
        trialExpired,
        daysRemaining,
        isPremium,
        hasFullAccess: trialActive || isPremium,
        loading: false,
      });
    } catch (e) {
      console.error('Trial status error:', e);
      setStatus(s => ({ ...s, loading: false }));
    }
  };

  return status;
}