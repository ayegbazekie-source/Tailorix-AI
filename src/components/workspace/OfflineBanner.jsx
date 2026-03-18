import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi } from 'lucide-react';

export default function OfflineBanner({ isOnline, isPremium = false }) {
  const [showReconnected, setShowReconnected] = React.useState(false);
  const previousOnlineRef = React.useRef(isOnline);

  React.useEffect(() => {
    // Show reconnected message when coming back online
    if (!previousOnlineRef.current && isOnline) {
      setShowReconnected(true);
      setTimeout(() => setShowReconnected(false), 3000);
    }
    previousOnlineRef.current = isOnline;
  }, [isOnline]);

  return (
    <>
      {/* Offline Banner */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className={`fixed top-0 left-0 right-0 z-[9999] ${
              isPremium
                ? 'bg-gradient-to-r from-amber-900/90 to-yellow-900/90 backdrop-blur-lg border-b border-[#D4AF37]/30'
                : 'bg-gradient-to-r from-red-900/90 to-rose-900/90 backdrop-blur-lg border-b border-red-500/30'
            }`}
          >
            <div className="max-w-7xl mx-auto px-4 py-3">
              <div className="flex items-center justify-center gap-3">
                <WifiOff className={`w-5 h-5 ${isPremium ? 'text-[#D4AF37]' : 'text-red-200'}`} />
                <p className={`text-sm font-medium ${isPremium ? 'text-[#F8F8F2]' : 'text-white'}`}>
                  No internet connection. Some features may not work.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reconnected Toast */}
      <AnimatePresence>
        {showReconnected && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-[9999] ${
              isPremium
                ? 'bg-gradient-to-br from-[#1e1e1e] to-[#121212] border border-[#D4AF37]/30'
                : 'bg-gradient-to-r from-green-900/90 to-emerald-900/90 border border-green-500/30'
            } backdrop-blur-lg rounded-xl shadow-2xl`}
          >
            <div className="px-6 py-3">
              <div className="flex items-center gap-3">
                <Wifi className={`w-5 h-5 ${isPremium ? 'text-[#D4AF37]' : 'text-green-200'}`} />
                <p className={`text-sm font-medium ${isPremium ? 'text-[#F8F8F2]' : 'text-white'}`}>
                  Connection restored. Full functionality available.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}