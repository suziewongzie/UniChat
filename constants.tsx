import React from 'react';
import { Contact, Platform, PlatformConfig, Message } from './types';

// Icons
export const Icons = {
  WhatsApp: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 20.15C10.56 20.15 9.1 19.75 7.82 18.99L7.51 18.81L4.4 19.63L5.23 16.59L5.03 16.27C4.22 14.97 3.79 13.46 3.79 11.91C3.79 7.37 7.49 3.67 12.04 3.67C14.24 3.67 16.31 4.53 17.87 6.09C19.43 7.65 20.29 9.72 20.29 11.92C20.29 16.46 16.59 20.15 12.05 20.15Z" />
      <path d="M16.92 14.89C16.65 14.76 15.33 14.11 15.08 13.98C14.84 13.86 14.66 13.79 14.49 14.05C14.31 14.31 13.8 14.91 13.65 15.09C13.49 15.27 13.33 15.29 13.06 15.16C12.79 15.02 11.92 14.73 10.89 13.81C10.08 13.09 9.54 12.2 9.4 11.94C9.26 11.67 9.39 11.54 9.52 11.41C9.64 11.29 9.79 11.09 9.92 10.94C10.06 10.78 10.1 10.67 10.19 10.49C10.28 10.31 10.24 10.15 10.17 10.02C10.11 9.89 9.58 8.58 9.35 8.05C9.13 7.54 8.91 7.61 8.75 7.61C8.6 7.6 8.42 7.6 8.24 7.6C8.06 7.6 7.77 7.67 7.52 7.94C7.27 8.21 6.57 8.87 6.57 10.21C6.57 11.55 7.54 12.84 7.68 13.03C7.82 13.22 9.61 15.98 12.35 17.16C13 17.44 13.51 17.61 13.91 17.74C14.57 17.95 15.17 17.92 15.65 17.85C16.18 17.77 17.29 17.18 17.52 16.53C17.75 15.88 17.75 15.33 17.68 15.21C17.61 15.09 17.43 15.02 17.16 14.89H16.92Z" />
    </svg>
  ),
  Instagram: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.069-4.85.069-3.204 0-3.584-.012-4.849-.069-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  ),
  Messenger: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12 2C6.48 2 2 6.03 2 11C2 13.66 3.39 16.04 5.55 17.59C5.64 17.65 5.69 17.75 5.67 17.86L5.33 20.89C5.3 21.2 5.65 21.43 5.92 21.25L9.36 19.46C9.44 19.42 9.53 19.41 9.61 19.42C10.38 19.55 11.18 19.63 12 19.63C17.52 19.63 22 15.6 22 10.63C22 5.66 17.52 2 12 2ZM13.06 14.28L10.83 11.9L6.49 14.28C6.18 14.45 5.85 14.07 6.04 13.78L8.91 9.28C9.07 9.03 9.4 8.97 9.64 9.15L11.87 10.82L16.2 8.44C16.51 8.27 16.84 8.65 16.65 8.94L13.78 13.44C13.62 13.69 13.29 13.75 13.05 13.57L13.06 14.28Z" />
    </svg>
  ),
  LinkedIn: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  ),
  Search: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
    </svg>
  ),
  Settings: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 00-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 00-2.282.819l-.922 1.597a1.875 1.875 0 00.432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 000 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 00-.432 2.385l.922 1.597a1.875 1.875 0 002.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 002.28-.819l.922-1.597a1.875 1.875 0 00-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 000-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 00-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 00-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 00-1.85-1.567h-1.843zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" clipRule="evenodd" />
    </svg>
  ),
  Phone: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
    </svg>
  ),
  Video: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M4.5 4.5a3 3 0 00-3 3v9a3 3 0 003 3h8.25a3 3 0 003-3v-9a3 3 0 00-3-3H4.5zM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06z" />
    </svg>
  ),
  More: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path fillRule="evenodd" d="M10.5 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm0 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm0 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" clipRule="evenodd" />
    </svg>
  ),
  Paperclip: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path fillRule="evenodd" d="M18.97 3.659a2.25 2.25 0 00-3.182 0l-10.94 10.94a3.75 3.75 0 105.304 5.303l7.693-7.693a.75.75 0 011.06 1.06l-7.693 7.693a5.25 5.25 0 11-7.424-7.424l10.939-10.94a3.75 3.75 0 115.303 5.304L9.097 18.835l-.008.008-.007.007-.002.002-.003.002A2.25 2.25 0 015.91 15.66l7.81-7.81a.75.75 0 011.061 1.06l-7.81 7.81a.75.75 0 001.054 1.068L18.97 6.84a2.25 2.25 0 000-3.182z" clipRule="evenodd" />
    </svg>
  ),
  Microphone: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
      <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" />
    </svg>
  ),
  Emoji: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-2.625 6c-.54 0-.828.419-.936.634a1.96 1.96 0 00-.189.866c0 .298.059.605.189.866.108.215.395.634.936.634.54 0 .828-.419.936-.634.13-.26.189-.568.189-.866 0-.298-.059-.605-.189-.866-.108-.215-.395-.634-.936-.634zm4.314.634c.108-.215.395-.634.936-.634.54 0 .828.419.936.634.13.26.189.568.189.866 0 .298-.059.605-.189.866-.108.215-.395.634-.936.634-.54 0-.828-.419-.936-.634a1.96 1.96 0 01-.189-.866c0-.298.059-.605.189-.866zm2.023 6.828a.75.75 0 10-1.06-1.06 3.75 3.75 0 01-5.304 0 .75.75 0 00-1.06 1.06 5.25 5.25 0 007.424 0z" clipRule="evenodd" />
    </svg>
  ),
  Send: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
    </svg>
  ),
  Document: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z" clipRule="evenodd" />
      <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
    </svg>
  ),
  Link: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path fillRule="evenodd" d="M19.902 4.098a3.75 3.75 0 00-5.304 0l-4.5 4.5a3.75 3.75 0 001.035 6.037.75.75 0 01-.646 1.353 5.25 5.25 0 01-1.449-8.45l4.5-4.5a5.25 5.25 0 117.424 7.424l-1.757 1.757a.75.75 0 11-1.06-1.06l1.757-1.757a3.75 3.75 0 000-5.304zm-7.346 10.7l-1.757 1.757a3.75 3.75 0 01-5.304 0 3.75 3.75 0 010-5.303l4.5-4.5a.75.75 0 00-1.06-1.061l-4.5 4.5a5.25 5.25 0 007.424 7.424l1.757-1.757a.75.75 0 00-1.06-1.06z" clipRule="evenodd" />
    </svg>
  ),
  Photo: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
    </svg>
  ),
  Audio: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.805l-1.067 3.557a1.875 1.875 0 001.795 2.413h1.832l4.5 4.5c.944.945 2.56.276 2.56-1.06V4.06zM17.78 9.22a.75.75 0 10-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 001.06 1.06l1.72-1.72a.75.75 0 000-1.06l-1.72-1.72z" />
    </svg>
  ),
  Reply: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-4.28 9.22a.75.75 0 000 1.06l3 3a.75.75 0 101.06-1.06l-1.72-1.72h5.69a.75.75 0 000-1.5h-5.69l1.72-1.72a.75.75 0 00-1.06-1.06l-3 3z" clipRule="evenodd" />
    </svg>
  ),
  Close: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
    </svg>
  )
};

