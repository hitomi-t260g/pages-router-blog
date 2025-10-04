import { Button, HStack, Text, VStack } from "@chakra-ui/react";
import { useAtom } from "jotai";
import { type Mood, moodAtom } from "../../../commons/state/moodAtom";

const MOODS: { key: Mood; label: string; emoji: string }[] = [
  { key: "neutral", label: "普通", emoji: "😐" },
  { key: "happy", label: "嬉しい", emoji: "😊" },
  { key: "calm", label: "穏やか", emoji: "😌" },
  { key: "energetic", label: "元気", emoji: "🚀" },
  { key: "sad", label: "悲しい", emoji: "😢" },
];

export default function MoodSelector() {
  const [mood, setMood] = useAtom(moodAtom);

  return (
    <VStack gap={4} alignItems="flex-start">
      <Text fontSize="lg" fontWeight="semibold">
        今日の気分は？
      </Text>
      <HStack gap={3} flexWrap="wrap">
        {MOODS.map((m) => (
          <Button
            key={m.key}
            onClick={() => setMood(m.key)}
            variant={mood === m.key ? "solid" : "outline"}
            colorPalette={mood === m.key ? "brand" : "gray"}
            size="md"
          >
            <Text fontSize="xl" mr={2}>
              {m.emoji}
            </Text>
            {m.label}
          </Button>
        ))}
      </HStack>
    </VStack>
  );
}
