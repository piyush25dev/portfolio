import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Box, Container, Typography, Grid, Pagination, useTheme, Alert } from '@mui/material';
import ProjectCard from '../ui/ProjectCard';
import { db } from "@/utils/firebase";
import { collection, getDocs } from 'firebase/firestore';

// TypeScript Interface
interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  image: string;
  link: string;
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
  {
    id: '2',
    title: 'Project 2',
    description: 'Another excellent project',
    technologies: ['Next.js', 'Tailwind CSS'],
    image: '/images/project2.png',
    link: '#',
  },
];

const ACCENT_COLORS = ['#FF5252', '#FF9800', '#ffff11', '#FBC02D', '#CE93D8', '#ffffff'];
const getAccentColor = (index: number) => ACCENT_COLORS[index % ACCENT_COLORS.length];

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

// ── Animated Project Card Skeleton ───────────────────────────────────────────
const ProjectCardSkeleton: React.FC<{ index: number }> = ({ index }) => {
  const accent = getAccentColor(index);

  return (
    <Box
      style={{ animation: `skeletonFadeIn 0.5s ease ${index * 120}ms both` }}
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        border: `1px solid ${accent}20`,
        background: 'transparent',
        position: 'relative',
        '@keyframes skeletonFadeIn': {
          from: { opacity: 0, transform: 'translateY(28px) scale(0.97)' },
          to:   { opacity: 1, transform: 'translateY(0px) scale(1)'     },
        },
      }}
    >
      {/* Shimmer sweep */}
      <Box sx={{
        position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
        background: `linear-gradient(105deg, transparent 30%, ${accent}15 50%, transparent 70%)`,
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.8s linear infinite',
        '@keyframes shimmer': {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
      }} />

      {/* Image placeholder */}
      <Box sx={{
        position: 'relative', height: 200, overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))',
      }}>
        <Box sx={{
          position: 'absolute', left: 0, right: 0, height: '1px',
          background: `linear-gradient(90deg, transparent, ${accent}90, transparent)`,
          boxShadow: `0 0 6px ${accent}`,
          animation: 'scannerLine 2s ease-in-out infinite',
          '@keyframes scannerLine': {
            '0%':   { top: '0%',   opacity: 0 },
            '15%':  { opacity: 1 },
            '85%':  { opacity: 1 },
            '100%': { top: '100%', opacity: 0 },
          },
        }} />
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%',
          width: 44, height: 44, borderRadius: '50%',
          border: `2px solid ${accent}40`,
          animation: 'ringPulse 1.8s ease-in-out infinite',
          '@keyframes ringPulse': {
            '0%, 100%': { transform: 'translate(-50%,-50%) scale(1)',    borderColor: `${accent}35` },
            '50%':      { transform: 'translate(-50%,-50%) scale(1.25)', borderColor: `${accent}90` },
          },
        }}>
          <Box sx={{
            position: 'absolute', top: '50%', left: '50%',
            width: 12, height: 12, borderRadius: '50%',
            background: accent, opacity: 0.5, boxShadow: `0 0 10px ${accent}`,
            animation: 'dotBreath 1.8s ease-in-out infinite',
            '@keyframes dotBreath': {
              '0%, 100%': { opacity: 0.4, transform: 'translate(-50%,-50%) scale(1)'    },
              '50%':      { opacity: 0.9, transform: 'translate(-50%,-50%) scale(1.35)' },
            },
          }} />
        </Box>
      </Box>

      {/* Text lines */}
      <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Box sx={{
          height: 20, width: '68%', borderRadius: 1,
          background: 'rgba(255,255,255,0.08)',
          animation: 'barPulse 1.8s ease-in-out infinite',
          '@keyframes barPulse': { '0%, 100%': { opacity: 0.5 }, '50%': { opacity: 1 } },
        }} />
        {[{ w: '100%', d: '0.1s' }, { w: '88%', d: '0.2s' }, { w: '52%', d: '0.3s' }].map(({ w, d }, i) => (
          <Box key={i} sx={{
            height: 13, width: w, borderRadius: 1,
            background: 'rgba(255,255,255,0.05)',
            animation: `barPulse 1.8s ease-in-out ${d} infinite`,
          }} />
        ))}
        <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
          {[42, 32, 26].map((w, i) => (
            <Box key={i} sx={{
              height: 24, width: `${w}%`, borderRadius: '12px',
              background: `${accent}12`, border: `1px solid ${accent}28`,
              animation: `barPulse 1.8s ease-in-out ${i * 0.15}s infinite`,
            }} />
          ))}
        </Box>
      </Box>

      <Box sx={{
        height: '3px',
        background: `linear-gradient(90deg, transparent, ${accent}, #39fcfcff, ${accent}, transparent)`,
        backgroundSize: '300% auto',
        animation: 'barTravel 2s linear infinite',
        '@keyframes barTravel': {
          '0%':   { backgroundPosition: '0% 50%'   },
          '100%': { backgroundPosition: '300% 50%' },
        },
      }} />
    </Box>
  );
};

