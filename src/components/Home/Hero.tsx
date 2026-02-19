import React, { useEffect, useRef, useState } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import CustomButton from '../ui/CustomButton';
import { scroller } from 'react-scroll';

gsap.registerPlugin(ScrollTrigger);

// ── Typewriter hook ───────────────────────────────────────────────────────────
function useTypewriter(text: string, speed = 55, startDelay = 1200) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    setDisplayed('');
    setDone(false);
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayed(text.slice(0, ++i));
        if (i >= text.length) { clearInterval(interval); setDone(true); }
      }, speed);
      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(timeout);
  }, [text, speed, startDelay]);

  return { displayed, done };
}

// ── Shimmer reveal text — each letter drops in with a stagger + light sweep ──
const ShimmerRevealText: React.FC<{ text: string; delay?: number }> = ({ text, delay = 0 }) => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setActive(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <Box
      component="span"
      sx={{
        position: 'relative',
        display: 'inline-block',
        // Shimmer sweep on the whole word after letters settle
        '&::after': active ? {
          content: '""',
          position: 'absolute',
          top: 0, left: '-100%',
          width: '60%', height: '100%',
          background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.35) 50%, transparent 70%)',
          animation: 'wordShimmer 2.8s ease 0.6s infinite',
          '@keyframes wordShimmer': {
            '0%':   { left: '-80%', opacity: 0 },
            '10%':  { opacity: 1               },
            '80%':  { left: '120%', opacity: 1 },
            '100%': { left: '120%', opacity: 0 },
          },
          pointerEvents: 'none',
        } : {},
      }}
    >
      {text.split('').map((char, i) => (
        <Box
          key={i}
          component="span"
          style={{
            display: 'inline-block',
            transition: `opacity 400ms ease ${delay + i * 55}ms, transform 500ms cubic-bezier(0.34,1.56,0.64,1) ${delay + i * 55}ms`,
            opacity:   active ? 1 : 0,
            transform: active ? 'translateY(0px) rotateX(0deg)' : 'translateY(28px) rotateX(-40deg)',
            transformOrigin: 'bottom center',
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </Box>
      ))}
    </Box>
  );
};

// ── Floating orb ──────────────────────────────────────────────────────────────
const FloatOrb: React.FC<{
  size: number; color: string; top?: string; left?: string;
  right?: string; bottom?: string; delay?: number; duration?: number;
}> = ({ size, color, top, left, right, bottom, delay = 0, duration = 8 }) => (
  <Box
    sx={{
      position: 'absolute',
      width: size, height: size,
      borderRadius: '50%',
      background: `radial-gradient(circle, ${color}, transparent 70%)`,
      filter: `blur(${size / 3}px)`,
      top, left, right, bottom,
      animation: `orbFloat ${duration}s ease-in-out ${delay}s infinite alternate`,
      pointerEvents: 'none',
      '@keyframes orbFloat': {
        '0%':   { transform: 'translate(0px, 0px) scale(1)'   },
        '50%':  { transform: 'translate(20px, -30px) scale(1.1)' },
        '100%': { transform: 'translate(-15px, 20px) scale(0.95)' },
      },
    }}
  />
);

// ── Scan line overlay ─────────────────────────────────────────────────────────
const ScanLine: React.FC = () => (
  <Box
    sx={{
      position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
      background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.015) 2px, rgba(0,255,255,0.015) 4px)',
      animation: 'scanMove 8s linear infinite',
      '@keyframes scanMove': {
        '0%':   { backgroundPosition: '0 0'    },
        '100%': { backgroundPosition: '0 100px' },
      },
    }}
  />
);

