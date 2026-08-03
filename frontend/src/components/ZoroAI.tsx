import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { useUIStore } from '../stores/uiStore';
import { aiService } from '../api/services';
import { cn } from '../utils/cn';
import type { ChatMessage } from '../types';

const suggestions = [
  'Trouve-moi des œuvres africaines modernes',
  'Explique-moi cette œuvre',
  'Quelles expositions sont à venir ?',
  'Qui sont les artistes tendances ?',
];

export function ZoroAI() {
  const { isAiOpen, toggleAi, closeAi } = useUIStore();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Bonjour, je suis Zoro, votre assistant culturel. Comment puis-je vous guider aujourd'hui ?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading]);

  const send = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await aiService.ask(content);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.answer,
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Je suis désolé, je ne peux pas répondre pour le moment. Veuillez réessayer.',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={toggleAi}
        className={cn(
          'fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-105',
          isAiOpen ? 'bg-obsidian text-ivory' : 'bg-gold text-obsidian'
        )}
      >
        {isAiOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      <AnimatePresence>
        {isAiOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6 z-40 w-full max-w-sm bg-ivory rounded-2xl shadow-2xl border border-obsidian/10 overflow-hidden"
          >
            <div className="bg-obsidian p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-obsidian" />
                </div>
                <div>
                  <h3 className="text-ivory font-serif">Zoro AI</h3>
                  <p className="text-ivory/60 text-xs">Assistant culturel</p>
                </div>
              </div>
              <button onClick={closeAi} className="text-ivory/60 hover:text-ivory">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div ref={scrollRef} className="h-80 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                  <div
                    className={cn(
                      'max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed',
                      msg.role === 'user' ? 'bg-gold text-obsidian rounded-br-none' : 'bg-cream text-obsidian rounded-bl-none'
                    )}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-cream p-3 rounded-2xl rounded-bl-none flex items-center gap-2">
                    <span className="w-2 h-2 bg-gold rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-gold rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 bg-gold rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}

              {messages.length === 1 && !isLoading && (
                <div className="grid grid-cols-1 gap-2 pt-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="text-left px-3 py-2 text-xs bg-cream hover:bg-gold/20 rounded-lg text-obsidian/80 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="p-4 border-t border-obsidian/10 flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Posez votre question..."
                className="flex-1 px-4 py-2.5 bg-cream rounded-full text-sm text-obsidian placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-gold"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-2.5 bg-gold text-obsidian rounded-full disabled:opacity-50 hover:bg-gold-light transition-colors"
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
