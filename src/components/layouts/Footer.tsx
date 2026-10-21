"use client";
import React from 'react';
import { Box, Container, Typography, IconButton, Link } from '@mui/material';
import { Icon } from '@iconify/react';

const Footer: React.FC = () => {
  return (
    <Box 
      component="footer"
      sx={{ 
        py: 6,
        background:
          "transparent linear-gradient(180deg, rgba(0, 238, 255, 0.67) 0%, rgba(0, 238, 255, 0.15) 100%)",
        color: '#fff',
        boxShadow: "0 0 13px 6px rgba(0, 249, 241, 0.81)",
        backdropFilter: 'blur(2px)',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <IconButton 
            href="https://github.com/piyush25dev" 
            target="_blank" 
            rel="noopener"
            color="inherit"
            sx={{ 
              mx: 1,
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-3px)',
              }
            }}
          >
            <Icon icon="mdi:github" width={32} height={32} />
          </IconButton>
          <IconButton 
            href="https://www.linkedin.com/in/piyush-kumar-dewangan-94124a256" 
            target="_blank" 
            rel="noopener"
            color="inherit"
            sx={{ 
              mx: 1,
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-3px)',
              }
            }}
          >
            <Icon icon="mdi:linkedin" width={32} height={32} />
          </IconButton>
          <IconButton 
            href="mailto:piyushdewangan2501@gmail.com" 
            color="inherit"
            sx={{ 
              mx: 1,
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-3px)',
              }
            }}
          >
            <Icon icon="mdi:email" width={32} height={32} />
          </IconButton>
          <IconButton 
            href="https://www.instagram.com/i_am_bit2/" 
            color="inherit"
            sx={{ 
              mx: 1,
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-3px)',
              }
            }}
          >
            <Icon icon="mdi:instagram" width={32} height={32} />
          </IconButton>
        </Box>
        <Typography variant="body1" align="center" sx={{fontWeight: '700'}}>
          © {new Date().getFullYear()} Piyush Kumar Dewangan. All rights reserved.
        </Typography>
        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Built with <Link href="https://nextjs.org/" color="inherit" target="_blank">Next.js</Link>,{' '}
          <Link href="https://mui.com/" color="inherit" target="_blank">Material UI</Link>,{' '}
          <Link href="https://www.framer.com/motion/" color="inherit" target="_blank">Framer Motion</Link> and{' '}
          <Link href="https://firebase.google.com/" color="inherit" target="_blank">Firebase</Link>.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;