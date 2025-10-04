import { useAtom } from "jotai";
import { useEffect } from "react";
import { type Mood, moodAtom } from "../state/moodAtom";

const PALETTES: Record<Mood, Record<string, string>> = {
  neutral: {
    "brand-50": "#f8fafc",
    "brand-100": "#f1f5f9",
    "brand-200": "#e2e8f0",
    "brand-300": "#cbd5e1",
    "brand-400": "#94a3b8",
    "brand-500": "#64748b",
    "brand-600": "#475569",
    "brand-700": "#334155",
    "brand-800": "#1e293b",
    "brand-900": "#0f172a",
  },
  happy: {
    "brand-50": "#fefce8",
    "brand-100": "#fef9c3",
    "brand-200": "#fef08a",
    "brand-300": "#fde047",
    "brand-400": "#facc15",
    "brand-500": "#eab308",
    "brand-600": "#ca8a04",
    "brand-700": "#a16207",
    "brand-800": "#854d0e",
    "brand-900": "#713f12",
  },
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
  },
  sad: {
    "brand-50": "#f9fafb",
    "brand-100": "#f3f4f6",
    "brand-200": "#e5e7eb",
    "brand-300": "#d1d5db",
    "brand-400": "#9ca3af",
    "brand-500": "#6b7280",
    "brand-600": "#4b5563",
    "brand-700": "#374151",
    "brand-800": "#1f2937",
    "brand-900": "#111827",
  },
};

export default function MoodSync() {
  const [mood] = useAtom(moodAtom);

  useEffect(() => {
    const palette = PALETTES[mood] ?? PALETTES.neutral;

    // Update CSS custom properties
    for (const [key, value] of Object.entries(palette)) {
      document.documentElement.style.setProperty(`--${key}`, value);
    }

    // Persist mood to sessionStorage
    try {
      sessionStorage.setItem("mood", mood);
    } catch (error) {
      console.warn("Failed to save mood to sessionStorage:", error);
    }
  }, [mood]);

  // Load mood from sessionStorage on mount
  useEffect(() => {
    try {
      const savedMood = sessionStorage.getItem("mood");
      if (savedMood && savedMood in PALETTES) {
        // This will trigger the palette update through the mood atom
        const palette = PALETTES[savedMood as Mood];
        for (const [key, value] of Object.entries(palette)) {
          document.documentElement.style.setProperty(`--${key}`, value);
        }
      }
    } catch (error) {
      console.warn("Failed to load mood from sessionStorage:", error);
    }
  }, []);

  return null;
}
