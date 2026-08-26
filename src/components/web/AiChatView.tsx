import React, { useState } from 'react';
import { useAppStore } from '../../core/store/appStore';
import { Bot, Send, User, Sparkles } from 'lucide-react';

export const AiChatView: React.FC = () => {
  const { currentUser } = useAppStore();
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string }>>([
    {
      sender: 'bot',
      text: `Hello ${currentUser.name.split(' ')[0]}! I am GRI RuralGPT. How can I assist you with your academic inquiries today?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (query?: string) => {
    const text = query || input;
    if (!text.trim() || isLoading) return;

    setMessages(prev => [...prev, { sender: 'user', text }]);
    if (!query) setInput('');
    setIsLoading(true);

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
      setMessages(prev => [...prev, { sender: 'bot', text: data.reply }]);
    } catch {
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            sender: 'bot',
            text: `I understood "${text}". However, the live AI service is currently unavailable. Please check the notices for official updates.`,
          },
        ]);
        setIsLoading(false);
      }, 1000);
      return;
    } 
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]  max-w-md mx-auto relative">
      <div className="px-5 pt-4 pb-2 bg-white sticky top-0 z-10 border-b border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2">
          RuralGPT <Sparkles className="w-5 h-5 text-emerald-500" />
        </h2>
        <p className="text-sm text-gray-500">GRI Intelligence Assistant</p>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.sender === 'bot' && (
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center mr-2 shrink-0 self-end mb-1">
                <Bot className="w-4 h-4 text-emerald-700" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
              m.sender === 'user' 
                ? 'bg-emerald-600 text-white rounded-br-sm shadow-sm' 
                : 'bg-gray-100 text-gray-800 rounded-bl-sm'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center mr-2 shrink-0 self-end mb-1">
              <Bot className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="bg-gray-100 rounded-2xl rounded-bl-sm p-4 text-sm text-gray-400 italic">
              Typing...
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-gray-100 pb-safe">
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
          {['Timetable?', 'Library timings', 'Exam results'].map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              className="px-4 py-1.5 bg-gray-50 text-emerald-700 text-xs font-bold rounded-full border border-gray-200 whitespace-nowrap"
            >
              {q}
            </button>
          ))}
        </div>
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message RuralGPT..."
            className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-md disabled:opacity-50"
          >
            <Send className="w-5 h-5 ml-1" />
          </button>
        </form>
      </div>
    </div>
  );
};
