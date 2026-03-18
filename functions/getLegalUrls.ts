import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    return Response.json({
      privacyPolicyUrl: Deno.env.get('PRIVACY_POLICY_URL') || '',
      termsOfServiceUrl: Deno.env.get('TERMS_OF_SERVICE_URL') || '',
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});