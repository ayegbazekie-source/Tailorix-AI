import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Policy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--gradient-start)] via-[var(--gradient-middle)] to-[var(--gradient-end)] transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Back Button */}
        <Button variant="ghost" className="mb-6 text-[var(--text-secondary)] -ml-4" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Header */}
        <div className="bg-[var(--card-bg)] rounded-3xl p-8 md:p-12 shadow-lg border border-[var(--card-border)]">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-8 text-center">
            Tailorix AI Terms & Privacy
          </h1>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <div className="bg-[var(--bg-tertiary)] rounded-2xl p-6 mb-6">
              <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">
                Welcome to Tailorix AI!
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                Tailorix AI is your AI-powered tailoring and fashion assistant. We're committed to providing 
                you with professional tools while maintaining transparency about our services and your data.
              </p>
            </div>

            <div className="space-y-6">
              <div className="border-l-4 border-rose-500 pl-6 py-2">
                <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                  7-Day Free Trial
                </h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  Every new user receives a <strong>7-day free trial</strong> with full access to all features — AI design generation, garment analysis, problem solver, fabric visualizer, and more. No credit card required to start your trial.
                </p>
              </div>

              <div className="border-l-4 border-emerald-500 pl-6 py-2">
                <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                  Always Free: Tailorix AI Chat
                </h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  The <strong>Tailorix AI Chat</strong> is the only feature that is permanently free for all users — no trial expiry, no subscription needed. Ask unlimited tailoring and sewing questions anytime.
                </p>
              </div>

              <div className="border-l-4 border-violet-500 pl-6 py-2">
                <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                  Pro Subscription — $10/month
                </h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  After your trial ends, upgrade to <strong>Tailorix AI Pro</strong> for $10/month to regain unlimited access to all features — AI design generation, garment analysis, problem solver, all Fabric Visualizer templates, team workspaces, and priority support.
                </p>
              </div>

              <div className="border-l-4 border-amber-500 pl-6 py-2">
                <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                  Your Data & Privacy
                </h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  We use your uploaded images <strong>only to generate your fashion illustrations</strong>. 
                  Your images are not stored permanently, shared with third parties, or used for any purpose 
                  other than providing you with the requested service. We respect your privacy and creative work.
                </p>
              </div>
            </div>

            <div className="mt-8 p-6 bg-slate-100 dark:bg-slate-800 rounded-2xl">
              <p className="text-sm text-[var(--text-secondary)] text-center">
                By using Tailorix AI, you agree to these terms. If you have questions or concerns, 
                please contact our support team.
              </p>
              <p className="text-xs text-[var(--text-tertiary)] text-center mt-2">
                Last updated: March 2026
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}