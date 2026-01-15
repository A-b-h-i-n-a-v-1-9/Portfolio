import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, RotateCcw } from 'lucide-react';

interface Position {
  x: number;
  y: number;
}

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;

interface SnakeGameProps {
  onClose: () => void;
}

const SnakeGame = ({ onClose }: SnakeGameProps) => {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [highScore, setHighScore] = useState(0);
  
  const directionRef = useRef(direction);
  const gameLoopRef = useRef<number | null>(null);

  const generateFood = useCallback(() => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, [snake]);

  const resetGame = useCallback(() => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 15, y: 15 });
    setDirection('RIGHT');
    directionRef.current = 'RIGHT';
    setGameOver(false);
    setScore(0);
    setIsPlaying(true);
  }, []);

  const moveSnake = useCallback(() => {
    if (gameOver || !isPlaying) return;

    setSnake(prevSnake => {
      const head = { ...prevSnake[0] };
      const currentDirection = directionRef.current;

      switch (currentDirection) {
        case 'UP':
          head.y -= 1;
          break;
        case 'DOWN':
          head.y += 1;
          break;
        case 'LEFT':
          head.x -= 1;
          break;
        case 'RIGHT':
          head.x += 1;
          break;
      }

      // Check wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setGameOver(true);
        setIsPlaying(false);
        return prevSnake;
      }

      // Check self collision
      if (prevSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        setIsPlaying(false);
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setScore(prev => {
          const newScore = prev + 10;
          if (newScore > highScore) {
            setHighScore(newScore);
          }
          return newScore;
        });
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food, gameOver, isPlaying, generateFood, highScore]);

  useEffect(() => {
    if (isPlaying && !gameOver) {
      gameLoopRef.current = window.setInterval(moveSnake, INITIAL_SPEED);
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [isPlaying, gameOver, moveSnake]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying) return;

      const currentDir = directionRef.current;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (currentDir !== 'DOWN') {
            setDirection('UP');
            directionRef.current = 'UP';
          }
          break;
        case 'ArrowDown':
        case 's':
          if (currentDir !== 'UP') {
            setDirection('DOWN');
            directionRef.current = 'DOWN';
          }
          break;
        case 'ArrowLeft':
        case 'a':
          if (currentDir !== 'RIGHT') {
            setDirection('LEFT');
            directionRef.current = 'LEFT';
          }
          break;
        case 'ArrowRight':
        case 'd':
          if (currentDir !== 'LEFT') {
            setDirection('RIGHT');
            directionRef.current = 'RIGHT';
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bento-card p-8 max-w-lg w-full mx-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold font-mono text-primary">🐍 Snake Game</h3>
            <p className="text-xs text-muted-foreground font-mono mt-1">
              Easter Egg Unlocked!
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg border border-border/60 hover:border-primary/40 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Score */}
        <div className="flex justify-between mb-4">
          <div className="text-sm font-mono">
            Score: <span className="text-primary">{score}</span>
          </div>
          <div className="text-sm font-mono text-muted-foreground">
            High Score: <span className="text-primary">{highScore}</span>
          </div>
        </div>

        {/* Game Board */}
        <div 
          className="relative border border-border/60 rounded-lg overflow-hidden mx-auto"
          style={{ 
            width: GRID_SIZE * CELL_SIZE, 
            height: GRID_SIZE * CELL_SIZE,
            background: 'linear-gradient(135deg, hsl(var(--card)) 0%, hsl(var(--background)) 100%)'
          }}
        >
          {/* Grid Lines */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(hsl(var(--border)) 1px, transparent 1px),
                linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)
              `,
              backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`
            }}
          />

          {/* Snake */}
          {snake.map((segment, index) => (
            <div
              key={index}
              className="absolute rounded-sm transition-all duration-75"
              style={{
                left: segment.x * CELL_SIZE,
                top: segment.y * CELL_SIZE,
                width: CELL_SIZE - 2,
                height: CELL_SIZE - 2,
                margin: 1,
                backgroundColor: index === 0 ? 'hsl(160 84% 45%)' : 'hsl(160 84% 39%)',
                boxShadow: index === 0 ? '0 0 10px hsl(160 84% 39% / 0.5)' : 'none',
              }}
            />
          ))}

          {/* Food */}
          <div
            className="absolute rounded-full animate-pulse"
            style={{
              left: food.x * CELL_SIZE,
              top: food.y * CELL_SIZE,
              width: CELL_SIZE - 2,
              height: CELL_SIZE - 2,
              margin: 1,
              backgroundColor: 'hsl(0 84% 60%)',
              boxShadow: '0 0 10px hsl(0 84% 60% / 0.5)',
            }}
          />

          {/* Game Over Overlay */}
          {!isPlaying && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
              {gameOver ? (
                <>
                  <p className="text-xl font-bold font-mono text-destructive mb-2">Game Over!</p>
                  <p className="text-sm text-muted-foreground mb-4">Final Score: {score}</p>
                  <button
                    onClick={resetGame}
                    className="btn-primary text-sm"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Play Again
                  </button>
                </>
              ) : (
                <>
                  <p className="text-lg font-mono text-foreground mb-4">Ready to play?</p>
                  <button
                    onClick={resetGame}
                    className="btn-primary"
                  >
                    <Play className="w-4 h-4" />
                    Start Game
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Controls Hint */}
        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground font-mono">
            Use Arrow Keys or WASD to move
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SnakeGame;
