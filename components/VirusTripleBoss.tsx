
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Skull, Bug, Terminal, Zap, ShieldAlert, Cpu, Activity, AlertTriangle } from 'lucide-react';
import { Projectile } from '../types';

interface VirusTripleBossProps {
  onWin: () => void;
  onFail: () => void;
}

interface SwarmBot {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  hp: number;
}

const VirusTripleBoss: React.FC<VirusTripleBossProps> = ({ onWin, onFail }) => {
  const [phase, setPhase] = useState<'swarm' | 'combine' | 'chimera'>('swarm');
  const [bots, setBots] = useState<SwarmBot[]>([]);
  const [projectiles, setProjectiles] = useState<Projectile[]>([]);
  const [playerHp, setPlayerHp] = useState(10);
  const [chimeraHp, setChimeraHp] = useState({ head: 1000, leftWing: 500, rightWing: 500 });
  const [chimeraPos, setChimeraPos] = useState({ x: 50, y: 40 });
  const [isMerging, setIsMerging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initial swarm setup
  useEffect(() => {
    const initialBots: SwarmBot[] = Array.from({ length: 3 }).map((_, i) => ({
      id: `bot-${i}`,
      x: 20 + i * 30,
      y: 30,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      hp: 100
    }));
    setBots(initialBots);
  }, []);

  // Main game loop
  useEffect(() => {
    const loop = setInterval(() => {
      if (phase === 'swarm') {
        setBots(prev => prev.map(bot => {
          let nextX = bot.x + bot.vx;
          let nextY = bot.y + bot.vy;

          if (nextX < 10 || nextX > 90) bot.vx *= -1;
          if (nextY < 10 || nextY > 70) bot.vy *= -1;

          if (Math.random() < 0.05) {
            setProjectiles(p => [...p, {
              id: Math.random().toString(),
              x: bot.x,
              y: bot.y,
              type: 'virus_splat',
              vx: (Math.random() - 0.5) * 6,
              vy: Math.random() * 5 + 2
            }]);
          }

          return { ...bot, x: nextX, y: nextY };
        }));
      }

      if (phase === 'chimera') {
        setChimeraPos(prev => ({
          x: 50 + Math.sin(Date.now() / 1000) * 10,
          y: 40 + Math.cos(Date.now() / 800) * 5
        }));

        if (Math.random() < 0.1) {
            setProjectiles(p => [...p, {
                id: Math.random().toString(),
                x: chimeraPos.x + (Math.random() - 0.5) * 20,
                y: chimeraPos.y,
                type: 'virus_splat',
                vx: (Math.random() - 0.5) * 10,
                vy: Math.random() * 8 + 4
            }]);
        }
      }

      // Physics
      setProjectiles(prev => {
        const updated = prev.map(p => ({ ...p, x: p.x + p.vx, y: p.y + p.vy }));
        const playerX = 50;
        const playerY = 90;

        const hits = updated.filter(p => {
          const dx = p.x - playerX;
          const dy = p.y - playerY;
          return Math.sqrt(dx*dx + dy*dy) < 5;
        });

        if (hits.length > 0) {
          setPlayerHp(h => {
            const next = h - hits.length;
            if (next <= 0) onFail();
            return next;
          });
        }

        return updated.filter(p => p.x > -10 && p.x < 110 && p.y > -10 && p.y < 110);
      });

    }, 32);

    return () => clearInterval(loop);
  }, [phase, chimeraPos, onFail]);

  const handleBotClick = (id: string) => {
    setBots(prev => {
      const next = prev.map(b => b.id === id ? { ...b, hp: b.hp - 20 } : b).filter(b => b.hp > 0);
      if (next.length === 0 && !isMerging) {
        setIsMerging(true);
        setPhase('combine');
        setTimeout(() => setPhase('chimera'), 3000);
      }
      return next;
    });
  };

  const handleChimeraPartHit = (part: 'head' | 'leftWing' | 'rightWing') => {
    setChimeraHp(prev => {
      const next = { ...prev, [part]: Math.max(0, prev[part] - 50) };
      if (next.head <= 0 && next.leftWing <= 0 && next.rightWing <= 0) {
        onWin();
      }
      return next;
    });
  };

  return (
    <div className="w-full h-screen bg-[#050505] overflow-hidden relative font-mono cursor-crosshair">
      <div className="absolute inset-0 bg-green-900/10 mix-blend-overlay pointer-events-none z-0" />
      
      {/* HUD */}
      <div className="absolute top-0 w-full p-6 flex justify-between items-start z-50 bg-black/80 border-b border-green-900 shadow-2xl">
        <div className="flex items-center gap-4 text-green-500">
          <ShieldAlert className="w-10 h-10 animate-pulse" />
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter uppercase">CHIMERA_VIRUS_AMALGAM</h1>
            <p className="text-[10px] text-green-600 font-bold opacity-70">STATUS: CORE_STABILITY_CRITICAL</p>
          </div>
        </div>
        <div className="flex gap-10">
           {phase === 'chimera' && (
              <div className="flex flex-col gap-2">
                 <div className="flex items-center justify-between text-[10px] text-red-500"><span>NEURAL_CORE</span> <span>{chimeraHp.head} HP</span></div>
                 <div className="w-48 h-2 bg-red-950 border border-red-500/30 overflow-hidden"><div className="h-full bg-red-600" style={{ width: `${(chimeraHp.head / 1000) * 100}%` }} /></div>
                 <div className="flex items-center justify-between text-[10px] text-green-500"><span>DATA_WINGS</span> <span>{(chimeraHp.leftWing + chimeraHp.rightWing)} HP</span></div>
                 <div className="w-48 h-2 bg-green-950 border border-green-500/30 overflow-hidden"><div className="h-full bg-green-600" style={{ width: `${((chimeraHp.leftWing + chimeraHp.rightWing) / 1000) * 100}%` }} /></div>
              </div>
           )}
           <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-blue-400">System Core Health</span>
              <div className="flex gap-1 mt-1">
                {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className={`w-3 h-6 border ${i < playerHp ? 'bg-blue-400 border-blue-300' : 'bg-gray-800 border-gray-700'}`} />
                ))}
              </div>
           </div>
        </div>
      </div>

      {/* Hex Background Decor */}
      <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden select-none text-[8px] leading-tight text-green-500">
        {Array.from({ length: 100 }).map((_, i) => (
           <div key={i} className="whitespace-nowrap">
             {Array.from({ length: 200 }).map(() => (Math.random() > 0.5 ? '1' : '0'))}
           </div>
        ))}
      </div>

      {/* Projectiles */}
      {projectiles.map(p => (
        <div 
          key={p.id} 
          className="absolute w-4 h-4 bg-green-500 shadow-[0_0_10px_lime] rounded-full animate-ping"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
        />
      ))}

      {/* Swarm Phase */}
      {phase === 'swarm' && bots.map(bot => (
        <div 
          key={bot.id} 
          onClick={() => handleBotClick(bot.id)}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group hover:scale-125 transition-transform"
          style={{ left: `${bot.x}%`, top: `${bot.y}%` }}
        >
          <div className="relative">
             <Bug className="w-16 h-16 text-green-500 drop-shadow-[0_0_15px_lime]" />
             <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-1 bg-red-900 border border-red-500/30">
                <div className="h-full bg-red-500" style={{ width: `${bot.hp}%` }} />
             </div>
          </div>
        </div>
      ))}

      {/* Combination Phase */}
      {phase === 'combine' && (
        <div className="absolute inset-0 flex items-center justify-center bg-green-500/5 backdrop-blur-sm z-30">
           <div className="text-center animate-in zoom-in duration-500">
              <Cpu className="w-48 h-48 text-green-500 animate-spin-slow" />
              <h2 className="text-4xl font-black text-white italic tracking-tighter mt-8 animate-pulse">RECONFIGURING_VIRUS_VECTORS...</h2>
              <div className="text-green-500 font-bold text-xs mt-2 font-mono">FRAGMENTS_COMBINING_INTO_GIGA_KERNEL_THREAT</div>
           </div>
        </div>
      )}

      {/* Chimera Phase */}
      {phase === 'chimera' && (
        <div 
          className="absolute transform -translate-x-1/2 -translate-y-1/2 z-40 transition-all duration-300"
          style={{ left: `${chimeraPos.x}%`, top: `${chimeraPos.y}%` }}
        >
          <div className="relative flex flex-col items-center">
             {/* Wings */}
             <div className="flex gap-16">
                <div 
                    onClick={() => handleChimeraPartHit('leftWing')}
                    className={`w-32 h-32 flex flex-col items-center justify-center border-4 border-green-500 bg-green-950/40 rounded-full cursor-pointer transition-all hover:scale-110 active:scale-95 ${chimeraHp.leftWing <= 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                >
                    <Activity className="w-16 h-16 text-green-400" />
                    <span className="text-[10px] text-green-500 font-bold">L_WING</span>
                </div>
                <div 
                    onClick={() => handleChimeraPartHit('rightWing')}
                    className={`w-32 h-32 flex flex-col items-center justify-center border-4 border-green-500 bg-green-950/40 rounded-full cursor-pointer transition-all hover:scale-110 active:scale-95 ${chimeraHp.rightWing <= 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                >
                    <Activity className="w-16 h-16 text-green-400" />
                    <span className="text-[10px] text-green-500 font-bold">R_WING</span>
                </div>
             </div>

             {/* Neural Core (Head) */}
             <div 
                onClick={() => handleChimeraPartHit('head')}
                className={`mt-[-40px] w-56 h-56 flex flex-col items-center justify-center border-8 border-red-600 bg-black/80 rounded-2xl cursor-pointer transition-all hover:scale-110 active:scale-95 shadow-[0_0_40px_rgba(220,38,38,0.4)] ${chimeraHp.head <= 0 ? 'opacity-20 animate-pulse' : 'opacity-100'}`}
             >
                <Skull className={`w-32 h-32 text-red-600 ${chimeraHp.head <= 0 ? 'text-gray-600' : 'glitch-effect'}`} />
                <span className="text-xs text-red-500 font-black tracking-widest uppercase mt-2">NEURAL_GOD_CORE</span>
                <div className="text-[8px] text-red-500/50 mt-1">DAMAGE_X{chimeraHp.head > 0 ? '5' : '1'}</div>
             </div>

             {/* Connection Lines */}
             <div className="absolute inset-0 z-[-1] opacity-50">
                <svg className="w-full h-full overflow-visible">
                   <line x1="50%" y1="50%" x2="0%" y2="0%" stroke="red" strokeWidth="2" />
                   <line x1="50%" y1="50%" x2="100%" y2="0%" stroke="red" strokeWidth="2" />
                </svg>
             </div>
          </div>
        </div>
      )}

      {/* Player Core */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center group">
         <div className="relative">
            <div className="absolute -inset-10 bg-blue-500/10 rounded-full blur-2xl animate-pulse" />
            <Zap className="w-16 h-16 text-blue-400 group-hover:text-blue-200 transition-colors drop-shadow-[0_0_10px_cyan]" />
         </div>
         <div className="text-blue-500 text-[10px] font-bold mt-2 tracking-widest uppercase">System Core Unit</div>
      </div>

      <style>{`
        .glitch-effect { animation: chimera-glitch 0.5s infinite; }
        @keyframes chimera-glitch {
          0% { transform: translate(0); }
          25% { transform: translate(-2px, 2px); filter: hue-rotate(90deg); }
          50% { transform: translate(2px, -2px); filter: invert(0.2); }
          75% { transform: translate(-2px, -2px) scale(1.02); }
          100% { transform: translate(0); }
        }
        .animate-spin-slow { animation: spin 4s linear infinite; }
      `}</style>
    </div>
  );
};

export default VirusTripleBoss;
