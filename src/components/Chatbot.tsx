import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ai } from '../lib/gemini';
import ReactMarkdown from 'react-markdown';
import { GenerateContentResponse } from '@google/genai';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Hello! I'm Viola, your virtual assistant. How can I help you learn more about Viola Quality Academy and our CBC programs today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      if (!chatRef.current) {
        chatRef.current = ai.chats.create({
          model: "gemini-3-flash-preview",
          config: {
            systemInstruction: "You are Viola, the virtual assistant for Viola Quality Academy, a modern CBC-aligned school in Kenya. You are helpful, professional, and knowledgeable about the Competency Based Curriculum (CBC). You help parents with admissions, explain the school's vision, and provide information about academic programs from PP1 to Junior Secondary.",
            tools: [{ googleSearch: {} }],
          },
        });
      }

      const response: GenerateContentResponse = await chatRef.current.sendMessage({
        message: userMessage,
      });
      
      const text = response.text;

      setMessages(prev => [...prev, { role: 'model', text: text || "I'm sorry, I couldn't generate a response." }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'model', text: "I'm sorry, I'm having a bit of trouble connecting. Please try again later or contact us directly!" }]);
      // Reset chat on error to allow recovery
      chatRef.current = null;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 flex h-[500px] w-[350px] flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xl sm:w-[400px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-stone-900 p-4 text-white">
              <div className="flex items-center space-x-2">
                <Bot className="h-6 w-6" />
                <div>
                  <h3 className="text-sm font-bold">Viola Assistant</h3>
                  <p className="text-[10px] text-stone-400">Online | CBC Expert</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="rounded-full p-1 hover:bg-stone-800">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                      m.role === 'user'
                        ? 'bg-stone-900 text-white'
                        : 'bg-stone-100 text-stone-800'
                    }`}
                  >
                    <div className="prose prose-sm prose-stone max-w-none dark:prose-invert">
                      <ReactMarkdown>{m.text}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-stone-100 px-4 py-2 text-sm text-stone-500">
                    Thinking...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-stone-100 p-4">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about admissions, CBC..."
                  className="flex-1 bg-transparent text-sm focus:outline-none"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading}
                  className="rounded-full bg-stone-900 p-2 text-white transition-transform hover:scale-110 active:scale-90 disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-stone-900 text-white shadow-lg transition-transform hover:scale-110 active:scale-95"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </button>
    </div>
  );
}
