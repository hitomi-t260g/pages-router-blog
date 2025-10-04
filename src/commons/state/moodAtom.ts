import { atom } from "jotai";

export type Mood = "neutral" | "happy" | "calm" | "energetic" | "sad";

export const moodAtom = atom<Mood>("neutral");
