import { IconButton } from "@chakra-ui/react";
import { useAtom } from "jotai";
import { type Mood, moodAtom } from "../../../commons/state/moodAtom";
import { Smile, Annoyed } from "lucide-react";

const MOOD_ICONS: Record<Mood, React.ReactNode> = {
  calm: <Annoyed/>,
  energetic: <Smile/>,
};

export default function MoodIconButton() {
  const [mood, setMood] = useAtom(moodAtom);

  const toggleMood = () => {
    setMood(mood === "calm" ? "energetic" : "calm");
  };

  return (
    <IconButton
      aria-label="気分を切り替え"
      onClick={toggleMood}
      variant="ghost"
      color="white"
      fontSize="2xl"
      _hover={{
        bg: "rgba(255,255,255,0.1)",
        transform: "scale(1.1)",
      }}
      transition="all 0.2s ease"
    >
      {MOOD_ICONS[mood]}
    </IconButton>
  );
}
