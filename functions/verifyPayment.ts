import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { reference } = await req.json();

    if (!reference) {
      return Response.json({ error: 'Payment reference is required' }, { status: 400 });
    }

    const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY');

    if (!paystackSecretKey) {
      return Response.json({ error: 'Paystack configuration missing' }, { status: 500 });
    }

    // Verify transaction with Paystack
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${paystackSecretKey}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!data.status || data.data.status !== 'success') {
      console.error('Paystack verification failed:', data);
      return Response.json({ success: false, message: data.message || 'Payment verification failed' }, { status: 400 });
    }

    // Payment is successful, update user's Pro status
    const proExpiresAt = new Date();
    proExpiresAt.setDate(proExpiresAt.getDate() + 30);

    await base44.auth.updateMe({
      isPro: true,
      is_premium: true,
      subscriptionStatus: 'active',
      proExpiresAt: proExpiresAt.toISOString()
    });

    return Response.json({ success: true, message: 'Payment verified and Pro status activated' });

  } catch (error) {
    console.error('Subscription verification error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});