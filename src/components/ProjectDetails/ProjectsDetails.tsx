"use client"
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  Grid,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from '@mui/material';
import { projects } from '@/data/projects';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { db } from "@/utils/firebase";

// Import separated components
import { ProjectHeader } from './ProjectHeader';
import { ProjectImage } from './ProjectImage';
import { FeaturesSection } from './FeaturesSection';
import { ChallengesSection } from './ChallengesSection';
import { collection, getDocs } from 'firebase/firestore';

// TypeScript Interface
interface Project {
  id: string;
  title: string;
  description: string;
  detailedDescription?: string;
  technologies: string[];
  image: string;
  link: string;
  github?: string;
  demoUrl?: string;
  features?: string[];
  challenges?: string[];
  solutions?: string[];
}

// Fallback projects
const FALLBACK_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Project 1',
    description: 'A great project description goes here',
    technologies: ['React', 'TypeScript'],
    image: '/images/project1.png',
    link: '#',
  },
];

const FloatingParticles = dynamic(
  () => import('./FloatingParticles'),
  { ssr: false }
);

// ─── Scroll Animation Hook ──────────────────────────────────────────────────
type AnimationVariant =
  | 'fadeUp'
  | 'fadeDown'
  | 'fadeLeft'
  | 'fadeRight'
  | 'fadeIn'
  | 'scaleIn'
  | 'slideReveal';

interface UseScrollAnimationOptions {
  threshold?: number;
  delay?: number;       // ms
  duration?: number;    // ms
  once?: boolean;
}

