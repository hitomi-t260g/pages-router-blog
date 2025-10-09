import {
  Box,
  Flex,
  Skeleton,
  SkeletonText,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { getBlogPosts } from "../../../infra/contentful/repository";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import type { BlogData } from "../types/BlogData";
import BlogCard from "./BlogCard";

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
            width={{ base: "91.666667%", md: "66.666667%", lg: "50%" }}
            mx="auto"
            ref={index === allPosts.length - 1 ? lastElementRef : null}
          >
            <BlogCard post={post} />
          </Box>
        ))}

        {/* ローディング表示（Skeleton） */}
        {loading &&
          hasMore &&
          ["skeleton-1", "skeleton-2", "skeleton-3"].map((key) => (
            <Box
              key={`skeleton-loading-${key}`}
              width={{ base: "91.666667%", md: "66.666667%", lg: "50%" }}
              bg="rgba(255,255,255,0.9)"
              backdropFilter="blur(10px)"
              p={6}
              borderRadius="2xl"
              boxShadow="xl"
            >
              <Flex>
                <Skeleton
                  flexShrink={0}
                  w="128px"
                  h="128px"
                  borderRadius="xl"
                  mr={4}
                />
                <Box flex={1}>
                  <SkeletonText noOfLines={1} mb={2} height={6} />
                  <SkeletonText noOfLines={1} mb={2} height={4} width="60%" />
                  <SkeletonText noOfLines={2} height={3} />
                </Box>
              </Flex>
            </Box>
          ))}

        {/* 終了メッセージ */}
        {!hasMore && allPosts.length > 0 && (
          <Box textAlign="center" py={4}>
            <Text
              color="rgba(255,255,255,0.7)"
              textShadow="0 1px 4px rgba(0,0,0,0.5)"
            >
              すべての記事を表示しました🙌
            </Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
}
