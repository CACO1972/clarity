
import React from 'react';
import { HeartPulse, ShieldAlert, CheckCircle2, Star, Sparkles, User as UserIcon, ShieldCheck, Activity, Clock } from 'lucide-react';
import PanoramicViewer from './PanoramicViewer';
import { Marker } from '../types';

interface PatientViewProps {
  onBack: () => void;
  analysis: any;
  markers: Marker[];
  patientName?: string;
  profilePhoto?: string;
}

const PatientView: React.FC<PatientViewProps> = ({ onBack, analysis, markers, patientName = "Juan Pérez", profilePhoto }) => {
  const totalPrice = markers.reduce((sum, m) => sum + m.price, 0);

  return (
    <div className="bg-[#05070a] min-h-screen text-slate-200 selection:bg-blue-500/30 font-sans">
      {/* Premium Header Nav */}
      <nav className="p-6 md:p-8 border-b border-white/5 flex justify-between items-center bg-black/40 backdrop-blur-3xl sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-white italic">C</div>
          <div className="tracking-[0.4em] font-black text-white text-xs md:text-sm uppercase">CLARITY<span className="text-blue-500">PLAN</span></div>
        </div>
        <button 
          onClick={onBack} 
          className="px-4 py-2 border border-white/10 rounded-full text-[10px] font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all"
        >
          CONSOLA DOCTOR
        </button>
      </nav>

      <main className="max-w-5xl mx-auto p-6 space-y-16 pb-40 pt-10">
        
        {/* Patient Profile Header Section */}
        <section className="animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="bg-gradient-to-r from-blue-600/10 to-transparent border border-white/10 p-8 md:p-10 rounded-[3rem] backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/10 transition-colors duration-700" />
            
            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
              {/* Profile Photo / Avatar */}
              <div className="relative">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2.5rem] bg-slate-800 border-2 border-white/10 overflow-hidden shadow-2xl flex items-center justify-center group-hover:border-blue-500/50 transition-all duration-500">
                  {profilePhoto ? (
                    <img src={profilePhoto} alt={patientName} className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon size={48} className="text-slate-600" />
                  )}
                </div>
                {/* Verified Badge */}
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 rounded-2xl border-4 border-[#05070a] flex items-center justify-center text-white shadow-lg">
                  <ShieldCheck size={20} />
                </div>
              </div>

              {/* Patient Info */}
              <div className="text-center md:text-left space-y-2">
                <div className="flex items-center justify-center md:justify-start gap-2 text-blue-400 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Registro Seguro Verificado</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase">{patientName}</h2>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    ID: {Math.random().toString(36).substring(7).toUpperCase()}
                  </div>
                  <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                    Plan Activo
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Welcome Section */}
        <header className="space-y-6 animate-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest">
            <Sparkles size={12} /> Plan de Cuidado Predictivo
          </div>
          <h1 className="text-5xl md:text-7xl font-semibold text-white tracking-tighter leading-[0.9] max-w-3xl">
            Tu Sonrisa,<br/><span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">Control Predictivo.</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-xl font-light leading-relaxed">
            Impulsado por el motor causal Clarity Copilot. Hemos mapeado tu evidencia clínica para diseñar un plan de tratamiento preparado para el futuro.
          </p>
        </header>

        {/* P4 Journey Section */}
        <section className="space-y-10">
          <div className="text-center space-y-2">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">La Metodología P4</h3>
            <h2 className="text-4xl font-black text-white tracking-tight">Tu Viaje de Salud Personalizado</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                title: 'Predictiva', 
                desc: 'Mapeo de riesgos impulsado por IA de tu salud ósea y tisular para los próximos 5 años.',
                icon: <Activity size={24} />,
                color: 'text-blue-400',
                bg: 'bg-blue-400/10',
                border: 'border-blue-400/20'
              },
              { 
                title: 'Preventiva', 
                desc: 'Estrategias de intervención temprana para evitar la pérdida ósea y la migración de dientes adyacentes.',
                icon: <ShieldCheck size={24} />,
                color: 'text-emerald-400',
                bg: 'bg-emerald-400/10',
                border: 'border-emerald-400/20'
              },
              { 
                title: 'Personalizada', 
                desc: 'Tratamientos adaptados a tu anatomía específica y perfil de respuesta biológica.',
                icon: <Sparkles size={24} />,
                color: 'text-orange-400',
                bg: 'bg-orange-400/10',
                border: 'border-orange-400/20'
              },
              { 
                title: 'Participativa', 
                desc: 'Acceso en tiempo real a tus datos clínicos y herramientas de toma de decisiones compartida.',
                icon: <UserIcon size={24} />,
                color: 'text-purple-400',
                bg: 'bg-purple-400/10',
                border: 'border-purple-400/20'
              }
            ].map((p, i) => (
              <div key={i} className={`p-8 rounded-[2.5rem] border ${p.border} ${p.bg} space-y-4 hover:scale-105 transition-transform duration-300`}>
                <div className={`${p.color}`}>{p.icon}</div>
                <h4 className="text-xl font-bold text-white tracking-tight">{p.title}</h4>
                <p className="text-slate-400 text-sm font-light leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Visual Evidence Section - Interactive Panoramic Viewer */}
        <section className="animate-in fade-in duration-1000">
           <PanoramicViewer findings={markers} />
        </section>

        {/* Gemini Analysis Block */}
        {analysis && (
          <section className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 p-10 rounded-[2.5rem] bg-gradient-to-br from-blue-600/10 to-transparent border border-white/10 space-y-4">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                <CheckCircle2 className="text-blue-500" />
                El Veredicto Clarity
              </h3>
              <p className="text-slate-300 text-lg font-light italic leading-relaxed">
                "{analysis.patientExplanation}"
              </p>
            </div>
            <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 flex flex-col justify-center items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center">
                 <ShieldAlert className="text-blue-400" size={32} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-500">Perfil de Riesgo</p>
                <p className="text-2xl font-black text-white">{analysis.riskLevel}</p>
              </div>
            </div>
          </section>
        )}

        {/* P4 Comparative Analysis */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="group p-10 rounded-[3rem] bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-500">
            <HeartPulse className="text-emerald-500 mb-6 group-hover:scale-110 transition-transform" size={40} />
            <h3 className="text-2xl font-bold text-white mb-4">El Camino de la Estabilidad</h3>
            <p className="text-slate-400 font-light leading-relaxed">
              {analysis?.prevention || "Al actuar ahora, aseguramos la integridad de tu hueso maxilar y prevenimos la migración de dientes adyacentes. Retención funcional 100% garantizada."}
            </p>
          </div>
          <div className="group p-10 rounded-[3rem] bg-gradient-to-br from-red-500/5 to-transparent border border-red-500/10 opacity-70 hover:opacity-100 transition-all duration-500">
            <ShieldAlert className="text-red-500 mb-6 group-hover:scale-110 transition-transform" size={40} />
            <h3 className="text-2xl font-bold text-white mb-4">Riesgo de Inacción</h3>
            <p className="text-slate-400 font-light leading-relaxed">
              {analysis?.prediction || "Retrasar el tratamiento por más de 6 meses provocará un 15% de reabsorción ósea, lo que requerirá una cirugía regenerativa más compleja y costosa más adelante."}
            </p>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 text-center">Desglose de la Inversión</h4>
            <div className="space-y-4 max-w-3xl mx-auto">
                {markers.map((m) => (
                    <div key={m.id} className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 hover:border-blue-500/30 transition-all duration-500 group/item">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h5 className="text-xl font-bold text-white group-hover/item:text-blue-400 transition-colors">{m.treatment}</h5>
                                <div className="flex gap-3 mt-2">
                                  <span className="text-[10px] font-black uppercase text-blue-400 tracking-widest bg-blue-400/10 px-2 py-0.5 rounded-md">{m.p4_category}</span>
                                  {m.durationEstimate && (
                                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-1">
                                      <Clock size={10} /> {m.durationEstimate}
                                    </span>
                                  )}
                                </div>
                            </div>
                            <span className="text-2xl font-black text-white">${m.price.toLocaleString()}</span>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-8 pt-6 border-t border-white/5">
                          {m.detailedDescription && (
                            <div className="space-y-2">
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Resumen Clínico</p>
                              <p className="text-sm text-slate-400 font-light leading-relaxed">{m.detailedDescription}</p>
                            </div>
                          )}
                          {m.followUpCareInstructions && (
                            <div className="space-y-2">
                              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">Protocolo de Recuperación</p>
                              <p className="text-sm text-slate-400 font-light leading-relaxed italic">"{m.followUpCareInstructions}"</p>
                            </div>
                          )}
                        </div>
                    </div>
                ))}
                {markers.length === 0 && (
                  <p className="text-center text-slate-500 italic py-10">Aún no hay tratamientos específicos mapeados para esta evidencia.</p>
                )}
            </div>
        </div>
      </main>

      {/* Floating Action Bar */}
      <footer className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-4xl p-6 bg-white/10 backdrop-blur-3xl border border-white/20 rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6 z-50">
        <div className="text-center md:text-left">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inversión Total Recomendada</span>
          <p className="text-4xl font-black text-white">${totalPrice.toLocaleString()}<span className="text-sm font-medium text-slate-500 ml-1">USD</span></p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
             <button className="flex-1 md:flex-none px-8 py-5 bg-white text-black rounded-2xl font-black hover:bg-slate-200 transition-all shadow-xl shadow-white/5 active:scale-95">
                GUARDAR PDF
             </button>
             <button className="flex-1 md:flex-none px-12 py-5 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20 active:scale-95">
                APROBAR PLAN
             </button>
        </div>
      </footer>
    </div>
  );
};

export default PatientView;
