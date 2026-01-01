
import React, { useState } from 'react';
import { X, Play, Youtube, ThumbsUp, Share2, MoreHorizontal } from 'lucide-react';

interface YouTubeWindowProps {
  onClose: () => void;
}

const YouTubeWindow: React.FC<YouTubeWindowProps> = ({ onClose }) => {
  const [activeVideo, setActiveVideo] = useState<number | null>(null);

  const preloadedVideos = [
    { id: 1, title: "BOSD Speedrun (LEGIT NO CHEAT)", views: "1.2M", date: "2 days ago", color: "bg-blue-500" },
    { id: 2, title: "Unboxing my new CRT Monitor", views: "45K", date: "1 week ago", color: "bg-green-500" },
    { id: 3, title: "Top 10 Kernel Errors of 2025", views: "890K", date: "3 hours ago", color: "bg-red-500" },
    { id: 4, title: "How to fix everything (DONT CLICK)", views: "2B", date: "10 years ago", color: "bg-purple-500" }
  ];

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-white border-2 border-gray-300 shadow-2xl z-[70] flex flex-col font-sans rounded-lg overflow-hidden animate-in zoom-in-95 duration-200">
      <div className="bg-red-600 text-white p-2 flex justify-between items-center">
        <div className="flex items-center gap-2 px-2">
          <Youtube className="w-5 h-5" />
          <span className="text-sm font-bold">YouTube - System Player</span>
        </div>
        <button onClick={onClose} className="hover:bg-red-700 p-1 rounded transition-colors text-white">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-48 bg-gray-50 border-r border-gray-200 p-4 space-y-4">
          <div className="text-xs font-bold text-gray-500 uppercase">Menu</div>
          <div className="space-y-2">
            <div className="text-xs text-red-600 font-bold bg-red-50 p-2 rounded cursor-pointer">Home</div>
            <div className="text-xs text-gray-600 p-2 rounded hover:bg-gray-100 cursor-pointer">Trending</div>
            <div className="text-xs text-gray-600 p-2 rounded hover:bg-gray-100 cursor-pointer">Subscriptions</div>
          </div>
          <div className="pt-4 text-xs font-bold text-gray-500 uppercase">Library</div>
          <div className="space-y-2">
            <div className="text-xs text-gray-600 p-2 rounded hover:bg-gray-100 cursor-pointer">History</div>
            <div className="text-xs text-gray-600 p-2 rounded hover:bg-gray-100 cursor-pointer">Watch Later</div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto bg-white">
          {activeVideo === null ? (
            <>
              <h2 className="text-xl font-bold mb-6">Recommended Videos</h2>
              <div className="grid grid-cols-2 gap-6">
                {preloadedVideos.map(video => (
                  <div key={video.id} onClick={() => setActiveVideo(video.id)} className="group cursor-pointer">
                    <div className={`aspect-video ${video.color} rounded-lg mb-2 relative flex items-center justify-center overflow-hidden border border-black/5`}>
                      <div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="text-white w-6 h-6 fill-current" />
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] px-1 rounded">10:42</div>
                    </div>
                    <h3 className="text-sm font-bold line-clamp-2 leading-tight">{video.title}</h3>
                    <div className="text-[10px] text-gray-500 mt-1">System Channel • {video.views} views • {video.date}</div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <button onClick={() => setActiveVideo(null)} className="text-blue-500 text-xs font-bold hover:underline mb-2 flex items-center gap-1">
                ← Back to Browse
              </button>
              <div className={`aspect-video ${preloadedVideos.find(v => v.id === activeVideo)?.color} rounded-lg relative overflow-hidden shadow-inner flex items-center justify-center`}>
                <div className="text-white font-black text-4xl animate-pulse italic opacity-20">BAD_VIDEO_STREAMING...</div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
                  <div className="h-full bg-red-600 animate-progress-bad" style={{ width: '40%' }}></div>
                </div>
              </div>
              <div>
                <h1 className="text-lg font-bold">{preloadedVideos.find(v => v.id === activeVideo)?.title}</h1>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                  <div className="text-[10px] text-gray-500">1,234,567 views • Dec 10, 2025</div>
                  <div className="flex gap-4">
                    <button className="flex items-center gap-1 text-[10px] font-bold text-gray-600 hover:text-black">
                      <ThumbsUp className="w-3 h-3" /> LIKE
                    </button>
                    <button className="flex items-center gap-1 text-[10px] font-bold text-gray-600 hover:text-black">
                      <Share2 className="w-3 h-3" /> SHARE
                    </button>
                    <button className="flex items-center gap-1 text-[10px] font-bold text-gray-600 hover:text-black">
                      <MoreHorizontal className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex-shrink-0" />
                  <div>
                    <div className="text-xs font-bold">System Channel</div>
                    <div className="text-[10px] text-gray-500">10M subscribers</div>
                    <p className="text-[11px] mt-2 text-gray-700">This is a really high quality video that definitely isn't just a static colored block with a loading bar.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes progress-bad {
          0% { width: 0%; }
          50% { width: 40%; }
          70% { width: 38%; }
          100% { width: 40%; }
        }
        .animate-progress-bad {
          animation: progress-bad 5s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default YouTubeWindow;
