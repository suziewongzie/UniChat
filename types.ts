import React from 'react';

export type Platform = 'whatsapp' | 'instagram' | 'messenger' | 'linkedin';

export type MessageType = 'text' | 'image' | 'video' | 'audio' | 'document' | 'link';

export interface Reaction {
  emoji: string;
  count: number;
  userReacted: boolean;
}

export interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  timestamp: Date;
  status?: 'sent' | 'delivered' | 'read';
  reactions?: Reaction[];
  type?: MessageType;
  mediaUrl?: string;
  fileName?: string;
  replyTo?: {
    id: string;
    text: string;
    sender: 'me' | 'other';
    type?: MessageType;
  };
}

export interface Contact {
  id: string;
  name: string;
  avatar: string;
  platform: Platform;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isOnline: boolean;
  role?: string; // For LinkedIn mostly
  phoneNumber?: string; // Required for WhatsApp integration
}

export interface ChatSession {
  contactId: string;
  messages: Message[];
}

export interface PlatformConfig {
  id: Platform;
  name: string;
  color: string;
  icon: React.ReactNode;
}

export interface SearchResult {
  id: string;
  type: 'contact' | 'message';
  contact: Contact;
  message?: Message;
  matchType?: MessageType | 'name';
}

// WhatsApp Cloud API Specific Types
export interface WhatsAppCredentials {
  phoneNumberId: string;
  accessToken: string;
  businessAccountId?: string;
}

export interface WhatsAppPayload {
  messaging_product: "whatsapp";
  to: string;
  type: "text" | "template" | "image" | "document" | "audio" | "video";
  text?: { body: string; preview_url?: boolean };
  template?: { 
    name: string; 
    language: { code: string };
    components?: any[];
  };
  image?: { link: string; caption?: string };
  document?: { link: string; caption?: string; filename?: string };
  context?: { message_id: string }; // For replies
}

// Facebook/Instagram Specific Types
export interface FacebookCredentials {
  appId: string;
  userAccessToken?: string; // Generated via Login
  pageId?: string; // The selected page
  instagramId?: string; // The linked IG account
}

export interface MetaConversation {
  id: string;
  updated_time: string;
  participants?: {
    data: { id: string; name: string }[];
  };
  messages?: {
    data: { message: string; created_time: string }[];
  };
  snippet?: string;
  unread_count?: number;
}

export interface MetaMessage {
  id: string;
  message?: string;
  created_time: string;
  from: { id: string; name: string; email?: string };
  attachments?: {
    data: Array<{
      image_data?: { url: string };
      video_data?: { url: string };
      file_url?: string;
      name?: string;
      mime_type?: string;
    }>;
  };
}