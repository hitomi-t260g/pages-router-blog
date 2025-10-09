import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { type Mood, moodAtom } from "../state/moodAtom";

const PALETTES: Record<Mood, Record<string, string>> = {
  calm: {
    "brand-50": "#f0f9ff",
    "brand-100": "#e0f2fe",
    "brand-200": "#bae6fd",
    "brand-300": "#7dd3fc",
    "brand-400": "#38bdf8",
    "brand-500": "#0ea5e9",
    "brand-600": "#0284c7",
    "brand-700": "#0369a1",
    "brand-800": "#075985",
    "brand-900": "#0c4a6e",
    "bg-primary": "#f0f9ff",
    "bg-secondary": "#e0f2fe",
    "heading-color": "#0369a1",
  },
  energetic: {
    "brand-50": "#fef2f2",
    "brand-100": "#fee2e2",
    "brand-200": "#fecaca",
    "brand-300": "#fca5a5",
    "brand-400": "#f87171",
    "brand-500": "#ef4444",
    "brand-600": "#dc2626",
    "brand-700": "#b91c1c",
    "brand-800": "#991b1b",
    "brand-900": "#7f1d1d",
    "bg-primary": "#fef2f2",
    "bg-secondary": "#fee2e2",
    "heading-color": "#991b1b",
  },
};

export default function MoodSync() {
  const [mood, setMood] = useAtom(moodAtom);
  const [isInitialized, setIsInitialized] = useState(false);

  // Update CSS variables whenever mood changes
  useEffect(() => {
    const palette = PALETTES[mood] ?? PALETTES.calm;

    // Update CSS custom properties
    for (const [key, value] of Object.entries(palette)) {
      document.documentElement.style.setProperty(`--${key}`, value);
    }

    // Persist mood to sessionStorage (only after initialization)
    if (isInitialized) {
      try {
        sessionStorage.setItem("mood", mood);
      } catch (error) {
        console.warn("Failed to save mood to sessionStorage:", error);
      }
    }
  }, [mood, isInitialized]);

  // Load mood from sessionStorage on mount (client-side only)
  useEffect(() => {
    try {
      const savedMood = sessionStorage.getItem("mood");

      if (savedMood && savedMood in PALETTES) {
        setMood(savedMood as Mood);
      }
    } catch (error) {
      console.warn("Failed to load mood from sessionStorage:", error);
    } finally {
      setIsInitialized(true);
    }
  }, [setMood]);

  return null;
}
