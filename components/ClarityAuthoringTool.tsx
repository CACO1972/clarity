
import React, { useState, useEffect } from 'react';
// Fix: Added 'Save' to the imports from lucide-react
import { MousePointer2, PlusCircle, Trash2, Eye, ChevronLeft, Search, Loader2, Save, Sparkles, Clock, FileText } from 'lucide-react';
import { Marker, P4Type } from '../types';
import { fetchDentalinkTreatments, DentalinkTreatment } from '../services/dentalinkService';
import { suggestTreatmentDetails } from '../services/geminiService';

interface ClarityAuthoringToolProps {
  markers: Marker[];
  onMarkersChange: (markers: Marker[]) => void;
  onPreview: () => void;
  onBack: () => void;
  aiAnalysis?: {
    suggestedTreatments?: {
      name: string;
      p4Category: string;
      reasoning: string;
    }[];
    riskLevel?: string;
  };
}

const ClarityAuthoringTool: React.FC<ClarityAuthoringToolProps> = ({ 
  markers, 
  onMarkersChange, 
  onPreview, 
  onBack,
  aiAnalysis
}) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<DentalinkTreatment[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  useEffect(() => {
    const triggerAiSuggestion = async () => {
      if (!selectedId) return;
      
      const marker = markers.find(m => m.id === selectedId);
      if (!marker) return;

      // Only trigger if treatment is selected and descriptions are empty
      const isDefaultTreatment = marker.treatment === "Seleccionar tratamiento...";
      const hasNoDescription = !marker.description || marker.description.trim() === "";
      const hasNoDetailedDescription = !marker.detailedDescription || marker.detailedDescription.trim() === "";

      if (!isDefaultTreatment && (hasNoDescription || hasNoDetailedDescription)) {
        setIsAiGenerating(true);
        const suggestion = await suggestTreatmentDetails(marker.treatment, marker.p4_category);
        
        if (suggestion) {
          onMarkersChange(markers.map(m => m.id === selectedId ? {
            ...m,
            detailedDescription: m.detailedDescription || suggestion.detailedDescription,
            durationEstimate: m.durationEstimate || suggestion.durationEstimate,
            followUpCareInstructions: m.followUpCareInstructions || suggestion.followUpCareInstructions,
            description: m.description || suggestion.detailedDescription.substring(0, 100) + "..."
          } : m));
        }
        setIsAiGenerating(false);
      }
    };

    triggerAiSuggestion();
  }, [selectedId, markers.find(m => m.id === selectedId)?.treatment]);

  const handleSuggestionClick = async (suggestion: { name: string; p4Category: string }) => {
    setSearchTerm(suggestion.name);
    setIsSearching(true);
    const data = await fetchDentalinkTreatments(suggestion.name);
    setResults(data);
    setIsSearching(false);
    
    // If we have a selected marker, we can also pre-set its P4 category
    if (selectedId) {
      updateMarker(selectedId, 'p4_category', suggestion.p4Category as P4Type);
    }
  };

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newMarker: Marker = {
      id: Date.now(),
      x: `${x}%`,
      y: `${y}%`,
      treatment: "Seleccionar tratamiento...",
      price: 0,
      p4_category: "Predictive",
      description: "Pérdida ósea detectada.",
      detailedDescription: "",
      durationEstimate: "",
      followUpCareInstructions: "",
      type: 'critical'
    };

    onMarkersChange([...markers, newMarker]);
    setSelectedId(newMarker.id);
    setSearchTerm('');
    setResults([]);
  };

  const updateMarker = (id: number, field: keyof Marker, value: any) => {
    onMarkersChange(markers.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const deleteMarker = (id: number) => {
    onMarkersChange(markers.filter(m => m.id !== id));
    setSelectedId(null);
  };

  const handleSearch = async (val: string) => {
    setSearchTerm(val);
    if (val.length > 2) {
      setIsSearching(true);
      const data = await fetchDentalinkTreatments(val);
      setResults(data);
      setIsSearching(false);
    } else {
      setResults([]);
    }
  };

  const selectedMarker = markers.find(m => m.id === selectedId);

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans">
      {/* 1. LIENZO DE TRABAJO (Izquierda) */}
      <div className="flex-1 p-8 overflow-hidden flex flex-col">
        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
            >
              <ChevronLeft size={20} />
            </button>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Editor Clínico Clarity</h2>
              <p className="text-slate-500 text-sm font-medium">Sincronización en tiempo real con aranceles Dentalink.</p>
            </div>
          </div>
          <button 
            onClick={onPreview}
            className="bg-black text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-800 transition shadow-lg active:scale-95"
          >
            <Eye size={18} /> VISTA PACIENTE
          </button>
        </div>

        <div className="relative flex-1 bg-black rounded-[3rem] shadow-2xl overflow-hidden border-8 border-white cursor-crosshair group">
          <img 
            src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=2000" 
            className="w-full h-full object-cover opacity-70 contrast-125 transition-opacity group-hover:opacity-80"
            onClick={handleImageClick}
            alt="Workspace"
          />

          {/* Renderizado de Vértices en Tiempo Real */}
          {markers.map((m) => (
            <div 
              key={m.id}
              onClick={(e) => { e.stopPropagation(); setSelectedId(m.id); }}
              className={`absolute w-10 h-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 flex items-center justify-center transition-all shadow-xl cursor-pointer
                ${selectedId === m.id ? 'bg-blue-600 border-white scale-125 z-50 ring-4 ring-blue-500/30' : 'bg-white border-blue-600 hover:scale-110 z-10'}`}
              style={{ top: m.y, left: m.x }}
            >
              <div className={selectedId === m.id ? 'text-white' : 'text-blue-600'}>
                <MousePointer2 size={16} fill="currentColor" />
              </div>
            </div>
          ))}

          {/* Scan Effect inside Editor */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-blue-500/10 via-transparent to-transparent h-1/4 animate-scan z-40" />
        </div>
      </div>

      {/* 2. PANEL DE CONFIGURACIÓN (Derecha) */}
      <div className="w-[440px] bg-white border-l border-slate-200 p-8 shadow-2xl overflow-y-auto z-50">
        <div className="flex items-center gap-3 mb-10">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">Configuración de Vértice</h3>
        </div>
        
        {selectedMarker ? (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
            
            {/* AI Suggestions Section */}
            {aiAnalysis?.suggestedTreatments && aiAnalysis.suggestedTreatments.length > 0 && (
              <div className="space-y-4 bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-[2rem] border border-indigo-100 shadow-sm">
                <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                  <Sparkles size={12} className="fill-indigo-600" /> Sugerencias AI (Basado en Evidencia)
                </label>
                <div className="flex flex-wrap gap-2">
                  {aiAnalysis.suggestedTreatments.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(suggestion)}
                      title={suggestion.reasoning}
                      className="px-4 py-2 bg-white border border-indigo-200 rounded-xl text-xs font-bold text-indigo-700 hover:bg-indigo-600 hover:text-white transition-all shadow-sm active:scale-95 group/sug relative"
                    >
                      {suggestion.name}
                      <span className="absolute -top-2 -right-1 px-1.5 py-0.5 bg-indigo-600 text-[8px] text-white rounded-full opacity-0 group-hover/sug:opacity-100 transition-opacity">
                        {suggestion.p4Category.charAt(0)}
                      </span>
                    </button>
                  ))}
                </div>
                <p className="text-[9px] text-indigo-400 font-medium italic">
                  Haz clic en una sugerencia para buscar en el arancel Dentalink.
                </p>
              </div>
            )}

            {/* Dentalink Sync Search Engine */}
            <div className="space-y-4 bg-blue-50/50 p-6 rounded-[2rem] border border-blue-100 shadow-sm">
                <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
                    <Search size={12} /> Vincular Prestación Dentalink
                </label>
                
                <div className="relative">
                    <input 
                        type="text"
                        placeholder="Ej: Implante, Corona..."
                        className="w-full p-4 rounded-2xl border-none shadow-sm bg-white text-sm font-bold focus:ring-2 focus:ring-blue-500/20"
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                    
                    {isSearching && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500">
                         <Loader2 size={16} className="animate-spin" />
                      </div>
                    )}

                    {results.length > 0 && (
                        <div className="absolute top-16 w-full bg-white border border-slate-200 rounded-[1.5rem] shadow-2xl z-[60] max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                            {results.map(res => (
                                <div 
                                    key={res.id}
                                    onClick={() => {
                                        updateMarker(selectedMarker.id, 'treatment', res.name);
                                        updateMarker(selectedMarker.id, 'price', res.price);
                                        updateMarker(selectedMarker.id, 'p4_category', res.p4_suggestion);
                                        // Update description if it's the default one
                                        if (selectedMarker.description === "Pérdida ósea detectada.") {
                                          updateMarker(selectedMarker.id, 'description', res.description);
                                        }
                                        setResults([]);
                                        setSearchTerm(res.name);
                                    }}
                                    className="p-4 hover:bg-blue-50 cursor-pointer border-b border-slate-50 last:border-none transition flex justify-between items-center group/res"
                                >
                                    <div className="flex-1 pr-4">
                                        <p className="text-sm font-bold text-slate-800 group-hover/res:text-blue-700 transition-colors">{res.name}</p>
                                        <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">{res.category}</p>
                                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-1 italic">{res.description}</p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="text-sm font-black text-blue-600">${res.price}</p>
                                        <p className="text-[9px] font-black text-blue-300 uppercase">{res.p4_suggestion}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Tratamiento Form Fields */}
            <div className={`space-y-6 relative ${isAiGenerating ? 'opacity-50 pointer-events-none' : ''}`}>
                {isAiGenerating && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm rounded-[2rem]">
                    <Loader2 size={32} className="animate-spin text-blue-600 mb-2" />
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">IA Generando Detalles...</p>
                  </div>
                )}
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tratamiento Manual</label>
                    <input 
                        type="text"
                        value={selectedMarker.treatment}
                        className="w-full p-5 bg-slate-50 border border-slate-200 rounded-3xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        onChange={(e) => updateMarker(selectedMarker.id, 'treatment', e.target.value)}
                    />
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Enfoque Medicina P4</label>
                    <div className="grid grid-cols-2 gap-3">
                        {(['Predictive', 'Preventive', 'Personalized', 'Participatory'] as P4Type[]).map(p => (
                            <button 
                                key={p}
                                onClick={() => updateMarker(selectedMarker.id, 'p4_category', p)}
                                className={`p-3 text-[10px] font-black rounded-2xl border transition-all uppercase tracking-tighter
                                ${selectedMarker.p4_category === p 
                                    ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-500/20' 
                                    : 'bg-white border-slate-200 text-slate-400 hover:border-blue-300'}`}
                            >
                                {p === 'Predictive' ? 'Predictiva' : 
                                 p === 'Preventive' ? 'Preventiva' : 
                                 p === 'Personalized' ? 'Personalizada' : 
                                 'Participativa'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Inversión Estimada ($)</label>
                    <div className="relative">
                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-black">$</span>
                        <input 
                            type="number" 
                            value={selectedMarker.price}
                            className="w-full p-5 pl-10 bg-slate-50 border border-slate-200 rounded-3xl text-2xl font-black text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            onChange={(e) => updateMarker(selectedMarker.id, 'price', parseFloat(e.target.value) || 0)}
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <FileText size={12} /> Descripción Detallada
                    </label>
                    <textarea 
                        value={selectedMarker.detailedDescription}
                        className="w-full p-5 bg-slate-50 border border-slate-200 rounded-3xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 min-h-[100px]"
                        onChange={(e) => updateMarker(selectedMarker.id, 'detailedDescription', e.target.value)}
                        placeholder="Detalles del procedimiento..."
                    />
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <Clock size={12} /> Duración Estimada
                    </label>
                    <input 
                        type="text"
                        value={selectedMarker.durationEstimate}
                        className="w-full p-5 bg-slate-50 border border-slate-200 rounded-3xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        onChange={(e) => updateMarker(selectedMarker.id, 'durationEstimate', e.target.value)}
                        placeholder="Ej: 45 min, 1 hora..."
                    />
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <Sparkles size={12} /> Instrucciones de Seguimiento
                    </label>
                    <textarea 
                        value={selectedMarker.followUpCareInstructions}
                        className="w-full p-5 bg-slate-50 border border-slate-200 rounded-3xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 min-h-[100px]"
                        onChange={(e) => updateMarker(selectedMarker.id, 'followUpCareInstructions', e.target.value)}
                        placeholder="Cuidados post-operatorios..."
                    />
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Gravedad Clínica</label>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => updateMarker(selectedMarker.id, 'type', 'critical')}
                            className={`flex-1 py-3 rounded-2xl font-bold text-[10px] border transition-all ${selectedMarker.type === 'critical' ? 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/10' : 'bg-slate-50 text-slate-400 border-slate-200'}`}
                        >
                            CRÍTICO
                        </button>
                        <button 
                            onClick={() => updateMarker(selectedMarker.id, 'type', 'warning')}
                            className={`flex-1 py-3 rounded-2xl font-bold text-[10px] border transition-all ${selectedMarker.type === 'warning' ? 'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/10' : 'bg-slate-50 text-slate-400 border-slate-200'}`}
                        >
                            ADVERTENCIA
                        </button>
                    </div>
                </div>
            </div>

            <button 
              onClick={() => deleteMarker(selectedMarker.id)}
              className="w-full py-5 text-red-500 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-50 transition-all rounded-[2rem] border border-transparent hover:border-red-100"
            >
              <Trash2 size={16} /> ELIMINAR VÉRTICE
            </button>

            <div className="pt-8 border-t border-slate-100 space-y-4">
              <button 
                onClick={onPreview}
                className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black shadow-xl hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                <Save size={18} /> SINCRONIZAR Y SALIR
              </button>
              <p className="text-center text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                Vinculado con Dentalink y Motor Gemini
              </p>
            </div>
          </div>
        ) : (
          <div className="h-[400px] flex flex-col items-center justify-center text-center space-y-6 bg-slate-50/50 rounded-[3rem] border border-dashed border-slate-200 border-spacing-4">
            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-slate-200 shadow-sm animate-pulse">
                <PlusCircle size={32} />
            </div>
            <div className="max-w-[200px]">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                    Selecciona un punto en el lienzo para mapear una prestación de Dentalink.
                </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClarityAuthoringTool;
