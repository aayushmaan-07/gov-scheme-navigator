'use client';

import React from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

interface BackgroundAshokChakraProps {
  theme?: 'dark' | 'light';
}

export const BackgroundAshokChakra: React.FC<BackgroundAshokChakraProps> = ({ theme = 'dark' }) => {
  const isLight = theme === 'light';
  const { scrollYProgress } = useScroll();

  // Smooth spring physics for scroll-based rotation so it spins smoothly as user scrolls
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 45,
    damping: 20,
    restDelta: 0.001,
  });

  // 1 full page scroll = 2.5 full 360-degree rotations of the Ashok Chakra
  const scrollRotation = useTransform(smoothProgress, [0, 1], [0, 360 * 2.5]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 flex items-center justify-center"
    >
      {/* Ambient Tricolor Diffused Glow behind the Chakra */}
      {isLight ? (
        <div className="absolute w-[600px] sm:w-[850px] lg:w-[1100px] h-[600px] sm:h-[850px] lg:h-[1100px] rounded-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-400/[0.09] via-blue-400/[0.05] to-emerald-400/[0.09] blur-[130px] -z-10" />
      ) : (
        <div className="absolute w-[600px] sm:w-[850px] lg:w-[1100px] h-[600px] sm:h-[850px] lg:h-[1100px] rounded-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-500/[0.04] via-blue-500/[0.02] to-emerald-500/[0.04] blur-[140px] -z-10" />
      )}

      {/* Scroll-Driven Rotating Chakra Container */}
      <motion.div
        style={{ rotate: scrollRotation }}
        className={`relative w-[500px] sm:w-[750px] md:w-[900px] lg:w-[1150px] h-[500px] sm:h-[750px] md:h-[900px] lg:h-[1150px] transition-opacity duration-700 ${
          isLight ? 'opacity-[0.16] sm:opacity-[0.20]' : 'opacity-[0.065] sm:opacity-[0.075]'
        }`}
      >
        {/* Continuous Slow Ambient Drift (even when stationary) */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 140, ease: 'linear' }}
          className="w-full h-full"
        >
          <svg
            viewBox="0 0 500 500"
            className={`w-full h-full ${isLight ? 'drop-shadow-[0_0_20px_rgba(2,132,199,0.15)]' : 'drop-shadow-[0_0_60px_rgba(56,189,248,0.2)]'}`}
            xmlns="http://www.w3.org/2000/svg"
          >
          <defs>
            {/* National Tricolor Gradient: Saffron Top -> Ashok Blue Mid -> Emerald Bottom */}
            <linearGradient id="tirangaChakraGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F97316" stopOpacity="1" />
              <stop offset="30%" stopColor="#FB923C" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.95" />
              <stop offset="70%" stopColor="#34D399" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="1" />
            </linearGradient>

            {/* High-Definition Contrast Tiranga Gradient for Light Mode */}
            <linearGradient id="tirangaChakraGradLight" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#EA580C" stopOpacity="1" />
              <stop offset="28%" stopColor="#F97316" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#0284C7" stopOpacity="1" />
              <stop offset="72%" stopColor="#059669" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#047857" stopOpacity="1" />
            </linearGradient>

            {/* Radial Hub Glow */}
            <radialGradient id="hubRadial" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#0284C7" stopOpacity="0.4" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="hubRadialLight" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0284C7" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#0369A1" stopOpacity="0.4" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* 1. Outer Ring */}
          <circle
            cx="250"
            cy="250"
            r="230"
            fill="none"
            stroke={isLight ? "url(#tirangaChakraGradLight)" : "url(#tirangaChakraGrad)"}
            strokeWidth="3.5"
            strokeDasharray="4 2"
          />

          {/* 2. Secondary Main Rim */}
          <circle
            cx="250"
            cy="250"
            r="220"
            fill="none"
            stroke={isLight ? "url(#tirangaChakraGradLight)" : "url(#tirangaChakraGrad)"}
            strokeWidth="5"
          />

          {/* 3. Inner Decorative Rim */}
          <circle
            cx="250"
            cy="250"
            r="205"
            fill="none"
            stroke={isLight ? "url(#tirangaChakraGradLight)" : "url(#tirangaChakraGrad)"}
            strokeWidth="2"
            strokeDasharray="6 3"
          />

          {/* 4. Central Hub Concentric Rings */}
          <circle cx="250" cy="250" r="50" fill={isLight ? "url(#hubRadialLight)" : "url(#hubRadial)"} />
          <circle
            cx="250"
            cy="250"
            r="44"
            fill="none"
            stroke={isLight ? "url(#tirangaChakraGradLight)" : "url(#tirangaChakraGrad)"}
            strokeWidth="3.5"
          />
          <circle
            cx="250"
            cy="250"
            r="32"
            fill="none"
            stroke={isLight ? "url(#tirangaChakraGradLight)" : "url(#tirangaChakraGrad)"}
            strokeWidth="2"
          />
          <circle
            cx="250"
            cy="250"
            r="16"
            fill={isLight ? "url(#tirangaChakraGradLight)" : "url(#tirangaChakraGrad)"}
            opacity="0.9"
          />
          <circle cx="250" cy="250" r="6" fill={isLight ? "#0284C7" : "#0A101D"} />

          {/* 5. Authentic 24 Radial Spokes with Traditional Tapered Shape & Outer Beads */}
          {Array.from({ length: 24 }).map((_, i) => {
            const rot = i * 15; // 360 / 24 = 15 degrees per spoke
            return (
              <g key={i} transform={`rotate(${rot} 250 250)`}>
                {/* Spoke Line tapering outwards */}
                <path
                  d="M 248.5 250 L 246 130 L 250 48 L 254 130 L 251.5 250 Z"
                  fill={isLight ? "url(#tirangaChakraGradLight)" : "url(#tirangaChakraGrad)"}
                  opacity="0.9"
                />

                {/* Central spoke spine */}
                <line
                  x1="250"
                  y1="250"
                  x2="250"
                  y2="46"
                  stroke={isLight ? "#0284C7" : "#FFFFFF"}
                  strokeWidth={isLight ? "1.5" : "1"}
                  opacity={isLight ? "0.7" : "0.5"}
                />

                {/* Outer Rim Diamond/Circular Bead between rim tracks */}
                <circle
                  cx="250"
                  cy="35"
                  r="3.5"
                  fill={isLight ? "url(#tirangaChakraGradLight)" : "url(#tirangaChakraGrad)"}
                  opacity="0.95"
                />

                {/* Micro accent bead */}
                <circle
                  cx="250"
                  cy="212"
                  r="2"
                  fill={isLight ? "#0284C7" : "#38BDF8"}
                  opacity={isLight ? "0.9" : "0.7"}
                />
              </g>
            );
          })}
        </svg>
        </motion.div>
      </motion.div>
    </div>
  );
};
