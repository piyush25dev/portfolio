'use client';
import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  useMediaQuery,
  useTheme,
  Alert,
} from '@mui/material';
import { motion } from 'framer-motion';
import { db } from "@/utils/firebase";
import { collection, getDocs } from 'firebase/firestore';

// Fallback skills
const FALLBACK_SKILLS = [
  { name: 'React',        image: '/images/reactjs.svg' },
  { name: 'Next.js',      image: '/images/next.png' },
  { name: 'JavaScript',   image: '/images/javascript.svg' },
  { name: 'TypeScript',   image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/1200px-Typescript_logo_2020.svg.png' },
  { name: 'HTML',         image: '/images/html.svg' },
  { name: 'CSS',          image: '/images/css.svg' },
  { name: 'Material UI',  image: '/images/MUI.svg' },
  { name: 'Framer Motion',image: '/images/framer.png' },
  { name: 'Tailwind CSS', image: '/images/tailwind.svg' },
  { name: 'GSAP',         image: 'https://dzakifadh.dev/img/gsap.png' },
  { name: 'Redux',        image: '/images/redux.svg' },
];

// Animation variants (unchanged)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden:   { opacity: 0, scale: 0.5, y: 20 },
  visible:  { opacity: 1, scale: 1,   y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 12 } },
};

interface Skill {
  id?: string;
  name: string;
  image: string;
}

// ── Skill card accent colors (cycling) ───────────────────────────────────────
const ACCENT_COLORS = [
  '#38bdf8', '#a78bfa', '#34d399', '#fb923c',
  '#f472b6', '#facc15', '#60a5fa', '#4ade80',
];
const accent = (i: number) => ACCENT_COLORS[i % ACCENT_COLORS.length];

