import React from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import { motion, useTransform, MotionValue } from 'framer-motion';
import Image from 'next/image';

const MotionBox = motion(Box);

interface ProjectImageProps {
  image: string;
  title: string;
  accentColor: string;
  isInView: boolean;
  scrollProgress: MotionValue<number>;
}

export const ProjectImage: React.FC<ProjectImageProps> = ({
  image,
  title,
  accentColor,
  isInView,
  scrollProgress,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Parallax and scale effects
  const imageY = useTransform(scrollProgress, [0, 0.5], [0, isMobile ? -30 : -60]);
  const imageScale = useTransform(scrollProgress, [0, 0.3], [1, isMobile ? 1.03 : 1.08]);
  const imageRotate = useTransform(scrollProgress, [0, 0.5], [0, isMobile ? 1 : 2]);

  return (
    <MotionBox
      initial={{ opacity: 0, y: 80, rotateX: 15 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 80, rotateX: 15 }}
      transition={{ 
        duration: 0.9, 
        ease: [0.6, 0.05, 0.01, 0.9],
        delay: 0.2 
      }}
      style={{ 
        y: imageY, 
        scale: imageScale,
        rotateY: imageRotate,
      }}
      sx={{
        position: 'relative',
        height: { xs: '250px', sm: '350px', md: '500px' },
        width: '100%',
        borderRadius: 3,
        overflow: 'hidden',
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Glow effect background */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '110%',
          height: '110%',
          background: `radial-gradient(circle, ${accentColor}40, transparent 70%)`,
          filter: 'blur(40px)',
          zIndex: 0,
          animation: 'pulse 3s ease-in-out infinite',
          '@keyframes pulse': {
            '0%, 100%': { opacity: 0.5, transform: 'translate(-50%, -50%) scale(1)' },
            '50%': { opacity: 0.8, transform: 'translate(-50%, -50%) scale(1.1)' },
          },
        }}
      />

      {/* Image container with 3D effect */}
      <MotionBox
        whileHover={{ scale: 1.02, rotateY: 2 }}
        transition={{ duration: 0.4 }}
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: `0 20px 60px ${accentColor}30, 0 0 0 1px ${accentColor}20`,
          border: `2px solid ${accentColor}40`,
          background: theme.palette.mode === 'dark' 
            ? 'rgba(20, 20, 20, 0.5)' 
            : 'rgba(255, 255, 255, 0.1)',
        }}
      >
        <Image
          src={image}
          alt={title}
          fill
          style={{ objectFit: "cover" }}
          priority
        />

        {/* Overlay gradient */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(180deg, transparent 0%, ${accentColor}10 100%)`,
            pointerEvents: 'none',
          }}
        />

        {/* Animated corner accents */}
        {[
          { top: 0, left: 0, rotate: 0 },
          { top: 0, right: 0, rotate: 90 },
          { bottom: 0, right: 0, rotate: 180 },
          { bottom: 0, left: 0, rotate: 270 },
        ].map((pos, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
            style={{
              position: 'absolute',
              ...pos,
              width: '30px',
              height: '30px',
            }}
          >
            <Box
              sx={{
                width: '100%',
                height: '100%',
                borderTop: `3px solid ${accentColor}`,
                borderLeft: `3px solid ${accentColor}`,
                transform: `rotate(${pos.rotate}deg)`,
                boxShadow: `0 0 10px ${accentColor}80`,
              }}
            />
          </motion.div>
        ))}
      </MotionBox>

      {/* Bottom accent bar with loading animation */}
      <Box
        component={motion.div}
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '6px',
          background: `linear-gradient(90deg, ${accentColor}, #39fcfcff, ${accentColor})`,
          boxShadow: `0 0 20px ${accentColor}`,
          zIndex: 2,
        }}
      />

      {/* Scanning line effect */}
      <motion.div
        animate={{
          top: ['-10%', '110%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
          repeatDelay: 2,
        }}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          height: '2px',
          background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
          boxShadow: `0 0 20px ${accentColor}`,
          filter: 'blur(1px)',
          zIndex: 1,
        }}
      />
    </MotionBox>
  );
};