import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export const LynxAnimation = () => {
  const [dimensions, setDimensions] = useState({ width: 1000, height: 800 });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
      
      const handleResize = () => {
        setDimensions({ width: window.innerWidth, height: window.innerHeight });
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Generate wave path
  const generateWavePath = (offset: number, amplitude: number, frequency: number) => {
    const points = [];
    for (let x = 0; x <= dimensions.width + 100; x += 10) {
      const y = Math.sin((x + offset) * frequency * 0.01) * amplitude + dimensions.height * 0.5;
      points.push(`${x},${y}`);
    }
    return `M0,${dimensions.height} L0,${dimensions.height * 0.5} ${points.map((p, i) => (i === 0 ? 'L' : '') + p).join(' L')} L${dimensions.width + 100},${dimensions.height} Z`;
  };

  // Generate larger floating dots
  const largeDots = [...Array(15)].map((_, i) => ({
    id: i,
    size: 6 + Math.random() * 8,
    initialX: Math.random() * dimensions.width,
    initialY: Math.random() * dimensions.height,
    duration: 8 + Math.random() * 6,
    delay: Math.random() * 3,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Animated wave layers */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.15" />
            <stop offset="50%" stopColor="hsl(var(--secondary))" stopOpacity="0.1" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--secondary))" stopOpacity="0.1" />
            <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.08" />
            <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="waveGradient3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0.08" />
            <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
            <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.08" />
          </linearGradient>
        </defs>
        
        {/* Wave 1 - Slow, large amplitude */}
        <motion.path
          d={generateWavePath(0, 80, 0.8)}
          fill="url(#waveGradient1)"
          animate={{
            d: [
              generateWavePath(0, 80, 0.8),
              generateWavePath(200, 100, 0.8),
              generateWavePath(400, 80, 0.8),
              generateWavePath(0, 80, 0.8),
            ],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Wave 2 - Medium speed */}
        <motion.path
          d={generateWavePath(100, 60, 1.2)}
          fill="url(#waveGradient2)"
          animate={{
            d: [
              generateWavePath(100, 60, 1.2),
              generateWavePath(300, 70, 1.2),
              generateWavePath(100, 60, 1.2),
            ],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Wave 3 - Fast, small amplitude */}
        <motion.path
          d={generateWavePath(200, 40, 1.5)}
          fill="url(#waveGradient3)"
          animate={{
            d: [
              generateWavePath(200, 40, 1.5),
              generateWavePath(0, 50, 1.5),
              generateWavePath(200, 40, 1.5),
            ],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </svg>

      {/* Large floating dots */}
      {largeDots.map((dot) => (
        <motion.div
          key={dot.id}
          className="absolute rounded-full"
          style={{
            width: dot.size,
            height: dot.size,
            background: `linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))`,
            boxShadow: `0 0 ${dot.size * 2}px hsl(var(--primary) / 0.5)`,
          }}
          initial={{
            x: dot.initialX,
            y: dot.initialY,
            opacity: 0,
          }}
          animate={{
            x: [
              dot.initialX,
              dot.initialX + (Math.random() - 0.5) * 200,
              dot.initialX + (Math.random() - 0.5) * 200,
              dot.initialX,
            ],
            y: [
              dot.initialY,
              dot.initialY + (Math.random() - 0.5) * 200,
              dot.initialY + (Math.random() - 0.5) * 200,
              dot.initialY,
            ],
            opacity: [0, 0.8, 0.6, 0],
          }}
          transition={{
            duration: dot.duration,
            repeat: Infinity,
            delay: dot.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Glowing orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl"
        style={{
          background: 'linear-gradient(135deg, hsl(var(--primary) / 0.3), hsl(var(--secondary) / 0.2))',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl"
        style={{
          background: 'linear-gradient(135deg, hsl(var(--secondary) / 0.2), hsl(var(--primary) / 0.3))',
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};
