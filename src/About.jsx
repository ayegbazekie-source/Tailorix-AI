import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Scissors,
  Wand2,
  Shirt,
  Sparkles,
  Heart,
  Users,
  Lightbulb,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLegalUrls } from '@/components/useLegalUrls';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay }
});

export default function About() {
  const { privacyPolicyUrl, termsOfServiceUrl } = useLegalUrls();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--gradient-start)] via-[var(--gradient-middle)] to-[var(--gradient-end)] py-12 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Back Button */}
        <motion.div {...fadeUp(0)}>
          <Link to={createPageUrl('UserProfile')}>
            <Button variant="ghost" className="mb-6 text-[var(--text-secondary)] -ml-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Profile
            </Button>
          </Link>
        </motion.div>

        {/* Hero */}
        <motion.div {...fadeUp(0.05)} className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697d0c21476d1c06f4d428ff/d87b8f481_TailorixAi.png"
              alt="Tailorix AI"
              className="w-20 h-20 rounded-2xl object-cover shadow-lg"
            />
          </div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">About Tailorix AI</h1>
          <p className="text-[var(--text-secondary)] text-sm">
            Empowering tailors and fashion enthusiasts with AI-driven tools
          </p>
        </motion.div>

        {/* The Vision */}
        <motion.div {...fadeUp(0.1)} className="bg-[var(--card-bg)] rounded-3xl p-6 shadow-lg border border-[var(--card-border)] mb-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-900/30 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-rose-500" />
            </div>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">The Vision</h2>
          </div>
          <p className="text-[var(--text-secondary)] leading-relaxed text-sm">
            Tailorix AI was created by <span className="font-semibold text-[var(--text-primary)]">Ezekiel Kadiri</span>, 
            inspired by the <span className="font-semibold text-rose-500">D-Kadris Tailoring Group</span>. 
            The goal was simple: build a powerful AI-powered assistant that helps professional tailors 
            streamline their workflow, make smarter decisions, and produce better results — faster and 
            more efficiently than ever before.
          </p>
        </motion.div>

        {/* For Fashion Enthusiasts */}
        <motion.div {...fadeUp(0.15)} className="bg-[var(--card-bg)] rounded-3xl p-6 shadow-lg border border-[var(--card-border)] mb-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-pink-50 dark:bg-pink-900/30 flex items-center justify-center">
              <Heart className="w-5 h-5 text-pink-500" />
            </div>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">For Fashion Enthusiasts</h2>
          </div>
          <p className="text-[var(--text-secondary)] leading-relaxed text-sm">
            Tailorix AI isn't just for professional tailors. Whether you're passionate about fashion, 
            love exploring design ideas, enjoy creating illustrations, or simply want to have fun 
            visualizing outfit concepts — <span className="font-semibold text-[var(--text-primary)]">this app is for you too</span>. 
            It's a creative playground for anyone with an eye for style.
          </p>
        </motion.div>

        {/* Fabric Visualizer Highlight */}
        <motion.div {...fadeUp(0.2)} className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-3xl p-6 shadow-lg border border-violet-100 dark:border-violet-800/40 mb-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center">
              <Shirt className="w-5 h-5 text-violet-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Fabric Visualizer</h2>
              <span className="text-xs font-semibold text-violet-500 bg-violet-100 dark:bg-violet-900/40 px-2 py-0.5 rounded-full">
                Free during 7-day trial · Pro required after
              </span>
            </div>
          </div>
          <p className="text-[var(--text-secondary)] leading-relaxed text-sm">
            If you have a fabric but aren't sure what to sew with it, simply upload it to the Fabric Visualizer. 
            You can preview how your fabric will look on different garment styles <span className="font-semibold text-[var(--text-primary)]">before you cut a single thread</span>. 
            All templates are available during your 7-day free trial. After the trial, a Pro subscription unlocks all templates.
          </p>
        </motion.div>

        {/* Functions & Usage */}
        <motion.div {...fadeUp(0.25)} className="bg-[var(--card-bg)] rounded-3xl p-6 shadow-lg border border-[var(--card-border)] mb-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center">
              <Wand2 className="w-5 h-5 text-amber-500" />
            </div>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">Functions & Usage</h2>
          </div>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            Tailorix AI comes packed with tools built for real-world tailoring and design needs:
          </p>
          <div className="space-y-3">
            {[
              {
                icon: Scissors,
                color: 'text-rose-500',
                bg: 'bg-rose-50 dark:bg-rose-900/20',
                title: 'Bespoke Native Outfits',
                desc: 'Generate and visualize traditional and cultural attire designs tailored to your client\'s specifications.'
              },
              {
                icon: Shirt,
                color: 'text-blue-500',
                bg: 'bg-blue-50 dark:bg-blue-900/20',
                title: 'Jeanswear Templates',
                desc: 'Access ready-to-use jeanswear garment templates for accurate fittings and style previews.'
              },
              {
                icon: Users,
                color: 'text-emerald-500',
                bg: 'bg-emerald-50 dark:bg-emerald-900/20',
                title: 'Corporate Attire Templates',
                desc: 'Professional corporate wear templates perfect for office clients and formal commissions.'
              },
              {
                icon: Sparkles,
                color: 'text-violet-500',
                bg: 'bg-violet-50 dark:bg-violet-900/20',
                title: 'AI Design Generation',
                desc: 'Describe any outfit in plain text and let Tailorix AI generate a stunning illustration instantly.'
              },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-2xl bg-[var(--bg-tertiary)]">
                <div className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{item.title}</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Legal */}
        <motion.div {...fadeUp(0.28)} className="bg-[var(--card-bg)] rounded-3xl p-6 shadow-lg border border-[var(--card-border)] mb-5">
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Legal</h2>
          <div className="flex flex-col gap-3">
            <Link
              to={createPageUrl('TermsOfService')}
              className="text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-500 transition-colors font-medium"
            >
              Agreement Summary
            </Link>
            <a
              href={privacyPolicyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-500 transition-colors font-medium"
            >
              Privacy Policy
            </a>
            <a
              href={termsOfServiceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-500 transition-colors font-medium"
            >
              Terms & Conditions
            </a>
          </div>
        </motion.div>

        {/* Footer Credit */}
        <motion.div {...fadeUp(0.3)} className="text-center py-6">
          <p className="text-xs text-[var(--text-secondary)]">
            Made with <span className="text-rose-500">♥</span> by Ezekiel Kadiri · D-Kadris Tailoring Group
          </p>
          <p className="text-xs text-slate-400 mt-1">© 2026 Tailorix AI. All rights reserved.</p>
        </motion.div>

      </div>
    </div>
  );
}