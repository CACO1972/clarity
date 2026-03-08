
import React, { useState, useEffect } from 'react';
import { 
  Database, Zap, Camera, Send, Check, 
  Settings, User, Bell, Search, 
  RefreshCw, FileText, Eye, Edit3, Loader2, HelpCircle,
  Upload, FileUp, AlertCircle, Clock, Sparkles, Mic
} from 'lucide-react';
import { ViewMode, Marker, ClinicalEvidence } from './types';
import { analyzeClinicalCase } from './services/geminiService';
import { sendSmartPlan, fetchInitialStats, PatientEngagementStats } from './services/communicationService';
import ClarityDiagram from './components/ClarityDiagram';
import PatientView from './components/PatientView';
import ClarityAuthoringTool from './components/ClarityAuthoringTool';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import ClarityVirtualGuide from './components/ClarityVirtualGuide';
import ClinicalChatbot from './components/ClinicalChatbot';
import VoiceConsultation from './components/VoiceConsultation';
import TourVirtual from './components/TourVirtual';

const App: React.FC = () => {
  const [view, setView] = useState<ViewMode>(ViewMode.CLINICAL);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [evidenceUploaded, setEvidenceUploaded] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showVoice, setShowVoice] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    const checkApiKey = async () => {
      // @ts-ignore
      if (window.aistudio?.hasSelectedApiKey) {
        // @ts-ignore
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasApiKey(selected);
      }
    };
    checkApiKey();
  }, []);

  const handleOpenKeySelector = async () => {
    // @ts-ignore
    if (window.aistudio?.openSelectKey) {
      // @ts-ignore
      await window.aistudio.openSelectKey();
      setHasApiKey(true);
    }
  };

  const [patientName, setPatientName] = useState("Juan Pérez");
  const [markers, setMarkers] = useState<Marker[]>([
    { 
      id: 1, x: '25%', y: '45%', treatment: 'Implante 2.4', price: 1250, type: 'critical', p4_category: 'Predictive', 
      description: '', detailedDescription: 'Colocación de implante de titanio en zona 2.4.', 
      durationEstimate: '45 min', followUpCareInstructions: 'Evitar alimentos duros por 24h.' 
    },
    { 
      id: 2, x: '65%', y: '38%', treatment: 'Corona Zirconio 1.6', price: 250, type: 'warning', p4_category: 'Preventive', 
      description: '', detailedDescription: 'Instalación de corona estética sobre pieza 1.6.', 
      durationEstimate: '30 min', followUpCareInstructions: 'Higiene normal con seda dental.' 
    }
  ]);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [evidenceList, setEvidenceList] = useState<ClinicalEvidence[]>([]);
  const [syncStep, setSyncStep] = useState<string>("");
  const [engagementStats, setEngagementStats] = useState<PatientEngagementStats>(fetchInitialStats());

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newEvidence: ClinicalEvidence = {
        id: Math.random().toString(36).substring(7),
        name: file.name,
        type: 'xray',
        url: URL.createObjectURL(file),
        timestamp: new Date().toLocaleTimeString(),
        status: 'syncing'
      };

      setEvidenceList(prev => [newEvidence, ...prev]);
      setIsSyncing(true);
      setEvidenceUploaded(true);
      
      try {
        setSyncStep("Leyendo Metadatos DICOM...");
        await new Promise(r => setTimeout(r, 800));
        
        setSyncStep("Analizando Densidad Ósea...");
        await new Promise(r => setTimeout(r, 1000));
        
        setSyncStep("Razonamiento Gemini P4...");
        const description = `Radiografía panorámica (${file.name}) que muestra evidencia clínica para el paciente ${patientName}. Enfocarse en la viabilidad del implante y la estructura ósea.`;
        const analysis = await analyzeClinicalCase(description);
        
        setAiAnalysis(analysis);
        setEvidenceList(prev => prev.map(ev => 
          ev.id === newEvidence.id ? { ...ev, status: 'completed', analysis } : ev
        ));
      } catch (error) {
        setEvidenceList(prev => prev.map(ev => 
          ev.id === newEvidence.id ? { ...ev, status: 'failed' } : ev
        ));
      } finally {
        setIsSyncing(false);
        setSyncStep("");
      }
    }
  };

  const handleSendToPatient = async () => {
    setIsSending(true);
    const success = await sendSmartPlan(patientName, "56912345678", "JP-001-A", markers);
    
    if (success) {
      setIsSent(true);
      setTimeout(() => {
        setIsSent(false);
        setIsSending(false);
      }, 3000);
    }
  };

  if (view === ViewMode.AUTHORING) {
    return (
      <ClarityAuthoringTool 
        markers={markers}
        onMarkersChange={setMarkers}
        onPreview={() => setView(ViewMode.PATIENT)}
        onBack={() => setView(ViewMode.CLINICAL)}
        aiAnalysis={aiAnalysis}
      />
    );
  }

  if (view === ViewMode.PATIENT) {
    return (
      <PatientView 
        onBack={() => setView(ViewMode.CLINICAL)} 
        analysis={aiAnalysis}
        markers={markers}
        patientName={patientName}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
      
      {/* Clínica Miro Label */}
      <div className="fixed top-6 right-8 z-[60] flex items-center gap-2">
        <div className="px-4 py-2 bg-white/80 backdrop-blur-md border border-slate-200 rounded-full shadow-sm">
          <span className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">CLINICA MIRO</span>
        </div>
      </div>

      {/* Guía Virtual Interactiva */}
      <ClarityVirtualGuide isOpen={showGuide} onClose={() => setShowGuide(false)} />
      <TourVirtual isOpen={showTour} onClose={() => setShowTour(false)} />

      {/* Top Sidebar/Nav for Clinical Dashboard */}
      <nav className="fixed left-0 top-0 h-full w-20 bg-slate-900 flex flex-col items-center py-8 gap-8 z-50">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black italic shadow-lg shadow-blue-500/40">C</div>
        <div className="flex-1 flex flex-col gap-6 text-slate-500">
            <button className="p-3 bg-slate-800 rounded-xl text-blue-400"><Database size={20} /></button>
            <button 
              onClick={() => setShowVoice(true)}
              className="p-3 hover:bg-slate-800 rounded-xl transition-colors text-blue-500"
              title="Consulta por Voz"
            >
              <Mic size={20} />
            </button>
            <button className="p-3 hover:bg-slate-800 rounded-xl transition-colors"><User size={20} /></button>
            <button className="p-3 hover:bg-slate-800 rounded-xl transition-colors"><Search size={20} /></button>
            <button className="p-3 hover:bg-slate-800 rounded-xl transition-colors"><FileText size={20} /></button>
        </div>
        <div className="flex flex-col gap-6 text-slate-500">
            <button 
              onClick={() => setShowGuide(true)}
              className="p-3 hover:bg-slate-800 rounded-xl transition-colors text-amber-400"
            >
              <HelpCircle size={20} />
            </button>
            <button className="p-3 hover:bg-slate-800 rounded-xl transition-colors"><Bell size={20} /></button>
            <button className="p-3 hover:bg-slate-800 rounded-xl transition-colors"><Settings size={20} /></button>
        </div>
      </nav>

      <main className="pl-32 pr-8 md:pr-16 py-12 max-w-7xl mx-auto space-y-12">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="flex items-center gap-2 text-blue-600 mb-1">
                <Zap size={14} className="fill-blue-600" />
                <span className="text-[10px] font-black uppercase tracking-widest">Motor Principal Activo</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Consola Clarity Copilot</h1>
            <p className="text-slate-500 font-medium italic">Gestión Avanzada de Implantología y Sincronización P4</p>
          </div>

          <div className="hidden xl:flex items-center gap-8 px-10 py-6 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm">
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Alineación P4</span>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                </div>
                <span className="text-xl font-black text-slate-900">98%</span>
              </div>
            </div>
            <div className="w-px h-10 bg-slate-100"></div>
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Riesgo Predictivo</span>
              <span className="text-xl font-black text-emerald-500">BAJO</span>
            </div>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
             {!hasApiKey && (
               <button 
                  onClick={handleOpenKeySelector}
                  className="flex-1 md:flex-none bg-amber-500/10 border border-amber-500/20 text-amber-600 px-6 py-4 rounded-2xl font-black text-[10px] flex items-center justify-center gap-2 hover:bg-amber-500/20 transition-all uppercase tracking-widest"
               >
                 <Sparkles size={14} /> Configurar API Key (VEO)
               </button>
             )}
             <button 
                onClick={() => setShowTour(true)}
                className="flex-1 md:flex-none bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 px-6 py-4 rounded-2xl font-black text-[10px] flex items-center justify-center gap-2 hover:bg-indigo-500/20 transition-all uppercase tracking-widest"
             >
                <Zap size={14} /> Tour Virtual RRSS
             </button>
             <button 
                onClick={() => setView(ViewMode.PATIENT)}
                className="flex-1 md:flex-none bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs flex items-center justify-center gap-3 shadow-xl shadow-slate-900/10 hover:bg-black transition-all"
             >
               <Eye size={16} /> PORTAL DEL PACIENTE
             </button>
             <button 
                onClick={() => setView(ViewMode.AUTHORING)}
                className="flex-1 md:flex-none bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all"
             >
                <Edit3 size={16} /> EDITOR DE CASOS
             </button>
          </div>
        </div>

        {/* Structural Logic Diagram */}
        <ClarityDiagram />

        {/* Analytics Section - New Traceability Feature */}
        <AnalyticsDashboard stats={engagementStats} markers={markers} />

        {/* Action Grid */}
        <div className="grid lg:grid-cols-3 gap-10">
          
          {/* Main Evidence Capture Section */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden">
               {isSyncing && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-4">
                     <RefreshCw className="text-blue-600 animate-spin" size={40} />
                     <p className="text-sm font-black text-slate-900 uppercase tracking-tighter">Razonamiento IA en progreso...</p>
                  </div>
               )}

               <div className="flex justify-between items-center mb-10">
                  <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest flex items-center gap-3">
                    <Camera size={20} className="text-blue-600" /> Sincronización de Evidencia Clínica
                  </h3>
                  <div className="flex gap-2">
                    {evidenceUploaded && (
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                          <Check size={12} /> Sincronización Activa
                      </span>
                    )}
                  </div>
               </div>

               <div className="grid md:grid-cols-2 gap-8">
                  <label className="block border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 flex flex-col items-center justify-center hover:border-blue-400 transition-all cursor-pointer group bg-slate-50/50">
                      <input type="file" className="hidden" onChange={handleFileUpload} />
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition shadow-lg group-hover:shadow-blue-500/10">
                        <FileUp size={32} />
                      </div>
                      <p className="text-slate-800 font-black text-sm">Subir Evidencia</p>
                      <p className="text-[9px] text-slate-400 uppercase font-bold mt-2">DICOM, JPG, STL</p>
                  </label>

                  <div className="flex flex-col gap-4">
                    <button 
                      onClick={() => {
                        const mockEvent = {
                          target: {
                            files: [new File([""], "test-xray.dcm", { type: "application/dicom" })]
                          }
                        } as unknown as React.ChangeEvent<HTMLInputElement>;
                        handleFileUpload(mockEvent);
                      }}
                      className="w-full p-4 bg-blue-50 border border-blue-100 rounded-2xl text-[10px] font-black text-blue-600 uppercase tracking-widest hover:bg-blue-100 transition-all flex items-center justify-center gap-2"
                    >
                      <Zap size={14} /> Simular Sincronización P4
                    </button>
                    
                    <div className="space-y-4 max-h-[140px] overflow-y-auto pr-2 custom-scrollbar">
                    {evidenceList.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-slate-300 border border-dashed border-slate-100 rounded-[2rem]">
                        <Clock size={24} className="mb-2 opacity-20" />
                        <p className="text-[10px] font-bold uppercase tracking-widest">Sin evidencia sincronizada</p>
                      </div>
                    ) : (
                      evidenceList.map((ev) => (
                        <div key={ev.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group hover:bg-white hover:shadow-md transition-all">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              ev.status === 'syncing' ? 'bg-blue-100 text-blue-600' : 
                              ev.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 
                              'bg-red-100 text-red-600'
                            }`}>
                              {ev.status === 'syncing' ? <RefreshCw size={16} className="animate-spin" /> : 
                               ev.status === 'completed' ? <Check size={16} /> : 
                               <AlertCircle size={16} />}
                            </div>
                            <div>
                              <p className="text-[11px] font-black text-slate-900 truncate max-w-[120px]">{ev.name}</p>
                              <p className="text-[9px] font-bold text-slate-400 uppercase">{ev.timestamp}</p>
                            </div>
                          </div>
                          {ev.status === 'completed' && (
                            <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                              <Eye size={14} />
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
               </div>
            </div>

            {/* AI Insights Card */}
            {isSyncing ? (
              <div className="bg-blue-600 p-10 rounded-[3rem] text-white flex flex-col items-center justify-center gap-4 animate-pulse">
                <Sparkles size={32} className="animate-bounce" />
                <p className="text-sm font-black uppercase tracking-widest">{syncStep}</p>
              </div>
            ) : aiAnalysis && (
                <div className="bg-slate-900 p-10 rounded-[3rem] text-white space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Información Predictiva P4</h4>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <p className="text-slate-400 text-xs font-bold uppercase mb-2">Riesgo Predictivo</p>
                            <p className="text-lg font-medium leading-relaxed">{aiAnalysis.prediction}</p>
                        </div>
                        <div>
                            <p className="text-slate-400 text-xs font-bold uppercase mb-2">Acción Preventiva</p>
                            <p className="text-lg font-medium leading-relaxed">{aiAnalysis.prevention}</p>
                        </div>
                    </div>
                </div>
            )}
          </div>

          {/* Side Sync Panel */}
          <div className="space-y-8">
            <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8 h-full">
                <div>
                    <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest flex items-center gap-3 mb-6">
                      <RefreshCw size={18} className="text-slate-400" /> Integración Financiera
                    </h3>
                    <div className="space-y-3">
                    {markers.map((m) => (
                        <div key={m.id} className="group flex justify-between items-center p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-white transition-all">
                        <div className="flex flex-col">
                            <span className="text-xs font-black text-slate-900 uppercase tracking-tighter">{m.treatment}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{m.p4_category}</span>
                        </div>
                        <span className="text-sm font-black text-blue-600">${m.price.toLocaleString()}</span>
                        </div>
                    ))}
                    {markers.length === 0 && <p className="text-xs text-slate-400 italic text-center py-4">Sin tratamientos mapeados.</p>}
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-100">
                    <div className="flex justify-between items-end mb-8">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total del Plan</p>
                        <p className="text-3xl font-black text-slate-900">${markers.reduce((s,m) => s + m.price, 0).toLocaleString()}</p>
                    </div>

                    <button 
                        onClick={handleSendToPatient}
                        disabled={(!evidenceUploaded && markers.length === 0) || isSending}
                        className={`w-full py-5 rounded-[2rem] font-black text-xs flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                            isSent ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-blue-600 text-white shadow-blue-600/20 hover:bg-blue-700'
                        }`}
                    >
                        {isSending ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            VINCULANDO PLAN INTELIGENTE...
                          </>
                        ) : isSent ? (
                          <>
                            <Check size={18} />
                            ENVIADO AL PACIENTE
                          </>
                        ) : (
                          <>
                            <Send size={18} />
                            COMPARTIR PORTAL SEGURO
                          </>
                        )}
                    </button>
                    
                    <p className="text-center text-[9px] text-slate-400 uppercase font-black mt-4">
                        Impulsado por el Motor Causal Clarity Copilot v3.1
                    </p>
                </div>
            </div>
          </div>
        </div>
      </main>
      {/* Global AI Copilot Chat */}
      <ClinicalChatbot />
      
      {/* Voice Consultation Modal */}
      <VoiceConsultation isOpen={showVoice} onClose={() => setShowVoice(false)} />
    </div>
  );
};

export default App;
