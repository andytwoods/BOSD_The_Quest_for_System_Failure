
import React, { useState, useEffect, useCallback } from 'react';
import { ShieldAlert, Target, Heart, Zap, Shield, Search, ArrowUpCircle, XCircle, Bug, Skull, AlertCircle, CircleDashed, ZapOff, Ghost, Gift, CandyCane } from 'lucide-react';
import { Projectile, ComputerTier, Theme } from '../types';

interface MiniBoss {
  id: string;
  x: number;
  y: number;
  hp: number;
}

interface Hand {
  side: 'left' | 'right';
  x: number;
  y: number;
  state: 'floating' | 'targeting' | 'smashing' | 'recovering';
  targetX: number;
}

interface LightningStrike {
  id: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
}

interface TitanBSDBossProps {
  onWin: () => void;
  onFail: () => void;
  computerTier: ComputerTier;
  theme: Theme;
}

const TitanBSDBoss: React.FC<TitanBSDBossProps> = ({ onWin, onFail, computerTier, theme }) => {
  const [hp, setHp] = useState(10000);
  const [maxHp] = useState(10000);
  const [playerHp, setPlayerHp] = useState(20);
  const [projectiles, setProjectiles] = useState<Projectile[]>([]);
  const [phase, setPhase] = useState(1); 
  const [googleHijack, setGoogleHijack] = useState(true);
  const [miniBosses, setMiniBosses] = useState<MiniBoss[]>([]);
  const [ultraBalls, setUltraBalls] = useState(3);
  const [lightnings, setLightnings] = useState<LightningStrike[]>([]);
  const [hands, setHands] = useState<Hand[]>([
    { side: 'left', x: 20, y: 30, state: 'floating', targetX: 20 },
    { side: 'right', x: 80, y: 30, state: 'floating', targetX: 80 }
  ]);

  const isUltra = computerTier === ComputerTier.ULTRA;

  // Intro sequence
  useEffect(() => {
    const timer = setTimeout(() => setGoogleHijack(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Main Game Loop
  useEffect(() => {
    if (googleHijack) return;

    const gameLoop = setInterval(() => {
      // 1. Update Projectiles
      setProjectiles(prev => {
        const updated = prev.map(p => ({ ...p, x: p.x + p.vx, y: p.y + p.vy }));
        const playerX = 50;
        const playerY = 85;
        
        const collisions = updated.filter(p => {
          const dx = p.x - playerX;
          const dy = p.y - playerY;
          return Math.sqrt(dx*dx + dy*dy) < 5;
        });

        if (collisions.length > 0) {
          setPlayerHp(h => {
            const next = h - collisions.length;
            if (next <= 0) {
              onFail();
              return 0;
            }
            return next;
          });
        }
        return updated.filter(p => p.x > -10 && p.x < 110 && p.y > -10 && p.y < 110);
      });

      // 2. Hand AI
      setHands(prev => prev.map(hand => {
        let { x, y, state, targetX } = hand;
        const speed = phase === 3 ? 1.5 : (phase === 2 ? 1.2 : 1);

        if (state === 'floating') {
          x += (targetX - x) * 0.05 * speed;
          y = 30 + Math.sin(Date.now() / 500) * 5;
          if (Math.random() < 0.01 * speed) state = 'targeting';
        } else if (state === 'targeting') {
          const playerX = 50 + (Math.random() - 0.5) * 30;
          x += (playerX - x) * 0.1 * speed;
          if (Math.abs(x - playerX) < 5) state = 'smashing';
        } else if (state === 'smashing') {
          y += 10 * speed;
          if (y >= 85) {
            state = 'recovering';
            const shardType = theme === Theme.HALLOWEEN ? 'glitch' : 'titan_shard';
            const shards: Projectile[] = Array.from({ length: 12 }).map((_, i) => ({
              id: Math.random().toString(),
              x: x,
              y: y,
              type: shardType as any,
              vx: Math.cos((i / 12) * Math.PI * 2) * 5,
              vy: Math.sin((i / 12) * Math.PI * 2) * 5
            }));
            setProjectiles(p => [...p, ...shards]);
          }
        } else if (state === 'recovering') {
          y -= 2 * speed;
          if (y <= 30) state = 'floating';
        }

        return { ...hand, x, y, state };
      }));

      // 3. Mini Boss AI
      if (phase === 3) {
        setMiniBosses(prev => {
          if (prev.length < 3 && Math.random() < 0.01) {
            return [...prev, { id: Math.random().toString(), x: Math.random() * 80 + 10, y: 15, hp: 500 }];
          }
          return prev;
        });
      }
    }, 16);

    return () => clearInterval(gameLoop);
  }, [googleHijack, phase, theme, onFail]);

  // Lightning Logic for Ultra PC
  useEffect(() => {
    if (!isUltra || googleHijack) return;
    const strikeInterval = setInterval(() => {
      if (Math.random() < 0.3) {
        const strikeId = Math.random().toString();
        const startX = Math.random() * 100;
        setLightnings(prev => [...prev, { id: strikeId, x: startX, y: 0, targetX: 50, targetY: 40 }]);
        damageBoss(150);
        setTimeout(() => setLightnings(prev => prev.filter(l => l.id !== strikeId)), 150);
      }
    }, 800);
    return () => clearInterval(strikeInterval);
  }, [isUltra, googleHijack]);

  useEffect(() => {
    if (hp < maxHp * 0.25) setPhase(3); 
    else if (hp < maxHp * 0.75) setPhase(2); 
  }, [hp, maxHp]);

  const handleBossHit = () => {
    if (googleHijack) return;
    damageBoss(isUltra ? 500 : 200); // Ultra PC does more click damage
  };

  const damageBoss = (amount: number) => {
    setHp(h => {
      const next = h - amount;
      if (next <= 0) onWin();
      return next;
    });
  };

  const handleMiniHit = (id: string) => {
    setMiniBosses(prev => prev.map(m => m.id === id ? { ...m, hp: m.hp - 100 } : m).filter(m => m.hp > 0));
  };

  const useUltraBall = () => {
    if (ultraBalls > 0 && !googleHijack) {
      setUltraBalls(prev => prev - 1);
      damageBoss(1000);
    }
  };

  if (googleHijack) {
    return (
      <div className={`w-full h-screen flex flex-col items-center justify-center font-sans z-[100] ${theme === Theme.HALLOWEEN ? 'bg-orange-100' : theme === Theme.CHRISTMAS ? 'bg-red-50' : 'bg-white'}`}>
        <div className="flex text-8xl font-black mb-8">
          <span className="text-blue-500">G</span>
          <span className="text-red-500">o</span>
          <span className="text-yellow-500">o</span>
          <span className="text-blue-500">g</span>
          <span className="text-green-500">l</span>
          <span className="text-red-500">e</span>
        </div>
        <div className="w-[600px] h-12 border rounded-full flex items-center px-6 shadow-md mb-8 bg-white">
          <Search className="w-5 h-5 text-gray-400 mr-4" />
          <span className="text-xl">BSD</span>
        </div>
        <div className="text-red-600 font-mono text-xl animate-pulse text-center">
          <p>SYSTEM BREACH DETECTED</p>
          <p className="text-sm">RESEARCHING TITAN CLASS ENTITIES...</p>
        </div>
      </div>
    );
  }

  const getBossIcon = () => {
    if (theme === Theme.HALLOWEEN) return <Ghost className={`w-80 h-80 transition-all duration-500 ${phase === 3 ? 'text-orange-500 drop-shadow-[0_0_60px_orange]' : 'text-gray-400 drop-shadow-[0_0_30px_gray]'}`} />;
    if (theme === Theme.CHRISTMAS) return <Gift className={`w-80 h-80 transition-all duration-500 ${phase === 3 ? 'text-red-500 drop-shadow-[0_0_60px_red]' : 'text-green-500 drop-shadow-[0_0_30px_green]'}`} />;
    return <ShieldAlert className={`w-80 h-80 transition-all duration-500 ${phase === 3 ? 'text-red-600 drop-shadow-[0_0_60px_red] glitch-effect' : phase === 2 ? 'text-orange-500 drop-shadow-[0_0_40px_orange]' : 'text-blue-500 drop-shadow-[0_0_30px_rgba(59,130,246,0.6)]'}`} />;
  };

  const getMiniBossIcon = () => {
    if (theme === Theme.HALLOWEEN) return <Skull className="w-16 h-16 text-orange-400" />;
    if (theme === Theme.CHRISTMAS) return <CandyCane className="w-16 h-16 text-red-300" />;
    return <Bug className="w-16 h-16 text-red-400" />;
  };

  return (
    <div className={`w-full h-screen overflow-hidden relative cursor-crosshair font-mono ${theme === Theme.HALLOWEEN ? 'bg-[#1a0a00]' : theme === Theme.CHRISTMAS ? 'bg-[#001a0a]' : 'bg-[#020617]'}`}>
      {/* Rage Effect Overlay */}
      {phase === 3 && (
        <div className="absolute inset-0 bg-red-900/10 animate-pulse pointer-events-none z-10" />
      )}
      
      {/* Header UI */}
      <div className="absolute top-0 w-full p-6 flex justify-between items-center z-50">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 text-blue-400">
            {theme === Theme.HALLOWEEN ? <Skull className="text-orange-500 w-8 h-8" /> : 
             theme === Theme.CHRISTMAS ? <Gift className="text-red-400 w-8 h-8" /> :
             phase === 3 ? <Skull className="w-8 h-8 text-red-500 animate-bounce" /> : <Shield className="w-8 h-8 animate-pulse" />}
            <h1 className={`text-2xl font-black tracking-widest italic uppercase ${theme === Theme.HALLOWEEN ? 'text-orange-500' : theme === Theme.CHRISTMAS ? 'text-red-500' : phase === 3 ? 'text-red-500' : 'text-blue-400'}`}>
              {theme === Theme.HALLOWEEN ? 'PUMPKIN_TITAN_v666' : theme === Theme.CHRISTMAS ? 'SANTA_TITAN_XMAS' : 'TITAN_BSD_GOD_CORE'}
            </h1>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-xs font-bold text-blue-300 mb-1 uppercase tracking-widest">Integrity Buffer</span>
          <div className="w-96 h-6 bg-slate-900 border border-blue-400/30 relative overflow-hidden shadow-[0_0_30px_rgba(59,130,246,0.1)]">
            <div 
              className={`h-full transition-all duration-300 ${phase === 1 ? 'bg-blue-500' : phase === 2 ? 'bg-orange-500' : 'bg-red-600 shadow-[0_0_20px_red]'}`} 
              style={{ width: `${(hp/maxHp)*100}%` }} 
            />
          </div>
          <span className="text-[10px] mt-1 text-white/50">{hp.toLocaleString()} UNITS</span>
        </div>
      </div>

      {/* Lightning Strikes (Ultra PC effect) */}
      {lightnings.map(l => (
        <div key={l.id} className="absolute inset-0 pointer-events-none z-[45]">
          <svg className="w-full h-full">
            <line 
              x1={`${l.x}%`} 
              y1={`${l.y}%`} 
              x2={`${l.targetX}%`} 
              y2={`${l.targetY}%`} 
              stroke="cyan" 
              strokeWidth="4" 
              strokeDasharray="10,5"
              className="animate-pulse"
            />
            <line 
              x1={`${l.x}%`} 
              y1={`${l.y}%`} 
              x2={`${l.targetX}%`} 
              y2={`${l.targetY}%`} 
              stroke="white" 
              strokeWidth="2" 
            />
          </svg>
        </div>
      ))}

      {/* Mini Bosses */}
      {miniBosses.map(m => (
        <div key={m.id} onClick={() => handleMiniHit(m.id)} className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-30 group" style={{ left: `${m.x}%`, top: `${m.y}%` }}>
          <div className="relative">
            {getMiniBossIcon()}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-1 bg-red-900 overflow-hidden">
               <div className="h-full bg-red-400" style={{ width: `${(m.hp/500)*100}%` }} />
            </div>
          </div>
        </div>
      ))}

      {/* Titan Boss */}
      <div onClick={handleBossHit} className="absolute left-1/2 top-[40%] transform -translate-x-1/2 -translate-y-1/2 group z-20">
        <div className="relative cursor-pointer group active:scale-95 transition-transform">
          <div className={`absolute -inset-24 rounded-full blur-[120px] transition-colors duration-1000 ${phase === 3 ? 'bg-red-600/30' : 'bg-blue-600/20'}`} />
          {getBossIcon()}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Target className="w-20 h-20 text-white opacity-0 group-hover:opacity-40 transition-opacity" />
          </div>
        </div>
      </div>

      {/* Giant Error Hands */}
      {hands.map(hand => (
        <div key={hand.side} className="absolute transform -translate-x-1/2 -translate-y-1/2 z-40 transition-all pointer-events-none" style={{ left: `${hand.x}%`, top: `${hand.y}%` }}>
          <div className="relative">
            <div className={`w-40 h-24 border-2 shadow-2xl flex flex-col items-center justify-center rounded-md ${hand.state === 'smashing' ? 'scale-125 bg-red-600 border-white' : 'bg-gray-200 border-gray-400'}`}>
              <div className={`w-full h-6 flex items-center px-2 justify-between border-b ${hand.state === 'smashing' ? 'bg-red-800' : 'bg-blue-800'}`}>
                 <span className="text-[8px] text-white font-bold">FATAL_ERROR</span>
                 <XCircle className="w-3 h-3 text-white" />
              </div>
              <div className="flex-1 flex flex-col items-center justify-center p-2">
                 {theme === Theme.HALLOWEEN ? <Ghost className="w-8 h-8 text-orange-600" /> : <AlertCircle className={`w-8 h-8 ${hand.state === 'smashing' ? 'text-white' : 'text-red-600'}`} />}
                 <span className={`text-[8px] font-black uppercase tracking-widest mt-1 ${hand.state === 'smashing' ? 'text-white' : 'text-gray-800'}`}>
                   {hand.state === 'targeting' ? 'LOCKED_ON' : hand.state === 'smashing' ? 'CRASHING' : 'ERROR_SYSTEM'}
                 </span>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Projectiles */}
      {projectiles.map(p => (
        <div key={p.id} className={`absolute rounded-full blur-[1px] transition-all ${p.type === 'titan_shard' ? (phase === 3 ? 'w-6 h-6 bg-red-500 shadow-[0_0_15px_red]' : 'w-4 h-4 bg-blue-400 shadow-[0_0_10px_#60a5fa]') : 'w-3 h-3 bg-green-400'}`} style={{ left: `${p.x}%`, top: `${p.y}%` }} />
      ))}

      {/* Player Section */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center z-50">
        <div className="relative group">
          <div className="absolute -inset-10 bg-blue-500/20 rounded-full blur-2xl group-hover:bg-blue-500/40 transition-all" />
          {theme === Theme.CHRISTMAS ? <Gift className="w-16 h-16 text-green-400 animate-bounce relative z-10" /> : 
           theme === Theme.HALLOWEEN ? <Skull className="w-16 h-16 text-orange-400 animate-pulse relative z-10" /> :
           <Zap className="w-16 h-16 text-blue-400 animate-pulse relative z-10" />}
        </div>
        
        {isUltra && (
          <div className="flex gap-4 mb-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <button key={i} disabled={i >= ultraBalls} onClick={useUltraBall} className={`p-2 rounded-full border-2 transition-all ${i < ultraBalls ? 'border-purple-500 bg-purple-900/40 text-purple-400 hover:scale-110 active:scale-90 shadow-[0_0_10px_purple]' : 'border-gray-700 bg-gray-900 text-gray-700 opacity-20'}`}>
                <CircleDashed className={`w-8 h-8 ${i < ultraBalls ? 'animate-spin-slow' : ''}`} />
              </button>
            ))}
            {isUltra && <Zap className="w-8 h-8 text-yellow-400 animate-pulse" title="Ultracool Lightning Active" />}
          </div>
        )}

        <div className="mt-4 flex flex-col items-center gap-2">
          <div className="flex gap-2">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className={`w-2 h-4 rounded-sm border border-blue-400/30 transition-all ${i < playerHp ? 'bg-blue-400 shadow-[0_0_5px_#60a5fa]' : 'bg-slate-900 opacity-20'}`} />
            ))}
          </div>
          <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">System Integrity Core</span>
        </div>
      </div>

      <style>{`
        .glitch-effect { animation: glitch 0.3s infinite; }
        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-4px, 4px) skewX(5deg); }
          40% { transform: translate(-4px, -4px) skewX(-5deg); }
          60% { transform: translate(4px, 4px) scale(1.05); }
          80% { transform: translate(4px, -4px) skewY(5deg); }
          100% { transform: translate(0); }
        }
        .animate-spin-slow { animation: spin 3s linear infinite; }
      `}</style>
    </div>
  );
};

export default TitanBSDBoss;
