"use client"
import ParticleBackground from "@/components/ui/ParticleBackground";
import { theme } from "@/styles/theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import Lenis from "lenis";
import { useEffect } from "react";


function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2, // adjust scroll speed
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        style={{ position: "relative" }}
      >
        <ParticleBackground />
        <ThemeProvider theme={theme}>
          <CssBaseline />
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
