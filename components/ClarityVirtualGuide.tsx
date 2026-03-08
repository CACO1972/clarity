
import React, { useState } from 'react';
import { 
  BookOpen, ChevronRight, ChevronLeft, X, 
  Zap, Database, Eye, BarChart3, MessageSquare 
} from 'lucide-react';

interface GuideStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const GUIDE_STEPS: GuideStep[] = [
  {
    title: "Sincronización de Evidencia",
    description: "Sube archivos DICOM o Panorámicas. El motor Gemini analizará patrones óseos para generar predicciones automáticas de riesgo.",
    icon: <Database size={24} />,
    color: "text-blue-500"
  },
  {
    title: "Mapeo de Vértices P4",
    description: "Haz clic en el lienzo para marcar hallazgos. Cada punto se vincula a tu arancel de Dentalink en tiempo real mediante el buscador inteligente.",
    icon: <Zap size={24} />,
    color: "text-amber-500"
  },
  {
    title: "Estrategia de Comunicación",
    description: "Envía el plan vía WhatsApp. El sistema genera un enlace único con trazabilidad para que sepas cuándo el paciente interactúa con el plan.",
    icon: <MessageSquare size={24} />,
    color: "text-emerald-500"
  },
  {
    title: "Traceabilidad Analítica",
    description: "Monitorea el engagement. El dashboard te avisa si el paciente vio los videos explicativos o el tiempo que pasó analizando su RX.",
    icon: <BarChart3 size={24} />,
    color: "text-purple-500"
  },
  {
    title: "Experiencia del Paciente",
    description: "Tu paciente recibe un portal de lujo donde la odontología se vuelve comprensible, visual y predictiva.",
    icon: <Eye size={24} />,
    color: "text-cyan-500"
  },
  {
    title: "Tour Virtual RRSS",
    description: "Genera videos cinemáticos de 10 segundos con IA (Veo) para promocionar tu clínica en redes sociales.",
    icon: <Zap size={24} />,
    color: "text-indigo-500"
  }
];

interface ClarityVirtualGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

const ClarityVirtualGuide: React.FC<ClarityVirtualGuideProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const step = GUIDE_STEPS[currentStep];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl bg-white rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.4)] overflow-hidden border border-slate-100">
        
        {/* Header de la Guía */}
        <div className="flex justify-between items-center p-10 pb-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
              <BookOpen size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sistema de Entrenamiento</p>
              <h2 className="text-xl font-black text-slate-900 uppercase italic">Bienvenida Clarity</h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-10 pt-8 space-y-8">
          {/* Progress Dots */}
          <div className="flex gap-2">
            {GUIDE_STEPS.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentStep ? 'w-12 bg-blue-600' : 'w-4 bg-slate-100'}`}
              />
            ))}
          </div>

          {/* Step Content */}
          <div className="flex flex-col md:flex-row gap-8 items-start animate-in slide-in-from-bottom-4 duration-500">
            <div className={`w-20 h-20 rounded-[2rem] bg-slate-50 flex items-center justify-center ${step.color} shadow-sm border border-slate-100 flex-shrink-0`}>
              {step.icon}
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{step.title}</h3>
              <p className="text-slate-500 text-lg leading-relaxed font-medium">
                {step.description}
              </p>
            </div>
          </div>

          {/* Navigation Footer */}
          <div className="flex justify-between items-center pt-8 border-t border-slate-50">
            <button 
              disabled={currentStep === 0}
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors disabled:opacity-30"
            >
              <ChevronLeft size={16} /> Anterior
            </button>
            
            {currentStep < GUIDE_STEPS.length - 1 ? (
              <button 
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs flex items-center gap-3 shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95"
              >
                Siguiente <ChevronRight size={16} />
              </button>
            ) : (
              <button 
                onClick={onClose}
                className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs flex items-center gap-3 shadow-xl hover:bg-black transition-all active:scale-95"
              >
                Comenzar ahora
              </button>
            )}
          </div>
        </div>

        {/* Decorative background element */}
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      </div>
    </div>
  );
};

export default ClarityVirtualGuide;