export const PLATFORMS: PlatformConfig[] = [
  { id: 'whatsapp', name: 'WhatsApp', color: 'bg-green-500', icon: Icons.WhatsApp },
  { id: 'instagram', name: 'Instagram', color: 'bg-pink-500', icon: Icons.Instagram },
  { id: 'messenger', name: 'Messenger', color: 'bg-blue-500', icon: Icons.Messenger },
  { id: 'linkedin', name: 'LinkedIn', color: 'bg-blue-700', icon: Icons.LinkedIn },
];

export const MOCK_CONTACTS: Contact[] = [
  { id: '1', name: 'Jane Doe', avatar: 'https://i.pravatar.cc/150?u=1', platform: 'whatsapp', lastMessage: 'See you tomorrow! 👋', lastMessageTime: new Date(Date.now() - 1000 * 60 * 5), unreadCount: 2, isOnline: true },
  { id: '2', name: 'John Smith', avatar: 'https://i.pravatar.cc/150?u=2', platform: 'whatsapp', lastMessage: 'Can you send the file?', lastMessageTime: new Date(Date.now() - 1000 * 60 * 60), unreadCount: 0, isOnline: false },
  { id: '3', name: 'Sarah Connor', avatar: 'https://i.pravatar.cc/150?u=3', platform: 'instagram', lastMessage: 'Loved your story! 🔥', lastMessageTime: new Date(Date.now() - 1000 * 60 * 15), unreadCount: 1, isOnline: true },
  { id: '4', name: 'Mike Ross', avatar: 'https://i.pravatar.cc/150?u=4', platform: 'messenger', lastMessage: 'Are we still on for lunch?', lastMessageTime: new Date(Date.now() - 1000 * 60 * 120), unreadCount: 0, isOnline: true },
  { id: '5', name: 'Rachel Green', avatar: 'https://i.pravatar.cc/150?u=5', platform: 'linkedin', lastMessage: 'Thanks for connecting.', lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24), unreadCount: 0, isOnline: false, role: 'Product Manager at TechCorp' },
  { id: '6', name: 'Bruce Wayne', avatar: 'https://i.pravatar.cc/150?u=6', platform: 'linkedin', lastMessage: 'I have a proposal for you.', lastMessageTime: new Date(Date.now() - 1000 * 60 * 30), unreadCount: 3, isOnline: true, role: 'CEO at Wayne Enterprises' },
];

