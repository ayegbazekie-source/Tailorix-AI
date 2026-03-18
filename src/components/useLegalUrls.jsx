import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

export function useLegalUrls() {
  const [urls, setUrls] = useState({ privacyPolicyUrl: '', termsOfServiceUrl: '' });

  useEffect(() => {
    base44.functions.invoke('getLegalUrls', {})
      .then(res => {
        if (res?.data) setUrls(res.data);
      })
      .catch(() => {});
  }, []);

  return urls;
}