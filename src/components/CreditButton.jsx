import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Crown } from 'lucide-react';
import AdWatchModal from './AdWatchModal';
import UpgradeModal from './UpgradeModal';
import { toast } from 'sonner';

/**
 * CreditButton - Drop-in component to handle Watch Ad / Go Premium visibility logic.
 * Usage: place wherever you need to prompt free users to earn credits.
 *
 * Props:
 *  - featureType: 'analysis' | 'illustrator' | 'solver' | 'visualizer'
 *  - showWatchAd: boolean from useCreditSystem()
 *  - showGoPremium: boolean from useCreditSystem()
 *  - onAdReward: async function from useCreditSystem()
 *  - className: optional extra classes
 */
export default function CreditButton({ featureType, showWatchAd, showGoPremium, onAdReward, className = '' }) {
  const [showAdModal, setShowAdModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleAdComplete = async () => {
    const result = await onAdReward();
    if (result?.success) {
      setShowAdModal(false);
      toast.success('You earned +1 credit!');
    }
    return result;
  };

  if (!showWatchAd && !showGoPremium) return null;

  return (
    <>
      {showWatchAd && (
        <Button
          onClick={() => setShowAdModal(true)}
          className={`bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white gap-2 ${className}`}
        >
          <Play className="w-4 h-4" />
          Watch Ad for 1 Credit
        </Button>
      )}

      {showGoPremium && (
        <Button
          onClick={() => setShowUpgradeModal(true)}
          className={`bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-900 font-semibold gap-2 ${className}`}
        >
          <Crown className="w-4 h-4" />
          Go Premium
        </Button>
      )}

      <AdWatchModal
        isOpen={showAdModal}
        onClose={() => setShowAdModal(false)}
        onReward={handleAdComplete}
        featureType={featureType}
      />

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        reason="daily_limit"
      />
    </>
  );
}