import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { feature_type } = await req.json();

    // Check if premium
    if (user.is_premium) {
      const expiryDate = new Date(user.premium_expiry_date);
      const today = new Date();
      if (today <= expiryDate) {
        return Response.json({ 
          success: true, 
          message: 'Premium user - no credit deduction',
          isPremium: true
        });
      }
    }

    // Map feature types to credit fields
    const creditFields = {
      'analysis': 'analysis_credits',
      'illustrator': 'illustrator_credits',
      'solver': 'solver_credits',
      'visualizer': 'visualizer_credits'
    };

    const creditField = creditFields[feature_type];
    if (!creditField) {
      return Response.json({ error: 'Invalid feature type' }, { status: 400 });
    }

    const currentCredits = user[creditField] || 0;

    if (currentCredits <= 0) {
      return Response.json({ 
        success: false, 
        error: 'Insufficient credits',
        remainingCredits: 0
      }, { status: 403 });
    }

    // Deduct 1 credit
    const newCredits = currentCredits - 1;
    await base44.auth.updateMe({ [creditField]: newCredits });

    return Response.json({ 
      success: true,
      remainingCredits: newCredits,
      message: `Credit deducted. ${newCredits} credits remaining.`
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});