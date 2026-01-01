
import React from 'react';
import { RefreshCcw } from 'lucide-react';

interface BOSDScreenProps {
  onRestart: () => void;
  bosdCount: number;
}

const BOSDScreen: React.FC<BOSDScreenProps> = ({ onRestart, bosdCount }) => {
  return (
    <div className="w-full h-screen bg-[#0078d7] text-white p-12 flex flex-col justify-center bosd-font cursor-default animate-in fade-in duration-500">
      <div className="max-w-3xl space-y-8">
        <div className="text-8xl mb-8">:(</div>
        <h1 className="text-2xl font-light leading-snug">
          Your PC ran into a problem and needs to restart. We're just 
          collecting some error info, and then we'll restart for you.
        </h1>
        
        <div className="text-2xl flex items-center gap-4">
          <span className="font-bold">100% complete</span>
          <span className="text-sm opacity-60">Total Crashes Captured: {bosdCount}</span>
        </div>

        <div className="flex gap-10 items-start pt-8">
          <div className="w-32 h-32 bg-white flex items-center justify-center p-2">
            <div className="w-full h-full bg-black flex flex-wrap gap-[2px] p-[2px]">
                {Array.from({ length: 64 }).map((_, i) => (
                    <div key={i} className={`w-[6px] h-[6px] ${Math.random() > 0.5 ? 'bg-white' : 'bg-black'}`} />
                ))}
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-sm opacity-90">
              Stop code: {bosdCount >= 10 ? 'LEGENDARY_CRASH_RECYCLE_PENDING' : 'SYSTEM_CRASH_CHAMPION'}
            </p>
            <div className="space-y-1">
              <p className="text-xs font-light opacity-80">You have successfully provoked the kernel {bosdCount} times.</p>
              {bosdCount >= 10 && <p className="text-xs font-bold text-yellow-300">YOU CAN NOW RECYCLE THIS COMPUTER ON THE DESKTOP.</p>}
            </div>
          </div>
        </div>
      </div>

      <button 
        onClick={onRestart}
        className="absolute bottom-10 right-10 flex items-center gap-2 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-full transition-all border border-white/20 group"
      >
        <RefreshCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
        <span className="font-semibold">Restart for Next Level</span>
      </button>
    </div>
  );
};

export default BOSDScreen;