// ── Main Hero ─────────────────────────────────────────────────────────────────
const Hero: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const heroRef  = useRef<HTMLDivElement>(null);
  const textRef  = useRef<HTMLDivElement>(null);

  // Typewriter for subtitle
  const { displayed: typedRole, done: roleDone } = useTypewriter('Frontend Developer', 65, 900);

  useEffect(() => {
    setMounted(true);
    if (mounted && heroRef.current && textRef.current) {
      gsap.from(heroRef.current, { opacity: 0, duration: 1.2, ease: 'power3.out' });

      gsap.from(textRef.current.children, {
        y: 60, opacity: 0, stagger: 0.15,
        duration: 1, ease: 'power3.out',
      });

      gsap.to(heroRef.current, {
        y: -50,
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top', end: 'bottom top', scrub: true,
        },
      });

      return () => {
        ScrollTrigger.getAll().forEach(t => t.kill());
        gsap.killTweensOf('*');
      };
    }
  }, [mounted]);

  const scrollToContact  = () => scroller.scrollTo('contact',  { duration: 800, smooth: 'easeInOutQuart', offset: -64 });
  const scrollToProjects = () => scroller.scrollTo('projects', { duration: 800, smooth: 'easeInOutQuart', offset: -64 });

  return (
    <Box
      ref={heroRef}
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ── Ambient orbs ── */}
      <FloatOrb size={420} color="rgba(0,200,255,0.18)"  top="-80px"  left="-100px" delay={0} duration={9}  />
      <FloatOrb size={320} color="rgba(120,80,255,0.15)" bottom="-60px" right="-80px" delay={2} duration={11} />
      <FloatOrb size={200} color="rgba(0,255,180,0.12)"  top="40%"    left="60%"     delay={1} duration={7}  />

      {/* ── CRT scan lines ── */}
      <ScanLine />

      {/* ── Grid lines ── */}
      <Box sx={{
        position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(rgba(0,255,255,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,255,255,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        maskImage: 'radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 100%)',
      }} />

      {/* ── Corner brackets ── */}
      {[
        { top: 24, left: 24,   borderTop: '2px solid rgba(0,255,255,0.5)', borderLeft:  '2px solid rgba(0,255,255,0.5)' },
        { top: 24, right: 24,  borderTop: '2px solid rgba(0,255,255,0.5)', borderRight: '2px solid rgba(0,255,255,0.5)' },
        { bottom: 24, left: 24,  borderBottom: '2px solid rgba(0,255,255,0.5)', borderLeft:  '2px solid rgba(0,255,255,0.5)' },
        { bottom: 24, right: 24, borderBottom: '2px solid rgba(0,255,255,0.5)', borderRight: '2px solid rgba(0,255,255,0.5)' },
      ].map((style, i) => (
        <Box key={i} sx={{
          position: 'absolute', width: 36, height: 36, ...style, zIndex: 2,
          animation: `bracketPulse 3s ease-in-out ${i * 0.4}s infinite`,
          '@keyframes bracketPulse': {
            '0%, 100%': { opacity: 0.4 },
            '50%':      { opacity: 1   },
          },
        }} />
      ))}

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 3 }}>
        <Box ref={textRef} sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>

          {/* ── Status badge ── */}
          <Box
            sx={{
              display: 'inline-flex', alignItems: 'center', gap: 1,
              mb: 3, px: 2, py: 0.75, borderRadius: '100px',
              border: '1px solid rgba(0,255,200,0.35)',
              background: 'rgba(0,255,200,0.08)',
              backdropFilter: 'blur(10px)',
              animation: 'badgeFadeIn 0.8s ease 0.3s both',
              '@keyframes badgeFadeIn': {
                from: { opacity: 0, transform: 'translateY(-12px)' },
                to:   { opacity: 1, transform: 'translateY(0px)'   },
              },
            }}
          >
            <Box sx={{
              width: 8, height: 8, borderRadius: '50%',
              background: '#00ffc8',
              boxShadow: '0 0 8px #00ffc8',
              animation: 'statusPulse 2s ease-in-out infinite',
              '@keyframes statusPulse': {
                '0%, 100%': { opacity: 1, transform: 'scale(1)'   },
                '50%':      { opacity: 0.4, transform: 'scale(0.7)' },
              },
            }} />
            <Typography sx={{ fontSize: '0.78rem', color: '#00ffc8', fontFamily: 'monospace', letterSpacing: '0.1em' }}>
              AVAILABLE FOR WORK
            </Typography>
          </Box>

          {/* ── Main name ── */}
          <Typography
            variant="h1"
            component="h1"
            sx={{
              mb: 2, fontWeight: 800,
              fontSize: { xs: '2.2rem', sm: '3.5rem', md: '5rem' },
              lineHeight: 1.1,
              textShadow: '0 0 40px rgba(0,200,255,0.3)',
              animation: 'nameFadeIn 1s cubic-bezier(0.22,1,0.36,1) 0.5s both',
              '@keyframes nameFadeIn': {
                from: { opacity: 0, transform: 'translateY(30px) scale(0.96)' },
                to:   { opacity: 1, transform: 'translateY(0px)  scale(1)'    },
              },
            }}
          >
            Hi, I&apos;m{' '}
            <ShimmerRevealText text="Piyush Kumar" delay={600} />
            <br />
            <Box component="span" sx={{
              background: 'linear-gradient(135deg, #00c8ff, #00ffc8, #7c5cff)',
              WebkitBackgroundClip: 'text', backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block',
              animation: 'gradientShift 4s ease infinite',
              backgroundSize: '200% auto',
              '@keyframes gradientShift': {
                '0%':   { backgroundPosition: '0% center'   },
                '50%':  { backgroundPosition: '100% center' },
                '100%': { backgroundPosition: '0% center'   },
              },
            }}>
              Dewangan
            </Box>
          </Typography>

          {/* ── Typewriter subtitle ── */}
          <Box sx={{
            mb: 4, display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: 0.5,
            animation: 'subtitleFadeIn 0.8s ease 0.8s both',
            '@keyframes subtitleFadeIn': {
              from: { opacity: 0 },
              to:   { opacity: 1 },
            },
          }}>
            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontFamily: 'monospace',
                fontWeight: 400,
                fontSize: { xs: '1.1rem', sm: '1.5rem', md: '2rem' },
                color: 'rgba(255,255,255,0.7)',
                letterSpacing: '0.05em',
              }}
            >
              <Box component="span" sx={{ color: 'rgba(0,255,200,0.7)', mr: 1 }}>{'>'}</Box>
              {typedRole}
              {/* Blinking cursor */}
              <Box
                component="span"
                sx={{
                  display: 'inline-block',
                  width: '2px', height: '1.1em',
                  background: '#00ffc8',
                  ml: '3px', verticalAlign: 'text-bottom',
                  animation: roleDone ? 'cursorBlink 1s step-end infinite' : 'none',
                  opacity: roleDone ? 1 : 0,
                  '@keyframes cursorBlink': {
                    '0%, 100%': { opacity: 1 },
                    '50%':      { opacity: 0 },
                  },
                }}
              />
            </Typography>
          </Box>

          {/* ── Decorative line ── */}
          <Box sx={{
            mx: 'auto', mb: 5, height: '1px', maxWidth: 320,
            background: 'linear-gradient(90deg, transparent, rgba(0,200,255,0.6), transparent)',
            animation: 'lineGrow 0.8s ease 1.4s both',
            '@keyframes lineGrow': {
              from: { width: 0, opacity: 0 },
              to:   { width: '100%', opacity: 1 },
            },
          }} />

          {/* ── CTA Buttons ── */}
          <Box
            sx={{
              mt: 2, display: 'flex', justifyContent: 'center',
              gap: { xs: 2, sm: 4 },
              flexDirection: { xs: 'column', sm: 'row' },
              animation: 'buttonsFadeIn 0.8s ease 1.6s both',
              '@keyframes buttonsFadeIn': {
                from: { opacity: 0, transform: 'translateY(20px)' },
                to:   { opacity: 1, transform: 'translateY(0px)'  },
              },
            }}
          >
            <CustomButton
              variant="contained"
              color="primary"
              size="large"
              onClick={scrollToContact}
              sx={{
                position: 'relative', overflow: 'hidden',
                fontWeight: 700, letterSpacing: '0.08em',
                px: 4, py: 1.5,
                boxShadow: '0 0 25px rgba(0,200,255,0.35)',
                '&::before': {
                  content: '""',
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.15), transparent)',
                  opacity: 0, transition: 'opacity 0.3s ease',
                },
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: '0 0 40px rgba(0,200,255,0.6)',
                  '&::before': { opacity: 1 },
                },
                transition: 'all 0.3s cubic-bezier(0.34,1.45,0.64,1)',
              }}
            >
              Contact Me
            </CustomButton>

            <CustomButton
              variant="outlined"
              color="inherit"
              size="large"
              onClick={scrollToProjects}
              sx={{
                fontWeight: 600, letterSpacing: '0.08em',
                px: 4, py: 1.5,
                borderColor: 'rgba(0,255,200,0.5)',
                color: 'rgba(0,255,200,0.9)',
                backdropFilter: 'blur(10px)',
                background: 'rgba(0,255,200,0.06)',
                position: 'relative', overflow: 'hidden',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0, left: '-100%',
                  width: '100%', height: '2px',
                  background: 'linear-gradient(90deg, transparent, #00ffc8, transparent)',
                  transition: 'left 0.4s ease',
                },
                '&:hover': {
                  transform: 'translateY(-3px)',
                  borderColor: '#00ffc8',
                  boxShadow: '0 0 30px rgba(0,255,200,0.3)',
                  background: 'rgba(0,255,200,0.1)',
                  '&::after': { left: '100%' },
                },
                transition: 'all 0.3s cubic-bezier(0.34,1.45,0.64,1)',
              }}
            >
              View Work
            </CustomButton>
          </Box>

          {/* ── Scroll indicator ── */}
          <Box
            sx={{
              position: 'absolute',
              bottom: { xs: -80, md: -120 },
              left: '50%', transform: 'translateX(-50%)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1,
              animation: 'scrollIndicatorFade 1s ease 2.2s both',
              '@keyframes scrollIndicatorFade': {
                from: { opacity: 0 },
                to:   { opacity: 1 },
              },
            }}
          >
            <Typography sx={{
              fontSize: '0.65rem', letterSpacing: '0.2em',
              color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace',
              textTransform: 'uppercase',
            }}>
              scroll
            </Typography>
            <Box sx={{
              width: 20, height: 32, borderRadius: 10,
              border: '1.5px solid rgba(255,255,255,0.2)',
              display: 'flex', justifyContent: 'center', pt: 0.8,
            }}>
              <Box sx={{
                width: 3, height: 6, borderRadius: 10,
                background: 'rgba(0,255,200,0.7)',
                animation: 'scrollDot 2s ease-in-out infinite',
                '@keyframes scrollDot': {
                  '0%':   { transform: 'translateY(0px)', opacity: 1   },
                  '80%':  { transform: 'translateY(10px)', opacity: 0  },
                  '100%': { transform: 'translateY(0px)', opacity: 0   },
                },
              }} />
            </Box>
          </Box>

        </Box>
      </Container>
    </Box>
  );
};

export default Hero;