export const INITIAL_MESSAGES: Record<string, Message[]> = {
  '1': [
    { id: '101', text: 'Hey, are we still meeting?', sender: 'other', timestamp: new Date(Date.now() - 1000 * 60 * 60), type: 'text' },
    { id: '102', text: 'Yes, absolutely!', sender: 'me', timestamp: new Date(Date.now() - 1000 * 60 * 55), type: 'text', status: 'read' },
    { id: '103', text: 'Great, see you then.', sender: 'other', timestamp: new Date(Date.now() - 1000 * 60 * 50), type: 'text' },
    { id: '104', text: 'Here is the location', sender: 'other', timestamp: new Date(Date.now() - 1000 * 60 * 50), type: 'link', mediaUrl: 'https://maps.google.com' },
    { id: '105', text: 'See you tomorrow! 👋', sender: 'other', timestamp: new Date(Date.now() - 1000 * 60 * 5), type: 'text' },
  ],
  '3': [
    { id: '201', text: 'Look at this!', sender: 'other', timestamp: new Date(Date.now() - 1000 * 60 * 30), type: 'image', mediaUrl: 'https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?q=80&w=2070&auto=format&fit=crop' },
    { id: '202', text: 'Wow that looks amazing!', sender: 'me', timestamp: new Date(Date.now() - 1000 * 60 * 28), type: 'text', status: 'read' },
    { id: '203', text: 'Loved your story! 🔥', sender: 'other', timestamp: new Date(Date.now() - 1000 * 60 * 15), type: 'text' },
  ],
  '5': [
     { id: '301', text: 'Hello, I saw your profile and wanted to connect.', sender: 'other', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25), type: 'text' },
     { id: '302', text: 'Hi Rachel, nice to meet you!', sender: 'me', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24.5), type: 'text', status: 'read' },
     { id: '303', text: 'Resume.pdf', sender: 'other', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), type: 'document', fileName: 'Resume_2024.pdf' },
  ]
};