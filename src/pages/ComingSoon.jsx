import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { createPageUrl } from '@/utils';
import { Sparkles, ArrowLeft, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ComingSoon() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full text-center"
      >
        {/* Animated Icon */}
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 10, 0],
            scale: [1, 1.1, 1, 1.1, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1
          }}
          className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-rose-500 to-pink-500 rounded-3xl flex items-center justify-center"
        >
          <Sparkles className="w-12 h-12 text-white" />
        </motion.div>

        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-light text-white tracking-tight mb-6">
          Coming <span className="font-semibold bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">Soon</span>
        </h1>

        {/* Description */}
        <p className="text-xl text-slate-300 font-light max-w-lg mx-auto mb-8 leading-relaxed">
          We're working on something amazing! This feature will help you master sewing skills with interactive lessons and real-time feedback.
        </p>

        {/* Features Preview */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700"
          >
            <div className="text-3xl mb-2">🎯</div>
            <div className="text-sm text-slate-300">Interactive Lessons</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700"
          >
            <div className="text-3xl mb-2">📊</div>
            <div className="text-sm text-slate-300">Progress Tracking</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700"
          >
            <div className="text-3xl mb-2">🏆</div>
            <div className="text-sm text-slate-300">Achievements</div>
          </motion.div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to={createPageUrl('Home')}>
            <Button
              size="lg"
              className="bg-rose-500 hover:bg-rose-600 text-white px-8 py-6 text-lg rounded-2xl shadow-xl"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Footer Note */}
        <p className="text-sm text-slate-500 mt-12">
          Stay tuned for updates!
        </p>
      </motion.div>
    </div>
  );
}