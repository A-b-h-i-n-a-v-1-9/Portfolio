import { useRef, useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// CSS-based fallback neural network visualization
const FallbackNeuralNetwork = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center opacity-40">
      <div className="relative w-96 h-64">
        {/* Layer 1 - Input */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col gap-6">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={`l1-${i}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="w-4 h-4 rounded-full bg-primary shadow-emerald animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
        
        {/* Layer 2 - Hidden 1 */}
        <div className="absolute left-1/3 top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col gap-4">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={`l2-${i}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
              className="w-3 h-3 rounded-full bg-primary/80 shadow-emerald-subtle"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
        
        {/* Layer 3 - Hidden 2 */}
        <div className="absolute left-2/3 top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col gap-4">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={`l3-${i}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8 + i * 0.1, duration: 0.5 }}
              className="w-3 h-3 rounded-full bg-primary/80 shadow-emerald-subtle"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
        
        {/* Layer 4 - Output */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-8">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={`l4-${i}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.2 + i * 0.1, duration: 0.5 }}
              className="w-4 h-4 rounded-full bg-primary shadow-emerald animate-pulse"
              style={{ animationDelay: `${i * 0.25}s` }}
            />
          ))}
        </div>
        
        {/* Connection lines (simplified) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: -1 }}>
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(160, 84%, 39%)" stopOpacity="0.3" />
              <stop offset="50%" stopColor="hsl(160, 84%, 39%)" stopOpacity="0.5" />
              <stop offset="100%" stopColor="hsl(160, 84%, 39%)" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          {/* Horizontal connection lines */}
          <motion.line
            x1="8%" y1="50%" x2="92%" y2="50%"
            stroke="url(#lineGradient)"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
          />
        </svg>
      </div>
    </div>
  );
};

// Three.js version (lazy loaded only if WebGL is available)
const ThreeNeuralNetwork = () => {
  const [ThreeCanvas, setThreeCanvas] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Check if WebGL is available before loading Three.js
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      setError(true);
      return;
    }

    // Dynamically import Three.js components
    Promise.all([
      import('@react-three/fiber'),
      import('@react-three/drei'),
      import('three')
    ]).then(([fiber, drei, three]) => {
      const { Canvas, useFrame } = fiber;
      const { Float, Line } = drei;
      
      // Create the scene component inline
      const NetworkScene = () => {
        const groupRef = useRef<any>(null);
        
        const layers = useMemo(() => {
          const inputLayer = Array.from({ length: 4 }, (_, i) => ({
            position: [-2, (i - 1.5) * 0.8, 0] as [number, number, number],
          }));
          
          const hiddenLayer1 = Array.from({ length: 5 }, (_, i) => ({
            position: [-0.7, (i - 2) * 0.7, 0] as [number, number, number],
          }));
          
          const hiddenLayer2 = Array.from({ length: 5 }, (_, i) => ({
            position: [0.7, (i - 2) * 0.7, 0] as [number, number, number],
          }));
          
          const outputLayer = Array.from({ length: 3 }, (_, i) => ({
            position: [2, (i - 1) * 0.8, 0] as [number, number, number],
          }));
          
          return [inputLayer, hiddenLayer1, hiddenLayer2, outputLayer];
        }, []);

        const connections = useMemo(() => {
          const conns: { start: [number, number, number]; end: [number, number, number] }[] = [];
          
          for (let l = 0; l < layers.length - 1; l++) {
            const currentLayer = layers[l];
            const nextLayer = layers[l + 1];
            
            for (const node of currentLayer) {
              for (const nextNode of nextLayer) {
                conns.push({
                  start: node.position,
                  end: nextNode.position,
                });
              }
            }
          }
          
          return conns;
        }, [layers]);

        useFrame(({ clock, pointer }) => {
          if (groupRef.current) {
            const t = clock.getElapsedTime();
            groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.2 + pointer.x * 0.3;
            groupRef.current.rotation.x = Math.cos(t * 0.2) * 0.1 + pointer.y * 0.2;
          }
        });

        return (
          <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
            <group ref={groupRef}>
              {connections.map((conn, i) => (
                <Line
                  key={`conn-${i}`}
                  points={[conn.start, conn.end]}
                  color="#10b981"
                  lineWidth={1}
                  transparent
                  opacity={0.3}
                />
              ))}
              {layers.flat().map((node, i) => (
                <mesh key={`node-${i}`} position={node.position}>
                  <sphereGeometry args={[0.08, 16, 16]} />
                  <meshBasicMaterial color="#10b981" transparent opacity={0.9} />
                </mesh>
              ))}
            </group>
          </Float>
        );
      };

      // Create canvas wrapper component
      const CanvasWrapper = () => (
        <Canvas
          camera={{ position: [0, 0, 5], fov: 50 }}
          style={{ background: 'transparent' }}
          gl={{ 
            antialias: true,
            alpha: true,
            failIfMajorPerformanceCaveat: false
          }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
          }}
        >
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <NetworkScene />
        </Canvas>
      );

      setThreeCanvas(() => CanvasWrapper);
    }).catch(() => {
      setError(true);
    });
  }, []);

  if (error || !ThreeCanvas) {
    return <FallbackNeuralNetwork />;
  }

  return (
    <div className="absolute inset-0 opacity-60">
      <ThreeCanvas />
    </div>
  );
};

const NeuralNetwork = () => {
  const [useThree, setUseThree] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Check WebGL availability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setUseThree(!!gl);
    } catch {
      setUseThree(false);
    }
    setChecked(true);
  }, []);

  if (!checked) {
    return null;
  }

  // Always use the CSS fallback for reliability
  return <FallbackNeuralNetwork />;
};

export default NeuralNetwork;
