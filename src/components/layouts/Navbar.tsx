'use client';
import React, { useEffect } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box, Drawer, List, ListItem, ListItemButton, ListItemText, Container } from '@mui/material';
import { Icon } from '@iconify/react';
import { Link as ScrollLink } from 'react-scroll';
import { useState } from 'react';
import { styled } from '@mui/material/styles';

const navItems = ['Home', 'About', 'Skills', 'Projects', 'Contact'];

// Styled component for animated ListItemButton
const AnimatedListItemButton = styled(ListItemButton)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '2px',
    backgroundColor: theme.palette.primary.main,
    transform: 'scaleX(0)',
    transformOrigin: 'right',
    transition: 'transform 0.3s ease',
  },
  '&:hover::after': {
    transform: 'scaleX(1)',
    transformOrigin: 'left',
  },
  '&.Mui-selected': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    '&::after': {
      transform: 'scaleX(1)',
    },
  },
}));

// Styled component for the desktop navigation links
const StyledScrollLink = styled(ScrollLink)(() => ({
  margin: '0 10px',
  cursor: 'pointer',
  color: 'white',
  textDecoration: 'none',
  position: 'relative',
  padding: '8px 0',
  transition: 'color 0.3s ease',
  '&:hover': {
    color: '#FF6B6B',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '2px',
    backgroundColor: '#FF6B6B',
    transform: 'scaleX(0)',
    transformOrigin: 'right',
    transition: 'transform 0.3s ease',
  },
  '&:hover::after': {
    transform: 'scaleX(1)',
    transformOrigin: 'left',
  },
  '&.active': {
    color: '#FF6B6B',
    '&::after': {
      transform: 'scaleX(1)',
    },
  },
}));

const Navbar: React.FC = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeLink, setActiveLink] = useState('Home');
    const [scrolled, setScrolled] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(prev => !prev);
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
            
            // Update active link based on scroll position
            navItems.forEach(item => {
                const section = document.getElementById(item.toLowerCase());
                if (section) {
                    const rect = section.getBoundingClientRect();
                    if (rect.top <= 100 && rect.bottom >= 100) {
                        setActiveLink(item);
                    }
                }
            });
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleSetActive = (to: string) => {
        setActiveLink(to.charAt(0).toUpperCase() + to.slice(1));
    };

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ my: 2 }}>My Portfolio</Typography>
            <List>
                {navItems.map((item) => (
                    <ListItem key={item} disablePadding>
                        <AnimatedListItemButton
                            selected={activeLink === item}
                            sx={{ textAlign: 'center' }}
                        >
                            <ScrollLink
                                to={item.toLowerCase()}
                                smooth={true}
                                duration={500}
                                offset={-64}
                                onSetActive={handleSetActive}
                                style={{
                                    width: '100%',
                                    padding: '8px 16px',
                                    color: activeLink === item ? '#FF6B6B' : 'white',
                                    textDecoration: 'none',
                                    transition: 'color 0.3s ease'
                                }}
                            >
                                <ListItemText primary={item} />
                            </ScrollLink>
                        </AnimatedListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <Box>
            <AppBar position="fixed"
                elevation={scrolled ? 4 : 0}
                sx={{
                    backdropFilter: scrolled ? "blur(10px)" : "none",
                    backgroundColor: scrolled ? "rgba(75, 255, 240, 0.33)" : "transparent",
                    transition: "all 0.3s ease",
                    boxShadow: scrolled ? "0px 4px 20px rgba(1, 236, 248, 0.27)" : "none",
                }}>
                <Container maxWidth="lg" disableGutters>
                    <Toolbar>
                        <Typography variant="h6" sx={{ flexGrow: 1, color: "#fff", display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Icon icon="mdi:code-tags" width={28} height={28} color="#00c8ff" />
                            My Portfolio
                        </Typography>
                        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                            {navItems.map((item) => (
                                <StyledScrollLink
                                    key={item}
                                    to={item.toLowerCase()}
                                    smooth={true}
                                    duration={500}
                                    offset={-64}
                                    onSetActive={handleSetActive}
                                    spy={true}
                                    activeClass="active"
                                >
                                    {item}
                                </StyledScrollLink>
                            ))}
                        </Box>
                        <IconButton
                            color="inherit"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ display: { sm: 'none' } }}
                        >
                            <Icon icon="mdi:menu" width={28} height={28} color="white" />
                        </IconButton>
                    </Toolbar>
                </Container>
            </AppBar>
            <Drawer
                anchor="left"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: 240,
                        backgroundColor: "rgba(41, 255, 255, 0.24)",
                        backdropFilter: "blur(10px)",
                        boxShadow: "none",
                        color: "#fff"
                    },
                    "& .MuiBackdrop-root": {
                        backgroundColor: "rgba(0, 0, 0, 0.2)",
                        backdropFilter: "blur(2px)",
                    },
                }}
            >
                {drawer}
            </Drawer>
        </Box>
    );
};

export default Navbar;