import { Container, Typography, useTheme, Skeleton, Alert } from '@mui/material';
import { motion } from "framer-motion";
import { Box, Divider, Grid } from '@mui/material';
import React, { useEffect, useState } from 'react'
import {
  fadeIn,
  textVariant,
} from "../../utils/motion";
import { db } from "@/utils/firebase";
import { collection, getDocs } from 'firebase/firestore';
import { parse, isValid } from 'date-fns';

// TypeScript Interface
interface Milestone {
  id?: string;
  year: string;
  title: string;
  description: string;
}

// Fallback milestones
const FALLBACK_MILESTONES: Milestone[] = [
  {
    year: "04/03/2024-05/04/2025",
    title: "EVD Technology LLP",
    description: "Worked as a Frontend Developer, contributing to web application development and user interface enhancements. Collaborated with a small, passionate team of 5 members to build scalable solutions and deliver high-quality, responsive designs that aligned with business goals."
  },
  {
    year: "10/05/2025-present",
    title: "Dheera Digital",
    description: "Worked as a Freelance Frontend Developer, building and maintaining web pages using Next.js. Integrated APIs, created dynamic pages, added smooth animations, and ensured full responsiveness across devices to deliver a polished and user-friendly website."
  },
];

// ─── Sort helper ──────────────────────────────────────────────────────────────
const DATE_FMT = "dd/MM/yyyy";

/**
 * Extracts the start date timestamp from a stored year string.
 * Handles both "04/03/2024-05/04/2025" and "04/03/2024-present".
 */
const getStartTimestamp = (year: string): number => {
  const hyphenIdx = year.indexOf("-", 8); // separator is hyphen after pos 8
  const startStr  = hyphenIdx === -1 ? year : year.slice(0, hyphenIdx);
  try {
    const d = parse(startStr, DATE_FMT, new Date());
    return isValid(d) ? d.getTime() : 0;
  } catch {
    return 0;
  }
};

/** Sort milestones so the most recent start date comes first. */
const sortNewestFirst = (list: Milestone[]): Milestone[] =>
  [...list].sort((a, b) => getStartTimestamp(b.year) - getStartTimestamp(a.year));

// ─── Display helper ───────────────────────────────────────────────────────────
/**
 * Converts stored year string to a readable label.
 * "04/03/2024-present"      → "04/03/2024 — Present"
 * "04/03/2024-05/04/2025"   → "04/03/2024 — 05/04/2025"
 */
const displayYear = (year: string): string => {
  const hyphenIdx = year.indexOf("-", 8);
  if (hyphenIdx === -1) return year;
  const start = year.slice(0, hyphenIdx);
  const end   = year.slice(hyphenIdx + 1);
  return `${start} — ${end === "present" ? "Present" : end}`;
};

/** Returns true if this milestone is a current/ongoing role. */
const isPresent = (year: string): boolean =>
  year.slice(year.indexOf("-", 8) + 1) === "present";

// ─── Skeleton Loader ──────────────────────────────────────────────────────────
const MilestoneSkeleton: React.FC = () => (
  <Box sx={{ display: "flex", justifyContent: "flex-start", px: 2, mb: 2 }}>
    <Box sx={{ width: { xs: "100%", md: "45%" }, p: 3, borderRadius: 2 }}>
      <Skeleton variant="text" width="40%" sx={{ mb: 1 }} />
      <Skeleton variant="text" width="60%" sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" height={80} />
    </Box>
  </Box>
);

