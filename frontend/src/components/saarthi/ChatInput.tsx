import React, { useState } from 'react';
import { Send, Sparkles, Compass } from 'lucide-react';
import { Button } from '../common/Button';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  isLoading = false,
  placeholder = 'Ask Saarthi anything (e.g. Plan a 5 day trip from Ahmedabad, reduce budget...)',
}) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isLoading) return;
    onSend(text.trim());
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center w-full">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        disabled={isLoading}
        className="w-full pl-4 pr-24 py-3.5 bg-slate-900/80 backdrop-blur-xl border border-white/20 rounded-2xl text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 shadow-xl transition-all"
      />
      <div className="absolute right-2 flex items-center">
        <Button
          type="submit"
          variant="primary"
          size="sm"
          disabled={!text.trim() || isLoading}
          isLoading={isLoading}
          className="rounded-xl px-3.5 py-2 font-bold shadow-md shadow-blue-600/30"
          rightIcon={<Send className="w-3.5 h-3.5" />}
        >
          Send
        </Button>
      </div>
    </form>
  );
};
