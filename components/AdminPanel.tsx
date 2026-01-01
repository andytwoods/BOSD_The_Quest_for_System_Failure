
import React from 'react';
import { X, Settings, Zap, Globe, ShieldAlert, Cpu, RotateCcw } from 'lucide-react';

interface AdminPanelProps {
  onClose: () => void;
  onSpawnInternet: () => void;
  onFullReset: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose, onSpawnInternet, onFullReset }) => {
  return (
    <div className="absolute top-20 right-20 w-[350px] bg-[#dfdfdf] border-2 border-white border-r-gray-500 border-b-gray-500 shadow-2xl z-[80] flex flex-col font-sans animate-in slide-in-from-right-4 duration-300">
      <div className="bg-[#000080] text-white p-1 flex justify-between items-center cursor-move">
        <div className="flex items-center gap-2 px-2">
            <Settings className="w-3 h-3" />
            <span className="text-[10px] font-bold uppercase tracking-widest">System Admin Panel v4.0</span>
        </div>
        <button onClick={onClose} className="bg-gray-300 text-black px-1 border border-white border-r-gray-800 border-b-gray-800 hover:bg-gray-200">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 bg-gray-200 space-y-4">
        <div className="bg-white border-2 border-inset p-3 space-y-2">
          <h3 className="text-blue-800 text-[10px] font-black uppercase flex items-center gap-2">
            <Cpu className="w-3 h-3" /> Kernel Overrides
          </h3>
          <p className="text-[9px] text-gray-600">UNAUTHORIZED ACCESS: Level 99</p>
        </div>

        <div className="space-y-2">
          <button 
            onClick={onSpawnInternet}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white p-3 rounded border border-blue-400 flex items-center justify-between group transition-all"
          >
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <div className="text-left">
                <span className="text-xs font-black uppercase">Spawn The Internet</span>
                <p className="text-[8px] opacity-70">Stress Test: Damage Monitoring Boss</p>
              </div>
            </div>
            <Zap className="w-4 h-4 text-yellow-400 animate-pulse" />
          </button>

          <button 
            onClick={onFullReset}
            className="w-full bg-red-700 hover:bg-red-600 text-white p-2 rounded border border-red-400 flex items-center justify-center gap-2 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase">Factory Reset System</span>
          </button>

          <div className="bg-red-100 border border-red-300 p-3 rounded flex items-start gap-2">
             <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
             <p className="text-[8px] text-red-800 leading-relaxed font-bold italic">
               WARNING: "The Internet" boss is a testing entity. It monitors incoming damage streams. 
               Destruction requires 10 Power Balls + Recycling. NOT RECOMMENDED.
             </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2">
           <button className="bg-gray-300 border border-white border-r-gray-500 border-b-gray-500 py-2 text-[8px] font-bold uppercase text-gray-700 opacity-50 cursor-not-allowed">Enable Fly Mode</button>
           <button className="bg-gray-300 border border-white border-r-gray-500 border-b-gray-500 py-2 text-[8px] font-bold uppercase text-gray-700 opacity-50 cursor-not-allowed">Infinite Blaster</button>
        </div>
      </div>

      <div className="bg-[#dfdfdf] p-2 border-t border-gray-400 text-[8px] text-gray-500 flex justify-between italic">
         <span>Auth_Key: {Math.random().toString(16).slice(2, 10).toUpperCase()}</span>
         <span>ROOT_SHELL</span>
      </div>
    </div>
  );
};

export default AdminPanel;
