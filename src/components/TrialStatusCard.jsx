import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Crown, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { usePremium } from '@/components/PremiumProvider';

/**
 * Shows trial countdown, trial-ended CTA, or is hidden for premium users.
 */
export default function TrialStatusCard() {
  const { isPremiumActive, trialActive, trialDaysRemaining } = usePremium();
  const navigate = useNavigate();

  // Premium users see nothing here
  if (isPremiumActive) return null;

  if (trialActive) {
    return (
      <div className="bg-[#1e1e1e] rounded-3xl p-6 border-2 border-[#D4AF37]/50 mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
            <Clock className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider">Free Trial</p>
            <p className="text-lg font-bold text-[#D4AF37]">
              {trialDaysRemaining} {trialDaysRemaining === 1 ? 'day' : 'days'} remaining
            </p>
          </div>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2 mb-3">
          <div
            className="bg-[#D4AF37] h-2 rounded-full transition-all"
            style={{ width: `${((7 - trialDaysRemaining) / 7) * 100}%` }}
          />
        </div>
        <p className="text-xs text-slate-500">
          Full access to all features. Upgrade before it ends to keep access.
        </p>
        <Button
          onClick={() => navigate(createPageUrl('Payment'))}
          className="mt-4 w-full bg-[#D4AF37] hover:bg-yellow-400 text-[#121212] font-bold border-none"
        >
          <Crown className="w-4 h-4 mr-2" />
          Upgrade to Pro — $10/month
        </Button>
      </div>
    );
  }

  // Trial expired
  return (
    <div className="bg-[#1e1e1e] rounded-3xl p-6 border-2 border-red-500/50 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-red-400" />
        </div>
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider">Free Trial</p>
          <p className="text-lg font-black text-red-400">Trial Ended</p>
        </div>
      </div>
      <p className="text-sm text-slate-400 mb-5">
        Your 7-day free access has expired. Upgrade to Pro to restore unlimited access to all features.
      </p>
      <Button
        onClick={() => navigate(createPageUrl('Payment'))}
        className="w-full bg-[#D4AF37] hover:bg-yellow-400 text-[#121212] font-black text-base py-5 border-none shadow-lg shadow-yellow-500/20"
      >
        <Crown className="w-5 h-5 mr-2" />
        Upgrade to Premium — $10/month
      </Button>
    </div>
  );
}