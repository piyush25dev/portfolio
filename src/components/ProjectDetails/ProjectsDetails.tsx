"use client"
import React, { useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  Grid,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { motion, useScroll, useSpring, useInView } from 'framer-motion';
import { projects } from '@/data/projects';
import Head from 'next/head';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import dynamic from 'next/dynamic';

// Import separated components
import { ProjectHeader } from './ProjectHeader';
import { ProjectImage } from './ProjectImage';
import { FeaturesSection } from './FeaturesSection';
import { ChallengesSection } from './ChallengesSection';


const FloatingParticles = dynamic(
  () => import('./FloatingParticles'),
  { ssr: false }
);

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const MotionBox = motion(Box);

const ProjectDetails: React.FC = () => {
  const params = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));


  // Refs for scroll animations
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  // Get the project
  const projectId = params?.id as string;
  const project = projects.find(p => p.id === projectId);

  // Scroll animations
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start", "end"]
  });

  const smoothScrollProgress = useSpring(scrollYProgress, {
    stiffness: isMobile ? 50 : 100,
    damping: isMobile ? 15 : 30,
    restDelta: 0.001
  });

  // Check if elements are in view
  const isHeaderInView = useInView(headerRef, { once: false, amount: 0.3 });
  const isImageInView = useInView(imageRef, { once: false, amount: 0.3 });

  // Setup smooth scrolling with Lenis
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let lenis: any = null;

    const initLenis = () => {
      if (window.Lenis) {
        lenis = new window.Lenis({
          duration: isMobile ? 0.8 : 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          direction: 'vertical',
          gestureDirection: 'vertical',
          smooth: true,
          mouseMultiplier: 1,
          smoothTouch: isMobile ? true : false,
          touchMultiplier: isMobile ? 1.5 : 2,
        });

        function raf(time: number) {
          lenis.raf(time);
          requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);
      }
    };

    if (typeof window.Lenis === 'function') {
      initLenis();
    } else {
      const checkLenisInterval = setInterval(() => {
        if (typeof window.Lenis === 'function') {
          initLenis();
          clearInterval(checkLenisInterval);
        }
      }, 100);

      setTimeout(() => clearInterval(checkLenisInterval), 5000);
    }

    return () => {
      if (lenis) {
        lenis.destroy();
      }
    };
  }, [isMobile]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Project not found
  if (!project) {
    return (
      <Box sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.palette.background.default
      }}>
        <Typography variant="h4">Project not found</Typography>
      </Box>
    );
  }

  // Generate accent color
  const getAccentColor = () => {
    const colors = [
      '#FFCDD2',
      '#FFCC80',
      '#FFF59D',
      '#A5D6A7',
      '#90CAF9',
      '#CE93D8',
      '#80DEEA',
      '#BCAAA4',
    ];
    const hash = project.id.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + acc;
    }, 0);
    return colors[hash % colors.length];
  };

  const accentColor = getAccentColor();

  return (
    <>
      <Head>
        <title>{project.title} | Portfolio</title>
        <meta name="description" content={project.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
      </Head>

      {/* Animated background gradient */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          background: theme.palette.mode === 'dark'
            ? `radial-gradient(circle at 20% 50%, ${accentColor}15, transparent 50%), 
               radial-gradient(circle at 80% 80%, #39fcfcff15, transparent 50%)`
            : `radial-gradient(circle at 20% 50%, ${accentColor}10, transparent 50%), 
               radial-gradient(circle at 80% 80%, #39fcfcff10, transparent 50%)`,
          opacity: 0.6,
        }}
      />

      {/* Floating particles background */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          overflow: 'hidden',
        }}
      >
        <FloatingParticles
          count={isMobile ? 10 : 20}
          colorA={accentColor}
          colorB="#39fcfcff"
        />


      </Box>

      <MotionBox
        ref={containerRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        sx={{
          py: { xs: 4, sm: 6, md: 8 },
          minHeight: '100vh',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={isMobile ? 3 : 5}>
            {/* Project Image */}
            <Grid size={{ xs: 12, md: 6 }} ref={imageRef}>
              <ProjectImage
                image={project.image}
                title={project.title}
                accentColor={accentColor}
                isInView={isImageInView}
                scrollProgress={smoothScrollProgress}
              />
            </Grid>

            {/* Project Header Info */}
            <Grid size={{ xs: 12, md: 6 }} ref={headerRef}>
              <ProjectHeader
                title={project.title}
                technologies={project.technologies}
                description={project.detailedDescription || project.description}
                github={project.github}
                demoUrl={project.demoUrl}
                accentColor={accentColor}
                isInView={isHeaderInView}
              />
            </Grid>

            {/* Divider */}
            <Grid size={{ xs: 12 }}>
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: false, amount: 0.8 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                style={{
                  height: '2px',
                  background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
                  transformOrigin: 'center',
                  margin: '40px 0',
                }}
              />
            </Grid>

            {/* Features Section */}
            {project.features && project.features.length > 0 && (
              <Grid size={{ xs: 12 }}>
                <FeaturesSection
                  features={project.features}
                  accentColor={accentColor}
                />
              </Grid>
            )}

            {/* Challenges Section */}
            {project.challenges && project.challenges.length > 0 && (
              <Grid size={{ xs: 12 }}>
                <ChallengesSection
                  challenges={project.challenges}
                  solutions={project.solutions || []}
                  accentColor={accentColor}
                />
              </Grid>
            )}
          </Grid>
        </Container>
      </MotionBox>
    </>
  );
};

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Lenis: any;
  }
}

export default ProjectDetails;