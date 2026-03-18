import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { usePremium } from '@/components/PremiumProvider';

export default function UpgradeModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { isPremiumActive } = usePremium();

  if (!isOpen || isPremiumActive) return null;

  const benefits = [
    'Unlimited Garment Analysis',
    'Unlimited AI Design Generation',
    'All Fabric Visualizer Templates',
    'Unlimited Problem Solving',
    'No Ads • Priority Support',
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl border-2 border-amber-500/40"
          onClick={(e) => e.stopPropagation()}
        >
          <Button variant="ghost" size="icon" onClick={onClose} className="absolute top-4 right-4 rounded-full text-amber-200/50">
            <X className="w-5 h-5" />
          </Button>

          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/30">
              <Crown className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Upgrade to Pro</h2>
            <p className="text-3xl font-extrabold text-amber-400 mt-2">$4.99<span className="text-base font-normal text-amber-200/60">/month</span></p>
          </div>

          <div className="space-y-2 mb-6">
            {benefits.map((b, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-3.5 h-3.5 text-black" />
                </div>
                <span className="text-sm text-amber-100/90">{b}</span>
              </div>
            ))}
          </div>

          <Button
            onClick={() => { onClose(); navigate(createPageUrl('Payment')); }}
            className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold rounded-xl py-6 text-lg shadow-lg shadow-amber-500/30"
          >
            <Crown className="w-5 h-5 mr-2" />
            Upgrade Now — $4.99/month
          </Button>
          <p className="text-xs text-center text-amber-200/30 mt-3">🔒 Secured by Paystack • Cancel anytime</p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}