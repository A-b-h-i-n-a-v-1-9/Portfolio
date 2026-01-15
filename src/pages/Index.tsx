import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import StatusBar from '@/components/StatusBar';
import HeroSection from '@/components/HeroSection';
import CareerTimeline from '@/components/CareerTimeline';
import ProjectLab from '@/components/ProjectLab';
import CredentialRegistry from '@/components/CredentialRegistry';
import SudoHireTerminal from '@/components/SudoHireTerminal';
import TestimonialSection from '@/components/TestimonialSection';
import Footer from '@/components/Footer';
import SnakeGame from '@/components/SnakeGame';
import MatrixRain from '@/components/MatrixRain';
import { useEasterEgg } from '@/hooks/useEasterEgg';

const Index = () => {
  const [showSnake, setShowSnake] = useState(false);
  const [isMatrixActive, setIsMatrixActive] = useState(false);

  // 1. Trigger Snake Game by typing "snake"
  useEasterEgg('snake', () => {
    setShowSnake(true);
  });

  // 2. Trigger Matrix Rain with Konami Code
  const konamiSequence = [
    'ArrowUp', 'ArrowUp', 
    'ArrowDown', 'ArrowDown', 
    'ArrowLeft', 'ArrowRight', 
    'ArrowLeft', 'ArrowRight', 
    'b', 'a'
  ];
  
  useEasterEgg(konamiSequence, () => {
    setIsMatrixActive(true);
    // Auto-disable Matrix after 20 seconds
    setTimeout(() => setIsMatrixActive(false), 20000);
  });

  return (
    <div className="min-h-screen bg-background dot-grid grain relative overflow-hidden">
      {/* Matrix Overlay - Highest Z-Index */}
      {isMatrixActive && (
        <div className="fixed inset-0 z-[9999] pointer-events-none opacity-50">
          <MatrixRain />
        </div>
      )}

      <StatusBar />
      
      <main className="relative z-10">
        <HeroSection /> 
        {/* Timeline reflects: Tech Team -> CTF Head -> Advisory */}
        <CareerTimeline /> 
        {/* Lab includes: TwoRegisters Anomaly & Parkinson's MRI */}
        <ProjectLab /> 
        <TestimonialSection />
        {/* Registry shows: Oracle GenAI & CCNA */}
        <CredentialRegistry /> 
        <SudoHireTerminal />
      </main>

      <Footer />

      {/* Easter Egg Modal */}
      <AnimatePresence>
        {showSnake && (
          <div className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/80 backdrop-blur-sm">
             <SnakeGame onClose={() => setShowSnake(false)} />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;