// ─── Component ────────────────────────────────────────────────────────────────
export default function Experience() {
  const theme = useTheme();
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState<string | null>(null);

  const fetchMilestones = async () => {
    setLoading(true);
    setError(null);
    try {
      const snap = await getDocs(collection(db, "milestones"));

      if (snap.empty) {
        setMilestones(sortNewestFirst(FALLBACK_MILESTONES));
      } else {
        const fetched: Milestone[] = snap.docs.map((doc) => ({
          id:          doc.id,
          year:        doc.data().year        || '',
          title:       doc.data().title       || '',
          description: doc.data().description || '',
        }));

        // Sort newest-first by the start date embedded in the year string
        setMilestones(sortNewestFirst(fetched));
      }
    } catch (err) {
      console.error('Error fetching milestones:', err);
      setError('Failed to load milestones. Using default milestones instead.');
      setMilestones(sortNewestFirst(FALLBACK_MILESTONES));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMilestones();
  }, []);

  return (
    <Container>
      <motion.div variants={textVariant(0.1)}>
        <Box sx={{ textAlign: "center", mt: 6 }}>
          <Typography
            variant="h3"
            gutterBottom
            sx={{
              mb: 8,
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
            My Experience
          </Typography>
        </Box>
      </motion.div>

      {/* Error Alert */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Alert severity="info" sx={{ mb: 4 }}>
            {error}
          </Alert>
        </motion.div>
      )}

      <Box sx={{ position: "relative" }}>
        <Divider
          sx={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            height: "100%",
            width: "2px",
            background: "linear-gradient(to bottom, #3f51b5, #2196f3)",
            display: { xs: "none", md: "block" },
          }}
        />

        <Grid container>
          {loading ? (
            [...Array(2)].map((_, index) => (
              <Grid size={{ xs: 12 }} key={`skeleton-${index}`}>
                <MilestoneSkeleton />
              </Grid>
            ))
          ) : milestones.length > 0 ? (
            milestones.map((milestone, index) => {
              const current = isPresent(milestone.year);

              return (
                <Grid size={{ xs: 12 }} key={milestone.id || `milestone-${index}`}>
                  <motion.div
                    variants={fadeIn(
                      index % 2 === 0 ? "left" : "right",
                      "tween",
                      0.2,
                      1
                    )}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: false, amount: 0.25 }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: {
                          xs: "flex-start",
                          md: index % 2 === 0 ? "flex-end" : "flex-start",
                        },
                        px: 2,
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          width: { xs: "100%", md: "45%" },
                          p: 3,
                          borderRadius: 2,
                          background:
                            "transparent linear-gradient(180deg, rgba(0, 238, 255, 0.44) 0%, rgba(0, 238, 255, 0.05) 100%)",
                          boxShadow: current
                            ? "0 0 18px rgba(16, 185, 129, 0.5)"
                            : "0 0 15px rgba(46, 210, 210, 0.56)",
                          position: "relative",
                          backdropFilter: 'blur(4px)',
                          // Arrow connector to the centre line
                          "&:before": {
                            content: '""',
                            position: "absolute",
                            top: "20px",
                            [index % 2 === 0 ? "right" : "left"]: {
                              xs: "-10px",
                              md: index % 2 === 0 ? "-15px" : "-15px",
                            },
                            width: { xs: "20px", md: "30px" },
                            height: "2px",
                            background: current ? "#10b981" : "#3f51b5",
                          },
                          // Dot on centre line
                          "&:after": {
                            content: '""',
                            position: "absolute",
                            top: "15px",
                            [index % 2 === 0 ? "right" : "left"]: {
                              xs: "-15px",
                              md: index % 2 === 0 ? "-25px" : "-25px",
                            },
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            background: current ? "#10b981" : "#2196f3",
                            boxShadow: current ? "0 0 8px #10b981" : "none",
                            display: { xs: "none", md: "block" },
                          },
                          transition: "transform 0.3s, box-shadow 0.3s",
                          "&:hover": {
                            transform: "translateY(-5px)",
                            boxShadow: current
                              ? "0 0 22px rgba(16, 185, 129, 0.75)"
                              : "0 0 15px rgba(6, 254, 254, 0.81)",
                            backdropFilter: 'blur(8px)',
                            "& .milestone-year":        { fontWeight: 700 },
                            "& .milestone-title":       { fontWeight: 900 },
                            "& .milestone-description": { fontWeight: 600 },
                            scale: 1.02,
                          },
                        }}
                      >
                        {/* Year row with optional "Present" badge */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.25 }}>
                          <Typography
                            variant="body1"
                            className="milestone-year"
                            sx={{
                              fontWeight: 600,
                              color: current ? "#10b981" : "#3fffff",
                              transition: "font-weight 0.3s",
                            }}
                          >
                            {displayYear(milestone.year)}
                          </Typography>

                          {/* Pulsing "Active" badge for current roles */}
                          {current && (
                            <Box
                              sx={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 0.5,
                                px: 0.875,
                                py: 0.2,
                                borderRadius: "100px",
                                bgcolor: "rgba(16,185,129,0.12)",
                                border: "1px solid rgba(16,185,129,0.3)",
                                flexShrink: 0,
                              }}
                            >
                              <Box
                                sx={{
                                  width: 6,
                                  height: 6,
                                  borderRadius: "50%",
                                  bgcolor: "#10b981",
                                  boxShadow: "0 0 6px #10b981",
                                  "@keyframes activePulse": {
                                    "0%,100%": { opacity: 1 },
                                    "50%":     { opacity: 0.25 },
                                  },
                                  animation: "activePulse 2s ease-in-out infinite",
                                }}
                              />
                              <Typography sx={{ color: "#10b981", fontSize: "0.6rem", fontWeight: 700, lineHeight: 1, fontFamily: "inherit" }}>
                                Active
                              </Typography>
                            </Box>
                          )}
                        </Box>

                        <Typography
                          variant="h6"
                          className="milestone-title"
                          sx={{
                            fontWeight: 700,
                            mb: 1,
                            color: "#3fffff",
                            transition: "font-weight 0.3s",
                          }}
                        >
                          {milestone.title}
                        </Typography>

                        <Typography
                          variant="body1"
                          className="milestone-description"
                          sx={{
                            color: "#3fffff",
                            fontWeight: 400,
                            transition: "font-weight 0.3s",
                          }}
                        >
                          {milestone.description}
                        </Typography>
                      </Box>
                    </Box>
                  </motion.div>
                </Grid>
              );
            })
          ) : (
            <Grid size={{ xs: 12 }}>
              <Alert severity="warning">
                No milestones found. Please add milestones to your Firestore database.
              </Alert>
            </Grid>
          )}
        </Grid>
      </Box>
    </Container>
  );
}