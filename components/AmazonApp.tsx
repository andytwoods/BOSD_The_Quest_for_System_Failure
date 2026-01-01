
import React, { useState } from 'react';
import { X, ShoppingCart, Package, Zap, Clock, Bug, Skull, AlertCircle, Search } from 'lucide-react';

interface AmazonItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: any;
  color: string;
}

interface AmazonAppProps {
  onClose: () => void;
  timeLeft: number;
  onPurchase: (item: AmazonItem) => void;
}

const AmazonApp: React.FC<AmazonAppProps> = ({ onClose, timeLeft, onPurchase }) => {
  const [search, setSearch] = useState('');
  
  const items: AmazonItem[] = [
    {
      id: 'chaos_pack',
      name: 'Chaos Popup Bundle',
      description: 'Instantly spawn 5 critical system warnings. Pure desktop clutter.',
      cost: 20,
      icon: AlertCircle,
      color: 'text-orange-500'
    },
    {
      id: 'time_freeze',
      name: 'Stall.sys Chrono-Buff',
      description: 'Pause the countdown for 15 seconds. Think of it as a nap for the CPU.',
      cost: 40,
      icon: Clock,
      color: 'text-blue-400'
    },
    {
      id: 'damage_boost',
      name: 'Kernel Overdrive 2.0',
      description: 'Double your damage output for the next boss encounter.',
      cost: 60,
      icon: Zap,
      color: 'text-yellow-400'
    },
    {
      id: 'random_boss',
      name: 'Boss Lure (Mystery Box)',
      description: 'Forcibly summons a random boss entity from the Dark Web.',
      cost: 80,
      icon: Bug,
      color: 'text-green-500'
    },
    {
      id: 'void_portal',
      name: 'Void Portal Key',
      description: 'Instantly takes you to the Glitch Boss. Very dangerous.',
      cost: 120,
      icon: Skull,
      color: 'text-red-600'
    }
  ];

  const filteredItems = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-white border-2 border-gray-300 shadow-2xl z-[70] flex flex-col font-sans rounded-sm overflow-hidden animate-in zoom-in-95 duration-200">
      <div className="bg-[#232f3e] text-white p-2 flex items-center justify-between">
        <div className="flex items-center gap-4 px-2">
            <div className="flex flex-col leading-none">
                <span className="text-xl font-black italic tracking-tighter">amazon<span className="text-orange-400 font-normal">.sys</span></span>
                <div className="h-1 w-full bg-orange-400 rounded-full" style={{ borderRadius: '0 0 50% 50%', height: '3px' }} />
            </div>
            <div className="flex items-center gap-1 bg-white/10 rounded-sm px-2 py-1 text-[10px] font-bold">
                <ShoppingCart className="w-3 h-3" />
                <span>Cart (0)</span>
            </div>
        </div>
        <button onClick={onClose} className="hover:bg-white/10 p-1 rounded transition-colors">
          <X className="w-4 h-4 text-white" />
        </button>
      </div>

      <div className="bg-[#37475a] text-white px-4 py-2 flex items-center gap-6 text-[11px] font-bold overflow-hidden whitespace-nowrap">
        <span className="flex items-center gap-1"><Package className="w-3 h-3" /> Deliver to: Kernel_0x7F</span>
        <span>Today's System Sabotage</span>
        <span>Customer Service (Dead)</span>
        <span>Registry</span>
        <span>Sell Your Data</span>
      </div>

      <div className="bg-[#232f3e] p-2 flex gap-1">
        <div className="bg-gray-100 rounded-l-sm px-2 flex items-center text-[10px] text-gray-500 font-bold border-r border-gray-300">All</div>
        <input 
            type="text" 
            placeholder="Search Amazon.sys for destructive items"
            className="flex-1 py-1 px-3 text-xs focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
        />
        <button className="bg-orange-400 hover:bg-orange-500 px-4 rounded-r-sm flex items-center">
            <Search className="w-4 h-4 text-[#232f3e]" />
        </button>
      </div>

      <div className="flex-1 bg-gray-100 overflow-y-auto p-4 flex flex-col gap-4">
        <div className="bg-white p-3 border border-gray-300 rounded shadow-sm flex justify-between items-center">
            <h2 className="text-sm font-bold">Balance: <span className="text-orange-600">{timeLeft}s</span> <span className="text-gray-400 font-normal text-xs">(Available Seconds)</span></h2>
            <p className="text-[10px] text-gray-500 italic">"Items are delivered instantly via buffer overflow."</p>
        </div>

        <div className="grid grid-cols-1 gap-3">
            {filteredItems.map(item => (
                <div key={item.id} className="bg-white border border-gray-300 p-4 rounded shadow-sm flex gap-4 group">
                    <div className={`w-20 h-20 bg-gray-50 border rounded flex items-center justify-center transition-transform group-hover:scale-110 ${item.color}`}>
                        <item.icon className="w-10 h-10" />
                    </div>
                    <div className="flex-1 flex flex-col">
                        <h3 className="text-sm font-bold text-blue-800 hover:text-orange-600 cursor-pointer">{item.name}</h3>
                        <p className="text-[11px] text-gray-600 mt-1">{item.description}</p>
                        <div className="mt-auto flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-orange-700">Cost: {item.cost}s</span>
                                <span className="text-[9px] text-green-700 font-bold italic">FREE Delivery by Instability</span>
                            </div>
                            <button 
                                onClick={() => onPurchase(item)}
                                disabled={timeLeft < item.cost}
                                className={`px-4 py-1.5 rounded-full text-[10px] font-bold shadow-sm transition-all ${
                                    timeLeft >= item.cost 
                                    ? 'bg-gradient-to-b from-yellow-300 to-yellow-500 border border-yellow-600 hover:brightness-110 active:scale-95' 
                                    : 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
                                }`}
                            >
                                Add to Cart & Buy
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>

      <div className="bg-white border-t p-2 flex justify-center gap-10 text-[9px] text-gray-500">
          <span>Conditions of Use</span>
          <span>Privacy Notice</span>
          <span>Your Ads Privacy Choices</span>
          <span>© 1996-2025, Amazon.sys, Inc.</span>
      </div>
    </div>
  );
};

export default AmazonApp;
