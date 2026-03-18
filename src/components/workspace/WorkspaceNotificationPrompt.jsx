import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function WorkspaceNotificationPrompt({ isOpen, onClose, onEnable, isPremium = true }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className={`max-w-md w-full rounded-2xl shadow-2xl ${
            isPremium
              ? 'bg-gradient-to-br from-[#1e1e1e] to-[#121212] border border-[#D4AF37]/30'
              : 'bg-white border border-slate-200'
          } p-6`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              isPremium
                ? 'bg-gradient-to-br from-amber-500 to-yellow-500'
                : 'bg-gradient-to-br from-blue-500 to-indigo-500'
            }`}>
              <Bell className="w-6 h-6 text-white" />
            </div>
            <button
              onClick={onClose}
              className={isPremium ? 'text-[#F8F8F2]/60 hover:text-[#F8F8F2]' : 'text-slate-400 hover:text-slate-600'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h3 className={`text-xl font-bold mb-2 ${
            isPremium ? 'text-[#F8F8F2]' : 'text-slate-900'
          }`}>
            Enable Workspace Notifications?
          </h3>
          
          <p className={`text-sm mb-6 ${
            isPremium ? 'text-[#F8F8F2]/70' : 'text-slate-600'
          }`}>
            Stay updated with real-time alerts when team members send messages to your workspaces. You'll receive notifications even when not viewing the workspace.
          </p>

          <div className="flex gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className={`flex-1 ${
                isPremium
                  ? 'border-[#D4AF37]/30 text-[#F8F8F2] hover:bg-[#D4AF37]/10'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              Not Now
            </Button>
            <Button
              onClick={async () => {
                await onEnable();
                onClose();
              }}
              className={`flex-1 ${
                isPremium
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-bold'
                  : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white'
              }`}
            >
              Enable Notifications
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}