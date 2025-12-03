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