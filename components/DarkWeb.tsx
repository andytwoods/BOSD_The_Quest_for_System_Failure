
import React, { useState, useEffect, useCallback } from 'react';
import { Skull, Terminal, Ghost, ShieldX, Zap, AlertTriangle, Radiation } from 'lucide-react';
import { Projectile } from '../types';

interface DarkWebProps {
  onWin: () => void;
  onFail: () => void;
}

const DarkWeb: React.FC<DarkWebProps> = ({ onWin, onFail }) => {
  const [bossHp, setBossHp] = useState(2500);
  const [projectiles, setProjectiles] = useState<Projectile[]>([]);
  const [popups, setPopups] = useState<{ id: number; x: number; y: number; text: string }[]>([]);
  const [playerHp, setPlayerHp] = useState(5);
  const [bossPos, setBossPos] = useState({ x: 50, y: 30 });
  const [isBossActive, setIsBossActive] = useState(false);

  // Phase 1: Multiple Virus Responses (Popups)
  useEffect(() => {
    const popupInterval = setInterval(() => {
      if (popups.length < 15) {
        setPopups(prev => [...prev, {
          id: Date.now(),
          x: Math.random() * 70 + 15,
          y: Math.random() * 70 + 15,
          text: ["VIRUS_FOUND", "ENCRYPTION_FAIL", "WIPE_PENDING", "SYSTEM_DEAD"][Math.floor(Math.random() * 4)]
        }]);
      }
    }, 1500);

    const activateBoss = setTimeout(() => setIsBossActive(true), 5000);

    return () => {
      clearInterval(popupInterval);
      clearTimeout(activateBoss);
    };
  }, [popups.length]);

  // Boss Mechanics
  useEffect(() => {
    if (!isBossActive) return;

    const moveInt = setInterval(() => {
      setBossPos({ x: Math.random() * 60 + 20, y: Math.random() * 40 + 10 });
    }, 1000);

    const attackInt = setInterval(() => {
      const newPs: Projectile[] = Array.from({ length: 8 }).map((_, i) => ({
        id: Math.random().toString(),
        x: bossPos.x,
        y: bossPos.y,
        type: 'glitch',
        vx: Math.cos(i * (Math.PI / 4)) * 8,
        vy: Math.sin(i * (Math.PI / 4)) * 8
      }));
      setProjectiles(prev => [...prev, ...newPs]);
    }, 1200);

    const physicsInt = setInterval(() => {
      setProjectiles(prev => {
        const updated = prev.map(p => ({ ...p, x: p.x + p.vx, y: p.y + p.vy }));
        const hits = updated.filter(p => p.y > 90 && Math.abs(p.x - 50) < 15);
        if (hits.length > 0) {
            setPlayerHp(h => {
                if (h <= 1) onFail();
                return h - 1;
            });
        }
        return updated.filter(p => p.y < 110 && p.y > -10 && p.x > -10 && p.x < 110);
      });
    }, 16);

    return () => {
      clearInterval(moveInt);
      clearInterval(attackInt);
      clearInterval(physicsInt);
    };
  }, [isBossActive, bossPos, onFail]);

  const closePopup = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setPopups(prev => prev.filter(p => p.id !== id));
  };

  const handleBossHit = () => {
    if (!isBossActive) return;
    setBossHp(h => {
        if (h <= 100) onWin();
        return h - 100;
    });
  };

  return (
    <div className="w-full h-screen bg-[#050505] overflow-hidden relative font-mono cursor-crosshair">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 mix-blend-overlay" />
      
      {/* Matrix Rain Background Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="absolute text-[8px] text-green-500 whitespace-nowrap animate-slide-down" style={{ left: `${i * 5}%`, animationDuration: `${2 + Math.random() * 3}s` }}>
            {Array.from({ length: 50 }).map(() => String.fromCharCode(33 + Math.floor(Math.random() * 94)))}
          </div>
        ))}
      </div>

      {/* Popups (Virus Responses) */}
      {popups.map(p => (
        <div 
          key={p.id}
          className="absolute w-40 bg-red-600 border border-white text-white p-2 shadow-[10px_10px_0px_black] z-[55] animate-in zoom-in-90"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
        >
          <div className="flex justify-between items-center border-b border-white mb-1 pb-1">
            <span className="text-[10px] font-bold">WARNING!</span>
            <button onClick={(e) => closePopup(p.id, e)} className="hover:bg-white hover:text-red-600 px-1">X</button>
          </div>
          <p className="text-[8px] leading-tight break-all">{p.text} - STABLE_OS_BREACHED_DATA_LEAK_0x{p.id.toString().slice(-4)}</p>
        </div>
      ))}

      {/* Header */}
      <div className="absolute top-0 w-full p-4 flex justify-between items-center z-50 bg-black/80 border-b border-red-900 shadow-2xl">
        <div className="flex items-center gap-4 text-red-500">
          <Radiation className="w-8 h-8 animate-spin-slow" />
          <div>
            <h1 className="text-3xl font-black italic tracking-tighter">DARK_WEB_VOID_LAYER</h1>
            <p className="text-[10px] text-green-500 opacity-60 font-bold">ENCRYPTION: DISABLED | STATUS: COMPROMISED</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
            <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-red-400">Boss Integrity</span>
                <div className="w-48 h-3 bg-red-950 border border-red-500/30">
                    <div className="h-full bg-red-600 transition-all shadow-[0_0_15px_red]" style={{ width: `${(bossHp/2500)*100}%` }} />
                </div>
            </div>
            <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-blue-400">System Core HP</span>
                <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Zap key={i} className={`w-4 h-4 ${i < playerHp ? 'text-blue-400 fill-blue-400' : 'text-gray-800'}`} />
                    ))}
                </div>
            </div>
        </div>
      </div>

      {/* Ultra Dark Web Boss */}
      {isBossActive && (
        <div 
          onClick={handleBossHit}
          className="absolute transition-all duration-700 ease-in-out group z-40"
          style={{ left: `${bossPos.x}%`, top: `${bossPos.y}%` }}
        >
            <div className="relative transform hover:scale-110 active:scale-95 transition-all">
                <div className="absolute -inset-20 bg-red-600/10 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute -inset-10 bg-black border-2 border-red-600 rotate-45 animate-spin-slow opacity-20" />
                <Skull className="w-48 h-48 text-red-600 drop-shadow-[0_0_30px_red] glitch-effect" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <Ghost className="w-12 h-12 text-white animate-ping opacity-50" />
                </div>
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-black text-red-500 uppercase tracking-widest italic animate-bounce">
                    ULTRA_DARK_BOSS_vX
                </div>
            </div>
        </div>
      )}

      {/* Projectiles */}
      {projectiles.map(p => (
        <div 
          key={p.id} 
          className="absolute w-6 h-6 text-red-600"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
        >
          <ShieldX className="w-full h-full animate-spin shadow-[0_0_10px_red]" />
        </div>
      ))}

      {/* Player Shield / Core */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center group">
        <div className="relative">
            <div className="absolute -inset-8 bg-blue-500/10 rounded-full blur-2xl animate-pulse" />
            <Terminal className="w-16 h-16 text-blue-400 group-hover:text-blue-200 transition-colors" />
        </div>
        <span className="text-blue-500 text-[10px] font-bold mt-2 tracking-widest uppercase">System Control Unit</span>
      </div>

      {/* Side Alerts */}
      <div className="absolute top-1/2 right-4 -translate-y-1/2 space-y-2 opacity-50">
        <AlertTriangle className="w-4 h-4 text-yellow-500 animate-pulse" />
        <AlertTriangle className="w-4 h-4 text-yellow-500 animate-pulse" />
        <AlertTriangle className="w-4 h-4 text-yellow-500 animate-pulse" />
      </div>

      <style>{`
        @keyframes slide-down {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100vh); }
        }
        .animate-slide-down {
            animation: slide-down 3s linear infinite;
        }
        .animate-spin-slow {
            animation: spin 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default DarkWeb;
