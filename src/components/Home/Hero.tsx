"use client"
import React, { useEffect, useRef } from 'react';
import { Box, Container, Typography, useTheme, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import CustomButton from '../ui/CustomButton';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CodeIcon from '@mui/icons-material/Code';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

gsap.registerPlugin(ScrollTrigger);

const MotionBox = motion(Box);

const Hero: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (heroRef.current) {
      // Parallax effect
      gsap.to(heroRef.current, {
        y: isMobile ? -30 : -80,
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      return () => {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      };
    }
  }, [isMobile]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, 0.05, 0.01, 0.9],
      },
    },
  };

  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  return (
    <Box
      ref={heroRef}
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: 'transparent',
      }}
    >

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <MotionBox
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          sx={{ textAlign: 'center', mt: 8 }}
        >
          {/* Greeting badge */}
          <MotionBox variants={itemVariants}>
            <motion.div
              animate={floatingAnimation}
              style={{ display: 'inline-block' }}
            >
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 3,
                  py: 1,
                  borderRadius: '50px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  mb: 3,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                }}
              >
                <AutoAwesomeIcon sx={{ color: '#FFD700', fontSize: '1.2rem' }} />
                <Typography
                  variant="body2"
                  sx={{
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: { xs: '0.85rem', sm: '0.95rem' },
                  }}
                >
                  Welcome to my portfolio
                </Typography>
              </Box>
            </motion.div>
          </MotionBox>

          {/* Main heading with gradient */}
          <MotionBox variants={itemVariants}>
            <Typography
              variant="h1"
              component="h1"
              sx={{
                mb: 2,
                fontWeight: 800,
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem', lg: '5.5rem' },
                background: 'linear-gradient(135deg, #90CAF9 0%, #CE93D8 50%, #80DEEA 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1.2,
                textShadow: '0 0 80px rgba(144, 202, 249, 0.5)',
              }}
            >
              Hi, I&apos;m Piyush
            </Typography>
          </MotionBox>

          {/* Subheading with icon */}
          <MotionBox variants={itemVariants}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 2,
                mb: 3,
              }}
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
              >
                <CodeIcon
                  sx={{
                    fontSize: { xs: '2rem', sm: '2.5rem' },
                    color: '#90CAF9',
                    filter: 'drop-shadow(0 0 10px rgba(144, 202, 249, 0.8))',
                  }}
                />
              </motion.div>
              <Typography
                variant="h2"
                component="h2"
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                  color: '#fff',
                  textShadow: '0 2px 20px rgba(0, 0, 0, 0.3)',
                }}
              >
                Frontend Developer
              </Typography>
            </Box>
          </MotionBox>

          {/* Description */}
          <MotionBox variants={itemVariants}>
            <Typography
              variant="h6"
              sx={{
                mb: 5,
                color: 'rgba(255, 255, 255, 0.8)',
                maxWidth: '600px',
                mx: 'auto',
                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                fontWeight: 400,
                lineHeight: 1.6,
              }}
            >
              Crafting beautiful, responsive web experiences with modern technologies
            </Typography>
          </MotionBox>

          {/* CTA Buttons */}
          <MotionBox
            variants={itemVariants}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: { xs: 2, sm: 3 },
              flexDirection: { xs: 'column', sm: 'row' },
              maxWidth: { xs: '300px', sm: '100%' },
              mx: 'auto',
            }}
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <CustomButton
                variant="contained"
                color="primary"
                size="large"
                href="#contact"
                sx={{
                  px: { xs: 4, sm: 5 },
                  py: { xs: 1.5, sm: 2 },
                  fontSize: { xs: '1rem', sm: '1.1rem' },
                  fontWeight: 700,
                  borderRadius: '50px',
                  background: 'linear-gradient(135deg, #90CAF9, #CE93D8)',
                  boxShadow: '0 8px 30px rgba(144, 202, 249, 0.4)',
                  border: 'none',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                    transition: 'left 0.5s',
                  },
                  '&:hover::before': {
                    left: '100%',
                  },
                  '&:hover': {
                    boxShadow: '0 12px 40px rgba(144, 202, 249, 0.6)',
                  },
                }}
              >
                Contact Me
              </CustomButton>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <CustomButton
                variant="outlined"
                color="inherit"
                size="large"
                href="#projects"
                sx={{
                  px: { xs: 4, sm: 5 },
                  py: { xs: 1.5, sm: 2 },
                  fontSize: { xs: '1rem', sm: '1.1rem' },
                  fontWeight: 700,
                  borderRadius: '50px',
                  borderWidth: '2px',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  color: '#fff',
                  backdropFilter: 'blur(10px)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  '&:hover': {
                    borderWidth: '2px',
                    borderColor: '#90CAF9',
                    background: 'rgba(144, 202, 249, 0.1)',
                    boxShadow: '0 8px 30px rgba(144, 202, 249, 0.3)',
                  },
                }}
              >
                View Work
              </CustomButton>
            </motion.div>
          </MotionBox>

          {/* Scroll indicator */}
          <MotionBox
            variants={itemVariants}
            sx={{ mt: { xs: 6, sm: 8, md: 10 } }}
          >
            <motion.div
              animate={{
                y: [0, 10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Box
                sx={{
                  display: 'inline-flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1,
                  opacity: 0.6,
                  cursor: 'pointer',
                  transition: 'opacity 0.3s',
                  '&:hover': {
                    opacity: 1,
                  },
                }}
                onClick={() => {
                  document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: '#fff',
                    fontSize: '0.85rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}
                >
                  Scroll Down
                </Typography>
                <ArrowDownwardIcon sx={{ color: '#90CAF9', fontSize: '1.5rem' }} />
              </Box>
            </motion.div>
          </MotionBox>
        </MotionBox>
      </Container>
    </Box>
  );
};

export default Hero;