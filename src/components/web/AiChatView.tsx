import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  User, 
  Sparkles, 
  RefreshCw, 
  Copy, 
  Check, 
  Cpu, 
  GraduationCap, 
  Scroll, 
  Compass
} from 'lucide-react';
import { useAppStore } from '../../core/store/appStore';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  modelUsed?: string;
}

type AssistantPersona = 'general' | 'academic' | 'exam' | 'gandhian';

const PERSONAS: { id: AssistantPersona; name: string; icon: any; description: string }[] = [
  { 
    id: 'general', 
    name: 'GRI RuralGPT', 
    icon: Bot, 
    description: 'Admissions, general rules, fees, hostel, campus infrastructure' 
  },
  { 
    id: 'academic', 
    name: 'Academic Counselor', 
    icon: GraduationCap, 
    description: 'Schools, 28+ departments, syllabi, CBCS credits, research grants' 
  },
  { 
    id: 'exam', 
    name: 'ESE Exam Specialist', 
    icon: Scroll, 
    description: 'Timetables, hall tickets, CIA internals, e-Sanad verification' 
  },
  { 
    id: 'gandhian', 
    name: 'Shanti Sena & Nai Talim', 
    icon: Compass, 
    description: 'Gandhian philosophy, village fieldwork, community peace corps' 
  },
];

const PRESET_QUESTIONS = [
  'What are the eligibility and fee structure for MCA / M.Sc Computer Science?',
  'When are the End Semester Examinations (ESE) Nov/Dec 2026 scheduled?',
  'Explain the founding vision of Dr. T.S. Soundram and Dr. G. Ramachandran.',
  'How does the Shanti Sena (Peace Brigade) train university students?',
  'What research facilities exist in the Chemistry & Physics departments?',
  'How do I apply for Hostel accommodation and how does the mess dividing system work?',
];

const createMessage = (sender: 'user' | 'assistant', text: string, modelUsed?: string): ChatMessage => {
  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  return {
    id: `msg-${Math.random().toString(36).slice(2, 9)}`,
    sender,
    text,
    timestamp: timeStr,
    modelUsed,
  };
};

