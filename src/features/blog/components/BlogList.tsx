import { Box, Flex, Heading, Image, Text, VStack } from "@chakra-ui/react";
import { useState, useCallback } from "react";
import type { BlogData } from "../types/BlogData";
import { getBlogPosts } from "../../../infra/contentful/repository";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";

interface BlogListProps {
  initialPosts: BlogData[];
}

export default function BlogList({ initialPosts }: BlogListProps) {
  const [allPosts, setAllPosts] = useState<BlogData[]>(initialPosts);
  const [skip, setSkip] = useState(20);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialPosts.length === 20);

  // Contentfulから追加データをロード
  const loadMorePosts = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const response = await getBlogPosts({
        limit: 10,
        skip,
        order: "-fields.publishDate",
      });

      if (response.items.length > 0) {
        setAllPosts((prev) => [...prev, ...response.items]);
        setSkip((prev) => prev + 10);
        setHasMore(response.items.length === 10);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to load more posts:", error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, skip]);

  // 無限スクロールフック
  const { lastElementRef } = useInfiniteScroll({
    onLoadMore: loadMorePosts,
    hasMore,
    loading,
  });

  return (
    <Box as="main">
      <VStack gap={8} pb={20} align="center">
        {allPosts.map((post, index) => (
          <Box
            key={post.id}
            ref={index === allPosts.length - 1 ? lastElementRef : null}
            bg="rgba(255,255,255,0.9)"
            backdropFilter="blur(10px)"
            w={{ base: "91.666667%", md: "66.666667%", lg: "50%" }}
            p={6}
            borderRadius="2xl"
            boxShadow="xl"
          >
            <Flex>
              <Box
                flexShrink={0}
                w="128px"
                h="128px"
                bg="gray.200"
                borderRadius="xl"
                overflow="hidden"
                mr={4}
              >
                {post.coverUrl ? (
                  <Image
                    src={post.coverUrl}
                    alt={post.title}
                    w="100%"
                    h="100%"
                    objectFit="cover"
                  />
                ) : (
                  <Box
                    w="100%"
                    h="100%"
                    bg="gray.300"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontSize="xs"
                    color="gray.600"
                  >
                    Image
                  </Box>
                )}
              </Box>
              <Box>
                <Heading as="h2" fontSize="xl" fontWeight="bold">
                  {post.title}
                </Heading>
                <Text fontSize="sm" color="gray.500">
                  {post.publishDate
                    ? new Date(post.publishDate).toLocaleDateString("ja-JP", {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric"
                      })
                    : "日付不明"
                  }
                </Text>
                <Text mt={2} color="gray.700">
                  {post.excerpt || "概要がありません"}
                </Text>
              </Box>
            </Flex>
          </Box>
        ))}

        {/* ローディング表示 */}
        {loading && (
          <Box textAlign="center" py={4}>
            <Text color="white" textShadow="0 1px 4px rgba(0,0,0,0.5)">
              読み込み中...
            </Text>
          </Box>
        )}

        {/* 終了メッセージ */}
        {!hasMore && allPosts.length > 0 && (
          <Box textAlign="center" py={4}>
            <Text color="rgba(255,255,255,0.7)" textShadow="0 1px 4px rgba(0,0,0,0.5)">
              すべての記事を表示しました🙌
            </Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
}
