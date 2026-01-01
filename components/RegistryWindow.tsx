
import React, { useState } from 'react';
import { X, Terminal, Settings, ShieldAlert, Cpu, RotateCcw, Keyboard, Activity, Trash2, Zap } from 'lucide-react';
import { SystemSettings } from '../types';

interface RegistryWindowProps {
  settings: SystemSettings;
  onUpdateSettings: (s: SystemSettings) => void;
  onClose: () => void;
  onFullReset: () => void;
  onSetDeleteMode: (active: boolean) => void;
}

const RegistryWindow: React.FC<RegistryWindowProps> = ({ settings, onUpdateSettings, onClose, onFullReset, onSetDeleteMode }) => {
  const [editingKey, setEditingKey] = useState(false);

  const handleKeyListen = (e: React.KeyboardEvent) => {
    if (!editingKey) return;
    onUpdateSettings({ ...settings, resetKey: e.key });
    setEditingKey(false);
  };

  return (
    <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-[450px] bg-[#dfdfdf] border-2 border-white border-r-gray-500 border-b-gray-500 shadow-2xl z-[95] flex flex-col font-sans animate-in slide-in-from-bottom-4 zoom-in-95">
      <div className="bg-[#000080] text-white p-1 flex justify-between items-center cursor-move">
        <div className="flex items-center gap-2 px-2">
            <Terminal className="w-3 h-3 text-green-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Registry Editor v2.0 - ULTIMATE_SYSTEM</span>
        </div>
        <button onClick={onClose} className="bg-gray-300 text-black px-1 border border-white border-r-gray-800 border-b-gray-800 hover:bg-gray-200">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden h-[350px]">
        {/* Sidebar Nav */}
        <div className="w-32 bg-white border-r border-gray-400 p-2 space-y-1 text-[9px] font-mono overflow-y-auto">
            <div className="text-blue-800 font-bold">HKEY_LOCAL_MACHINE</div>
            <div className="pl-2">SOFTWARE</div>
            <div className="pl-4 font-bold text-red-600">BOSD_QUEST</div>
            <div className="pl-6 font-bold text-blue-600">CLEANER_TOOL</div>
            <div className="pl-6">KERNEL_CONFIG</div>
            <div className="pl-6">USER_PREFS</div>
            <div className="pl-2">SYSTEM</div>
            <div className="pl-2">SECURITY</div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-gray-200">
            <div className="bg-white border border-inset p-3 space-y-3">
                <h3 className="text-blue-800 text-[10px] font-black uppercase flex items-center gap-2 border-b border-gray-200 pb-1">
                  <Trash2 className="w-3 h-3" /> System Purge Tool
                </h3>
                <p className="text-[8px] text-gray-500 italic leading-tight">
                  "You can get rid of anything. Activate the Purge Tool to turn your cursor into a system shredder."
                </p>
                <button 
                  onClick={() => {
                    onSetDeleteMode(true);
                    onClose();
                  }}
                  className="w-full bg-slate-800 text-white p-2 rounded text-[10px] font-black uppercase hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Zap className="w-3 h-3 text-yellow-400" /> Initialize Purge Logic
                </button>
            </div>

            <div className="bg-white border border-inset p-3 space-y-3">
                <h3 className="text-blue-800 text-[10px] font-black uppercase flex items-center gap-2 border-b border-gray-200 pb-1">
                  <Cpu className="w-3 h-3" /> Core Interaction Keys
                </h3>
                
                <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-gray-700 uppercase">Master Reset Key:</span>
                    <button 
                        onClick={() => setEditingKey(true)}
                        onKeyDown={handleKeyListen}
                        className={`px-3 py-1 border border-gray-400 text-[10px] font-mono min-w-[80px] ${editingKey ? 'bg-yellow-100 animate-pulse' : 'bg-gray-50'}`}
                    >
                        {editingKey ? 'Press any key...' : settings.resetKey}
                    </button>
                </div>
                <p className="text-[8px] text-gray-500 italic leading-tight">
                  "Remap the key that performs a hard reset. Essential for finishing the game."
                </p>
            </div>

            <div className="bg-white border border-inset p-3 space-y-3">
                <h3 className="text-blue-800 text-[10px] font-black uppercase flex items-center gap-2 border-b border-gray-200 pb-1">
                  <Activity className="w-3 h-3" /> Visual Synthesizer
                </h3>
                
                <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-gray-700 uppercase">Glitch Particles:</span>
                    <input 
                        type="checkbox" 
                        checked={settings.glitchVisuals} 
                        onChange={(e) => onUpdateSettings({ ...settings, glitchVisuals: e.target.checked })} 
                    />
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-gray-700 uppercase">High Contrast Mode:</span>
                    <input 
                        type="checkbox" 
                        checked={settings.highContrast} 
                        onChange={(e) => onUpdateSettings({ ...settings, highContrast: e.target.checked })} 
                    />
                </div>
            </div>

            <div className="bg-red-50 border border-red-200 p-3 space-y-3">
                <h3 className="text-red-800 text-[10px] font-black uppercase flex items-center gap-2">
                  <ShieldAlert className="w-3 h-3" /> Factory Lockdown
                </h3>
                <button 
                    onClick={onFullReset}
                    className="w-full bg-red-700 hover:bg-red-600 text-white p-2 rounded border border-red-400 flex items-center justify-center gap-2 transition-all shadow-md group"
                >
                    <RotateCcw className="w-4 h-4 group-hover:rotate-[-90deg] transition-transform" />
                    <span className="text-[10px] font-black uppercase">Destroy & Reset System</span>
                </button>
                <p className="text-[8px] text-red-700 leading-relaxed font-bold italic">
                   WARNING: THIS WILL CLEAR ALL CUSTOM APPS AND UNLOCKED TIERS.
                </p>
            </div>
        </div>
      </div>

      <div className="bg-[#dfdfdf] p-2 border-t border-gray-400 text-[8px] text-gray-500 flex justify-between italic">
         <span className="flex items-center gap-1"><Keyboard className="w-3 h-3" /> Edit key bindings at your own risk.</span>
         <span>AUTH: ULTIMATE_USER</span>
      </div>
    </div>
  );
};

export default RegistryWindow;
