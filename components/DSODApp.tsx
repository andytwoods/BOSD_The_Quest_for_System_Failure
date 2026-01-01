
import React, { useState, useEffect, useRef } from 'react';
import { X, Heart, Sparkles, Smile, Star, Zap, Terminal } from 'lucide-react';

interface DSODAppProps {
  onClose: () => void;
  onWin: () => void;
}

const DSODApp: React.FC<DSODAppProps> = ({ onClose, onWin }) => {
  const [health, setHealth] = useState(1500);
  const [maxHealth] = useState(1500);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const move = setInterval(() => {
      setPos({ x: Math.random() * 80 + 10, y: Math.random() * 60 + 20 });
      if (Math.random() > 0.6) {
        setParticles(prev => [...prev.slice(-10), { id: Date.now(), x: pos.x, y: pos.y }]);
      }
    }, 600);
    return () => clearInterval(move);
  }, [pos]);

  const handleHit = (e: React.MouseEvent) => {
    e.stopPropagation();
    const dmg = 75;
    const next = Math.max(0, health - dmg);
    setHealth(next);

    if (containerRef.current) {
        const spark = document.createElement('div');
        spark.className = "absolute text-green-400 animate-ping font-black pointer-events-none z-50";
        spark.innerText = "DELIGHT!";
        const rect = containerRef.current.getBoundingClientRect();
        spark.style.left = `${e.clientX - rect.left}px`;
        spark.style.top = `${e.clientY - rect.top}px`;
        containerRef.current.appendChild(spark);
        setTimeout(() => spark.remove(), 500);
    }

    if (next <= 0) {
      onWin();
      onClose();
    }
  };

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[450px] bg-green-950 border-2 border-green-500 shadow-[0_0_40px_rgba(34,197,94,0.3)] rounded-lg overflow-hidden flex flex-col z-[80] animate-in zoom-in-95 duration-300">
      <div className="bg-green-600 p-2 flex justify-between items-center border-b border-green-400 text-white">
        <div className="flex items-center gap-2 px-2">
            <Sparkles className="w-4 h-4 animate-spin-slow" />
            <span className="text-[10px] font-black uppercase tracking-widest">DSOD.exe - Delight Screen Override</span>
        </div>
        <button onClick={onClose} className="hover:bg-green-700 p-1 rounded">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div ref={containerRef} className="flex-1 relative bg-black/40 backdrop-blur-sm overflow-hidden p-6 cursor-crosshair">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(34,197,94,0.1)_0%,_transparent_70%)]" />
        
        <div className="flex justify-between items-start z-20 relative">
            <div className="space-y-1">
                <div className="flex items-center gap-2 text-green-400 font-mono text-sm uppercase">
                    <Heart className="w-4 h-4 fill-green-500" /> STABILITY_CORE: {health}
                </div>
                <div className="w-64 h-2 bg-green-950 border border-green-500/30 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 shadow-[0_0_10px_lime]" style={{ width: `${(health/maxHealth)*100}%` }} />
                </div>
            </div>
            <div className="text-right text-[10px] text-green-500/60 font-mono leading-tight">
                REVERSE_BOSD_PROTOCOL<br/>
                OPTIMIZATION_OVERFLOW
            </div>
        </div>

        {particles.map(p => (
            <Star key={p.id} className="absolute text-yellow-400/30 w-4 h-4 animate-ping" style={{ left: `${p.x}%`, top: `${p.y}%` }} />
        ))}

        <div 
          onClick={handleHit}
          className="absolute transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2 group"
          style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
        >
            <div className="relative">
                <div className="absolute -inset-20 bg-green-400/20 rounded-full blur-[80px] animate-pulse" />
                <Smile className="w-24 h-24 text-green-400 drop-shadow-[0_0_20px_lime] transition-transform group-hover:scale-110" />
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
                    <span className="text-green-900 font-black text-3xl opacity-0 group-hover:opacity-100 transition-opacity">:)</span>
                </div>
            </div>
        </div>

        <div className="absolute bottom-4 left-4 space-y-2 opacity-50 pointer-events-none">
            <div className="flex items-center gap-2 text-green-500 font-mono text-[8px]">
                <Zap className="w-3 h-3" /> THREAD_HEALTH: 100%
            </div>
            <div className="flex items-center gap-2 text-green-500 font-mono text-[8px]">
                <Terminal className="w-3 h-3" /> NO_ERRORS_FOUND
            </div>
        </div>
      </div>

      <style>{`
        .animate-spin-slow { animation: spin 4s linear infinite; }
      `}</style>
    </div>
  );
};

export default DSODApp;
