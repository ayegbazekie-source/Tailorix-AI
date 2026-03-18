import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const isProduction = Deno.env.get('IS_PRODUCTION') === 'true';

    return Response.json({
      isProduction,
      paystackPublicKey: isProduction
        ? (Deno.env.get('PAYSTACK_PUBLIC_KEY') || '')
        : 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});