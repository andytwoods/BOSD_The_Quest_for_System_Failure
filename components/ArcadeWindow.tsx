
import React, { useState, useEffect, useRef } from 'react';
import { X, Gamepad2, Ghost, Crosshair, Trophy, Lock } from 'lucide-react';

interface ArcadeWindowProps {
  onClose: () => void;
  bosdCount: number;
}

const BadPacMan: React.FC = () => {
  const [pacPos, setPacPos] = useState({ x: 1, y: 1 });
  const [ghostPos, setGhostPos] = useState({ x: 8, y: 8 });
  const [score, setScore] = useState(0);
  const [dots, setDots] = useState<boolean[][]>(
    Array(10).fill(null).map(() => Array(10).fill(true))
  );

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      setPacPos(prev => {
        let { x, y } = prev;
        if (e.key === 'ArrowUp') y = Math.max(0, y - 1);
        if (e.key === 'ArrowDown') y = Math.min(9, y + 1);
        if (e.key === 'ArrowLeft') x = Math.max(0, x - 1);
        if (e.key === 'ArrowRight') x = Math.min(9, x + 1);
        return { x, y };
      });
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    if (dots[pacPos.y][pacPos.x]) {
      setDots(prev => {
        const next = [...prev];
        next[pacPos.y] = [...next[pacPos.y]];
        next[pacPos.y][pacPos.x] = false;
        return next;
      });
      setScore(s => s + 10);
    }
  }, [pacPos]);

  useEffect(() => {
    const timer = setInterval(() => {
      setGhostPos(prev => ({
        x: prev.x + (pacPos.x > prev.x ? 1 : -1),
        y: prev.y + (pacPos.y > prev.y ? 1 : -1)
      }));
    }, 500);
    return () => clearInterval(timer);
  }, [pacPos]);

  return (
    <div className="flex flex-col items-center bg-black p-4 rounded border-2 border-yellow-500/30">
      <div className="grid grid-cols-10 grid-rows-10 gap-1 bg-blue-900/20 border-2 border-blue-600 p-1">
        {dots.map((row, y) => row.map((dot, x) => (
          <div key={`${x}-${y}`} className="w-5 h-5 flex items-center justify-center relative">
            {pacPos.x === x && pacPos.y === y && <div className="w-4 h-4 bg-yellow-400 rounded-full animate-pulse" />}
            {ghostPos.x === x && ghostPos.y === y && <div className="w-4 h-4 bg-purple-500 rounded-sm" />}
            {dot && !(pacPos.x === x && pacPos.y === y) && <div className="w-1 h-1 bg-yellow-100/50" />}
          </div>
        )))}
      </div>
      <div className="mt-4 text-yellow-400 font-mono text-xs uppercase tracking-widest">
        Score: {score.toString().padStart(6, '0')}
      </div>
      <p className="text-[8px] text-gray-500 mt-2">BAD_PACMAN_v0.1 - USE ARROWS</p>
    </div>
  );
};

const BadDonkeyKong: React.FC = () => {
  const [pos, setPos] = useState({ x: 10, y: 170 });
  const [barrels, setBarrels] = useState<{ id: number; x: number; y: number }[]>([]);
  const [isJumping, setIsJumping] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setPos(p => ({ ...p, x: Math.max(0, p.x - 5) }));
      if (e.key === 'ArrowRight') setPos(p => ({ ...p, x: Math.min(180, p.x + 5) }));
      if (e.key === ' ' && !isJumping) {
        setIsJumping(true);
        setTimeout(() => setIsJumping(false), 500);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isJumping]);

  useEffect(() => {
    const timer = setInterval(() => {
      setBarrels(prev => [
        ...prev.map(b => ({ ...b, x: b.x - 2 })).filter(b => b.x > -10),
        ...(Math.random() < 0.05 ? [{ id: Date.now(), x: 190, y: 175 }] : [])
      ]);
    }, 50);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-64 h-48 bg-black relative border-2 border-red-900 overflow-hidden">
      {/* Girders */}
      <div className="absolute bottom-4 left-0 w-full h-2 bg-red-600" />
      <div className="absolute top-1/2 left-0 w-full h-2 bg-red-600" />
      
      {/* DK */}
      <div className="absolute top-4 left-4 w-12 h-12 bg-orange-900 flex items-center justify-center text-[10px] text-white font-bold">DK</div>
      
      {/* Mario */}
      <div 
        className="absolute w-4 h-6 bg-red-500 border border-white transition-all"
        style={{ left: pos.x, top: isJumping ? pos.y - 20 : pos.y }}
      />

      {/* Barrels */}
      {barrels.map(b => (
        <div key={b.id} className="absolute w-4 h-4 bg-orange-600 rounded-full border border-black" style={{ left: b.x, top: b.y }} />
      ))}

      <div className="absolute top-2 right-2 text-red-500 font-mono text-[10px]">LIVES: 1</div>
    </div>
  );
};

