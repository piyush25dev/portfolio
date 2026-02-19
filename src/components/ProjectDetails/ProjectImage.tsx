import React, { useEffect, useRef, useState } from 'react';
import { Box, useTheme, SxProps, Theme } from '@mui/material';
import Image from 'next/image';

interface ProjectImageProps {
  image: string;
  title: string;
  accentColor: string;
  isInView: boolean;
}

interface CornerPosition {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  rotate: number;
}

// ── Repeatable in-view hook ───────────────────────────────────────────────
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

export const ProjectImage: React.FC<ProjectImageProps> = ({
  image,
  title,
  accentColor,
}) => {
  const theme = useTheme();
  const [imageLoaded, setImageLoaded] = useState(false);

  const wrapperAnim = useInView(0.1);
  const imageAnim   = useInView(0.1);
  const barAnim     = useInView(0.1);

  const corners: CornerPosition[] = [
    { top: 0,    left:  0, rotate: 0   },
    { top: 0,    right: 0, rotate: 90  },
    { bottom: 0, right: 0, rotate: 180 },
    { bottom: 0, left:  0, rotate: 270 },
  ];

  // Corner animation delays (ms)
  const cornerDelays = [150, 220, 290, 360];

  return (
    // ── Outer wrapper — scales + fades in ───────────────────────────────
    <Box
      ref={wrapperAnim.ref}
      style={{
        transition: 'opacity 700ms cubic-bezier(0.22,1,0.36,1), transform 750ms cubic-bezier(0.34,1.35,0.64,1)',
        opacity:   wrapperAnim.inView ? 1 : 0,
        transform: wrapperAnim.inView ? 'scale(1) translateY(0px)' : 'scale(0.9) translateY(50px)',
      }}
      sx={{
        position: 'relative',
        height: { xs: '250px', sm: '350px', md: '500px' },
        width: '100%',
        borderRadius: 3,
        overflow: 'hidden',
      }}
    >
      {/* Glow — pulses once visible */}
      <Box
        style={{
          transition: 'opacity 1000ms ease 200ms',
          opacity: wrapperAnim.inView ? 1 : 0,
        }}
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
          pointerEvents: 'none',
          animation: wrapperAnim.inView
            ? `glowBreath 4s ease-in-out infinite`
            : 'none',
          '@keyframes glowBreath': {
            '0%, 100%': { opacity: 0.6 },
            '50%':       { opacity: 1   },
          },
        }}
      />

      {/* ── Image container — slides up after wrapper ── */}
      <Box
        ref={imageAnim.ref}
        style={{
          transition: 'opacity 650ms cubic-bezier(0.22,1,0.36,1) 120ms, transform 700ms cubic-bezier(0.22,1,0.36,1) 120ms',
          opacity:   imageAnim.inView ? 1 : 0,
          transform: imageAnim.inView ? 'translateY(0px)' : 'translateY(30px)',
        }}
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: `0 20px 60px ${accentColor}30, 0 0 0 1px ${accentColor}20`,
          border: `2px solid ${accentColor}40`,
          background: theme.palette.mode === 'dark'
            ? 'rgba(20,20,20,0.5)'
            : 'rgba(255,255,255,0.1)',
          zIndex: 1,
          // Hover: lift + glow intensify
          transition: 'box-shadow 0.4s ease, transform 0.4s cubic-bezier(0.22,1,0.36,1)',
          '&:hover': {
            boxShadow: `0 32px 80px ${accentColor}50, 0 0 0 2px ${accentColor}60`,
            transform: 'scale(1.02)',
            '& .overlay': {
              opacity: 1,
            },
          },
        }}
      >
        {/* ── Skeleton loader — shown until image is ready ── */}
        <Box
          style={{
            transition: 'opacity 600ms ease',
            opacity: imageLoaded ? 0 : 1,
            pointerEvents: imageLoaded ? 'none' : 'auto',
          }}
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 5,
            overflow: 'hidden',
            background: theme.palette.mode === 'dark'
              ? 'rgba(20,20,20,0.95)'
              : 'rgba(240,248,255,0.95)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 3,
          }}
        >
          {/* Shimmer sweep */}
          <Box sx={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(105deg, transparent 30%, ${accentColor}18 50%, transparent 70%)`,
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.6s linear infinite',
            '@keyframes shimmer': {
              '0%':   { backgroundPosition: '-200% 0' },
              '100%': { backgroundPosition:  '200% 0' },
            },
          }} />

          {/* Scanner line */}
          <Box sx={{
            position: 'absolute',
            left: 0, right: 0,
            height: '2px',
            background: `linear-gradient(90deg, transparent, ${accentColor}, #39fcfcff, ${accentColor}, transparent)`,
            boxShadow: `0 0 12px ${accentColor}`,
            animation: 'scanLine 2s ease-in-out infinite',
            '@keyframes scanLine': {
              '0%':   { top: '0%',   opacity: 0 },
              '10%':  { opacity: 1              },
              '90%':  { opacity: 1              },
              '100%': { top: '100%', opacity: 0 },
            },
          }} />

          {/* Spinning ring */}
          <Box sx={{ position: 'relative', width: 64, height: 64, zIndex: 2 }}>
            <Box sx={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `3px solid ${accentColor}25` }} />
            <Box sx={{
              position: 'absolute', inset: 0,
              borderRadius: '50%',
              border: '3px solid transparent',
              borderTopColor: accentColor,
              borderRightColor: `${accentColor}80`,
              boxShadow: `0 0 16px ${accentColor}60`,
              animation: 'spin 900ms linear infinite',
              '@keyframes spin': { to: { transform: 'rotate(360deg)' } },
            }} />
            <Box sx={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 10, height: 10, borderRadius: '50%',
              background: accentColor,
              boxShadow: `0 0 12px ${accentColor}`,
              animation: 'dotPulse 900ms ease-in-out infinite',
              '@keyframes dotPulse': {
                '0%, 100%': { transform: 'translate(-50%, -50%) scale(1)',   opacity: 1   },
                '50%':      { transform: 'translate(-50%, -50%) scale(1.5)', opacity: 0.5 },
              },
            }} />
          </Box>

          {/* Loading text */}
          <Box sx={{
            zIndex: 2, display: 'flex', alignItems: 'center', gap: '3px',
            color: `${accentColor}CC`, fontSize: '0.75rem', fontWeight: 600,
            letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'monospace',
          }}>
            Loading
            {[0, 1, 2].map((i) => (
              <Box key={i} component="span" sx={{
                display: 'inline-block',
                animation: `blink 1.2s ease-in-out ${i * 0.2}s infinite`,
                '@keyframes blink': {
                  '0%, 100%': { opacity: 0.2 },
                  '50%':      { opacity: 1   },
                },
              }}>.</Box>
            ))}
          </Box>

          {/* Skeleton corner brackets */}
          {[
            { top: 12,    left: 12,  borderTop:    `2px solid ${accentColor}`, borderLeft:   `2px solid ${accentColor}` },
            { top: 12,    right: 12, borderTop:    `2px solid ${accentColor}`, borderRight:  `2px solid ${accentColor}` },
            { bottom: 12, left: 12,  borderBottom: `2px solid ${accentColor}`, borderLeft:   `2px solid ${accentColor}` },
            { bottom: 12, right: 12, borderBottom: `2px solid ${accentColor}`, borderRight:  `2px solid ${accentColor}` },
          ].map((style, i) => (
            <Box key={i} sx={{
              position: 'absolute', width: 20, height: 20, ...style,
              animation: `cornerPulse 2s ease-in-out ${i * 0.15}s infinite`,
              '@keyframes cornerPulse': {
                '0%, 100%': { opacity: 0.4 },
                '50%':      { opacity: 1   },
              },
            }} />
          ))}
        </Box>

        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
            transition: 'opacity 600ms ease',
            opacity: imageLoaded ? 1 : 0,
          }}
          priority
          onLoad={() => setImageLoaded(true)}
          onError={() => { console.error('Image failed to load:', image); setImageLoaded(true); }}
        />

        {/* Overlay gradient — brightens on hover */}
        <Box
          className="overlay"
          sx={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            background: `linear-gradient(180deg, transparent 0%, ${accentColor}18 100%)`,
            pointerEvents: 'none',
            zIndex: 2,
            opacity: 0.6,
            transition: 'opacity 0.4s ease',
          }}
        />

        {/* ── Corner accents — each draws in with staggered delay ── */}
        {corners.map((pos, i) => {
          const cornerSx: SxProps<Theme> = {
            position: 'absolute',
            ...pos,
            width:  wrapperAnim.inView ? '30px' : '0px',
            height: wrapperAnim.inView ? '30px' : '0px',
            zIndex: 3,
            borderTop:  `3px solid ${accentColor}`,
            borderLeft: `3px solid ${accentColor}`,
            transform: `rotate(${pos.rotate}deg)`,
            boxShadow: `0 0 10px ${accentColor}80`,
            transition: [
              `width  500ms cubic-bezier(0.22,1,0.36,1) ${cornerDelays[i]}ms`,
              `height 500ms cubic-bezier(0.22,1,0.36,1) ${cornerDelays[i]}ms`,
              `opacity 300ms ease ${cornerDelays[i]}ms`,
            ].join(', '),
            opacity: wrapperAnim.inView ? 1 : 0,
          };

          return <Box key={i} sx={cornerSx} />;
        })}
      </Box>

      {/* ── Bottom accent bar — expands from left ── */}
      <Box
        ref={barAnim.ref}
        style={{
          transition: 'transform 900ms cubic-bezier(0.22,1,0.36,1) 300ms, opacity 600ms ease 300ms',
          transform: barAnim.inView ? 'scaleX(1)' : 'scaleX(0)',
          opacity:   barAnim.inView ? 1 : 0,
          transformOrigin: 'left',
        }}
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '6px',
          background: `linear-gradient(90deg, ${accentColor}, #39fcfcff, ${accentColor})`,
          boxShadow: `0 0 20px ${accentColor}`,
          zIndex: 4,
          animation: barAnim.inView
            ? `barShimmer 3s linear infinite`
            : 'none',
          '@keyframes barShimmer': {
            '0%':   { backgroundPosition: '0% 50%'   },
            '100%': { backgroundPosition: '200% 50%' },
          },
          backgroundSize: '200% auto',
        }}
      />
    </Box>
  );
};