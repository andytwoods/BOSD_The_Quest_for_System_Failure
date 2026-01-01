
import React, { useState, useEffect, useRef } from 'react';
import { Skull, ShieldAlert, Zap, Activity, Crosshair, Terminal, Bug, Radio, AlertTriangle } from 'lucide-react';
import { BossStats, Projectile } from '../types';

interface CustomBossContainerProps {
  stats: BossStats;
  icon: string;
  onWin: () => void;
  onFail: () => void;
  isBlasterEquipped: boolean;
  playerDamage: number;
}

const CustomBossContainer: React.FC<CustomBossContainerProps> = ({ stats, icon, onWin, onFail, isBlasterEquipped, playerDamage }) => {
  const [hp, setHp] = useState(stats.hp);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [isHit, setIsHit] = useState(false);
  const [projectiles, setProjectiles] = useState<Projectile[]>([]);
  const [playerHp, setPlayerHp] = useState(10);
  const containerRef = useRef<HTMLDivElement>(null);

  const moveDelay = stats.speed === 'high' ? 300 : stats.speed === 'med' ? 600 : 1000;
  const attackFreq = stats.speed === 'high' ? 0.2 : stats.speed === 'med' ? 0.1 : 0.05;

  useEffect(() => {
    const moveInt = setInterval(() => {
      setPos({ x: Math.random() * 70 + 15, y: Math.random() * 60 + 20 });
    }, moveDelay);

    const gameLoop = setInterval(() => {
        // AI attack frequency
        if (Math.random() < attackFreq) {
            setProjectiles(prev => [...prev, {
                id: Math.random().toString(),
                x: pos.x,
                y: pos.y,
                type: 'custom',
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() * 8) + 2
            }]);
        }

        // Projectile physics
        setProjectiles(prev => {
            const updated = prev.map(p => ({ ...p, x: p.x + p.vx, y: p.y + p.vy }));
            const hits = updated.filter(p => p.y > 85 && Math.abs(p.x - 50) < 10);
            
            if (hits.length > 0) {
                setPlayerHp(h => {
                    const next = h - hits.length;
                    if (next <= 0) onFail();
                    return next;
                });
            }
            return updated.filter(p => p.y < 110 && p.x > -10 && p.x < 110);
        });
    }, 32);

    return () => {
        clearInterval(moveInt);
        clearInterval(gameLoop);
    };
  }, [pos, moveDelay, attackFreq, onFail]);

  const handleShoot = (e: React.MouseEvent) => {
    if (!isBlasterEquipped) return;
    if (isHit) return;

    const nextHp = Math.max(0, hp - playerDamage);
    setHp(nextHp);
    setIsHit(true);
    setTimeout(() => setIsHit(false), 100);

    if (containerRef.current) {
        const shot = document.createElement('div');
        shot.className = "absolute w-16 h-16 bg-blue-400 rounded-full animate-ping z-50 pointer-events-none shadow-[0_0_30px_blue]";
        const rect = containerRef.current.getBoundingClientRect();
        shot.style.left = `${e.clientX - rect.left - 32}px`;
        shot.style.top = `${e.clientY - rect.top - 32}px`;
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
        className={`w-full h-screen bg-[#111] overflow-hidden relative cursor-none flex flex-col items-center justify-center ${isHit ? 'brightness-150' : ''}`}
    >
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      
      <div className="absolute top-0 w-full bg-black/80 border-b border-white/20 p-6 flex justify-between items-center z-50">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded border-2 border-white overflow-hidden shadow-lg">
                <img src={icon} alt="App Icon" className="w-full h-full object-cover" />
            </div>
            <div>
                <h1 className="text-white text-3xl font-black italic tracking-tighter uppercase">{stats.name}</h1>
                <p className="text-[10px] text-gray-400 font-mono">THREAT_LEVEL: {stats.speed.toUpperCase()}</p>
            </div>
         </div>
         <div className="text-right">
            <div className="flex justify-between items-end mb-1">
                <span className="text-[10px] text-red-400 uppercase font-black">Core Stability: {hp}</span>
                <span className="text-[8px] text-gray-500">SPEED: {stats.speed}</span>
            </div>
            <div className="w-96 h-4 bg-zinc-900 border border-white/20 relative overflow-hidden">
                <div className="h-full bg-red-600 transition-all duration-300 shadow-[0_0_15px_red]" style={{ width: `${(hp/stats.maxHp)*100}%` }} />
            </div>
         </div>
      </div>

      {projectiles.map(p => (
          <div 
            key={p.id}
            className="absolute w-4 h-4 bg-red-500 rounded-full shadow-[0_0_10px_red] animate-pulse"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          />
      ))}

      <div 
        className="absolute transition-all duration-300 ease-in-out group z-40"
        style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)' }}
      >
        <div className="relative group flex flex-col items-center">
            <div className={`absolute -inset-20 bg-red-500/10 rounded-full blur-[100px] animate-pulse`} />
            <div className="w-64 h-64 bg-black border-4 border-white shadow-2xl relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
                <img src={icon} alt="Boss Entity" className="w-full h-full object-contain" />
                {isHit && <div className="absolute inset-0 bg-white/40 animate-flash" />}
            </div>
            <div className="mt-4 bg-black/80 border border-white/20 p-2 text-center max-w-xs shadow-lg rounded">
                <p className="text-[9px] text-gray-300 italic">"{stats.description}"</p>
            </div>
        </div>
      </div>

      {/* Player Unit */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center z-50">
          <Zap className="w-12 h-12 text-blue-400 animate-pulse drop-shadow-[0_0_10px_cyan]" />
          <div className="flex gap-1 mt-2">
            {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className={`w-3 h-4 border ${i < playerHp ? 'bg-blue-400 border-blue-200 shadow-[0_0_5px_cyan]' : 'bg-gray-800 border-gray-700'}`} />
            ))}
          </div>
          <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest mt-2">User System Integrity</span>
      </div>

      {!isBlasterEquipped && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-[100] backdrop-blur-sm">
             <div className="bg-red-600 text-white p-8 rounded-xl border-4 border-white animate-bounce text-center">
                <ShieldAlert className="w-16 h-16 mx-auto mb-4" />
                <h2 className="text-4xl font-black italic tracking-tighter">WEAPON_REQUIRED</h2>
                <p className="mt-2 font-bold">ACTIVATE THE KERNEL BLASTER IN HUD</p>
             </div>
        </div>
      )}

      <style>{`
        @keyframes flash {
            0%, 100% { opacity: 0; }
            50% { opacity: 1; }
        }
        .animate-flash { animation: flash 0.1s; }
      `}</style>
    </div>
  );
};

export default CustomBossContainer;
