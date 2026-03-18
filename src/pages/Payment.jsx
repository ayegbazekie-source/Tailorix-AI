import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { usePremium } from '@/components/PremiumProvider';
import { ArrowLeft, Crown, Check, Loader2, Sparkles, BadgeCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

const USD_PRICE = { label: '$10/month', amount: 1000, currency: 'USD' };

export default function Payment() {
  const navigate = useNavigate();
  const { isPremiumActive, refreshPremiumStatus } = usePremium();
  const [processing, setProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [paystackKey, setPaystackKey] = useState('');
  const [isProduction, setIsProduction] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => { initPayment(); }, []);

  const initPayment = async () => {
    try {
      const [configRes, user] = await Promise.all([
        base44.functions.invoke('getPaymentConfig', {}),
        base44.auth.me(),
      ]);
      setIsProduction(configRes.data?.isProduction === true);
      setPaystackKey(configRes.data?.paystackPublicKey || '');
      setUserEmail(user?.email || '');
    } catch (e) {
      console.error('Payment init error:', e);
    }
  };

  const handleSubscribe = async () => {
    setProcessing(true);

    if (isProduction && paystackKey) {
      const script = document.getElementById('paystack-inline-script') ||
        (() => {
          const s = document.createElement('script');
          s.id = 'paystack-inline-script';
          s.src = 'https://js.paystack.co/v1/inline.js';
          document.body.appendChild(s);
          return s;
        })();

      const initPaystack = () => {
        const handler = window.PaystackPop.setup({
          key: paystackKey,
          email: userEmail,
          amount: USD_PRICE.amount,
          currency: USD_PRICE.currency,
          ref: `tailorix_${Date.now()}`,
          onSuccess: async (transaction) => {
            try {
              const res = await base44.functions.invoke('verifyPayment', { reference: transaction.reference });
              if (res.data?.success) {
                await refreshPremiumStatus();
                setShowSuccessModal(true);
                setTimeout(() => navigate(createPageUrl('FreeHome'), { replace: true }), 3000);
              }
            } catch (e) {
              console.error('Verify error:', e);
            }
            setProcessing(false);
          },
          onCancel: () => setProcessing(false),
        });
        handler.openIframe();
      };

      if (window.PaystackPop) {
        initPaystack();
      } else {
        script.onload = initPaystack;
      }
    } else {
      // Dev: simulate grant
      await new Promise(r => setTimeout(r, 1500));
      await base44.auth.updateMe({ isPro: true, is_premium: true });
      await refreshPremiumStatus();
      setShowSuccessModal(true);
      setTimeout(() => navigate(createPageUrl('FreeHome'), { replace: true }), 3000);
      setProcessing(false);
    }
  };

  const benefits = [
    'Unlimited Garment Analysis',
    'Unlimited AI Design Generation',
    'Modify & Convert Style Features',
    'Share Designs with Team',
    'Real-time Collaboration',
    'Version History & Restore',
    'All Fabric Visualizer Templates',
    'Save Images to Gallery',
    'Premium Gold UI Experience',
    'Priority Support',
    'Lifetime Access',
  ];

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link to={createPageUrl(isPremiumActive ? 'PremiumHome' : 'FreeHome')}>
          <Button variant="ghost" className="mb-6 text-slate-400 hover:text-white -ml-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-[#D4AF37] to-yellow-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-yellow-500/20">
            <Crown className="w-12 h-12 text-[#121212]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Upgrade to <span className="text-[#D4AF37]">Pro</span>
          </h1>
          <p className="text-xl text-slate-400">
            Unlock unlimited access to every feature — forever
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Benefits */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <div className="bg-[#1e1e1e] rounded-3xl p-8 border border-[#D4AF37]/30 h-full">
              <h2 className="text-2xl font-bold text-[#D4AF37] mb-6">What You Get</h2>
              <div className="space-y-4">
                {benefits.map((benefit, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-7 h-7 bg-[#D4AF37] rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-[#121212]" />
                    </div>
                    <span className="text-slate-200">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Payment Panel */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <div className="bg-[#1e1e1e] rounded-3xl p-8 border border-[#D4AF37]/30 flex flex-col gap-6">
              {/* Product Card */}
              <div className="p-6 bg-gradient-to-br from-[#D4AF37]/10 to-yellow-900/10 rounded-2xl border-2 border-[#D4AF37]/40 text-center">
                <Crown className="w-12 h-12 mx-auto mb-3 text-[#D4AF37]" />
                <h3 className="text-xl font-bold text-white mb-1">Tailorix AI Pro</h3>
                <div className="text-3xl font-black text-[#D4AF37] mt-2">$10<span className="text-base font-normal text-slate-400">/month</span></div>
                <p className="text-sm text-slate-400 mt-1">Lifetime access once paid</p>
              </div>

              {!isPremiumActive ? (
                <>
                  <Button
                    onClick={handleSubscribe}
                    disabled={processing}
                    className="w-full bg-[#D4AF37] hover:bg-yellow-400 text-[#121212] rounded-xl py-6 text-lg font-black shadow-lg shadow-yellow-500/20"
                  >
                    {processing ? (
                      <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Processing...</>
                    ) : (
                      <><Crown className="w-5 h-5 mr-2" />Upgrade to Pro — $10/month</>
                    )}
                  </Button>
                  <p className="text-xs text-center text-slate-500">
                    🔒 Secured by Paystack · USD · Cancel anytime
                  </p>
                </>
              ) : (
                <div className="flex items-center justify-center gap-3 py-4 px-6 bg-[#D4AF37]/10 border-2 border-[#D4AF37] rounded-2xl">
                  <BadgeCheck className="w-7 h-7 text-[#D4AF37]" />
                  <div>
                    <div className="font-bold text-[#D4AF37] text-lg">Premium Active</div>
                    <div className="text-xs text-slate-400">You have unlimited access</div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <div className="flex items-center justify-center gap-6 text-slate-500">
            <div className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-[#D4AF37]" /><span className="text-sm">Lifetime Access</span></div>
            <div className="flex items-center gap-2"><Check className="w-4 h-4 text-[#D4AF37]" /><span className="text-sm">Instant Activation</span></div>
            <div className="flex items-center gap-2"><Crown className="w-4 h-4 text-[#D4AF37]" /><span className="text-sm">All Features</span></div>
          </div>
        </motion.div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', bounce: 0.4 }}
              className="bg-[#1e1e1e] rounded-3xl p-10 max-w-sm w-full text-center border-2 border-[#D4AF37]/50 shadow-2xl"
            >
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="w-24 h-24 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Crown className="w-12 h-12 text-[#121212]" />
              </motion.div>
              <h2 className="text-3xl font-bold text-white mb-3">
                🎉 Welcome to<br />
                <span className="text-[#D4AF37]">Tailorix AI Pro!</span>
              </h2>
              <p className="text-slate-400 mb-6">Your premium access is now active.</p>
              <div className="flex justify-center gap-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-[#D4AF37] rounded-full"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1, delay: i * 0.3 }}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}