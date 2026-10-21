
"use client";

import { useEffect } from "react";
import { initializeFirebaseAnalytics } from "@/utils/firebase";

export default function AnalyticsProvider() {
  useEffect(() => {
    void initializeFirebaseAnalytics();
  }, []);

  return null;
}
