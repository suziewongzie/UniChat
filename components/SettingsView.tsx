import React, { useState, useEffect } from 'react';
import { Platform, WhatsAppCredentials, FacebookCredentials } from '../types';
import { PLATFORMS } from '../constants';
import { whatsappClient } from '../services/whatsappClient';
import { facebookClient } from '../services/facebookClient';

interface SettingsViewProps {
  connectedPlatforms: Record<Platform, boolean>;
  onTogglePlatform: (platform: Platform) => Promise<void>;
  onClose: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ connectedPlatforms, onTogglePlatform, onClose }) => {
  const [loadingPlatform, setLoadingPlatform] = useState<Platform | null>(null);
  const [expandedPlatform, setExpandedPlatform] = useState<Platform | null>(null);
  
  // Configuration States
  const [isWaConfigured, setIsWaConfigured] = useState(whatsappClient.isConfigured());
  const [isFbConfigured, setIsFbConfigured] = useState(facebookClient.isConfigured());
  
  // WhatsApp Creds
  const [waCreds, setWaCreds] = useState<WhatsAppCredentials>({
    phoneNumberId: '',
    accessToken: '',
    businessAccountId: ''
  });

  // Facebook Creds
  const [fbCreds, setFbCreds] = useState<FacebookCredentials>({
    appId: ''
  });

  useEffect(() => {
    // Load existing credentials
    const waStored = localStorage.getItem('wa_creds');
    if (waStored) setWaCreds(JSON.parse(waStored));

    const fbStored = localStorage.getItem('fb_creds');
    if (fbStored) setFbCreds(JSON.parse(fbStored));
  }, []);

  const handleToggle = async (platform: Platform) => {
    // Validation for WhatsApp
    if (platform === 'whatsapp' && !connectedPlatforms['whatsapp'] && !isWaConfigured) {
       alert("Setup Required: Please configure your WhatsApp Cloud API credentials first.");
       setExpandedPlatform('whatsapp');
       return;
    }

    // Validation for Messenger/Instagram (Shared FB Config)
    if ((platform === 'messenger' || platform === 'instagram') && !connectedPlatforms[platform] && !isFbConfigured) {
        alert("Setup Required: Please Connect with Facebook to enable this integration.");
        setExpandedPlatform(platform); // Will open the same UI for both
        return;
    }

    setLoadingPlatform(platform);
    try {
      await onTogglePlatform(platform);
    } finally {
      setLoadingPlatform(null);
    }
  };

  const handleExpand = (platform: Platform) => {
    setExpandedPlatform(expandedPlatform === platform ? null : platform);
  };

  const handleSaveWhatsApp = () => {
    whatsappClient.configure(waCreds);
    setIsWaConfigured(true);
    alert("WhatsApp Configuration Saved!");
    setExpandedPlatform(null);
  };

  const handleConnectFacebook = async () => {
    if (!fbCreds.appId) {
        alert("Please enter a valid Facebook App ID");
        return;
    }
    facebookClient.configure(fbCreds);
    try {
        await facebookClient.login();
        setIsFbConfigured(true);
        alert("Logged in to Facebook successfully! You can now enable Messenger and Instagram.");
        setExpandedPlatform(null);
    } catch (e) {
        alert("Facebook Login Failed: " + e);
    }
  };

  const handleTestConnection = async (platform: Platform) => {
     try {
       alert(`Testing ${platform} connection... check console for details.`);
       if (platform === 'messenger') {
         const pages = await facebookClient.fetchPages();
         console.log(pages);
       }
     } catch (e) {
       console.error(e);
       alert("Test failed. See console.");
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
            <div className="flex flex-col gap-4">
              {PLATFORMS.map((plat) => {
                const isConnected = connectedPlatforms[plat.id];
                const isLoading = loadingPlatform === plat.id;
                const isExpanded = expandedPlatform === plat.id;
                
                // Status Badge Logic
                let isConfigured = true;
                if (plat.id === 'whatsapp') isConfigured = isWaConfigured;
                if (plat.id === 'messenger' || plat.id === 'instagram') isConfigured = isFbConfigured;

                return (
                  <div key={plat.id} className={`bg-white rounded-2xl border border-gray-200 shadow-sm transition-all overflow-hidden ${isExpanded ? 'ring-2 ring-indigo-500 border-transparent' : 'hover:shadow-md'}`}>
                    <div className="p-5 flex items-center justify-between">
                      <div className="flex items-center gap-4 cursor-pointer flex-1" onClick={() => handleExpand(plat.id)}>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${plat.color} shadow-sm`}>
                          {plat.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800">{plat.name}</h3>
                          <div className="flex items-center gap-2">
                             <p className={`text-xs font-medium ${isConnected ? 'text-green-600' : 'text-gray-400'}`}>
                               {isLoading ? 'Updating...' : (isConnected ? 'Connected' : 'Not Connected')}
                             </p>
                             {(plat.id === 'whatsapp' || plat.id === 'messenger' || plat.id === 'instagram') && (
                               <span className={`text-[10px] px-1.5 py-0.5 rounded ${isConfigured ? 'bg-indigo-50 text-indigo-600' : 'bg-orange-50 text-orange-600'}`}>
                                 {isConfigured ? 'Configured' : 'Setup Required'}
                               </span>
                             )}
                          </div>
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

                    {/* Configuration Panel for WhatsApp */}
                    {isExpanded && plat.id === 'whatsapp' && (
                      <div className="bg-gray-50 p-6 border-t border-gray-100 animate-in slide-in-from-top-2 duration-200">
                        <h4 className="text-sm font-bold text-gray-700 mb-4">Cloud API Configuration</h4>
                        <div className="grid gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Phone Number ID</label>
                            <input 
                              type="text" 
                              value={waCreds.phoneNumberId}
                              onChange={(e) => setWaCreds({...waCreds, phoneNumberId: e.target.value})}
                              placeholder="e.g. 104523678912345"
                              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Permanent Access Token</label>
                            <input 
                              type="password" 
                              value={waCreds.accessToken}
                              onChange={(e) => setWaCreds({...waCreds, accessToken: e.target.value})}
                              placeholder="EAAG..."
                              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border"
                            />
                          </div>
                          <div className="flex justify-end pt-2">
                             <button 
                                onClick={handleSaveWhatsApp}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
                             >
                               Save Configuration
                             </button>
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-4">
                           Get these credentials from your <a href="https://developers.facebook.com/apps/" target="_blank" className="underline hover:text-indigo-600">Meta Developer Portal</a>.
                        </p>
                      </div>
                    )}

                    {/* Configuration Panel for Facebook/Messenger/Instagram */}
                    {isExpanded && (plat.id === 'messenger' || plat.id === 'instagram') && (
                         <div className="bg-gray-50 p-6 border-t border-gray-100 animate-in slide-in-from-top-2 duration-200">
                             <h4 className="text-sm font-bold text-gray-700 mb-4">Meta (Facebook & Instagram) Login</h4>
                             <p className="text-xs text-gray-500 mb-4">To access Messenger and Instagram DMs, you must log in with a Facebook account that manages the Page.</p>
                             
                             <div className="grid gap-4">
                                 <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Facebook App ID</label>
                                    <input 
                                        type="text" 
                                        value={fbCreds.appId}
                                        onChange={(e) => setFbCreds({...fbCreds, appId: e.target.value})}
                                        placeholder="e.g. 84521..."
                                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border"
                                    />
                                 </div>

                                 <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                     <button
                                        onClick={handleConnectFacebook}
                                        className="bg-[#1877F2] text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-[#166fe5] transition-colors shadow-sm flex items-center justify-center gap-2"
                                     >
                                         <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                                         Log in with Facebook
                                     </button>

                                      {isFbConfigured && (
                                        <button 
                                            onClick={() => handleTestConnection(plat.id)}
                                            className="bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200"
                                        >
                                            Test Connection
                                        </button>
                                      )}
                                 </div>
                             </div>
                             
                             {isFbConfigured && (
                                 <div className="mt-4 space-y-3">
                                    <div className="p-3 bg-green-50 border border-green-100 rounded-lg text-xs text-green-700 flex items-start gap-2">
                                        <span className="font-bold">✓</span>
                                        <div>
                                            <p className="font-semibold">Logged in successfully.</p>
                                            <p>Messenger and Instagram integrations are ready to fetch history.</p>
                                        </div>
                                    </div>
                                    
                                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-800">
                                        <p className="font-bold mb-1">ℹ️ Real-time Updates (Webhooks)</p>
                                        <p>To receive new messages instantly, you must configure a Webhook in your Meta App Dashboard:</p>
                                        <ul className="list-disc list-inside mt-1 ml-1 opacity-90">
                                            <li>Callback URL: <code className="bg-blue-100 px-1 rounded">https://your-backend.com/webhook</code></li>
                                            <li>Verify Token: <code className="bg-blue-100 px-1 rounded">your_verify_token</code></li>
                                        </ul>
                                    </div>
                                 </div>
                             )}
                         </div>
                    )}

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