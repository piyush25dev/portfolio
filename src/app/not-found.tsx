"use client";

import { Box, Button, Typography, Container } from "@mui/material";
import Link from "next/link";
import { keyframes } from "@mui/system";
import { Icon } from '@iconify/react';

// Animation keyframes
const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const NotFound: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        overflow: "hidden",
        px: 2,
        py: { xs: 8, md: 12 },
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
        position: "relative",
      }}
    >
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        {/* 404 Number */}
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "8rem", sm: "12rem", md: "15rem" },
            fontWeight: 900,
            color: "white",
            textShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
            mb: 2,
            animation: `${pulse} 3s ease-in-out infinite`,
            letterSpacing: "0.1em",
          }}
        >
          404
        </Typography>

        {/* Icon */}
        <Box
          sx={{
            mb: 3,
            animation: `${float} 3s ease-in-out infinite`,
          }}
        >
          <Icon
            icon="mdi:magnify"
            width={64}
            height={64}
            color="white"
            style={{ opacity: 0.9 }}
          />
        </Box>

        {/* Main message */}
        <Typography
          variant="h4"
          sx={{
            color: "white",
            fontWeight: 700,
            mb: 2,
            textShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
            fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
          }}
        >
          Page Not Found
        </Typography>

        {/* Subtitle */}
        <Typography
          variant="h6"
          sx={{
            color: "rgba(255, 255, 255, 0.9)",
            mb: 5,
            maxWidth: "600px",
            mx: "auto",
            fontSize: { xs: "1rem", sm: "1.25rem" },
            fontWeight: 400,
          }}
        >
          The page you&apos;re looking for seems to have wandered off into the digital void.
          Let&apos;s get you back home!
        </Typography>

        {/* Buttons */}
        <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
          <Button
            variant="contained"
            component={Link}
            href="/"
            startIcon={<Icon icon="mdi:home" width={24} height={24} />}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: "1rem",
              fontWeight: 600,
              background: "white",
              color: "#667eea",
              textTransform: "none",
              borderRadius: "50px",
              boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
              transition: "all 0.3s ease",
              "&:hover": {
                background: "rgba(255, 255, 255, 0.95)",
                transform: "translateY(-3px)",
                boxShadow: "0 12px 30px rgba(0, 0, 0, 0.3)",
              },
            }}
          >
            Go Home
          </Button>

          <Button
            variant="outlined"
            component={Link}
            href="/projects"
            startIcon={<Icon icon="mdi:folder-open" width={24} height={24} />}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: "1rem",
              fontWeight: 600,
              color: "white",
              borderColor: "rgba(255,255,255,0.5)",
              textTransform: "none",
              borderRadius: "50px",
              transition: "all 0.3s ease",
              "&:hover": {
                borderColor: "white",
                background: "rgba(255, 255, 255, 0.1)",
                transform: "translateY(-3px)",
                boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
              },
            }}
          >
            View Projects
          </Button>
        </Box>

        {/* Error code */}
        <Typography
          variant="caption"
          sx={{
            color: "rgba(255, 255, 255, 0.6)",
            mt: 6,
            display: "block",
            fontSize: "0.875rem",
          }}
        >
          Error Code: 404 | Page Not Found
        </Typography>
      </Container>
    </Box>
  );
};

export default NotFound;