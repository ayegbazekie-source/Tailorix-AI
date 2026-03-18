import { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import toast from 'react-hot-toast';

export function useWorkspaceNotifications(user, isPremium) {
  const [hasPermission, setHasPermission] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [unreadCount, setUnreadCount] = useState(0);
  const audioRef = useRef(null);
  const activeWorkspaceRef = useRef(null);
  const subscribedRef = useRef(false);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Request notification permission
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      console.log('Browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      setHasPermission(true);
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      const granted = permission === 'granted';
      setHasPermission(granted);
      return granted;
    }

    return false;
  };

  // Play notification sound
  const playNotificationSound = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZTA0OVqzn77BdGAg+ltryxnMpBSh+zPDajzkHGGS56+mjUhELTKXh8bllHAU2jdXzz38uBSp3xu/bkUAKFl223+qnVRQLQ5zd8sFuJAU1htDy0oI0Bx1qvOzjm08NDFSq5O+vYBgJPJTY8sh0LAUrfdDv3I0+ChVftdvqp1UUC0Kd3fK/biMFMoXP8s5/LgUrdsbv2o9ACBVcttvqp1QUD0Ka3fK+bSMFMoXP8s5/LQYqdsbv2o9ACBVcttvqp1QUD0Ka3fK+bSMFMoXP8s5/LQYqdsbv2o9ACBZcttvqp1QUD0Ka3fK+bSMFMoXP8s5/LQYqdsbv2o9ACBZdttvqp1QUEEKa3fK+bSMFMoXP8s5/LQYqdsbv2o9ACBZdttvqp1QUEEKa3fK+bSMFMoXP8s5/LQYqdsbv2o9ACBZdttvqp1QUEEKa3fK+bSMFMoXP8s5/LQYqdsbv2o9ACBZdttvqp1QUEEKa3fK+bSMFMoXP8s5/LQYqdsbv2o9ACBZdttvqp1QUEEKa3fK+bSMFMoXP8s5/LQYqdsbv2o9ACBZdttvqp1QUEEKa3fK+bSMFMoXP8s5/LQYqdsbv2o9ACBZdttvqp1QUEEKa3fK+bSMFMoXP8s5/LQYqdsbv2o9ACBZdttvqp1QUEEKa3fK+');
    }
    audioRef.current.play().catch(() => {
      // Ignore autoplay errors
    });
  };

  // Show message notification
  const showMessageNotification = (message, workspaceName) => {
    if (!isOnline || !isPremium) return;

    // Don't notify if user is viewing the workspace where message was sent
    if (activeWorkspaceRef.current === message.workspace_id) return;

    // Play sound
    playNotificationSound();

    // Show toast notification
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-gradient-to-br from-[#1e1e1e] to-[#121212] shadow-lg rounded-xl pointer-events-auto flex ring-1 ring-[#D4AF37]/30 border border-[#D4AF37]/20`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center text-black font-bold text-sm">
                {message.sender_name.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-semibold text-[#D4AF37]">
                {message.sender_name}
              </p>
              <p className="mt-1 text-xs text-[#F8F8F2]/60">
                {workspaceName}
              </p>
              <p className="mt-1 text-sm text-[#F8F8F2]">
                {message.message_text.length > 50
                  ? message.message_text.substring(0, 50) + '...'
                  : message.message_text}
              </p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-[#D4AF37]/20">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none rounded-r-xl p-4 flex items-center justify-center text-sm font-medium text-[#D4AF37] hover:text-[#F8F8F2] focus:outline-none"
          >
            Close
          </button>
        </div>
      </div>
    ), {
      duration: 5000,
      position: 'top-right',
    });

    // Update unread count
    setUnreadCount(prev => prev + 1);
  };

  // Subscribe to workspace messages
  useEffect(() => {
    if (!user || !isPremium || subscribedRef.current) return;

    const setupSubscriptions = async () => {
      try {
        // Get all workspaces user belongs to
        const members = await base44.entities.WorkspaceMember.filter({
          user_id: user.id
        });

        const workspaceIds = members.map(m => m.workspace_id);
        
        if (workspaceIds.length === 0) return;

        // Fetch workspace names
        const workspaces = await Promise.all(
          workspaceIds.map(id => base44.entities.Workspace.filter({ id }))
        );
        const workspaceMap = {};
        workspaces.flat().forEach(ws => {
          workspaceMap[ws.id] = ws.name;
        });

        // Subscribe to workspace messages
        const unsubscribe = base44.entities.WorkspaceMessage.subscribe((event) => {
          if (event.type === 'create' && event.data) {
            const message = event.data;
            
            // Don't notify for own messages
            if (message.sender_user_id === user.id) return;

            // Only notify if workspace belongs to user
            if (workspaceIds.includes(message.workspace_id)) {
              const workspaceName = workspaceMap[message.workspace_id] || 'Workspace';
              showMessageNotification(message, workspaceName);
            }
          }
        });

        subscribedRef.current = true;

        return () => {
          unsubscribe();
          subscribedRef.current = false;
        };
      } catch (error) {
        console.error('Failed to setup workspace subscriptions:', error);
      }
    };

    setupSubscriptions();
  }, [user, isPremium]);

  const setActiveWorkspace = (workspaceId) => {
    activeWorkspaceRef.current = workspaceId;
    // Reset unread count when viewing workspace
    if (workspaceId) {
      setUnreadCount(0);
    }
  };

  return {
    isOnline,
    hasPermission,
    requestNotificationPermission,
    unreadCount,
    setActiveWorkspace,
    setUnreadCount
  };
}