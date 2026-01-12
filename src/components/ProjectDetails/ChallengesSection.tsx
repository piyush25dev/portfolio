import React from 'react';
import { Box, Typography, Paper, useTheme, useMediaQuery, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import LightbulbIcon from '@mui/icons-material/Lightbulb';

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionPaper = motion(Paper);

interface ChallengesSectionProps {
  challenges: string[];
  solutions: string[];
  accentColor: string;
}

export const ChallengesSection: React.FC<ChallengesSectionProps> = ({
  challenges,
  solutions,
  accentColor,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <MotionBox>
      {/* Section title */}
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
          Challenges & Solutions
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

      {/* Challenges grid */}
      <Grid container spacing={isMobile ? 3 : 4}>
        {challenges.map((challenge, index) => (
          <Grid key={index} size={{ xs: 12 }}>
            <MotionPaper
              initial={{ opacity: 0, x: -100, rotateY: -20 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{
                delay: index * 0.15,
                duration: 0.8,
                ease: [0.6, 0.05, 0.01, 0.9]
              }}
              whileHover={{
                scale: 1.01,
                boxShadow: `0 20px 50px ${accentColor}30`,
                transition: { duration: 0.3 }
              }}
              sx={{
                p: { xs: 3, sm: 4, md: 5 },
                borderRadius: 3,
                background: theme.palette.mode === 'dark'
                  ? `linear-gradient(135deg, rgba(40, 40, 40, 0.7), rgba(60, 60, 60, 0.5))`
                  : `linear-gradient(135deg, rgba(5, 144, 250, 0.5), rgba(9, 240, 248, 0.4))`,
                backdropFilter: 'blur(20px)',
                border: `1px solid ${accentColor}40`,
                boxShadow: theme.palette.mode === 'dark'
                  ? `0 15px 40px rgba(71, 242, 248, 0.25)`
                  : `0 15px 40px rgba(9, 240, 248, 0.35)`,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Background pattern */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '300px',
                  height: '300px',
                  background: `radial-gradient(circle, ${accentColor}10, transparent 70%)`,
                  opacity: 0.5,
                }}
              />

              {/* Challenge section */}
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                sx={{ mb: 4, position: 'relative', zIndex: 1 }}
              >
                {/* Challenge header */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    mb: 2,
                  }}
                >
                  <motion.div
                    animate={{
                      rotate: [0, -10, 10, -10, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3,
                    }}
                  >
                    <WarningAmberIcon
                      sx={{
                        color: accentColor,
                        fontSize: { xs: '1.75rem', sm: '2rem' },
                        filter: `drop-shadow(0 0 10px ${accentColor})`,
                      }}
                    />
                  </motion.div>

                  <Typography
                    variant={isMobile ? "h6" : "h5"}
                    sx={{
                      fontWeight: 600,
                      color: accentColor,
                      fontSize: { xs: '1.1rem', sm: '1.35rem' },
                    }}
                  >
                    Challenge
                  </Typography>

                  {/* Animated pulse dot */}
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: accentColor,
                      boxShadow: `0 0 10px ${accentColor}`,
                    }}
                  />
                </Box>

                {/* Challenge content */}
                <MotionBox
                  initial={{ height: 0, opacity: 0 }}
                  whileInView={{ height: "auto", opacity: 1 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  <Box
                    sx={{
                      pl: { xs: 2, sm: 3 },
                      borderLeft: `3px solid ${accentColor}60`,
                      ml: 1,
                      position: 'relative',
                    }}
                  >
                    {/* Animated dots along the border */}
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: false }}
                        transition={{ delay: 0.5 + i * 0.1, duration: 0.3 }}
                        style={{
                          position: 'absolute',
                          left: '-6px',
                          top: `${i * 33}%`,
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: accentColor,
                          boxShadow: `0 0 8px ${accentColor}`,
                        }}
                      />
                    ))}

                    <Typography
                      variant="body1"
                      sx={{
                        color: '#fff',
                        lineHeight: 1.8,
                        fontSize: { xs: '0.95rem', sm: '1.05rem' },
                      }}
                    >
                      {challenge}
                    </Typography>
                  </Box>
                </MotionBox>
              </MotionBox>

              {/* Solution section */}
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                sx={{ position: 'relative', zIndex: 1 }}
              >
                {/* Solution header */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    mb: 2,
                  }}
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3,
                    }}
                  >
                    <LightbulbIcon
                      sx={{
                        color: '#39fcfcff',
                        fontSize: { xs: '1.75rem', sm: '2rem' },
                        filter: 'drop-shadow(0 0 10px #39fcfcff)',
                      }}
                    />
                  </motion.div>

                  <Typography
                    variant={isMobile ? "h6" : "h5"}
                    sx={{
                      fontWeight: 600,
                      color: '#39fcfcff',
                      fontSize: { xs: '1.1rem', sm: '1.35rem' },
                    }}
                  >
                    Solution
                  </Typography>

                  {/* Animated checkmark */}
                  <motion.svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: false }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                  >
                    <motion.path
                      d="M5 13l4 4L19 7"
                      stroke="#39fcfcff"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        filter: 'drop-shadow(0 0 8px #39fcfcff)',
                      }}
                    />
                  </motion.svg>
                </Box>

                {/* Solution content */}
                <MotionBox
                  initial={{ height: 0, opacity: 0 }}
                  whileInView={{ height: "auto", opacity: 1 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  <Box
                    sx={{
                      pl: { xs: 2, sm: 3 },
                      borderLeft: '3px solid #39fcfcff80',
                      ml: 1,
                      position: 'relative',
                    }}
                  >
                    {/* Animated dots along the border */}
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: false }}
                        transition={{ delay: 0.7 + i * 0.1, duration: 0.3 }}
                        style={{
                          position: 'absolute',
                          left: '-6px',
                          top: `${i * 33}%`,
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: '#39fcfcff',
                          boxShadow: '0 0 8px #39fcfcff',
                        }}
                      />
                    ))}

                    <Typography
                      variant="body1"
                      sx={{
                        color: '#fff',
                        lineHeight: 1.8,
                        fontSize: { xs: '0.95rem', sm: '1.05rem' },
                      }}
                    >
                      {solutions[index]}
                    </Typography>
                  </Box>
                </MotionBox>
              </MotionBox>

              {/* Bottom accent line */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: false }}
                transition={{ delay: 0.8, duration: 0.8 }}
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: `linear-gradient(90deg, ${accentColor}, #39fcfcff)`,
                  transformOrigin: 'left',
                  boxShadow: `0 0 15px ${accentColor}`,
                }}
              />
            </MotionPaper>
          </Grid>
        ))}
      </Grid>
    </MotionBox>
  );
};