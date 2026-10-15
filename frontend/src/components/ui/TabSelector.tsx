'use client';

import React from 'react';
import { AuthMode } from '@/types/auth';
import { User, UserPlus, Shield } from 'lucide-react';

interface TabSelectorProps {
  currentMode: AuthMode;
  onSelectMode: (mode: AuthMode) => void;
}

export const TabSelector: React.FC<TabSelectorProps> = ({ currentMode, onSelectMode }) => {
  const tabs = [
    {
      id: 'client-login' as AuthMode,
      label: 'Client Login',
      icon: <User className="w-4 h-4" />,
    },
    {
      id: 'client-register' as AuthMode,
      label: 'Client Sign Up',
      icon: <UserPlus className="w-4 h-4" />,
    },
    {
      id: 'owner-login' as AuthMode,
      label: 'Owner Login',
      icon: <Shield className="w-4 h-4" />,
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-1 p-1 bg-slate-900/90 border border-slate-800 rounded-xl mb-6">
      {tabs.map((tab) => {
        const isActive = currentMode === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectMode(tab.id)}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            {tab.icon}
            <span className="truncate">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
