
import React, { useState } from 'react';
import { X, Hammer, Shield, Zap, Skull, Bug, Activity, Sparkles, Monitor } from 'lucide-react';
import { BossPart } from '../types';

interface AntivirusWorkbenchProps {
  onClose: () => void;
  collectedParts: Set<BossPart>;
  bosdCount: number;
  onBuild: () => void;
}

const AntivirusWorkbench: React.FC<AntivirusWorkbenchProps> = ({ onClose, collectedParts, bosdCount, onBuild }) => {
  const [isBuilding, setIsBuilding] = useState(false);
  const [complete, setComplete] = useState(false);

  const requiredParts: BossPart[] = ['BOSD_SHIELD', 'VIRUS_SPIKE', 'CHIMERA_CLAW', 'TITAN_PLATE', 'DARK_CORE'];
  
  // Requirement: Defeat BOSD Boss 3 times as part of the ingredients
  const bosdCores = Math.min(3, bosdCount);
  const hasBOSDRequirement = bosdCores >= 3;
  
  const hasOtherParts = requiredParts.filter(p => p !== 'BOSD_SHIELD').every(p => collectedParts.has(p));
  const hasAll = hasBOSDRequirement && hasOtherParts;

  const handleBuild = () => {
    setIsBuilding(true);
    setTimeout(() => {
      setIsBuilding(false);
      setComplete(true);
      onBuild();
    }, 3000);
  };

  const getPartIcon = (part: BossPart) => {
    switch (part) {
      case 'BOSD_SHIELD': return <Shield className={`w-6 h-6 ${hasBOSDRequirement ? 'text-blue-400' : 'text-blue-400/50'}`} />;
      case 'VIRUS_SPIKE': return <Bug className="w-6 h-6 text-green-400" />;
      case 'CHIMERA_CLAW': return <Activity className="w-6 h-6 text-emerald-400" />;
      case 'TITAN_PLATE': return <Zap className="w-6 h-6 text-yellow-400" />;
      case 'DARK_CORE': return <Skull className="w-6 h-6 text-red-400" />;
    }
  };

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] bg-slate-900 border-2 border-blue-500 shadow-2xl z-[70] flex flex-col font-mono rounded-lg overflow-hidden animate-in zoom-in-95">
      <div className="bg-blue-600 text-white p-2 flex justify-between items-center border-b border-blue-400">
        <div className="flex items-center gap-2 px-2">
            <Hammer className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Antivirus Workbench v1.0</span>
        </div>
        <button onClick={onClose} className="hover:bg-blue-700 p-1 rounded transition-colors text-white">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-6 space-y-6">
        <div className="text-center">
            <h2 className="text-blue-400 text-lg font-black italic tracking-tighter">PROJECT: SYSTEM_GUARDIAN</h2>
            <p className="text-[10px] text-blue-300/60 mt-1">Status: {hasAll ? 'COMPONENTS READY' : 'ASSEMBLING DATA'}</p>
        </div>

        <div className="grid grid-cols-5 gap-4">
            {/* Special BOSD Core Requirement (0/3) */}
            <div className={`flex flex-col items-center gap-2 p-2 border rounded-lg transition-all ${hasBOSDRequirement ? 'bg-blue-500/10 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]' : 'bg-slate-800 border-slate-700'}`}>
                <Shield className={`w-6 h-6 ${hasBOSDRequirement ? 'text-blue-400 animate-pulse' : 'text-blue-400/30'}`} />
                <span className="text-[8px] font-bold text-center leading-none">BOSD CORES</span>
                <span className={`text-[10px] font-black ${hasBOSDRequirement ? 'text-blue-400' : 'text-gray-500'}`}>{bosdCores}/3</span>
            </div>

            {requiredParts.filter(p => p !== 'BOSD_SHIELD').map(p => (
                <div key={p} className={`flex flex-col items-center gap-2 p-2 border rounded-lg transition-all ${collectedParts.has(p) ? 'bg-blue-500/10 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]' : 'bg-slate-800 border-slate-700 opacity-30 grayscale'}`}>
                    {getPartIcon(p)}
                    <span className="text-[8px] font-bold text-center leading-none">{p.replace('_', ' ')}</span>
                </div>
            ))}
        </div>

        <div className="bg-black/40 p-4 border border-blue-500/30 rounded-lg">
            {!complete ? (
                <>
                    <p className="text-[10px] text-blue-200 leading-relaxed mb-4">
                        Combine fragments from fallen bosses to forge an autonomous defense system. 
                        <br/><br/>
                        <span className="font-bold text-blue-400 underline italic">REQUIRED: Defeat the BOSD Boss 3 times to stabilize the core.</span>
                    </p>
                    <button 
                        disabled={!hasAll || isBuilding}
                        onClick={handleBuild}
                        className={`w-full py-3 rounded-md font-black text-sm uppercase transition-all flex items-center justify-center gap-2 ${hasAll ? 'bg-blue-600 hover:bg-blue-500 text-white animate-pulse shadow-lg' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}
                    >
                        {isBuilding ? 'ASSEMBLING DEFENSES...' : hasAll ? 'ASSEMBLE SYSTEM GUARDIAN' : 'INCOMPLETE SCHEMATIC'}
                    </button>
                </>
            ) : (
                <div className="text-center animate-in zoom-in duration-500">
                    <Sparkles className="w-12 h-12 text-blue-400 mx-auto mb-2" />
                    <h3 className="text-white font-bold">SYSTEM GUARDIAN ONLINE</h3>
                    <p className="text-[9px] text-blue-300 mt-2">The custom antivirus is now hunting for threats. You can now relax or search "no virus" in Google to toggle manually.</p>
                </div>
            )}
        </div>
      </div>

      <div className="bg-slate-800 p-2 text-[8px] text-blue-400/50 flex justify-between">
         <span>SCHEMATIC_AUTH: BOSD_CORP_INTERACTIVE</span>
         <span className="italic">Progress: {hasAll ? '100%' : hasBOSDRequirement ? '60%' : '20%'}</span>
      </div>
    </div>
  );
};

export default AntivirusWorkbench;
