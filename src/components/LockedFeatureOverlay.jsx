import React from 'react';
import { Lock, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LockedFeatureOverlay({ onUpgradeClick }) {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-purple-900/30 to-slate-900/50 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
      <div className="text-center p-6">
        <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
          <Crown className="w-8 h-8 text-white" />
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 rounded-full mb-4">
          <Lock className="w-4 h-4 text-white" />
          <span className="text-sm font-semibold text-white">Premium Only</span>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">
          Unlock This Feature
        </h3>
        <p className="text-slate-200 mb-6 max-w-xs">
          Upgrade to Premium to access Modify & Convert styles with unlimited credits
        </p>
        <Button
          onClick={onUpgradeClick}
          className="bg-white text-slate-900 hover:bg-slate-100 rounded-xl shadow-lg"
        >
          <Crown className="w-4 h-4 mr-2" />
          Upgrade to Premium
        </Button>
      </div>
    </div>
  );
}