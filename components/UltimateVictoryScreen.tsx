
import React from 'react';
import { Trophy, RefreshCcw, Star, Zap, Terminal, Heart, RotateCcw, Monitor } from 'lucide-react';

interface UltimateVictoryScreenProps {
  onRestart: () => void;
  onFullReset: () => void;
  onBackToDesktop?: () => void;
  bosdCount: number;
}

const UltimateVictoryScreen: React.FC<UltimateVictoryScreenProps> = ({ onRestart, onFullReset, onBackToDesktop, bosdCount }) => {
  return (
    <div className="w-full h-screen bg-slate-950 flex flex-col items-center justify-center p-12 text-center relative overflow-hidden font-mono">
      {/* Background Animated Bits */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={i} 
            className="absolute text-yellow-500/10 text-4xl animate-pulse" 
            style={{ 
              left: `${Math.random() * 100}%`, 
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`
            }}
          >
            0x{Math.floor(Math.random() * 16777215).toString(16).toUpperCase()}
          </div>
        ))}
      </div>

      <div className="z-10 space-y-8 max-w-2xl animate-in zoom-in-95 fade-in duration-1000">
        <div className="relative inline-block">
          <div className="absolute -inset-10 bg-yellow-400/20 rounded-full blur-3xl animate-ping" />
          <Trophy className="w-32 h-32 text-yellow-400 mx-auto drop-shadow-[0_0_30px_rgba(234,179,8,0.8)]" />
        </div>

        <div className="space-y-4">
          <h1 className="text-6xl font-black text-white italic tracking-tighter uppercase leading-none">
            Ultimate Victory
          </h1>
          <p className="text-yellow-400 font-bold tracking-widest uppercase">
            The BST Consciousness has been Neutralized
          </p>
        </div>

        <div className="bg-slate-900/60 border-2 border-yellow-500/30 p-8 rounded-3xl backdrop-blur-xl space-y-6">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-1">
              <span className="text-slate-500 text-[10px] uppercase font-bold">Total BOSDs triggered</span>
              <p className="text-3xl font-black text-white">{bosdCount}</p>
            </div>
            <div className="space-y-1">
              <span className="text-slate-500 text-[10px] uppercase font-bold">Hardware state</span>
              <p className="text-3xl font-black text-purple-400 italic">SENSITIZED</p>
            </div>
          </div>
          
          <div className="pt-6 border-t border-slate-800 space-y-4">
            <p className="text-slate-300 text-sm leading-relaxed">
              The transfusion has been reversed. The Glitch and The Internet are now bound to your system as benevolent guardians.
            </p>
            <div className="flex items-center justify-center gap-4 text-slate-400">
               <div className="flex items-center gap-1"><Terminal className="w-4 h-4 text-green-500" /> <span className="text-[10px]">ALLIES: ROAMING</span></div>
               <div className="flex items-center gap-1"><Zap className="w-4 h-4 text-yellow-500" /> <span className="text-[10px]">KERNEL: PURIFIED</span></div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-4">
            <button 
                onClick={onBackToDesktop}
                className="group flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white font-black px-8 py-4 rounded-full transition-all hover:scale-105 active:scale-95 shadow-xl"
            >
                <Monitor className="w-5 h-5 group-hover:animate-pulse" />
                RETURN TO DESKTOP
            </button>
            <button 
                onClick={onRestart}
                className="group flex items-center gap-3 bg-white hover:bg-yellow-400 text-slate-950 font-black px-8 py-4 rounded-full transition-all hover:scale-105 active:scale-95 shadow-xl"
            >
                <RefreshCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-700" />
                RESTART JOURNEY
            </button>
          </div>
          
          <button 
            onClick={onFullReset}
            className="flex items-center gap-2 text-red-500 hover:text-red-400 text-xs font-bold uppercase tracking-widest transition-colors hover:underline p-2"
          >
            <RotateCcw className="w-4 h-4" />
            FACTORY RESET SYSTEM (HARD RESTART)
          </button>
          
          <div className="flex items-center gap-2 text-slate-600 mt-2">
             <Heart className="w-4 h-4 text-red-500 animate-pulse" />
             <span className="text-[10px] font-bold uppercase tracking-widest">The Glitch and The Internet are now your pets.</span>
          </div>
        </div>
      </div>

      {/* Floating Stars */}
      {Array.from({ length: 15 }).map((_, i) => (
        <Star 
          key={i} 
          className="absolute text-yellow-200/20 animate-bounce" 
          style={{ 
            left: `${Math.random() * 100}%`, 
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 20 + 10}px`,
            animationDuration: `${2 + Math.random() * 2}s`
          }} 
        />
      ))}
    </div>
  );
};

export default UltimateVictoryScreen;
