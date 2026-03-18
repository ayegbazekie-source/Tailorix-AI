import { createClient } from 'npm:@base44/sdk@0.8.6';
import { createHmac } from "node:crypto";

Deno.serve(async (req) => {
  try {
    const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY');
    
    if (!paystackSecretKey) {
      return Response.json({ error: 'Paystack configuration missing' }, { status: 500 });
    }

    const appId = Deno.env.get("BASE44_APP_ID");
    if (!appId) {
      return Response.json({ error: "BASE44_APP_ID environment variable not found" }, { status: 500 });
    }

    // Verify webhook signature
    const paystackSignature = req.headers.get('x-paystack-signature');
    const body = await req.text();

    const hash = createHmac('sha512', paystackSecretKey)
      .update(body)
      .digest('hex');

    if (hash !== paystackSignature) {
      return Response.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(body);

    // Handle subscription events
    if (event.event === 'charge.success' || event.event === 'subscription.create') {
      const userId = event.data.metadata?.userId;

      if (!userId) {
        console.error('No userId in webhook metadata');
        return Response.json({ error: 'Missing userId' }, { status: 400 });
      }

      // Use service role to update user
      const base44 = createClient({
        appId: appId,
        asServiceRole: true,
      });

      // Calculate Pro expiry (30 days from now)
      const proExpiresAt = new Date();
      proExpiresAt.setDate(proExpiresAt.getDate() + 30);

      // Update user to Pro status
      await base44.entities.User.update(userId, {
        isPro: true,
        proExpiresAt: proExpiresAt.toISOString()
      });

      console.log(`User ${userId} upgraded to Pro until ${proExpiresAt}`);
    }

    // Handle subscription cancellation
    if (event.event === 'subscription.disable') {
      const userId = event.data.metadata?.userId;

      if (userId) {
        const base44 = createClient({
          appId: appId,
          asServiceRole: true,
        });

        await base44.entities.User.update(userId, {
          isPro: false,
          proExpiresAt: null
        });

        console.log(`User ${userId} Pro subscription cancelled`);
      }
    }

    return Response.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});