import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Typography, Chip, useTheme, useMediaQuery } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GitHubIcon from '@mui/icons-material/GitHub';
import LaunchIcon from '@mui/icons-material/Launch';
import Link from 'next/link';

interface ProjectHeaderProps {
  title: string;
  technologies: string[];
  description?: string;
  github?: string;
  demoUrl?: string;
  accentColor: string;
  isInView: boolean;
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

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  title,
  technologies,
  description,
  github,
  demoUrl,
  accentColor,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Individual animation refs for each block
  const cardAnim      = useInView(0.08);
  const backAnim      = useInView(0.08);
  const titleAnim     = useInView(0.08);
  const chipsAnim     = useInView(0.08);
  const descAnim      = useInView(0.08);
  const buttonsAnim   = useInView(0.08);

  return (
    // ── Outer card — scales + fades in ──────────────────────────────────
    <Box
      ref={cardAnim.ref}
      style={{
        transition: 'opacity 700ms cubic-bezier(0.22,1,0.36,1), transform 750ms cubic-bezier(0.34,1.4,0.64,1)',
        opacity: cardAnim.inView ? 1 : 0,
        transform: cardAnim.inView ? 'scale(1) translateY(0px)' : 'scale(0.93) translateY(40px)',
      }}
      sx={{
        background: `linear-gradient(135deg, ${theme.palette.mode === 'dark'
          ? 'rgba(40,40,40,0.5)'
          : 'rgba(5,144,250,0.4)'} 0%, ${theme.palette.mode === 'dark'
          ? 'rgba(60,60,60,0.3)'
          : 'rgba(9,240,248,0.3)'} 100%)`,
        backdropFilter: 'blur(20px)',
        borderRadius: 3,
        p: { xs: 3, sm: 4, md: 5 },
        position: 'relative',
        overflow: 'visible',
        border: `1px solid ${accentColor}30`,
        boxShadow: theme.palette.mode === 'dark'
          ? '0 15px 40px rgba(71,242,248,0.2)'
          : '0 15px 40px rgba(9,240,248,0.3)',
        zIndex: 1,
        transition: 'box-shadow 0.35s ease, transform 0.35s cubic-bezier(0.22,1,0.36,1)',
        '&:hover': {
          boxShadow: `0 24px 60px ${accentColor}35`,
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >

        {/* ── Back button — slides in from left ── */}
        <Box
          ref={backAnim.ref}
          style={{
            transition: 'opacity 500ms cubic-bezier(0.22,1,0.36,1) 100ms, transform 550ms cubic-bezier(0.22,1,0.36,1) 100ms',
            opacity: backAnim.inView ? 1 : 0,
            transform: backAnim.inView ? 'translateX(0px)' : 'translateX(-36px)',
          }}
        >
          <Link href="/" passHref>
            <Button
              startIcon={<ArrowBackIcon />}
              variant="outlined"
              size={isMobile ? 'small' : 'medium'}
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
                transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
              }}
            >
              Back to Projects
            </Button>
          </Link>
        </Box>

        {/* ── Title — drops in from top with spring overshoot ── */}
        <Box
          ref={titleAnim.ref}
          style={{
            transition: 'opacity 650ms cubic-bezier(0.22,1,0.36,1) 180ms, transform 700ms cubic-bezier(0.34,1.5,0.64,1) 180ms',
            opacity: titleAnim.inView ? 1 : 0,
            transform: titleAnim.inView ? 'translateY(0px) skewY(0deg)' : 'translateY(-40px) skewY(2deg)',
          }}
        >
          <Typography
            variant={isMobile ? 'h4' : 'h3'}
            sx={{
              fontWeight: 800,
              background: `linear-gradient(135deg, ${accentColor}, #39fcfcff)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' },
              margin: 0,
            }}
          >
            {title}
          </Typography>
        </Box>

        {/* ── Tech chips — pop in with stagger ── */}
        <Box
          ref={chipsAnim.ref}
          sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}
        >
          {technologies.map((tech, index) => (
            <Box
              key={index}
              style={{
                transition: [
                  `opacity 450ms cubic-bezier(0.22,1,0.36,1) ${260 + index * 60}ms`,
                  `transform 500ms cubic-bezier(0.34,1.56,0.64,1) ${260 + index * 60}ms`,
                ].join(', '),
                opacity: chipsAnim.inView ? 1 : 0,
                transform: chipsAnim.inView ? 'translateY(0px) scale(1)' : 'translateY(20px) scale(0.75)',
              }}
            >
              <Chip
                label={tech}
                size={isMobile ? 'small' : 'medium'}
                sx={{
                  background: `linear-gradient(135deg, ${accentColor}30, ${accentColor}50)`,
                  color: '#fff',
                  fontWeight: 600,
                  borderRadius: '10px',
                  border: `1px solid ${accentColor}60`,
                  backdropFilter: 'blur(10px)',
                  boxShadow: `0 4px 15px ${accentColor}20`,
                  transition: 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s ease',
                  '&:hover': {
                    background: `linear-gradient(135deg, ${accentColor}50, ${accentColor}70)`,
                    transform: 'translateY(-3px) scale(1.06)',
                    boxShadow: `0 8px 20px ${accentColor}40`,
                  },
                }}
              />
            </Box>
          ))}
        </Box>

        {/* ── Description — fades up ── */}
        {description && (
          <Box
            ref={descAnim.ref}
            style={{
              transition: 'opacity 600ms cubic-bezier(0.22,1,0.36,1) 320ms, transform 650ms cubic-bezier(0.22,1,0.36,1) 320ms',
              opacity: descAnim.inView ? 1 : 0,
              transform: descAnim.inView ? 'translateY(0px)' : 'translateY(28px)',
            }}
          >
            <Typography
              variant="body1"
              sx={{
                color: '#fff',
                lineHeight: 1.8,
                fontSize: { xs: '1rem', sm: '1.1rem' },
                textShadow: '0 2px 10px rgba(0,0,0,0.3)',
              }}
            >
              {description}
            </Typography>
          </Box>
        )}

        {/* ── Action buttons — slide up + stagger ── */}
        <Box
          ref={buttonsAnim.ref}
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
          }}
        >
          {github && (
            <Box
              style={{
                transition: 'opacity 500ms cubic-bezier(0.22,1,0.36,1) 400ms, transform 550ms cubic-bezier(0.34,1.45,0.64,1) 400ms',
                opacity: buttonsAnim.inView ? 1 : 0,
                transform: buttonsAnim.inView ? 'translateY(0px) scale(1)' : 'translateY(30px) scale(0.9)',
              }}
            >
              <Button
                variant="contained"
                startIcon={<GitHubIcon />}
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                fullWidth={isMobile}
                size={isMobile ? 'medium' : 'large'}
                sx={{
                  background: `linear-gradient(135deg, ${accentColor}, ${accentColor}CC)`,
                  color: '#000',
                  fontWeight: 600,
                  borderRadius: '12px',
                  px: 4,
                  py: 1.5,
                  boxShadow: `0 6px 20px ${accentColor}40`,
                  transition: 'all 0.3s cubic-bezier(0.34,1.45,0.64,1)',
                  '&:hover': {
                    background: `linear-gradient(135deg, ${accentColor}DD, ${accentColor})`,
                    boxShadow: `0 12px 30px ${accentColor}60`,
                    transform: 'translateY(-3px) scale(1.04)',
                  },
                }}
              >
                View Code
              </Button>
            </Box>
          )}

          {demoUrl && (
            <Box
              style={{
                transition: 'opacity 500ms cubic-bezier(0.22,1,0.36,1) 480ms, transform 550ms cubic-bezier(0.34,1.45,0.64,1) 480ms',
                opacity: buttonsAnim.inView ? 1 : 0,
                transform: buttonsAnim.inView ? 'translateY(0px) scale(1)' : 'translateY(30px) scale(0.9)',
              }}
            >
              <Button
                variant="outlined"
                startIcon={<LaunchIcon />}
                href={demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                fullWidth={isMobile}
                size={isMobile ? 'medium' : 'large'}
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
                  transition: 'all 0.3s cubic-bezier(0.34,1.45,0.64,1)',
                  '&:hover': {
                    backgroundColor: `${accentColor}30`,
                    borderColor: accentColor,
                    borderWidth: 2,
                    transform: 'translateY(-3px) scale(1.04)',
                    boxShadow: `0 10px 28px ${accentColor}40`,
                  },
                }}
              >
                Live Demo
              </Button>
            </Box>
          )}
        </Box>

      </Box>
    </Box>
  );
};