// ── Animated Skill Skeleton ──────────────────────────────────────────────────
const SkillSkeleton: React.FC<{ index: number }> = ({ index }) => {
  const ac = accent(index);
  const isMobile = useMediaQuery('(max-width:768px)');

  return (
    <Box
      style={{ animation: `skillSkeletonIn 0.45s ease ${index * 80}ms both` }}
      sx={{
        borderRadius: 4,
        overflow: 'hidden',
        border: `1px solid ${ac}25`,
        background: 'transparent',
        position: 'relative',
        p: isMobile ? 1 : 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: isMobile ? 130 : 170,
        '@keyframes skillSkeletonIn': {
          from: { opacity: 0, transform: 'translateY(20px) scale(0.92)' },
          to:   { opacity: 1, transform: 'translateY(0px)  scale(1)'    },
        },
      }}
    >
      {/* Shimmer sweep */}
      <Box sx={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: `linear-gradient(105deg, transparent 30%, ${ac}18 50%, transparent 70%)`,
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.8s linear infinite',
        '@keyframes shimmer': {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
      }} />

      {/* Title bar */}
      <Box sx={{
        width: '60%', height: 16, borderRadius: 1, mb: 2,
        background: 'rgba(255,255,255,0.08)',
        animation: 'barPulse 1.8s ease-in-out infinite',
        '@keyframes barPulse': {
          '0%, 100%': { opacity: 0.4 },
          '50%':      { opacity: 1   },
        },
      }} />

      {/* Spinning ring icon placeholder */}
      <Box sx={{
        position: 'relative',
        width: isMobile ? 60 : 80,
        height: isMobile ? 60 : 80,
        zIndex: 2,
      }}>
        {/* Track */}
        <Box sx={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          border: `2px solid ${ac}20`,
        }} />
        {/* Spinning arc */}
        <Box sx={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          border: '2px solid transparent',
          borderTopColor: ac,
          borderRightColor: `${ac}60`,
          boxShadow: `0 0 10px ${ac}50`,
          animation: 'spin 1s linear infinite',
          '@keyframes spin': { to: { transform: 'rotate(360deg)' } },
        }} />
        {/* Inner pulsing dot */}
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%',
          width: isMobile ? 18 : 24, height: isMobile ? 18 : 24,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${ac}80, transparent 70%)`,
          boxShadow: `0 0 12px ${ac}`,
          animation: 'dotPulse 1.8s ease-in-out infinite',
          '@keyframes dotPulse': {
            '0%, 100%': { transform: 'translate(-50%,-50%) scale(1)',    opacity: 0.5 },
            '50%':      { transform: 'translate(-50%,-50%) scale(1.4)',  opacity: 1   },
          },
        }} />
      </Box>

      {/* Corner bracket accents */}
      {[
        { top: 8,  left: 8,  borderTop: `2px solid ${ac}50`, borderLeft:  `2px solid ${ac}50` },
        { top: 8,  right: 8, borderTop: `2px solid ${ac}50`, borderRight: `2px solid ${ac}50` },
        { bottom: 8, left: 8,  borderBottom: `2px solid ${ac}50`, borderLeft:  `2px solid ${ac}50` },
        { bottom: 8, right: 8, borderBottom: `2px solid ${ac}50`, borderRight: `2px solid ${ac}50` },
      ].map((style, i) => (
        <Box key={i} sx={{
          position: 'absolute', width: 12, height: 12, ...style, zIndex: 2,
          animation: `bracketPulse 2s ease-in-out ${i * 0.2}s infinite`,
          '@keyframes bracketPulse': {
            '0%, 100%': { opacity: 0.25 },
            '50%':      { opacity: 0.9  },
          },
        }} />
      ))}

      {/* Bottom shimmer bar */}
      <Box sx={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: '2px',
        background: `linear-gradient(90deg, transparent, ${ac}, transparent)`,
        backgroundSize: '200% auto',
        animation: 'barTravel 2s linear infinite',
        '@keyframes barTravel': {
          '0%':   { backgroundPosition: '-100% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
      }} />
    </Box>
  );
};

// ── Title skeleton ───────────────────────────────────────────────────────────
const TitleSkeleton: React.FC = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 6 }}>
    <Box sx={{
      height: 52, width: 220, borderRadius: 2, mb: 1,
      background: 'rgba(255,255,255,0.07)',
      position: 'relative', overflow: 'hidden',
      animation: 'titleIn 0.5s ease both',
      '@keyframes titleIn': {
        from: { opacity: 0, transform: 'translateY(-16px)' },
        to:   { opacity: 1, transform: 'translateY(0px)'   },
      },
    }}>
      <Box sx={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.8s linear infinite',
      }} />
    </Box>
    <Box sx={{
      height: 4, width: 120, borderRadius: 2,
      background: 'rgba(255,255,255,0.1)',
      animation: 'underlineGrow 0.8s cubic-bezier(0.22,1,0.36,1) 0.3s both',
      '@keyframes underlineGrow': {
        from: { width: 0,     opacity: 0 },
        to:   { width: 120,   opacity: 1 },
      },
    }} />
  </Box>
);

// ── Main Component ────────────────────────────────────────────────────────────
const Skills: React.FC = () => {
  const isMobile = useMediaQuery('(max-width:768px)');
  const theme = useTheme();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);

  const fetchSkills = async () => {
    setLoading(true);
    setError(null);
    try {
      const snap = await getDocs(collection(db, 'skills'));
      if (snap.empty) {
        setSkills(FALLBACK_SKILLS);
      } else {
        const fetchedSkills = snap.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name || '',
          image: doc.data().image || '',
        }));
        // Sort by ID in ascending order (oldest first, newest last)
        setSkills(fetchedSkills.sort((a, b) => a.id.localeCompare(b.id)));
      }
    } catch (err) {
      console.error('Error fetching skills:', err);
      setError('Failed to load skills. Using default skills instead.');
      setSkills(FALLBACK_SKILLS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSkills(); }, []);

  return (
    <Box id="skills" sx={{ py: { xs: 2, md: 10 } }}>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>

        {/* ── Title ── */}
        {loading ? <TitleSkeleton /> : (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: '-50px' }}
              transition={{ duration: 0.6 }}
            >
              <Typography
                variant="h2"
                component="h2"
                align="center"
                sx={{
                  mb: 6, fontWeight: 700,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
                  position: 'relative', display: 'inline-block',
                  '&::after': {
                    content: '""', position: 'absolute', bottom: -8, left: '50%',
                    transform: 'translateX(-50%)', width: '60%', height: 4,
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    borderRadius: 2,
                  },
                }}
              >
                My Skills
              </Typography>
            </motion.div>
          </Box>
        )}

        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Alert severity="info" sx={{ mb: 4 }}>{error}</Alert>
          </motion.div>
        )}

        {/* ── Loading skeletons ── */}
        {loading ? (
          <Grid container spacing={4} sx={{ justifyContent: 'center' }}>
            {[...Array(8)].map((_, index) => (
              <Grid size={{ xs: 6, sm: 4, md: 3 }} key={index}>
                <SkillSkeleton index={index} />
              </Grid>
            ))}
          </Grid>
        ) : (
          /* ── Skills grid (unchanged framer-motion behaviour) ── */
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: '-50px' }}
          >
            <Grid container spacing={4} sx={{ justifyContent: 'center' }}>
              {skills.length > 0 ? (
                skills.map((skill, index) => (
                  <Grid size={{ xs: 6, sm: 4, md: 3 }} key={skill.id || skill.name}>
                    <motion.div
                      variants={itemVariants}
                      whileHover={{ scale: 1.05, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                      custom={index}
                      onHoverStart={() => setHoveredIndex(index)}
                      onHoverEnd={() => setHoveredIndex(null)}
                    >
                      <Box
                        sx={{
                          p: isMobile ? 1 : 2, borderRadius: 4,
                          backgroundColor: 'rgba(255,255,255,0.75)',
                          boxShadow: 1, textAlign: 'center',
                          transition: 'all 0.3s ease',
                          backdropFilter: 'blur(0)', cursor: 'pointer',
                          height: '100%', display: 'flex',
                          flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                          '&:hover': {
                            backgroundColor: 'rgba(252,251,252,0.3)',
                            backdropFilter: 'blur(8px)',
                            color: '#fff', fontWeight: '700',
                            boxShadow: '0 4px 20px rgba(255,255,255,0.2)',
                          },
                        }}
                      >
                        <Typography variant={isMobile ? 'body1' : 'h5'} gutterBottom sx={{ fontWeight: 600 }}>
                          {skill.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center',
                          mb: 2, minHeight: isMobile ? 60 : 80 }}>
                          <motion.div
                            animate={{ scale: hoveredIndex === index ? 1.15 : 1 }}
                            transition={{ delay: hoveredIndex === index ? 0.05 : 0, type: 'spring', stiffness: 300, damping: 20 }}
                          >
                            <Box
                              component="img"
                              src={skill.image}
                              alt={skill.name}
                              sx={{ width: isMobile ? 60 : 80, height: isMobile ? 60 : 80,
                                objectFit: 'contain', transition: 'all 0.2s ease' }}
                              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                          </motion.div>
                        </Box>
                      </Box>
                    </motion.div>
                  </Grid>
                ))
              ) : (
                <Grid size={{ xs: 12 }}>
                  <Alert severity="warning">No skills found. Please add skills to your Firestore database.</Alert>
                </Grid>
              )}
            </Grid>
          </motion.div>
        )}
      </Container>
    </Box>
  );
};

export default Skills;