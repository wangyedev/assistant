'use client';

import { useState } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  return (
    <form 
      className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-4"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        disabled={isLoading}
        className="flex-1 p-3 rounded-lg border border-gray-200 dark:border-gray-700 
                 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                 disabled:opacity-70 disabled:cursor-not-allowed
                 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button 
        type="submit" 
        disabled={isLoading || !message.trim()}
        className="px-6 py-3 rounded-lg bg-blue-500 text-white font-medium
                 disabled:opacity-70 disabled:cursor-not-allowed
                 hover:bg-blue-600 transition-colors
                 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {isLoading ? 'Sending...' : 'Send'}
      </button>
    </form>
  );
} 