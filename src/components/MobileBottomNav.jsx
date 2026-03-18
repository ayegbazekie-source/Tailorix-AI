import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Camera, 
  Wand2, 
  Crown,
  Briefcase
} from 'lucide-react';

export default function MobileBottomNav({ isPremium, unreadCount = 0 }) {
  const location = useLocation();
  const currentPath = location.pathname;

  // Save current path for tab-specific history
  useEffect(() => {
    const tabKey = isPremium ? 
      (currentPath.includes('PremiumHome') ? 'premiumHome' : 
       currentPath.includes('ImageAnalysis') ? 'premiumAnalysis' :
       currentPath.includes('DesignGenerator') ? 'premiumDesign' :
       currentPath.includes('WorkspaceList') ? 'premiumWorkspace' : null) :
      (currentPath.includes('FreeHome') ? 'freeHome' :
       currentPath.includes('ImageAnalysis') ? 'freeAnalysis' :
       currentPath.includes('FreeDesignIllustrator') ? 'freeDesign' :
       currentPath.includes('AITutor') ? 'freeChat' : null);
    
    if (tabKey) {
      sessionStorage.setItem(`tab_history_${tabKey}`, currentPath);
    }
  }, [currentPath, isPremium]);

  const freeNavItems = [
    { name: 'Home', icon: Home, page: 'FreeHome' },
    { name: 'Analyze', icon: Camera, page: 'ImageAnalysis' },
    { name: 'Design', icon: Wand2, page: 'FreeDesignIllustrator' },
    { 
      name: 'Chat', 
      iconUrl: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697d0c21476d1c06f4d428ff/169a0ecf8_TailorixChat.png', 
      page: 'AITutor' 
    },
  ];

  const premiumNavItems = [
    { name: 'Home', icon: Crown, page: 'PremiumHome' },
    { name: 'Analyze', icon: Camera, page: 'ImageAnalysis' },
    { name: 'Design', icon: Wand2, page: 'DesignGenerator' },
    { name: 'Workspaces', icon: Briefcase, page: 'WorkspaceList', badge: unreadCount > 0 ? unreadCount : null },
  ];

  const navItems = isPremium ? premiumNavItems : freeNavItems;

  const isActive = (page) => currentPath.includes(page);

  return (
    <div 
      className={`md:hidden fixed bottom-0 left-0 right-0 z-50 border-t backdrop-blur-lg ${
        isPremium 
          ? 'bg-slate-900/95 border-amber-500/20' 
          : 'bg-[var(--card-bg)] border-[var(--border-primary)]'
      }`}
      style={{ paddingBottom: 'var(--safe-area-inset-bottom)' }}
    >
      <div className="max-w-6xl mx-auto px-2 py-2">
        <div className="flex items-center justify-around">
          {navItems.map((item) => (
            <Link key={item.page} to={createPageUrl(item.page)}>
              <Button
                variant="ghost"
                aria-label={`Navigate to ${item.name}`}
                className={`flex flex-col items-center gap-0.5 h-auto py-2 px-3 min-h-[44px] min-w-[44px] relative ${
                  isActive(item.page)
                    ? isPremium 
                      ? 'text-amber-400 hover:text-amber-300 hover:bg-amber-900/20'
                      : 'text-rose-600 hover:text-rose-500'
                    : isPremium
                      ? 'text-amber-200/60 hover:text-amber-300 hover:bg-amber-900/20'
                      : 'text-[var(--text-secondary)] hover:bg-slate-100'
                }`}
              >
                {item.iconUrl ? (
                  <img 
                    src={item.iconUrl} 
                    alt={item.name} 
                    className="w-6 h-6 object-contain"
                  />
                ) : (
                  <item.icon className="w-6 h-6" />
                )}
                <span className={`text-[10px] ${isActive(item.page) ? 'font-semibold' : ''}`}>
                  {item.name}
                </span>
                {item.badge && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-black text-[9px] font-bold rounded-full flex items-center justify-center">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}