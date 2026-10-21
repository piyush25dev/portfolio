import React, { useRef, lazy, Suspense } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { motion, useInView } from 'framer-motion';
import { scroller } from 'react-scroll';
import { Icon } from '@iconify/react';

const CustomButton = lazy(() => import('../ui/CustomButton'));

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

const titleVariants = {
  hidden: { y: 80, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.43, 0.13, 0.23, 0.96],
    },
  },
};

const subtitleVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.43, 0.13, 0.23, 0.96],
    },
  },
};

const buttonVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: (custom: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      delay: custom * 0.15,
      ease: [0.43, 0.13, 0.23, 0.96],
    },
  }),
};

const scrollHintVariants = {
  hidden: { y: 15, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      delay: 0.6,
    },
  },
};

const scrollToContact = () => {
  scroller.scrollTo('contact', {
    duration: 800,
    smooth: 'easeInOutQuart',
    offset: -64,
  });
};

const scrollToProjects = () => {
  scroller.scrollTo('projects', {
    duration: 800,
    smooth: 'easeInOutQuart',
    offset: -64,
  });
};

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(heroRef, { 
    once: false,
    amount: 0.2,
    margin: "-100px 0px -100px 0px",
  });

  const ButtonFallback = () => (
    <Box
      sx={{
        px: 5,
        py: 1.8,
        width: { xs: '100%', sm: 'auto' },
        minWidth: '160px',
        borderRadius: '8px',
        background: 'rgba(255,255,255,0.05)',
      }}
    />
  );

  return (
    <Box
      ref={heroRef}
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        color: 'white',
        transform: 'translateZ(0)',
        willChange: 'transform',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(0,200,255,0.08) 0%, rgba(0,0,0,0) 70%)',
          zIndex: 0,
          animation: 'pulseGradient 6s ease-in-out infinite',
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(0,200,255,0.15), rgba(0,255,200,0.08))',
          filter: 'blur(100px)',
          zIndex: 0,
          animation: 'floatGlow 3s ease-in-out infinite',
          willChange: 'transform',
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,200,255,0.1), transparent)',
          filter: 'blur(80px)',
          zIndex: 0,
          bottom: '10%',
          right: '5%',
          animation: 'floatOrb 4s ease-in-out infinite',
          willChange: 'transform',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          style={{ willChange: 'transform, opacity' }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <motion.div 
              variants={titleVariants}
              style={{ willChange: 'transform, opacity' }}
            >
              <Typography
                variant="h1"
                component="h1"
                sx={{
                  fontWeight: 800,
                  fontSize: {
                    xs: '2.8rem',
                    sm: '4rem',
                    md: '5.5rem',
                    lg: '6.5rem',
                  },
                  lineHeight: 1.1,
                  my: 2,
                  textTransform: 'uppercase',
                  letterSpacing: '-0.02em',
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                }}
              >
                Hi, I&apos;m{' '}
                <Box
                  component="span"
                  sx={{
                    background: 'linear-gradient(135deg, #00c8ff, #00ffc8, #ff00c8)',
                    backgroundSize: '200% 200%',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    animation: 'gradientShift 4s ease infinite',
                    willChange: 'background-position',
                  }}
                >
                  Piyush
                </Box>
              </Typography>
            </motion.div>

            <motion.div 
              variants={subtitleVariants}
              style={{ willChange: 'transform, opacity' }}
            >
              <Typography
                variant="h4"
                component="h2"
                sx={{
                  color: 'rgba(255,255,255,0.85)',
                  mb: 2,
                  fontWeight: 500,
                  letterSpacing: '0.05em',
                  WebkitFontSmoothing: 'antialiased',
                }}
              >
                Frontend Developer
              </Typography>
            </motion.div>

            <motion.div 
              variants={subtitleVariants}
              style={{ willChange: 'transform, opacity' }}
            >
              <Typography
                variant="body1"
                component="p"
                sx={{
                  color: 'rgba(255,255,255,0.6)',
                  mb: 6,
                  maxWidth: '600px',
                  mx: 'auto',
                  fontSize: '1.1rem',
                  WebkitFontSmoothing: 'antialiased',
                }}
              >
                Crafting beautiful, responsive web experiences with modern technologies
              </Typography>
            </motion.div>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 3,
                flexDirection: { xs: 'column', sm: 'row' },
                mb: 6,
              }}
            >
              <Suspense fallback={<ButtonFallback />}>
                <motion.div
                  variants={buttonVariants}
                  custom={0}
                  style={{ willChange: 'transform, opacity' }}
                >
                  <CustomButton
                    variant="contained"
                    size="large"
                    onClick={scrollToContact}
                    sx={{
                      px: 5,
                      py: 1.8,
                      width: { xs: '100%', sm: 'auto' },
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      background: 'linear-gradient(135deg, #00c8ff, #00ffc8)',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px) scale(1.03)',
                        boxShadow: '0 10px 30px rgba(0,200,255,0.3)',
                      },
                      willChange: 'transform',
                    }}
                  >
                    Get In Touch
                  </CustomButton>
                </motion.div>

                <motion.div
                  variants={buttonVariants}
                  custom={1}
                  style={{ willChange: 'transform, opacity' }}
                >
                  <CustomButton
                    variant="outlined"
                    size="large"
                    onClick={scrollToProjects}
                    sx={{
                      px: 5,
                      py: 1.8,
                      width: { xs: '100%', sm: 'auto' },
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderWidth: '2px',
                      transition: 'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px) scale(1.03)',
                        borderColor: '#00ffc8',
                        boxShadow: '0 5px 20px rgba(0,255,200,0.2)',
                      },
                      willChange: 'transform',
                    }}
                  >
                    Explore Work
                  </CustomButton>
                </motion.div>
              </Suspense>
            </Box>

            {/* Scroll Hint with Animation - Updated with Iconify */}
            <motion.div
              variants={scrollHintVariants}
              style={{
                position: 'relative',
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                opacity: 0.7,
                transition: 'opacity 0.3s ease',
                willChange: 'transform, opacity',
              }}
              whileHover={{
                opacity: 1,
                transition: { duration: 0.2 },
              }}
              onClick={scrollToProjects}
            >
              <Typography
                variant="caption"
                component="span"
                sx={{
                  mb: 1,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  WebkitFontSmoothing: 'antialiased',
                }}
              >
                Scroll to explore
              </Typography>
              <Box
                sx={{
                  animation: 'bounce 1.5s ease-in-out infinite',
                  willChange: 'transform',
                  display: 'inline-flex',
                }}
              >
                <Icon icon="mdi:chevron-double-down" width={24} height={24} color="white" />
              </Box>
            </motion.div>
          </Box>
        </motion.div>
      </Container>

      <style>
        {`
          @keyframes floatGlow {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(25px); }
          }
          
          @keyframes floatOrb {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
          }
          
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(10px); }
          }
          
          @keyframes pulseGradient {
            0%, 100% { transform: scale(1); opacity: 0.6; }
            50% { transform: scale(1.1); opacity: 1; }
          }
          
          .float-glow, .float-orb, .bounce {
            will-change: transform;
            backface-visibility: hidden;
          }
        `}
      </style>
    </Box>
  );
};

export default Hero;