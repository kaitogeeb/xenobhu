import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export const XenoAnimation = () => {
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

  // Generate wave path - waves at bottom of screen
  const generateWavePath = (offset: number, amplitude: number, frequency: number, baseY: number) => {
    const points = [];
    for (let x = 0; x <= dimensions.width + 100; x += 10) {
      const y = Math.sin((x + offset) * frequency * 0.01) * amplitude + baseY;
      points.push(`${x},${y}`);
    }
    return `M0,${dimensions.height} L0,${baseY} ${points.map((p, i) => (i === 0 ? 'L' : '') + p).join(' L')} L${dimensions.width + 100},${dimensions.height} Z`;
  };

  // Generate larger floating dots
  const largeDots = [...Array(15)].map((_, i) => ({
    id: i,
    size: 6 + Math.random() * 8,
    initialX: Math.random() * dimensions.width,
    initialY: Math.random() * dimensions.height,
    duration: 8 + Math.random() * 6,
    delay: Math.random() * 3,
    colorIndex: i % 3, // 0: purple, 1: cyan, 2: orange
  }));

  const getColorFromIndex = (index: number) => {
    switch (index) {
      case 0: return { main: '258 100% 68%', glow: '258 100% 68%' }; // Purple
      case 1: return { main: '183 100% 50%', glow: '183 100% 50%' }; // Cyan
      case 2: return { main: '25 100% 55%', glow: '25 100% 55%' }; // Orange
      default: return { main: '258 100% 68%', glow: '258 100% 68%' };
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Animated wave layers at the bottom */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <defs>
          {/* Orange wave - bottom layer */}
          <linearGradient id="waveGradientOrange" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(25 100% 55%)" stopOpacity="0.25" />
            <stop offset="50%" stopColor="hsl(35 100% 50%)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="hsl(25 100% 55%)" stopOpacity="0.25" />
          </linearGradient>
          {/* Purple wave - middle layer */}
          <linearGradient id="waveGradientPurple" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(258 100% 68%)" stopOpacity="0.2" />
            <stop offset="50%" stopColor="hsl(229 55% 46%)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="hsl(258 100% 68%)" stopOpacity="0.2" />
          </linearGradient>
          {/* Cyan wave - top layer */}
          <linearGradient id="waveGradientCyan" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(183 100% 50%)" stopOpacity="0.15" />
            <stop offset="50%" stopColor="hsl(258 100% 68%)" stopOpacity="0.1" />
            <stop offset="100%" stopColor="hsl(183 100% 50%)" stopOpacity="0.15" />
          </linearGradient>
          {/* Deep blue wave */}
          <linearGradient id="waveGradientBlue" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(229 55% 46%)" stopOpacity="0.18" />
            <stop offset="50%" stopColor="hsl(183 100% 50%)" stopOpacity="0.12" />
            <stop offset="100%" stopColor="hsl(229 55% 46%)" stopOpacity="0.18" />
          </linearGradient>
        </defs>
        
        {/* Wave 1 - Orange at the very bottom */}
        <motion.path
          d={generateWavePath(0, 50, 0.6, dimensions.height * 0.85)}
          fill="url(#waveGradientOrange)"
          animate={{
            d: [
              generateWavePath(0, 50, 0.6, dimensions.height * 0.85),
              generateWavePath(150, 60, 0.6, dimensions.height * 0.83),
              generateWavePath(300, 50, 0.6, dimensions.height * 0.85),
              generateWavePath(0, 50, 0.6, dimensions.height * 0.85),
            ],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Wave 2 - Purple/Blue middle-bottom */}
        <motion.path
          d={generateWavePath(100, 60, 0.8, dimensions.height * 0.75)}
          fill="url(#waveGradientPurple)"
          animate={{
            d: [
              generateWavePath(100, 60, 0.8, dimensions.height * 0.75),
              generateWavePath(250, 70, 0.8, dimensions.height * 0.73),
              generateWavePath(400, 60, 0.8, dimensions.height * 0.75),
              generateWavePath(100, 60, 0.8, dimensions.height * 0.75),
            ],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Wave 3 - Deep blue */}
        <motion.path
          d={generateWavePath(200, 45, 1.0, dimensions.height * 0.65)}
          fill="url(#waveGradientBlue)"
          animate={{
            d: [
              generateWavePath(200, 45, 1.0, dimensions.height * 0.65),
              generateWavePath(50, 55, 1.0, dimensions.height * 0.63),
              generateWavePath(200, 45, 1.0, dimensions.height * 0.65),
            ],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Wave 4 - Cyan at the top of waves */}
        <motion.path
          d={generateWavePath(50, 35, 1.2, dimensions.height * 0.55)}
          fill="url(#waveGradientCyan)"
          animate={{
            d: [
              generateWavePath(50, 35, 1.2, dimensions.height * 0.55),
              generateWavePath(200, 45, 1.2, dimensions.height * 0.53),
              generateWavePath(350, 35, 1.2, dimensions.height * 0.55),
              generateWavePath(50, 35, 1.2, dimensions.height * 0.55),
            ],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </svg>

      {/* Large floating dots with multi-color scheme */}
      {largeDots.map((dot) => {
        const colors = getColorFromIndex(dot.colorIndex);
        return (
          <motion.div
            key={dot.id}
            className="absolute rounded-full"
            style={{
              width: dot.size,
              height: dot.size,
              background: `linear-gradient(135deg, hsl(${colors.main}), hsl(${colors.glow} / 0.7))`,
              boxShadow: `0 0 ${dot.size * 2}px hsl(${colors.glow} / 0.5)`,
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
        );
      })}

      {/* Glowing orbs - Purple */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl"
        style={{
          background: 'linear-gradient(135deg, hsl(258 100% 68% / 0.25), hsl(229 55% 46% / 0.15))',
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

      {/* Glowing orbs - Cyan */}
      <motion.div
        className="absolute top-1/3 right-1/3 w-48 h-48 rounded-full blur-3xl"
        style={{
          background: 'linear-gradient(135deg, hsl(183 100% 50% / 0.2), hsl(258 100% 68% / 0.1))',
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      {/* Glowing orbs - Orange */}
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full blur-3xl"
        style={{
          background: 'linear-gradient(135deg, hsl(25 100% 55% / 0.2), hsl(258 100% 68% / 0.15))',
        }}
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.25, 0.45, 0.25],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
    </div>
  );
};
