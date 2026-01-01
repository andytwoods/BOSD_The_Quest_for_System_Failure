
import React, { useState, useEffect, useRef } from 'react';
import { AppState, Projectile, ComputerTier, Theme } from '../types';
import { X, ShieldAlert, Target, Heart, AlertTriangle, Zap, ClipboardPaste, Sword, Sparkles, Flame, Radio, Ghost, Gift, Skull, CandyCane, Crosshair, Database, ZapOff } from 'lucide-react';

interface BOSDAppProps {
  state: AppState;
  onStateChange: (state: AppState) => void;
  onWin: () => void;
  onClose: () => void;
  unlockAchievement: (id: string) => void;
  difficulty: ComputerTier;
  clipboard: string | null;
  canPaste: boolean;
  isLogsRecycled: boolean;
  theme: Theme;
  godMode?: boolean;
  bossHealth: number;
  setBossHealth: (hp: number) => void;
  playerDamageOverride?: number;
}

const BOSDApp: React.FC<BOSDAppProps> = ({ state, onStateChange, onWin, onClose, unlockAchievement, difficulty, clipboard, canPaste, isLogsRecycled, theme, godMode, bossHealth, setBossHealth, playerDamageOverride }) => {
  const [clicks, setClicks] = useState(0);
  const [maxHealth] = useState(1000);
  const [bossPos, setBossPos] = useState({ x: 50, y: 50 });
  const [clones, setClones] = useState<{ id: number; x: number; y: number }[]>([]);
  const [projectiles, setProjectiles] = useState<Projectile[]>([]);
  const [playerHealth, setPlayerHealth] = useState(3);
  const [playerDamage, setPlayerDamage] = useState(godMode ? 1000 : (isLogsRecycled ? 100 : 10));
  const [isHit, setIsHit] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const effectiveDamage = playerDamageOverride ?? playerDamage;

  useEffect(() => {
    if (godMode) setPlayerDamage(1000);
    else if (isLogsRecycled) setPlayerDamage(100);
  }, [isLogsRecycled, godMode]);

  const handleIconClick = () => {
    const nextClicks = clicks + (godMode ? 10 : 1);
    setClicks(nextClicks);
    if (nextClicks >= 10 && state === AppState.PHASE_ONE) {
      onStateChange(AppState.PHASE_TWO);
      unlockAchievement('phase_one');
    } else if (nextClicks >= 100 && state === AppState.PHASE_TWO) {
      onStateChange(AppState.OVERCONTROL);
    }
  };

  useEffect(() => {
    if (state === AppState.PHASE_TWO || state === AppState.OVERCONTROL) {
      const isOvercontrol = state === AppState.OVERCONTROL;
      
      const movementInterval = setInterval(() => {
        const rageFactor = 1 - (bossHealth / maxHealth);
        const baseSpeed = (800 - (difficulty * 150)) * (isOvercontrol ? 0.4 : 1);
        const dynamicSpeed = baseSpeed * (1 - (rageFactor * 0.5));

        setBossPos({
          x: Math.random() * 80 + 10,
          y: Math.random() * 60 + 20,
        });

        if (difficulty >= ComputerTier.NEW && Math.random() > 0.7) {
          setClones(prev => [...prev.slice(-3), { 
            id: Date.now(), 
            x: Math.random() * 80 + 10, 
            y: Math.random() * 60 + 20 
          }]);
        }
      }, (800 - (difficulty * 150)) * (isOvercontrol ? 0.4 : 1));

      const attackInterval = setInterval(() => {
        const type = Math.random() > 0.5 ? 'emergency' : 'overcontrol';
        setProjectiles(prev => [...prev, {
          id: Math.random().toString(),
          x: Math.random() * 100,
          y: -10,
          type,
          vx: (Math.random() - 0.5) * (isOvercontrol ? 12 : 6),
          vy: (2 + difficulty * 2.5) * (isOvercontrol ? 2.5 : 1)
        }]);
      }, (1000 - (difficulty * 200)));

      const physicsInterval = setInterval(() => {
        setProjectiles(prev => prev
          .map(p => ({ ...p, x: p.x + p.vx, y: p.y + p.vy }))
          .filter(p => p.y < 110)
        );
      }, 16);

      return () => {
        clearInterval(movementInterval);
        clearInterval(attackInterval);
        clearInterval(physicsInterval);
      };
    }
  }, [state, difficulty, bossHealth, maxHealth]);

  const handleBossHit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isHit) return;

    const nextHealth = Math.max(0, bossHealth - effectiveDamage);
    setBossHealth(nextHealth);
    setIsHit(true);
    setTimeout(() => setIsHit(false), 100);
    
    if (containerRef.current) {
      const shot = document.createElement('div');
      shot.className = `absolute rounded-full animate-ping z-50 pointer-events-none ${effectiveDamage >= 100 ? 'bg-red-500 w-12 h-12 shadow-[0_0_30px_red]' : 'bg-white w-4 h-4'}`;
      shot.style.left = `${e.clientX - containerRef.current.getBoundingClientRect().left}px`;
      shot.style.top = `${e.clientY - containerRef.current.getBoundingClientRect().top}px`;
      containerRef.current.appendChild(shot);
      setTimeout(() => shot.remove(), 250);
    }

    if (nextHealth <= 0) {
      onWin();
    }
  };

  useEffect(() => {
    const hits = projectiles.filter(p => p.y > 90);
    if (hits.length > 0) {
      setPlayerHealth(prev => {
        const next = prev - (godMode ? 0 : hits.length);
        if (next <= 0) {
            setProjectiles([]);
            setPlayerHealth(3);
            return 3;
        }
        return next;
      });
      setProjectiles(prev => prev.filter(p => p.y <= 90));
    }
  }, [projectiles, difficulty, state, maxHealth, godMode]);

  const getThemedIcon = (Normal: any, Halloween: any, Christmas: any, className: string) => {
    if (theme === Theme.HALLOWEEN) return <Halloween className={className} />;
    if (theme === Theme.CHRISTMAS) return <Christmas className={className} />;
    return <Normal className={className} />;
  };

  return (
    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[450px] border shadow-2xl rounded-lg overflow-hidden flex flex-col z-40 transition-all ${theme === Theme.HALLOWEEN ? 'bg-orange-950 border-orange-500' : theme === Theme.CHRISTMAS ? 'bg-red-950 border-green-500' : state === AppState.OVERCONTROL ? 'bg-red-950 border-red-500 scale-105 shadow-red-600' : 'bg-[#111] border-red-500 shadow-red-500/20'} ${isHit ? 'translate-x-1' : ''}`}>
      <div className={`px-4 py-2 flex items-center justify-between border-b ${theme === Theme.HALLOWEEN ? 'bg-orange-600 border-orange-400' : theme === Theme.CHRISTMAS ? 'bg-red-700 border-green-400' : state === AppState.OVERCONTROL ? 'bg-red-600 border-red-400' : 'bg-red-900/40 border-red-500/30'}`}>
        <div className="flex items-center gap-2">
          {getThemedIcon(ShieldAlert, Skull, Gift, "w-4 h-4 text-white")}
          <span className="text-white text-[10px] font-bold uppercase tracking-wider">
            {godMode ? 'GOD_MODE_OVERRIDE' : theme === Theme.HALLOWEEN ? 'SPOOKY KERNEL BREACH' : theme === Theme.CHRISTMAS ? 'FESTIVE KERNEL BREACH' : state === AppState.OVERCONTROL ? '!! OVERCONTROL PHASE !!' : `SYSTEM KERNEL BREACH - TIER ${difficulty}`}
          </span>
        </div>
        <button onClick={onClose} className="hover:bg-white/20 p-1 rounded transition-colors text-white">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div ref={containerRef} className={`flex-1 relative p-6 overflow-hidden ${theme === Theme.HALLOWEEN ? 'bg-orange-900/10' : theme === Theme.CHRISTMAS ? 'bg-green-900/10' : 'bg-black'}`}>
        {state === AppState.PHASE_ONE ? (
          <div className="h-full flex flex-col items-center justify-center space-y-8">
            <h2 className={`font-bold text-sm uppercase ${theme === Theme.HALLOWEEN ? 'text-orange-500' : theme === Theme.CHRISTMAS ? 'text-red-500' : 'text-red-500'}`}>Initializer Tool</h2>
            <button onClick={handleIconClick} className="group relative">
              {getThemedIcon(ShieldAlert, Ghost, Gift, `w-20 h-20 active:scale-90 transition-all ${clicks >= 10 ? 'text-orange-500' : 'text-red-500'}`)}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-40 bg-red-900/20 rounded-full h-1 overflow-hidden">
                <div className="h-full bg-red-500 transition-all" style={{ width: `${(clicks / 10) * 100}%` }} />
              </div>
              <p className="mt-4 text-[10px] text-white/50 text-center italic">Click 10 times to engage</p>
            </button>
          </div>
        ) : (
          <div className="h-full flex flex-col cursor-crosshair relative">
            <div className="flex items-center justify-between mb-4 z-20">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Heart className={`w-4 h-4 ${theme === Theme.HALLOWEEN ? 'text-orange-500' : theme === Theme.CHRISTMAS ? 'text-red-500' : 'text-red-600'} fill-current`} />
                  <span className="text-white font-mono text-sm uppercase">Boss HP: {bossHealth} / {maxHealth}</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden border border-white/10">
                        <div className={`h-full transition-all duration-300 ${bossHealth < maxHealth * 0.3 ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${(bossHealth/maxHealth)*100}%` }} />
                    </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                 <div className="bg-red-600/20 px-3 py-1 border border-red-500/30 rounded text-red-500 text-[10px] font-bold uppercase">
                    DMG Authorize: {effectiveDamage}
                 </div>
              </div>
            </div>

            {projectiles.map(p => (
              <div key={p.id} className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-100 cursor-pointer hover:scale-125 z-10" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
                {getThemedIcon(AlertTriangle, Skull, CandyCane, "w-8 h-8 text-yellow-500 animate-bounce")}
              </div>
            ))}

            <div className="absolute inset-0 z-0">
              <div onClick={handleBossHit} className={`absolute transition-all duration-300 ease-in-out cursor-pointer group ${isHit ? 'opacity-50' : ''}`} style={{ left: `${bossPos.x}%`, top: `${bossPos.y}%` }}>
                <div className="relative">
                  <div className={`absolute -inset-4 blur-xl rounded-full animate-ping ${effectiveDamage >= 100 ? 'bg-red-600/40' : 'bg-red-600/20'}`} />
                  {getThemedIcon(ShieldAlert, Skull, Gift, `w-20 h-20 ${theme === Theme.HALLOWEEN ? 'text-orange-500' : theme === Theme.CHRISTMAS ? 'text-red-500' : 'text-red-500'} drop-shadow-[0_0_15px_rgba(255,0,0,0.8)]` + (bossHealth < maxHealth * 0.3 ? ' animate-pulse' : ''))}
                  <Crosshair className="absolute inset-0 m-auto text-white opacity-0 group-hover:opacity-100 transition-opacity w-10 h-10" />
                </div>
              </div>
              {clones.map(c => (
                <div key={c.id} className="absolute transition-all duration-500 opacity-30 pointer-events-none" style={{ left: `${c.x}%`, top: `${c.y}%` }}>
                    {getThemedIcon(ShieldAlert, Skull, Gift, "w-16 h-16 text-gray-400 grayscale")}
                </div>
              ))}
            </div>

            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] text-white/30 uppercase tracking-widest text-center">
               Kernel Infiltration: Active<br/>
               Instability Level: {(1 - bossHealth/maxHealth).toFixed(2)}%
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BOSDApp;
