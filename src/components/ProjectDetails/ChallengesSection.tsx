import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Paper, useTheme, useMediaQuery, Grid } from '@mui/material';
import type { Theme } from '@mui/material/styles';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import LightbulbIcon from '@mui/icons-material/Lightbulb';

interface ChallengesSectionProps {
  challenges: string[];
  solutions: string[];
  accentColor: string;
}

// ── Reusable repeatable in-view hook ──────────────────────────────────────
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

export const ChallengesSection: React.FC<ChallengesSectionProps> = ({
  challenges,
  solutions,
  accentColor,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const titleAnim = useInView(0.3);
  const underlineAnim = useInView(0.3);

  return (
    <Box>
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
            Challenges & Solutions
          </Typography>
        </Box>

        {/* Underline — draws in from left */}
        <Box
          ref={underlineAnim.ref}
          style={{
            transition: 'width 800ms cubic-bezier(0.22,1,0.36,1) 250ms, opacity 600ms ease 250ms',
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

      {/* ── Challenge Cards ── */}
      <Grid container spacing={isMobile ? 3 : 4}>
        {challenges.map((challenge, index) => (
          <ChallengeCard
            key={index}
            index={index}
            challenge={challenge}
            solution={solutions[index]}
            accentColor={accentColor}
            theme={theme}
            isMobile={isMobile}
          />
        ))}
      </Grid>
    </Box>
  );
};

// ── Individual Challenge Card ─────────────────────────────────────────────
interface ChallengeCardProps {
  challenge: string;
  solution: string;
  index: number;
  accentColor: string;
  theme: Theme;
  isMobile: boolean;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  solution,
  index,
  accentColor,
  theme,
  isMobile,
}) => {
  // Card entrance
  const cardAnim = useInView(0.08);
  // Challenge block — fades in slightly after card
  const challengeAnim = useInView(0.08);
  // Solution block — fades in after challenge
  const solutionAnim = useInView(0.08);

  const staggerDelay = Math.min(index * 120, 360);

  return (
    <Grid size={{ xs: 12 }}>
      {/* Card pop-up with spring overshoot */}
      <Box
        ref={cardAnim.ref}
        style={{
          transition: [
            `opacity 650ms cubic-bezier(0.22,1,0.36,1) ${staggerDelay}ms`,
            `transform 700ms cubic-bezier(0.34,1.45,0.64,1) ${staggerDelay}ms`,
          ].join(', '),
          opacity: cardAnim.inView ? 1 : 0,
          transform: cardAnim.inView ? 'translateY(0px) scale(1)' : 'translateY(70px) scale(0.92)',
        }}
      >
        <Paper
          sx={{
            p: { xs: 3, sm: 4, md: 5 },
            borderRadius: 3,
            background: theme.palette.mode === 'dark'
              ? `linear-gradient(135deg, rgba(40,40,40,0.7), rgba(60,60,60,0.5))`
              : `linear-gradient(135deg, rgba(5,144,250,0.5), rgba(9,240,248,0.4))`,
            backdropFilter: 'blur(20px)',
            border: `1px solid ${accentColor}40`,
            boxShadow: theme.palette.mode === 'dark'
              ? `0 15px 40px rgba(71,242,248,0.25)`
              : `0 15px 40px rgba(9,240,248,0.35)`,
            position: 'relative',
            overflow: 'hidden',
            transition: 'box-shadow 0.35s ease, transform 0.35s cubic-bezier(0.22,1,0.36,1)',
            '&:hover': {
              boxShadow: `0 28px 60px ${accentColor}40`,
              transform: 'translateY(-5px)',
              '& .bottom-bar': {
                opacity: 1,
                transform: 'scaleX(1)',
              },
            },
          }}
        >
          {/* Background radial */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '300px',
              height: '300px',
              background: `radial-gradient(circle, ${accentColor}10, transparent 70%)`,
              opacity: 0.5,
              pointerEvents: 'none',
            }}
          />

          {/* ── Challenge Block ── */}
          <Box
            ref={challengeAnim.ref}
            style={{
              transition: [
                `opacity 550ms cubic-bezier(0.22,1,0.36,1) ${staggerDelay + 150}ms`,
                `transform 600ms cubic-bezier(0.22,1,0.36,1) ${staggerDelay + 150}ms`,
              ].join(', '),
              opacity: challengeAnim.inView ? 1 : 0,
              transform: challengeAnim.inView ? 'translateX(0px)' : 'translateX(-40px)',
            }}
            sx={{ mb: 4, position: 'relative', zIndex: 1 }}
          >
            {/* Challenge header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <WarningAmberIcon
                sx={{
                  color: accentColor,
                  fontSize: { xs: '1.75rem', sm: '2rem' },
                  filter: `drop-shadow(0 0 10px ${accentColor})`,
                  animation: challengeAnim.inView ? 'iconBounce 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards' : 'none',
                  '@keyframes iconBounce': {
                    '0%': { transform: 'scale(0.5) rotate(-15deg)', opacity: 0 },
                    '100%': { transform: 'scale(1) rotate(0deg)', opacity: 1 },
                  },
                }}
              />
              <Typography
                variant={isMobile ? 'h6' : 'h5'}
                sx={{ fontWeight: 600, color: accentColor, fontSize: { xs: '1.1rem', sm: '1.35rem' } }}
              >
                Challenge
              </Typography>
              <Box
                sx={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: accentColor,
                  boxShadow: `0 0 10px ${accentColor}`,
                  animation: 'pulse 2s ease-in-out infinite',
                  '@keyframes pulse': {
                    '0%, 100%': { transform: 'scale(1)', opacity: 1 },
                    '50%': { transform: 'scale(1.6)', opacity: 0.5 },
                  },
                }}
              />
            </Box>

            {/* Challenge content */}
            <Box
              sx={{
                pl: { xs: 2, sm: 3 },
                borderLeft: `3px solid ${accentColor}60`,
                ml: 1,
                position: 'relative',
              }}
            >
              {[0, 1, 2].map((i) => (
                <Box
                  key={i}
                  sx={{
                    position: 'absolute',
                    left: '-6px',
                    top: `${i * 33}%`,
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: accentColor,
                    boxShadow: `0 0 8px ${accentColor}`,
                    animation: `dotFadeIn 0.4s ease ${staggerDelay + 300 + i * 80}ms both`,
                    '@keyframes dotFadeIn': {
                      from: { opacity: 0, transform: 'scale(0)' },
                      to: { opacity: 1, transform: 'scale(1)' },
                    },
                  }}
                />
              ))}
              <Typography
                variant="body1"
                sx={{ color: '#fff', lineHeight: 1.8, fontSize: { xs: '0.95rem', sm: '1.05rem' } }}
              >
                {challenge}
              </Typography>
            </Box>
          </Box>

          {/* ── Solution Block ── */}
          <Box
            ref={solutionAnim.ref}
            style={{
              transition: [
                `opacity 550ms cubic-bezier(0.22,1,0.36,1) ${staggerDelay + 300}ms`,
                `transform 600ms cubic-bezier(0.22,1,0.36,1) ${staggerDelay + 300}ms`,
              ].join(', '),
              opacity: solutionAnim.inView ? 1 : 0,
              transform: solutionAnim.inView ? 'translateX(0px)' : 'translateX(40px)',
            }}
            sx={{ position: 'relative', zIndex: 1 }}
          >
            {/* Solution header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <LightbulbIcon
                sx={{
                  color: '#39fcfcff',
                  fontSize: { xs: '1.75rem', sm: '2rem' },
                  filter: 'drop-shadow(0 0 10px #39fcfcff)',
                  animation: solutionAnim.inView
                    ? `glowPulse 2s ease-in-out ${staggerDelay + 400}ms infinite`
                    : 'none',
                  '@keyframes glowPulse': {
                    '0%, 100%': { filter: 'drop-shadow(0 0 6px #39fcfcff)' },
                    '50%': { filter: 'drop-shadow(0 0 18px #39fcfcff)' },
                  },
                }}
              />
              <Typography
                variant={isMobile ? 'h6' : 'h5'}
                sx={{ fontWeight: 600, color: '#39fcfcff', fontSize: { xs: '1.1rem', sm: '1.35rem' } }}
              >
                Solution
              </Typography>
              {/* Animated checkmark draw */}
              <Box
                component="svg"
                width="26px"
                height="26px"
                viewBox="0 0 20 20"
                fill="none"
                sx={{ display: 'inline-block', verticalAlign: 'middle' }}
              >
                <Box
                  component="path"
                  d="M4 10l4 4L16 6"
                  stroke="#39fcfcff"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  sx={{
                    strokeDasharray: 24,
                    strokeDashoffset: solutionAnim.inView ? 0 : 24,
                    transition: `stroke-dashoffset 600ms cubic-bezier(0.22,1,0.36,1) ${staggerDelay + 400}ms`,
                    filter: 'drop-shadow(0 0 6px #39fcfcff)',
                  }}
                />
              </Box>
            </Box>

            {/* Solution content */}
            <Box
              sx={{
                pl: { xs: 2, sm: 3 },
                borderLeft: '3px solid #39fcfcff80',
                ml: 1,
                position: 'relative',
              }}
            >
              {[0, 1, 2].map((i) => (
                <Box
                  key={i}
                  sx={{
                    position: 'absolute',
                    left: '-6px',
                    top: `${i * 33}%`,
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#39fcfcff',
                    boxShadow: '0 0 8px #39fcfcff',
                    animation: `dotFadeIn 0.4s ease ${staggerDelay + 450 + i * 80}ms both`,
                  }}
                />
              ))}
              <Typography
                variant="body1"
                sx={{ color: '#fff', lineHeight: 1.8, fontSize: { xs: '0.95rem', sm: '1.05rem' } }}
              >
                {solution}
              </Typography>
            </Box>
          </Box>

          {/* Bottom accent bar — expands on hover */}
          <Box
            className="bottom-bar"
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: `linear-gradient(90deg, ${accentColor}, #39fcfcff)`,
              boxShadow: `0 0 15px ${accentColor}`,
              opacity: 0.6,
              transform: 'scaleX(0.6)',
              transformOrigin: 'left',
              transition: 'opacity 0.4s ease, transform 0.5s cubic-bezier(0.22,1,0.36,1)',
            }}
          />
        </Paper>
      </Box>
    </Grid>
  );
};