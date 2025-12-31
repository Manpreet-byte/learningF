// Custom hook for managing console output

import { useState, useCallback } from 'react';

export function useConsole() {
  const [messages, setMessages] = useState([]);

  const addMessage = useCallback((message) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return { messages, addMessage, clearMessages };
}
