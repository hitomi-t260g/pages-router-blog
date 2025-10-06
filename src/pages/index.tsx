import {
  Box,
  Container,
  Heading,
  Separator,
  Text,
  VStack,
} from "@chakra-ui/react";
import Head from "next/head";
import Link from "next/link";
import MoodSelector from "../features/blog/components/MoodSelector";

export default function Home() {
  return (
    <>
      <Head>
        <title>My Blog</title>
        <meta
          name="description"
          content="Personal blog with mood-based theming"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box
        minH="100vh"
        bg="var(--background, #ffffff)"
        transition="background-color 0.3s ease"
      >
        <Container maxW="6xl" py={8}>
          <VStack gap={8} alignItems="stretch">
            <Box textAlign="center">
              <Heading as="h1" size="4xl" mb={4} color="brand.600">
                My Blog
              </Heading>
              <Text fontSize="lg" color="gray.600">
                パーソナライズされたブログ体験へようこそ
              </Text>
            </Box>

            <Separator />

            <Box>
              <MoodSelector />
            </Box>

            <Separator />

            <Box>
              <Heading as="h2" size="2xl" mb={4} color="brand.600">
                最新記事
              </Heading>
              <Text mb={4}>
                気分に合わせてテーマが変わるブログをお楽しみください。
              </Text>
              <Link href="/blog">
                <Text
                  color="brand.500"
                  fontWeight="semibold"
                  _hover={{ color: "brand.600", textDecoration: "underline" }}
                  cursor="pointer"
                >
                  記事一覧へ →
                </Text>
              </Link>
            </Box>
          </VStack>
        </Container>
      </Box>
    </>
  );
}
