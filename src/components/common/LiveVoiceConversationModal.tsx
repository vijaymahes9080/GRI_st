import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Mic, 
  MicOff, 
  X, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Radio, 
  AlertCircle, 
  Square,
  MessageSquare,
  RefreshCw
} from 'lucide-react';
import { pcm16ToBase64, LiveAudioPlayer } from '../../utils/audioUtils';
import { useAppStore } from '../../core/store/appStore';
import { getSecureItem, storageKeys } from '../../core/storage';

interface LiveVoiceConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TranscriptItem {
  id: string;
  sender: 'user' | 'model';
  text: string;
  timestamp: string;
}

export const LiveVoiceConversationModal: React.FC<LiveVoiceConversationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { currentUser } = useAppStore();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userSpeaking, setUserSpeaking] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Ready to connect');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [transcripts, setTranscripts] = useState<TranscriptItem[]>([]);
  const [liveModelText, setLiveModelText] = useState('');
  
  const wsRef = useRef<WebSocket | null>(null);
  const audioPlayerRef = useRef<LiveAudioPlayer | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const transcriptsEndRef = useRef<HTMLDivElement>(null);

  const setupMicProcessing = useCallback((stream: MediaStream, ws: WebSocket) => {
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      const inputCtx = new AudioCtxClass({ sampleRate: 16000 });
      inputAudioCtxRef.current = inputCtx;

      const source = inputCtx.createMediaStreamSource(stream);
      const processor = inputCtx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      source.connect(processor);
      processor.connect(inputCtx.destination);

      let silenceCounter = 0;

      processor.onaudioprocess = (e) => {
        if (isMicMuted || ws.readyState !== WebSocket.OPEN) return;

        const inputBuffer = e.inputBuffer.getChannelData(0);
        
        // Simple RMS volume detection for visualizer
        let sum = 0;
        for (let i = 0; i < inputBuffer.length; i++) {
          sum += inputBuffer[i] * inputBuffer[i];
        }
        const rms = Math.sqrt(sum / inputBuffer.length);
        
        if (rms > 0.02) {
          setUserSpeaking(true);
          silenceCounter = 0;
        } else {
          silenceCounter++;
          if (silenceCounter > 10) {
            setUserSpeaking(false);
          }
        }

        const base64Pcm = pcm16ToBase64(inputBuffer);
        ws.send(JSON.stringify({ audio: base64Pcm }));
      };
    } catch (err) {
      console.error('[Mic Setup Error]', err);
    }
  }, [isMicMuted]);

  const endLiveSession = useCallback(() => {
    // 1. Stop audio playback
    audioPlayerRef.current?.close();
    audioPlayerRef.current = null;

    // 2. Stop mic capture
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (inputAudioCtxRef.current) {
      inputAudioCtxRef.current.close();
      inputAudioCtxRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
      mediaStreamRef.current = null;
    }

    // 3. Close WebSocket
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setIsConnected(false);
    setIsConnecting(false);
    setIsSpeaking(false);
    setUserSpeaking(false);
  }, []);

  const startLiveSession = useCallback(async () => {
    setErrorMessage(null);
    setIsConnecting(true);
    setStatusMessage('Initializing Gemini 3.1 Flash Live session...');

    try {
      // 1. Initialize 24kHz audio playback
      audioPlayerRef.current = new LiveAudioPlayer(24000);
      await audioPlayerRef.current.resumeContext();

      // 2. Request user microphone (16kHz capture)
      let stream: MediaStream | null = null;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            channelCount: 1,
            sampleRate: 16000,
            echoCancellation: true,
            noiseSuppression: true,
          } 
        });
        mediaStreamRef.current = stream;
      } catch (micErr) {
        console.warn('[Live Mic Access Warning]', micErr);
        setStatusMessage('Microphone access limited. Interactive voice mode ready.');
      }

      // 3. Connect to server WebSocket bridge on /live
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const token = getSecureItem(storageKeys.ACCESS_TOKEN) || 'mock_token';
      const wsUrl = `${protocol}//${window.location.host}/live?token=${token}`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setIsConnecting(false);
        setStatusMessage('Connected to Gemini Live (gemini-3.1-flash-live-preview)');
        
        // Greet over live session
        setTranscripts(prev => [
          ...prev,
          {
            id: `init-${Date.now()}`,
            sender: 'model',
            text: `Vanakkam ${currentUser.name}! I am listening via GRI Live Voice. How can I help you today?`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }
        ]);

        // Start microphone capture if stream available
        if (stream) {
          setupMicProcessing(stream, ws);
        }
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);

          if (msg.error) {
            setErrorMessage(msg.error);
            setStatusMessage('Live session error');
            return;
          }

          if (msg.audio) {
            setIsSpeaking(true);
            audioPlayerRef.current?.playPcmBase64(msg.audio, () => {
              setIsSpeaking(false);
            });
          }

          if (msg.text) {
            setLiveModelText(prev => prev + msg.text);
          }

          if (msg.interrupted) {
            audioPlayerRef.current?.interrupt();
            setIsSpeaking(false);
            setStatusMessage('Interrupted — Listening to you...');
          }

          if (msg.turnComplete) {
            if (liveModelText.trim()) {
              setTranscripts(prev => [
                ...prev,
                {
                  id: `model-${Date.now()}`,
                  sender: 'model',
                  text: liveModelText,
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                }
              ]);
              setLiveModelText('');
            }
          }
        } catch (parseErr) {
          console.error('[Live WS Message Parse Error]', parseErr);
        }
      };

      ws.onerror = (e) => {
        console.error('[Live WS Error]', e);
        setErrorMessage('Could not connect to Live Audio WebSocket. Using intelligent voice fallback.');
        setIsConnecting(false);
      };

      ws.onclose = () => {
        setIsConnected(false);
        setIsConnecting(false);
        setStatusMessage('Live session closed');
      };
    } catch (err: any) {
      console.error('[Live Session Error]', err);
      setErrorMessage(err?.message || 'Failed to initialize voice session');
      setIsConnecting(false);
    }
  }, [currentUser.name, liveModelText, setupMicProcessing]);

  useEffect(() => {
    transcriptsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcripts, liveModelText]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen) {
      timer = setTimeout(() => {
        startLiveSession();
      }, 0);
    }
    return () => {
      clearTimeout(timer);
      endLiveSession();
    };
  }, [isOpen, startLiveSession, endLiveSession]);

  const handleInterrupt = () => {
    audioPlayerRef.current?.interrupt();
    setIsSpeaking(false);
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ text: '[User interrupted response]' }));
    }
  };

  const toggleMuteAudio = () => {
    const nextState = !isAudioMuted;
    setIsAudioMuted(nextState);
    audioPlayerRef.current?.setMute(nextState);
  };

  const toggleMuteMic = () => {
    setIsMicMuted(!isMicMuted);
  };

  const sendQuickPrompt = (promptText: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      setTranscripts(prev => [
        ...prev,
        {
          id: `user-${Date.now()}`,
          sender: 'user',
          text: promptText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
      wsRef.current.send(JSON.stringify({ text: promptText }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-600 to-amber-600 flex items-center justify-center text-white shadow-md">
              <Radio className="w-5 h-5 animate-pulse text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-white text-base">
                  GRI Live Voice Conversation
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 font-mono text-[10px]">
                  gemini-3.1-flash-live-preview
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Low-latency, real-time bidirectional audio conversation with GRI RuralGPT
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Voice Visualizer Section */}
        <div className="p-8 bg-gradient-to-b from-slate-950 to-slate-900 flex flex-col items-center justify-center relative overflow-hidden border-b border-slate-800/80">
          {/* Ambient Glow */}
          <div className={`absolute w-64 h-64 rounded-full blur-3xl transition-all duration-700 ${
            isSpeaking 
              ? 'bg-amber-500/20 scale-125' 
              : userSpeaking 
              ? 'bg-emerald-500/25 scale-125' 
              : 'bg-emerald-600/10 scale-95'
          }`} />

          {/* Central Animated Orb */}
          <div className="relative z-10 flex flex-col items-center">
            <div className={`w-28 h-28 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
              isSpeaking
                ? 'bg-gradient-to-br from-amber-500 via-orange-500 to-amber-700 ring-8 ring-amber-500/30 scale-105'
                : userSpeaking
                ? 'bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-700 ring-8 ring-emerald-500/30 scale-105'
                : 'bg-gradient-to-br from-slate-800 to-slate-900 ring-4 ring-slate-700/50'
            }`}>
              {isSpeaking ? (
                <Volume2 className="w-12 h-12 text-white animate-pulse" />
              ) : userSpeaking ? (
                <Mic className="w-12 h-12 text-white animate-bounce" />
              ) : (
                <Sparkles className="w-12 h-12 text-emerald-400" />
              )}
            </div>

            {/* Audio Wave Bars */}
            <div className="flex items-center gap-1.5 mt-6 h-8">
              {[40, 75, 55, 90, 60, 85, 45, 95, 70, 50, 80, 65].map((height, idx) => (
                <div
                  key={idx}
                  style={{
                    height: isSpeaking || userSpeaking ? `${Math.max(15, (height * (isSpeaking ? 1 : 0.8)))}%` : '15%',
                  }}
                  className={`w-1.5 rounded-full transition-all duration-150 ${
                    isSpeaking 
                      ? 'bg-amber-400' 
                      : userSpeaking 
                      ? 'bg-emerald-400' 
                      : 'bg-slate-700'
                  }`}
                />
              ))}
            </div>

            {/* Live Status Badge */}
            <div className="mt-3 flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${
                isConnected ? (isSpeaking ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400') : 'bg-slate-600'
              }`} />
              <span className="text-xs font-medium text-slate-300">
                {isSpeaking ? 'GRI RuralGPT Speaking (24kHz Live PCM)' : userSpeaking ? 'Listening to you (16kHz Live PCM)...' : statusMessage}
              </span>
            </div>
          </div>
        </div>

        {/* Real-Time Live Transcript Area */}
        <div className="flex-1 p-5 overflow-y-auto space-y-3 min-h-[160px] max-h-[220px] bg-slate-950/40">
          <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-1.5 mb-2">
            <span className="flex items-center gap-1.5 font-semibold text-slate-300">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              Live Conversation Transcripts
            </span>
            <span className="text-[10px] font-mono text-slate-500">Low-latency Streaming</span>
          </div>

          {transcripts.map((t) => (
            <div
              key={t.id}
              className={`flex items-start gap-2.5 ${t.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                  t.sender === 'user'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 shadow'
                }`}
              >
                <p>{t.text}</p>
                <span className="text-[9px] opacity-60 block mt-1 text-right">{t.timestamp}</span>
              </div>
            </div>
          ))}

          {/* Current streaming model text */}
          {liveModelText && (
            <div className="flex items-start gap-2.5 justify-start">
              <div className="max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed bg-slate-900 border border-amber-500/40 text-amber-200 animate-pulse">
                <p>{liveModelText}</p>
                <span className="text-[9px] text-amber-400/70 block mt-1">Generating live speech...</span>
              </div>
            </div>
          )}

          <div ref={transcriptsEndRef} />
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="px-5 py-2.5 bg-amber-950/40 border-t border-amber-900/60 flex items-center justify-between text-xs text-amber-300">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-400" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={startLiveSession}
              className="px-2.5 py-1 rounded bg-amber-900/60 hover:bg-amber-800/80 text-amber-200 font-semibold text-[11px] flex items-center gap-1 transition"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Suggested Voice Prompts */}
        <div className="px-5 py-2 bg-slate-950 border-t border-slate-800 flex items-center gap-2 overflow-x-auto text-[11px]">
          <span className="text-slate-500 whitespace-nowrap">Ask via Voice:</span>
          {[
            'Tell me about MCA degree and fee structure',
            'When are End Semester Exams scheduled?',
            'What is the founding history of GRI?',
            'How do I reach GRI from Ambathurai station?',
          ].map((prompt, i) => (
            <button
              key={i}
              onClick={() => sendQuickPrompt(prompt)}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-emerald-300 border border-slate-800 hover:border-emerald-500/30 whitespace-nowrap transition"
            >
              "{prompt}"
            </button>
          ))}
        </div>

        {/* Bottom Control Bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {/* Mic Toggle */}
            <button
              onClick={toggleMuteMic}
              className={`p-3 rounded-2xl border transition flex items-center gap-2 text-xs font-semibold ${
                isMicMuted
                  ? 'bg-rose-950/60 border-rose-600 text-rose-400'
                  : 'bg-slate-900 border-slate-700 text-slate-200 hover:border-slate-600'
              }`}
              title={isMicMuted ? 'Unmute Microphone' : 'Mute Microphone'}
            >
              {isMicMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-emerald-400" />}
              <span className="hidden sm:inline">{isMicMuted ? 'Mic Off' : 'Mic Active'}</span>
            </button>

            {/* Audio Playback Mute */}
            <button
              onClick={toggleMuteAudio}
              className={`p-3 rounded-2xl border transition flex items-center gap-2 text-xs font-semibold ${
                isAudioMuted
                  ? 'bg-rose-950/60 border-rose-600 text-rose-400'
                  : 'bg-slate-900 border-slate-700 text-slate-200 hover:border-slate-600'
              }`}
              title={isAudioMuted ? 'Unmute Audio' : 'Mute Audio Output'}
            >
              {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
              <span className="hidden sm:inline">{isAudioMuted ? 'Muted' : 'Sound On'}</span>
            </button>
          </div>

          {/* Center Interrupt Action */}
          {isSpeaking && (
            <button
              onClick={handleInterrupt}
              className="px-4 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-600/30 transition animate-pulse"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Interrupt / Stop</span>
            </button>
          )}

          {/* End Call / Close */}
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 transition shadow-lg shadow-rose-900/40"
          >
            <span>End Call</span>
          </button>
        </div>
      </div>
    </div>
  );
};
