import { atom } from "jotai";

export type Mood = "calm" | "energetic";

export const moodAtom = atom<Mood>("calm");
