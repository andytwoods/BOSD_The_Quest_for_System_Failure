
import React from 'react';
import { X, Info } from 'lucide-react';

interface ReadmeWindowProps {
  onClose: () => void;
}

const ReadmeWindow: React.FC<ReadmeWindowProps> = ({ onClose }) => {
  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[400px] bg-[#f0f0f0] border-2 border-gray-400 shadow-2xl z-[55] flex flex-col font-sans animate-in slide-in-from-top-4 duration-200">
      <div className="bg-[#000080] text-white p-1 flex justify-between items-center">
        <span className="text-xs px-2 font-bold flex items-center gap-2">
            <Info className="w-3 h-3" /> README.txt - Notepad
        </span>
        <button onClick={onClose} className="bg-gray-300 text-black px-1 border border-white border-r-gray-800 border-b-gray-800 hover:bg-gray-200">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="bg-white p-6 h-80 text-xs font-mono overflow-y-auto space-y-4 leading-relaxed select-text">
        <h2 className="text-sm font-bold border-b pb-1">SUBJECT: SYSTEM INSTABILITY PROTOCOL</h2>
        <p>Goal: Force a Blue Screen of Death (BOD) before the 5-minute stability timer expires.</p>
        
        <p className="font-bold text-red-600 uppercase underline">The Destruction Strategy:</p>
        
        <p>Advanced users may attempt "System Exploitation":</p>
        <ol className="list-decimal pl-4 space-y-2">
          <li>Unauthorized GUI modifications (Search 'paint' and draw the Forbidden Symbol ':(') bypass kernel clipboard protections.</li>
          <li>Once bypassed, copy the 25 or 100 values from 'Logs.txt'.</li>
          <li>Inject these values into the BOSD.exe app while in Phase 2.</li>
          <li><b className="text-red-600">NEW:</b> Delete/Recycle 'Logs.txt' directly from the desktop to unlock the <b className="italic">Void Override</b> (100 DMG) button inside the BOSD.exe terminal.</li>
        </ol>

        <p className="pt-4 border-t opacity-70">
          Harvest 10 BODs to authorize hardware recycling. Newer systems will be more stable and harder to crash.
        </p>
        
        <p className="text-[10px] text-blue-600">-- System Admin</p>
      </div>
    </div>
  );
};

export default ReadmeWindow;
