import React, { useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat window */}
      {isOpen && (
        <div className="mb-4 w-80 h-96 bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 fade-in duration-300">
          {/* Header */}
          <div className="bg-blue-600 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <MessageSquare size={16} className="text-white" />
              </div>
              <div className="leading-tight">
                <h4 className="text-white font-bold text-sm">Support Chat</h4>
                <p className="text-white/70 text-xs">Always online</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:bg-white/10 p-1 rounded-lg transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Messages area */}
          <div className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto bg-gradient-to-b from-slate-900/50 to-slate-950/50">
            <div className="bg-slate-800/80 rounded-2xl p-3 text-sm text-slate-200 max-w-[85%] self-start border border-white/5">
              Hello! How can we help you with your BloomAudit Dashboard today?
            </div>
            <div className="bg-blue-600 rounded-2xl p-3 text-sm text-white max-w-[85%] self-end shadow-lg shadow-blue-500/10">
              I have a question about my current plan features.
            </div>
          </div>

          {/* Input area */}
          <div className="p-4 bg-slate-900/80 border-t border-white/5 flex gap-2">
            <input 
              type="text" 
              placeholder="Type your message..." 
              className="flex-1 bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-600/20">
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-600/40 hover:scale-110 active:scale-90 transition-all group"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} className="group-hover:rotate-12 transition-transform" />}
      </button>
    </div>
  );
};

export default ChatWidget;
