
import React, { useState } from 'react';
import { X, Search, Globe, ChevronLeft, ChevronRight, RotateCcw, ImageIcon, Loader2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface GoogleWindowProps {
  onClose: () => void;
  onSearch: (query: string) => void;
  onNavigateToHub: () => void;
}

const GoogleWindow: React.FC<GoogleWindowProps> = ({ onClose, onSearch, onNavigateToHub }) => {
  const [query, setQuery] = useState('');
  const [searchResult, setSearchResult] = useState<{ image: string; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const performAISearch = async (searchTerm: string) => {
    setIsLoading(true);
    setSearchResult(null);

    // Navigation triggers
    const hubTerms = ['virus', 'dark web', 'hacker', 'deep web', 'illegal', 'malware'];
    if (hubTerms.some(term => searchTerm.includes(term))) {
      onNavigateToHub();
      setIsLoading(false);
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // 1. Generate text description
      const textResponse = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `The user searched for "${searchTerm}" on a 2000s era computer game about breaking the OS. Provide a short, 1-2 sentence snarky or system-themed description of this search result.`,
      });

      // 2. Generate image
      const imageResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: `A lo-fi, slightly glitched digital illustration of ${searchTerm} in a retro tech style.` }]
        },
        config: {
          imageConfig: { aspectRatio: "1:1" }
        }
      });

      let imageData = "";
      for (const part of imageResponse.candidates[0].content.parts) {
        if (part.inlineData) {
          imageData = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }

      setSearchResult({
        text: textResponse.text || "No description found in kernel logs.",
        image: imageData
      });
    } catch (error) {
      console.error("AI Search failed:", error);
      setSearchResult({
        text: "Connection refused. Search index is corrupted. Try searching 'dark web' instead.",
        image: ""
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      performAISearch(query.toLowerCase().trim());
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
            <span className="text-[10px] text-gray-600 font-bold ml-2">Google - System Browser</span>
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
                placeholder="Search Google or type a URL"
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
            <p className="text-sm font-mono text-gray-400 animate-pulse">Consulting global search indexes...</p>
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
              <p className="text-xs text-gray-500">About 133,700,000 results (0.42 seconds)</p>
            </div>

            <div className="flex gap-6">
              <div className="flex-1 space-y-4">
                <div className="space-y-1">
                  <h3 className="text-blue-700 text-lg hover:underline cursor-pointer font-medium">{query.charAt(0).toUpperCase() + query.slice(1)} - Official System Result</h3>
                  <p className="text-xs text-green-800">https://sys.os.kernel/{query.replace(' ', '_')}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{searchResult.text}</p>
                </div>
              </div>

              {searchResult.image && (
                <div className="w-48 h-48 bg-gray-100 border border-gray-200 rounded-lg overflow-hidden flex flex-col">
                  <img src={searchResult.image} alt={query} className="w-full h-full object-cover" />
                </div>
              )}
            </div>
            
            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded flex gap-4 items-center">
                <div className="bg-yellow-400 p-2 rounded">
                    <ImageIcon className="w-5 h-5 text-yellow-900" />
                </div>
                <div className="space-y-1">
                    <p className="text-xs font-bold text-yellow-900 uppercase">System Generated Visual</p>
                    <p className="text-[10px] text-yellow-800">Gemini 2.5 has synthesized a digital representation of your query.</p>
                </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-100 p-3 text-[9px] text-gray-500 flex justify-center gap-6 border-t border-gray-200">
        <span>Advertising</span>
        <span>Business</span>
        <span>How Search works</span>
        <span>Privacy</span>
        <span>Terms</span>
        <span>Settings</span>
      </div>
    </div>
  );
};

export default GoogleWindow;
