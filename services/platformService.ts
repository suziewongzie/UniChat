import { Contact, Message, Platform, MessageType, SearchResult } from '../types';
import { MOCK_CONTACTS, INITIAL_MESSAGES } from '../constants';
import { generateSmartReply } from './geminiService';

// Simulating a backend database delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class PlatformService {
  private connectedPlatforms: Record<Platform, boolean> = {
    whatsapp: true,
    instagram: true,
    messenger: true,
    linkedin: true,
  };

  private contacts: Contact[] = [...MOCK_CONTACTS];
  private messages: Record<string, Message[]> = { ...INITIAL_MESSAGES };

  // Simulate OAuth Connection Flow
  async toggleConnection(platform: Platform): Promise<boolean> {
    await delay(1500); // Simulate network request/OAuth popup time
    this.connectedPlatforms[platform] = !this.connectedPlatforms[platform];
    return this.connectedPlatforms[platform];
  }

  async getConnectionStatus(): Promise<Record<Platform, boolean>> {
    await delay(500);
    return { ...this.connectedPlatforms };
  }

  // Simulate fetching contacts from an API
  async getContacts(platform: Platform): Promise<Contact[]> {
    await delay(800); // Simulate API latency
    if (!this.connectedPlatforms[platform]) {
      throw new Error(`Platform ${platform} is not connected`);
    }
    return this.contacts.filter(c => c.platform === platform);
  }

  // Simulate fetching message history
  async getMessages(contactId: string): Promise<Message[]> {
    await delay(600);
    return this.messages[contactId] || [];
  }

  // Global Search Function
  async searchGlobal(query: string, filters: MessageType[] = []): Promise<SearchResult[]> {
    await delay(600); // Simulate search latency
    
    const results: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();

    // 1. Search Contacts (only if no specific media filters or if text filter is present)
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
        // Filter by Type
        if (filters.length > 0 && msg.type && !filters.includes(msg.type)) {
          return;
        }

        // Filter by Text Query
        let matchesQuery = false;
        if (!query) {
             matchesQuery = true; // If no query, return everything matching the filter
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

  // Simulate reacting to a message
  async reactToMessage(contactId: string, messageId: string, emoji: string): Promise<Message[]> {
    await delay(200); // Small network delay
    
    const msgs = this.messages[contactId];
    if (!msgs) return [];

    const msgIndex = msgs.findIndex(m => m.id === messageId);
    if (msgIndex === -1) return msgs;

    const msg = msgs[msgIndex];
    if (!msg.reactions) msg.reactions = [];

    const existingReactionIndex = msg.reactions.findIndex(r => r.emoji === emoji);

    if (existingReactionIndex > -1) {
      const reaction = msg.reactions[existingReactionIndex];
      // Toggle logic
      if (reaction.userReacted) {
        reaction.count--;
        reaction.userReacted = false;
        // Remove if count 0
        if (reaction.count <= 0) {
          msg.reactions.splice(existingReactionIndex, 1);
        }
      } else {
        reaction.count++;
        reaction.userReacted = true;
      }
    } else {
      // Add new reaction
      msg.reactions.push({ emoji, count: 1, userReacted: true });
    }

    // Return a shallow copy of messages to trigger re-renders
    return [...msgs];
  }

  // Simulate sending a message to the real platform API
  async sendMessage(contactId: string, text: string, platform: Platform, contactName: string, role?: string, replyToMessage?: Message): Promise<Message> {
    await delay(300); // Simulate sending to server
    
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

    // Store in "DB"
    if (!this.messages[contactId]) this.messages[contactId] = [];
    this.messages[contactId].push(newMessage);

    // Simulate "Delivered" status update after a moment
    setTimeout(() => {
        newMessage.status = 'delivered';
    }, 1000);

    // Trigger AI Reply Simulation (in a real app, this would be a webhook event coming back from the platform)
    this.simulateIncomingReply(contactId, platform, contactName, role);

    return newMessage;
  }

  // Helper to simulate receiving a webhook event from the platform
  private async simulateIncomingReply(contactId: string, platform: Platform, contactName: string, role?: string) {
    const history = this.messages[contactId];
    // Artificial delay for "other person typing"
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
        
        // Dispatch custom event so React knows to update (Simulating WebSocket/Subscription)
        window.dispatchEvent(new CustomEvent('new-message', { detail: { contactId, message: replyMessage } }));

      } catch (e) {
        console.error("Failed to generate reply", e);
      }
    }, typingDelay);
  }
}

export const platformService = new PlatformService();