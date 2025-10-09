import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import MoodSelector from "../../features/blog/components/MoodSelector";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
  const [currentYear, setCurrentYear] = useState<string>("");

  useEffect(() => {
    setCurrentYear(new Date().toLocaleDateString("ja-JP", { year: "numeric" }));
  }, []);

  return (
    <Box
      className={styles.sidebar}
      position="fixed"
      left={0}
      top={0}
      h="100vh"
      w="300px"
      bg="rgba(255,255,255,0.95)"
      backdropFilter="blur(10px)"
      borderRight="1px solid rgba(255,255,255,0.2)"
      boxShadow="lg"
      zIndex={1000}
      overflow="auto"
    >
      <VStack gap={6} p={6} alignItems="stretch" h="full">
        {/* ヘッダー */}
        <Box textAlign="center" py={4}>
          <Heading
            as="h1"
            fontSize="2xl"
            fontFamily="serif"
            color="var(--heading-color)"
            mb={2}
          >
            My Blog
          </Heading>
          <Text fontSize="sm" color="blackAlpha.800">
            気分に合わせたブログ体験
          </Text>
        </Box>

        {/* ムードセレクター */}
        <Box>
          <MoodSelector />
        </Box>

        {/* 将来の拡張用スペース */}
        <Box flex={1}>{/* ここに追加のナビゲーションや設定を配置可能 */}</Box>

        {/* フッター情報 */}
        <Box
          textAlign="center"
          py={4}
          borderTop="1px solid"
          borderColor="gray.200"
        >
          <Text fontSize="xs" color="gray.500">
            © {currentYear || "2024"} My Blog
          </Text>
        </Box>
      </VStack>
    </Box>
  );
}