export const AiChatView: React.FC = () => {
  const { currentUser } = useAppStore();
  const [selectedPersona, setSelectedPersona] = useState<AssistantPersona>('general');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: `Vanakkam ${currentUser.name}! I am **GRI RuralGPT**, your AI Institutional Assistant for **The Gandhigram Rural Institute (Deemed to be University)**.\n\nI am connected to the real-time university database covering all 7 Schools, 28 Departments, End Semester Examinations, Admissions 2026-27, Samarth ERP integration, and Gandhian Peace Studies.\n\nHow can I help you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: 'gemini-2.5-flash',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSend = async (textToSend?: string) => {
    const queryText = textToSend || input;
    if (!queryText.trim() || isLoading) return;

    const userMessage = createMessage('user', queryText);
    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      // Send conversational multi-turn thread to backend /api/chat
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({
            role: m.sender,
            content: m.text,
          })),
          userRole: `${currentUser.name} (${currentUser.role}, ${currentUser.department})`,
          persona: selectedPersona,
          preferredModel: selectedPersona === 'academic' || selectedPersona === 'exam' ? 'complex' : 'standard',
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();
      const botMessage = createMessage('assistant', data.reply || 'No response received from GRI institutional server.', data.model || 'gemini-2.5-flash');
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.warn('[Chat Error, utilizing client intelligence]', error);
      // Client-side institutional fallback
      const fallbackReply = generateClientInstitutionalAnswer(queryText, currentUser.role);
      const botMessage = createMessage('assistant', fallbackReply, 'institutional-cache');
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateClientInstitutionalAnswer = (query: string, role: string): string => {
    const q = query.toLowerCase();
    if (q.includes('mca') || q.includes('computer') || q.includes('data science')) {
      return `### **Department of Computer Science & Applications (School of Sciences)**\n\n- **MCA (Master of Computer Applications)**: 2 Years duration, 60 Intake, Fee: ₹24,000 / semester.\n- **M.Sc. Computer Science (AI & Data Science)**: 2 Years duration, 30 Intake, Fee: ₹19,500 / semester.\n- **B.Sc. Computer Science**: 3 Years duration, 40 Intake, Fee: ₹12,000 / semester.\n- **Facilities**: NVIDIA High Performance Computing Cluster, Cloud & IoT Lab, Network Simulator.\n- **Head of Department**: Dr. R. Ramanathan, Professor & Head.`;
    }
    if (q.includes('exam') || q.includes('ese') || q.includes('hall ticket') || q.includes('timetable')) {
      return `### **End Semester Examinations (ESE) Nov/Dec 2026**\n\n- **Timetable Status**: Published and available under the *Services* tab.\n- **Forenoon Session (FN)**: 09:30 AM – 12:30 PM\n- **Afternoon Session (AN)**: 02:00 PM – 05:00 PM\n- **Hall Tickets**: Generated online via Samarth portal integration with mandatory QR-code verification.\n- **Controller of Examinations**: Dr. M. Senthilvel (coe@ruraluniv.ac.in).`;
    }
    if (q.includes('soundram') || q.includes('history') || q.includes('founder') || q.includes('gandhi')) {
      return `### **The Gandhigram Rural Institute History & Founders**\n\n- **Founders**: Dr. T.S. Soundram and Dr. G. Ramachandran founded Gandhigram in 1956 under the blessings of Mahatma Gandhi.\n- **Deemed to be University**: Conferred status under Section 3 of UGC Act in 1976.\n- **Accreditation**: NAAC **'A++'** Grade (CGPA: 3.61).\n- **Campus**: 204 serene acres situated at the foothills of Sirumalai hills in Gandhigram, Dindigul, Tamil Nadu.`;
    }
    return `Thank you for your enquiry regarding **"${query}"**.\n\nFor official administrative confirmation:\n- **Admissions Portal**: https://griadmission.samarth.edu.in\n- **Registrar Desk**: gru@ruraluniv.ac.in / +91-451-2452371\n- **Controller of Examinations**: coe@ruraluniv.ac.in\n\nFeel free to ask about any specific department, fee structure, or hostel facilities!`;
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-600/40 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Gemini-Powered Multi-Turn Institutional Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
            GRI RuralGPT Assistant
          </h1>
          <p className="text-sm text-slate-400">
            Real-time conversational answers for admissions, examination rules, syllabi, fee structures, and Gandhian peace studies.
          </p>
        </div>

        <button
          onClick={() =>
            setMessages([
              {
                id: 'msg-1',
                sender: 'assistant',
                text: `Vanakkam ${currentUser.name}! Chat thread refreshed. What would you like to explore regarding The Gandhigram Rural Institute?`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                modelUsed: 'gemini-2.5-flash',
              },
            ])
          }
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold hover:bg-slate-800 transition self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Clear Thread</span>
        </button>
      </div>

      {/* Role / Persona Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {PERSONAS.map((p) => {
          const Icon = p.icon;
          const isSelected = selectedPersona === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setSelectedPersona(p.id)}
              className={`p-3 rounded-2xl text-left border transition flex flex-col justify-between ${
                isSelected
                  ? 'bg-emerald-950/50 border-emerald-500 text-white shadow-lg shadow-emerald-950/50'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span className="text-xs font-bold">{p.name}</span>
              </div>
              <p className="text-[10px] text-slate-400 line-clamp-2 leading-tight">
                {p.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Preset Questions Chips */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
          Suggested Institutional Topics:
        </span>
        <div className="flex flex-wrap gap-2">
          {PRESET_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-left text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-emerald-300 border border-slate-800 hover:border-emerald-500/40 px-3 py-1.5 rounded-xl transition"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[580px]">
        {/* Top Status Bar */}
        <div className="px-4 py-2.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Active Persona: <strong className="text-slate-200">{PERSONAS.find(p => p.id === selectedPersona)?.name}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono">
            <Cpu className="w-3.5 h-3.5" />
            <span>Gemini AI Connected</span>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isBot = msg.sender === 'assistant';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isBot ? 'justify-start' : 'justify-end'}`}
              >
                {isBot && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-600 to-amber-600 flex items-center justify-center text-white flex-shrink-0 shadow-md">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-2xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed relative group ${
                    isBot
                      ? 'bg-slate-950 border border-slate-800 text-slate-200 shadow-md'
                      : 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans prose prose-invert max-w-none text-xs sm:text-sm">
                    {msg.text}
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60 text-[10px]">
                    <span className={isBot ? 'text-slate-500 font-mono' : 'text-emerald-200'}>
                      {msg.modelUsed ? `Engine: ${msg.modelUsed}` : ''}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={isBot ? 'text-slate-500' : 'text-emerald-200'}>
                        {msg.timestamp}
                      </span>
                      {isBot && (
                        <button
                          onClick={() => handleCopy(msg.id, msg.text)}
                          className="text-slate-400 hover:text-white p-0.5 rounded transition"
                          title="Copy response"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {!isBot && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 flex-shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-600 to-amber-600 flex items-center justify-center text-white flex-shrink-0 animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse delay-100"></span>
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse delay-200"></span>
                <span className="ml-1">Querying GRI RuralGPT AI Knowledge Base...</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Bottom Input Field */}
        <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about admissions, examination rules, syllabi, hostels, fee structures, Shanti Sena..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-emerald-500 transition"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-xs sm:text-sm flex items-center gap-2 transition shadow-lg shadow-emerald-900/40"
            >
              <span>Ask</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
