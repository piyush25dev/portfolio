import { Container, Typography, useTheme } from '@mui/material';
import { motion } from "framer-motion";
import { Box, Divider, Grid } from '@mui/material';
import React from 'react'
import {
  fadeIn,
  textVariant,
} from "../../utils/motion";

const milestones = [
  {
    year: "04/03/2024-05/04/2025",
    title: "EVD Technology LLP",
    description: "Worked as a Frontend Developer, contributing to web application development and user interface enhancements. Collaborated with a small, passionate team of 5 members to build scalable solutions and deliver high-quality, responsive designs that aligned with business goals."
  },
  {
    year: "10/05/2025-05/07/2025",
    title: "Dheera Digital",
    description: "Worked as a Freelance Frontend Developer, building and maintaining web pages using Next.js. Integrated APIs, created dynamic pages, added smooth animations, and ensured full responsiveness across devices to deliver a polished and user-friendly website."
  },
];

export default function Experience() {
  const theme = useTheme();

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
          {milestones.map((milestone, index) => (
            <Grid size={{ xs: 12 }} key={index}>
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
                      boxShadow: "0 0 15px rgba(46, 210, 210, 0.56)",
                      position: "relative",
                      backdropFilter: 'blur(4px)',
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
                        background: "#3f51b5",
                      },
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
                        background: "#2196f3",
                        display: { xs: "none", md: "block" },
                      },
                      transition: "transform 0.3s, box-shadow 0.3s",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: "0 0 15px rgba(6, 254, 254, 0.81)",
                        backdropFilter: 'blur(8px)',
                        "& .milestone-year": {
                          fontWeight: 700,
                        },
                        "& .milestone-title": {
                          fontWeight: 900,
                        },
                        "& .milestone-description": {
                          fontWeight: 600,
                        },
                        scale: 1.02,
                      },
                    }}
                  >
                    <Typography
                      variant="body1"
                      className="milestone-year"
                      sx={{ 
                        fontWeight: 600, 
                        color: "#3fffff",
                        transition: "font-weight 0.3s",
                      }}
                    >
                      {milestone.year}
                    </Typography>
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
          ))}
        </Grid>
      </Box>
    </Container>
  )
}