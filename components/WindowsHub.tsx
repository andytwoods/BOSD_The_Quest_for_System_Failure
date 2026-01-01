
import React, { useState, useEffect } from 'react';
import { Shield, Activity, Target, Cpu, Bug } from 'lucide-react';

interface WindowsHubProps {
  onDefeat: () => void;
  onFail: () => void;
}

const WindowsHub: React.FC<WindowsHubProps> = ({ onDefeat, onFail }) => {
  const [virusesDefeated, setVirusesDefeated] = useState(0);
  const [activeViruses, setActiveViruses] = useState<{ id: number; x: number; y: number; life: number }[]>([]);
  const [systemIntegrity, setSystemIntegrity] = useState(100);

  useEffect(() => {
    const spawnInterval = setInterval(() => {
      if (virusesDefeated < 20) {
        setActiveViruses(prev => [...prev, {
          id: Date.now() + Math.random(),
          x: Math.random() * 80 + 10,
          y: Math.random() * 80 + 10,
          life: 100
        }]);
      }
    }, 1200);

    const damageInterval = setInterval(() => {
      setActiveViruses(prev => {
        if (prev.length > 5) {
          setSystemIntegrity(si => Math.max(0, si - (prev.length - 5)));
        }
        return prev;
      });
    }, 1000);

    return () => {
      clearInterval(spawnInterval);
      clearInterval(damageInterval);
    };
  }, [virusesDefeated]);

  useEffect(() => {
    if (systemIntegrity <= 0) onFail();
    if (virusesDefeated >= 20 && activeViruses.length === 0) onDefeat();
  }, [systemIntegrity, virusesDefeated, activeViruses, onDefeat, onFail]);

  const killVirus = (id: number) => {
    setActiveViruses(prev => prev.filter(v => v.id !== id));
    setVirusesDefeated(prev => prev + 1);
  };

  return (
    <div className="w-full h-screen bg-[#001133] overflow-hidden relative font-mono">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
      
      {/* HUD */}
      <div className="absolute top-0 w-full p-8 flex justify-between items-start z-50">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-blue-400">
            <Shield className="w-10 h-10 animate-pulse" />
            <div>
              <h1 className="text-2xl font-black italic tracking-widest">WINDOWS_HUB_v4.2</h1>
              <p className="text-xs opacity-60">KERNEL PROTECTION LAYER ACTIVE</p>
            </div>
          </div>
          <div className="w-64 h-2 bg-blue-900 rounded-full overflow-hidden border border-blue-400/30">
            <div className="h-full bg-blue-400 transition-all duration-500" style={{ width: `${systemIntegrity}%` }} />
          </div>
          <p className="text-xs text-blue-300">SYSTEM_INTEGRITY: {systemIntegrity}%</p>
        </div>

        <div className="text-right space-y-2">
            <div className="text-4xl font-bold text-blue-400 tracking-tighter">BREACH_PROG: {Math.round((virusesDefeated/20)*100)}%</div>
            <div className="flex items-center justify-end gap-2 text-xs text-blue-300/50">
                <Activity className="w-3 h-3" />
                <span>CLEANING SYSTEM THREADS...</span>
            </div>
        </div>
      </div>

      {/* Grid */}
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 opacity-10 pointer-events-none">
        {Array.from({ length: 144 }).map((_, i) => (
          <div key={i} className="border-[0.5px] border-blue-500" />
        ))}
      </div>

      {/* Viruses */}
      {activeViruses.map(v => (
        <div 
          key={v.id}
          onClick={() => killVirus(v.id)}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group hover:scale-110 transition-transform"
          style={{ left: `${v.x}%`, top: `${v.y}%` }}
        >
          <div className="relative">
            <Bug className="w-16 h-16 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)] animate-bounce" />
            <Target className="absolute inset-0 w-16 h-16 text-white opacity-0 group-hover:opacity-100 transition-opacity animate-spin-slow" />
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] bg-red-600 text-white px-1">
                MALWARE_0x{v.id.toString().slice(-4)}
            </div>
          </div>
        </div>
      ))}

      {/* Core */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 pointer-events-none">
        <Cpu className="w-96 h-96 text-blue-500 animate-pulse" />
      </div>

      {virusesDefeated >= 20 && (
        <div className="absolute inset-0 flex items-center justify-center bg-blue-900/80 backdrop-blur-md z-[60] animate-in fade-in duration-1000">
            <div className="text-center space-y-6">
                <h2 className="text-6xl font-black text-white italic tracking-tighter animate-pulse">HUB BREACHED</h2>
                <p className="text-blue-200 font-mono">UNAUTHORIZED ACCESS GRANTED: THE DARK WEB AWAITS</p>
            </div>
        </div>
      )}
    </div>
  );
};

export default WindowsHub;
