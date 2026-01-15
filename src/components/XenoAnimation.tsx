import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// Color themes that alternate
const themes = {
  purple: {
    wave1: { start: 'hsl(25 100% 55%)', mid: 'hsl(35 100% 50%)', end: 'hsl(25 100% 55%)' },
    wave2: { start: 'hsl(258 100% 68%)', mid: 'hsl(229 55% 46%)', end: 'hsl(258 100% 68%)' },
    wave3: { start: 'hsl(229 55% 46%)', mid: 'hsl(183 100% 50%)', end: 'hsl(229 55% 46%)' },
    wave4: { start: 'hsl(183 100% 50%)', mid: 'hsl(258 100% 68%)', end: 'hsl(183 100% 50%)' },
    orb1: 'linear-gradient(135deg, hsl(258 100% 68% / 0.25), hsl(229 55% 46% / 0.15))',
    orb2: 'linear-gradient(135deg, hsl(183 100% 50% / 0.2), hsl(258 100% 68% / 0.1))',
    orb3: 'linear-gradient(135deg, hsl(25 100% 55% / 0.2), hsl(258 100% 68% / 0.15))',
    dots: [
      { main: '258 100% 68%', glow: '258 100% 68%' },
      { main: '183 100% 50%', glow: '183 100% 50%' },
      { main: '25 100% 55%', glow: '25 100% 55%' },
    ]
  },
  redYellow: {
    wave1: { start: 'hsl(25 100% 55%)', mid: 'hsl(35 100% 50%)', end: 'hsl(25 100% 55%)' },
    wave2: { start: 'hsl(355 85% 50%)', mid: 'hsl(25 100% 50%)', end: 'hsl(355 85% 50%)' },
    wave3: { start: 'hsl(56 100% 50%)', mid: 'hsl(355 85% 50%)', end: 'hsl(56 100% 50%)' },
    wave4: { start: 'hsl(355 85% 60%)', mid: 'hsl(56 100% 50%)', end: 'hsl(355 85% 60%)' },
    orb1: 'linear-gradient(135deg, hsl(355 85% 50% / 0.25), hsl(25 100% 55% / 0.15))',
    orb2: 'linear-gradient(135deg, hsl(56 100% 50% / 0.2), hsl(355 85% 50% / 0.1))',
    orb3: 'linear-gradient(135deg, hsl(25 100% 55% / 0.2), hsl(355 85% 50% / 0.15))',
    dots: [
      { main: '355 85% 50%', glow: '355 85% 50%' },
      { main: '56 100% 50%', glow: '56 100% 50%' },
      { main: '25 100% 55%', glow: '25 100% 55%' },
    ]
  }
};

export const XenoAnimation = () => {
  const [dimensions, setDimensions] = useState({ width: 1000, height: 800 });
  const [currentTheme, setCurrentTheme] = useState<'purple' | 'redYellow'>('purple');

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

  // Alternate theme every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTheme(prev => prev === 'purple' ? 'redYellow' : 'purple');
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const theme = themes[currentTheme];

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
    colorIndex: i % 3,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Animated wave layers at the bottom */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <defs>
          {/* Orange wave - bottom layer */}
          <linearGradient id="waveGradientOrange" x1="0%" y1="0%" x2="100%" y2="0%">
            <motion.stop 
              offset="0%" 
              animate={{ stopColor: theme.wave1.start }}
              transition={{ duration: 1 }}
              stopOpacity="0.25" 
            />
            <motion.stop 
              offset="50%" 
              animate={{ stopColor: theme.wave1.mid }}
              transition={{ duration: 1 }}
              stopOpacity="0.2" 
            />
            <motion.stop 
              offset="100%" 
              animate={{ stopColor: theme.wave1.end }}
              transition={{ duration: 1 }}
              stopOpacity="0.25" 
            />
          </linearGradient>
          {/* Purple/Red wave - middle layer */}
          <linearGradient id="waveGradientPurple" x1="0%" y1="0%" x2="100%" y2="0%">
            <motion.stop 
              offset="0%" 
              animate={{ stopColor: theme.wave2.start }}
              transition={{ duration: 1 }}
              stopOpacity="0.2" 
            />
            <motion.stop 
              offset="50%" 
              animate={{ stopColor: theme.wave2.mid }}
              transition={{ duration: 1 }}
              stopOpacity="0.15" 
            />
            <motion.stop 
              offset="100%" 
              animate={{ stopColor: theme.wave2.end }}
              transition={{ duration: 1 }}
              stopOpacity="0.2" 
            />
          </linearGradient>
          {/* Deep blue/Yellow wave */}
          <linearGradient id="waveGradientBlue" x1="0%" y1="0%" x2="100%" y2="0%">
            <motion.stop 
              offset="0%" 
              animate={{ stopColor: theme.wave3.start }}
              transition={{ duration: 1 }}
              stopOpacity="0.18" 
            />
            <motion.stop 
              offset="50%" 
              animate={{ stopColor: theme.wave3.mid }}
              transition={{ duration: 1 }}
              stopOpacity="0.12" 
            />
            <motion.stop 
              offset="100%" 
              animate={{ stopColor: theme.wave3.end }}
              transition={{ duration: 1 }}
              stopOpacity="0.18" 
            />
          </linearGradient>
          {/* Cyan/Red wave */}
          <linearGradient id="waveGradientCyan" x1="0%" y1="0%" x2="100%" y2="0%">
            <motion.stop 
              offset="0%" 
              animate={{ stopColor: theme.wave4.start }}
              transition={{ duration: 1 }}
              stopOpacity="0.15" 
            />
            <motion.stop 
              offset="50%" 
              animate={{ stopColor: theme.wave4.mid }}
              transition={{ duration: 1 }}
              stopOpacity="0.1" 
            />
            <motion.stop 
              offset="100%" 
              animate={{ stopColor: theme.wave4.end }}
              transition={{ duration: 1 }}
              stopOpacity="0.15" 
            />
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

      {/* Large floating dots with alternating colors */}
      {largeDots.map((dot) => {
        const colors = theme.dots[dot.colorIndex];
        return (
          <motion.div
            key={dot.id}
            className="absolute rounded-full"
            style={{
              width: dot.size,
              height: dot.size,
            }}
            animate={{
              background: `linear-gradient(135deg, hsl(${colors.main}), hsl(${colors.glow} / 0.7))`,
              boxShadow: `0 0 ${dot.size * 2}px hsl(${colors.glow} / 0.5)`,
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

      {/* Glowing orbs - with theme transition */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl"
        animate={{
          background: theme.orb1,
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Glowing orbs - Cyan/Yellow */}
      <motion.div
        className="absolute top-1/3 right-1/3 w-48 h-48 rounded-full blur-3xl"
        animate={{
          background: theme.orb2,
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
        animate={{
          background: theme.orb3,
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
