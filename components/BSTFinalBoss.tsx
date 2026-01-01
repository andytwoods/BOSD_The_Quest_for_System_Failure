
import React, { useState, useEffect, useRef } from 'react';
import { Skull, Zap, Globe, ShieldAlert, Activity, Cpu, Hammer, Box, MousePointer2, AlertTriangle, Trash2, Crosshair } from 'lucide-react';
import { Projectile } from '../types';

interface BSTFinalBossProps {
  onWin: () => void;
  onFail: () => void;
}

const BSTFinalBoss: React.FC<BSTFinalBossProps> = ({ onWin, onFail }) => {
  const [hp, setHp] = useState(20000);
  const [maxHp] = useState(20000);
  const [playerHp, setPlayerHp] = useState(100);
  const [maxPlayerHp] = useState(100);
  const [projectiles, setProjectiles] = useState<Projectile[]>([]);
  const [allyProjectiles, setAllyProjectiles] = useState<{ id: string; x: number; y: number; vx: number; vy: number; color: string }[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [bossPos, setBossPos] = useState({ x: 50, y: 40 });
  const [isHit, setIsHit] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const gameLoop = setInterval(() => {
      // Boss Movement
      setBossPos(prev => ({
        x: 50 + Math.sin(Date.now() / 600) * 15,
        y: 40 + Math.cos(Date.now() / 400) * 5
      }));

      // Ally Attacks (The Glitch and The Internet)
      if (Math.random() < 0.2) {
          const side = Math.random() > 0.5 ? 'glitch' : 'internet';
          const startX = side === 'glitch' ? 10 : 90;
          const startY = side === 'glitch' ? 40 : 40;
          const dx = bossPos.x - startX;
          const dy = bossPos.y - startY;
          const dist = Math.sqrt(dx*dx + dy*dy);
          
          setAllyProjectiles(prev => [...prev, {
              id: Math.random().toString(),
              x: startX,
              y: startY,
              vx: (dx / dist) * 2,
              vy: (dy / dist) * 2,
              color: side === 'glitch' ? 'bg-red-500 shadow-[0_0_10px_red]' : 'bg-blue-500 shadow-[0_0_10px_cyan]'
          }]);
      }

      // Update Ally Projectiles & Collisions
      setAllyProjectiles(prev => {
          const updated = prev.map(p => ({ ...p, x: p.x + p.vx, y: p.y + p.vy }));
          const hits = updated.filter(p => {
              const dx = p.x - bossPos.x;
              const dy = p.y - bossPos.y;
              return Math.sqrt(dx*dx + dy*dy) < 8;
          });

          if (hits.length > 0) {
              setHp(h => {
                  const next = Math.max(0, h - hits.length * 100);
                  if (next <= 0) onWin();
                  return next;
              });
          }
          return updated.filter(p => p.x > -10 && p.x < 110 && p.y > -10 && p.y < 110 && !hits.includes(p));
      });

      // Enemy Projectiles
      setProjectiles(prev => {
        const updated = prev.map(p => ({ ...p, x: p.x + p.vx, y: p.y + p.vy }));
        
        // Player Collision
        const containerWidth = containerRef.current?.offsetWidth || 1;
        const containerHeight = containerRef.current?.offsetHeight || 1;
        const playerXPercent = (mousePos.x / containerWidth) * 100;
        const playerYPercent = (mousePos.y / containerHeight) * 100;
        
        const collisions = updated.filter(p => {
          const dx = p.x - playerXPercent;
          const dy = p.y - playerYPercent;
          return Math.sqrt(dx*dx + dy*dy) < 4;
        });

        if (collisions.length > 0) {
          setPlayerHp(h => {
            const next = Math.max(0, h - collisions.length * 2);
            if (next <= 0) onFail();
            return next;
          });
        }

        // Attacks from Boss
        if (Math.random() < 0.2) {
          updated.push({
            id: Math.random().toString(),
            x: bossPos.x,
            y: bossPos.y,
            type: 'bst_pulse',
            vx: (Math.random() - 0.5) * 15,
            vy: Math.random() * 10 + 5
          });
        }

        return updated.filter(p => p.x > -10 && p.x < 110 && p.y > -10 && p.y < 110);
      });
    }, 16);

    return () => clearInterval(gameLoop);
  }, [bossPos, mousePos, onFail, onWin]);

  const handleRecycleAttack = () => {
    if (isHit) return;
    const damage = 1000;
    setHp(h => {
      const next = Math.max(0, h - damage);
      if (next <= 0) onWin();
      return next;
    });
    setIsHit(true);
    setTimeout(() => setIsHit(false), 150);

    // Visual Bin Effect
    if (containerRef.current) {
        const punch = document.createElement('div');
        punch.className = "absolute pointer-events-none z-50 animate-ping";
        punch.style.left = `${mousePos.x - 50}px`;
        punch.style.top = `${mousePos.y - 50}px`;
        punch.innerHTML = `<div class="w-24 h-24 bg-gradient-to-r from-red-400 to-blue-600 rounded-full opacity-50 blur-lg flex items-center justify-center">
            <svg class="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
        </div>`;
        containerRef.current.appendChild(punch);
        setTimeout(() => punch.remove(), 400);

        const text = document.createElement('div');
        text.className = "absolute text-white font-black italic text-2xl z-[60] animate-bounce pointer-events-none drop-shadow-[0_0_10px_cyan]";
        text.style.left = `${mousePos.x}px`;
        text.style.top = `${mousePos.y - 60}px`;
        text.innerText = "RECYCLE!";
        containerRef.current.appendChild(text);
        setTimeout(() => text.remove(), 600);
    }
  };

  return (
    <div 
      ref={containerRef}
      onClick={handleRecycleAttack}
      className="w-full h-screen bg-black overflow-hidden relative cursor-none select-none font-mono"
    >
      {/* Background Glitch Canvas */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      <div className="absolute inset-0 flex flex-wrap gap-4 p-4 opacity-5 pointer-events-none overflow-hidden">
         {Array.from({ length: 400 }).map((_, i) => (
             <div key={i} className="text-[10px] text-purple-500 animate-pulse">0x{Math.random().toString(16).slice(2, 8).toUpperCase()}</div>
         ))}
      </div>

      {/* Header */}
      <div className="absolute top-0 w-full p-6 flex justify-between items-start z-50 bg-black/90 border-b-2 border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.3)]">
        <div className="flex items-center gap-4">
          <ShieldAlert className="w-10 h-10 text-purple-500 animate-pulse" />
          <div>
            <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase leading-none">ENTITY: THE_BST</h1>
            <p className="text-[10px] text-purple-400 font-bold mt-1">BINARY_SENTIENT_TRANSFUSION_CORE_v1.0</p>
          </div>
        </div>
        <div className="text-right">
            <span className="text-[10px] text-purple-300 uppercase font-black tracking-widest">Logic Cohesion</span>
            <div className="w-96 h-4 bg-purple-950 border border-purple-500 mt-1 relative overflow-hidden">
                <div 
                    className={`h-full bg-gradient-to-r from-purple-600 to-cyan-400 transition-all duration-300 shadow-[0_0_20px_purple] ${hp < maxHp * 0.3 ? 'animate-pulse' : ''}`} 
                    style={{ width: `${(hp/maxHp)*100}%` }} 
                />
            </div>
            <div className="flex justify-between mt-1">
                <span className="text-[8px] text-purple-400 uppercase tracking-tighter">Memory Fragmentation</span>
                <span className="text-[8px] text-cyan-400">{hp.toLocaleString()} / {maxHp.toLocaleString()} SECTORS</span>
            </div>
        </div>
      </div>

      {/* Allies Info */}
      <div className="absolute top-32 left-10 space-y-6 z-40">
         <div className="flex items-center gap-4 animate-in slide-in-from-left duration-1000">
            <div className="p-3 bg-red-900/40 border border-red-500 rounded-lg backdrop-blur-sm relative overflow-hidden">
                <Skull className="w-8 h-8 text-red-500 animate-bounce relative z-10" />
                <div className="absolute inset-0 bg-red-500/20 animate-pulse" />
            </div>
            <div>
                <p className="text-xs font-black text-red-500 italic uppercase">The Glitch</p>
                <p className="text-[8px] text-red-400 font-bold">STATUS: OVERRIDING_SILICON</p>
            </div>
         </div>
         <div className="flex items-center gap-4 animate-in slide-in-from-left delay-500 duration-1000">
            <div className="p-3 bg-blue-900/40 border border-blue-500 rounded-lg backdrop-blur-sm relative overflow-hidden">
                <Globe className="w-8 h-8 text-blue-500 animate-spin-slow relative z-10" />
                <div className="absolute inset-0 bg-blue-500/20 animate-pulse" />
            </div>
            <div>
                <p className="text-xs font-black text-blue-500 italic uppercase">The Internet</p>
                <p className="text-[8px] text-blue-400 font-bold">STATUS: BUFFER_OVERFLOW_ACTIVE</p>
            </div>
         </div>
      </div>

      {/* Ally Projectiles Visuals */}
      {allyProjectiles.map(p => (
          <div 
            key={p.id}
            className={`absolute w-3 h-3 rounded-full ${p.color} blur-[1px]`}
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          />
      ))}

      {/* The BST Entity */}
      <div 
        className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 z-30 ${isHit ? 'scale-110 brightness-150' : 'scale-100'}`}
        style={{ left: `${bossPos.x}%`, top: `${bossPos.y}%` }}
      >
        <div className="relative group">
            <div className={`absolute -inset-40 bg-purple-600/20 rounded-full blur-[120px] animate-pulse ${hp < maxHp * 0.3 ? 'bg-red-600/40' : ''}`} />
            <div className="absolute -inset-20 bg-cyan-400/10 rounded-full blur-[80px] animate-ping" />
            
            <div className="w-96 h-96 flex items-center justify-center relative">
                <Cpu className="w-full h-full text-white drop-shadow-[0_0_30px_purple] glitch-effect" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <AlertTriangle className="w-32 h-32 text-purple-600 opacity-50 mix-blend-overlay animate-pulse" />
                </div>
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black border-2 border-white px-6 py-2 shadow-[10px_10px_0px_purple]">
                    <span className="text-white font-black italic text-xl tracking-tighter">TRANSFUSION_CORE_0x{hp.toString(16).toUpperCase()}</span>
                </div>
            </div>
        </div>
      </div>

      {/* Enemy Projectiles Visuals */}
      {projectiles.map(p => (
        <div 
          key={p.id} 
          className="absolute w-6 h-6 bg-purple-500 shadow-[0_0_15px_purple] rounded-sm transform rotate-45 animate-pulse"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
        />
      ))}

      {/* Cursor Attached Health Bar */}
      <div 
        className="fixed pointer-events-none z-[100] flex flex-col items-center gap-2"
        style={{ left: mousePos.x, top: mousePos.y, transform: 'translate(-50%, -50%)' }}
      >
        <div className="relative">
            <div className="relative">
                <Trash2 className="w-12 h-12 text-cyan-400 drop-shadow-[0_0_10px_cyan] rotate-[-10deg] animate-pulse" />
                <div className="absolute -top-1 -right-1">
                    <Crosshair className="w-4 h-4 text-white animate-spin-slow" />
                </div>
            </div>
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-24 h-2 bg-gray-900 border border-cyan-400/50 rounded-full overflow-hidden shadow-lg backdrop-blur-sm">
                <div 
                    className="h-full bg-gradient-to-r from-cyan-400 to-blue-600 transition-all duration-200" 
                    style={{ width: `${(playerHp/maxPlayerHp)*100}%` }}
                />
            </div>
            <div className="absolute top-full mt-5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <span className="text-[8px] font-black text-cyan-400 uppercase tracking-widest drop-shadow-md">User Core Integrity</span>
            </div>
        </div>
      </div>

      {/* Bottom Status Lore */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center space-y-1 opacity-60">
         <p className="text-[10px] text-white font-bold italic tracking-[0.3em]">YOU ARE THE SENSITIZED COMPONENT</p>
         <div className="flex items-center justify-center gap-4 text-[8px] text-gray-400">
            <span className="flex items-center gap-1"><Hammer className="w-3 h-3" /> BUILDER.EXE: STANDING_BY</span>
            <span className="flex items-center gap-1"><Box className="w-3 h-3" /> HARDWARE_LOCK: OVERRIDDEN</span>
         </div>
      </div>

      <style>{`
        .glitch-effect { animation: bst-glitch 0.2s infinite; }
        @keyframes bst-glitch {
          0% { transform: translate(0); filter: hue-rotate(0deg); }
          20% { transform: translate(-5px, 5px); filter: hue-rotate(90deg); }
          40% { transform: translate(-5px, -5px); filter: invert(0.2); }
          60% { transform: translate(5px, 5px); }
          80% { transform: translate(5px, -5px); }
          100% { transform: translate(0); }
        }
        .animate-spin-slow { animation: spin 5s linear infinite; }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default BSTFinalBoss;
