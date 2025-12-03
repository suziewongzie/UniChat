import React, { useMemo, useState } from 'react';
import { Contact, Platform } from '../types';
import { Icons, PLATFORMS } from '../constants';

interface ContactListProps {
  platform: Platform;
  contacts: Contact[];
  isLoading: boolean;
  activeContactId: string | null;
  isConnected: boolean;
  onSelectContact: (contact: Contact) => void;
  onOpenSettings: () => void;
}

export const ContactList: React.FC<ContactListProps> = ({ 
  platform, 
  contacts,
  isLoading,
  activeContactId, 
  isConnected,
  onSelectContact,
  onOpenSettings
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const platformConfig = PLATFORMS.find(p => p.id === platform);
  
  const filteredContacts = useMemo(() => {
    return contacts.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [contacts, searchTerm]);

  if (!isConnected) {
    return (
      <div className="w-full md:w-80 lg:w-96 bg-white border-r border-gray-200 flex flex-col h-full items-center justify-center p-6 text-center pb-20 md:pb-6">
        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-white mb-6 ${platformConfig?.color} shadow-xl`}>
          <div className="w-10 h-10">{platformConfig?.icon}</div>
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">{platformConfig?.name} is Disconnected</h2>
        <p className="text-gray-500 mb-8 text-sm leading-relaxed">
          Connect your account to view messages, reply to chats, and use AI smart features.
        </p>
        <button 
          onClick={onOpenSettings}
          className="bg-slate-900 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl hover:bg-slate-800 transition-all flex items-center gap-2 text-sm"
        >
          {Icons.Settings}
          <span>Manage Connections</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full md:w-80 lg:w-96 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-5 border-b border-gray-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-1">{platformConfig?.name}</h2>
        <p className="text-sm text-gray-500">All Messages</p>
      </div>

      {/* Search */}
      <div className="px-4 py-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 block pl-10 p-2.5 outline-none transition-all"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            {Icons.Search}
          </div>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto pb-20 md:pb-0">
        {isLoading ? (
          // Skeleton Loading State
          <div className="space-y-4 p-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-100 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => onSelectContact(contact)}
                className={`flex items-center gap-3 px-4 py-4 cursor-pointer transition-colors border-b border-gray-50 hover:bg-gray-50
                  ${activeContactId === contact.id ? 'bg-indigo-50/60 border-indigo-100' : ''}`}
              >
                <div className="relative">
                  <img src={contact.avatar} alt={contact.name} className="w-12 h-12 rounded-full object-cover shadow-sm" />
                  {contact.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className={`font-semibold truncate ${activeContactId === contact.id ? 'text-indigo-900' : 'text-slate-800'}`}>
                      {contact.name}
                    </h3>
                    <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                      {contact.lastMessageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className={`text-sm truncate ${contact.unreadCount > 0 ? 'font-medium text-slate-800' : 'text-gray-500'}`}>
                    {contact.lastMessage}
                  </p>
                </div>

                {contact.unreadCount > 0 && (
                  <div className="min-w-[20px] h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1.5 shadow-sm shadow-red-200">
                    {contact.unreadCount}
                  </div>
                )}
              </div>
            ))}

            {filteredContacts.length === 0 && (
                <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                    <p>No contacts found</p>
                </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};