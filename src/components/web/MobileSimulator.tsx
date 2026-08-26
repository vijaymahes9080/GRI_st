import React, { useState } from 'react';
import { useAppStore } from '../../core/store/appStore';
import { 
  Home, 
  Compass, 
  Layers, 
  Bell, 
  Bot, 
  User, 
  Search, 
  GraduationCap, 
  Sparkles, 
  ChevronRight, 
  Calendar, 
  BookOpen, 
  Award,
  Flame,
  ArrowLeft,
  Printer,
  Radio,
  MapPin,
  Send,
  Navigation
} from 'lucide-react';
import { INSTITUTION_INFO, INITIAL_CIRCULARS, SCHOOLS_DATA, EXAM_SCHEDULE_MOCK } from '../../core/data/griMasterData';
import { ExamHallTicketModal } from './ExamHallTicketModal';
import { LiveVoiceConversationModal } from '../common/LiveVoiceConversationModal';
import { CampusMapsExplorerModal } from '../common/CampusMapsExplorerModal';
import { GRIEmblem } from '../common/GRIEmblem';

export const MobileSimulator: React.FC = () => {
  const { currentUser, circulars } = useAppStore();
  const [mobileTab, setMobileTab] = useState<'home' | 'academics' | 'exams' | 'alerts' | 'ruralgpt'>('home');
  const [isHallTicketOpen, setIsHallTicketOpen] = useState(false);
  const [selectedMobileDept, setSelectedMobileDept] = useState<any>(null);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isMapsOpen, setIsMapsOpen] = useState(false);
  const [mobileChatInput, setMobileChatInput] = useState('');
  const [mobileChatMessages, setMobileChatMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string }>>([
    {
      sender: 'bot',
      text: `Vanakkam ${currentUser.name}! I am GRI RuralGPT. Ask me anything about admissions, ESE exams, syllabus, or live voice!`,
    },
  ]);
  const [isMobileChatLoading, setIsMobileChatLoading] = useState(false);

  const handleMobileSend = async (queryText?: string) => {
    const text = queryText || mobileChatInput;
    if (!text.trim() || isMobileChatLoading) return;

    setMobileChatMessages(prev => [...prev, { sender: 'user', text }]);
    if (!queryText) setMobileChatInput('');
    setIsMobileChatLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: text }],
          userRole: `${currentUser.name} (${currentUser.role}, ${currentUser.department})`,
          persona: 'general',
        }),
      });

      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      setMobileChatMessages(prev => [...prev, { sender: 'bot', text: data.reply || 'Answer received.' }]);
    } catch {
      setMobileChatMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: `GRI Knowledge: "${text}" is verified. For immediate assistance, contact Registrar (gru@ruraluniv.ac.in) or use our Campus Maps Navigation.`,
        },
      ]);
    } finally {
      setIsMobileChatLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-6 min-h-[85vh]">
      <div className="text-center mb-4 space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 text-xs font-semibold border border-emerald-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span>Interactive GRI Android App Simulation</span>
        </div>
        <p className="text-xs text-slate-400">
          Preview the native mobile UI experience designed for students, faculty & researchers on Android devices
        </p>
      </div>

      {/* Android Device Shell */}
      <div className="w-[375px] h-[780px] bg-slate-950 rounded-[48px] border-[10px] border-slate-800 shadow-2xl overflow-hidden flex flex-col relative">
        {/* Device Speaker & Camera Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-5 bg-slate-800 rounded-b-xl z-50 flex items-center justify-center">
          <div className="w-10 h-1.5 bg-slate-900 rounded-full"></div>
          <div className="w-2.5 h-2.5 bg-slate-900 rounded-full ml-3 border border-slate-700"></div>
        </div>

        {/* Mobile Status Bar */}
        <div className="bg-slate-950 px-6 pt-6 pb-2 text-[10px] text-slate-400 flex items-center justify-between z-40 border-b border-slate-900">
          <span>09:41</span>
          <div className="flex items-center space-x-1 text-slate-400 font-mono">
            <span>5G</span>
            <span>•</span>
            <span>98%</span>
          </div>
        </div>

        {/* Mobile App Header */}
        <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <GRIEmblem className="w-8 h-8 flex-shrink-0" />
            <div>
              <h2 className="text-xs font-bold text-white leading-tight">Gandhigram Rural Inst.</h2>
              <p className="text-[10px] text-emerald-400">NAAC A++ Deemed University</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsVoiceOpen(true)}
              className="w-7 h-7 rounded-full bg-emerald-950 border border-emerald-600 text-emerald-400 flex items-center justify-center text-[10px]"
              title="Start Live Voice"
            >
              <Radio className="w-3.5 h-3.5 animate-pulse" />
            </button>
            <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-white">
              {currentUser.name.charAt(0)}
            </div>
          </div>
        </div>

        {/* Mobile Body Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-slate-200 text-xs bg-slate-950">
          {/* SCREEN 1: Mobile Home */}
          {mobileTab === 'home' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Urgent banner */}
              <div className="p-3 rounded-2xl bg-gradient-to-r from-rose-950 via-slate-900 to-amber-950 border border-rose-900/60 space-y-1">
                <div className="flex items-center gap-1 text-[10px] font-bold text-rose-400 uppercase">
                  <Flame className="w-3 h-3 animate-pulse" />
                  <span>Important University Circular</span>
                </div>
                <h4 className="font-bold text-white text-xs line-clamp-1">{INITIAL_CIRCULARS[0].title}</h4>
                <p className="text-[10px] text-slate-400">{INITIAL_CIRCULARS[0].publishDate}</p>
              </div>

              {/* User greeting pill */}
              <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400">Logged in as</span>
                  <div className="font-bold text-white text-xs">{currentUser.name}</div>
                  <span className="text-[10px] text-emerald-400 capitalize">{currentUser.role} • {currentUser.department}</span>
                </div>
                {currentUser.cgpa && (
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500">CGPA</span>
                    <div className="font-bold text-amber-400 text-sm">{currentUser.cgpa}</div>
                  </div>
                )}
              </div>

              {/* Quick Action Tiles 2x2 */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => setMobileTab('exams')}
                  className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500 text-left space-y-1.5 transition"
                >
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <div className="font-bold text-white text-xs">ESE Exams</div>
                  <p className="text-[10px] text-slate-400">Timetable & Hall Ticket</p>
                </button>

                <button
                  onClick={() => setMobileTab('academics')}
                  className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500 text-left space-y-1.5 transition"
                >
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <div className="font-bold text-white text-xs">28 Departments</div>
                  <p className="text-[10px] text-slate-400">Courses & Syllabus</p>
                </button>

                <button
                  onClick={() => setIsVoiceOpen(true)}
                  className="p-3 rounded-2xl bg-emerald-950/70 border border-emerald-600/60 hover:border-emerald-400 text-left space-y-1.5 transition"
                >
                  <Radio className="w-4 h-4 text-emerald-300 animate-pulse" />
                  <div className="font-bold text-white text-xs">Live Voice Call</div>
                  <p className="text-[10px] text-emerald-300">Gemini 3.1 Live Audio</p>
                </button>

                <button
                  onClick={() => setIsMapsOpen(true)}
                  className="p-3 rounded-2xl bg-sky-950/70 border border-sky-600/60 hover:border-sky-400 text-left space-y-1.5 transition"
                >
                  <MapPin className="w-4 h-4 text-sky-300" />
                  <div className="font-bold text-white text-xs">Campus Maps</div>
                  <p className="text-[10px] text-sky-300">Google Grounding</p>
                </button>
              </div>
            </div>
          )}

          {/* SCREEN 2: Academics */}
          {mobileTab === 'academics' && (
            <div className="space-y-3 animate-fadeIn">
              <h3 className="font-bold text-white text-sm">Schools & Departments</h3>
              {selectedMobileDept ? (
                <div className="space-y-3 p-3 bg-slate-900 rounded-2xl border border-slate-800">
                  <button
                    onClick={() => setSelectedMobileDept(null)}
                    className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    <span>Back to all departments</span>
                  </button>
                  <h4 className="font-bold text-white text-xs">{selectedMobileDept.name}</h4>
                  <div className="text-[10px] text-slate-400 space-y-1">
                    <div>HoD: {selectedMobileDept.head}</div>
                    <div>Location: {selectedMobileDept.location}</div>
                  </div>
                  <div className="pt-2 border-t border-slate-800 space-y-1">
                    <span className="font-bold text-white text-[10px]">Programmes:</span>
                    {selectedMobileDept.programmes.map((p: any, i: number) => (
                      <div key={i} className="p-1.5 bg-slate-950 rounded text-[10px] text-slate-300">
                        {p.name} ({p.level}) - {p.duration}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {SCHOOLS_DATA.map((school) => (
                    <div key={school.id} className="space-y-1">
                      <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                        {school.name}
                      </div>
                      {school.departments.map((dept) => (
                        <div
                          key={dept.code}
                          onClick={() => setSelectedMobileDept(dept)}
                          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center cursor-pointer"
                        >
                          <div>
                            <div className="font-semibold text-white text-xs">{dept.name}</div>
                            <span className="text-[10px] text-slate-400">{dept.programmes.length} Programmes • HoD: {dept.head}</span>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SCREEN 3: Exams */}
          {mobileTab === 'exams' && (
            <div className="space-y-3 animate-fadeIn">
              <div className="p-3 rounded-2xl bg-emerald-950 border border-emerald-800 space-y-2">
                <h4 className="font-bold text-white text-xs">November / December 2026 ESE</h4>
                <p className="text-[10px] text-emerald-200">Official Admit card available for candidate verification.</p>
                <button
                  onClick={() => setIsHallTicketOpen(true)}
                  className="w-full py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>View Official Hall Ticket</span>
                </button>
              </div>

              <h4 className="font-bold text-white text-xs pt-1">Timetable:</h4>
              <div className="space-y-2">
                {EXAM_SCHEDULE_MOCK.slice(0, 4).map((ex, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="font-mono text-emerald-400 font-bold">{ex.courseCode}</span>
                      <span className="text-amber-400 font-semibold">{ex.examDate}</span>
                    </div>
                    <div className="font-semibold text-white text-xs">{ex.subjectTitle}</div>
                    <div className="text-[10px] text-slate-400">{ex.session} • {ex.hall}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SCREEN 4: Alerts */}
          {mobileTab === 'alerts' && (
            <div className="space-y-2.5 animate-fadeIn">
              <h3 className="font-bold text-white text-sm">Official Circulars</h3>
              {circulars.map((c) => (
                <div key={c.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="font-bold px-1.5 py-0.2 rounded bg-slate-800 text-emerald-400">{c.category}</span>
                    <span className="text-slate-500">{c.publishDate}</span>
                  </div>
                  <h4 className="font-semibold text-white text-xs">{c.title}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{c.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* SCREEN 5: RuralGPT AI with real chat & voice shortcut */}
          {mobileTab === 'ruralgpt' && (
            <div className="space-y-3 animate-fadeIn flex flex-col h-[520px]">
              <div className="p-2.5 rounded-2xl bg-amber-950/70 border border-amber-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-amber-300 font-bold text-xs">
                  <Bot className="w-4 h-4" />
                  <span>GRI RuralGPT</span>
                </div>
                <button
                  onClick={() => setIsVoiceOpen(true)}
                  className="px-2 py-0.5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center gap-1"
                >
                  <Radio className="w-3 h-3 animate-pulse" />
                  <span>Voice</span>
                </button>
              </div>

              {/* Chat Thread */}
              <div className="flex-1 overflow-y-auto space-y-2 p-1">
                {mobileChatMessages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[88%] rounded-xl p-2 text-[11px] leading-relaxed ${
                        m.sender === 'user'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-900 border border-slate-800 text-slate-200'
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
                {isMobileChatLoading && (
                  <div className="p-2 text-[10px] text-slate-400 italic">
                    GRI RuralGPT thinking...
                  </div>
                )}
              </div>

              {/* Prompts */}
              <div className="flex gap-1 overflow-x-auto pb-1 text-[10px]">
                {['MCA Fee?', 'ESE Nov 2026', 'Campus directions'].map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleMobileSend(q)}
                    className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg whitespace-nowrap border border-slate-800"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleMobileSend();
                }}
                className="flex items-center gap-1.5 pt-1"
              >
                <input
                  type="text"
                  value={mobileChatInput}
                  onChange={(e) => setMobileChatInput(e.target.value)}
                  placeholder="Ask RuralGPT..."
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white placeholder-slate-500 outline-none"
                />
                <button
                  type="submit"
                  className="p-2 rounded-xl bg-emerald-600 text-white"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Mobile Bottom Navigation Bar */}
        <div className="bg-slate-900 border-t border-slate-800 px-2 py-2 flex items-center justify-around text-[10px]">
          {[
            { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
            { id: 'academics', label: 'Academics', icon: <Compass className="w-4 h-4" /> },
            { id: 'exams', label: 'Exams', icon: <Layers className="w-4 h-4" /> },
            { id: 'alerts', label: 'Alerts', icon: <Bell className="w-4 h-4" /> },
            { id: 'ruralgpt', label: 'AI Chat', icon: <Bot className="w-4 h-4" /> },
          ].map((tab) => {
            const isActive = mobileTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setMobileTab(tab.id as any);
                  setSelectedMobileDept(null);
                }}
                className={`flex flex-col items-center py-1 px-2 rounded-lg transition ${
                  isActive ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.icon}
                <span className="mt-0.5">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Android Navigation Pill */}
        <div className="bg-slate-950 pb-2 flex justify-center">
          <div className="w-28 h-1 bg-slate-700 rounded-full"></div>
        </div>
      </div>

      {/* Hall ticket modal for mobile sim */}
      <ExamHallTicketModal
        isOpen={isHallTicketOpen}
        onClose={() => setIsHallTicketOpen(false)}
      />

      <LiveVoiceConversationModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
      />

      <CampusMapsExplorerModal
        isOpen={isMapsOpen}
        onClose={() => setIsMapsOpen(false)}
      />
    </div>
  );
};
