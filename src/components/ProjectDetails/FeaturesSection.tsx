import React from 'react';
import { Box, Typography, Paper, useTheme, useMediaQuery, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionPaper = motion(Paper);

interface FeaturesSectionProps {
  features: string[];
  accentColor: string;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  features,
  accentColor,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <MotionBox sx={{ mb: { xs: 6, sm: 8, md: 10 } }}>
      {/* Section title with animated underline */}
      <MotionBox
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.7, ease: [0.6, 0.05, 0.01, 0.9] }}
        sx={{ mb: 5, position: 'relative' }}
      >
        <MotionTypography
          variant={isMobile ? "h4" : "h3"}
          sx={{
            fontWeight: 700,
            color: '#fff',
            fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
            mb: 2,
            display: 'inline-block',
          }}
        >
          Key Features
        </MotionTypography>

        {/* Animated underline */}
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: '120px' }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            height: '5px',
            background: `linear-gradient(90deg, ${accentColor}, #39fcfcff)`,
            borderRadius: '3px',
            boxShadow: `0 0 15px ${accentColor}`,
          }}
        />
      </MotionBox>

      {/* Features grid */}
      <Grid container spacing={isMobile ? 2 : 3}>
        {features.map((feature, index) => (
          <Grid key={index} size={{xs: 12, sm: 6, md: 4}}>
            <MotionPaper
              initial={{ opacity: 0, y: 50, rotateX: -15 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{
                delay: index * 0.1,
                duration: 0.6,
                ease: [0.6, 0.05, 0.01, 0.9]
              }}
              whileHover={{
                y: -8,
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
              sx={{
                p: { xs: 2.5, sm: 3 },
                height: '100%',
                borderRadius: 3,
                background: theme.palette.mode === 'dark'
                  ? `linear-gradient(135deg, rgba(40, 40, 40, 0.6), rgba(60, 60, 60, 0.4))`
                  : `linear-gradient(135deg, rgba(5, 144, 250, 0.4), rgba(9, 240, 248, 0.3))`,
                backdropFilter: 'blur(20px)',
                border: `1px solid ${accentColor}30`,
                borderLeft: `4px solid ${accentColor}`,
                boxShadow: theme.palette.mode === 'dark'
                  ? `0 10px 30px rgba(71, 242, 248, 0.2)`
                  : `0 10px 30px rgba(9, 240, 248, 0.3)`,
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                '&:hover': {
                  borderColor: accentColor,
                  boxShadow: `0 15px 40px ${accentColor}40`,
                  '& .feature-icon': {
                    transform: 'scale(1.2) rotate(360deg)',
                  },
                  '& .feature-glow': {
                    opacity: 1,
                  }
                },
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {/* Background glow effect */}
              <Box
                className="feature-glow"
                sx={{
                  position: 'absolute',
                  top: '-50%',
                  right: '-50%',
                  width: '100%',
                  height: '100%',
                  background: `radial-gradient(circle, ${accentColor}20, transparent)`,
                  opacity: 0,
                  transition: 'opacity 0.4s ease',
                }}
              />

              {/* Icon with rotation animation */}
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
                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
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

              {/* Animated corner decoration */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: false }}
                transition={{ delay: 0.3 + index * 0.05, duration: 0.4 }}
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  right: '10px',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: accentColor,
                  boxShadow: `0 0 10px ${accentColor}`,
                }}
              />
            </MotionPaper>
          </Grid>
        ))}
      </Grid>

      {/* Decorative animated line */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: false, amount: 0.8 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        style={{
          marginTop: '40px',
          height: '2px',
          background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
          transformOrigin: 'center',
        }}
      />
    </MotionBox>
  );
};