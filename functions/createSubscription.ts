import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId, email, amount, currency } = await req.json();

    // Validate inputs
    if (!userId || !email || !amount || !currency) {
      return Response.json({ error: 'userId, email, amount, and currency are required' }, { status: 400 });
    }

    // Validate currency
    const validCurrency = currency === 'USD' ? 'USD' : 'NGN';

    // Convert amount to smallest subunit (kobo for NGN, cents for USD)
    const amountInSubunit = Math.round(amount * 100);

    const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY');

    if (!paystackSecretKey) {
      return Response.json({ error: 'Paystack configuration missing' }, { status: 500 });
    }

    // Initialize transaction with Paystack
    const callbackUrl = 'https://sewsimple-app.base44.app/';

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${paystackSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        amount: amountInSubunit,
        currency: validCurrency,
        metadata: {
          userId: userId,
          subscription_type: 'pro',
          plan: 'Tailorix AI Pro',
          product_name: 'Tailorix AI Pro',
          app_name: 'Tailorix AI',
          currency: validCurrency
        },
        callback_url: callbackUrl
      })
    });

    const data = await response.json();

    if (!data.status) {
      return Response.json({ error: data.message || 'Failed to initialize subscription' }, { status: 400 });
    }

    return Response.json({
      authorization_url: data.data.authorization_url,
      access_code: data.data.access_code,
      reference: data.data.reference
    });

  } catch (error) {
    console.error('Subscription creation error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});