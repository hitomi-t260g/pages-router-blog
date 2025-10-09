import { Box, Button, HStack, Text, VStack } from "@chakra-ui/react";
import { useAtom } from "jotai";
import { Annoyed, Smile } from "lucide-react";
import { type Mood, moodAtom } from "@/commons/state/moodAtom";

const MOODS: { key: Mood; label: string; }[] = [
  { key: "calm", label: "穏やか" },
  { key: "energetic", label: "元気" },
];

export default function MoodSelector() {
  const [mood, setMood] = useAtom(moodAtom);

  return (
    <Box
      p={4}
      bg="var(--background-secondary, #f8f9fa)"
      borderRadius="xl"
      border="2px solid"
      borderColor="blackAlpha.700"
      transition="all 0.3s ease"
    >
      <VStack gap={4} alignItems="center">
        <Text fontSize="lg" fontWeight="semibold" color="blackAlpha.700">
          今日の気分は？
        </Text>
        <HStack gap={2} flexWrap="wrap">
          {MOODS.map((m) => (
            <Button
              key={m.key}
              onClick={() => setMood(m.key)}
              variant={mood === m.key ? "solid" : "outline"}
              colorPalette="gray"
              size="md"
            >
              {m.key === "calm" ? <Annoyed /> : <Smile />}
              {m.label}
            </Button>
          ))}
        </HStack>
      </VStack>
    </Box>
  );
}
