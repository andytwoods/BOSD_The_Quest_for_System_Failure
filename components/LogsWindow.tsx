
import React, { useState } from 'react';
import { X, Copy, FileText, Check, Trash2 } from 'lucide-react';

interface LogsWindowProps {
  onClose: () => void;
  onCopy: (val: string) => void;
  canCopy: boolean;
}

const CopyableRow: React.FC<{ label: string, value: string, onCopy: (v: string) => void, canCopy: boolean }> = ({ label, value, onCopy, canCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopy(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-2 bg-gray-50 border border-gray-200 flex items-center justify-between group">
      <span>{label}: <b className="text-blue-600">{value}</b></span>
      {canCopy && (
        <button 
            onClick={handleCopy}
            className="p-1 hover:bg-gray-200 rounded transition-all" 
            title="Copy Value to System Clipboard"
        >
            {copied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3 text-gray-600 opacity-0 group-hover:opacity-100" />}
        </button>
      )}
    </div>
  );
};

const LogsWindow: React.FC<LogsWindowProps> = ({ onClose, onCopy, canCopy }) => {
  return (
    <div className="absolute top-1/4 left-1/4 w-[380px] bg-white border-2 border-gray-400 shadow-2xl z-[55] flex flex-col font-sans animate-in zoom-in-95 duration-200">
      <div className="bg-[#000080] text-white p-1 flex justify-between items-center cursor-move">
        <span className="text-xs px-2 font-bold flex items-center gap-2">
            <FileText className="w-3 h-3" /> Logs.txt - Notepad
        </span>
        <button onClick={onClose} className="bg-gray-300 text-black px-1 border border-white border-r-gray-800 border-b-gray-800 hover:bg-gray-200">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="bg-white p-4 h-80 text-xs font-mono overflow-y-auto space-y-2 select-text">
        <p className="opacity-50 text-[10px]">[SYSTEM BOOT LOG v1.4]</p>
        <p>Initializing kernel... OK</p>
        
        <CopyableRow label="System_Ver" value="10" onCopy={onCopy} canCopy={canCopy} />
        <CopyableRow label="KERN_DMG_VAL" value="25" onCopy={onCopy} canCopy={canCopy} />
        <CopyableRow label="SYS_HLTH_BUFF" value="100" onCopy={onCopy} canCopy={canCopy} />
        
        <p className="pt-2 text-[9px] text-gray-400">Memory integrity check: SUCCESS</p>
        <p className="text-[9px] text-gray-400">Buffer overflow protection: ENABLED</p>
        
        <div className="mt-4 p-2 bg-blue-50 border border-blue-200 rounded">
            <p className="text-[8px] text-blue-600 font-bold uppercase mb-1 flex items-center gap-1">
                <Trash2 className="w-3 h-3" /> Pro Tip:
            </p>
            <p className="text-[8px] text-blue-800">
                Recycling this file from the desktop grants "Void Damage" authorization (100 DMG) in the BOSD.exe terminal.
            </p>
        </div>

        {!canCopy && (
           <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
             <p className="text-[9px] text-red-600 italic">
               ERROR: CLIPBOARD_ACCESS_DENIED. System requires 'Digital Art' clearance.
               Search 'paint' and draw the Unhappy Face :( to authorize.
             </p>
           </div>
        )}
      </div>
    </div>
  );
};

export default LogsWindow;
