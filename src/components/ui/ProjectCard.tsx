import React, { useRef } from 'react';
import { Box, Typography, Chip, Card, CardMedia, CardContent, useTheme, useMediaQuery } from '@mui/material';
import { SxProps, Theme } from '@mui/material';
import { useRouter } from 'next/navigation';

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  image: string;
  link: string;
  accentColor?: string;
  sx?: SxProps<Theme>;
  externalLink?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  title,
  description,
  technologies,
  image,
  link,
  accentColor,
  sx,
  externalLink = false
}) => {
  const theme = useTheme();
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClick = (e: React.MouseEvent) => {
    if (!externalLink) {
      e.preventDefault();
      router.push(`/projects/${id}`);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Disable 3D effects on mobile
    if (isMobile || !cardRef.current) return;
    
    const card = cardRef.current;
    const cardRect = card.getBoundingClientRect();
    const cardWidth = cardRect.width;
    const cardHeight = cardRect.height;
    
    // Calculate mouse position relative to the card center
    const centerX = cardRect.left + cardWidth / 2;
    const centerY = cardRect.top + cardHeight / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    // Calculate rotation values (adjust divisor to control sensitivity)
    const rotateY = (mouseX / (cardWidth / 2)) * 10; // Max 10 degrees rotation
    const rotateX = -(mouseY / (cardHeight / 2)) * 10; // Max 10 degrees rotation
    
    // Apply the transformation
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    
    // Add subtle shadow effect based on mouse position
    const shadowX = -rotateY / 2;
    const shadowY = rotateX / 2;
    card.style.boxShadow = `
      ${shadowX}px ${shadowY}px 15px rgba(0, 0, 0, 0.2),
      ${shadowX * 2}px ${shadowY * 2}px 30px rgba(0, 0, 0, 0.1)
    `;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    
    // Reset transformations with smooth transition
    const card = cardRef.current;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    card.style.boxShadow = theme.palette.mode === 'dark' 
      ? "0 8px 25px rgba(71, 242, 248, 0.3)" 
      : "0 8px 25px rgba(9, 240, 248, 0.43)";
    
    // Remove transition after reset to avoid interference with hover effect
    setTimeout(() => {
      card.style.transition = 'transform 0.1s ease, box-shadow 0.1s ease';
    }, 300);
  };

  const handleMouseEnter = () => {
    if (!cardRef.current) return;
    
    // Remove transition for direct response to mouse movement
    cardRef.current.style.transition = 'none';
  };

  return (
    <Box
      component="a"
      href={externalLink ? link : `/projects/${id}`}
      target={externalLink ? "_blank" : "_self"}
      rel={externalLink ? "noopener noreferrer" : ""}
      onClick={handleClick}
      sx={{
        textDecoration: 'none',
        display: 'block',
        height: '100%',
        width: '100%',
      }}
    >
      <Card
        ref={cardRef}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: isMobile ? 'none' : 'transform 0.3s ease, box-shadow 0.3s ease',
          background:
          "transparent linear-gradient(180deg, rgba(0, 238, 255, 0.67) 0%, rgba(0, 238, 255, 0.15) 100%)",
          backdropFilter: 'blur(8px)',
          color: "#fff",
          boxShadow: theme.palette.mode === 'dark' 
            ? "0 8px 25px rgba(71, 242, 248, 0.3)" 
            : "0 8px 25px rgba(9, 240, 248, 0.43)",
          borderRadius: { xs: 2, sm: 4 },
          cursor: 'pointer',
          transformStyle: 'preserve-3d',
          overflow: 'hidden',
          ...sx,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
      >
        <CardMedia
          component="img"
          image={image}
          alt={title}
          sx={{
            height: { xs: 150, sm: 200 },
            width: '100%',
            objectFit: 'cover',
            borderBottom: `4px solid ${accentColor || theme.palette.primary.main}`,
            transform: isMobile ? 'none' : 'translateZ(30px)',
          }}
        />
        <CardContent sx={{ 
          flexGrow: 1, 
          transform: isMobile ? 'none' : 'translateZ(20px)',
          p: { xs: 1.5, sm: 2 },
          overflow: 'hidden',
        }}>
          <Typography 
            gutterBottom 
            variant="h5" 
            component="h3" 
            sx={{ 
              color: "#fff",
              fontSize: { xs: '1.1rem', sm: '1.5rem' },
              fontWeight: 700,
              mb: { xs: 1, sm: 1.5 },
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {title}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              mb: { xs: 1.5, sm: 2 }, 
              color: "#fff",
              fontSize: { xs: '0.85rem', sm: '0.875rem' },
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {description}
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: { xs: 0.5, sm: 1 },
            transform: isMobile ? 'none' : 'translateZ(10px)',
          }}>
            {technologies.slice(0, 3).map((tech) => (
              <Chip
                key={tech}
                label={tech}
                sx={{
                  backgroundColor: accentColor
                    ? `${accentColor}30`
                    : theme.palette.mode === 'dark'
                      ? theme.palette.grey[800]
                      : theme.palette.grey[200],
                  color: accentColor
                    ? accentColor
                    : theme.palette.text.primary,
                  fontWeight: 900,
                  fontSize: { xs: '0.65rem', sm: '0.75rem' },
                  height: { xs: 24, sm: 32 },
                  padding: { xs: '4px 8px', sm: '4px 12px' },
                  '& .MuiChip-label': {
                    px: { xs: 0.5, sm: 1 },
                  }
                }}
              />
            ))}
            {technologies.length > 3 && (
              <Chip
                label={`+${technologies.length - 3}`}
                sx={{
                  backgroundColor: accentColor
                    ? `${accentColor}30`
                    : theme.palette.mode === 'dark'
                      ? theme.palette.grey[800]
                      : theme.palette.grey[200],
                  color: accentColor
                    ? accentColor
                    : theme.palette.text.primary,
                  fontWeight: 900,
                  fontSize: { xs: '0.65rem', sm: '0.75rem' },
                  height: { xs: 24, sm: 32 },
                  padding: { xs: '4px 8px', sm: '4px 12px' },
                  '& .MuiChip-label': {
                    px: { xs: 0.5, sm: 1 },
                  }
                }}
              />
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProjectCard;