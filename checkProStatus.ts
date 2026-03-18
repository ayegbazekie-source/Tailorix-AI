import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isPro = user.isPro || false;
    const proExpiresAt = user.proExpiresAt;

    // Check if Pro subscription has expired
    if (isPro && proExpiresAt) {
      const expiryDate = new Date(proExpiresAt);
      const now = new Date();

      if (now > expiryDate) {
        // Pro subscription expired, update user
        await base44.auth.updateMe({
          isPro: false,
          proExpiresAt: null
        });

        return Response.json({
          isPro: false,
          message: 'Pro subscription has expired'
        });
      }
    }

    return Response.json({
      isPro: isPro,
      proExpiresAt: proExpiresAt
    });

  } catch (error) {
    console.error('Check Pro status error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});