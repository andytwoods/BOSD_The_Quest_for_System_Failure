
import React from 'react';
import { Monitor, FileText, Trash2, ShieldAlert, Recycle, Info, Trash, Zap, Bomb, RotateCcw, Globe, Ghost, Gift, CandyCane, Skull, Star, Bug, Hammer, Trophy, Heart, Terminal, ShoppingCart, Folder, Lock, Cat, Dog, Bird, Rabbit, Fish, Turtle, Squirrel, Snail, Image as ImageIcon } from 'lucide-react';
import { ComputerTier, Theme, CustomApp } from '../types';

interface DesktopProps {
  onOpenApp: () => void;
  onOpenVirusExe?: () => void;
  onOpenLogs: () => void;
  onOpenReadme: () => void;
  onOpenGoogle: () => void;
  onOpenAmazon: () => void;
  onOpenFiles: () => void;
  hasRootAccess: boolean;
  onOpenWorkbench: () => void;
  onRecycleLogs: () => void;
  onRestoreLogs: () => void;
  onDeleteBin: () => void;
  onOpenBos: () => void;
  onOpenDSOD: () => void;
  isLogsRecycled: boolean;
  isBinDeleted: boolean;
  isDeleteMode: boolean;
  onIconDelete: (type: string) => void;
  bosdCount: number;
  onRecycle: () => void;
  computerTier: ComputerTier;
  theme: Theme;
  canBuildAV: boolean;
  onUltimateWin?: () => void;
  animalTheme: string | null;
  customApps: CustomApp[];
  onLaunchCustomApp: (app: CustomApp) => void;
}

