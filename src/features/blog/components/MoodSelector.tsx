import { Box, Button, HStack, Text, VStack } from "@chakra-ui/react";
import { useAtom } from "jotai";
import { type Mood, moodAtom } from "../../../commons/state/moodAtom";

const MOODS: { key: Mood; label: string; emoji: string }[] = [
  { key: "calm", label: "穏やか", emoji: "😌" },
  { key: "energetic", label: "元気", emoji: "🚀" },
];

export default function MoodSelector() {
  const [mood, setMood] = useAtom(moodAtom);

  return (
    <Box
      p={6}
      bg="var(--background-secondary, #f8f9fa)"
      borderRadius="xl"
      border="2px solid"
      borderColor="brand.200"
      transition="all 0.3s ease"
    >
      <VStack gap={4} alignItems="flex-start">
        <Text fontSize="lg" fontWeight="semibold" color="brand.700">
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
              _hover={{
                transform: "translateY(-1px)",
                shadow: "md",
              }}
              transition="all 0.2s"
            >
              <Text fontSize="xl" mr={2}>
                {m.emoji}
              </Text>
              {m.label}
            </Button>
          ))}
        </HStack>
      </VStack>
    </Box>
  );
}
