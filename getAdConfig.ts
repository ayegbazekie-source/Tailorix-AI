import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

// Test ad unit ID for rewarded ads (Google's official test ID - safe for dev)
const TEST_REWARDED_ID = 'ca-app-pub-3940256099942544/5224354917';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    // Allow frontend dev override (set via 5-tap version unlock on Profile page)
    const body = await req.json().catch(() => ({}));
    const productionOverride = body.productionOverride === true;

    const isProduction = productionOverride || Deno.env.get('IS_PRODUCTION') === 'true';
    const realAdUnitId = Deno.env.get('ADMOB_REWARDED_ID') || '';

    const adUnitId = isProduction ? realAdUnitId : TEST_REWARDED_ID;

    return Response.json({
      adUnitId,
      isProduction,
      testMode: !isProduction,
      admobAppId: Deno.env.get('ADMOB_APP_ID') || '',
      paystackPublicKey: isProduction ? (Deno.env.get('PAYSTACK_PUBLIC_KEY') || '') : 'pk_test_placeholder',
      adSensePublisherId: 'ca-pub-9053391149127134',
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});