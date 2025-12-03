import React, { useState, useEffect } from 'react';
import { Icons, PLATFORMS } from '../constants';
import { platformService } from '../services/platformService';
import { SearchResult, MessageType, Contact, Message } from '../types';

interface GlobalSearchPanelProps {
  onClose: () => void;
  onSelectResult: (contact: Contact, messageId?: string) => void;
}

const FILTERS: { label: string; type: MessageType | 'unread'; icon: React.ReactNode }[] = [
  { label: 'Photos', type: 'image', icon: Icons.Photo },
  { label: 'Videos', type: 'video', icon: Icons.Video },
  { label: 'Audio', type: 'audio', icon: Icons.Audio },
  { label: 'Documents', type: 'document', icon: Icons.Document },
  { label: 'Links', type: 'link', icon: Icons.Link },
];

export const GlobalSearchPanel: React.FC<GlobalSearchPanelProps> = ({ onClose, onSelectResult }) => {
  const [query, setQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<MessageType[]>([]);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, activeFilters]);

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      const data = await platformService.searchGlobal(query, activeFilters);
      setResults(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  const toggleFilter = (type: MessageType | 'unread') => {
    // Cast type because 'unread' isn't fully implemented in backend yet, keeping UI consistent with request
    if (type === 'unread') return; 

    const t = type as MessageType;
    setActiveFilters(prev => 
      prev.includes(t) ? prev.filter(f => f !== t) : [...prev, t]
    );
  };

  const getPlatformIcon = (platformId: string) => {
    return PLATFORMS.find(p => p.id === platformId)?.icon;
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 border-r border-gray-200 w-full md:w-96 lg:w-[450px]">
      {/* Search Header */}
      <div className="p-4 bg-white shadow-sm z-10">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
          <div className="flex-1 bg-gray-100 rounded-xl flex items-center px-4 py-2.5">
            <div className="text-gray-400 mr-2">{Icons.Search}</div>
            <input 
              autoFocus
              type="text" 
              placeholder="Search..." 
              className="bg-transparent border-none outline-none w-full text-slate-800 placeholder-gray-500"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
                <button onClick={() => setQuery('')} className="text-gray-400 hover:text-gray-600">
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                      <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                    </svg>
                </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {FILTERS.map(f => (
            <button
              key={f.label}
              onClick={() => toggleFilter(f.type)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors border
                ${activeFilters.includes(f.type as MessageType) 
                  ? 'bg-slate-800 text-white border-slate-800' 
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }
              `}
            >
              <div className="w-4 h-4">{f.icon}</div>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results List */}
      <div className="flex-1 overflow-y-auto pb-24 md:pb-0">
        {isSearching ? (
           <div className="flex flex-col items-center justify-center h-40 text-gray-400">
             <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-2"></div>
             <p className="text-sm">Searching...</p>
           </div>
        ) : results.length === 0 ? (
           <div className="flex flex-col items-center justify-center h-60 text-gray-400 text-center px-6">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-300">
                  {Icons.Search}
              </div>
              <p>No results found.</p>
              <p className="text-xs mt-1">Try searching for contacts, messages, or select a filter.</p>
           </div>
        ) : (
          <div className="p-2 space-y-1">
            {results.map((result) => (
              <div 
                key={result.id}
                onClick={() => onSelectResult(result.contact, result.message?.id)}
                className="group flex gap-5 p-3 hover:bg-white rounded-xl cursor-pointer transition-colors border border-transparent hover:border-gray-100 hover:shadow-sm"
              >
                <div className="relative flex-shrink-0">
                  <img src={result.contact.avatar} alt={result.contact.name} className="w-12 h-12 rounded-full object-cover" />
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                    <div className="w-4 h-4 text-indigo-600">
                        {getPlatformIcon(result.contact.platform)}
                    </div>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-slate-800 truncate">{result.contact.name}</h4>
                    {result.message && (
                         <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                            {result.message.timestamp.toLocaleDateString()}
                         </span>
                    )}
                  </div>
                  
                  {result.type === 'contact' ? (
                     <p className="text-xs text-gray-500">Contact found</p>
                  ) : (
                     <div className="text-sm text-gray-600 mt-0.5 min-w-0">
                        {result.matchType === 'image' && <span className="flex items-center gap-1 text-indigo-600 truncate"><span className="w-3 h-3 flex-shrink-0">{Icons.Photo}</span> Photo</span>}
                        {result.matchType === 'video' && <span className="flex items-center gap-1 text-indigo-600 truncate"><span className="w-3 h-3 flex-shrink-0">{Icons.Video}</span> Video</span>}
                        {result.matchType === 'document' && <span className="flex items-center gap-1 text-indigo-600 truncate"><span className="w-3 h-3 flex-shrink-0">{Icons.Document}</span> {result.message?.fileName}</span>}
                        {result.matchType === 'text' && <p className="truncate line-clamp-2">{result.message?.text}</p>}
                        {result.matchType === 'link' && <span className="flex items-center gap-1 text-blue-600 truncate"><span className="w-3 h-3 flex-shrink-0">{Icons.Link}</span> Link</span>}
                     </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};