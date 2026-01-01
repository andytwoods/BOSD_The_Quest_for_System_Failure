
import React, { useState, useEffect } from 'react';
import { X, Film, Play, AlertCircle, Lock, Trophy, FastForward } from 'lucide-react';

interface AnimateWindowProps {
  onClose: () => void;
  bosdCount: number;
  isResearcher: boolean;
}

const AnimateWindow: React.FC<AnimateWindowProps> = ({ onClose, bosdCount, isResearcher }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [interactionRequired, setInteractionRequired] = useState(false);
  const [videoIndex, setVideoIndex] = useState(0);
  
  const isLocked = !isResearcher || bosdCount < 1;

  useEffect(() => {
    let interval: number | null = null;
    if (isPlaying && !interactionRequired) {
      interval = window.setInterval(() => {
        setProgress(prev => {
          const next = prev + 1;
          if (next % 30 === 0 && next < 100) {
            setInteractionRequired(true);
            return prev;
          }
          if (next >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return next;
        });
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, interactionRequired]);

  const handleInteract = () => {
    setInteractionRequired(false);
    setProgress(p => p + 1);
  };

  const startNewVideo = () => {
    setProgress(0);
    setIsPlaying(true);
    setInteractionRequired(false);
    setVideoIndex(v => v + 1);
  };

  const videoTypes = [
    { name: "Cube Falling Over", color: "bg-amber-600" },
    { name: "Circle Vibrating", color: "bg-emerald-600" },
    { name: "Triangle Rotating Slightly", color: "bg-indigo-600" }
  ];

  const currentVideo = videoTypes[videoIndex % videoTypes.length];

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[450px] bg-[#c0c0c0] border-2 border-white border-r-gray-500 border-b-gray-500 shadow-2xl z-[70] flex flex-col font-sans animate-in zoom-in-95 duration-200">
      <div className="bg-[#008080] text-white p-1 flex justify-between items-center">
        <div className="flex items-center gap-2 px-2">
            <Film className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">System Animator Pro v0.0.1</span>
        </div>
        <button onClick={onClose} className="bg-gray-300 text-black px-1 border border-white border-r-gray-800 border-b-gray-800 hover:bg-gray-200">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 p-6 flex flex-col bg-zinc-900 overflow-hidden">
        {isLocked ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
             <div className="relative">
               <Lock className="w-20 h-20 text-red-500 opacity-50" />
               <AlertCircle className="absolute -bottom-2 -right-2 w-8 h-8 text-red-600 animate-pulse" />
             </div>
             <div className="space-y-2">
                <h2 className="text-red-500 font-mono text-xl font-black">ANIMATION_STUDIO_LOCKED</h2>
                <div className="text-[10px] font-mono text-red-400 space-y-1">
                   <p className={`flex items-center justify-center gap-2 ${isResearcher ? 'text-green-500' : ''}`}>
                     [{isResearcher ? '✓' : '✗'}] ACHIEVEMENT_RESEARCHER_REQUIRED
                   </p>
                   <p className={`flex items-center justify-center gap-2 ${bosdCount >= 1 ? 'text-green-500' : ''}`}>
                     [{bosdCount >= 1 ? '✓' : '✗'}] KERNEL_BREACH_REQUIRED (BOSD >= 1)
                   </p>
                </div>
             </div>
             <p className="text-gray-500 font-mono text-[9px] max-w-xs">
                Professional animation tools require high-level system instability and deep web research credentials.
             </p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            <div className="mb-4 flex items-center justify-between border-b border-zinc-700 pb-2">
               <div>
                  <h2 className="text-white text-sm font-bold">Project: <span className="text-teal-400 uppercase italic">Bad_Video_{videoIndex}.prj</span></h2>
                  <p className="text-zinc-500 text-[9px]">Scene: {currentVideo.name}</p>
               </div>
               <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" title="Recording" />
                  <div className="text-teal-500 font-mono text-[10px]">00:00:{Math.floor(progress/10).toString().padStart(2, '0')}:{progress % 10}</div>
               </div>
            </div>

            <div className="flex-1 bg-black rounded border-2 border-zinc-800 relative flex items-center justify-center overflow-hidden">
                {isPlaying ? (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                        <div className={`w-32 h-32 ${currentVideo.color} transition-all duration-500 shadow-2xl`}
                             style={{ 
                                transform: `translateY(${Math.sin(progress/5)*10}px) rotate(${progress * 3.6}deg) ${interactionRequired ? 'scale(1.2)' : ''}`,
                                opacity: 1 - (progress / 120)
                             }}
                        />
                        
                        {interactionRequired && (
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in">
                                <Trophy className="text-yellow-500 w-12 h-12 mb-4 animate-bounce" />
                                <h3 className="text-white font-black text-center mb-6 px-4">THE 1% INTERACTION POINT!</h3>
                                <button 
                                    onClick={handleInteract}
                                    className="bg-teal-500 hover:bg-teal-400 text-black font-black px-8 py-4 rounded-full text-lg shadow-[0_0_20px_teal] active:scale-95 transition-all"
                                >
                                    PLAY THE 1%
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center">
                        <button 
                            onClick={startNewVideo}
                            className="group flex flex-col items-center gap-4 hover:scale-105 transition-transform"
                        >
                            <div className="w-20 h-20 bg-teal-600/20 border-2 border-teal-500 rounded-full flex items-center justify-center group-hover:bg-teal-500/40">
                                <Play className="text-teal-400 w-10 h-10 fill-current" />
                            </div>
                            <span className="text-teal-500 font-bold text-xs uppercase tracking-widest">
                                {progress === 100 ? 'Re-Animate Bad Video' : 'Create Bad Video'}
                            </span>
                        </button>
                        {progress === 100 && (
                            <p className="mt-4 text-[10px] text-green-500 font-mono animate-pulse">✓ RENDER_COMPLETE_SAVED_TO_NULL</p>
                        )}
                    </div>
                )}
                
                <div className="absolute bottom-4 left-4 right-4 h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-500 transition-all duration-100" style={{ width: `${progress}%` }} />
                </div>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-2">
               {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-10 border border-zinc-700 bg-zinc-800 flex items-center justify-center relative overflow-hidden">
                      <div className={`absolute inset-0 opacity-20 ${currentVideo.color}`} style={{ left: `${i * 12.5}%` }} />
                      <span className="text-zinc-600 text-[8px]">Frame_{i}</span>
                  </div>
               ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-[#c0c0c0] p-2 border-t border-gray-400 text-[9px] text-gray-600 flex justify-between">
         <span className="flex items-center gap-1 italic">
           <FastForward className="w-3 h-3" /> interaction_engine_active.sys
         </span>
         <span className="font-bold">{isLocked ? 'RESTRICTED' : 'AUTHOR_MODE_ENABLED'}</span>
      </div>
    </div>
  );
};

export default AnimateWindow;
