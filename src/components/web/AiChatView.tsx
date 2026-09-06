import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../../core/store/appStore';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Mic, 
  Radio, 
  Loader2, 
  Square, 
  Check, 
  X, 
  Copy, 
  Volume2, 
  ArrowRight,
  Headphones,
  FileAudio
} from 'lucide-react';
import { LiveVoiceConversationModal } from '../common/LiveVoiceConversationModal';
import { getSecureItem, storageKeys } from '../../core/storage';

export const AiChatView: React.FC = () => {
  const { currentUser } = useAppStore();
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string; audioTranscribed?: boolean }>>([
    {
      sender: 'bot',
      text: `Hello ${currentUser.name.split(' ')[0]}! I am GRI RuralGPT. You can type messages, record your microphone for audio transcription (gemini-3.5-transcribe), or start a real-time live voice conversation (gemini-3.1-flash-live-preview). How can I assist you today?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'transcribe'>('chat');

  // Live Voice Conversation Modal state (gemini-3.1-flash-live-preview)
  const [isLiveVoiceOpen, setIsLiveVoiceOpen] = useState(false);

  // Audio Recording & Transcription state (gemini-3.5-transcribe)
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionNotice, setTranscriptionNotice] = useState<string | null>(null);
  const [lastTranscribedText, setLastTranscribedText] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, isTranscribing]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    };
  }, []);

  const handleSend = async (query?: string, isFromAudio: boolean = false) => {
    const text = query || input;
    if (!text.trim() || isLoading) return;

    setMessages(prev => [...prev, { sender: 'user', text, audioTranscribed: isFromAudio }]);
    if (!query) setInput('');
    setIsLoading(true);

    try {
      const token = getSecureItem(storageKeys.ACCESS_TOKEN);
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          messages: [{ role: 'user', content: text }],
          userRole: `${currentUser.name} (${currentUser.role}, ${currentUser.department})`,
          persona: 'general',
        }),
      });

      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      setMessages(prev => [...prev, { sender: 'bot', text: data.reply }]);
    } catch {
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            sender: 'bot',
            text: `I understood "${text}". The GRI intelligence engine is operating in fallback mode. The academic calendar, hostel timings, and exam regulations remain active as published.`,
          },
        ]);
        setIsLoading(false);
      }, 700);
      return;
    } 
    setIsLoading(false);
  };

  // Start microphone recording for transcription (gemini-3.5-transcribe)
  const startRecording = async () => {
    setTranscriptionNotice(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        } 
      });
      streamRef.current = stream;

      let mimeType = 'audio/webm';
      if (typeof MediaRecorder !== 'undefined') {
        if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
          mimeType = 'audio/webm;codecs=opus';
        } else if (MediaRecorder.isTypeSupported('audio/webm')) {
          mimeType = 'audio/webm';
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4';
        }
      }

      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const detectedMime = recorder.mimeType || mimeType || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, { type: detectedMime });
        if (audioBlob.size > 0) {
          await processAndTranscribeAudio(audioBlob, detectedMime);
        }
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(t => t.stop());
          streamRef.current = null;
        }
      };

      recorder.start(250);
      setIsRecording(true);
      setRecordingSeconds(0);

      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('[Microphone Access Error]', err);
      setTranscriptionNotice('Microphone permission required for audio transcription.');
    }
  };

  // Stop recording and trigger gemini-3.5-transcribe
  const stopRecording = () => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  // Cancel recording and discard
  const cancelRecording = () => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.ondataavailable = null;
      mediaRecorderRef.current.onstop = null;
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    audioChunksRef.current = [];
    setIsRecording(false);
    setRecordingSeconds(0);
    setTranscriptionNotice('Recording cancelled.');
  };

  // Send audio base64 to /api/transcribe using model gemini-3.5-transcribe
  const processAndTranscribeAudio = async (blob: Blob, mimeType: string) => {
    setIsTranscribing(true);
    setTranscriptionNotice('Transcribing microphone audio with model gemini-3.5-transcribe...');

    try {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64Data = reader.result as string;

        const token = getSecureItem(storageKeys.ACCESS_TOKEN);
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const res = await fetch('/api/transcribe', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            audio: base64Data,
            mimeType,
            prompt: 'Transcribe this spoken audio accurately. Return only the verbatim transcribed speech text without preamble.',
          }),
        });

        const data = await res.json();
        if (data.success && data.text) {
          const transcribed = data.text.trim();
          setInput(prev => (prev ? `${prev} ${transcribed}` : transcribed));
          setLastTranscribedText(transcribed);
          setTranscriptionNotice(`Transcribed verbatim with gemini-3.5-transcribe (${transcribed.length} chars)`);
        } else {
          setTranscriptionNotice('Could not transcribe audio: ' + (data.error || 'Check server logs'));
        }
        setIsTranscribing(false);
      };
    } catch (err: any) {
      console.error('[Transcription Error]', err);
      setTranscriptionNotice('Audio transcription error: ' + (err?.message || 'Network error'));
      setIsTranscribing(false);
    }
  };

  const copyTranscription = () => {
    if (lastTranscribedText) {
      navigator.clipboard.writeText(lastTranscribedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-2xl mx-auto relative bg-slate-50 border-x border-slate-200">
      {/* Live Voice Conversation Modal (gemini-3.1-flash-live-preview) */}
      <LiveVoiceConversationModal 
        isOpen={isLiveVoiceOpen} 
        onClose={() => setIsLiveVoiceOpen(false)} 
      />

      {/* Top Header with Live Voice Action */}
      <div className="px-5 py-3.5 bg-white sticky top-0 z-10 border-b border-slate-200 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-1.5">
                RuralGPT <Sparkles className="w-4 h-4 text-emerald-600" />
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200">
                Gandhigram AI
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Campus Assistant & Multimodal Voice Service</p>
          </div>

          {/* Direct Trigger for Live Voice Conversation (gemini-3.1-flash-live-preview) */}
          <button
            onClick={() => setIsLiveVoiceOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-700/20 transition group"
            title="Start live voice conversation using model gemini-3.1-flash-live-preview"
          >
            <Radio className="w-3.5 h-3.5 text-amber-300 animate-pulse group-hover:scale-110 transition-transform" />
            <span>Live Voice Call</span>
            <span className="hidden sm:inline-block px-1.5 py-0.2 bg-emerald-900/50 rounded text-[9px] font-mono tracking-tighter text-emerald-200 border border-emerald-500/30">
              Live API
            </span>
          </button>
        </div>

        {/* Feature Mode Toggle: Chat Assistant vs Audio Transcription Lab */}
        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-100">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              activeTab === 'chat'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            💬 Interactive Chat
          </button>
          <button
            onClick={() => setActiveTab('transcribe')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'transcribe'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60'
            }`}
          >
            <FileAudio className="w-3.5 h-3.5" />
            <span>Audio Transcription</span>
            <span className="text-[10px] px-1 py-0.2 rounded bg-emerald-700/20 font-mono">gemini-3.5-transcribe</span>
          </button>
        </div>
      </div>

      {activeTab === 'chat' ? (
        /* Chat View Body */
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Banner highlighting real-time voice & audio transcription */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 border border-emerald-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-start gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-600 text-white shrink-0 mt-0.5">
                <Headphones className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  Real-Time Voice & Transcription Enabled
                </h4>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                  Talk live using <strong className="text-emerald-700 font-mono">gemini-3.1-flash-live-preview</strong>, or tap the mic icon below to transcribe microphone speech using <strong className="text-teal-700 font-mono">gemini-3.5-transcribe</strong>.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsLiveVoiceOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-white border border-emerald-300 text-emerald-800 text-xs font-bold hover:bg-emerald-50 whitespace-nowrap shadow-xs transition"
            >
              Start Live Call →
            </button>
          </div>

          {messages.map((m, idx) => (
            <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.sender === 'bot' && (
                <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center mr-2 shrink-0 self-end mb-1 shadow-xs">
                  <Bot className="w-4 h-4 text-emerald-700" />
                </div>
              )}
              <div className={`max-w-[85%] rounded-2xl p-3.5 sm:p-4 text-sm leading-relaxed ${
                m.sender === 'user' 
                  ? 'bg-emerald-600 text-white rounded-br-xs shadow-sm' 
                  : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs shadow-xs'
              }`}>
                {m.audioTranscribed && (
                  <div className="flex items-center gap-1 text-[10px] text-emerald-200 mb-1 font-mono">
                    <Mic className="w-3 h-3" /> Transcribed audio (gemini-3.5-transcribe)
                  </div>
                )}
                <p className="whitespace-pre-line">{m.text}</p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center mr-2 shrink-0 self-end mb-1 shadow-xs">
                <Bot className="w-4 h-4 text-emerald-700" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-xs px-4 py-3 text-xs text-slate-500 italic flex items-center gap-2 shadow-xs">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                <span>RuralGPT is thinking...</span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>
      ) : (
        /* Audio Transcription Lab Tab (gemini-3.5-transcribe) */
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileAudio className="w-4 h-4 text-emerald-600" />
                  Microphone Audio Transcription Lab
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Record microphone speech and transcribe into text via <span className="font-mono text-emerald-700 font-semibold">gemini-3.5-transcribe</span>.
                </p>
              </div>
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-mono font-bold border border-emerald-200">
                gemini-3.5-transcribe
              </span>
            </div>

            {/* Central Recording Widget */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col items-center justify-center text-center">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isTranscribing}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-lg ${
                  isRecording
                    ? 'bg-rose-600 text-white animate-pulse ring-8 ring-rose-200'
                    : 'bg-gradient-to-tr from-emerald-600 to-teal-600 text-white hover:scale-105 ring-4 ring-emerald-100'
                } disabled:opacity-50`}
              >
                {isRecording ? <Square className="w-8 h-8 fill-current" /> : <Mic className="w-8 h-8" />}
              </button>

              <div className="mt-4">
                {isRecording ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2 text-rose-600 font-bold text-sm">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
                      <span>Recording Microphone ({formatSeconds(recordingSeconds)})</span>
                    </div>
                    {/* Audio wave simulation */}
                    <div className="flex items-center justify-center gap-1 h-6">
                      {[30, 60, 90, 45, 80, 50, 95, 40, 70].map((h, i) => (
                        <div
                          key={i}
                          style={{ height: `${h}%` }}
                          className="w-1 bg-rose-500 rounded-full animate-bounce"
                        />
                      ))}
                    </div>
                    <div className="flex items-center justify-center gap-2 mt-3">
                      <button
                        onClick={stopRecording}
                        className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow hover:bg-emerald-700 transition"
                      >
                        Stop & Transcribe
                      </button>
                      <button
                        onClick={cancelRecording}
                        className="px-3 py-1.5 rounded-xl bg-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-300 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : isTranscribing ? (
                  <div className="flex items-center justify-center gap-2 text-emerald-700 text-xs font-semibold py-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Transcribing with gemini-3.5-transcribe...</span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-slate-800">
                      Tap the microphone to begin speaking
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Ask about admissions, examinations, bus timings, or village placement programme
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Transcription Result Card */}
            {lastTranscribedText && (
              <div className="mt-5 p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-emerald-900 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    Transcription Output (gemini-3.5-transcribe)
                  </span>
                  <button
                    onClick={copyTranscription}
                    className="flex items-center gap-1 text-[11px] text-emerald-700 hover:text-emerald-800 font-semibold px-2 py-0.5 rounded bg-emerald-100 hover:bg-emerald-200/60 transition"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-800 leading-relaxed bg-white p-3 rounded-xl border border-emerald-100 font-sans select-all">
                  "{lastTranscribedText}"
                </p>
                <div className="flex items-center justify-end gap-2 mt-3">
                  <button
                    onClick={() => {
                      setInput(lastTranscribedText);
                      setActiveTab('chat');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white border border-emerald-300 text-emerald-700 text-xs font-bold hover:bg-emerald-50 transition"
                  >
                    Edit in Chat
                  </button>
                  <button
                    onClick={() => {
                      handleSend(lastTranscribedText, true);
                      setActiveTab('chat');
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow hover:bg-emerald-700 flex items-center gap-1 transition"
                  >
                    <span>Send to RuralGPT</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Voice Prompt Suggestions */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <h4 className="text-xs font-bold text-slate-700 mb-2">Suggested Queries to Dictate:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {[
                'When does the November semester exam timetable release?',
                'Explain the NAAC A++ accreditation status and CGPA of GRI.',
                'What are the research facilities at the Instructional Farm?',
                'Who was the founding director of Gandhigram Rural Institute?',
              ].map((query, i) => (
                <button
                  key={i}
                  onClick={() => {
                    handleSend(query);
                    setActiveTab('chat');
                  }}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-200/70 hover:border-emerald-200 text-left transition"
                >
                  "{query}"
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Transcription Feedback Status Bar */}
      {transcriptionNotice && (
        <div className="px-4 py-1.5 bg-emerald-900 text-white text-[11px] flex items-center justify-between">
          <span className="truncate mr-2">{transcriptionNotice}</span>
          <button 
            onClick={() => setTranscriptionNotice(null)}
            className="text-emerald-300 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Input Bar with Voice Transcription Mic Button */}
      <div className="p-3 sm:p-4 bg-white border-t border-slate-200 pb-safe">
        {/* Quick chip queries */}
        <div className="flex gap-2 overflow-x-auto pb-2.5 scrollbar-hide text-xs">
          {['Timetable & Hall Ticket', 'Library OPAC & Timings', 'Hostel Mess Regulations', 'VPP Placement'].map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              className="px-3 py-1 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 font-medium rounded-full border border-slate-200 whitespace-nowrap transition"
            >
              {q}
            </button>
          ))}
        </div>

        {isRecording ? (
          /* Active Recording State Bar */
          <div className="flex items-center justify-between p-2 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 animate-pulse">
            <div className="flex items-center gap-2 pl-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
              <span className="text-xs font-bold">Recording Speech ({formatSeconds(recordingSeconds)})</span>
              <span className="text-[10px] text-rose-500 font-mono hidden sm:inline">Will transcribe with gemini-3.5-transcribe</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={cancelRecording}
                className="p-2 rounded-xl bg-white hover:bg-rose-100 text-rose-600 transition"
                title="Cancel"
              >
                <X className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={stopRecording}
                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1 shadow transition"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Transcribe</span>
              </button>
            </div>
          </div>
        ) : isTranscribing ? (
          /* Active Transcribing Progress State */
          <div className="flex items-center justify-center p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
            <span>Transcribing audio with <strong className="font-mono">gemini-3.5-transcribe</strong>...</span>
          </div>
        ) : (
          /* Standard Input with Mic Button */
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center gap-2"
          >
            {/* Microphone Button for Transcription (gemini-3.5-transcribe) */}
            <button
              type="button"
              onClick={startRecording}
              className="p-3 rounded-2xl bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-700 border border-slate-200 transition shrink-0 relative group"
              title="Record and transcribe speech using gemini-3.5-transcribe"
            >
              <Mic className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
              <span className="sr-only">Record Microphone Speech</span>
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message RuralGPT or dictate using the mic..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
            />

            <button 
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-12 h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl flex items-center justify-center shadow-md shadow-emerald-700/20 disabled:opacity-40 transition shrink-0"
              title="Send message"
            >
              <Send className="w-5 h-5 ml-0.5" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
