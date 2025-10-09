import { Box, Flex, Heading, HStack } from "@chakra-ui/react";
import MoodIconButton from "../../features/blog/components/MoodIconButton";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <Box
      className={styles.header}
      position="fixed"
      top={0}
      left={0}
      right={0}
      h="60px"
      bg="rgba(0,0,0,0.8)"
      backdropFilter="blur(10px)"
      borderBottom="1px solid rgba(255,255,255,0.1)"
      zIndex={1000}
    >
      <Flex h="full" alignItems="center" justifyContent="space-between" px={4}>
        <Heading as="h1" fontSize="xl" fontFamily="serif" color="var(--heading-color)">
          My Blog
        </Heading>

        <HStack gap={2}>
          <MoodIconButton />
        </HStack>
      </Flex>
    </Box>
  );
}
