
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface CrashScreenProps {
  onRestart: () => void;
}

const CrashScreen: React.FC<CrashScreenProps> = ({ onRestart }) => {
  return (
    <div className="w-full h-screen bg-black flex flex-col items-center justify-center p-6 select-none">
      <div className="max-w-lg w-full bg-[#111] border-2 border-red-600 p-8 shadow-[0_0_50px_rgba(220,38,38,0.3)] space-y-6 animate-pulse">
        <div className="flex items-center gap-4 text-red-600">
          <AlertCircle className="w-12 h-12" />
          <h1 className="text-3xl font-bold uppercase tracking-tighter retro-font">Fatal Error</h1>
        </div>
        
        <div className="space-y-4 font-mono text-red-500 text-sm">
          <p className="border-l-2 border-red-600 pl-4">APPLICATION_HUNG: TIMEOUT_EXCEEDED</p>
          <p className="opacity-70">The system failed to reach the required instability threshold within the allocated time window.</p>
          <p className="text-xs">Process 0x0000000 terminated unexpectedly.</p>
        </div>

        <div className="bg-red-600/10 p-4 border border-red-600/30">
          <p className="text-red-400 text-xs italic">"You had 5 minutes. You failed to break it. The system is too stable for your skills."</p>
        </div>

        <button 
          onClick={onRestart}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 uppercase tracking-widest transition-all flex items-center justify-center gap-2 group"
        >
          <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
          Click to Restart
        </button>
      </div>

      <div className="mt-12 opacity-20 pointer-events-none">
        <div className="flex flex-wrap gap-2 justify-center">
            {Array.from({ length: 40 }).map((_, i) => (
                <div key={i} className="text-red-500 text-[10px] font-mono">010010101110</div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CrashScreen;
