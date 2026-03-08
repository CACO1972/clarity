
import React from 'react';
import { ChevronRight } from 'lucide-react';

const Arrow = () => (
  <div className="hidden lg:flex items-center text-white/10 animate-pulse">
    <ChevronRight size={24} strokeWidth={3} />
  </div>
);

const ClarityDiagram: React.FC = () => {
  return (
    <div className="bg-[#05070A] p-8 md:p-12 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden group mb-12">
      {/* 1. FLUJO HORIZONTAL */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
        
        {/* CAPA 1: DATOS (Predictive + Personalized) */}
        <div className="flex flex-col items-center group/item transition-transform hover:-translate-y-1">
          <div className="flex gap-1.5 mb-3">
            <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]"></div> {/* Azul - Predictive */}
            <div className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_8px_#f97316]"></div> {/* Naranja - Personalized */}
          </div>
          <div className="w-40 h-24 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-center p-4 group-hover/item:border-blue-500/50 transition-all duration-300">
            <span className="text-[11px] font-bold tracking-[0.2em] text-white uppercase">Datos</span>
          </div>
        </div>

        <Arrow />

        {/* CAPA 2: MODELOS DE RIESGO (Predictive + Preventive) */}
        <div className="flex flex-col items-center group/item transition-transform hover:-translate-y-1">
          <div className="flex gap-1.5 mb-3">
            <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]"></div> {/* Azul - Predictive */}
            <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div> {/* Verde - Preventive */}
          </div>
          <div className="w-40 h-24 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-center p-4 group-hover/item:border-emerald-500/50 transition-all duration-300">
            <span className="text-[11px] font-bold tracking-[0.2em] text-white uppercase">Modelos de Riesgo</span>
          </div>
        </div>

        <Arrow />

        {/* CAPA 3: MOTOR CAUSAL (Preventive + Personalized) */}
        <div className="flex flex-col items-center group/item transition-transform hover:-translate-y-1">
          <div className="flex gap-1.5 mb-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div> {/* Verde - Preventive */}
            <div className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_8px_#f97316]"></div> {/* Naranja - Personalized */}
          </div>
          <div className="w-40 h-24 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-center p-4 group-hover/item:border-orange-500/50 transition-all duration-300">
            <span className="text-[11px] font-bold tracking-[0.2em] text-white uppercase">Motor Causal</span>
          </div>
        </div>

        <Arrow />

        {/* CAPA 4: CLARITY COPILOTO (Predictive + Personalized + Participatory) */}
        <div className="flex flex-col items-center group/item scale-105 lg:scale-110 transition-transform hover:-translate-y-1">
          <div className="flex gap-1.5 mb-3">
            <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]"></div> {/* Azul - Predictive */}
            <div className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_8px_#f97316]"></div> {/* Naranja - Personalized */}
            <div className="w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_8px_#a855f7]"></div> {/* Violeta - Participatory */}
          </div>
          <div className="w-44 h-28 bg-blue-600/10 border border-blue-500/30 backdrop-blur-xl rounded-2xl flex items-center justify-center text-center p-4 shadow-[0_0_30px_rgba(59,130,246,0.1)] group-hover/item:border-blue-400 transition-all duration-300">
            <span className="text-[11px] font-black tracking-[0.2em] text-blue-400 uppercase">Clarity Copilot</span>
          </div>
        </div>

        <Arrow />

        {/* CAPA 5: PACIENTE (Preventive + Participatory) */}
        <div className="flex flex-col items-center group/item transition-transform hover:-translate-y-1">
          <div className="flex gap-1.5 mb-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div> {/* Verde - Preventive */}
            <div className="w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_8px_#a855f7]"></div> {/* Violeta - Participatory */}
          </div>
          <div className="w-40 h-24 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-center p-4 group-hover/item:border-purple-500/50 transition-all duration-300">
            <span className="text-[11px] font-bold tracking-[0.2em] text-white uppercase">Paciente</span>
          </div>
        </div>

      </div>

      {/* 2. LEYENDA TÉCNICA (PIE DE DIAGRAMA) */}
      <div className="mt-16 flex flex-wrap justify-center gap-6 md:gap-8 border-t border-white/5 pt-8">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Predictive</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Preventive</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-orange-500"></div>
          <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Personalized</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-purple-500"></div>
          <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Participatory</span>
        </div>
      </div>

      <div className="text-center mt-10">
        <p className="text-slate-400 text-xs md:text-sm font-medium leading-relaxed italic max-w-2xl mx-auto px-4">
          “Clarity Copilot clínico = implementación de P4 medicine en odontología e implantología: del dato crudo a la decisión compartida y preventiva, personalizada para cada paciente.”
        </p>
      </div>
    </div>
  );
};

export default ClarityDiagram;