const Desktop: React.FC<DesktopProps> = ({ 
  onOpenApp, onOpenVirusExe, onOpenLogs, onOpenReadme, onOpenGoogle, onOpenAmazon, onOpenFiles, 
  hasRootAccess, onOpenWorkbench, onRecycleLogs, onRestoreLogs, onDeleteBin, onOpenBos, onOpenDSOD, 
  isLogsRecycled, isBinDeleted, isDeleteMode, onIconDelete, bosdCount, onRecycle, computerTier, theme, canBuildAV, onUltimateWin, 
  animalTheme, customApps, onLaunchCustomApp 
}) => {
  const isUltra = computerTier === ComputerTier.ULTRA;
  const canFinalWin = bosdCount >= 10 && isUltra;

  const handleAction = (type: string, callback: () => void) => {
    if (isDeleteMode) {
      onIconDelete(type);
    } else {
      callback();
    }
  };

  const getAnimalIcon = () => {
    switch (animalTheme) {
      case 'cat': return Cat;
      case 'dog': return Dog;
      case 'bird': return Bird;
      case 'rabbit': return Rabbit;
      case 'fish': return Fish;
      case 'turtle': return Turtle;
      case 'squirrel': return Squirrel;
      case 'snail': return Snail;
      default: return Cat;
    }
  };

  const AnimalIcon = animalTheme ? getAnimalIcon() : null;

  const renderIcon = (DefaultIcon: any, colorClass: string, isPulsing = false) => {
    if (AnimalIcon) return <AnimalIcon className={`${colorClass} w-8 h-8 ${isPulsing ? 'animate-pulse' : ''}`} />;
    return <DefaultIcon className={`${colorClass} w-8 h-8 ${isPulsing ? 'animate-pulse' : ''}`} />;
  };

  return (
    <div className={`p-6 grid grid-cols-1 auto-rows-min gap-6 w-fit h-fit z-10 max-h-screen overflow-y-auto ${isDeleteMode ? 'cursor-none' : ''}`}>
      <div className="flex flex-col items-center group cursor-pointer w-20">
        <div className={`p-3 rounded group-hover:bg-white/20 transition-all border border-transparent group-hover:border-white/30 ${isUltra ? 'bg-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'bg-white/10'}`}>
          {isUltra ? <Zap className="text-purple-400 w-8 h-8 animate-pulse" /> : renderIcon(Monitor, "text-white")}
        </div>
        <span className="text-white text-[10px] mt-2 text-center drop-shadow-md">System</span>
      </div>

      {canFinalWin && (
        <div onClick={onUltimateWin} className="flex flex-col items-center group cursor-pointer w-20 animate-bounce">
          <div className="p-3 bg-yellow-500/20 rounded group-hover:bg-yellow-500/40 border border-yellow-500/50 shadow-[0_0_20px_gold]">
            <Trophy className="text-yellow-400 w-8 h-8" />
          </div>
          <span className="text-yellow-400 text-[10px] mt-2 text-center drop-shadow-md font-black uppercase">Ultimate Win</span>
        </div>
      )}

      <div onClick={() => handleAction('readme', onOpenReadme)} className="flex flex-col items-center group cursor-pointer w-20">
        <div className={`p-3 bg-white/10 rounded group-hover:bg-white/20 transition-all border border-transparent group-hover:border-white/30 ${isDeleteMode ? 'group-hover:bg-red-500/40 border-red-500' : ''}`}>
          {renderIcon(Info, "text-blue-300")}
        </div>
        <span className="text-white text-[10px] mt-2 text-center drop-shadow-md">README.txt</span>
      </div>

      <div onClick={() => handleAction('google', onOpenGoogle)} className="flex flex-col items-center group cursor-pointer w-20">
        <div className={`p-3 bg-white/10 rounded group-hover:bg-white/20 transition-all border border-transparent group-hover:border-white/30 ${isDeleteMode ? 'group-hover:bg-red-500/40 border-red-500' : ''}`}>
          {renderIcon(Globe, "text-blue-400")}
        </div>
        <span className="text-white text-[10px] mt-2 text-center drop-shadow-md">Google</span>
      </div>

      <div onClick={() => handleAction('amazon', onOpenAmazon)} className="flex flex-col items-center group cursor-pointer w-20">
        <div className={`p-3 bg-white/10 rounded group-hover:bg-white/20 transition-all border border-transparent group-hover:border-white/30 ${isDeleteMode ? 'group-hover:bg-red-500/40 border-red-500' : ''}`}>
          {renderIcon(ShoppingCart, "text-orange-400")}
        </div>
        <span className="text-white text-[10px] mt-2 text-center drop-shadow-md">Amazon.sys</span>
      </div>

      <div onClick={() => handleAction('files', onOpenFiles)} className={`flex flex-col items-center group cursor-pointer w-20 ${!hasRootAccess ? 'opacity-20' : 'animate-pulse'}`}>
        <div className={`p-3 rounded group-hover:bg-white/20 transition-all border border-transparent group-hover:border-white/30 ${hasRootAccess ? 'bg-purple-500/20' : 'bg-gray-500/20'} ${isDeleteMode ? 'group-hover:bg-red-500/40 border-red-500' : ''}`}>
          {hasRootAccess ? renderIcon(Folder, "text-purple-400") : <Lock className="text-gray-500 w-8 h-8" />}
        </div>
        <span className="text-white text-[10px] mt-2 text-center drop-shadow-md">Files.exe</span>
      </div>

      {canBuildAV && (
        <div onClick={() => handleAction('workbench', onOpenWorkbench)} className="flex flex-col items-center group cursor-pointer w-20 animate-in fade-in zoom-in duration-500">
          <div className={`p-3 bg-blue-500/20 rounded group-hover:bg-blue-500/40 border border-blue-500/30 group-hover:border-blue-500 shadow-lg ${isDeleteMode ? 'group-hover:bg-red-500/40 border-red-500' : ''}`}>
            {renderIcon(Hammer, "text-blue-400")}
          </div>
          <span className="text-white text-[10px] mt-2 text-center drop-shadow-md font-bold uppercase">Builder.exe</span>
        </div>
      )}

      {/* Custom Created Apps */}
      {customApps.map(app => (
        <div 
          key={app.id} 
          onDoubleClick={() => onLaunchCustomApp(app)}
          className="flex flex-col items-center group cursor-pointer w-20 animate-in zoom-in duration-300"
        >
          <div className={`p-1 rounded group-hover:bg-white/20 transition-all border border-transparent group-hover:border-white/30 bg-white/10 overflow-hidden ${isDeleteMode ? 'group-hover:bg-red-500/40 border-red-500' : ''}`}>
             <img src={app.iconData} alt={app.name} className="w-12 h-12 object-cover rounded-sm" />
             {app.type === 'boss' && <Skull className="absolute -top-1 -right-1 w-4 h-4 text-red-500 animate-pulse bg-black rounded-full p-0.5" />}
          </div>
          <span className="text-white text-[9px] mt-1 text-center drop-shadow-md font-bold line-clamp-1 leading-tight">{app.name}</span>
        </div>
      ))}

      {!isLogsRecycled && (
        <div className="relative group w-20 flex flex-col items-center">
           <div onClick={() => handleAction('logs', onOpenLogs)} className={`p-3 bg-white/10 rounded hover:bg-white/20 transition-all border border-transparent hover:border-white/30 cursor-pointer ${isDeleteMode ? 'hover:bg-red-500/40 border-red-500' : ''}`}>
            {renderIcon(FileText, "text-white")}
          </div>
          <span className="text-white text-[10px] mt-2 text-center drop-shadow-md">Logs.txt</span>
          {!isDeleteMode && (
              <button 
                onClick={(e) => { e.stopPropagation(); onRecycleLogs(); }}
                className="absolute -top-2 -right-2 p-1 bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 shadow-lg z-20"
                title="Recycle Logs (Unlock 100 DMG)"
              >
                <Trash className="w-3 h-3 text-white" />
              </button>
          )}
        </div>
      )}

      <div onClick={() => handleAction('bosd', onOpenApp)} className="flex flex-col items-center group cursor-pointer w-20">
        <div className={`p-3 bg-red-500/20 rounded group-hover:bg-red-500/40 transition-all border border-red-500/30 group-hover:border-red-500 shadow-lg ${isDeleteMode ? 'group-hover:bg-red-500/40 border-red-500' : ''}`}>
          {renderIcon(ShieldAlert, "text-red-400")}
        </div>
        <span className="text-white text-[10px] mt-2 text-center drop-shadow-md font-bold uppercase">BOSD.exe</span>
      </div>

      <div onClick={() => handleAction('bos_terminal', onOpenBos)} className="flex flex-col items-center group cursor-pointer w-20">
        <div className={`p-3 bg-zinc-800/40 rounded group-hover:bg-zinc-700/60 transition-all border border-zinc-500/30 group-hover:border-zinc-500 shadow-lg ${isDeleteMode ? 'group-hover:bg-red-500/40 border-red-500' : ''}`}>
          {renderIcon(Terminal, "text-zinc-400")}
        </div>
        <span className="text-zinc-400 text-[10px] mt-2 text-center drop-shadow-md font-bold uppercase">bos.exe</span>
      </div>

      <div onClick={() => handleAction('dsod', onOpenDSOD)} className="flex flex-col items-center group cursor-pointer w-20">
        <div className={`p-3 bg-green-500/20 rounded hover:bg-green-500/40 border border-green-500/30 hover:border-green-500 transition-all ${isDeleteMode ? 'hover:bg-red-500/40 border-red-500' : ''}`}>
          {renderIcon(Heart, "text-green-400")}
        </div>
        <span className="text-green-400 text-[10px] mt-2 text-center drop-shadow-md font-bold uppercase">DSOD.exe</span>
      </div>

      {bosdCount >= 20 && (
        <div onClick={() => handleAction('virus', onOpenVirusExe)} className="flex flex-col items-center group cursor-pointer w-20 animate-pulse">
          <div className={`p-3 bg-green-900/40 rounded group-hover:bg-green-600/40 border border-green-500/30 group-hover:border-green-500 shadow-lg ${isDeleteMode ? 'group-hover:bg-red-500/40 border-red-500' : ''}`}>
            {renderIcon(Bug, "text-green-400")}
          </div>
          <span className="text-green-400 text-[10px] mt-2 text-center drop-shadow-md font-bold uppercase">virus.exe</span>
        </div>
      )}

      {!isBinDeleted && (
        <div className="relative group w-20 flex flex-col items-center">
            <div onClick={() => handleAction('bin', () => {})} className={`p-3 rounded transition-all flex items-center justify-center ${isLogsRecycled ? 'bg-blue-500/20' : 'bg-white/10'} ${isDeleteMode ? 'hover:bg-red-500/40 border-2 border-red-500' : ''}`}>
                {renderIcon(Trash2, isLogsRecycled ? "text-blue-300" : "text-white")}
            </div>
            <span className="text-white text-[10px] mt-2 text-center drop-shadow-md">Bin</span>
            {isLogsRecycled && !isDeleteMode && (
              <button 
                onClick={(e) => { e.stopPropagation(); onRestoreLogs(); }}
                className="absolute -top-2 -left-2 p-1 bg-green-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 shadow-lg"
                title="Restore Logs"
              >
                <RotateCcw className="w-3 h-3 text-white" />
              </button>
            )}
            {isUltra && !isDeleteMode && (
                <button onClick={(e) => { e.stopPropagation(); onDeleteBin(); }} className="absolute -top-2 -right-2 p-1 bg-black border border-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <Bomb className="w-3 h-3 text-red-500" />
                </button>
            )}
        </div>
      )}

      {bosdCount >= 10 && (
        <div onClick={onRecycle} className="flex flex-col items-center group cursor-pointer w-20 animate-pulse">
          <div className="p-3 bg-green-500/20 rounded group-hover:bg-green-500/40 border border-green-500 shadow-lg shadow-green-500/20">
            {renderIcon(Recycle, "text-green-400")}
          </div>
          <span className="text-green-400 text-[10px] mt-2 text-center drop-shadow-md font-bold uppercase">RECYCLE</span>
        </div>
      )}
    </div>
  );
};

export default Desktop;
