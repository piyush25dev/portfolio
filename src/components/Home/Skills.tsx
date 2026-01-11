'use client';
import React, { useRef, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';

const skills = [
  { name: 'React', image: '/images/reactjs.svg' },
  { name: 'Next.js', image: 'images/next.png' },
  { name: 'JavaScript', image: '/images/javascript.svg' },
  { name: 'TypeScript', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/1200px-Typescript_logo_2020.svg.png' },
  { name: 'HTML', image: '/images/html.svg' },
  { name: 'CSS', image: '/images/css.svg' },
  { name: 'Material UI', image: '/images/MUI.svg' },
  { name: 'Framer Motion', image: '/images/framer.png' },
  { name: 'Tailwind CSS', image: '/images/tailwind.svg' },
  { name: 'GSAP', image: 'https://dzakifadh.dev/img/gsap.png' },
  { name: 'Redux', image: '/images/redux.svg' },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    scale: 0.5,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
};

const Skills: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery('(max-width:768px)');
  const theme = useTheme();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <Box
      ref={sectionRef}
      id="skills"
      sx={{
        py: { xs: 2, md: 10 },
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            <Typography variant="h2" component="h2" align="center" sx={{
              mb: 6,
              fontWeight: 700,
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              position: 'relative',
              display: 'inline-block',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -8,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '60%',
                height: 4,
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                borderRadius: 2,
              },
            }}>
              My Skills
            </Typography>
          </motion.div>
        </Box>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-50px" }}
        >
          <Grid container spacing={4} sx={{ justifyContent: 'center' }}>
            {skills.map((skill, index) => (
              <Grid size={{ xs: 6, sm: 4, md: 3 }} key={skill.name}>
                <motion.div
                  variants={itemVariants}
                  whileHover={{
                    scale: 1.05,
                    transition: {
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    },
                  }}
                  custom={index}
                  onHoverStart={() => setHoveredIndex(index)}
                  onHoverEnd={() => setHoveredIndex(null)}
                >
                  <Box
                    sx={{
                      p: isMobile ? 1 : 2,
                      borderRadius: 4,
                      backgroundColor: 'rgba(255, 255, 255, 0.75)',
                      boxShadow: 1,
                      textAlign: 'center',
                      transition: 'all 0.3s ease',
                      backdropFilter: 'blur(0)',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'rgba(252, 251, 252, 0.3)',
                        backdropFilter: 'blur(8px)',
                        color: "#fff",
                        fontWeight: '700',
                        boxShadow: "0 4px 20px rgba(255, 255, 255, 0.2)",
                      },
                    }}
                  >
                    <Typography
                      variant={isMobile ? "body1" : "h5"}
                      gutterBottom
                      sx={{ fontWeight: 600 }}
                    >
                      {skill.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                      <motion.div
                        animate={{
                          scale: hoveredIndex === index ? 1.15 : 1,
                        }}
                        transition={{
                          delay: hoveredIndex === index ? 0.05 : 0,
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        }}
                      >
                        <Box
                          className="skill-icon"
                          component="img"
                          src={skill.image}
                          alt={skill.name}
                          sx={{
                            width: isMobile ? 60 : 80,
                            height: isMobile ? 60 : 80,
                            objectFit: 'contain',
                            transition: 'all 0.2s ease',
                          }}
                        />
                      </motion.div>
                    </Box>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Skills;