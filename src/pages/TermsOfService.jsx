import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLegalUrls } from '@/components/useLegalUrls';

export default function TermsOfService() {
  const navigate = useNavigate();
  const [accepting, setAccepting] = useState(false);
  const { privacyPolicyUrl } = useLegalUrls();

  const handleAccept = async () => {
    setAccepting(true);
    try {
      await base44.auth.updateMe({ terms_accepted: true });
      navigate(createPageUrl('Home'));
    } catch (error) {
      console.error('Error accepting terms:', error);
      setAccepting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full"
      >
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 dark:bg-rose-900/30 rounded-full text-rose-600 dark:text-rose-400 text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Welcome to Tailorix AI
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
              Do You Agree?
            </h1>
            <p className="text-slate-600 dark:text-slate-300">
              Please review our terms before continuing
            </p>
          </div>

          {/* Terms Summary */}
          <div className="space-y-4 mb-8">
            <div className="bg-rose-50 dark:bg-rose-900/20 rounded-2xl p-6 border-l-4 border-rose-500">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-rose-500" />
                7-Day Free Trial
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Every new user gets a <strong>7-day free trial</strong> with full access to all features — including AI design generation, garment analysis, problem solver, and all Fabric Visualizer templates.
              </p>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-6 border-l-4 border-emerald-500">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                Always Free: Tailorix AI Chat
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                The <strong>Tailorix AI Chat</strong> is completely free forever — no trial, no subscription required. Ask unlimited tailoring questions anytime.
              </p>
            </div>

            <div className="bg-violet-50 dark:bg-violet-900/20 rounded-2xl p-6 border-l-4 border-violet-500">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-violet-500" />
                Pro Subscription — $10/month
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Upgrade to <strong>Tailorix AI Pro</strong> for unlimited access to all features after your trial ends — AI design generation, garment analysis, problem solver, all Fabric Visualizer templates, and team collaboration.
              </p>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-6 border-l-4 border-amber-500">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-amber-500" />
                Your Privacy
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Your uploaded images are used <strong>only for generating illustrations</strong>. They are not stored permanently or shared with third parties.
              </p>
            </div>
          </div>

          {/* Accept Button */}
          <Button
            size="lg"
            onClick={handleAccept}
            disabled={accepting}
            className="w-full bg-rose-500 hover:bg-rose-600 text-white py-6 text-lg rounded-2xl shadow-lg"
          >
            {accepting ? 'Processing...' : 'I Accept & Continue'}
          </Button>

          <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-4">
            By clicking "I Accept & Continue", you agree to our Terms of Service and Privacy Policy
          </p>
          <p className="text-xs text-center mt-3">
            <a
              href={privacyPolicyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-rose-500 hover:text-rose-600 underline underline-offset-2 font-medium"
            >
              View Full Legal Documents
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}