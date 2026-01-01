
import React, { useState } from 'react';
import { X, Search, Globe, ChevronLeft, ChevronRight, RotateCcw, ImageIcon, Loader2 } from 'lucide-react';

interface GoogleWindowProps {
  onClose: () => void;
  onSearch: (query: string) => void;
  onNavigateToHub: () => void;
}

const GoogleWindow: React.FC<GoogleWindowProps> = ({ onClose, onSearch, onNavigateToHub }) => {
  const [query, setQuery] = useState('');
  const [searchResult, setSearchResult] = useState<{ image: string; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const performLocalSearch = (searchTerm: string) => {
    setIsLoading(true);
    setSearchResult(null);

    // Hardcoded responses for key terms
    const database: Record<string, {text: string, image: string}> = {
      'virus': { text: "DANGER! Malicious scripts detected in sector 7. Redirecting to Virus Hub...", image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=200&h=200&fit=crop" },
      'dark web': { text: "Loading Shadow-Net Marketplace. Please hide your IP address.", image: "https://images.unsplash.com/photo-1510511459019-5dee592d8892?w=200&h=200&fit=crop" },
      'hacker': { text: "Root access requested. Are you sure you are the Architect?", image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=200&h=200&fit=crop" },
      'blue': { text: "The color of the end. The color of the beginning. :( ", image: "https://images.unsplash.com/photo-1557683316-973673baf926?w=200&h=200&fit=crop" },
      'ryan': { text: "Author identified: Ryan Woods. Age 8. Clearance: GOD_MODE_PENDING.", image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=200&h=200&fit=crop" },
      'dad': { text: "Target: Father. Status: Unaware of current system breach. Proceed with caution.", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop" }
    };

    setTimeout(() => {
      const hubTerms = ['virus', 'dark web', 'hacker', 'deep web', 'illegal', 'malware'];
      if (hubTerms.some(term => searchTerm.includes(term))) {
        onNavigateToHub();
        setIsLoading(false);
        return;
      }

      const found = Object.keys(database).find(key => searchTerm.includes(key));
      if (found) {
        setSearchResult(database[found]);
      } else {
        setSearchResult({
          text: `Found 0 results for "${searchTerm}". The system is too broken to index this data. Try searching "virus".`,
          image: "https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=200&h=200&fit=crop"
        });
      }
      setIsLoading(false);
    }, 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      performLocalSearch(query.toLowerCase().trim());
      onSearch(query.toLowerCase().trim());
    }
  };

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[500px] bg-white border-2 border-gray-400 shadow-2xl z-[55] flex flex-col font-sans animate-in zoom-in-95 duration-200 overflow-hidden rounded-lg">
      <div className="bg-gray-200 p-1 flex justify-between items-center border-b border-gray-300">
        <div className="flex items-center gap-2 px-2">
            <div className="flex gap-1">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <span className="text-[10px] text-gray-600 font-bold ml-2">Google - Simulation Browser</span>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-gray-300 rounded transition-colors text-gray-600">
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="bg-gray-100 p-2 flex items-center gap-3 border-b border-gray-300">
        <div className="flex gap-2">
            <ChevronLeft className="w-4 h-4 text-gray-400" />
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <RotateCcw className="w-4 h-4 text-gray-500 cursor-pointer" />
        </div>
        <div className="flex-1 bg-white border border-gray-300 rounded-full px-3 py-1 flex items-center gap-2">
            <Globe className="w-3 h-3 text-gray-400" />
            <span className="text-[10px] text-gray-600 overflow-hidden text-ellipsis whitespace-nowrap">
                {searchResult ? `https://www.google.com/search?q=${query}` : 'https://www.google.com'}
            </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center p-6 overflow-y-auto">
        {!searchResult && !isLoading && (
          <div className="mt-12 flex flex-col items-center">
            <div className="flex text-6xl font-black mb-8 select-none">
              <span className="text-blue-500">G</span>
              <span className="text-red-500">o</span>
              <span className="text-yellow-500">o</span>
              <span className="text-blue-500">g</span>
              <span className="text-green-500">l</span>
              <span className="text-red-500">e</span>
            </div>
            <form onSubmit={handleSubmit} className="w-full max-w-md relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full h-12 border border-gray-200 rounded-full px-12 text-sm focus:outline-none focus:shadow-lg focus:border-transparent transition-all"
                placeholder="Search Ryan, Virus, or BOSD..."
                autoFocus
              />
              <div className="flex justify-center mt-6 gap-3">
                <button type="submit" className="bg-gray-50 hover:bg-gray-100 border border-gray-200 px-4 py-2 text-xs rounded-sm text-gray-700 font-medium">Google Search</button>
                <button type="button" className="bg-gray-50 hover:bg-gray-100 border border-gray-200 px-4 py-2 text-xs rounded-sm text-gray-700 font-medium italic">I'm Feeling Lucky</button>
              </div>
            </form>
            <div className="mt-8 text-center space-y-2">
                <p className="text-[10px] text-gray-500 italic">Try searching "virus" or "dark web" for something dangerous...</p>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex-1 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
            <p className="text-sm font-mono text-gray-400 animate-pulse">Consulting local cache indexes...</p>
          </div>
        )}

        {searchResult && !isLoading && (
          <div className="w-full space-y-6 animate-in slide-in-from-bottom-4 duration-300">
            <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto relative flex gap-2">
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 h-10 border border-gray-200 rounded-full px-4 text-xs focus:outline-none focus:shadow-md transition-all"
              />
              <button type="submit" className="bg-blue-500 text-white px-4 rounded-full text-xs font-bold">Search</button>
            </form>

            <div className="border-b border-gray-100 pb-2">
              <p className="text-xs text-gray-500">About 133,700,000 results (0.02 seconds)</p>
            </div>

            <div className="flex gap-6">
              <div className="flex-1 space-y-4">
                <div className="space-y-1">
                  <h3 className="text-blue-700 text-lg hover:underline cursor-pointer font-medium">{query.charAt(0).toUpperCase() + query.slice(1)} - Local Cache Result</h3>
                  <p className="text-xs text-green-800">https://local.cache.sys/{query.replace(' ', '_')}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{searchResult.text}</p>
                </div>
              </div>

              {searchResult.image && (
                <div className="w-48 h-48 bg-gray-100 border border-gray-200 rounded-lg overflow-hidden flex flex-col">
                  <img src={searchResult.image} alt={query} className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-100 p-3 text-[9px] text-gray-500 flex justify-center gap-6 border-t border-gray-200">
        <span>Advertising</span>
        <span>Business</span>
        <span>Offline Mode Active</span>
        <span>Privacy</span>
        <span>Terms</span>
        <span>Settings</span>
      </div>
    </div>
  );
};

export default GoogleWindow;