const BadDuckHunt: React.FC = () => {
  const [ducks, setDucks] = useState<{ id: number; x: number; y: number }[]>([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const spawn = setInterval(() => {
      if (ducks.length < 3) {
        setDucks(prev => [...prev, { id: Date.now(), x: Math.random() * 80 + 10, y: Math.random() * 60 + 10 }]);
      }
    }, 1000);
    return () => clearInterval(spawn);
  }, [ducks]);

  const shoot = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setDucks(prev => prev.filter(d => d.id !== id));
    setScore(s => s + 50);
  };

  return (
    <div className="w-64 h-48 bg-sky-400 relative border-2 border-green-900 overflow-hidden cursor-crosshair">
      <div className="absolute bottom-0 w-full h-12 bg-green-600" />
      <div className="absolute bottom-12 left-4 w-8 h-16 bg-green-800 rounded-t-lg" />
      
      {ducks.map(d => (
        <div 
          key={d.id} 
          onClick={(e) => shoot(d.id, e)}
          className="absolute w-8 h-8 bg-brown-900 border-2 border-black flex items-center justify-center animate-bounce"
          style={{ left: `${d.x}%`, top: `${d.y}%`, backgroundColor: '#4a3728' }}
        >
          <div className="w-1 h-1 bg-white rounded-full ml-auto mr-1" />
        </div>
      ))}

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white px-2 py-1 rounded text-[10px] font-mono">
        SHOTS: ∞ | SCORE: {score}
      </div>
    </div>
  );
};

const ArcadeWindow: React.FC<ArcadeWindowProps> = ({ onClose, bosdCount }) => {
  const [activeGame, setActiveGame] = useState<'pacman' | 'dk' | 'duckhunt' | null>(null);
  const isLocked = bosdCount < 1;

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[450px] bg-[#c0c0c0] border-2 border-white border-r-gray-500 border-b-gray-500 shadow-2xl z-[70] flex flex-col font-sans animate-in zoom-in-95 duration-200">
      <div className="bg-[#000080] text-white p-1 flex justify-between items-center cursor-move">
        <div className="flex items-center gap-2 px-2">
            <Gamepad2 className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Secret Arcade - Release Candidate 1</span>
        </div>
        <button onClick={onClose} className="bg-gray-300 text-black px-1 border border-white border-r-gray-800 border-b-gray-800 hover:bg-gray-200">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 p-4 flex flex-col bg-black/90">
        {isLocked ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
             <Lock className="w-16 h-16 text-red-500 animate-pulse" />
             <h2 className="text-red-500 font-mono text-xl font-black">SYSTEM_ACCESS_DENIED</h2>
             <p className="text-red-400 font-mono text-xs max-w-sm">
                Unauthorized recreational software detected. Gaming protocols are only unlocked after at least one (1) successful System Kernel Breach (BOSD).
             </p>
             <p className="text-gray-500 font-mono text-[10px] mt-4">Current BOSD Count: {bosdCount}</p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            <div className="flex gap-2 mb-4">
              <button 
                onClick={() => setActiveGame('pacman')}
                className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest border transition-all ${activeGame === 'pacman' ? 'bg-yellow-500 text-black border-yellow-200' : 'bg-gray-800 text-gray-400 border-gray-600 hover:bg-gray-700'}`}
              >
                Bad Pac-Man
              </button>
              <button 
                onClick={() => setActiveGame('dk')}
                className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest border transition-all ${activeGame === 'dk' ? 'bg-red-600 text-white border-red-200' : 'bg-gray-800 text-gray-400 border-gray-600 hover:bg-gray-700'}`}
              >
                Bad DK
              </button>
              <button 
                onClick={() => setActiveGame('duckhunt')}
                className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest border transition-all ${activeGame === 'duckhunt' ? 'bg-sky-500 text-white border-sky-200' : 'bg-gray-800 text-gray-400 border-gray-600 hover:bg-gray-700'}`}
              >
                Bad Hunt
              </button>
            </div>

            <div className="flex-1 flex items-center justify-center bg-zinc-900 border-4 border-zinc-800 rounded-lg shadow-inner">
               {activeGame === 'pacman' && <BadPacMan />}
               {activeGame === 'dk' && <BadDonkeyKong />}
               {activeGame === 'duckhunt' && <BadDuckHunt />}
               {!activeGame && (
                  <div className="text-center text-zinc-600 italic">
                    <Trophy className="w-12 h-12 mx-auto mb-2 opacity-20" />
                    <p className="text-xs">SELECT A LEGACY GAME TO START</p>
                  </div>
               )}
            </div>
          </div>
        )}
      </div>

      <div className="bg-[#c0c0c0] p-2 border-t border-gray-400 text-[9px] text-gray-600 flex justify-between">
         <span>Powered by retro_jank_engine.lib</span>
         <span className="font-bold">BOSD AUTHENTICATED ✓</span>
      </div>
    </div>
  );
};

export default ArcadeWindow;
