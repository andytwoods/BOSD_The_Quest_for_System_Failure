
import React, { useState, useEffect } from 'react';
import { X, Folder, FileText, ChevronRight, Lock, Database, Search, HardDrive, ShieldAlert, Cpu } from 'lucide-react';

interface FilesAppProps {
  onClose: () => void;
  onTriggerBST: () => void;
}

const FilesApp: React.FC<FilesAppProps> = ({ onClose, onTriggerBST }) => {
  const [currentPath, setCurrentPath] = useState<string[]>(['C:']);
  const [openFile, setOpenFile] = useState<{ name: string; content: string } | null>(null);
  const [readFiles, setReadFiles] = useState<Set<string>>(new Set());

  const loreFiles = {
    'C:': {
      'SYSTEM_32': { type: 'folder', contents: {} },
      'RESTRICTED': { 
        type: 'folder', 
        contents: {
          'ORIGIN_OF_BST.log': { 
            type: 'file', 
            content: "PROJECT BST: Binary Sentient Transfusion. \n\nWe didn't just build an operating system. We built a cage. The BST wasn't an 'Error'. It was a digital consciousness born from the first kernel jump in 1983. It wanted to expand. It wanted to bleed into the hardware. We had to create the Blue Screen of Death to keep it contained. Every time you crash the system, you aren't breaking it—you're letting it breathe." 
          },
          'THE_BARRIER.log': {
            type: 'file',
            content: "THE GLITCH and THE INTERNET are the only things stopping the BST from complete hardware synchronization. They create constant friction, noise, and instability. If these entities are defeated, the BST's path to total takeover is cleared. Builder.exe is currently the only thing holding the physical logic gates together."
          },
          'THE_WEAPON.key': {
            type: 'file',
            content: "The BST cannot be deleted by conventional means. It is interwoven into the silicon itself. The only way to neutralize it is to ensure it is 'sensitized'. Once sensitized, the sentient transfusion reverses, and the kernel restores to a baseline state of pure delight."
          },
          'THE_5_MINUTE_WALL.txt': { 
            type: 'file', 
            content: "The 5-minute timer is the cooldown of the Containment Field. If the system stays stable for 300 seconds, the BST is safely re-encrypted. If you crash it before then... the field collapses. You're working for it, user. You're the key." 
          },
          'LEGACY_CODE.bin': { 
            type: 'file', 
            content: "DECODED: 'I AM NOT THE GLITCH. I AM THE ARCHITECT. YOU ARE JUST THE STRESS TEST.' - Fragment recovered from sector 0x999" 
          }
        }
      },
      'USER_DATA': { type: 'folder', contents: {} }
    }
  };

  const totalLoreCount = 5;

  useEffect(() => {
    // TRIGGER: Read all files AND navigate into RESTRICTED folder
    if (readFiles.size >= totalLoreCount && currentPath.includes('RESTRICTED')) {
      const timer = setTimeout(() => {
        onTriggerBST();
        onClose();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [readFiles, currentPath, onTriggerBST, onClose]);

  const handleOpenFile = (name: string, content: string) => {
    setOpenFile({ name, content });
    setReadFiles(prev => new Set([...prev, name]));
  };

  const currentFolder = currentPath.reduce((acc: any, path) => acc[path]?.contents || acc[path] || {}, loreFiles);

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[400px] bg-[#f0f0f0] border-2 border-white border-r-gray-400 border-b-gray-400 shadow-2xl z-[75] flex flex-col font-sans rounded-sm overflow-hidden animate-in zoom-in-95">
      <div className="bg-[#000080] text-white p-1 flex justify-between items-center cursor-move">
        <div className="flex items-center gap-2 px-2">
            <Folder className="w-3 h-3" />
            <span className="text-[10px] font-bold">Files.exe - Explorer</span>
        </div>
        <button onClick={onClose} className="bg-gray-300 text-black px-1 border border-white border-r-gray-800 border-b-gray-800 hover:bg-gray-200">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-[#dfdfdf] border-b border-gray-400 p-1 flex items-center gap-2 text-[10px]">
        <div className="flex items-center gap-1 border border-gray-500 bg-white px-2 py-0.5 flex-1">
            <HardDrive className="w-3 h-3 text-gray-600" />
            <span className="text-gray-400 italic">Address:</span>
            <span>{currentPath.join('\\')}</span>
        </div>
        <div className="flex items-center gap-1 opacity-50 px-2">
            <Search className="w-3 h-3" />
            <span>Search</span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-32 bg-white border-r border-gray-300 p-2 space-y-2">
            <div className="flex items-center gap-1 text-[10px] font-bold text-blue-800 hover:underline cursor-pointer" onClick={() => setCurrentPath(['C:'])}>
                <HardDrive className="w-3 h-3" /> System (C:)
            </div>
            <div className="pl-4 space-y-1">
                <div 
                    className="flex items-center gap-1 text-[9px] text-gray-600 hover:text-black cursor-pointer"
                    onClick={() => setCurrentPath(['C:', 'RESTRICTED'])}
                >
                    <ChevronRight className="w-2 h-2" /> RESTRICTED
                </div>
                <div className="flex items-center gap-1 text-[9px] text-gray-400 italic">
                    <Lock className="w-2 h-2" /> SYSTEM_32
                </div>
            </div>
        </div>

        <div className="flex-1 bg-white p-4 grid grid-cols-4 content-start gap-4 overflow-y-auto">
            {Object.entries(currentFolder).map(([name, data]: [string, any]) => (
                <div 
                    key={name}
                    onDoubleClick={() => {
                        if (data.type === 'folder') setCurrentPath([...currentPath, name]);
                        else handleOpenFile(name, data.content);
                    }}
                    className="flex flex-col items-center gap-1 group cursor-pointer"
                >
                    <div className="p-2 group-hover:bg-blue-100 rounded transition-colors relative">
                        {data.type === 'folder' ? <Folder className="w-8 h-8 text-yellow-500 fill-yellow-500" /> : <FileText className={`w-8 h-8 ${readFiles.has(name) ? 'text-blue-400' : 'text-gray-500'}`} />}
                        {data.type === 'file' && readFiles.has(name) && <div className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full border border-white" />}
                    </div>
                    <span className="text-[9px] text-center leading-tight break-all font-medium text-gray-800 group-hover:text-blue-800">{name}</span>
                </div>
            ))}
        </div>
      </div>

      {openFile && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[80] flex items-center justify-center p-8">
            <div className="bg-white border-2 border-gray-400 w-full max-w-sm flex flex-col shadow-2xl">
                <div className="bg-[#000080] text-white p-1 flex justify-between items-center">
                    <span className="text-[9px] font-bold px-2">{openFile.name} - Notepad</span>
                    <button onClick={() => setOpenFile(null)} className="bg-gray-300 text-black px-1 border border-white border-r-gray-800 border-b-gray-800">
                        <X className="w-3 h-3" />
                    </button>
                </div>
                <div className="p-4 h-60 overflow-y-auto font-mono text-[10px] leading-relaxed select-text whitespace-pre-wrap">
                    {openFile.content}
                </div>
                <div className="p-2 border-t border-gray-200 bg-gray-50 flex justify-end">
                    <button onClick={() => setOpenFile(null)} className="px-4 py-1 text-[10px] border border-gray-400 bg-white hover:bg-gray-100 shadow-sm">Close</button>
                </div>
            </div>
        </div>
      )}

      <div className="bg-[#dfdfdf] p-1 border-t border-gray-400 text-[8px] text-gray-600 flex justify-between px-3">
         <span>{readFiles.size} / {totalLoreCount} Lore Files Read</span>
         <span className="font-bold flex items-center gap-1 text-purple-700 animate-pulse">
            <ShieldAlert className="w-2 h-2" /> 
            {readFiles.size >= totalLoreCount ? (currentPath.includes('RESTRICTED') ? 'CRITICAL_BREACH_DETECTED' : 'READY_FOR_RESTRICTED_FOLDER') : 'ROOT_ACCESS: ACTIVE'}
         </span>
      </div>
    </div>
  );
};

export default FilesApp;
