import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Paper, useTheme, useMediaQuery, Grid } from '@mui/material';
import type { Theme } from '@mui/material/styles';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

interface FeaturesSectionProps {
  features: string[];
  accentColor: string;
}

// ── Reusable scroll-triggered animation hook (repeatable) ──────────────────
function useInView(threshold = 0.15) {
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

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  features,
  accentColor,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Title animation
  const titleAnim = useInView(0.3);
  // Underline animation
  const underlineAnim = useInView(0.3);
  // Bottom decorative line
  const lineAnim = useInView(0.5);

  return (
    <Box sx={{ mb: { xs: 6, sm: 8, md: 10 } }}>

      {/* ── Section Title ── */}
      <Box sx={{ mb: 5, position: 'relative' }}>
        <Box
          ref={titleAnim.ref}
          style={{
            transition: 'opacity 700ms cubic-bezier(0.22,1,0.36,1), transform 700ms cubic-bezier(0.22,1,0.36,1)',
            opacity: titleAnim.inView ? 1 : 0,
            transform: titleAnim.inView ? 'translateY(0px)' : 'translateY(-32px)',
          }}
        >
          <Typography
            variant={isMobile ? 'h4' : 'h3'}
            sx={{
              fontWeight: 700,
              color: '#fff',
              fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
              mb: 2,
              display: 'inline-block',
            }}
          >
            Key Features
          </Typography>
        </Box>

        {/* Underline — expands from left */}
        <Box
          ref={underlineAnim.ref}
          style={{
            transition: 'width 800ms cubic-bezier(0.22,1,0.36,1) 200ms, opacity 600ms ease 200ms',
            width: underlineAnim.inView ? '120px' : '0px',
            opacity: underlineAnim.inView ? 1 : 0,
          }}
          sx={{
            height: '5px',
            background: `linear-gradient(90deg, ${accentColor}, #39fcfcff)`,
            borderRadius: '3px',
            boxShadow: `0 0 15px ${accentColor}`,
          }}
        />
      </Box>

      {/* ── Feature Cards Grid ── */}
      <Grid container spacing={isMobile ? 2 : 3}>
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            feature={feature}
            index={index}
            accentColor={accentColor}
            theme={theme}
          />
        ))}
      </Grid>

      {/* ── Bottom decorative line — scales from center ── */}
      <Box
        ref={lineAnim.ref}
        style={{
          transition: 'transform 900ms cubic-bezier(0.22,1,0.36,1) 100ms, opacity 700ms ease 100ms',
          transform: lineAnim.inView ? 'scaleX(1)' : 'scaleX(0)',
          opacity: lineAnim.inView ? 1 : 0,
          transformOrigin: 'center',
        }}
        sx={{
          mt: 5,
          height: '2px',
          background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
        }}
      />
    </Box>
  );
};

// ── Individual Feature Card with staggered pop-up ─────────────────────────
interface FeatureCardProps {
  feature: string;
  index: number;
  accentColor: string;
  theme: Theme;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ feature, index, accentColor, theme }) => {
  const { ref, inView } = useInView(0.1);

  // Stagger: each card delays by 80ms per index (capped at 400ms)
  const staggerDelay = Math.min(index * 80, 400);

  return (
    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
      <Box
        ref={ref}
        style={{
          transition: [
            `opacity 600ms cubic-bezier(0.22,1,0.36,1) ${staggerDelay}ms`,
            `transform 650ms cubic-bezier(0.34,1.56,0.64,1) ${staggerDelay}ms`,  // spring overshoot
          ].join(', '),
          opacity: inView ? 1 : 0,
          // pop up + tiny scale bounce
          transform: inView ? 'translateY(0px) scale(1)' : 'translateY(60px) scale(0.88)',
        }}
        sx={{ height: '100%' }}
      >
        <Paper
          sx={{
            p: { xs: 2.5, sm: 3 },
            height: '100%',
            borderRadius: 3,
            background: theme.palette.mode === 'dark'
              ? `linear-gradient(135deg, rgba(40,40,40,0.6), rgba(60,60,60,0.4))`
              : `linear-gradient(135deg, rgba(5,144,250,0.4), rgba(9,240,248,0.3))`,
            backdropFilter: 'blur(20px)',
            border: `1px solid ${accentColor}30`,
            borderLeft: `4px solid ${accentColor}`,
            boxShadow: theme.palette.mode === 'dark'
              ? `0 10px 30px rgba(71,242,248,0.2)`
              : `0 10px 30px rgba(9,240,248,0.3)`,
            position: 'relative',
            overflow: 'hidden',
            cursor: 'default',
            '&:hover': {
              borderColor: accentColor,
              boxShadow: `0 20px 50px ${accentColor}50`,
              transform: 'translateY(-6px) scale(1.02)',
              '& .feature-icon': {
                transform: 'rotate(360deg) scale(1.15)',
              },
              '& .feature-glow': {
                opacity: 0.8,
              },
              '& .feature-dot': {
                transform: 'scale(2)',
                opacity: 0.6,
              },
            },
            transition: 'all 0.35s cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          {/* Background glow */}
          <Box
            className="feature-glow"
            sx={{
              position: 'absolute',
              top: '-50%',
              right: '-50%',
              width: '100%',
              height: '100%',
              background: `radial-gradient(circle, ${accentColor}25, transparent)`,
              opacity: 0,
              transition: 'opacity 0.35s ease',
              pointerEvents: 'none',
            }}
          />

          {/* Card number badge */}
          <Box
            sx={{
              position: 'absolute',
              top: 10,
              right: 14,
              fontSize: '0.65rem',
              fontWeight: 700,
              color: `${accentColor}80`,
              letterSpacing: '0.08em',
              fontFamily: 'monospace',
            }}
          >
            {String(index + 1).padStart(2, '0')}
          </Box>

          {/* Icon + text */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1.5,
              position: 'relative',
              zIndex: 1,
            }}
          >
            <CheckCircleOutlineIcon
              className="feature-icon"
              sx={{
                color: accentColor,
                fontSize: { xs: '1.5rem', sm: '1.75rem' },
                mt: 0.3,
                filter: `drop-shadow(0 0 8px ${accentColor})`,
                transition: 'transform 0.6s cubic-bezier(0.34,1.56,0.64,1)',
              }}
            />

            <Typography
              variant="body1"
              sx={{
                lineHeight: 1.7,
                color: '#fff',
                fontSize: { xs: '0.95rem', sm: '1rem' },
                fontWeight: 400,
              }}
            >
              {feature}
            </Typography>
          </Box>

          {/* Corner dot */}
          <Box
            className="feature-dot"
            sx={{
              position: 'absolute',
              bottom: '10px',
              right: '10px',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: accentColor,
              boxShadow: `0 0 10px ${accentColor}`,
              transition: 'transform 0.35s ease, opacity 0.35s ease',
            }}
          />
        </Paper>
      </Box>
    </Grid>
  );
};