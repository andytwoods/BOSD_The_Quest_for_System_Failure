
import React from 'react';
import { X, ShieldAlert, AlertCircle } from 'lucide-react';

interface VirusPopupProps {
  x: number;
  y: number;
  onClose: () => void;
}

const VirusPopup: React.FC<VirusPopupProps> = ({ x, y, onClose }) => {
  return (
    <div 
        className="absolute w-64 bg-red-600 border-2 border-white shadow-[10px_10px_0px_black] z-[65] flex flex-col font-sans animate-in zoom-in-50 duration-200"
        style={{ left: `${x}%`, top: `${y}%` }}
    >
      <div className="bg-black text-white p-1 flex justify-between items-center border-b border-white">
        <div className="flex items-center gap-2 px-1">
            <ShieldAlert className="w-3 h-3 text-red-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest">CRITICAL ALERT</span>
        </div>
        <button onClick={onClose} className="hover:bg-red-700 p-1 text-white">
          <X className="w-3 h-3" />
        </button>
      </div>
      
      <div className="p-3 flex items-start gap-3">
        <AlertCircle className="w-10 h-10 text-white shrink-0 animate-pulse" />
        <div className="space-y-1">
            <p className="text-[10px] font-black text-white leading-tight uppercase">Security Breach Detected!</p>
            <p className="text-[8px] text-white/80 leading-tight">Unauthorized access attempt in sector 0x77FF. System resources are being redirected.</p>
        </div>
      </div>

      <div className="p-2 border-t border-white/20 bg-red-700 flex justify-end gap-2">
         <button onClick={onClose} className="px-3 py-1 bg-white text-red-700 text-[8px] font-bold uppercase hover:bg-gray-100 shadow-sm">Authorize Wipe</button>
         <button onClick={onClose} className="px-3 py-1 border border-white text-white text-[8px] font-bold uppercase hover:bg-red-600">Ignore</button>
      </div>
    </div>
  );
};

export default VirusPopup;
