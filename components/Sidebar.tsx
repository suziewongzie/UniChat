import React from 'react';
import { Platform } from '../types';
import { PLATFORMS, Icons } from '../constants';

interface SidebarProps {
  activePlatform: Platform;
  isSettingsOpen: boolean;
  isSearchOpen: boolean;
  onSelectPlatform: (p: Platform) => void;
  onOpenSettings: () => void;
  onOpenSearch: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activePlatform, 
  isSettingsOpen, 
  isSearchOpen,
  onSelectPlatform, 
  onOpenSettings,
  onOpenSearch 
}) => {
  return (
    <div className="
      fixed bottom-0 left-0 w-full h-16 bg-white border-t border-gray-200 flex flex-row items-center justify-around z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]
      md:static md:w-20 md:h-full md:border-t-0 md:border-r md:flex-col md:justify-start md:py-6 md:gap-6 md:shadow-sm
    ">
      {/* Logo - Desktop Only */}
      <div className="hidden md:flex w-10 h-10 bg-indigo-600 rounded-xl items-center justify-center text-white font-bold text-xl mb-4 shadow-lg shadow-indigo-200 flex-shrink-0">
        U
      </div>
      
      {/* Platforms */}
      <div className="flex flex-row gap-1 w-full justify-around md:flex-col md:gap-4 md:justify-start md:items-center">
        {PLATFORMS.map((plat) => {
          const isActive = activePlatform === plat.id && !isSettingsOpen && !isSearchOpen;
          return (
            <button
              key={plat.id}
              onClick={() => onSelectPlatform(plat.id)}
              className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center transition-all duration-300 relative group
                ${isActive ? `${plat.color} text-white shadow-lg md:scale-110` : 'text-gray-400 hover:bg-gray-100'}`}
              title={plat.name}
            >
              <div className="w-5 h-5 md:w-6 md:h-6">{plat.icon}</div>
              {/* Tooltip - Desktop Only */}
              <span className="hidden md:block absolute left-14 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-md">
                {plat.name}
              </span>
              {/* Active Indicator */}
              {isActive && (
                <>
                  <div className="hidden md:block absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-6 bg-current rounded-r-full opacity-50"></div>
                  <div className="md:hidden absolute -top-1 left-1/2 -translate-x-1/2 h-1 w-6 bg-current rounded-b-full opacity-50"></div>
                </>
              )}
            </button>
          );
        })}
        
        {/* Mobile Separator (hidden on desktop) */}
        <div className="w-px h-8 bg-gray-200 md:hidden"></div>

         {/* Search Button */}
         <button
            onClick={onOpenSearch}
            className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center transition-all duration-300 relative group
              ${isSearchOpen ? 'bg-indigo-100 text-indigo-600 shadow-inner' : 'text-gray-400 hover:bg-gray-100'}`}
            title="Global Search"
          >
            <div className="w-5 h-5 md:w-6 md:h-6">{Icons.Search}</div>
            <span className="hidden md:block absolute left-14 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-md">
              Search
            </span>
            {isSearchOpen && (
                <div className="hidden md:block absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-600 rounded-r-full opacity-50"></div>
            )}
        </button>

        {/* Desktop Separator */}
        <div className="hidden md:block w-8 h-px bg-gray-200 mt-auto"></div>
        
        {/* Settings Button */}
        <button
            onClick={onOpenSettings}
            className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center transition-all duration-300 relative group
              ${isSettingsOpen ? 'bg-slate-800 text-white shadow-lg md:scale-110' : 'text-gray-400 hover:bg-gray-100'}`}
            title="Settings"
          >
            <div className="w-5 h-5 md:w-6 md:h-6">{Icons.Settings}</div>
            <span className="hidden md:block absolute left-14 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-md">
              Settings
            </span>
             {isSettingsOpen && (
                <div className="hidden md:block absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-6 bg-current rounded-r-full opacity-50"></div>
              )}
        </button>
      </div>
    </div>
  );
};