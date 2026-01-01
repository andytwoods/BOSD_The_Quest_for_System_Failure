
import React, { useState } from 'react';
import { X, Sparkles, Flame, Heart, Star } from 'lucide-react';

interface NewYearAppProps {
  onClose: () => void;
  onCelebrate: () => void;
}

const NewYearApp: React.FC<NewYearAppProps> = ({ onClose, onCelebrate }) => {
  const [clickedWords, setClickedWords] = useState<string[]>([]);
  const targetWords = ['HEAD', 'SCALE', 'CLAW', 'EYE', 'WING', 'FLAME', 'TAIL'];
  const [celebrated, setCelebrated] = useState(false);

  const handleWordClick = (word: string) => {
    if (!clickedWords.includes(word)) {
      setClickedWords(prev => [...prev, word]);
    }
  };

  const isComplete = clickedWords.length === targetWords.length;

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-[#8B0000] border-2 border-yellow-500 shadow-2xl z-[60] flex flex-col font-serif rounded-lg overflow-hidden animate-in zoom-in-95 duration-200">
      <div className="bg-[#B22222] text-yellow-400 p-2 flex justify-between items-center border-b border-yellow-500">
        <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Happy New Year - Celebration Engine</span>
        </div>
        <button onClick={onClose} className="hover:bg-red-800 p-1 rounded transition-colors text-yellow-400">
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex-1 p-6 flex flex-col items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')]">
        {!celebrated ? (
            <>
                <h2 className="text-2xl font-black text-yellow-500 mb-6 text-center drop-shadow-lg uppercase italic">
                    Assemble the Imperial Dragon
                </h2>
                <div className="flex flex-wrap gap-3 justify-center max-w-sm">
                    {targetWords.map(word => (
                        <button
                            key={word}
                            onClick={() => handleWordClick(word)}
                            disabled={clickedWords.includes(word)}
                            className={`px-4 py-2 border-2 rounded transition-all transform hover:scale-110 active:scale-95 text-xs font-bold tracking-tighter ${
                                clickedWords.includes(word) 
                                ? 'bg-yellow-500 border-yellow-600 text-red-900 scale-90 opacity-50' 
                                : 'bg-red-900 border-yellow-500 text-yellow-500 hover:bg-red-800'
                            }`}
                        >
                            {word}
                        </button>
                    ))}
                </div>
                
                {isComplete && (
                    <button 
                        onClick={() => {
                            setCelebrated(true);
                            onCelebrate();
                        }}
                        className="mt-10 bg-yellow-400 text-red-900 px-8 py-4 rounded-full font-black text-xl border-4 border-yellow-200 animate-pulse hover:scale-110 transition-transform shadow-[0_0_20px_rgba(255,255,0,0.5)]"
                    >
                        CELEBRATE & UPGRADE
                    </button>
                )}
            </>
        ) : (
            <div className="text-center space-y-4 animate-in fade-in zoom-in duration-1000">
                <div className="flex justify-center gap-2 mb-4">
                    <Flame className="text-yellow-500 w-12 h-12" />
                    <Star className="text-yellow-300 w-12 h-12 animate-spin-slow" />
                    <Flame className="text-yellow-500 w-12 h-12" />
                </div>
                <h3 className="text-4xl font-black text-yellow-400 italic tracking-tighter drop-shadow-xl">DRAGON UNLEASHED</h3>
                <p className="text-yellow-200 text-xs italic">The celebration has begun. Catch the dragons on your desktop.</p>
                <button 
                    onClick={onCelebrate}
                    className="mt-6 bg-red-900 border border-yellow-500 text-yellow-500 px-4 py-2 rounded hover:bg-red-800 text-[10px] font-bold"
                >
                    SUMMON ANOTHER DRAGON
                </button>
            </div>
        )}
      </div>

      <div className="bg-[#B22222] p-2 text-center">
         <p className="text-[10px] text-yellow-300/70 font-bold tracking-widest italic">May the Year of the Dragon bring System Stability (or total Chaos!)</p>
      </div>

      <style>{`
        .animate-spin-slow {
            animation: spin 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default NewYearApp;
