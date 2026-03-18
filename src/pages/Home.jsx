import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';

export default function Home() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const user = await base44.auth.me();
      setCurrentUser(user);
    } catch (error) {
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    if (currentUser === undefined) return;

    if (currentUser === null) {
      navigate(createPageUrl('Landing'), { replace: true });
      return;
    }

    if (currentUser.isPro === true) {
      navigate(createPageUrl('PremiumHome'), { replace: true });
    } else {
      navigate(createPageUrl('FreeHome'), { replace: true });
    }
  }, [currentUser, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-white mb-2">Tailorix AI</h2>
        <p className="text-slate-400">Redirecting...</p>
      </div>
    </div>
  );
}