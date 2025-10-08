import { Box, Heading, HStack, Image, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";
import type { BlogData } from "../types/BlogData";

interface BlogCardProps {
  post: BlogData;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Box
      bg="rgba(255, 255, 255, 0.9)"
      backdropFilter="blur(10px)"
      borderRadius="xl"
      overflow="hidden"
      boxShadow="0 8px 32px rgba(0, 0, 0, 0.15)"
      transition="all 0.3s ease"
      _hover={{
        transform: "translateY(-8px)",
        boxShadow: "0 16px 48px rgba(0, 0, 0, 0.2)",
        bg: "rgba(255, 255, 255, 0.95)",
      }}
      border="1px solid rgba(255, 255, 255, 0.2)"
    >
      <Link href={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
        <VStack alignItems="stretch" gap={0}>
          {/* Cover Image */}
          <Box position="relative" overflow="hidden">
            {post.coverUrl ? (
              <Image
                src={post.coverUrl}
                alt={post.title}
                w="full"
                h="240px"
                objectFit="cover"
                transition="transform 0.3s ease"
                _hover={{ transform: "scale(1.05)" }}
                onError={(e) => {
                  // 画像読み込み失敗時のフォールバック
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) {
                    fallback.style.display = 'flex';
                  }
                }}
              />
            ) : null}
            {/* フォールバック表示 */}
            <Box
              w="full"
              h="240px"
              bg="gray.100"
              display={post.coverUrl ? "none" : "flex"}
              alignItems="center"
              justifyContent="center"
              color="gray.500"
              fontSize="sm"
              fontWeight="medium"
            >
              画像なし
            </Box>
            {/* Gradient Overlay */}
            <Box
              position="absolute"
              bottom={0}
              left={0}
              right={0}
              height="60px"
              bgGradient="linear(to-t, rgba(0,0,0,0.6), transparent)"
            />
          </Box>

          {/* Content */}
          <VStack alignItems="stretch" p={6} gap={4}>
            <Heading
              as="h2"
              size="lg"
              color="brand.700"
              _hover={{ color: "brand.600" }}
              transition="color 0.2s ease"
              fontWeight="bold"
              lineHeight="shorter"
            >
              {post.title}
            </Heading>

            {post.excerpt && (
              <Text
                color="gray.700"
                fontSize="md"
                lineHeight="tall"
                css={{
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {post.excerpt}
              </Text>
            )}

            {/* Meta Information */}
            <HStack gap={4} fontSize="sm" color="gray.600" pt={2}>
              {post.authorName && (
                <Text fontWeight="medium">By {post.authorName}</Text>
              )}
              {post.publishDate && (
                <>
                  {post.authorName && <Text>•</Text>}
                  <Text>
                    {new Date(post.publishDate).toLocaleDateString("ja-JP", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Text>
                </>
              )}
            </HStack>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <HStack gap={2} flexWrap="wrap" pt={2}>
                {post.tags.map((tag) => (
                  <Box
                    key={tag}
                    px={3}
                    py={1}
                    bg="brand.100"
                    color="brand.700"
                    fontSize="xs"
                    borderRadius="full"
                    fontWeight="medium"
                    border="1px solid"
                    borderColor="brand.200"
                    transition="all 0.2s ease"
                    _hover={{
                      bg: "brand.200",
                      borderColor: "brand.300",
                    }}
                  >
                    #{tag}
                  </Box>
                ))}
              </HStack>
            )}
          </VStack>
        </VStack>
      </Link>
    </Box>
  );
}
