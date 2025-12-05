import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { ContactList } from './components/ContactList';
import { ChatArea } from './components/ChatArea';
import { SettingsView } from './components/SettingsView';
import { GlobalSearchPanel } from './components/GlobalSearchPanel';
import { Platform, Contact, Message } from './types';
import { platformService } from './services/platformService';
import { whatsappClient } from './services/whatsappClient';

type ViewMode = 'chat' | 'settings' | 'search';

const App: React.FC = () => {
  const [activePlatform, setActivePlatform] = useState<Platform>('whatsapp');
  const [activeContact, setActiveContact] = useState<Contact | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('chat');
  
  // Data States
  const [connectedPlatforms, setConnectedPlatforms] = useState<Record<Platform, boolean>>({
    whatsapp: whatsappClient.isConfigured(), 
    instagram: true, 
    messenger: true, 
    linkedin: true
  });
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  
  // UI States
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Initial Load
  useEffect(() => {
    const loadSettings = async () => {
      const status = await platformService.getConnectionStatus();
      setConnectedPlatforms(status);
    };
    loadSettings();
  }, []);

  // Load Contacts when Platform Changes
  useEffect(() => {
    const fetchContacts = async () => {
      if (!connectedPlatforms[activePlatform]) {
        setContacts([]);
        return;
      }
      
      setIsLoadingContacts(true);
      try {
        const data = await platformService.getContacts(activePlatform);
        setContacts(data);
      } catch (error) {
        console.error("Failed to load contacts", error);
      } finally {
        setIsLoadingContacts(false);
      }
    };

    fetchContacts();
    // Only reset active contact if we are NOT coming from a global search selection
    // In a real app, logic would be more complex, for this mock we just check if the contact matches current platform
    if (activeContact && activeContact.platform !== activePlatform) {
       setActiveContact(null);
    }
  }, [activePlatform, connectedPlatforms]);

  // Load Messages when Contact Changes
  useEffect(() => {
    if (!activeContact) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      const msgs = await platformService.getMessages(activeContact.id);
      setMessages(msgs);
    };

    fetchMessages();
  }, [activeContact]);

  // Listen for simulated "real-time" incoming messages
  useEffect(() => {
    const handleNewMessage = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { contactId, message } = customEvent.detail;
      
      if (activeContact?.id === contactId) {
        setMessages(prev => [...prev, message]);
        setIsTyping(false);
      }
      
      // Update contact list preview
      setContacts(prev => prev.map(c => {
        if (c.id === contactId) {
          return {
            ...c,
            lastMessage: message.text,
            lastMessageTime: message.timestamp,
            unreadCount: activeContact?.id === contactId ? 0 : c.unreadCount + 1
          };
        }
        return c;
      }));
    };

    window.addEventListener('new-message', handleNewMessage);
    return () => window.removeEventListener('new-message', handleNewMessage);
  }, [activeContact]);

  const handlePlatformChange = (platform: Platform) => {
    setActivePlatform(platform);
    setViewMode('chat');
  };

  const handleTogglePlatform = async (platform: Platform) => {
    const newState = await platformService.toggleConnection(platform);
    setConnectedPlatforms(prev => ({ ...prev, [platform]: newState }));
  };

  const handleSendMessage = async (text: string, replyTo?: Message) => {
    if (!activeContact) return;

    // Optimistic Update
    const tempMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'me',
      timestamp: new Date(),
      status: 'sent',
      type: 'text',
      replyTo: replyTo ? {
        id: replyTo.id,
        text: replyTo.text || (replyTo.type === 'image' ? 'Photo' : replyTo.type as string),
        sender: replyTo.sender,
        type: replyTo.type
      } : undefined
    };
    setMessages(prev => [...prev, tempMessage]);
    
    // Show typing indicator for the "AI" reply
    setIsTyping(true);

    try {
      await platformService.sendMessage(
        activeContact.id, 
        text, 
        activePlatform, 
        activeContact.name, 
        activeContact.role,
        replyTo
      );
    } catch (error) {
      console.error("Failed to send", error);
      setIsTyping(false);
    }
  };

  const handleMessageReaction = async (messageId: string, emoji: string) => {
    if (!activeContact) return;
    try {
      const updatedMessages = await platformService.reactToMessage(activeContact.id, messageId, emoji);
      setMessages(updatedMessages);
    } catch (error) {
      console.error("Failed to react", error);
    }
  };

  const handleSearchResultSelect = (contact: Contact, messageId?: string) => {
      setActivePlatform(contact.platform);
      setActiveContact(contact);
      setViewMode('chat');
      // In a real app, we would scroll to the specific messageId here
  };

  const isPlatformConnected = connectedPlatforms[activePlatform];

  return (
    <div className="flex w-full h-screen bg-white overflow-hidden font-sans">
      <div className={`
        ${(activeContact && viewMode === 'chat') ? 'hidden md:flex' : 'flex'} 
        h-full flex-shrink-0 z-30
      `}>
        <Sidebar 
          activePlatform={activePlatform} 
          isSettingsOpen={viewMode === 'settings'}
          isSearchOpen={viewMode === 'search'}
          onSelectPlatform={handlePlatformChange}
          onOpenSettings={() => {
            setViewMode('settings');
            setActiveContact(null);
          }}
          onOpenSearch={() => {
             setViewMode('search');
             setActiveContact(null);
          }}
        />
      </div>

      {viewMode === 'settings' ? (
        <SettingsView 
          connectedPlatforms={connectedPlatforms}
          onTogglePlatform={handleTogglePlatform}
          onClose={() => setViewMode('chat')}
        />
      ) : viewMode === 'search' ? (
        <div className="flex-1 flex h-full">
           <GlobalSearchPanel 
              onClose={() => setViewMode('chat')}
              onSelectResult={handleSearchResultSelect}
           />
           {/* Show empty state on the right or the chat if previously selected, 
               but for this design we keep it simple or hide right side on mobile */}
           <div className="hidden md:flex flex-1 bg-gray-50 items-center justify-center text-gray-400">
               Select a result to view conversation
           </div>
        </div>
      ) : (
        <>
          <div className={`
            ${activeContact ? 'hidden md:flex' : 'flex w-full'} 
            md:w-auto h-full z-20
          `}>
            <ContactList
              platform={activePlatform}
              contacts={contacts}
              isLoading={isLoadingContacts}
              activeContactId={activeContact?.id || null}
              isConnected={isPlatformConnected}
              onSelectContact={setActiveContact}
              onOpenSettings={() => setViewMode('settings')}
            />
          </div>

          {isPlatformConnected && (
             <div className={`
                ${activeContact ? 'flex w-full' : 'hidden md:flex'} 
                flex-1 h-full
              `}>
                <ChatArea 
                    contact={activeContact}
                    messages={messages}
                    isTyping={isTyping}
                    onSendMessage={handleSendMessage}
                    onBack={() => setActiveContact(null)}
                    onReaction={handleMessageReaction}
                />
              </div>
          )}
        </>
      )}
    </div>
  );
};

export default App;