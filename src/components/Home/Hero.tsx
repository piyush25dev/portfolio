'use client';

import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { scroller } from 'react-scroll';
import { Icon } from '@iconify/react';
import ScatterText3D from './HeroScene';

const CustomButton = lazy(() => import('../ui/CustomButton'));

// soft CSS fade for the non-text parts (buttons); replays every time the hero comes into view
const fadeIn = (active: boolean, delay: number) =>
  active
    ? {
        animation: `fadeUp 0.7s cubic-bezier(0.43, 0.13, 0.23, 0.96) ${delay}s both`,
        '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
      }
    : { opacity: 0 };

const scrollTo = (target: string) =>
  scroller.scrollTo(target, {
    duration: 800,
    smooth: 'easeInOutQuart',
    offset: -64,
  });

const scrollToContact = () => scrollTo('contact');
const scrollToProjects = () => scrollTo('projects');

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

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  // true while the hero is on screen; every false -> true change replays the animation
  const [inView, setInView] = useState(false);
  // real text stays hidden until the three.js animation has finished (or is skipped)
  const [textReady, setTextReady] = useState(false);

 useEffect(() => {
  const el = heroRef.current;

  if (!el || typeof IntersectionObserver === "undefined") {
    setInView(true);
    return;
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        // Trigger only when entering the viewport.
        setInView(true);
      } else {
        // Reset only after completely leaving the viewport.
        setInView(false);
        setTextReady(false);
      }
    },
    {
      threshold: 0,
    }
  );

  observer.observe(el);

  return () => observer.disconnect();
}, []);


  return (
    <Box
      ref={heroRef}
      className={textReady ? undefined : 'scatter-pending'}
      sx={{
        minHeight: '100vh',
        '@supports (height: 100svh)': { minHeight: '100svh' },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        color: 'white',
        transform: 'translateZ(0)',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
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
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant="h1"
            component="h1"
            data-scatter
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
              data-scatter-gradient
              sx={{
                background: 'linear-gradient(135deg, #00c8ff, #00ffc8, #ff00c8)',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'gradientShift 4s ease infinite',
              }}
            >
              Piyush
            </Box>
          </Typography>

          <Typography
            variant="h4"
            component="h2"
            data-scatter
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

          <Typography
            variant="body1"
            component="p"
            data-scatter
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
              <Box sx={fadeIn(inView, 1.8)}>
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
                  }}
                >
                  Get In Touch
                </CustomButton>
              </Box>

              <Box sx={fadeIn(inView, 1.95)}>
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
                  }}
                >
                  Explore Work
                </CustomButton>
              </Box>
            </Suspense>
          </Box>

          <Box
            role="button"
            tabIndex={0}
            aria-label="Scroll to projects"
            onClick={scrollToProjects}
            onKeyDown={(e: React.KeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') scrollToProjects();
            }}
            sx={{
              display: 'inline-flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              opacity: 0.7,
              transition: 'opacity 0.2s ease',
              '&:hover, &:focus-visible': { opacity: 1 },
            }}
          >
            <Typography
              variant="caption"
              component="span"
              data-scatter
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
                display: 'inline-flex',
                animation: 'bounce 1.5s ease-in-out infinite',
              }}
            >
              <Icon icon="mdi:chevron-double-down" width={24} height={24} color="white" />
            </Box>
          </Box>
        </Box>
      </Container>

      {/* Three.js overlay: scatters and arranges every [data-scatter] text whenever the hero scrolls into view */}
      <ScatterText3D containerRef={heroRef} play={inView} onComplete={() => setTextReady(true)} />

      <style>
        {`
          .scatter-pending [data-scatter] { opacity: 0; }

          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to   { opacity: 1; transform: translateY(0); }
          }

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
        `}
      </style>
    </Box>
  );
};

export default Hero;