
import React, { useState, useEffect, useRef } from 'react';
import { Globe, ShieldAlert, Zap, Recycle, Activity, Monitor, Trash2, Cpu, Wifi, Database } from 'lucide-react';

interface InternetBossProps {
  onWin: () => void;
  onFail: () => void;
  isBlasterEquipped: boolean;
  playerDamage: number;
}

const MissingNoSprite: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`relative w-24 h-48 bg-gray-400 border-2 border-black overflow-hidden shadow-[8px_8px_0px_rgba(0,0,0,0.5)] ${className}`}>
    <div className="absolute inset-0 flex flex-col">
      {Array.from({ length: 12 }).map((_, i) => (
        <div 
          key={i} 
          className="h-4 flex" 
          style={{ 
            background: `repeating-linear-gradient(${Math.random() * 360}deg, #333 0px, #333 2px, #ccc 2px, #ccc 4px)`,
            opacity: 0.8 + Math.random() * 0.2,
            transform: `translateX(${(Math.random() - 0.5) * 4}px)`
          }}
        >
          {Array.from({ length: 4 }).map((_, j) => (
            <div 
              key={j} 
              className="flex-1 border-r border-black/20" 
              style={{ backgroundColor: Math.random() > 0.5 ? '#222' : '#999' }} 
            />
          ))}
        </div>
      ))}
    </div>
    <div className="absolute inset-0 bg-white/10 mix-blend-overlay animate-pulse" />
  </div>
);

