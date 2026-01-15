import { useEffect, useState, useCallback, useRef } from 'react';

export const useEasterEgg = (target: string | string[], callback: () => void) => {
  const [buffer, setBuffer] = useState<string[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Ignore if user is typing in Terminal or inputs
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return;
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    const key = e.key;
    const targetArray = typeof target === 'string' ? target.split('') : target;

    setBuffer((prev) => {
      const newBuffer = [...prev, key].slice(-targetArray.length);
      
      const isMatch = newBuffer.every(
        (val, index) => val.toLowerCase() === targetArray[index].toLowerCase()
      );

      if (isMatch) {
        callback();
        return []; 
      }
      return newBuffer;
    });

    // Reset if user pauses
    timeoutRef.current = setTimeout(() => setBuffer([]), 2000);
  }, [target, callback]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [handleKeyDown]);
};