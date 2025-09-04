
"use client";

import { useState, useEffect, useCallback } from 'react';

declare global {
  interface WindowEventMap {
    'pwa-update': CustomEvent<{ registration: ServiceWorkerRegistration }>;
  }
}

export const usePWA = () => {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    const handleUpdate = (event: CustomEvent<{ registration: ServiceWorkerRegistration }>) => {
      setRegistration(event.detail.registration);
      setIsUpdateAvailable(true);
    };

    window.addEventListener('pwa-update', handleUpdate as EventListener);

    return () => {
      window.removeEventListener('pwa-update', handleUpdate as EventListener);
    };
  }, []);

  const update = useCallback(() => {
    if (registration && registration.waiting) {
      // This sends a message to the waiting service worker to take over.
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      // After the new service worker takes over, the page will reload.
      // Add a listener to reload the page once the new service worker is active.
      registration.waiting.addEventListener('statechange', (e) => {
          const target = e.target as ServiceWorker;
          if (target.state === 'activated') {
              window.location.reload();
          }
      });
    }
  }, [registration]);

  return { isUpdateAvailable, update };
};
