
import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, X, Loader2, Bot, Sparkles } from 'lucide-react';
import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const VoiceConsultation: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState('Listo para iniciar consulta por voz...');
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startSession = async () => {
    setIsConnecting(true);
    setStatus('Estableciendo conexión segura...');

    try {
      const session = await ai.live.connect({
        model: "gemini-2.5-flash-native-audio-preview-09-2025",
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
          },
          systemInstruction: "Eres un consultor clínico senior de Clarity Copilot clínico. Ayudas a los doctores a discutir casos de implantología usando el marco P4 (Predictivo, Preventivo, Personalizado, Participativo). Tu tono es profesional, calmado y experto.",
        },
        callbacks: {
          onopen: () => {
            setIsConnecting(false);
            setIsListening(true);
            setStatus('Consulta en curso... Te escucho.');
            startMic();
          },
          onmessage: async (message) => {
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              playAudio(base64Audio);
            }
          },
          onerror: (err) => {
            console.error("Live API Error:", err);
            setStatus('Error de conexión.');
            stopSession();
          },
          onclose: () => {
            stopSession();
          }
        }
      });
      sessionRef.current = session;
    } catch (error) {
      console.error("Failed to connect:", error);
      setIsConnecting(false);
      setStatus('No se pudo iniciar la sesión.');
    }
  };

  const startMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const audioContext = new AudioContext({ sampleRate: 16000 });
      audioContextRef.current = audioContext;
      const source = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);

      source.connect(processor);
      processor.connect(audioContext.destination);

      processor.onaudioprocess = (e) => {
        if (sessionRef.current && isListening) {
          const inputData = e.inputBuffer.getChannelData(0);
          const pcmData = new Int16Array(inputData.length);
          for (let i = 0; i < inputData.length; i++) {
            pcmData[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF;
          }
          const base64Data = btoa(String.fromCharCode(...new Uint8Array(pcmData.buffer)));
          sessionRef.current.sendRealtimeInput({
            media: { data: base64Data, mimeType: 'audio/pcm;rate=16000' }
          });
        }
      };
    } catch (err) {
      console.error("Mic Error:", err);
      setStatus('Error al acceder al micrófono.');
    }
  };

  const playAudio = (base64: string) => {
    if (!audioContextRef.current) return;
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const pcmData = new Int16Array(bytes.buffer);
    const floatData = new Float32Array(pcmData.length);
    for (let i = 0; i < pcmData.length; i++) floatData[i] = pcmData[i] / 0x7FFF;

    const buffer = audioContextRef.current.createBuffer(1, floatData.length, 16000);
    buffer.getChannelData(0).set(floatData);
    const source = audioContextRef.current.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContextRef.current.destination);
    source.start();
  };

  const stopSession = () => {
    setIsListening(false);
    setIsConnecting(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    if (sessionRef.current) {
      sessionRef.current.close();
    }
    setStatus('Consulta finalizada.');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-xl z-[200] flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="w-full max-w-lg bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col relative">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-3 hover:bg-slate-100 rounded-2xl transition-colors text-slate-400"
        >
          <X size={24} />
        </button>

        <div className="p-10 flex flex-col items-center text-center space-y-8">
          <div className="w-24 h-24 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-blue-500/30 relative">
            {isListening ? (
              <div className="absolute inset-0 rounded-[2rem] border-4 border-blue-400 animate-ping opacity-20" />
            ) : null}
            <Bot size={48} />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Consulta por Voz P4</h3>
            <p className="text-slate-500 text-sm font-medium max-w-xs mx-auto">
              Habla directamente con el motor de inteligencia clínica de Clarity.
            </p>
          </div>

          <div className="w-full p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">
                {status}
              </p>
            </div>
            
            {isListening && (
              <div className="flex justify-center gap-1 h-8 items-end">
                {[1,2,3,4,5,6,7,8].map(i => (
                  <div key={i} className="w-1 bg-blue-500 rounded-full animate-wave" style={{ animationDelay: `${i * 0.1}s` }} />
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-4 w-full">
            {!isListening && !isConnecting ? (
              <button 
                onClick={startSession}
                className="flex-1 py-5 bg-blue-600 text-white rounded-[2rem] font-black shadow-xl hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                <Mic size={20} /> INICIAR CONSULTA
              </button>
            ) : (
              <button 
                onClick={stopSession}
                className="flex-1 py-5 bg-red-500 text-white rounded-[2rem] font-black shadow-xl hover:bg-red-600 transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                <MicOff size={20} /> FINALIZAR SESIÓN
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Sparkles size={12} className="text-blue-500" />
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Powered by Gemini 2.5 Native Audio</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceConsultation;
