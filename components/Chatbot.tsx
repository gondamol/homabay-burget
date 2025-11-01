import React, { useState, useEffect, useRef } from 'react';
import { getChatResponse } from '../services/geminiService';
import { ChatBubbleIcon, PaperAirplaneIcon, XMarkIcon } from './icons';

interface Message {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', parts: [{ text: input }] };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const chatHistory = messages.map(msg => ({
          role: msg.role,
          parts: msg.parts,
      }));
      const responseText = await getChatResponse(chatHistory, input);
      const modelMessage: Message = { role: 'model', parts: [{ text: responseText }] };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage: Message = { role: 'model', parts: [{ text: "Sorry, I'm having trouble connecting. Please try again later." }] };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 z-50"
        aria-label="Open chat assistant"
      >
        <ChatBubbleIcon className="h-8 w-8" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-full max-w-sm h-[70vh] max-h-[600px] bg-white rounded-xl shadow-2xl flex flex-col z-50">
      <header className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-xl">
        <h3 className="text-lg font-bold text-gray-800">County Assistant</h3>
        <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-800">
            <XMarkIcon className="h-6 w-6" />
        </button>
      </header>
      <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${msg.role === 'user' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
                <p className="text-sm">{msg.parts[0].text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
               <div className="px-4 py-2 rounded-2xl bg-gray-200 text-gray-800">
                    <span className="animate-pulse">...</span>
                </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <form onSubmit={handleSend} className="p-4 border-t flex items-center space-x-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask a question..."
          className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-green-500 focus:border-green-500 transition text-sm"
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading} className="bg-green-600 text-white p-2.5 rounded-full hover:bg-green-700 disabled:bg-gray-400 transition-colors">
          <PaperAirplaneIcon className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
};