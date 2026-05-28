import { useEffect, useState } from 'react';

export default function Analytics() {
  const [enabled, setEnabled] = useState(() => {
    try { return localStorage.getItem('analytics-enabled') === '1'; } catch { return false; }
  });

  useEffect(() => {
    try { localStorage.setItem('analytics-enabled', enabled ? '1' : '0'); } catch {}
    if (enabled) {
      // placeholder for analytics init (e.g., Plausible, GA)
      // window.plausible = window.plausible || function(){}
    }
  }, [enabled]);

  if (enabled) return null;

  return (
    <div className="fixed bottom-6 left-6 bg-white shadow-lg rounded-lg p-3 z-[400]">
      <p className="text-sm text-slate-700 mb-2">Help us improve by enabling anonymous analytics.</p>
      <div className="flex gap-2">
        <button className="btn btn-primary" onClick={() => setEnabled(true)}>Enable</button>
        <button className="btn btn-ghost" onClick={() => setEnabled(false)}>Dismiss</button>
      </div>
    </div>
  );
}
