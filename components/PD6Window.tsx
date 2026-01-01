
import React, { useState, useEffect, useRef } from 'react';
import { X, Shield, Target, CircleDashed, Bug, Star } from 'lucide-react';

interface PD6WindowProps {
  onClose: () => void;
  bosdCount: number;
  onCatch: (type: string, color: string) => void;
}

interface Tower {
  id: number;
  x: number;
  y: number;
}

interface Enemy {
  id: number;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  color: string;
}

interface Bullet {
  id: number;
  x: number;
  y: number;
  tx: number;
  ty: number;
}

const PD6Window: React.FC<PD6WindowProps> = ({ onClose, bosdCount, onCatch }) => {
  const [towers, setTowers] = useState<Tower[]>([]);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [money] = useState(999999);
  const [isUltraBallActive, setIsUltraBallActive] = useState(false);
  const [lives, setLives] = useState(100);
  
  const containerRef = useRef<HTMLDivElement>(null);

  // Spawner
  useEffect(() => {
    const interval = setInterval(() => {
      setEnemies(prev => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          x: 0,
          y: 150 + (Math.random() - 0.5) * 50,
          hp: 100,
          maxHp: 100,
          color: ['text-red-500', 'text-green-500', 'text-blue-500', 'text-yellow-500'][Math.floor(Math.random() * 4)]
        }
      ]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Main Loop
  useEffect(() => {
    const loop = setInterval(() => {
      // Move Enemies
      setEnemies(prev => {
        const moved = prev.map(e => ({ ...e, x: e.x + 1.5 }));
        const exited = moved.filter(e => e.x >= 500);
        if (exited.length > 0) setLives(l => Math.max(0, l - exited.length));
        return moved.filter(e => e.x < 500 && e.hp > 0);
      });

      // Move Bullets
      setBullets(prev => prev
        .map(b => {
          const dx = b.tx - b.x;
          const dy = b.ty - b.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 5) return null;
          return { ...b, x: b.x + dx / dist * 5, y: b.y + dy / dist * 5 };
        })
        .filter(b => b !== null) as Bullet[]
      );

      // Towers shooting
      setTowers(prevTowers => {
        setEnemies(prevEnemies => {
          if (prevEnemies.length === 0) return prevEnemies;
          
          prevTowers.forEach(t => {
            if (Math.random() < 0.05) { // Fire rate
                const target = prevEnemies[0];
                setBullets(b => [...b, { id: Math.random(), x: t.x, y: t.y, tx: target.x, ty: target.y }]);
                target.hp -= 10;
            }
          });
          return [...prevEnemies];
        });
        return prevTowers;
      });

    }, 32);
    return () => clearInterval(loop);
  }, []);

  const handlePlaceTower = (e: React.MouseEvent) => {
    if (isUltraBallActive) return;
    if (towers.length >= 10) return;
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setTowers(prev => [...prev, { id: Date.now(), x, y }]);
  };

  const handleCatch = (enemy: Enemy, e: React.MouseEvent) => {
    if (!isUltraBallActive) return;
    e.stopPropagation();
    onCatch('bug', enemy.color);
    setEnemies(prev => prev.filter(en => en.id !== enemy.id));
  };

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[450px] bg-[#dfdfdf] border-2 border-white border-r-gray-500 border-b-gray-500 shadow-2xl z-[70] flex flex-col font-sans animate-in zoom-in-95 duration-200">
      <div className="bg-[#1e40af] text-white p-1 flex justify-between items-center cursor-move">
        <div className="flex items-center gap-2 px-2">
            <Shield className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">PD6 - PROTECTOR DEFENSE 6</span>
        </div>
        <button onClick={onClose} className="bg-[#dfdfdf] text-black px-1 border border-white border-r-gray-800 border-b-gray-800 hover:bg-gray-300">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex gap-2 p-2 bg-gray-300 border-b border-gray-400">
        <div className="bg-gray-200 px-3 py-1 border border-inset text-[10px] font-bold">
            MONEY: <span className="text-green-600">${money.toLocaleString()}</span>
        </div>
        <div className="bg-gray-200 px-3 py-1 border border-inset text-[10px] font-bold">
            TOWERS: {towers.length}/10
        </div>
        <div className="bg-gray-200 px-3 py-1 border border-inset text-[10px] font-bold">
            LIVES: {lives}
        </div>
        {bosdCount >= 1 && (
            <button 
                onClick={() => setIsUltraBallActive(!isUltraBallActive)}
                className={`ml-auto px-3 py-1 border-2 text-[10px] font-black uppercase tracking-tighter transition-all ${isUltraBallActive ? 'bg-purple-600 text-white border-purple-300 shadow-[0_0_10px_purple]' : 'bg-gray-200 border-gray-400 text-gray-600'}`}
            >
                <CircleDashed className={`w-3 h-3 inline mr-1 ${isUltraBallActive ? 'animate-spin' : ''}`} />
                {isUltraBallActive ? 'ULTRA BALL READY' : 'LOAD ULTRA BALL'}
            </button>
        )}
      </div>

      <div 
        ref={containerRef}
        onClick={handlePlaceTower}
        className={`flex-1 relative overflow-hidden bg-emerald-900 cursor-crosshair ${isUltraBallActive ? 'cursor-pointer' : ''}`}
      >
        {/* Path */}
        <div className="absolute top-[125px] left-0 w-full h-[100px] bg-emerald-800/40 border-y border-emerald-500/20" />
        
        {/* Towers */}
        {towers.map(t => (
            <div key={t.id} className="absolute transform -translate-x-1/2 -translate-y-1/2 group" style={{ left: t.x, top: t.y }}>
                <div className="bg-slate-400 border border-slate-200 w-8 h-8 rounded-sm shadow-lg flex items-center justify-center">
                    <Target className="text-slate-800 w-4 h-4" />
                </div>
            </div>
        ))}

        {/* Bullets */}
        {bullets.map(b => (
            <div key={b.id} className="absolute w-2 h-2 bg-white rounded-full shadow-[0_0_5px_white] z-10" style={{ left: b.x, top: b.y }} />
        ))}

        {/* Enemies */}
        {enemies.map(e => (
            <div 
                key={e.id} 
                onClick={(ev) => handleCatch(e, ev)}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all ${e.color} cursor-pointer group`} 
                style={{ left: e.x, top: e.y }}
            >
                <div className="relative">
                    <Bug className="w-8 h-8 drop-shadow-lg group-hover:scale-125 transition-transform" />
                    <div className="absolute -top-2 left-0 w-8 h-1 bg-red-900 overflow-hidden">
                        <div className="h-full bg-green-500" style={{ width: `${(e.hp/e.maxHp)*100}%` }} />
                    </div>
                    {isUltraBallActive && <div className="absolute inset-0 border-2 border-purple-500 rounded-full animate-ping opacity-50" />}
                </div>
            </div>
        ))}

        {towers.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-black/40 px-6 py-2 rounded-full text-white/70 text-[10px] uppercase font-bold tracking-widest animate-pulse">
                    Click to place tower (Max 10)
                </div>
            </div>
        )}
      </div>

      <div className="bg-[#dfdfdf] p-2 border-t border-gray-400 text-[9px] text-gray-600 flex justify-between">
         <span className="flex items-center gap-1 italic">
           <Star className="w-3 h-3 text-yellow-600" /> pd_engine_active.lib
         </span>
         <span className="font-bold">BOSD_TIER_AUTH: {bosdCount > 0 ? 'ENABLED' : 'RESTRICTED'}</span>
      </div>
    </div>
  );
};

export default PD6Window;
