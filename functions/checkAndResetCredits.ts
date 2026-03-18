import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Premium users have unlimited access - no resets needed
    let isPremium = user.isPro === true || user.is_premium === true;
    if (isPremium && user.premium_expiry_date) {
      const expiryDate = new Date(user.premium_expiry_date);
      if (new Date() > expiryDate) {
        isPremium = false;
        await base44.auth.updateMe({ is_premium: false });
      }
    }

    if (isPremium) {
      return Response.json({
        message: 'Premium user - unlimited access',
        credits: { analysis: 'unlimited', illustrator: 'unlimited', solver: 'unlimited', visualizer: 'unlimited' }
      });
    }

    const now = new Date();
    const updates = {};
    let creditsReset = false;
    let adsReset = false;

    // --- 30-day credit reset ---
    const lastResetDate = user.last_credit_reset_date ? new Date(user.last_credit_reset_date) : null;
    const daysSinceReset = lastResetDate
      ? Math.floor((now - lastResetDate) / (1000 * 60 * 60 * 24))
      : 999;

    if (!lastResetDate || daysSinceReset >= 30) {
      updates.analysis_credits = 3;
      updates.illustrator_credits = 3;
      updates.solver_credits = 3;
      updates.visualizer_credits = 3;
      updates.last_credit_reset_date = now.toISOString().split('T')[0];
      creditsReset = true;
    }

    // --- 24-hour daily ad counter reset ---
    const lastRewardDate = user.last_reward_date ? new Date(user.last_reward_date) : null;
    const hoursSinceLastReward = lastRewardDate
      ? (now.getTime() - lastRewardDate.getTime()) / (1000 * 60 * 60)
      : 999;

    if (hoursSinceLastReward >= 24 && (user.rewarded_ads_watched_today || 0) > 0) {
      updates.rewarded_ads_watched_today = 0;
      adsReset = true;
    }

    if (Object.keys(updates).length > 0) {
      await base44.auth.updateMe(updates);
    }

    const freshUser = await base44.auth.me();
    const currentDailyAds = hoursSinceLastReward >= 24 ? 0 : (freshUser.rewarded_ads_watched_today || 0);

    return Response.json({
      message: creditsReset ? 'Credits reset (30-day cycle)' : 'Credits checked',
      creditsReset,
      adsReset,
      adsWatchedToday: currentDailyAds,
      credits: {
        analysis: freshUser.analysis_credits ?? 0,
        illustrator: freshUser.illustrator_credits ?? 0,
        solver: freshUser.solver_credits ?? 0,
        visualizer: freshUser.visualizer_credits ?? 0
      }
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});