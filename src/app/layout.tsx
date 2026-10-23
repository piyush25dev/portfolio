"use client"
import AnalyticsProvider from "@/components/Home/AnalyticsProvider";
import ParticleBackground from "@/components/ui/ParticleBackground";
import { theme } from "@/styles/theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import Lenis from "lenis";
import { useEffect } from "react";


function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) =>
        Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    let rafId = 0;

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
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
      <body style={{ margin: 0 }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />

          {/* Fixed background layer */}
          <ParticleBackground />

          {/* Foreground content */}
          <div style={{ position: "relative", zIndex: 1 }}>
            <SmoothScrollProvider>
              <AnalyticsProvider />
              {children}
            </SmoothScrollProvider>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
