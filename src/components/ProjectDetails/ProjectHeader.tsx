import React, { useMemo } from 'react';
import { Box, Button, Typography, Chip, useTheme, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GitHubIcon from '@mui/icons-material/GitHub';
import LaunchIcon from '@mui/icons-material/Launch';
import Link from 'next/link';

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionChip = motion(Chip);

interface ProjectHeaderProps {
  title: string;
  technologies: string[];
  description?: string;
  github?: string;
  demoUrl?: string;
  accentColor: string;
  isInView: boolean;
}

// Utility function to generate stable positions based on a seed
function generateStablePositions(count: number, seed: string) {
  const positions = [];
  
  // Create a simple hash from the seed string
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0; // Convert to 32-bit integer
  }
  
  // Use the hash to seed a simple pseudo-random number generator
  const seededRandom = (n: number) => {
    const x = Math.sin(hash + n) * 10000;
    return x - Math.floor(x);
  };
  
  for (let i = 0; i < count; i++) {
    const baseSeed = i * 100;
    positions.push({
      // Initial position
      initialX: seededRandom(baseSeed) * 100,
      initialY: seededRandom(baseSeed + 1) * 100,
      // Animation keyframes
      animX1: seededRandom(baseSeed + 2) * 100,
      animY1: seededRandom(baseSeed + 3) * 100,
      animX2: seededRandom(baseSeed + 4) * 100,
      animY2: seededRandom(baseSeed + 5) * 100,
    });
  }
  
  return positions;
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  title,
  technologies,
  description,
  github,
  demoUrl,
  accentColor,
  isInView,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Generate stable positions once using useMemo
  // This ensures the same values are used on server and client
  const stablePositions = useMemo(
    () => generateStablePositions(6, title + accentColor + 'portfolio-animation'),
    [title, accentColor]
  );

  return (
    <MotionBox
      sx={{
        background: `linear-gradient(135deg, ${theme.palette.mode === 'dark' 
          ? 'rgba(40, 40, 40, 0.5)' 
          : 'rgba(5, 144, 250, 0.4)'} 0%, ${theme.palette.mode === 'dark' 
          ? 'rgba(60, 60, 60, 0.3)' 
          : 'rgba(9, 240, 248, 0.3)'} 100%)`,
        backdropFilter: 'blur(20px)',
        borderRadius: 3,
        p: { xs: 3, sm: 4, md: 5 },
        position: 'relative',
        overflow: 'hidden',
        border: `1px solid ${accentColor}30`,
        boxShadow: theme.palette.mode === 'dark' 
          ? "0 15px 40px rgba(71, 242, 248, 0.2)" 
          : "0 15px 40px rgba(9, 240, 248, 0.3)",
      }}
    >
      {/* Animated background particles - NOW WITH STABLE POSITIONS */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          overflow: 'hidden',
        }}
      >
        {stablePositions.map((pos, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: pos.initialX + '%', 
              y: pos.initialY + '%' 
            }}
            animate={{
              x: [pos.initialX + '%', pos.animX1 + '%', pos.animX2 + '%'],
              y: [pos.initialY + '%', pos.animY1 + '%', pos.animY2 + '%'],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: 'linear',
              repeatType: 'mirror', // Makes the animation go back and forth smoothly
            }}
            style={{
              position: 'absolute',
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${accentColor}40, transparent)`,
              filter: 'blur(20px)',
              willChange: 'transform', // Performance optimization
            }}
          />
        ))}
      </Box>

      {/* Back button */}
      <MotionBox
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        sx={{ mb: 3, position: 'relative', zIndex: 2 }}
      >
        <Link href="/#projects" passHref >
          <Button
            startIcon={<ArrowBackIcon />}
            variant="outlined"
            size={isMobile ? "small" : "medium"}
            sx={{
              borderRadius: '12px',
              borderColor: accentColor,
              color: accentColor,
              backdropFilter: 'blur(10px)',
              backgroundColor: `${accentColor}10`,
              '&:hover': {
                backgroundColor: `${accentColor}30`,
                borderColor: accentColor,
                transform: 'translateX(-5px)',
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            Back to Projects
          </Button>
        </Link>
      </MotionBox>

      {/* Title with gradient animation */}
      <MotionTypography
        variant={isMobile ? "h4" : "h3"}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.7, ease: [0.6, 0.05, 0.01, 0.9] }}
        sx={{
          fontWeight: 800,
          background: `linear-gradient(135deg, ${accentColor}, #39fcfcff)`,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 3,
          position: 'relative',
          zIndex: 2,
          fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' },
        }}
      >
        {title}
      </MotionTypography>

      {/* Technologies with stagger animation */}
      <MotionBox
        sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 1.5, 
          mb: 4,
          position: 'relative',
          zIndex: 2,
        }}
      >
        {technologies.map((tech, index) => (
          <MotionChip
            key={index}
            label={tech}
            size={isMobile ? "small" : "medium"}
            initial={{ opacity: 0, scale: 0, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            whileHover={{ scale: 1.1, y: -3 }}
            transition={{
              delay: index * 0.08,
              duration: 0.5,
              type: 'spring',
              stiffness: 200,
            }}
            sx={{
              background: `linear-gradient(135deg, ${accentColor}30, ${accentColor}50)`,
              color: '#fff',
              fontWeight: 600,
              borderRadius: '10px',
              border: `1px solid ${accentColor}60`,
              backdropFilter: 'blur(10px)',
              boxShadow: `0 4px 15px ${accentColor}20`,
              '&:hover': {
                background: `linear-gradient(135deg, ${accentColor}50, ${accentColor}70)`,
              },
            }}
          />
        ))}
      </MotionBox>

      {/* Description with typing effect appearance */}
      <MotionTypography
        variant="body1"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        sx={{
          mb: 4,
          color: '#fff',
          lineHeight: 1.8,
          fontSize: { xs: '1rem', sm: '1.1rem' },
          position: 'relative',
          zIndex: 2,
          textShadow: '0 2px 10px rgba(0,0,0,0.3)',
        }}
      >
        {description}
      </MotionTypography>

      {/* Action buttons with bounce animation */}
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          position: 'relative',
          zIndex: 2,
        }}
      >
        {github && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="contained"
              startIcon={<GitHubIcon />}
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              fullWidth={isMobile}
              size={isMobile ? "medium" : "large"}
              sx={{
                background: `linear-gradient(135deg, ${accentColor}, ${accentColor}CC)`,
                color: '#000',
                fontWeight: 600,
                borderRadius: '12px',
                px: 4,
                py: 1.5,
                boxShadow: `0 6px 20px ${accentColor}40`,
                '&:hover': {
                  background: `linear-gradient(135deg, ${accentColor}DD, ${accentColor})`,
                  boxShadow: `0 8px 25px ${accentColor}60`,
                },
                transition: 'all 0.3s ease',
              }}
            >
              View Code
            </Button>
          </motion.div>
        )}
        {demoUrl && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outlined"
              startIcon={<LaunchIcon />}
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              fullWidth={isMobile}
              size={isMobile ? "medium" : "large"}
              sx={{
                borderColor: accentColor,
                color: accentColor,
                fontWeight: 600,
                borderRadius: '12px',
                px: 4,
                py: 1.5,
                borderWidth: 2,
                backdropFilter: 'blur(10px)',
                backgroundColor: `${accentColor}10`,
                '&:hover': {
                  backgroundColor: `${accentColor}30`,
                  borderColor: accentColor,
                  borderWidth: 2,
                },
                transition: 'all 0.3s ease',
              }}
            >
              Live Demo
            </Button>
          </motion.div>
        )}
      </MotionBox>
    </MotionBox>
  );
};