function useScrollAnimation(
  variant: AnimationVariant = 'fadeUp',
  options: UseScrollAnimationOptions = {}
) {
  const { threshold = 0.15, delay = 0, duration = 700, once = false } = options;
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  // Map variant → hidden / visible CSS
  const getStyles = (): { hidden: React.CSSProperties; visible: React.CSSProperties } => {
    const base: React.CSSProperties = {
      transition: `opacity ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
    };

    const map: Record<AnimationVariant, { hidden: React.CSSProperties; visible: React.CSSProperties }> = {
      fadeUp: {
        hidden: { ...base, opacity: 0, transform: 'translateY(48px)' },
        visible: { ...base, opacity: 1, transform: 'translateY(0px)' },
      },
      fadeDown: {
        hidden: { ...base, opacity: 0, transform: 'translateY(-48px)' },
        visible: { ...base, opacity: 1, transform: 'translateY(0px)' },
      },
      fadeLeft: {
        hidden: { ...base, opacity: 0, transform: 'translateX(-56px)' },
        visible: { ...base, opacity: 1, transform: 'translateX(0px)' },
      },
      fadeRight: {
        hidden: { ...base, opacity: 0, transform: 'translateX(56px)' },
        visible: { ...base, opacity: 1, transform: 'translateX(0px)' },
      },
      fadeIn: {
        hidden: { ...base, opacity: 0 },
        visible: { ...base, opacity: 1 },
      },
      scaleIn: {
        hidden: { ...base, opacity: 0, transform: 'scale(0.85)' },
        visible: { ...base, opacity: 1, transform: 'scale(1)' },
      },
      slideReveal: {
        hidden: { ...base, opacity: 0, transform: 'translateY(32px) scaleX(0.96)' },
        visible: { ...base, opacity: 1, transform: 'translateY(0px) scaleX(1)' },
      },
    };

    return map[variant];
  };

  const styles = getStyles();

  return {
    ref,
    style: isVisible ? styles.visible : styles.hidden,
  };
}

// ─── Animated Wrapper Component ─────────────────────────────────────────────
interface AnimatedBoxProps {
  variant?: AnimationVariant;
  delay?: number;
  duration?: number;
  threshold?: number;
  children: React.ReactNode;
  sx?: object;
}

const AnimatedBox: React.FC<AnimatedBoxProps> = ({
  variant = 'fadeUp',
  delay = 0,
  duration = 700,
  threshold = 0.12,
  children,
  sx = {},
}) => {
  const { ref, style } = useScrollAnimation(variant, { delay, duration, threshold });

  return (
    <Box ref={ref} style={style} sx={sx}>
      {children}
    </Box>
  );
};

// ─── Divider with scale-in reveal ───────────────────────────────────────────
const AnimatedDivider: React.FC<{ accentColor: string }> = ({ accentColor }) => {
  const { ref, style } = useScrollAnimation('scaleIn', { duration: 900, threshold: 0.5 });

  return (
    <Box
      ref={ref}
      style={style}
      sx={{
        height: '2px',
        background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
        margin: '40px 0',
        transformOrigin: 'center',
      }}
    />
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────
const ProjectDetails: React.FC = () => {
  const params = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [fetchedProjects, setFetchedProjects] = useState<Project[]>([]);

  const projectId = params?.id as string;
  const project = projects.find(p => p.id === projectId) || fetchedProjects.find(p => p.id === projectId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchProjects = useCallback(async () => {
    try {
      const snapshot = await getDocs(collection(db, "projects"));

      if (snapshot.empty) {
        setFetchedProjects(FALLBACK_PROJECTS);
      } else {
        const fetchedProjectsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title || '',
          description: doc.data().description || '',
          detailedDescription: doc.data().detailedDescription || '',
          technologies: doc.data().technologies || [],
          image: doc.data().image || '',
          link: doc.data().link || '#',
          github: doc.data().github || '',
          demoUrl: doc.data().demoUrl || '',
          features: doc.data().features || [],
          challenges: doc.data().challenges || [],
          solutions: doc.data().solutions || [],
        }));
        setFetchedProjects(fetchedProjectsData);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
      setFetchedProjects(FALLBACK_PROJECTS);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  if (!project) {
    return (
      <Box sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 3,
        backgroundColor: 'transparent'
      }}>
        <CircularProgress
          size={60}
          thickness={4}
          sx={{ color: theme.palette.primary.main }}
        />
        <Typography variant="h4" sx={{
          color: theme.palette.text.primary,
          fontWeight: 500
        }}>
          Loading project...
        </Typography>
      </Box>
    );
  }

  const getAccentColor = () => {
    const colors = [
      '#FFCDD2', '#FFCC80', '#FFF59D', '#A5D6A7',
      '#90CAF9', '#CE93D8', '#80DEEA', '#BCAAA4',
    ];
    const hash = project.id.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
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

      <Box
        sx={{
          py: { xs: 4, sm: 6, md: 8 },
          minHeight: '100vh',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={isMobile ? 3 : 5}>

            {/* ── Project Image — slides in from the LEFT ── */}
            <Grid size={{ xs: 12, md: 6 }}>
              <AnimatedBox variant="fadeUp" duration={800} delay={100}>
                <ProjectImage
                  image={project.image}
                  title={project.title}
                  accentColor={accentColor}
                  isInView={true}
                />
              </AnimatedBox>
            </Grid>

            {/* ── Project Header — slides in from the RIGHT ── */}
            <Grid size={{ xs: 12, md: 6 }}>
              <AnimatedBox variant="fadeDown" duration={800} delay={200}>
                <ProjectHeader
                  title={project.title}
                  technologies={project.technologies}
                  description={project.detailedDescription || project.description}
                  github={project.github}
                  demoUrl={project.demoUrl}
                  accentColor={accentColor}
                  isInView={true}
                />
              </AnimatedBox>
            </Grid>

            {/* ── Divider — scales in from center ── */}
            <Grid size={{ xs: 12 }}>
              <AnimatedDivider accentColor={accentColor} />
            </Grid>

            {/* ── Features — fades up ── */}
            {project.features && project.features.length > 0 && (
              <Grid size={{ xs: 12 }}>
                <AnimatedBox variant="fadeUp" duration={750} delay={0} threshold={0.08}>
                  <FeaturesSection
                    features={project.features}
                    accentColor={accentColor}
                  />
                </AnimatedBox>
              </Grid>
            )}

            {/* ── Challenges — slide-reveal from below ── */}
            {project.challenges && project.challenges.length > 0 && (
              <Grid size={{ xs: 12 }}>
                <AnimatedBox variant="slideReveal" duration={800} delay={100} threshold={0.08}>
                  <ChallengesSection
                    challenges={project.challenges}
                    solutions={project.solutions || []}
                    accentColor={accentColor}
                  />
                </AnimatedBox>
              </Grid>
            )}

          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default ProjectDetails;