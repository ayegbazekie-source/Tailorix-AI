import React, { useState, useRef, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

/**
 * PullToRefresh wrapper
 * Usage: <PullToRefresh onRefresh={asyncFn} isPremium={false}>...content...</PullToRefresh>
 */
export default function PullToRefresh({ onRefresh, children, isPremium = false }) {
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startYRef = useRef(0);
  const isPullingRef = useRef(false);
  const containerRef = useRef(null);

  const THRESHOLD = 72;

  useEffect(() => {
    const el = document.documentElement;

    const onTouchStart = (e) => {
      if (window.scrollY > 0) return;
      startYRef.current = e.touches[0].clientY;
      isPullingRef.current = true;
    };

    const onTouchMove = (e) => {
      if (!isPullingRef.current || refreshing) return;
      const delta = e.touches[0].clientY - startYRef.current;
      if (delta > 0 && window.scrollY === 0) {
        // dampen: sqrt gives a rubber-band feel
        const clamped = Math.min(Math.sqrt(delta) * 5, THRESHOLD * 1.4);
        setPullDistance(clamped);
      }
    };

    const onTouchEnd = async () => {
      if (!isPullingRef.current) return;
      isPullingRef.current = false;
      if (pullDistance >= THRESHOLD && !refreshing) {
        setRefreshing(true);
        setPullDistance(0);
        await onRefresh();
        setRefreshing(false);
      } else {
        setPullDistance(0);
      }
    };

    document.addEventListener('touchstart', onTouchStart, { passive: true });
    document.addEventListener('touchmove', onTouchMove, { passive: true });
    document.addEventListener('touchend', onTouchEnd);

    return () => {
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    };
  }, [pullDistance, refreshing, onRefresh]);

  const progress = Math.min(pullDistance / THRESHOLD, 1);
  const isReady = progress >= 1;

  return (
    <div ref={containerRef} className="relative">
      {/* Pull indicator */}
      {(pullDistance > 4 || refreshing) && (
        <div
          className="fixed left-0 right-0 z-50 flex justify-center transition-all duration-150"
          style={{ top: refreshing ? 16 : Math.max(16, pullDistance - 40) }}
        >
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-lg border ${
            isPremium
              ? 'bg-slate-800 border-amber-500/30 text-amber-400'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-rose-500'
          }`}>
            {refreshing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <svg
                className="w-4 h-4 transition-transform duration-200"
                style={{ transform: `rotate(${isReady ? 180 : progress * 180}deg)` }}
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              >
                <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            <span className="text-xs font-medium">
              {refreshing ? 'Refreshing...' : isReady ? 'Release to refresh' : 'Pull to refresh'}
            </span>
          </div>
        </div>
      )}
      {children}
    </div>
  );
}