import React from 'react';
import { Box, Container, Typography, Avatar, Grid, useTheme, Button } from '@mui/material';
import { motion } from 'framer-motion';
import Experience from './Experience';

const About: React.FC = () => {
  const theme = useTheme();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 1,
        ease: "easeOut"
      }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const avatarVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.05,
      rotateY: 10,
      rotateX: 5,
      boxShadow: "0 20px 40px rgba(98, 0, 234, 0.5)",
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateY = ((x - centerX) / centerX) * 10;
    const rotateX = ((y - centerY) / centerY) * -10;

    element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  };

  return (
    <Box
      id="about"
      sx={{
        py: 12,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `radial-gradient(circle at 20% 50%, 
            ${theme.palette.secondary.main}33 0%, 
            transparent 40%)`,
          pointerEvents: 'none',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '100%',
          height: '100%',
          background: `radial-gradient(circle at 80% 70%, 
            ${theme.palette.primary.main}33 0%, 
            transparent 40%)`,
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <motion.div
            variants={titleVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
          >
            <Typography
              variant="h2"
              component="h2"
              sx={{
                mb: 2,
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
              }}
            >
              About Me
            </Typography>
          </motion.div>
          
          <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                color: "#fff",
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              Get to know the person behind the code
            </Typography>
          </motion.div>
        </Box>

        <Grid container spacing={6} alignItems="center">
          <Grid size={{ xs: 12, md: 5 }}>
            <motion.div
              variants={imageVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              <motion.div
                variants={avatarVariants}
                initial="hidden"
                whileInView="visible"
                whileHover="hover"
                viewport={{ once: false, amount: 0.3 }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                  width: 280,
                  height: 280,
                  borderRadius: '50%',
                  position: 'relative',
                  transformStyle: 'preserve-3d',
                  boxShadow: '0 10px 30px rgba(98, 0, 234, 0.3)',
                  cursor: 'pointer',
                  transition: 'transform 0.1s ease-out, box-shadow 0.3s ease-out',
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      inset: -10,
                      borderRadius: '50%',
                      background: `linear-gradient(45deg, 
                        ${theme.palette.primary.main}, 
                        ${theme.palette.secondary.main})`,
                      zIndex: -1,
                      opacity: 0.7,
                      filter: 'blur(20px)',
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      inset: -5,
                      borderRadius: '50%',
                      border: `2px solid ${theme.palette.primary.main}`,
                      zIndex: -1,
                      opacity: 0.5,
                    },
                  }}
                >
                  <Avatar
                    src="/images/Photo.jpeg"
                    alt="Profile Image"
                    sx={{
                      width: '100%',
                      height: '100%',
                      border: `3px solid ${theme.palette.background.paper}`,
                    }}
                  />
                </Box>
              </motion.div>
            </motion.div>
          </Grid>

          <Grid size={{ xs: 12, md: 7 }}>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
            >
              <motion.div variants={textVariants}>
                <Typography
                  variant="h4"
                  component="h3"
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    mb: 3,
                    color: "#fff",
                    position: 'relative',
                    display: 'inline-block',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -8,
                      left: 0,
                      width: 60,
                      height: 4,
                      background: `linear-gradient(90deg, ${theme.palette.primary.main}, transparent)`,
                      borderRadius: 2,
                    },
                  }}
                >
                  Who am I?
                </Typography>
              </motion.div>

              <motion.div variants={textVariants}>
                <Typography
                  paragraph
                  sx={{
                    mb: 3,
                    fontSize: '1.1rem',
                    lineHeight: 1.8,
                    color: "#fff",
                  }}
                >
                  I&apos;m a <strong style={{ color: "red" }}>frontend developer</strong> with hands-on experience in building responsive and user-friendly web applications. I specialize in working with <strong style={{ color: "red" }}>React, Next.js, and modern UI libraries</strong> to create clean and engaging digital experiences.
                </Typography>
              </motion.div>

              <motion.div variants={textVariants}>
                <Typography
                  paragraph
                  sx={{
                    mb: 3,
                    fontSize: '1.1rem',
                    lineHeight: 1.8,
                    color: "#fff",
                  }}
                >
                  My goal is to develop applications that are not only functional but also deliver an <strong style={{ color: "red" }}>intuitive and enjoyable user experience</strong>. I focus on writing clean, maintainable code and continuously improving my skills in performance optimization and scalability.
                </Typography>
              </motion.div>

              <motion.div variants={textVariants}>
                <Typography
                  paragraph
                  sx={{
                    mb: 4,
                    fontSize: '1.1rem',
                    lineHeight: 1.8,
                    color: "#fff",
                  }}
                >
                  Beyond coding, I enjoy exploring new technologies, learning best practices in frontend development, and working on projects that challenge my creativity and problem-solving skills.
                </Typography>
              </motion.div>

              <motion.div variants={textVariants}>
                <Button
                  variant="outlined"
                  size="large"
                  component="a"
                  href="/pdf/resume.pdf"
                  download="Piyush_Resume.pdf"
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    borderWidth: 2,
                    '&:hover': {
                      borderWidth: 2,
                      background: `linear-gradient(135deg, 
                        ${theme.palette.primary.main}, 
                        ${theme.palette.secondary.main})`,
                      color: theme.palette.common.white,
                      boxShadow: `0 5px 15px ${theme.palette.primary.main}40`,
                    },
                  }}
                >
                  Download Resume
                </Button>
              </motion.div>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
      <Experience/>
    </Box>
  );
};

export default About;