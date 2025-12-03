import React, { useState } from 'react';
import { Platform } from '../types';
import { PLATFORMS } from '../constants';

interface SettingsViewProps {
  connectedPlatforms: Record<Platform, boolean>;
  onTogglePlatform: (platform: Platform) => Promise<void>;
  onClose: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ connectedPlatforms, onTogglePlatform, onClose }) => {
  const [loadingPlatform, setLoadingPlatform] = useState<Platform | null>(null);

  const handleToggle = async (platform: Platform) => {
    setLoadingPlatform(platform);
    try {
      await onTogglePlatform(platform);
    } finally {
      setLoadingPlatform(null);
    }
  };

  return (
    <div className="flex-1 h-full bg-slate-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6 flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
          <p className="text-gray-500 mt-1">Manage your connected accounts and preferences</p>
        </div>
        <button 
          onClick={onClose}
          className="md:hidden text-gray-500 hover:bg-gray-100 p-2 rounded-full"
        >
          Close
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Integrations Section */}
          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-4 px-1">Integrations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PLATFORMS.map((plat) => {
                const isConnected = connectedPlatforms[plat.id];
                const isLoading = loadingPlatform === plat.id;

                return (
                  <div key={plat.id} className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${plat.color} shadow-sm`}>
                        {plat.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800">{plat.name}</h3>
                        <p className={`text-xs font-medium ${isConnected ? 'text-green-600' : 'text-gray-400'}`}>
                          {isLoading ? 'Updating...' : (isConnected ? 'Connected' : 'Not Connected')}
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleToggle(plat.id)}
                      disabled={isLoading}
                      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                        ${isConnected ? 'bg-indigo-600' : 'bg-gray-200'}
                        ${isLoading ? 'opacity-50 cursor-wait' : ''}
                      `}
                    >
                      {isLoading ? (
                        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></span>
                      ) : (
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm
                            ${isConnected ? 'translate-x-6' : 'translate-x-1'}`}
                        />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          {/* AI Preferences Section */}
          <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">AI Smart Reply</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-slate-800">Auto-Suggest Drafts</h3>
                  <p className="text-sm text-gray-500">Automatically generate reply suggestions when opening a chat</p>
                </div>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-indigo-600">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6 transition-transform"/>
                </button>
              </div>
              <div className="border-t border-gray-100 pt-4">
                 <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-slate-800">Response Style</h3>
                    <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded">Balanced</span>
                 </div>
                 <input type="range" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                 <div className="flex justify-between text-xs text-gray-400 mt-2">
                    <span>Brief</span>
                    <span>Balanced</span>
                    <span>Detailed</span>
                 </div>
              </div>
            </div>
          </section>

          {/* Account Section */}
          <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  JD
               </div>
               <div>
                  <h3 className="font-semibold text-slate-800">John Doe</h3>
                  <p className="text-sm text-gray-500">john.doe@example.com</p>
               </div>
            </div>
            <button className="text-sm font-medium text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors">
                Sign Out
            </button>
          </section>

        </div>
      </div>
    </div>
  );
};