// ── Animated section title ────────────────────────────────────────────────────
const AnimatedTitle: React.FC<{ primary: string; secondary: string }> = ({ primary, secondary }) => {
  const titleAnim  = useInView(0.3);
  const underlineAnim = useInView(0.3);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 6 }}>
      <Box
        ref={titleAnim.ref}
        style={{
          transition: 'opacity 700ms cubic-bezier(0.22,1,0.36,1), transform 750ms cubic-bezier(0.34,1.4,0.64,1)',
          opacity:   titleAnim.inView ? 1 : 0,
          transform: titleAnim.inView ? 'translateY(0px) scale(1)' : 'translateY(-36px) scale(0.94)',
        }}
      >
        <Typography
          variant="h2"
          component="h2"
          align="center"
          sx={{
            fontWeight: 700,
            background: `linear-gradient(90deg, ${primary}, ${secondary})`,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            display: 'inline-block',
          }}
        >
          My Projects
        </Typography>
      </Box>

      {/* Underline draws in from center */}
      <Box
        ref={underlineAnim.ref}
        style={{
          transition: 'width 800ms cubic-bezier(0.22,1,0.36,1) 280ms, opacity 500ms ease 280ms',
          width:   underlineAnim.inView ? '180px' : '0px',
          opacity: underlineAnim.inView ? 1 : 0,
        }}
        sx={{
          height: 4,
          background: `linear-gradient(90deg, ${primary}, ${secondary})`,
          borderRadius: 2,
          mt: 1,
        }}
      />
    </Box>
  );
};

// ── Animated card wrapper — alternating left/right pop ───────────────────────
const AnimatedCard: React.FC<{ index: number; children: React.ReactNode }> = ({ index, children }) => {
  const { ref, inView } = useInView(0.08);
  const delay = Math.min(index * 100, 300);
  const fromX = index % 2 === 0 ? -50 : 50; // even ← left, odd → right

  return (
    <Box
      ref={ref}
      style={{
        transition: [
          `opacity 650ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
          `transform 700ms cubic-bezier(0.34,1.45,0.64,1) ${delay}ms`,
        ].join(', '),
        opacity:   inView ? 1 : 0,
        transform: inView
          ? 'translateX(0px) translateY(0px) scale(1)'
          : `translateX(${fromX}px) translateY(40px) scale(0.93)`,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {children}
    </Box>
  );
};

// ── Animated pagination ───────────────────────────────────────────────────────
const AnimatedPagination: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { ref, inView } = useInView(0.3);

  return (
    <Box
      ref={ref}
      style={{
        transition: 'opacity 600ms cubic-bezier(0.22,1,0.36,1), transform 650ms cubic-bezier(0.34,1.45,0.64,1)',
        opacity:   inView ? 1 : 0,
        transform: inView ? 'translateY(0px) scale(1)' : 'translateY(30px) scale(0.9)',
      }}
      sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}
    >
      {children}
    </Box>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const Projects: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const projectsPerPage = 4;
  const theme = useTheme();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const totalPages = Math.ceil(projects.length / projectsPerPage);
  const startIndex = (page - 1) * projectsPerPage;
  const currentProjects = projects.slice(startIndex, startIndex + projectsPerPage);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const snapshot = await getDocs(collection(db, 'projects'));
      if (snapshot.empty) {
        setProjects(FALLBACK_PROJECTS);
      } else {
        setProjects(snapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title || '',
          description: doc.data().description || '',
          technologies: doc.data().technologies || [],
          image: doc.data().image || '',
          link: doc.data().link || '#',
        })));
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects. Using default projects instead.');
      setProjects(FALLBACK_PROJECTS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  return (
    <Box ref={sectionRef} id="projects" sx={{ py: 10 }}>
      <Container maxWidth="lg">

        {/* ── Animated Title ── */}
        <AnimatedTitle
          primary={theme.palette.primary.main}
          secondary={theme.palette.secondary.main}
        />

        {error && <Alert severity="info" sx={{ mb: 4 }}>{error}</Alert>}

        {/* ── Loading Skeletons ── */}
        {loading ? (
          <Grid container spacing={4}>
            {[...Array(projectsPerPage)].map((_, index) => (
              <Grid size={{ xs: 12, sm: 6 }} key={`skeleton-${index}`}>
                <ProjectCardSkeleton index={index} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <>
            {/* ── Project Cards ── */}
            <Grid container spacing={4}>
              {currentProjects.length > 0 ? (
                currentProjects.map((project, index) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={project.id} sx={{ display: 'flex' }}>
                    <AnimatedCard index={index}>
                      <ProjectCard
                        id={project.id}
                        title={project.title}
                        description={project.description}
                        technologies={project.technologies}
                        image={project.image}
                        link={project.link}
                        accentColor={getAccentColor(startIndex + index)}
                        externalLink={false}
                      />
                    </AnimatedCard>
                  </Grid>
                ))
              ) : (
                <Grid size={{ xs: 12 }}>
                  <Alert severity="warning">
                    No projects found. Please add projects to your Firestore database.
                  </Alert>
                </Grid>
              )}
            </Grid>

            {/* ── Pagination ── */}
            {totalPages > 1 && (
              <AnimatedPagination>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  sx={{ '& .MuiPaginationItem-root': { color: '#fff' } }}
                />
              </AnimatedPagination>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default Projects;