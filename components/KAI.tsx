'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles } from 'lucide-react';
import { getKaiResponse, ChatMessage } from '@/lib/kaiEngine';
import { useRocket } from '@/components/RocketContext';

export function KAI() {
  const { loadingState, isKaiOpen: isOpen, setIsKaiOpen: setIsOpen } = useRocket();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isVisible =
    loadingState === 'revealing' ||
    loadingState === 'cursor_returning' ||
    loadingState === 'ready';

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          sender: 'kai',
          text: `Hello! I'm KAI, Gangaji Karthikeyan's Portfolio Intelligence System.

I can answer questions regarding his:
• Skills & Technologies
• Projects (like VideoMind, Taskifier)
• Internships & Experience
• Education & CGPA
• Resume & Contact info

How can I help you today?`,
          timestamp: new Date(),
          suggestions: [
            'What is his CGPA?',
            'Does he know Docker?',
            'Tell me about VideoMind',
            'How can I contact him?'
          ]
        }
      ]);
    }
  }, [messages]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Add user message
    const userMsg: ChatMessage = {
      sender: 'user',
      text: textToSend,
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const result = getKaiResponse(textToSend);
      const kaiMsg: ChatMessage = {
        sender: 'kai',
        text: result.response,
        timestamp: new Date(),
        suggestions: result.suggestions
      };
      setMessages((prev) => [...prev, kaiMsg]);
      setIsTyping(false);
    }, 600);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 260, damping: 20 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-40 bg-black/60 hover:bg-black/80 backdrop-blur-xl border border-white/20 hover:border-red-500/50 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-colors group"
        aria-label="Toggle KAI Assistant"
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Pulsing ring */}
          <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping group-hover:bg-red-500/30 scale-95" />
          
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                key="bot"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center"
              >
                <Bot className="w-6 h-6 text-red-500 group-hover:text-white transition-colors" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.button>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="fixed bottom-24 right-4 sm:right-8 z-40 w-[92vw] sm:w-[400px] h-[550px] bg-black/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-3xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/30">
                  <Bot className="w-5 h-5 text-red-500" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-black animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-wider">KAI</h3>
                  <p className="text-[10px] text-white/50 tracking-wider">PORTFOLIO INTELLIGENCE SYSTEM</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/40 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages body */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-4 py-3 text-sm whitespace-pre-line leading-relaxed shadow-lg ${
                      msg.sender === 'user'
                        ? 'bg-red-950/40 border border-red-500/30 text-white rounded-tr-none'
                        : 'bg-white/5 border border-white/10 text-white/90 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 rounded-xl rounded-tl-none px-4 py-3 flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions Chips */}
            {messages.length > 0 && messages[messages.length - 1].suggestions && (
              <div className="px-5 py-2 flex flex-wrap gap-1.5 max-h-[85px] overflow-y-auto bg-black/20 border-t border-white/5">
                {messages[messages.length - 1].suggestions?.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(suggestion)}
                    className="flex items-center gap-1 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-red-500/30 text-[11px] text-white/80 hover:text-white px-3 py-1.5 rounded-full transition-all"
                  >
                    <Sparkles className="w-3 h-3 text-red-500/70" />
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {/* Input form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(input);
              }}
              className="p-4 border-t border-white/10 bg-white/5 flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me about my projects, skills, internship..."
                className="flex-1 bg-black/40 border border-white/10 hover:border-white/20 focus:border-red-500/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:hover:bg-red-600 text-white p-2.5 rounded-xl transition-all flex items-center justify-center shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
