
import React, { useState, useEffect } from 'react';
import { Bug, Globe, Skull } from 'lucide-react';

interface DesktopPetProps {
  pet: {
    id: string;
    type: string;
    color: string;
  };
}

const DesktopPet: React.FC<DesktopPetProps> = ({ pet }) => {
  const isGiant = pet.type === 'internet' || pet.type === 'glitch';
  
  // Start at a random bottom position
  // Giants need more room so they don't clip the bottom too much
  const [pos, setPos] = useState({ x: Math.random() * 80, y: isGiant ? 75 : 88 });
  const [state, setState] = useState<'walking' | 'climbing' | 'idle'>('walking');
  const [facingRight, setFacingRight] = useState(Math.random() > 0.5);

  useEffect(() => {
    const interval = setInterval(() => {
      setPos(prev => {
        let nextX = prev.x;
        let nextY = prev.y;

        // Boundaries based on size
        const maxX = isGiant ? 85 : 95;
        const maxY = isGiant ? 75 : 88;
        const minX = 1;
        const minY = 2;

        if (state === 'walking') {
          nextX += facingRight ? 0.2 : -0.2;
          
          // Bounce off horizontal edges
          if (nextX <= minX || nextX >= maxX) {
            setFacingRight(!facingRight);
            // Small chance to start climbing side wall
            if (Math.random() < 0.3) setState('climbing');
          }
          
          // Randomly stop to "think" (idle)
          if (Math.random() < 0.005) setState('idle');
        } else if (state === 'climbing') {
          nextY -= 0.2;
          
          // Reach top or randomly stop climbing
          if (nextY <= minY || Math.random() < 0.005) {
            setState('walking');
          }
        } else if (state === 'idle') {
          // Stay put, then resume
          if (Math.random() < 0.02) setState('walking');
        }

        // Gravity/Fall logic: if not on bottom and not climbing, fall down
        if (state === 'walking' && nextY < maxY) {
          nextY = Math.min(maxY, nextY + 0.5);
        }

        return { x: nextX, y: nextY };
      });
    }, 32);

    return () => clearInterval(interval);
  }, [state, facingRight, isGiant]);

  const renderIcon = () => {
    // w-8 (32px) * 5 = 160px (w-40)
    const size = isGiant ? "w-40 h-40" : "w-8 h-8";
    if (pet.type === 'internet') return <Globe className={`${size} animate-spin-slow`} />;
    if (pet.type === 'glitch') return <Skull className={`${size} glitch-mini`} />;
    return <Bug className={`${size} drop-shadow-lg`} />;
  };

  return (
    <div 
        className={`absolute z-[100] transition-transform duration-300 select-none pointer-events-none ${pet.color}`}
        style={{ 
            left: `${pos.x}%`, 
            top: `${pos.y}%`,
            transform: `scale(${facingRight ? 1 : -1}, 1) ${state === 'climbing' ? 'rotate(-90deg)' : ''}`
        }}
    >
        <div className="flex flex-col items-center">
            {renderIcon()}
            <div className="scale-x-[-1]"> {/* Keep text readable when flipping */}
                <span className={`font-black bg-black/60 text-white rounded-full uppercase tracking-tighter shadow-sm border border-white/20 backdrop-blur-sm whitespace-nowrap ${isGiant ? 'text-lg px-6 py-2 mt-2 shadow-[0_0_15px_rgba(0,0,0,0.5)]' : 'text-[7px] px-2 py-0.5'}`}>
                    {pet.type === 'internet' ? 'NET_ALLY' : pet.type === 'glitch' ? 'GLITCH_ALLY' : `PET_${pet.id.slice(0, 4)}`}
                </span>
            </div>
        </div>

        <style>{`
            .glitch-mini { animation: glitch-tiny 0.2s infinite; }
            @keyframes glitch-tiny {
                0% { transform: translate(0); }
                50% { transform: translate(-2px, 1px); }
                100% { transform: translate(1px, -1px); }
            }
            .animate-spin-slow { animation: spin 4s linear infinite; }
        `}</style>
    </div>
  );
};

export default DesktopPet;
