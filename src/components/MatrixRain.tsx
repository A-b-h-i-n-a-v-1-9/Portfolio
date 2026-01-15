import { useEffect, useRef } from 'react';

const MatrixRain = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF';
    const columns = Math.floor(container.offsetWidth / 20);

    for (let i = 0; i < columns; i++) {
      const column = document.createElement('div');
      column.className = 'absolute text-primary font-mono text-xs opacity-80';
      column.style.left = `${i * 20}px`;
      column.style.animationDelay = `${Math.random() * 2}s`;
      column.style.animationDuration = `${2 + Math.random() * 3}s`;
      
      const charCount = 8 + Math.floor(Math.random() * 8);
      let text = '';
      for (let j = 0; j < charCount; j++) {
        text += chars[Math.floor(Math.random() * chars.length)] + '\n';
      }
      column.textContent = text;
      column.style.whiteSpace = 'pre';
      
      // Add animation
      column.style.animation = `matrix-fall ${2 + Math.random() * 3}s linear infinite`;
      column.style.animationDelay = `${-Math.random() * 4}s`;
      
      container.appendChild(column);
    }

    return () => {
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="matrix-rain"
      style={{
        background: 'linear-gradient(to bottom, transparent 0%, hsl(var(--card)) 100%)',
      }}
    />
  );
};

export default MatrixRain;
