import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Google Play Billing Integration
 *
 * IS_PRODUCTION = 'false' → DEV MODE: simulates a successful purchase
 * IS_PRODUCTION = 'true'  → PROD MODE: verifies purchaseToken with Google Play Developer API
 *
 * Frontend flow (prod):
 *  1. Native Android app launches Google Play Billing dialog
 *  2. On success, app sends { purchaseToken, productId } to this endpoint
 *  3. This endpoint verifies with Google Play and grants isPro = true
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const isProduction = Deno.env.get('IS_PRODUCTION') === 'true';
    const googlePlaySubId = Deno.env.get('GOOGLE_PLAY_SUB_ID') || '';

    // --- DEV / SIMULATION MODE ---
    if (!isProduction) {
      const premiumExpiry = new Date();
      premiumExpiry.setDate(premiumExpiry.getDate() + 30);

      await base44.auth.updateMe({
        isPro: true,
        is_premium: true,
        premium_expiry_date: premiumExpiry.toISOString().split('T')[0],
        subscription_source: 'google_play_simulated',
        last_credit_reset_date: new Date().toISOString().split('T')[0]
      });

      return Response.json({
        success: true,
        mode: 'development',
        simulated: true,
        message: 'DEV: Simulated Google Play purchase. isPro set to true.',
        productId: googlePlaySubId || 'com.tailorix.pro.monthly'
      });
    }

    // --- PRODUCTION MODE: Verify with Google Play Developer API ---
    const body = await req.json().catch(() => ({}));
    const { purchaseToken, productId } = body;

    if (!purchaseToken || !productId) {
      return Response.json({
        error: 'purchaseToken and productId are required in production mode',
        hint: 'Pass these from the native Android Google Play Billing library callback'
      }, { status: 400 });
    }

    // NOTE: Google Play verification requires a service account key (GOOGLE_SERVICE_ACCOUNT_KEY).
    // Add this secret when your Play Console is ready.
    const serviceAccountKey = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_KEY');
    if (!serviceAccountKey) {
      return Response.json({
        error: 'GOOGLE_SERVICE_ACCOUNT_KEY secret not set. Add it in dashboard settings.',
        productId: googlePlaySubId
      }, { status: 500 });
    }

    // Parse service account for JWT auth
    const sa = JSON.parse(serviceAccountKey);
    const now = Math.floor(Date.now() / 1000);
    const jwtHeader = btoa(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
    const jwtPayload = btoa(JSON.stringify({
      iss: sa.client_email,
      scope: 'https://www.googleapis.com/auth/androidpublisher',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now
    }));

    // Exchange for access token
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: `${jwtHeader}.${jwtPayload}` // Note: full RS256 signing needed here in prod
      })
    });
    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      return Response.json({ error: 'Google auth failed', details: tokenData }, { status: 500 });
    }

    // Verify subscription purchase
    const packageName = 'com.tailorix.ai'; // Update with your real package name
    const verifyRes = await fetch(
      `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${packageName}/purchases/subscriptions/${productId}/tokens/${purchaseToken}`,
      { headers: { Authorization: `Bearer ${tokenData.access_token}` } }
    );
    const purchaseData = await verifyRes.json();

    if (!verifyRes.ok || purchaseData.error) {
      return Response.json({ success: false, error: 'Purchase verification failed', details: purchaseData }, { status: 400 });
    }

    // Valid purchase — grant premium
    const expiryMs = parseInt(purchaseData.expiryTimeMillis || 0);
    const premiumExpiry = expiryMs ? new Date(expiryMs).toISOString().split('T')[0] : null;

    await base44.auth.updateMe({
      isPro: true,
      is_premium: true,
      premium_expiry_date: premiumExpiry,
      subscription_source: 'google_play_verified',
      google_play_token: purchaseToken
    });

    return Response.json({
      success: true,
      mode: 'production',
      verified: true,
      expiresAt: premiumExpiry,
      message: 'Google Play subscription verified and activated.'
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});