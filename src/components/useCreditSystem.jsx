import { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { usePremium } from '@/components/PremiumProvider';

const CREDIT_FIELD_MAP = {
  analysis: 'analysis_credits',
  illustrator: 'illustrator_credits',
  solver: 'solver_credits',
  visualizer: 'visualizer_credits'
};

export function useCreditSystem(featureType) {
  const { user, isPremiumActive } = usePremium();
  const [credits, setCredits] = useState(null);
  const [dailyAdsWatched, setDailyAdsWatched] = useState(0);
  const [loading, setLoading] = useState(true);

  const creditField = CREDIT_FIELD_MAP[featureType];

  const refresh = useCallback(async () => {
    if (!user) return;

    if (isPremiumActive) {
      setCredits(Infinity);
      setDailyAdsWatched(0);
      setLoading(false);
      return;
    }

    try {
      // Triggers auto-reset logic (30d credits, 24h ad counter)
      await base44.functions.invoke('checkAndResetCredits', {});
      const freshUser = await base44.auth.me();

      setCredits(freshUser[creditField] ?? 0);

      const lastRewardDate = freshUser.last_reward_date ? new Date(freshUser.last_reward_date) : null;
      const hoursSince = lastRewardDate ? (Date.now() - lastRewardDate.getTime()) / (1000 * 60 * 60) : 999;
      setDailyAdsWatched(hoursSince >= 24 ? 0 : (freshUser.rewarded_ads_watched_today || 0));
    } catch (e) {
      console.error('Credit system error:', e);
    }
    setLoading(false);
  }, [user, isPremiumActive, creditField]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Visibility logic
  const showWatchAd = !isPremiumActive && credits === 0 && dailyAdsWatched < 5;
  const showGoPremium = !isPremiumActive && credits === 0 && dailyAdsWatched >= 5;
  const hasCredits = isPremiumActive || (credits !== null && credits > 0);

  const handleAdReward = async () => {
    const result = await base44.functions.invoke('rewardUserWithCredit', { feature_type: featureType });
    if (result.data?.success) {
      setCredits(result.data.newCredits);
      setDailyAdsWatched(result.data.adsWatchedToday);
    }
    return result.data;
  };

  const deductCredit = async () => {
    if (isPremiumActive) return { success: true, isPremium: true };
    const result = await base44.functions.invoke('deductCredit', { feature_type: featureType });
    if (result.data?.success) {
      setCredits(result.data.remainingCredits);
    }
    return result.data;
  };

  return {
    credits,
    dailyAdsWatched,
    loading,
    showWatchAd,
    showGoPremium,
    hasCredits,
    handleAdReward,
    deductCredit,
    refresh,
    isPremium: isPremiumActive
  };
}