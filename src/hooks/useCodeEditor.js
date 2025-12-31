// Custom hook for managing code editor state and auto-save

import { useState, useCallback, useEffect } from 'react';
import { debounce } from '../utils/debounce';
import { storage } from '../utils/storage';

export function useCodeEditor(lessonId, initialCode) {
  const [code, setCode] = useState(() => {
    const saved = storage.loadCode(lessonId);
    return saved || initialCode;
  });

  // Debounced auto-save
  const debouncedSave = useCallback(
    debounce((codeToSave) => {
      storage.saveCode(lessonId, codeToSave);
    }, 1000),
    [lessonId]
  );

  const updateCode = useCallback(
    (lang, value) => {
      setCode(prevCode => {
        const updated = { ...prevCode, [lang]: value };
        debouncedSave(updated);
        return updated;
      });
    },
    [debouncedSave]
  );

  // Save on unmount
  useEffect(() => {
    return () => {
      storage.saveCode(lessonId, code);
    };
  }, [lessonId, code]);

  return { code, updateCode };
}
