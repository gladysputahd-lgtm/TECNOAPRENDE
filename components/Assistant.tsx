import { Chat } from '@google/genai';
import React, { useState, useEffect, useRef } from 'react';
import { Language, ChatMessage } from '../types';
import { startChat } from '../services/geminiService';
import { Button } from './common/Button';
import { Spinner } from './common/Spinner';
import { t } from '../i18n';
import { AudioButton } from './common/AudioButton';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';


interface AssistantProps {
  language: Language;
  audioHandler: (text: string) => void;
  loadingAudioText: string | null;
  playingAudioText: string | null;
}

export const Assistant: React.FC<AssistantProps> = ({ language, audioHandler, loadingAudioText, playingAudioText }) => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chatInstance = startChat(language);
    setChat(chatInstance);
    setMessages([{ role: 'model', text: t('assistant_welcome') }]);
  }, [language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || !chat || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await chat.sendMessage({ message: textToSend });
      const modelMessage: ChatMessage = { role: 'model', text: result.text };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = { role: 'model', text: t('error_generic') };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const suggestions = [t('suggestion1'), t('suggestion2'), t('suggestion3')];

  return (
    <div className="flex flex-col h-[calc(100vh-160px)]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-lg p-3 rounded-2xl ${msg.role === 'user' ? 'bg-brand-primary text-white' : 'bg-white dark:bg-gray-700'}`}>
                <div className="flex items-start gap-2">
                    <p className="whitespace-pre-wrap flex-grow">{msg.text}</p>
                    {msg.role === 'model' && (
                         <AudioButton
                            text={msg.text}
                            onClick={audioHandler}
                            isLoading={loadingAudioText === msg.text}
                            isPlaying={playingAudioText === msg.text}
                         />
                    )}
                </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-lg p-3 rounded-2xl bg-white dark:bg-gray-700">
              <Spinner />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-2 mb-2">
          {suggestions.map(s => (
            <Button key={s} variant="ghost" className="text-sm !p-2 !shadow-sm border border-gray-300 dark:border-gray-600" onClick={() => handleSend(s)}>{s}</Button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t('ask_a_question')}
            className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-secondary dark:bg-gray-600 dark:border-gray-500"
            disabled={isLoading}
          />
          <Button onClick={() => handleSend()} disabled={isLoading || !input.trim()} className="rounded-full !p-3">
            <PaperAirplaneIcon className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};
