import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { 
  Sparkles,
  Camera,
  Wand2,
  HelpCircle,
  Shirt,
  CheckCircle2,
  ArrowRight,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

export default function Landing() {
  const navigate = useNavigate();
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  useEffect(() => {
    // Check for payment reference from Paystack redirect
    const urlParams = new URLSearchParams(window.location.search);
    const reference = urlParams.get('reference');
    
    if (reference) {
      verifyPaymentAndActivate(reference);
    }
  }, []);

  const verifyPaymentAndActivate = async (reference) => {
    try {
      const { data } = await base44.functions.invoke('verifyPayment', { reference });
      
      if (data.success) {
        // Redirect to success page
        window.location.href = '/#/PaymentSuccess';
      }
    } catch (error) {
      console.error('Payment verification failed:', error);
      // Redirect to home on error
      window.location.href = '/#/Home';
    }
  };

  const handleSignUp = () => {
    if (!agreedToTerms) return;
    navigate(createPageUrl('TermsOfService'));
  };

  const handleLogIn = () => {
    base44.auth.redirectToLogin(createPageUrl('Home'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697d0c21476d1c06f4d428ff/d87b8f481_TailorixAi.png"
                alt="Tailorix AI"
                className="w-10 h-10 rounded-xl object-cover"
              />
              <span className="text-xl font-semibold text-white">Tailorix AI</span>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={handleLogIn}
                className="text-slate-300 hover:text-white"
              >
                Log In
              </Button>
              <Button
                onClick={handleSignUp}
                disabled={!agreedToTerms}
                className="bg-rose-500 hover:bg-rose-600 text-white"
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500/10 rounded-full text-rose-400 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered Tailoring Intelligence
            </div>
            
            <h1 className="text-5xl md:text-7xl font-light text-white tracking-tight mb-6">
              Your Complete <br />
              <span className="font-semibold bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">
                Tailoring Assistant
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-300 font-light max-w-3xl mx-auto mb-8 leading-relaxed">
              Professional garment analysis, AI-powered design generation, fabric visualization, 
              and expert tailoring guidance—all in one intelligent platform.
            </p>

            {/* Terms Agreement Checkbox */}
            <div className="flex items-center justify-center gap-3 mb-8 bg-white dark:bg-slate-100 rounded-2xl p-6 max-w-md mx-auto border-2 border-rose-500 shadow-lg">
              <Checkbox 
                id="terms" 
                checked={agreedToTerms}
                onCheckedChange={setAgreedToTerms}
                className="border-slate-700 w-5 h-5"
              />
              <label 
                htmlFor="terms" 
                className="text-base font-medium text-slate-900 cursor-pointer"
              >
                I agree to the{' '}
                <Link 
                  to={createPageUrl('Policy')} 
                  className="text-rose-600 hover:text-rose-700 underline font-semibold"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms of Service
                </Link>
              </label>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={handleSignUp}
                disabled={!agreedToTerms}
                className="bg-rose-500 hover:bg-rose-600 text-white px-8 py-6 text-lg rounded-2xl shadow-xl shadow-rose-500/20 transition-all hover:shadow-2xl hover:shadow-rose-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleLogIn}
                className="border-2 border-slate-600 hover:border-slate-500 text-white px-8 py-6 text-lg rounded-2xl"
              >
                Log In
              </Button>
            </div>

            {!agreedToTerms && (
              <p className="text-xs text-slate-500 mt-2">
                Please agree to the Terms of Service to sign up
              </p>
            )}
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-20"
          >
            <FeatureCard
              icon={Camera}
              title="Professional Analysis"
              description="Upload garment photos for expert fitting diagnosis and precise alteration guidance"
              color="from-rose-500 to-pink-500"
            />
            <FeatureCard
              icon={Wand2}
              title="AI Fashion Illustrator"
              description="Generate, modify, and transform garment designs with artificial intelligence"
              color="from-violet-500 to-purple-500"
            />
            <FeatureCard
              icon={HelpCircle}
              title="Problem Solver"
              description="Get professional solutions for any fitting or construction challenges"
              color="from-amber-500 to-orange-500"
            />
            <FeatureCard
              icon={Shirt}
              title="Fabric Visualizer"
              description="Preview your fabric patterns on different garment templates in real-time"
              color="from-blue-500 to-cyan-500"
            />
            <FeatureCard
              iconUrl="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697d0c21476d1c06f4d428ff/169a0ecf8_TailorixChat.png"
              title="Tailorix AI Chat (100% Free)"
              description="Ask our AI assistant anything about tailoring—completely free for all users"
              color="from-emerald-500 to-green-500"
            />
            <FeatureCard
              icon={Star}
              title="Free & Premium"
              description="3 free AI generations monthly, watch ads for more, or go Premium for unlimited access"
              color="from-yellow-500 to-amber-500"
            />
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-20 text-center"
          >
            <div className="bg-slate-800/50 rounded-3xl p-12 border border-slate-700">
              <h2 className="text-3xl font-semibold text-white mb-4">
                Trusted by Tailors Worldwide
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto mb-8">
                From beginners learning their first stitch to master tailors running professional shops, 
                Tailorix AI provides intelligent assistance for every skill level.
              </p>
              <div className="flex justify-center gap-8 flex-wrap">
                <StatCard label="Active Users" value="10K+" />
                <StatCard label="Designs Generated" value="50K+" />
                <StatCard label="Success Rate" value="98%" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <Link 
            to={createPageUrl('Policy')}
            className="text-slate-400 hover:text-slate-300 text-sm"
          >
            Terms & Privacy Policy
          </Link>
          <p className="text-slate-500 text-sm mt-4">
            © 2026 Tailorix AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, iconUrl, title, description, color }) {
  return (
    <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 hover:border-slate-600 transition-all hover:-translate-y-1">
      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4`}>
        {iconUrl ? (
          <img src={iconUrl} alt={title} className="w-9 h-9 object-contain" />
        ) : (
          <Icon className="w-7 h-7 text-white" />
        )}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div>
      <div className="text-3xl font-bold text-white">{value}</div>
      <div className="text-sm text-slate-400 mt-1">{label}</div>
    </div>
  );
}