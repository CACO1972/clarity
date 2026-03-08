
import React from 'react';
import { Eye, PlayCircle, Clock, Activity, Zap, PieChart } from 'lucide-react';
import { PatientEngagementStats } from '../services/communicationService';
import { Marker } from '../types';

interface AnalyticsDashboardProps {
  stats: PatientEngagementStats;
  markers: Marker[];
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ stats, markers }) => {
  const p4Counts = markers.reduce((acc, m) => {
    acc[m.p4_category] = (acc[m.p4_category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalMarkers = markers.length || 1;

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-white p-8 md:p-10 rounded-[3rem] shadow-xl border border-slate-100 relative overflow-hidden group">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors duration-700" />
        
        <div className="flex justify-between items-center mb-8 relative z-10">
          <div>
            <h3 className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase mb-1">Trazabilidad y Compromiso</h3>
            <p className="text-xl font-black text-slate-900 tracking-tight">Interacción del Paciente en Vivo</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-full border border-emerald-100">
            <Activity size={12} className="text-emerald-500" />
            <span className="text-[9px] font-black text-emerald-600 uppercase">En Vivo</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {/* Opens Stat */}
          <div className="p-6 bg-blue-50/50 rounded-[2rem] border border-blue-100/50 hover:bg-white hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                <Eye size={18} />
              </div>
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Acceso al Portal</p>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-black text-slate-900">{stats.opens}</p>
              <p className="text-xs font-bold text-slate-400">Vistas Totales</p>
            </div>
            <p className="text-[9px] text-blue-400 font-bold mt-2 flex items-center gap-1">
               <Zap size={10} className="fill-blue-400" /> +2 desde el último inicio
            </p>
          </div>
          
          {/* Video Plays Stat */}
          <div className="p-6 bg-purple-50/50 rounded-[2rem] border border-purple-100/50 hover:bg-white hover:shadow-lg hover:shadow-purple-500/5 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600">
                <PlayCircle size={18} />
              </div>
              <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest">Reproducciones Video P4</p>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-black text-slate-900">{stats.videoPlays}</p>
              <p className="text-xs font-bold text-slate-400">Clips Reproducidos</p>
            </div>
            <p className="text-[9px] text-purple-400 font-bold mt-2">Muy interesado en: Pieza 2.4</p>
          </div>

          {/* Time on RX Stat */}
          <div className="p-6 bg-emerald-50/50 rounded-[2rem] border border-emerald-100/50 hover:bg-white hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                <Clock size={18} />
              </div>
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Interacción RX</p>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-black text-slate-900">{stats.timeOnImage}</p>
              <p className="text-xs font-bold text-slate-400">Min. Promedio</p>
            </div>
            <p className="text-[9px] text-emerald-400 font-bold mt-2">Activo {stats.lastAccessed}</p>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] font-medium text-slate-400 italic">
            Webhook activo: Seguimiento en tiempo real del paciente 001-A (Juan Pérez)
          </p>
          <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-700 transition-colors">
            Ver Registros Detallados de Sesión
          </button>
        </div>
      </div>

      {/* P4 Distribution Chart */}
      <div className="bg-slate-900 p-8 md:p-10 rounded-[3rem] shadow-xl border border-white/5 relative overflow-hidden group">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
            <PieChart size={18} />
          </div>
          <h3 className="text-[10px] font-black text-blue-400 tracking-[0.2em] uppercase">Balance de Estrategia P4</h3>
        </div>

        <div className="space-y-6">
          {[
            { label: 'Predictiva', key: 'Predictive', color: 'bg-blue-500' },
            { label: 'Preventiva', key: 'Preventive', color: 'bg-emerald-500' },
            { label: 'Personalizada', key: 'Personalized', color: 'bg-orange-500' },
            { label: 'Participativa', key: 'Participatory', color: 'bg-purple-500' },
          ].map((item) => {
            const count = p4Counts[item.key] || 0;
            const percentage = (count / totalMarkers) * 100;
            return (
              <div key={item.key} className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                  <span className="text-slate-400">{item.label}</span>
                  <span className="text-white">{Math.round(percentage)}%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${item.color} transition-all duration-1000`} 
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 pt-6 border-t border-white/5">
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
            Alineación clínica con estándares de Medicina P4: <span className="text-emerald-400">Óptima</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
