
import React, { useState, useEffect } from 'react';
import { LayoutGrid, Wifi, Volume2, Search, Zap, Trash2, Ghost, Gift, Star, Palette, Settings, User, Cat, Dog, Bird, Rabbit, Fish, Turtle, Squirrel, Snail, Terminal } from 'lucide-react';
import { Theme } from '../types';

interface TaskbarProps {
  onSearchPaint: () => void;
  onCommand: (cmd: string) => void;
  onVolumeClick: () => void;
  onDeleteWindowsIcon: () => void;
  canDeleteWindowsIcon: boolean;
  isUltra: boolean;
  theme: Theme;
  isAdminUnlocked?: boolean;
  onAdminOpen?: () => void;
  onClockClick?: () => void;
  onLoginClick?: () => void;
  onRegistryOpen?: () => void;
  currentUser: string;
  animalTheme: string | null;
}

const Taskbar: React.FC<TaskbarProps> = ({ onSearchPaint, onCommand, onVolumeClick, onDeleteWindowsIcon, canDeleteWindowsIcon, isUltra, theme, isAdminUnlocked, onAdminOpen, onClockClick, onLoginClick, onRegistryOpen, currentUser, animalTheme }) => {
  const [time, setTime] = useState(new Date());
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase();
    setSearchValue(val);
    if (val === 'paint' || val === 'ms paint' || val === 'secret') { onSearchPaint(); setSearchValue(''); }
    else if (val === 'bsd') { onCommand('bsd'); setSearchValue(''); }
    else if (val === 'pd6') { onCommand('pd6'); setSearchValue(''); }
    else if (val === 'bg') { onCommand('bg'); setSearchValue(''); }
    else if (val === 'cleaner') { onCommand('cleaner.exe'); setSearchValue(''); }
    else if (val === 'registry') { onCommand('registry.exe'); setSearchValue(''); }
    else if (val === 'infinity') { onCommand('infinity'); setSearchValue(''); }
    else if (val === 'bosd.exe') { onCommand('bosd.exe'); setSearchValue(''); }
    else if (val === 'dsod.exe') { onCommand('dsod.exe'); setSearchValue(''); }
    else if (val.includes('halloween')) { onCommand('halloween'); setSearchValue(''); }
    else if (val.includes('christmas')) { onCommand('christmas'); setSearchValue(''); }
    else if (val.includes('new year')) { onCommand('new year'); setSearchValue(''); }
    else if (isUltra && val === 'explode') { onCommand('explode'); setSearchValue(''); }
  };

  const getThemedColor = () => {
    if (animalTheme) return 'bg-white/20 border-white/40 backdrop-blur-md';
    if (theme === Theme.HALLOWEEN) return 'bg-orange-900/60 border-orange-500/30';
    if (theme === Theme.CHRISTMAS) return 'bg-red-900/60 border-green-500/30';
    if (theme === Theme.NEW_YEAR) return 'bg-[#8B0000]/80 border-yellow-500/30';
    if (isUltra) return 'bg-indigo-900/60 border-blue-400/30';
    return 'bg-black/40 border-white/10';
  };

  const renderStartIcon = () => {
    if (animalTheme) {
        switch(animalTheme) {
            case 'cat': return <Cat className="text-white w-6 h-6" />;
            case 'dog': return <Dog className="text-white w-6 h-6" />;
            case 'bird': return <Bird className="text-white w-6 h-6" />;
            case 'rabbit': return <Rabbit className="text-white w-6 h-6" />;
            case 'fish': return <Fish className="text-white w-6 h-6" />;
            case 'turtle': return <Turtle className="text-white w-6 h-6" />;
            case 'squirrel': return <Squirrel className="text-white w-6 h-6" />;
            case 'snail': return <Snail className="text-white w-6 h-6" />;
            default: return <Cat className="text-white w-6 h-6" />;
        }
    }
    if (theme === Theme.HALLOWEEN) return <Ghost className="text-orange-400 w-6 h-6" />;
    if (theme === Theme.CHRISTMAS) return <Gift className="text-red-400 w-6 h-6" />;
    if (theme === Theme.NEW_YEAR) return <Star className="text-yellow-400 w-6 h-6 animate-pulse" />;
    return <LayoutGrid className={`${isUltra ? 'text-blue-300' : 'text-blue-400'} w-6 h-6`} />;
  };

  return (
    <div className={`absolute bottom-0 w-full h-12 border-t flex items-center justify-between px-2 z-50 transition-colors ${getThemedColor()} backdrop-blur-xl`}>
      <div className="flex items-center gap-1 h-full">
        <div className="relative group">
          <button className="h-10 w-10 flex items-center justify-center hover:bg-white/10 rounded transition-all">
            {renderStartIcon()}
          </button>
          
          {canDeleteWindowsIcon && !isUltra && (
            <button 
              onClick={(e) => { e.stopPropagation(); onDeleteWindowsIcon(); }}
              className="absolute -top-1 -right-1 bg-red-600 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 shadow-lg z-[60]"
              title="DELETE OS CORE (UPGRADE TO ULTRA)"
            >
              <Trash2 className="w-3 h-3 text-white" />
            </button>
          )}
        </div>

        {isAdminUnlocked && (
           <button 
            onClick={onAdminOpen}
            className="h-10 w-10 flex items-center justify-center hover:bg-white/10 rounded transition-all group"
            title="ADMIN PANEL"
           >
             <Settings className="text-yellow-400 w-5 h-5 group-hover:rotate-90 transition-transform" />
           </button>
        )}

        <button 
          onClick={onRegistryOpen}
          className="h-10 w-10 flex items-center justify-center hover:bg-white/10 rounded transition-all group"
          title="REGISTRY EDITOR"
        >
          <Terminal className="text-green-400 w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>

        <div className="relative group ml-1">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
          <input 
            type="text" 
            value={searchValue}
            onChange={handleSearch}
            placeholder={isUltra ? "Search 'bg' for themes..." : "Type 'cleaner', 'registry' or 'paint'..." }
            className={`bg-white/10 border border-white/10 rounded-full py-1 pl-8 pr-4 text-[10px] text-white placeholder:text-white/30 w-48 focus:outline-none focus:bg-white/20 transition-all ${isUltra ? 'ring-1 ring-blue-500/20' : ''}`}
          />
          {isUltra && <Zap className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-yellow-400 animate-pulse" />}
        </div>
      </div>

      <div className="flex items-center gap-4 px-4 h-full">
        <button 
            onClick={onLoginClick}
            className="flex items-center gap-2 text-white/70 hover:text-white hover:bg-white/10 px-2 py-1 rounded transition-colors group"
        >
            <User className={`w-3.5 h-3.5 ${currentUser.toLowerCase() === 'hacker' ? 'text-green-400' : ''}`} />
            <span className={`text-[10px] font-bold ${currentUser.toLowerCase() === 'hacker' ? 'text-green-400' : ''}`}>{currentUser}</span>
        </button>

        <div className="flex items-center gap-3 text-white/70">
          <Palette className="w-3 h-3 animate-bounce" title="Type 'bg' to change theme!" />
          <Wifi className="w-3 h-3" />
          <button onClick={onVolumeClick} className="hover:text-white transition-colors p-1 rounded hover:bg-white/10">
            <Volume2 className="w-3 h-3" />
          </button>
        </div>
        <button 
            onClick={onClockClick}
            className="flex flex-col items-end text-white text-[9px] leading-tight font-mono hover:bg-white/10 px-2 py-1 rounded transition-colors group"
        >
          <span className="group-hover:text-blue-400 transition-colors">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          <span className="group-hover:text-blue-400 transition-colors">{time.toLocaleDateString([], { month: '2-digit', day: '2-digit' })}</span>
        </button>
      </div>
    </div>
  );
};

export default Taskbar;
