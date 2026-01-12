import React, { useState, useEffect } from 'react';
import { Box, IconButton, Tooltip, useTheme } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ShareIcon from '@mui/icons-material/Share';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';

const MotionBox = motion(Box);

interface FloatingNavProps {
  accentColor: string;
}

export const FloatingNav: React.FC<FloatingNavProps> = ({ accentColor }) => {
  const theme = useTheme();
  const [showNav, setShowNav] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowNav(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share failed:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  return (
    <AnimatePresence>
      {showNav && (
        <MotionBox
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.3 }}
          sx={{
            position: 'fixed',
            right: { xs: 16, sm: 24, md: 32 },
            bottom: { xs: 16, sm: 24, md: 32 },
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
            zIndex: 1000,
          }}
        >
          {/* Scroll to top */}
          <Tooltip title="Scroll to top" placement="left">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <IconButton
                onClick={scrollToTop}
                sx={{
                  background: `linear-gradient(135deg, ${accentColor}DD, ${accentColor})`,
                  color: '#000',
                  width: { xs: 48, sm: 56 },
                  height: { xs: 48, sm: 56 },
                  backdropFilter: 'blur(10px)',
                  boxShadow: `0 4px 20px ${accentColor}40`,
                  border: `2px solid ${accentColor}`,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${accentColor}, ${accentColor}CC)`,
                    boxShadow: `0 6px 25px ${accentColor}60`,
                  },
                }}
              >
                <KeyboardArrowUpIcon />
              </IconButton>
            </motion.div>
          </Tooltip>

          {/* Share button */}
          <Tooltip title="Share project" placement="left">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <IconButton
                onClick={handleShare}
                sx={{
                  background: theme.palette.mode === 'dark'
                    ? 'rgba(40, 40, 40, 0.8)'
                    : 'rgba(255, 255, 255, 0.8)',
                  color: accentColor,
                  width: { xs: 48, sm: 56 },
                  height: { xs: 48, sm: 56 },
                  backdropFilter: 'blur(10px)',
                  boxShadow: `0 4px 20px ${accentColor}20`,
                  border: `2px solid ${accentColor}40`,
                  '&:hover': {
                    background: `${accentColor}20`,
                    borderColor: accentColor,
                  },
                }}
              >
                <ShareIcon />
              </IconButton>
            </motion.div>
          </Tooltip>

          {/* Bookmark button */}
          <Tooltip title={isBookmarked ? "Remove bookmark" : "Bookmark project"} placement="left">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <IconButton
                onClick={toggleBookmark}
                sx={{
                  background: isBookmarked
                    ? `linear-gradient(135deg, ${accentColor}DD, ${accentColor})`
                    : theme.palette.mode === 'dark'
                      ? 'rgba(40, 40, 40, 0.8)'
                      : 'rgba(255, 255, 255, 0.8)',
                  color: isBookmarked ? '#000' : accentColor,
                  width: { xs: 48, sm: 56 },
                  height: { xs: 48, sm: 56 },
                  backdropFilter: 'blur(10px)',
                  boxShadow: isBookmarked
                    ? `0 4px 20px ${accentColor}40`
                    : `0 4px 20px ${accentColor}20`,
                  border: `2px solid ${accentColor}${isBookmarked ? '' : '40'}`,
                  '&:hover': {
                    background: `${accentColor}${isBookmarked ? '' : '20'}`,
                    borderColor: accentColor,
                  },
                }}
              >
                {isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
              </IconButton>
            </motion.div>
          </Tooltip>

          {/* Decorative glow */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '120%',
              height: '120%',
              background: `radial-gradient(circle, ${accentColor}20, transparent 70%)`,
              filter: 'blur(20px)',
              zIndex: -1,
              pointerEvents: 'none',
            }}
          />
        </MotionBox>
      )}
    </AnimatePresence>
  );
};