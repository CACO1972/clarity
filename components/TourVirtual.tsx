
import React, { useState, useEffect } from 'react';
import { X, Zap, Loader2, Play, Download, Sparkles, AlertCircle } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface TourVirtualProps {
  isOpen: boolean;
  onClose: () => void;
}

const TourVirtual: React.FC<TourVirtualProps> = ({ isOpen, onClose }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    const checkKey = async () => {
      // @ts-ignore
      if (window.aistudio?.hasSelectedApiKey) {
        // @ts-ignore
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasApiKey(selected);
      }
    };
    if (isOpen) checkKey();
  }, [isOpen]);

  const handleOpenKeySelector = async () => {
    // @ts-ignore
    if (window.aistudio?.openSelectKey) {
      // @ts-ignore
      await window.aistudio.openSelectKey();
      setHasApiKey(true);
    }
  };

  const generateTourVideo = async () => {
    setIsGenerating(true);
    setError(null);
    setStatus("Iniciando motor de video Veo...");

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const prompt = "A cinematic 10-second virtual tour of the 'Clarity Copilot' dental app. A sleek dark interface with a glowing blue panoramic X-ray being analyzed by AI. Transition to 3D dental models and predictive health graphs. Elegant 'CLINICA MIRO' branding in the corner. Professional, futuristic medical technology aesthetic.";

      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9'
        }
      });

      setStatus("Generando frames cinemáticos (esto puede tardar 1-2 minutos)...");

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      
      if (downloadLink) {
        setStatus("Descargando video final...");
        const response = await fetch(downloadLink, {
          method: 'GET',
          headers: {
            'x-goog-api-key': process.env.API_KEY || '',
          },
        });
        
        if (!response.ok) throw new Error("Error al descargar el video");
        
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
      } else {
        throw new Error("No se pudo obtener el enlace de descarga");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error al generar el video. Asegúrate de tener una API Key válida.");
      if (err.message?.includes("Requested entity was not found")) {
          setHasApiKey(false);
      }
    } finally {
      setIsGenerating(false);
      setStatus("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-3xl bg-white rounded-[3.5rem] shadow-2xl overflow-hidden border border-white/10">
        
        {/* Header */}
        <div className="flex justify-between items-center p-10 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
              <Zap size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Generador de Contenido RRSS</p>
              <h2 className="text-2xl font-black text-slate-900 uppercase italic">Tour Virtual Clarity</h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-10 pt-0 space-y-8">
          {!videoUrl ? (
            <div className="bg-slate-50 rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center space-y-6 border border-dashed border-slate-200">
              {isGenerating ? (
                <>
                  <div className="relative">
                    <Loader2 size={64} className="animate-spin text-indigo-600" />
                    <Sparkles className="absolute -top-2 -right-2 text-amber-500 animate-pulse" size={24} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-black text-slate-900 uppercase tracking-tight">{status}</p>
                    <p className="text-sm text-slate-500 font-medium">Estamos creando una pieza de alta calidad para tus redes sociales.</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-indigo-600 shadow-xl border border-slate-100">
                    <Play size={32} fill="currentColor" />
                  </div>
                  <div className="max-w-md space-y-4">
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Crea tu Video de Impacto</h3>
                    <p className="text-slate-500 font-medium leading-relaxed">
                      Genera un tour virtual cinemático de 10 segundos impulsado por IA (Veo) para mostrar Clarity Copilot en Instagram, TikTok o LinkedIn.
                    </p>
                  </div>

                  {!hasApiKey ? (
                    <div className="space-y-4 w-full max-w-xs">
                        <button 
                            onClick={handleOpenKeySelector}
                            className="w-full bg-amber-500 text-white px-8 py-5 rounded-2xl font-black text-xs flex items-center justify-center gap-3 shadow-xl shadow-amber-500/20 hover:bg-amber-600 transition-all active:scale-95"
                        >
                            <Sparkles size={18} /> CONFIGURAR API KEY (PAGO)
                        </button>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                            Requiere una API Key de Google Cloud con facturación activa.
                        </p>
                    </div>
                  ) : (
                    <button 
                        onClick={generateTourVideo}
                        className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black text-xs flex items-center justify-center gap-3 shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all active:scale-95"
                    >
                        GENERAR VIDEO TOUR <Zap size={18} />
                    </button>
                  )}
                </>
              )}

              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-xs font-bold">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6 animate-in zoom-in-95 duration-500">
              <div className="aspect-video bg-black rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
                <video 
                  src={videoUrl} 
                  controls 
                  autoPlay 
                  loop 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex gap-4">
                <a 
                  href={videoUrl} 
                  download="Clarity_Tour_Virtual.mp4"
                  className="flex-1 bg-slate-900 text-white py-5 rounded-2xl font-black text-xs flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl"
                >
                  <Download size={18} /> DESCARGAR PARA RRSS
                </a>
                <button 
                  onClick={() => setVideoUrl(null)}
                  className="px-8 py-5 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs hover:bg-slate-200 transition-all"
                >
                  GENERAR OTRO
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-10 pt-0 flex justify-between items-center text-[9px] font-black text-slate-400 uppercase tracking-widest">
            <span>Powered by Google Veo 3.1</span>
            <span>Clarity Copilot x Clínica Miro</span>
        </div>
      </div>
    </div>
  );
};

export default TourVirtual;
