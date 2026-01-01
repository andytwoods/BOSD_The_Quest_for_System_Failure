
import React from 'react';
import { Trophy, Star, Sparkles, Rocket } from 'lucide-react';

interface FinalWinDialogProps {
  onWin: () => void;
  onContinue: () => void;
}

const FinalWinDialog: React.FC<FinalWinDialogProps> = ({ onWin, onContinue }) => {
  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] animate-in fade-in duration-500">
      <div className="max-w-md w-full bg-slate-900 border-2 border-yellow-500 p-8 rounded-2xl shadow-[0_0_50px_rgba(234,179,8,0.3)] text-center space-y-6">
        <div className="relative inline-block">
          <Trophy className="w-20 h-20 text-yellow-400 mx-auto animate-bounce" />
          <Sparkles className="absolute -top-2 -right-2 text-white animate-pulse" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">Peak Instability Reached</h2>
          <p className="text-yellow-200/80 text-sm leading-relaxed">
            You've defeated the BOSD Boss 10 times and ascended to the <span className="text-yellow-400 font-bold italic">ULTRA PC</span> state.
            The system can no longer contain your chaos.
          </p>
        </div>

        <div className="flex flex-col gap-4 pt-4">
          <button 
            onClick={onWin}
            className="group relative flex items-center justify-center gap-3 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-black py-4 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-[0_10px_20px_rgba(234,179,8,0.3)]"
          >
            <Star className="w-5 h-5 group-hover:rotate-45 transition-transform" />
            DECLARE ULTIMATE VICTORY
            <Rocket className="w-5 h-5" />
          </button>
          
          <button 
            onClick={onContinue}
            className="text-white/60 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors hover:underline"
          >
            Continue the Chaos (Keep Playing)
          </button>
        </div>

        <p className="text-[10px] text-slate-500 italic">
          Tip: If you continue, you can always trigger victory later via the Golden Trophy on your desktop.
        </p>
      </div>
    </div>
  );
};

export default FinalWinDialog;
