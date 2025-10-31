import React, { useEffect, useState } from "react";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onBeforeInstallPrompt(e) {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
    }

    function onAppInstalled() {
      setDeferredPrompt(null);
      setVisible(false);
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  async function handleInstallClick() {
    if (!deferredPrompt) return;
    try {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      console.log("PWA install choice:", choice);
      setVisible(false);
      setDeferredPrompt(null);
    } catch (err) {
      console.error("Install prompt failed:", err);
    }
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <button
        onClick={handleInstallClick}
        aria-label="Install app"
        className="flex items-center gap-3 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 hover:scale-[1.03] transform transition shadow-xl text-white px-4 py-3 rounded-2xl"
      >
        <span className="relative w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
          {/* small app icon */}
          <img
            src="/logo-no-bg.png"
            alt="logo"
            className="w-6 h-6 rounded-full"
          />
          <span className="absolute -right-1 -top-1 w-2 h-2 bg-green-400 rounded-full ring-2 ring-white animate-pulse" />
        </span>
        <div className="text-left">
          <div className="text-sm font-semibold">Install Mavericks</div>
          <div className="text-[10px] opacity-80">Add to your device</div>
        </div>
      </button>
      <style>{`
        @keyframes slideUp { from { transform: translateY(16px); opacity:0 } to { transform: translateY(0); opacity:1 } }
        .animate-slide-up { animation: slideUp 360ms ease both; }
      `}</style>
    </div>
  );
}
