import React, { useState, useEffect } from 'react';

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if user previously dismissed today
    const dismissedUntil = localStorage.getItem('veluntu_pwa_dismissed_until');
    if (dismissedUntil && new Date().getTime() < parseInt(dismissedUntil, 10)) {
      return;
    }

    // Check if already in standalone (installed) mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if (isStandalone) {
      return;
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show prompt after a smooth delay so user first experiences the UI
      setTimeout(() => {
        setShowPrompt(true);
      }, 2500);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setIsDismissed(true);
    // Dismiss for 24 hours
    const dismissExpiry = new Date().getTime() + 24 * 60 * 60 * 1000;
    localStorage.setItem('veluntu_pwa_dismissed_until', dismissExpiry.toString());
  };

  if (!showPrompt || isDismissed) {
    return null;
  }

  return (
    <div className="pwa-install-banner" style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      maxWidth: '380px',
      width: 'calc(100% - 48px)',
      background: 'rgba(12, 18, 32, 0.95)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(201, 151, 56, 0.4)',
      borderRadius: '14px',
      padding: '16px 20px',
      boxShadow: '0 16px 36px rgba(0, 0, 0, 0.5), 0 0 20px rgba(201, 151, 56, 0.15)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      animation: 'slideUpFade 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
    }}>
      <div style={{
        width: '44px',
        height: '44px',
        borderRadius: '10px',
        background: 'linear-gradient(135deg, #c99738, #8c6418)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxShadow: '0 4px 12px rgba(201, 151, 56, 0.3)',
      }}>
        <img src="/pwa-192x192.svg" alt="Veluntu App" style={{ width: '32px', height: '32px', borderRadius: '6px' }} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <h4 style={{
          fontFamily: "'Cinzel', serif",
          fontSize: '13px',
          fontWeight: '700',
          color: '#ffffff',
          margin: 0,
          letterSpacing: '1px',
        }}>
          VELUNTU APP
        </h4>
        <p style={{
          fontSize: '11px',
          color: '#94a3b8',
          margin: '2px 0 0',
          lineHeight: '1.3',
        }}>
          Instale o app para acesso rápido e roteiros offline.
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={handleInstallClick}
          style={{
            background: 'linear-gradient(135deg, #d4af37, #aa851e)',
            color: '#070a12',
            border: 'none',
            borderRadius: '6px',
            padding: '7px 12px',
            fontSize: '11px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(212, 175, 55, 0.3)',
            whiteSpace: 'nowrap',
          }}
        >
          Instalar
        </button>
        <button
          onClick={handleDismiss}
          title="Fechar"
          aria-label="Fechar"
          style={{
            background: 'transparent',
            border: 'none',
            color: '#64748b',
            cursor: 'pointer',
            padding: '4px',
            fontSize: '16px',
            lineHeight: '1',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
}