const InternetBoss: React.FC<InternetBossProps> = ({ onWin, onFail, isBlasterEquipped, playerDamage }) => {
  const [totalDamage, setTotalDamage] = useState(0);
  const [lastDps, setLastDps] = useState(0);
  const [powerBalls, setPowerBalls] = useState(0);
  const [isHit, setIsHit] = useState(false);
  const [glitchIntensity, setGlitchIntensity] = useState(0);
  const [attackActive, setAttackActive] = useState(false);
  const [missingNos, setMissingNos] = useState<{ id: number; x: number; y: number; speed: number }[]>([]);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const damageQueue = useRef<number>(0);

  // DPS Calculation
  useEffect(() => {
    const interval = setInterval(() => {
      setLastDps(damageQueue.current);
      damageQueue.current = 0;
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Visual Glitch Logic
  useEffect(() => {
    const glitchInt = setInterval(() => {
      setGlitchIntensity(Math.random());
    }, 200);
    return () => clearInterval(glitchInt);
  }, []);

  // Attack Physics (Packet Storm / MissingNo Rain)
  useEffect(() => {
    if (missingNos.length > 0) {
      const moveInterval = setInterval(() => {
        setMissingNos(prev => 
          prev.map(m => ({ ...m, y: m.y + m.speed }))
              .filter(m => m.y < 110)
        );
      }, 16);
      return () => clearInterval(moveInterval);
    }
  }, [missingNos.length]);

  const handleShoot = (e: React.MouseEvent) => {
    if (!isBlasterEquipped) return;
    
    setTotalDamage(prev => prev + playerDamage);
    damageQueue.current += playerDamage;
    
    setIsHit(true);
    setTimeout(() => setIsHit(false), 50);

    if (containerRef.current) {
      const shot = document.createElement('div');
      shot.className = "absolute w-12 h-12 bg-white rounded-full animate-ping z-50 pointer-events-none shadow-[0_0_20px_white]";
      const rect = containerRef.current.getBoundingClientRect();
      shot.style.left = `${e.clientX - rect.left - 24}px`;
      shot.style.top = `${e.clientY - rect.top - 24}px`;
      containerRef.current.appendChild(shot);
      setTimeout(() => shot.remove(), 200);
    }
  };

  const spawnAttack = () => {
    setAttackActive(true);
    const newMissingNos = Array.from({ length: 8 }).map((_, i) => ({
      id: Date.now() + i,
      x: (i * 12) + 5,
      y: -20,
      speed: 2 + Math.random() * 4
    }));
    setMissingNos(prev => [...prev, ...newMissingNos]);
    setTimeout(() => setAttackActive(false), 2000);
  };

  const addPowerBall = () => {
    if (powerBalls < 10) setPowerBalls(p => p + 1);
  };

  const handleRecycle = () => {
    if (powerBalls >= 10) {
      alert("CRITICAL_SYSTEM_ERROR: THE_INTERNET_HAS_BEEN_RECYCLED. REALITY_STABILITY_AT_0%");
      onWin();
    }
  };

  return (
    <div 
      ref={containerRef}
      onClick={handleShoot}
      className={`w-full h-screen bg-[#0a0a20]/40 backdrop-blur-[2px] overflow-hidden relative cursor-none flex flex-col items-center justify-center transition-all ${isBlasterEquipped ? 'cursor-none' : ''}`}
    >
      {/* Background Grid simulating "Spawning on computer" */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none" />
      <div className="absolute inset-0 border-[32px] border-blue-500/10 pointer-events-none animate-pulse" />
      
      {/* Background Data Streams */}
      <div className="absolute inset-0 opacity-10 pointer-events-none font-mono text-cyan-500 text-[8px] flex flex-wrap gap-2 overflow-hidden leading-tight p-4">
        {Array.from({ length: 500 }).map((_, i) => (
          <span key={i} className="animate-pulse" style={{ animationDelay: `${Math.random() * 2}s` }}>
            {Math.random() > 0.5 ? 'GET' : 'POST'} /api/internet/spawn/{i} HTTP/1.1
          </span>
        ))}
      </div>

      {/* Packet Storm / MissingNo Attacks */}
      {missingNos.map(m => (
        <div key={m.id} className="absolute z-30" style={{ left: `${m.x}%`, top: `${m.y}%` }}>
          <MissingNoSprite className="scale-50 opacity-80" />
        </div>
      ))}

      {/* HUD / Damage Monitor */}
      <div className="absolute top-0 w-full bg-black/80 backdrop-blur-md border-b border-blue-500 p-4 flex justify-between items-start z-50">
         <div className="flex items-center gap-4">
            <Globe className="text-blue-400 w-10 h-10 animate-spin-slow" />
            <div>
                <h1 className="text-white text-2xl font-black italic tracking-tighter uppercase flex items-center gap-2">
                  <Wifi className="w-6 h-6 animate-pulse" /> ENTITY: THE_INTERNET
                </h1>
                <p className="text-[10px] text-blue-400 font-bold font-mono">OS_OVERLAY_SPAWN_SUCCESSFUL</p>
            </div>
         </div>
         
         <div className="flex gap-8">
            <div className="text-right">
                <span className="text-[10px] text-blue-300 uppercase font-black tracking-widest">Incoming DPS</span>
                <p className="text-3xl font-mono text-white tabular-nums">{lastDps.toLocaleString()}</p>
            </div>
            <div className="text-right border-l border-white/20 pl-8">
                <span className="text-[10px] text-red-400 uppercase font-black tracking-widest">Global Lag Index</span>
                <p className="text-3xl font-mono text-red-500 tabular-nums">{totalDamage.toLocaleString()}</p>
            </div>
         </div>
      </div>

      {/* Side Control Panel */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 space-y-4 z-50 w-64 bg-slate-900/90 border-2 border-blue-500 p-6 rounded-2xl backdrop-blur-xl shadow-2xl">
         <div className="space-y-2">
            <span className="text-[10px] text-blue-400 font-black uppercase flex items-center gap-2">
              <Cpu className="w-4 h-4" /> Internet Actions
            </span>
            <button 
                onClick={(e) => { e.stopPropagation(); spawnAttack(); }}
                disabled={attackActive}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded font-black text-xs uppercase border border-blue-400 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
            >
              <Database className="w-4 h-4" /> Execute: Packet Storm
            </button>
            <p className="text-[8px] text-blue-300 italic">"First attack you can make it spawn"</p>
         </div>

         <div className="pt-4 border-t border-white/10 space-y-4">
            <span className="text-[10px] text-yellow-400 font-black uppercase">Failure Threshold</span>
            <div className="grid grid-cols-5 gap-1">
                {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className={`h-4 border transition-all ${i < powerBalls ? 'bg-yellow-400 border-white shadow-[0_0_5px_yellow] scale-110' : 'bg-slate-800 border-slate-700'}`} />
                ))}
            </div>
            <button 
                onClick={(e) => { e.stopPropagation(); addPowerBall(); }}
                disabled={powerBalls >= 10}
                className={`w-full py-2 px-4 rounded font-black text-[10px] uppercase border transition-all ${powerBalls >= 10 ? 'bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-400 text-black border-yellow-200 shadow-lg'}`}
            >
                {powerBalls >= 10 ? 'POWER_LIMIT_MAX' : 'Inject Power Ball'}
            </button>
         </div>

         <div className="pt-4 border-t border-white/10">
            <button 
                onClick={(e) => { e.stopPropagation(); handleRecycle(); }}
                disabled={powerBalls < 10}
                className={`w-full py-4 px-4 rounded font-black text-sm uppercase flex items-center justify-center gap-3 transition-all ${powerBalls >= 10 ? 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_25px_red] animate-pulse cursor-pointer' : 'bg-slate-800 text-slate-600 border-slate-700 cursor-not-allowed'}`}
            >
                <Recycle className="w-5 h-5" />
                Recycle Reality
            </button>
         </div>
      </div>

      {/* The Internet Boss Entity */}
      <div 
        className={`relative z-40 transition-all duration-300 ${isHit ? 'scale-110 brightness-150' : 'scale-100'}`}
        style={{ 
            transform: `scale(${1 + glitchIntensity * 0.05}) rotate(${glitchIntensity * 2}deg)`
        }}
      >
        <div className="absolute -inset-64 rounded-full blur-[180px] bg-blue-600/30 animate-pulse pointer-events-none" />
        
        <div className="relative w-96 h-96 group">
            {/* Orbiting MissingNos */}
            <div className="absolute -top-20 -left-20 animate-bounce duration-[2s]">
              <MissingNoSprite className="scale-75 rotate-[-15deg] opacity-60" />
            </div>
            <div className="absolute -bottom-20 -right-20 animate-bounce duration-[3s]">
              <MissingNoSprite className="scale-75 rotate-[15deg] opacity-60" />
            </div>

            <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping" />
            <div className="absolute inset-0 border-8 border-cyan-400/50 rounded-full animate-spin-slow" />
            
            <div className={`w-full h-full bg-gradient-to-br from-blue-700 to-indigo-950 rounded-full border-[12px] border-white shadow-[0_0_100px_rgba(59,130,246,0.8)] flex flex-col items-center justify-center relative overflow-hidden transition-all ${isHit ? 'bg-white' : ''}`}>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30" />
                
                {/* Glitch Overlay */}
                {glitchIntensity > 0.8 && (
                    <div className="absolute inset-0 bg-red-600/30 mix-blend-overlay z-10 flex items-center justify-center">
                        <span className="text-white font-black text-7xl tracking-[1em] opacity-40">NULL_PTR</span>
                    </div>
                )}

                <Globe className={`w-48 h-48 ${isHit ? 'text-blue-950' : 'text-white'} drop-shadow-[0_0_30px_white] transition-colors`} />
                <div className={`mt-4 font-black italic text-5xl tracking-tighter transition-colors ${isHit ? 'text-blue-900' : 'text-white'}`}>.EXE</div>
                
                <div className="absolute top-10 right-10 bg-black text-cyan-400 px-2 py-1 text-[10px] font-mono border border-cyan-500 shadow-[0_0_10px_cyan]">TCP/IP</div>
                <div className="absolute bottom-10 left-10 bg-black text-yellow-400 px-2 py-1 text-[10px] font-mono border border-yellow-500">PACKET_LOSS_MAX</div>
            </div>
        </div>

        {/* Damage Numbers */}
        {isHit && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-white font-black text-5xl italic animate-out fade-out slide-out-to-top-32 duration-700">
                    -{playerDamage}
                </span>
            </div>
        )}
      </div>

      {/* MissingNo Info Panel */}
      <div className="absolute bottom-8 right-8 bg-black/80 border-2 border-white p-4 w-48 rounded-lg shadow-2xl z-50">
        <h3 className="text-[10px] text-white font-black uppercase mb-2 flex items-center gap-2">
          <ShieldAlert className="w-3 h-3 text-red-500" /> Glitch_Log:
        </h3>
        <div className="flex gap-2 items-center">
          <MissingNoSprite className="scale-[0.3] origin-top-left -mr-16" />
          <p className="text-[8px] text-gray-300 leading-tight">
            Anomalous Entity "MissingNo" detected in packet headers. 
            Data corruption spread: {Math.floor(glitchIntensity * 100)}%
          </p>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[11px] font-black text-blue-400/50 uppercase tracking-[0.5em] animate-pulse pointer-events-none">
        INTERNET_LAYER_OVERRIDE_RUNNING
      </div>

      <style>{`
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default InternetBoss;
