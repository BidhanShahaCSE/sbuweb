'use client';

import React from 'react';
import { AlertCircle, Database, Server, Info, X } from 'lucide-react';

interface NoticeBannerProps {
  onDismiss?: () => void;
}

export const NoticeBanner: React.FC<NoticeBannerProps> = ({ onDismiss }) => {
  return (
    <div className="relative rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-200 animate-fadeIn transition-all shadow-lg backdrop-blur-sm">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-amber-500/20 p-2 text-amber-400 shrink-0 mt-0.5">
          <AlertCircle className="w-5 h-5" />
        </div>

        <div className="space-y-1.5 flex-1 pr-4">
          <h4 className="text-sm font-semibold text-amber-300 tracking-wide uppercase">
            Authentication is not connected yet
          </h4>
          <p className="text-xs text-amber-200/90 leading-relaxed">
            Form validation passed successfully. In this development phase, the frontend is strictly decoupled:
          </p>
          <ul className="text-xs text-amber-300/80 space-y-1 mt-2 list-disc list-inside">
            <li className="flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Backend API is separate and uncoupled.</span>
            </li>
            <li className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Database / Supabase connection is intentionally disabled.</span>
            </li>
            <li className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>No mock authentication or fake session was generated.</span>
            </li>
          </ul>
        </div>

        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="text-amber-400/80 hover:text-amber-200 p-1 rounded-md transition-colors"
            aria-label="Dismiss message"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
