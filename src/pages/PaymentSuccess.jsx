import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { usePremium } from '@/components/PremiumProvider';
import { CheckCircle, Loader2, XCircle, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const { refreshPremiumStatus } = usePremium();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    verifyPayment();
  }, []);

  const verifyPayment = async () => {
    try {
      const reference = new URLSearchParams(window.location.search).get('reference');
      
      if (!reference) {
        setSuccess(false);
        setLoading(false);
        return;
      }

      const { data } = await base44.functions.invoke('verifyPayment', { reference });

      if (data.success) {
        setSuccess(true);
        
        // CRITICAL: Refresh user data immediately
        await base44.auth.me();
        await refreshPremiumStatus();
        
        // FORCE REDIRECT: Use Base44 internal navigation
        setTimeout(() => {
          localStorage.removeItem('pro_activation_shown');
          navigate(createPageUrl('FabricVisualizer'), { replace: true });
        }, 2500);
      } else {
        setSuccess(false);
        setTimeout(() => {
          navigate(createPageUrl('Payment'), { replace: true });
        }, 3000);
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      setSuccess(false);
      setTimeout(() => {
        navigate(createPageUrl('Payment'), { replace: true });
      }, 3000);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto animate-pulse shadow-2xl">
              <Crown className="w-12 h-12 text-white" />
            </div>
            <Loader2 className="w-32 h-32 animate-spin text-amber-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Activating Tailorix AI Pro...</h1>
          <p className="text-amber-300 text-lg">Verifying your payment and setting up premium features</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-bounce">
            <Crown className="w-12 h-12 text-white" />
          </div>
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome to Tailorix AI Pro! 🎉
          </h1>
          <p className="text-xl text-amber-300 mb-8">
            Your premium subscription is now active. Redirecting to your premium dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="text-center max-w-md mx-auto p-8">
        <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-white mb-4">
          Payment Verification Failed
        </h1>
        <p className="text-amber-200 mb-8">
          We couldn't verify your payment. Please contact support or try again.
        </p>
        <p className="text-sm text-slate-400 mb-6">
          Redirecting to upgrade page...
        </p>
        <Button
          onClick={() => navigate(createPageUrl('Payment'), { replace: true })}
          className="bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 hover:from-amber-400 hover:to-yellow-400"
        >
          Return to Upgrade Page
        </Button>
      </div>
    </div>
  );
}