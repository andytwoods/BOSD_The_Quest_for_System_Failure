
import React, { useRef, useState, useEffect } from 'react';
import { X, Eraser, Pen, Palette, Save, Rocket, Sparkles, Loader2 } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { CustomApp, BossStats } from '../types';

interface MSPaintProps {
  onClose: () => void;
  onAchievement: () => void;
  isArtist: boolean;
  onSaveApp: (app: CustomApp) => void;
}

const MSPaint: React.FC<MSPaintProps> = ({ onClose, onAchievement, isArtist, onSaveApp }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#0078d7');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const colors = isArtist 
    ? ['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#800000', '#808000', '#008000', '#800080', '#008080', '#000080', '#0078d7', '#f59e0b', '#10b981', '#6366f1']
    : ['#0078d7', '#ffffff'];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineWidth = 5;
        ctx.strokeStyle = color;
      }
    }
  }, [color]);

  const startDrawing = (e: React.MouseEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.beginPath();
    }
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      const rect = canvas.getBoundingClientRect();
      ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
      ctx.stroke();
    }
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const checkAchievement = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    setIsChecking(true);
    const dataUrl = canvas.toDataURL('image/png');
    const base64Data = dataUrl.split(',')[1];

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            { inlineData: { data: base64Data, mimeType: 'image/png' } },
            { text: "Does this drawing depict a Blue Unhappy Face (colon and open parenthesis like ':(')? Respond ONLY with JSON: { 'isUnhappyFace': boolean }" }
          ]
        },
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
                isUnhappyFace: { type: Type.BOOLEAN }
            },
            required: ['isUnhappyFace']
          }
        }
      });

      const result = JSON.parse(response.text || '{}');
      if (result.isUnhappyFace) {
        onAchievement();
      }
    } catch (error) {
      console.error("AI check failed", error);
    } finally {
      setIsChecking(false);
    }
  };

  const synthesizeApp = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    setIsSynthesizing(true);
    const dataUrl = canvas.toDataURL('image/png');
    const base64Data = dataUrl.split(',')[1];

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            { inlineData: { data: base64Data, mimeType: 'image/png' } },
            { text: "Analyze this drawing. If it looks like a monster, virus, or creature, describe it as a virus boss. Respond with JSON: { 'isBoss': boolean, 'name': string, 'hp': number, 'speed': 'low'|'med'|'high', 'description': string }. If it is not a creature, set isBoss to false." }
          ]
        },
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
                isBoss: { type: Type.BOOLEAN },
                name: { type: Type.STRING },
                hp: { type: Type.NUMBER },
                speed: { type: Type.STRING, description: 'low, med, or high' },
                description: { type: Type.STRING }
            },
            required: ['isBoss', 'name', 'hp', 'speed', 'description']
          }
        }
      });

      const data = JSON.parse(response.text || '{}');
      const newApp: CustomApp = {
        id: Date.now().toString(),
        name: data.name || 'Untitled.exe',
        type: data.isBoss ? 'boss' : 'image',
        iconData: dataUrl,
        bossStats: data.isBoss ? {
            hp: data.hp || 1000,
            maxHp: data.hp || 1000,
            name: data.name,
            speed: data.speed as any || 'med',
            projectileType: 'custom',
            description: data.description
        } : undefined
      };

      onSaveApp(newApp);
    } catch (error) {
      console.error("Synthesis failed", error);
    } finally {
      setIsSynthesizing(false);
    }
  };

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-[#dfdfdf] border-2 border-white border-r-gray-500 border-b-gray-500 shadow-xl z-[60] flex flex-col font-sans">
      <div className="bg-[#000080] text-white p-1 flex justify-between items-center cursor-move">
        <span className="text-xs px-2 font-bold flex items-center gap-2">
            <Palette className="w-3 h-3" /> System Paint - {isArtist ? 'Artist Edition' : 'Standard'}
        </span>
        <button onClick={onClose} className="bg-[#dfdfdf] text-black px-1 leading-none border border-white border-r-gray-800 border-b-gray-800 hover:bg-gray-300">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 flex p-2 gap-2 overflow-hidden bg-[#dfdfdf]">
        <div className="w-16 bg-gray-300 border border-white border-r-gray-500 border-b-gray-500 flex flex-col gap-2 p-1 overflow-y-auto items-center">
          <button onClick={() => setColor('#0078d7')} className={`p-1 w-8 h-8 rounded-sm ${color === '#0078d7' ? 'bg-blue-400 ring-2 ring-white' : 'bg-blue-700'}`} />
          <button onClick={() => setColor('#ffffff')} className={`p-1 w-8 h-8 rounded-sm border border-gray-400 ${color === '#ffffff' ? 'bg-gray-100 ring-2 ring-blue-500' : 'bg-white'}`} />
          
          <div className="w-full h-0.5 bg-gray-400 my-1" />
          
          {colors.slice(2).map(c => (
            <button 
                key={c}
                onClick={() => setColor(c)} 
                className={`w-6 h-6 rounded-sm transition-transform active:scale-90`}
                style={{ backgroundColor: c, border: color === c ? '2px solid white' : '1px solid #999' }}
            />
          ))}

          <button onClick={() => setColor('transparent')} className="p-1 hover:bg-gray-400 mt-auto" title="Erase"><Eraser className="w-5 h-5 text-gray-700" /></button>
          <button onClick={clear} className="p-1 hover:bg-gray-400" title="Clear Canvas"><X className="w-5 h-5 text-red-600" /></button>
        </div>

        <div className="flex-1 bg-white border-2 border-inset overflow-hidden shadow-inner cursor-crosshair">
          <canvas 
            ref={canvasRef}
            width={510}
            height={380}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseOut={stopDrawing}
            className="w-full h-full"
          />
        </div>
      </div>

      <div className="p-2 border-t border-gray-400 flex justify-between items-center bg-gray-300">
        <div className="flex items-center gap-2">
            {!isArtist ? (
                <button 
                    disabled={isChecking}
                    onClick={checkAchievement}
                    className="bg-[#dfdfdf] px-3 py-1 text-xs border border-white border-r-gray-800 border-b-gray-800 hover:bg-gray-200 active:bg-gray-400 disabled:opacity-50 flex items-center gap-2"
                >
                {isChecking ? <Loader2 className="w-3 h-3 animate-spin"/> : <Sparkles className="w-3 h-3 text-blue-600"/>}
                Check for Secrets
                </button>
            ) : (
                <span className="text-[10px] text-blue-800 font-bold uppercase flex items-center gap-1">
                    <Sparkles className="w-3 h-3"/> Artist Unlocked
                </span>
            )}
        </div>
        
        <div className="flex gap-2">
            <button 
                disabled={isSynthesizing}
                onClick={synthesizeApp}
                className="bg-blue-600 text-white px-4 py-1 text-xs font-bold border border-blue-400 hover:bg-blue-500 active:scale-95 disabled:opacity-50 flex items-center gap-2 rounded-sm shadow-md"
            >
              {isSynthesizing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Rocket className="w-3 h-3" />}
              Save as App.exe
            </button>
        </div>
      </div>
    </div>
  );
};

export default MSPaint;
