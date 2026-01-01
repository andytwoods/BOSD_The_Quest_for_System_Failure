
import React, { useState, useEffect, useRef } from 'react';
import { Skull, AlertTriangle, Monitor, ShieldAlert, Zap, Cpu, Crosshair, Terminal, Activity } from 'lucide-react';

interface BODBossProps {
  hp: number;
  setHp: (hp: number) => void;
  onWin: () => void;
  onFail: () => void;
  isBlasterEquipped: boolean;
  isLogsRecycled: boolean;
  godMode?: boolean;
}

const BODBoss: React.FC<BODBossProps> = ({ hp, setHp, onWin, onFail, isBlasterEquipped, isLogsRecycled, godMode }) => {
  const [maxHp] = useState(1000);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [glitchIntensity, setGlitchIntensity] = useState(0);
  const [isHit, setIsHit] = useState(false);
  const [shards, setShards] = useState<{ id: number; x: number; y: number; vx: number; vy: number }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const damagePerShot = godMode ? 1000 : (isLogsRecycled ? 100 : 10);

  useEffect(() => {
    const moveInterval = setInterval(() => {
      const rageFactor = 1 - (hp / maxHp);
      setPos({
        x: Math.random() * 60 + 20,
        y: Math.random() * 50 + 25
      });
      setGlitchIntensity(Math.random() + rageFactor);
      
      if (rageFactor > 0.4 && Math.random() > 0.5) {
        setShards(prev => [...prev, {
            id: Date.now(),
            x: pos.x,
            y: pos.y,
            vx: (Math.random() - 0.5) * 5,
            vy: (Math.random() - 0.5) * 5
        }]);
      }
    }, 800 * (hp / maxHp > 0.5 ? 1 : 0.6));

    const shardPhysics = setInterval(() => {
        setShards(prev => prev.map(s => ({ ...s, x: s.x + s.vx, y: s.y + s.vy })).filter(s => s.x > -10 && s.x < 110 && s.y > -10 && s.y < 110));
    }, 32);

    return () => {
        clearInterval(moveInterval);
        clearInterval(shardPhysics);
    };
  }, [hp, pos, maxHp]);

  const handleShoot = (e: React.MouseEvent) => {
    if (!isBlasterEquipped) return;
    if (isHit) return;
    
    const nextHp = Math.max(0, hp - damagePerShot);
    setHp(nextHp);
    setIsHit(true);
    setTimeout(() => setIsHit(false), 150);

    if (containerRef.current) {
        const shot = document.createElement('div');
        shot.className = `absolute rounded-full animate-ping z-50 pointer-events-none shadow-[0_0_30px_cyan] ${isLogsRecycled ? 'w-20 h-20 bg-blue-300' : 'w-8 h-8 bg-blue-500'}`;
        const rect = containerRef.current.getBoundingClientRect();
        shot.style.left = `${e.clientX - rect.left - (isLogsRecycled ? 40 : 16)}px`;
        shot.style.top = `${e.clientY - rect.top - (isLogsRecycled ? 40 : 16)}px`;
        containerRef.current.appendChild(shot);
        setTimeout(() => shot.remove(), 300);
    }

    if (nextHp <= 0) {
      onWin();
    }
  };

  return (
    <div 
        ref={containerRef}
        onClick={handleShoot}
        className={`w-full h-screen bg-[#004a99] overflow-hidden relative cursor-none flex flex-col items-center justify-center transition-all duration-300 ${isBlasterEquipped ? 'cursor-none' : ''} ${isHit ? 'brightness-125 translate-x-1' : ''}`}
    >
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />
      
      <div className="absolute inset-0 opacity-10 pointer-events-none font-mono text-white text-[10px] select-none overflow-hidden leading-tight">
        {Array.from({ length: 60 }).map((_, i) => (
            <div key={i} className="whitespace-nowrap animate-pulse">
                STOP_CODE: KERNEL_DATA_INPAGE_ERROR 0x0000007A {Math.random().toString(16).toUpperCase()} SYSTEM_FAILURE_DETECTED
            </div>
        ))}
      </div>

      <div className="absolute top-0 w-full bg-blue-900 border-b border-blue-400 p-4 flex justify-between items-center z-50 shadow-2xl">
         <div className="flex items-center gap-4">
            <ShieldAlert className="text-white w-8 h-8 animate-bounce" />
            <h1 className="text-white text-3xl font-black italic tracking-tighter uppercase">CRITICAL_THREAT: THE_BOD_ENTITY</h1>
         </div>
         <div className="flex items-center gap-6">
            <div className="text-right">
                <div className="flex justify-between items-end mb-1">
                    <span className="text-[10px] text-blue-200 uppercase font-bold">Integrity: {hp} / {maxHp}</span>
                    <span className={`text-[8px] font-black ${isLogsRecycled ? 'text-cyan-400' : 'text-blue-500'}`}>DMG: {damagePerShot}</span>
                </div>
                <div className="w-80 h-4 bg-black border border-blue-400/50 relative overflow-hidden">
                    <div 
                        className={`h-full transition-all duration-300 shadow-[0_0_15px_cyan] ${hp < maxHp * 0.3 ? 'bg-red-500 shadow-red-500' : 'bg-blue-400'}`} 
                        style={{ width: `${(hp/maxHp)*100}%` }} 
                    />
                </div>
            </div>
         </div>
      </div>

      {shards.map(s => (
        <div key={s.id} className="absolute w-4 h-4 text-cyan-500 animate-spin" style={{ left: `${s.x}%`, top: `${s.y}%` }}>
            <Activity className="w-full h-full drop-shadow-[0_0_5px_cyan]" />
        </div>
      ))}

      <div 
        className={`absolute transition-all duration-300 ease-in-out group z-40 ${isHit ? 'scale-110' : ''}`}
        style={{ 
            left: `${pos.x}%`, 
            top: `${pos.y}%`,
            transform: `translate(-50%, -50%) scale(${1 + glitchIntensity * 0.1}) rotate(${glitchIntensity * 2}deg)`
        }}
      >
        <div className="relative group cursor-none">
            <div className={`absolute -inset-40 rounded-full blur-[140px] transition-all duration-500 ${hp < maxHp * 0.3 ? 'bg-red-600/40' : 'bg-blue-600/30'} animate-pulse`} />
            
            <div className={`relative bg-[#0078d7] border-4 border-white p-10 shadow-[20px_20px_0px_rgba(0,0,0,0.5)] flex flex-col gap-6 w-[400px] group-hover:scale-105 transition-transform duration-300 ${isHit ? 'bg-white text-blue-800' : ''}`}>
                <div className="text-7xl text-white font-bold transition-colors">:(</div>
                <div className="space-y-4">
                    <p className={`text-sm font-semibold leading-relaxed transition-colors ${isHit ? 'text-blue-800' : 'text-white'}`}>
                        System instability has reached {Math.floor((1 - hp/maxHp) * 100)}%. 
                        The Kernel Blaster is {isLogsRecycled ? 'authorized for VOID_OVERRIDE' : 'operating at limited output'}.
                    </p>
                    <div className="flex items-center gap-3 opacity-60">
                        <Cpu className={`w-5 h-5 ${hp < maxHp * 0.3 ? 'text-red-400' : 'text-white'} animate-spin-slow`} />
                        <span className="text-[10px] font-mono text-white">X_CODE: {isLogsRecycled ? 'RECYCLED_DATA_INJECTED' : 'STANDARD_USER_SHELL'}</span>
                    </div>
                </div>

                {!isBlasterEquipped && (
                    <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 whitespace-nowrap bg-red-600 text-white font-black px-6 py-3 rounded-lg border-2 border-white animate-bounce shadow-2xl z-50">
                        WEAPON REQUIRED: GRAB BLASTER FROM HUD
                    </div>
                )}
            </div>
            
            <div className="absolute -top-6 -right-6 bg-white p-3 rounded-full shadow-2xl border-2 border-blue-500">
                {hp < maxHp * 0.3 ? <Skull className="w-10 h-10 text-red-600 animate-pulse" /> : <Terminal className="w-10 h-10 text-blue-600" />}
            </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-10 space-y-3 pointer-events-none">
        <div className="flex items-center gap-3 text-blue-200">
            <Zap className={`w-5 h-5 ${isLogsRecycled ? 'text-yellow-400' : 'text-blue-300'} animate-pulse`} />
            <span className="text-[11px] font-black uppercase tracking-widest">Buffer Status: {hp > maxHp * 0.5 ? 'STABLE' : 'UNRAVELING'}</span>
        </div>
      </div>
    </div>
  );
};

export default BODBoss;
