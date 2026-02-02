import React, { useEffect, useRef, useState } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import CustomButton from '../ui/CustomButton';
import { scroller } from 'react-scroll'; // Import scroller

gsap.registerPlugin(ScrollTrigger);

const Hero: React.FC = () => {
    const [mounted, setMounted] = useState(false);
    const heroRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
        if (mounted && heroRef.current && textRef.current) {
            gsap.from(heroRef.current, {
                opacity: 0,
                duration: 1,
                ease: 'power3.out',
            });

            gsap.from(textRef.current.children, {
                y: 50,
                opacity: 0,
                stagger: 0.1,
                duration: 0.8,
                ease: 'power3.out',
            });

            // Parallax effect
            gsap.to(heroRef.current, {
                y: -50,
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true,
                },
            });

            return () => {
                ScrollTrigger.getAll().forEach(trigger => trigger.kill());
                gsap.killTweensOf('*');
            };
        }
    }, [mounted]);

    const scrollToContact = () => {
        scroller.scrollTo('contact', {
            duration: 800,
            delay: 0,
            smooth: 'easeInOutQuart',
            offset: -64, // Adjust based on your navbar height
        });
    };

    const scrollToProjects = () => {
        scroller.scrollTo('projects', {
            duration: 800,
            delay: 0,
            smooth: 'easeInOutQuart',
            offset: -64,
        });
    };

    return (
        <Box
            ref={heroRef}
            sx={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
            }}
        >
            <Container maxWidth="lg">
                <Box ref={textRef} sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                    <Typography variant="h1"
                        component="h1"
                        sx={{ mb: 2, fontWeight: 700, textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)' }}>
                        Hi, I&apos;m Piyush Kumar Dewangan
                    </Typography>
                    <Typography variant="h2"
                        component="h2"
                        sx={{ mb: 2, textShadow: '0 2px 6px rgba(0, 0, 0, 0.2)' }}>
                        Frontend Developer
                    </Typography>
                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: { xs: 2, sm: 4, md: 6 }, flexDirection: { xs: "column", sm: "row" } }}>
                        <CustomButton
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={scrollToContact} // Use onClick instead of href
                            sx={{
                                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
                                },
                                transition: 'all 0.3s ease',
                                fontWeight: 600,
                            }}
                        >
                            Contact Me
                        </CustomButton>
                        <CustomButton
                            variant="outlined"
                            color="inherit"
                            size="large"
                            onClick={scrollToProjects} // Use onClick instead of href
                            sx={{
                                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
                                },
                                transition: 'all 0.3s ease',
                            }}
                        >
                            View Work
                        </CustomButton>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default Hero;