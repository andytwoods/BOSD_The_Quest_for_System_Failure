
import React, { useState, useEffect, useRef } from 'react';
import { Skull, AlertTriangle, Zap, Activity, Crosshair, Terminal, Bug, Radio } from 'lucide-react';

interface GlitchBossProps {
  hp: number;
  setHp: (hp: number) => void;
  onWin: () => void;
  onFail: () => void;
  isBlasterEquipped: boolean;
  playerDamage: number;
}

const GlitchBoss: React.FC<GlitchBossProps> = ({ hp, setHp, onWin, onFail, isBlasterEquipped, playerDamage }) => {
  const [maxHp] = useState(5000);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [isHit, setIsHit] = useState(false);
  const [glitchText, setGlitchText] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const moveInt = setInterval(() => {
      setPos({ x: Math.random() * 70 + 15, y: Math.random() * 60 + 20 });
      setGlitchText(Math.random().toString(36).substring(2, 15).toUpperCase());
    }, 400);

    return () => clearInterval(moveInt);
  }, []);

  const handleShoot = (e: React.MouseEvent) => {
    if (!isBlasterEquipped) return;
    if (isHit) return;

    const nextHp = Math.max(0, hp - playerDamage);
    setHp(nextHp);
    setIsHit(true);
    setTimeout(() => setIsHit(false), 100);

    if (containerRef.current) {
        const shot = document.createElement('div');
        shot.className = "absolute w-20 h-20 bg-white rounded-full animate-ping z-50 pointer-events-none shadow-[0_0_50px_white]";
        const rect = containerRef.current.getBoundingClientRect();
        shot.style.left = `${e.clientX - rect.left - 40}px`;
        shot.style.top = `${e.clientY - rect.top - 40}px`;
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
        className={`w-full h-screen bg-black overflow-hidden relative cursor-none flex flex-col items-center justify-center ${isHit ? 'brightness-200' : ''}`}
    >
      <div className="absolute inset-0 bg-white/5 pointer-events-none overflow-hidden text-[10px] font-mono text-green-500/20 leading-tight">
        {Array.from({ length: 100 }).map((_, i) => (
            <div key={i} className="whitespace-nowrap">
                {Array.from({ length: 200 }).map(() => (Math.random() > 0.5 ? '1' : '0'))}
            </div>
        ))}
      </div>

      <div className="absolute top-0 w-full bg-zinc-900 border-b-4 border-white p-6 flex justify-between items-center z-50">
         <div className="flex items-center gap-4">
            <Radio className="text-white w-10 h-10 animate-pulse" />
            <h1 className="text-white text-5xl font-black italic tracking-tighter uppercase">THE_GLITCH</h1>
         </div>
         <div className="text-right">
            <span className="text-[12px] text-white uppercase font-black tracking-widest">Entity Integrity: {hp}</span>
            <div className="w-96 h-8 bg-zinc-800 border-4 border-white mt-2">
                <div className="h-full bg-white transition-all duration-100" style={{ width: `${(hp/maxHp)*100}%` }} />
            </div>
         </div>
      </div>

      <div 
        className="absolute transition-all duration-300 ease-in-out group z-40"
        style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)' }}
      >
        <div className="relative">
            <div className="absolute -inset-20 bg-white/20 blur-3xl animate-ping" />
            <div className="w-64 h-64 bg-white flex flex-col items-center justify-center p-4 shadow-[20px_20px_0px_rgba(255,255,255,0.2)] border-8 border-black animate-bounce">
                <Skull className="w-32 h-32 text-black glitch-effect" />
                <div className="mt-4 font-black text-black text-2xl tracking-tighter text-center">
                    {glitchText}
                </div>
            </div>
            {isHit && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-red-600 font-black text-6xl italic animate-ping">CRITICAL</span>
                </div>
            )}
        </div>
      </div>

      {!isBlasterEquipped && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-red-600 text-white font-black px-10 py-5 rounded-2xl border-4 border-white text-2xl animate-bounce shadow-2xl z-[100]">
            WEAPON_OFFLINE: ACTIVATE BLASTER
        </div>
      )}

      <div className="absolute bottom-10 left-10 space-y-4">
         <div className="flex items-center gap-4 text-white">
            <Activity className="w-8 h-8 animate-pulse" />
            <span className="text-xl font-black uppercase tracking-tighter">Stability Level: {Math.floor((hp/maxHp)*100)}%</span>
         </div>
         <div className="text-[10px] text-zinc-500 font-bold max-w-xs">
            DEFEAT THE GLITCH TO PURGE THE SYSTEM OF ALL ANOMALIES FOREVER.
         </div>
      </div>

      <style>{`
        .glitch-effect { animation: glitch 0.1s infinite; }
        @keyframes glitch {
          0% { transform: translate(0); }
          25% { transform: translate(-10px, 10px); }
          50% { transform: translate(10px, -10px); }
          75% { transform: translate(-10px, -10px); }
          100% { transform: translate(10px, 10px); }
        }
      `}</style>
    </div>
  );
};

export default GlitchBoss;
