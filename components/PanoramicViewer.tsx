
import React from 'react';
import { Play, Info, AlertTriangle } from 'lucide-react';
import { Marker } from '../types';

interface PanoramicViewerProps {
  findings?: Marker[];
}

const PanoramicViewer: React.FC<PanoramicViewerProps> = ({ findings = [] }) => {
  return (
    <div className="bg-[#0A0B0D] p-6 md:p-10 rounded-[3rem] border border-white/10 shadow-2xl space-y-8">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-black shadow-2xl aspect-video md:aspect-[21/9]">
        
        {/* THE PANORAMIC X-RAY (The engine background) */}
        <img 
          src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=1600" 
          className="w-full h-full object-cover opacity-50 grayscale contrast-125 brightness-75 hover:opacity-70 transition-all duration-500"
          alt="Panoramic X-Ray"
        />

        {/* HOTSPOT OVERLAYS (Vertices) */}
        {findings.map((f) => (
          <div 
            key={f.id}
            className="absolute group z-20 cursor-pointer"
            style={{ top: f.y, left: f.x }}
          >
            {/* The Hotspot Point */}
            <div className={`w-4 h-4 rounded-full animate-pulse shadow-[0_0_15px_rgba(59,130,246,0.8)] 
              ${f.type === 'critical' ? 'bg-blue-500' : 'bg-amber-500'}`} 
            />

            {/* Tooltip with Clinical Logic (Appears on hover) */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 w-64 bg-black/90 backdrop-blur-xl border border-white/20 p-5 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-50 pointer-events-none group-hover:pointer-events-auto shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">
              <div className="flex justify-between items-start mb-2">
                <p className="text-[9px] font-black uppercase text-blue-400 tracking-[0.2em]">{f.p4_category}</p>
                <div className={`w-2 h-2 rounded-full ${f.type === 'critical' ? 'bg-red-500' : 'bg-amber-500'}`} />
              </div>
              <p className="text-sm font-bold text-white mb-1">{f.treatment}</p>
              <p className="text-2xl font-black text-white mb-4">${f.price.toLocaleString()}</p>
              <button className="w-full flex items-center justify-center gap-2 bg-blue-600/20 text-blue-400 text-[10px] font-black py-3 rounded-xl border border-blue-500/30 hover:bg-blue-600/40 transition-colors">
                <Play size={10} fill="currentColor" /> VER EXPLICACIÓN 3D
              </button>
            </div>
          </div>
        ))}

        {/* AI Scan Overlay Layer */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-blue-500/10 via-transparent to-transparent h-1/2 animate-scan z-10" />
        
        {/* HUD Elements */}
        <div className="absolute top-6 left-6 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Motor de Análisis Causal</span>
        </div>
      </div>

      {/* FOOTER: Clinical Risk & P4 Benefit Summary */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-red-500/5 border border-red-500/20 p-6 rounded-[2rem] flex items-start gap-4 hover:bg-red-500/10 transition-colors cursor-default">
          <div className="bg-red-500/20 p-2 rounded-lg">
            <AlertTriangle className="text-red-400" size={20} />
          </div>
          <div>
            <p className="text-red-400 text-[10px] font-black uppercase tracking-widest mb-1">Factor de Riesgo Detectado</p>
            <p className="text-sm text-slate-300 leading-relaxed italic">
              {findings.length > 0 ? `Detectados ${findings.filter(f => f.type === 'critical').length} problemas críticos que requieren intervención inmediata.` : 'No se detectaron riesgos críticos en la vista actual.'}
            </p>
          </div>
        </div>
        <div className="bg-blue-500/5 border border-blue-500/20 p-6 rounded-[2rem] flex items-start gap-4 hover:bg-blue-500/10 transition-colors cursor-default">
          <div className="bg-blue-500/20 p-2 rounded-lg">
            <Info className="text-blue-400" size={20} />
          </div>
          <div>
            <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest mb-1">Beneficio Preventivo P4</p>
            <p className="text-sm text-slate-300 leading-relaxed italic">
              La implementación del plan recomendado asegura un 100% de estabilidad arquitectónica y retención de densidad ósea.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PanoramicViewer;
