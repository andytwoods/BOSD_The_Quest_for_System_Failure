
import React, { useState } from 'react';
import { Terminal, ShieldAlert, Download, Bug, Cpu, Globe, Skull, Zap, Radio, X } from 'lucide-react';
import { GameStatus } from '../types';

interface BossItem {
  id: string;
  name: string;
  description: string;
  size: string;
  icon: any;
  status: GameStatus;
  difficulty: string;
}

interface DarkWebHubProps {
  onClose: () => void;
  onLaunchBoss: (status: GameStatus) => void;
}

const DarkWebHub: React.FC<DarkWebHubProps> = ({ onClose, onLaunchBoss }) => {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const bosses: BossItem[] = [
    {
      id: 'virus',
      name: 'virus.exe',
      description: 'Legacy malware from the early kernel days. High spread rate.',
      size: '2.4 MB',
      icon: Bug,
      status: GameStatus.VIRUS_BOSS,
      difficulty: 'Moderate'
    },
    {
      id: 'titan',
      name: 'titan_bsd.pkg',
      description: 'A massive entity that hijacks Google search indexes.',
      size: '142 GB',
      icon: ShieldAlert,
      status: GameStatus.TITAN_BSD,
      difficulty: 'Hard'
    },
    {
      id: 'chimera',
      name: 'chimera_v3.bin',
      description: 'Three viruses merged into a single neural amalgam threat.',
      size: '512 MB',
      icon: Radio,
      status: GameStatus.TRIPLE_VIRUS_BOSS,
      difficulty: 'Expert'
    },
    {
      id: 'internet',
      name: 'the_internet.zip',
      description: 'A global network stress test. Monitors damage streams.',
      size: '∞ EB',
      icon: Globe,
      status: GameStatus.INTERNET_BOSS,
      difficulty: 'Testing'
    },
    {
      id: 'glitch',
      name: 'the_glitch.raw',
      description: 'Unstable data fragment. Bypasses all standard logic.',
      size: '0 KB',
      icon: Skull,
      status: GameStatus.GLITCH_BOSS,
      difficulty: '???'
    }
  ];

  const handleDownload = (boss: BossItem) => {
    setDownloading(boss.id);
    setProgress(0);
    
    let current = 0;
    const interval = setInterval(() => {
      current += Math.random() * 20;
      if (current >= 100) {
        clearInterval(interval);
        setProgress(100);
        setTimeout(() => {
          onLaunchBoss(boss.status);
        }, 800);
      } else {
        setProgress(current);
      }
    }, 200);
  };

  return (
    <div className="absolute inset-0 bg-[#050505] z-[90] flex flex-col font-mono text-green-500 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-green-900 bg-black flex justify-between items-center shadow-[0_0_20px_rgba(0,255,0,0.1)]">
        <div className="flex items-center gap-4">
          <Terminal className="w-8 h-8 animate-pulse" />
          <div>
            <h1 className="text-2xl font-black tracking-tighter italic">DARK_WEB_MARKETPLACE</h1>
            <p className="text-[10px] opacity-60">ENCRYPTION: SHADOW_NET | STATUS: ANONYMOUS</p>
          </div>
        </div>
        <button onClick={onClose} className="hover:bg-green-900/40 p-2 rounded text-red-500 transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto">
        {bosses.map(boss => (
          <div key={boss.id} className="bg-black border border-green-900 p-6 flex flex-col gap-4 hover:border-green-500 hover:shadow-[0_0_15px_rgba(0,255,0,0.2)] transition-all group relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div className="bg-green-900/20 p-3 rounded border border-green-800 group-hover:bg-green-500/10 group-hover:border-green-500">
                <boss.icon className="w-8 h-8" />
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{boss.difficulty}</span>
                <p className="text-xs">{boss.size}</p>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-white">{boss.name}</h3>
              <p className="text-[10px] text-gray-400 leading-tight h-10 overflow-hidden">{boss.description}</p>
            </div>

            <button 
              disabled={!!downloading}
              onClick={() => handleDownload(boss)}
              className={`mt-auto py-3 rounded border font-black text-xs uppercase transition-all flex items-center justify-center gap-2 ${
                downloading === boss.id 
                ? 'bg-green-900 text-black border-green-500' 
                : 'border-green-800 hover:bg-green-500 hover:text-black hover:border-green-400 text-green-500'
              }`}
            >
              <Download className={`w-4 h-4 ${downloading === boss.id ? 'animate-bounce' : ''}`} />
              {downloading === boss.id ? 'Downloading...' : 'Download & Execute'}
            </button>

            {downloading === boss.id && (
              <div className="absolute bottom-0 left-0 h-1 bg-green-500 transition-all duration-200" style={{ width: `${progress}%` }} />
            )}
          </div>
        ))}

        {/* Decorative Grid Items */}
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="border border-green-900/30 p-6 flex flex-col items-center justify-center text-green-900/50 italic text-[10px] border-dashed">
            [DATA_REDACTED_BY_KERNEL]
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="p-4 bg-black border-t border-green-900 text-[10px] flex justify-between items-center">
        <div className="flex gap-6">
          <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> Bit-Stream: 1.2 GB/s</span>
          <span className="flex items-center gap-1"><Cpu className="w-3 h-3" /> Core: Active</span>
        </div>
        <p className="italic animate-pulse">Searching for vulnerabilities in global OS...</p>
      </div>

      <style>{`
        .animate-pulse-fast { animation: pulse 0.5s infinite; }
      `}</style>
    </div>
  );
};

export default DarkWebHub;
