import { Box, Flex, Heading, Image, Text, VStack } from "@chakra-ui/react";
import type { GetStaticProps } from "next";
import { useState, useEffect, useCallback } from "react";
import type { BlogEntity } from "@/infra/entities/Blog";
import type { BlogData } from "../../features/blog/types/BlogData";
import { mapEntryToBlogData } from "../../features/blog/utils/getBlogData";
import { contentfulClient } from "../../infra/contentful/client";
import VideoBackground from "../../features/blog/components/VideoBackground";

type Props = {
  posts: BlogData[];
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  try {
    const res = await contentfulClient.getEntries({
      content_type: "blogPost",
      order: ["-fields.publishDate"],
      limit: 20,
    });
    const posts = res.items.map((item) =>
      mapEntryToBlogData(item as unknown as BlogEntity),
    );
    return {
      props: { posts },
      revalidate: 60,
    };
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return {
      props: { posts: [] },
      revalidate: 60,
    };
  }
};

export default function BlogIndex({ posts: initialPosts }: Props) {
  const [allPosts, setAllPosts] = useState<BlogData[]>(initialPosts);
  const [skip, setSkip] = useState(20);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialPosts.length === 20);

  // Contentfulから追加データをロード
  const loadMorePosts = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const response = await contentfulClient.getEntries({
        content_type: "blogPost",
        order: ["-fields.publishDate"],
        limit: 10,
        skip,
      });

      const newPosts = response.items.map((item) =>
        mapEntryToBlogData(item as unknown as BlogEntity),
      );

      if (newPosts.length > 0) {
        setAllPosts((prev) => [...prev, ...newPosts]);
        setSkip((prev) => prev + 10);
        setHasMore(newPosts.length === 10);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to load more posts:", error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, skip]);

  // スクロールで次ページをロード
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 200 >=
        document.documentElement.scrollHeight
      ) {
        loadMorePosts();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMorePosts]);

  return (
    <Box position="relative" h="100vh" w="100%">
      {/* 背景動画 */}
      <VideoBackground />

      {/* Blog タイトル */}
      <Box as="header" textAlign="center" py={8}>
        <Heading
          as="h1"
          fontSize="6xl"
          fontFamily="serif"
          color="white"
          textShadow="0 4px 8px rgba(0,0,0,0.7)"
        >
          Blog
        </Heading>
      </Box>

      {/* Blog カード一覧 */}
      <Box as="main">
        <VStack gap={8} pb={20} align="center">
          {allPosts.map((post) => (
            <Box
              key={post.id}
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
    </Box>
  );
}
