import { Contact, Message, Platform, MessageType, SearchResult } from '../types';
import { MOCK_CONTACTS, INITIAL_MESSAGES } from '../constants';
import { generateSmartReply } from './geminiService';
import { whatsappClient } from './whatsappClient';
import { facebookClient } from './facebookClient';

// TOGGLE THIS TO TRUE WHEN YOU HAVE A BACKEND SERVER RUNNING
const USE_REAL_API = false;
const API_BASE_URL = 'http://localhost:3000/api'; // Your Backend URL

// Simulating a backend database delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class PlatformService {
  private connectedPlatforms: Record<Platform, boolean> = {
    whatsapp: whatsappClient.isConfigured(),
    instagram: facebookClient.isConfigured(),
    messenger: facebookClient.isConfigured(),
    linkedin: true,
  };

  private contacts: Contact[] = [...MOCK_CONTACTS];
  private messages: Record<string, Message[]> = { ...INITIAL_MESSAGES };

  // ============================================================
  // AUTHENTICATION & CONNECTION
  // ============================================================

  async toggleConnection(platform: Platform): Promise<boolean> {
    if (USE_REAL_API) {
      try {
        // 1. Redirect user to your backend to start OAuth flow (Facebook/LinkedIn Login)
        // window.location.href = `${API_BASE_URL}/auth/${platform}`;
        
        // 2. Or call an endpoint to disconnect
        const response = await fetch(`${API_BASE_URL}/auth/${platform}/toggle`, { method: 'POST' });
        const data = await response.json();
        return data.isConnected;
      } catch (e) {
        console.error("Auth Error", e);
        return false;
      }
    }

    // Mock Implementation
    await delay(1500); 
    this.connectedPlatforms[platform] = !this.connectedPlatforms[platform];
    return this.connectedPlatforms[platform];
  }

  async getConnectionStatus(): Promise<Record<Platform, boolean>> {
    if (USE_REAL_API) {
      const res = await fetch(`${API_BASE_URL}/status`);
      return await res.json();
    }
    
    await delay(500);

    // Sync mock status with actual client configuration
    if (!whatsappClient.isConfigured()) {
        this.connectedPlatforms.whatsapp = false;
    }
    if (!facebookClient.isConfigured()) {
        this.connectedPlatforms.messenger = false;
        this.connectedPlatforms.instagram = false;
    }

    return { ...this.connectedPlatforms };
  }

  // ============================================================
  // DATA FETCHING
  // ============================================================

  async getContacts(platform: Platform): Promise<Contact[]> {
    // REAL DATA INTEGRATION FOR FACEBOOK/INSTAGRAM
    if ((platform === 'messenger' || platform === 'instagram') && facebookClient.isConfigured()) {
       try {
          console.log(`Fetching real ${platform} contacts from Graph API...`);
          return await facebookClient.getConversations(platform);
       } catch (error) {
          console.error(`Failed to fetch real ${platform} contacts:`, error);
          // Fallback to mock data if fetch fails (e.g. token expired)
       }
    }

    if (USE_REAL_API) {
      // GET /api/contacts?platform=whatsapp
      const res = await fetch(`${API_BASE_URL}/contacts?platform=${platform}`);
      return await res.json();
    }

    await delay(800); 
    if (!this.connectedPlatforms[platform]) {
      throw new Error(`Platform ${platform} is not connected`);
    }
    return this.contacts.filter(c => c.platform === platform);
  }

  async getMessages(contactId: string): Promise<Message[]> {
    // REAL DATA INTEGRATION FOR FACEBOOK/INSTAGRAM
    // We assume that real Graph API IDs are usually long numerical strings, whereas our mocks are short '1', '2'
    if (facebookClient.isConfigured() && contactId.length > 5) {
       try {
         return await facebookClient.getMessages(contactId);
       } catch (error) {
         console.error("Failed to fetch real messages:", error);
       }
    }

    if (USE_REAL_API) {
      // GET /api/messages?contactId=123
      const res = await fetch(`${API_BASE_URL}/messages/${contactId}`);
      return await res.json();
    }

    await delay(600);
    return this.messages[contactId] || [];
  }

  // ============================================================
  // SEARCH
  // ============================================================

  async searchGlobal(query: string, filters: MessageType[] = []): Promise<SearchResult[]> {
    if (USE_REAL_API) {
      // GET /api/search?q=hello&type=image
      const params = new URLSearchParams({ q: query, filters: filters.join(',') });
      const res = await fetch(`${API_BASE_URL}/search?${params}`);
      return await res.json();
    }

    await delay(600); 
    
    const results: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();

    // 1. Search Contacts
    if (filters.length === 0 || filters.includes('text')) {
       this.contacts.forEach(contact => {
         if (this.connectedPlatforms[contact.platform] && contact.name.toLowerCase().includes(lowerQuery)) {
           results.push({
             id: `contact-${contact.id}`,
             type: 'contact',
             contact: contact,
             matchType: 'name'
           });
         }
       });
    }

    // 2. Search Messages
    Object.entries(this.messages).forEach(([contactId, msgs]) => {
      const contact = this.contacts.find(c => c.id === contactId);
      if (!contact || !this.connectedPlatforms[contact.platform]) return;

      msgs.forEach(msg => {
        if (filters.length > 0 && msg.type && !filters.includes(msg.type)) return;

        let matchesQuery = false;
        if (!query) {
             matchesQuery = true; 
        } else {
             if (msg.text && msg.text.toLowerCase().includes(lowerQuery)) matchesQuery = true;
             if (msg.fileName && msg.fileName.toLowerCase().includes(lowerQuery)) matchesQuery = true;
        }
        
        if (matchesQuery) {
          results.push({
            id: `msg-${msg.id}`,
            type: 'message',
            contact: contact,
            message: msg,
            matchType: msg.type
          });
        }
      });
    });

    return results;
  }

  // ============================================================
  // ACTIONS (SEND / REACT)
  // ============================================================

  async reactToMessage(contactId: string, messageId: string, emoji: string): Promise<Message[]> {
    if (USE_REAL_API) {
        // POST /api/messages/react
        await fetch(`${API_BASE_URL}/messages/${messageId}/react`, {
            method: 'POST',
            body: JSON.stringify({ emoji })
        });
        // Optimistically update or fetch fresh
    }

    await delay(200); 
    
    const msgs = this.messages[contactId];
    if (!msgs) return [];

    const msgIndex = msgs.findIndex(m => m.id === messageId);
    if (msgIndex === -1) return msgs;

    const msg = msgs[msgIndex];
    if (!msg.reactions) msg.reactions = [];

    const existingReactionIndex = msg.reactions.findIndex(r => r.emoji === emoji);

    if (existingReactionIndex > -1) {
      const reaction = msg.reactions[existingReactionIndex];
      if (reaction.userReacted) {
        reaction.count--;
        reaction.userReacted = false;
        if (reaction.count <= 0) {
          msg.reactions.splice(existingReactionIndex, 1);
        }
      } else {
        reaction.count++;
        reaction.userReacted = true;
      }
    } else {
      msg.reactions.push({ emoji, count: 1, userReacted: true });
    }

    return [...msgs];
  }

  async sendMessage(contactId: string, text: string, platform: Platform, contactName: string, role?: string, replyToMessage?: Message): Promise<Message> {
    
    // INTEGRATION POINT: WhatsApp Cloud API
    if (platform === 'whatsapp' && whatsappClient.isConfigured()) {
       const mockPhoneNumber = "15551234567"; 
       try {
          await whatsappClient.sendText(mockPhoneNumber, text, replyToMessage?.id);
       } catch (e) {
          console.error("Failed to send via WhatsApp Cloud API", e);
       }
    } 
    // INTEGRATION POINT: Facebook/Instagram
    else if ((platform === 'messenger' || platform === 'instagram') && facebookClient.isConfigured()) {
        console.log(`Sending message to ${platform} via Graph API`);
        // Actual Graph API call would go here: facebookClient.sendMessage(...)
    }
    else if (USE_REAL_API) {
        // POST /api/messages/send
        const res = await fetch(`${API_BASE_URL}/messages/send`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contactId,
                platform,
                text,
                replyToId: replyToMessage?.id
            })
        });
        return await res.json();
    }

    await delay(300); 
    
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'me',
      timestamp: new Date(),
      status: 'sent',
      type: 'text',
      replyTo: replyToMessage ? {
        id: replyToMessage.id,
        text: replyToMessage.text || (replyToMessage.type === 'image' ? 'Photo' : replyToMessage.type as string),
        sender: replyToMessage.sender,
        type: replyToMessage.type
      } : undefined
    };

    if (!this.messages[contactId]) this.messages[contactId] = [];
    this.messages[contactId].push(newMessage);

    setTimeout(() => { newMessage.status = 'delivered'; }, 1000);

    // Simulate AI Reply because we aren't connected to real WhatsApp
    this.simulateIncomingReply(contactId, platform, contactName, role);

    return newMessage;
  }

  // ============================================================
  // INTERNAL SIMULATION HELPERS
  // ============================================================

  private async simulateIncomingReply(contactId: string, platform: Platform, contactName: string, role?: string) {
    const history = this.messages[contactId];
    const typingDelay = 2000 + Math.random() * 2000; 
    
    setTimeout(async () => {
      try {
        const replyText = await generateSmartReply(history, contactName, platform, role);
        
        const replyMessage: Message = {
            id: Date.now().toString(),
            text: replyText,
            sender: 'other',
            timestamp: new Date(),
            type: 'text'
        };

        this.messages[contactId].push(replyMessage);
        
        // This emulates a WebSocket event coming from your backend
        window.dispatchEvent(new CustomEvent('new-message', { detail: { contactId, message: replyMessage } }));

      } catch (e) {
        console.error("Failed to generate reply", e);
      }
    }, typingDelay);
  }
}

export const platformService = new PlatformService();