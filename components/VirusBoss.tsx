
import React, { useState, useEffect } from 'react';
import { ShieldAlert, Bug, Skull, Terminal, Zap } from 'lucide-react';
import { Projectile } from '../types';

interface VirusBossProps {
  onWin: () => void;
  onFail: () => void;
}

const VirusBoss: React.FC<VirusBossProps> = ({ onWin, onFail }) => {
  const [hp, setHp] = useState(1000);
  const [projectiles, setProjectiles] = useState<Projectile[]>([]);
  const [playerHp, setPlayerHp] = useState(1); // One hit death!
  const [bossPos, setBossPos] = useState({ x: 50, y: 30 });

  useEffect(() => {
    const moveInt = setInterval(() => {
      setBossPos({ x: Math.random() * 80 + 10, y: Math.random() * 50 + 10 });
    }, 500);

    const attackInt = setInterval(() => {
      const pCount = 5;
      const newPs: Projectile[] = [];
      for (let i = 0; i < pCount; i++) {
        newPs.push({
          id: Math.random().toString(),
          x: bossPos.x,
          y: bossPos.y,
          type: 'virus',
          vx: (Math.random() - 0.5) * 15,
          vy: Math.random() * 10 + 5
        });
      }
      setProjectiles(prev => [...prev, ...newPs]);
    }, 800);

    const physicsInt = setInterval(() => {
      setProjectiles(prev => {
        const updated = prev.map(p => ({ ...p, x: p.x + p.vx, y: p.y + p.vy }));
        const hits = updated.filter(p => p.y > 90 && Math.abs(p.x - 50) < 10);
        if (hits.length > 0) {
          onFail();
        }
        return updated.filter(p => p.y < 110);
      });
    }, 16);

    return () => {
      clearInterval(moveInt);
      clearInterval(attackInt);
      clearInterval(physicsInt);
    };
  }, [bossPos, onFail]);

  const handleHit = () => {
    const next = hp - 50;
    if (next <= 0) onWin();
    setHp(next);
  };

  return (
    <div className="w-full h-screen bg-black overflow-hidden relative cursor-crosshair">
      <div className="absolute inset-0 bg-red-900/10 pointer-events-none animate-pulse" />
      
      {/* Header */}
      <div className="absolute top-0 w-full p-4 bg-red-600 text-white flex justify-between items-center z-50 shadow-2xl">
        <div className="flex items-center gap-4">
          <Skull className="w-8 h-8 animate-bounce" />
          <h1 className="text-4xl font-black italic tracking-tighter">VIRUS_LEVEL_GOD_CORE</h1>
        </div>
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold uppercase opacity-70">Boss Integrity</span>
            <div className="w-64 h-4 bg-black border border-white/20">
              <div className="h-full bg-red-500 shadow-[0_0_10px_red] transition-all" style={{ width: `${(hp/1000)*100}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Projectiles */}
      {projectiles.map(p => (
        <div 
          key={p.id} 
          className="absolute w-6 h-6 text-green-500 animate-spin"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
        >
          <Terminal className="w-full h-full drop-shadow-[0_0_5px_lime]" />
        </div>
      ))}

      {/* Boss */}
      <div 
        onClick={handleHit}
        className="absolute transition-all duration-300 group"
        style={{ left: `${bossPos.x}%`, top: `${bossPos.y}%` }}
      >
        <div className="relative cursor-pointer">
          <div className="absolute -inset-10 bg-green-500/20 rounded-full blur-3xl animate-ping" />
          <Bug className="w-32 h-32 text-green-400 drop-shadow-[0_0_20px_lime] group-hover:scale-110 transition-transform" />
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
            <span className="text-green-900 text-xl font-black">X_X</span>
          </div>
        </div>
      </div>

      {/* Player Icon */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
        <Zap className="w-12 h-12 text-blue-400 animate-pulse" />
        <span className="text-blue-400 text-xs font-mono mt-2 uppercase">Your System</span>
      </div>

      {/* Warnings */}
      <div className="absolute bottom-4 left-4 font-mono text-red-500 text-[10px] space-y-1">
        <p className="animate-pulse">CRITICAL: RECYCLE BIN DELETED</p>
        <p>OVERRIDE STATUS: MANUAL_COMBAT_REQUIRED</p>
      </div>
    </div>
  );
};

export default VirusBoss;
