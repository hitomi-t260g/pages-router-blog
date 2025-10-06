import {
  Box,
  Container,
  Heading,
  HStack,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import type { GetStaticProps } from "next";
import Link from "next/link";
import type { BlogEntity } from "@/infra/entities/Blog";
import type { BlogData } from "../../features/blog/types/BlogData";
import { mapEntryToBlogData } from "../../features/blog/utils/getBlogData";
import { contentfulClient } from "../../infra/contentful/client";

type Props = {
  posts: BlogData[];
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  try {
    const res = await contentfulClient.getEntries({
      content_type: "blogPost",
      order: ["-fields.publishDate"],
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

export default function BlogIndex({ posts }: Props) {
  return (
    <Box
      minH="100vh"
      bg="var(--background, #ffffff)"
      transition="background-color 0.3s ease"
    >
      <Container maxW="4xl" py={8}>
        <VStack gap={8} alignItems="stretch">
          <Heading as="h1" size="3xl" color="brand.600" textAlign="center">
            Blog
          </Heading>

          {posts.length === 0 ? (
            <Text textAlign="center" color="gray.600" fontSize="lg">
              No blog posts found.
            </Text>
          ) : (
            <VStack gap={6} alignItems="stretch">
              {posts.map((post) => (
                <Box
                  key={post.id}
                  p={6}
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="lg"
                  _hover={{
                    borderColor: "brand.300",
                    shadow: "md",
                    transform: "translateY(-2px)",
                    bg: "var(--background-secondary, #f8f9fa)",
                  }}
                  transition="all 0.2s"
                >
                  <Link
                    href={`/blog/${post.slug}`}
                    style={{ textDecoration: "none" }}
                  >
                    <VStack alignItems="stretch" gap={4}>
                      {post.coverUrl && (
                        <Image
                          src={post.coverUrl}
                          alt={post.title}
                          borderRadius="md"
                          w="full"
                          h="200px"
                          objectFit="cover"
                        />
                      )}
                      <Heading
                        as="h2"
                        size="lg"
                        color="brand.600"
                        _hover={{ color: "brand.700" }}
                      >
                        {post.title}
                      </Heading>
                      {post.excerpt && (
                        <Text
                          color="gray.600"
                          fontSize="md"
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
                      <HStack gap={4} fontSize="sm" color="gray.500">
                        {post.authorName && <Text>By {post.authorName}</Text>}
                        {post.publishDate && (
                          <Text>
                            {new Date(post.publishDate).toLocaleDateString()}
                          </Text>
                        )}
                      </HStack>
                      {post.tags && post.tags.length > 0 && (
                        <HStack gap={2} flexWrap="wrap">
                          {post.tags.map((tag) => (
                            <Box
                              key={tag}
                              px={3}
                              py={1}
                              bg="brand.100"
                              color="brand.700"
                              fontSize="sm"
                              borderRadius="full"
                              fontWeight="medium"
                            >
                              {tag}
                            </Box>
                          ))}
                        </HStack>
                      )}
                    </VStack>
                  </Link>
                </Box>
              ))}
            </VStack>
          )}
        </VStack>
      </Container>
    </Box>
  );
}
