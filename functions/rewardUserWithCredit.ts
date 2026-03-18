import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { feature_type } = await req.json();

    // Premium override - no ads needed
    if (user.isPro === true || user.is_premium === true) {
      return Response.json({
        success: true,
        message: 'Premium user - unlimited credits',
        isPremium: true
      });
    }

    // Select correct AdMob Rewarded Ad ID based on IS_PRODUCTION flag
    const isProduction = Deno.env.get("IS_PRODUCTION") === 'true';
    const TEST_REWARDED_ID = 'ca-app-pub-3940256099942544/5224354917';
    const adUnitId = isProduction
      ? (Deno.env.get("ADMOB_REWARDED_ID") || '')
      : TEST_REWARDED_ID;

    // Use strict 24-hour window (not calendar day)
    const now = new Date();
    const lastRewardDate = user.last_reward_date ? new Date(user.last_reward_date) : null;
    const hoursSince = lastRewardDate
      ? (now.getTime() - lastRewardDate.getTime()) / (1000 * 60 * 60)
      : 999;

    const isOver24Hours = hoursSince >= 24;
    const adsWatchedToday = isOver24Hours ? 0 : (user.rewarded_ads_watched_today || 0);

    // Enforce daily ad limit (5 per 24h)
    if (adsWatchedToday >= 5) {
      return Response.json({
        success: false,
        error: 'Daily ad limit reached. Come back in 24 hours or go Premium.',
        adsWatchedToday,
        limit: 5,
        adUnitId
      }, { status: 403 });
    }

    // Map feature types to credit fields
    const creditFields = {
      analysis: 'analysis_credits',
      illustrator: 'illustrator_credits',
      solver: 'solver_credits',
      visualizer: 'visualizer_credits'
    };

    const creditField = creditFields[feature_type];
    if (!creditField) {
      return Response.json({ error: 'Invalid feature type' }, { status: 400 });
    }

    const currentCredits = user[creditField] || 0;
    const newCredits = currentCredits + 1;
    const newAdsWatched = adsWatchedToday + 1;

    await base44.auth.updateMe({
      [creditField]: newCredits,
      rewarded_ads_watched_today: newAdsWatched,
      last_reward_date: now.toISOString()
    });

    return Response.json({
      success: true,
      newCredits,
      adsWatchedToday: newAdsWatched,
      remainingAdSlots: 5 - newAdsWatched,
      adUnitId,
      message: `You earned +1 credit! (${newAdsWatched}/5 ads watched today)`
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});