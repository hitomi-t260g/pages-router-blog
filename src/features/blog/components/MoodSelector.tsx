import { type Mood, moodAtom } from "@/commons/state/moodAtom";
import { useAtom } from "jotai";
import { Box, Button, HStack, Text, VStack } from "@chakra-ui/react";
import { Annoyed, Smile } from "lucide-react";

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
              colorPalette={mood === m.key ? "brand" : "brand"}
              color={mood === m.key ? undefined : "brand.700"}
              size="md"
              _hover={{
                transform: "translateY(-1px)",
                shadow: "md",
                color: "#E4E4E7",
              }}
              transition="all 0.2s"
            >
              {m.key === "calm" ? <Annoyed/> : <Smile/>}
              {m.label}
            </Button>
          ))}
        </HStack>
      </VStack>
    </Box>
  );
}
