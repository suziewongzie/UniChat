import React, { useEffect, useRef, useState } from 'react';
import { Contact, Message } from '../types';
import { Icons } from '../constants';

interface ChatAreaProps {
  contact: Contact | null;
  messages: Message[];
  isTyping: boolean;
  onSendMessage: (text: string, replyTo?: Message) => void;
  onBack: () => void;
  onReaction: (messageId: string, emoji: string) => void;
}

const QUICK_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '😡'];

export const ChatArea: React.FC<ChatAreaProps> = ({ 
  contact, 
  messages, 
  isTyping, 
  onSendMessage, 
  onBack,
  onReaction 
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [activeReactionMessageId, setActiveReactionMessageId] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, replyingTo]);

  // Click outside to close reaction picker
  useEffect(() => {
    const handleClickOutside = () => setActiveReactionMessageId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    // Initialize Speech Recognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        
        recognition.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              transcript += event.results[i][0].transcript + ' ';
            }
          }
          const currentTranscript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join('');
            
          setInputValue(currentTranscript);
        };

        recognition.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          if (event.error === 'not-allowed') {
             setIsListening(false);
          }
        };
        
        recognition.onend = () => {
           if (isListening) {
             setIsListening(false);
           }
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleListening = async () => {
    if (!recognitionRef.current) {
      alert("Voice input is not supported in this browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());

        setInputValue(''); 
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error("Microphone access denied:", err);
        alert("Microphone access is required for voice input. Please allow access in your browser settings.");
        setIsListening(false);
      }
    }
  };

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue, replyingTo || undefined);
      setInputValue('');
      setReplyingTo(null);
      if (isListening) {
         recognitionRef.current.stop();
         setIsListening(false);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReactionClick = (e: React.MouseEvent, messageId: string, emoji: string) => {
    e.stopPropagation(); // Prevent closing immediately due to window listener
    onReaction(messageId, emoji);
    setActiveReactionMessageId(null);
  };

  const toggleReactionPicker = (e: React.MouseEvent, messageId: string) => {
    e.stopPropagation();
    setActiveReactionMessageId(activeReactionMessageId === messageId ? null : messageId);
  };

  const initiateReply = (e: React.MouseEvent, message: Message) => {
    e.stopPropagation();
    setReplyingTo(message);
    const inputElement = document.querySelector('textarea') as HTMLTextAreaElement;
    inputElement?.focus();
  };

  const scrollToMessage = (messageId: string) => {
    const el = document.getElementById(`msg-${messageId}`);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('bg-indigo-50/50');
        setTimeout(() => el.classList.remove('bg-indigo-50/50'), 1000);
    }
  };

  const renderMessageContent = (msg: Message) => {
    switch (msg.type) {
      case 'image':
        return (
          <div className="flex flex-col gap-2">
            <img src={msg.mediaUrl} alt="Sent attachment" className="rounded-lg max-w-full h-auto max-h-60 object-cover" />
            {msg.text && <p>{msg.text}</p>}
          </div>
        );
      case 'document':
        return (
          <div className="flex items-center gap-3 bg-opacity-20 bg-black/5 p-2 rounded-lg">
             <div className="w-8 h-8 bg-white rounded flex items-center justify-center text-indigo-600">
                {Icons.Document}
             </div>
             <div className="flex flex-col">
                <span className="font-medium underline truncate max-w-[150px]">{msg.fileName}</span>
                <span className="text-[10px] opacity-70">PDF Document</span>
             </div>
             {msg.text && <p className="mt-1">{msg.text}</p>}
          </div>
        );
      case 'link':
         return (
            <div>
               <a href={msg.text} target="_blank" rel="noopener noreferrer" className="text-blue-200 underline break-all">
                  {msg.text}
               </a>
            </div>
         );
      case 'video':
        return (
          <div className="flex flex-col gap-2">
             <div className="bg-black rounded-lg w-full h-32 flex items-center justify-center text-white">
                <span className="w-8 h-8">{Icons.Video}</span>
             </div>
             {msg.text && <p>{msg.text}</p>}
          </div>
        );
      default:
        return <p>{msg.text}</p>;
    }
  };

  if (!contact) {
    return (
      <div className="hidden md:flex flex-1 items-center justify-center flex-col bg-gray-50/50">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 mb-6">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-700">Select a conversation</h3>
        <p className="text-gray-400 mt-2">Choose a contact to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 relative z-0">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>

      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center shadow-sm relative z-10">
        <div className="flex items-center gap-3 flex-1 min-w-0 mr-2">
          <button onClick={onBack} className="md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          
          <img src={contact.avatar} alt={contact.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
          <div className="min-w-0">
            <h3 className="font-bold text-slate-800 text-sm md:text-base truncate">{contact.name}</h3>
            {contact.platform === 'linkedin' && contact.role ? (
               <p className="text-xs text-gray-500 truncate">{contact.role}</p>
            ) : (
                <div className="flex items-center gap-1.5">
                    {contact.isOnline && <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></span>}
                    <p className="text-xs text-gray-500">{contact.isOnline ? 'Online' : 'Offline'}</p>
                </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4 text-indigo-600 flex-shrink-0">
            <button className="p-2 hover:bg-indigo-50 rounded-full transition-colors">{Icons.Phone}</button>
            <button className="p-2 hover:bg-indigo-50 rounded-full transition-colors">{Icons.Video}</button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">{Icons.More}</button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 relative z-10">
        {messages.map((msg, index) => {
            const isSequence = index > 0 && messages[index - 1].sender === msg.sender;
            return (
                <div
                    key={msg.id}
                    id={`msg-${msg.id}`}
                    className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'} group transition-colors duration-500`}
                >
                    <div className="relative max-w-[80%] md:max-w-[65%]">
                        {/* Reaction Picker Popover */}
                        {activeReactionMessageId === msg.id && (
                          <div className={`absolute bottom-full mb-2 z-50 bg-white rounded-full shadow-lg border border-gray-100 p-1 flex items-center gap-1 animate-in fade-in zoom-in duration-200 ${msg.sender === 'me' ? 'right-0' : 'left-0'}`}>
                            {QUICK_REACTIONS.map(emoji => (
                              <button
                                key={emoji}
                                onClick={(e) => handleReactionClick(e, msg.id, emoji)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors text-lg"
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Action Buttons (Reply & React) */}
                        <div className={`absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1
                            ${msg.sender === 'me' ? '-left-16' : '-right-16'}`}
                        >
                            <button
                              onClick={(e) => initiateReply(e, msg)}
                              className="p-1.5 rounded-full bg-gray-100 text-gray-400 hover:text-gray-600 hover:bg-gray-200"
                              title="Reply"
                            >
                                {Icons.Reply}
                            </button>
                            <button
                              onClick={(e) => toggleReactionPicker(e, msg.id)}
                              className="p-1.5 rounded-full bg-gray-100 text-gray-400 hover:text-gray-600 hover:bg-gray-200"
                              title="React"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
                              </svg>
                            </button>
                        </div>

                        {/* Message Bubble */}
                        <div
                        className={`px-4 py-2.5 shadow-sm text-sm md:text-[15px] leading-relaxed relative
                            ${msg.sender === 'me' 
                            ? `bg-indigo-600 text-white rounded-2xl rounded-tr-sm` 
                            : 'bg-white text-slate-800 border border-gray-100 rounded-2xl rounded-tl-sm'}
                            ${isSequence ? 'mt-1' : 'mt-3'}
                        `}
                        >
                            {/* Quoted Message */}
                            {msg.replyTo && (
                              <div 
                                onClick={() => scrollToMessage(msg.replyTo!.id)}
                                className={`mb-2 p-2 rounded-lg text-xs cursor-pointer border-l-4 overflow-hidden opacity-90
                                  ${msg.sender === 'me' 
                                    ? 'bg-indigo-700 border-indigo-300 text-indigo-100' 
                                    : 'bg-gray-100 border-indigo-500 text-gray-600'
                                  }`}
                              >
                                <div className="font-bold mb-0.5">{msg.replyTo.sender === 'me' ? 'You' : contact.name}</div>
                                <div className="truncate">{msg.replyTo.text}</div>
                              </div>
                            )}

                            {renderMessageContent(msg)}
                            <p className={`text-[10px] mt-1 text-right ${msg.sender === 'me' ? 'text-indigo-200' : 'text-gray-400'}`}>
                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                        
                        {/* Display Reactions */}
                        {msg.reactions && msg.reactions.length > 0 && (
                          <div className={`absolute -bottom-3 flex gap-1 ${msg.sender === 'me' ? 'right-0' : 'left-0'}`}>
                            {msg.reactions.map((reaction, i) => (
                              <button
                                key={i}
                                onClick={(e) => handleReactionClick(e, msg.id, reaction.emoji)}
                                className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium shadow-sm border
                                  ${reaction.userReacted 
                                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                                    : 'bg-white border-gray-200 text-gray-600'}
                                `}
                              >
                                <span>{reaction.emoji}</span>
                                {reaction.count > 1 && <span>{reaction.count}</span>}
                              </button>
                            ))}
                          </div>
                        )}
                    </div>
                </div>
            )
        })}
        
        {isTyping && (
             <div className="flex justify-start mt-2">
                <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex gap-1.5 items-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce-slow"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce-slow" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce-slow" style={{ animationDelay: '0.4s' }}></div>
                </div>
             </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-3 md:p-4 relative z-10">
        
        {/* Reply Context Panel */}
        {replyingTo && (
           <div className="max-w-4xl mx-auto mb-2 flex items-center justify-between bg-gray-50 border-l-4 border-indigo-500 p-2 rounded animate-in slide-in-from-bottom-2 duration-200">
              <div className="flex-1 min-w-0 mr-4">
                 <p className="text-xs font-bold text-indigo-600 mb-0.5">
                   Replying to {replyingTo.sender === 'me' ? 'Yourself' : contact.name}
                 </p>
                 <p className="text-sm text-gray-600 truncate">{replyingTo.text || 'Media'}</p>
              </div>
              <button onClick={() => setReplyingTo(null)} className="p-1 hover:bg-gray-200 rounded-full text-gray-500">
                 {Icons.Close}
              </button>
           </div>
        )}

        <div className="flex items-end gap-2 max-w-4xl mx-auto">
            <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-gray-100 rounded-full transition-colors hidden md:block">
                {Icons.Paperclip}
            </button>
            <div className={`flex-1 bg-gray-50 border rounded-2xl flex items-center gap-2 px-3 py-1 transition-all
                 ${isListening ? 'border-red-400 ring-2 ring-red-100' : 'border-gray-200 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-300'}
            `}>
                <textarea
                    rows={1}
                    placeholder={isListening ? "Listening..." : "Type a message..."}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 bg-transparent border-none focus:ring-0 resize-none py-2.5 max-h-32 text-slate-700 placeholder-gray-400"
                    style={{ minHeight: '44px' }}
                />
                
                {/* Voice Input Button */}
                <button 
                  onClick={toggleListening}
                  className={`p-2 transition-all rounded-full ${isListening ? 'text-red-500 bg-red-50 hover:bg-red-100 animate-pulse' : 'text-gray-400 hover:text-indigo-600 hover:bg-gray-200'}`}
                  title={isListening ? "Stop Recording" : "Start Voice Input"}
                >
                    {Icons.Microphone}
                </button>

                <button className="p-2 text-gray-400 hover:text-yellow-500 transition-colors hidden sm:block">
                    {Icons.Emoji}
                </button>
            </div>
            <button 
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className={`p-3 rounded-full shadow-md transition-all duration-200 flex-shrink-0
                ${inputValue.trim() 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105 active:scale-95' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
            >
                {Icons.Send}
            </button>
        </div>
      </div>
    </div>
  );
};