import {
  Box,
  Container,
  Heading,
  HStack,
  Image,
  Separator,
  Text,
  VStack,
} from "@chakra-ui/react";
import type { Document } from "@contentful/rich-text-types";
import type { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { RichTextRenderer } from "../../features/blog/components/RichTextRenderer";
import type { BlogData } from "../../features/blog/types/BlogData";
import { mapEntryToBlogData } from "../../features/blog/utils/getBlogData";
import { contentfulClient } from "../../infra/contentful/client";
import type { BlogEntity } from "../../infra/entities/Blog";

type Props = {
  post: BlogData;
};

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const res = await contentfulClient.getEntries({
      content_type: "blogPost",
      select: ["fields.slug"],
      include: 1, // Minimal include for paths generation
    });
    const paths = res.items.map((item) => ({
      params: { slug: (item as unknown as BlogEntity).fields.slug },
    }));
    return {
      paths,
      fallback: "blocking",
    };
  } catch (error) {
    console.error("Error fetching blog paths:", error);
    return {
      paths: [],
      fallback: "blocking",
    };
  }
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  try {
    const slug = params?.slug as string;
    const res = await contentfulClient.getEntries({
      content_type: "blogPost",
      "fields.slug": slug,
      limit: 1,
      include: 10, // Include linked assets and references
    });

    if (!res.items.length) {
      return { notFound: true };
    }

    const post = mapEntryToBlogData(res.items[0] as unknown as BlogEntity);
    return {
      props: { post },
      revalidate: 60,
    };
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return { notFound: true };
  }
};

export default function BlogPostPage({ post }: Props) {
  return (
    <Box
      minH="100vh"
      bg="var(--background, #ffffff)"
      transition="background-color 0.3s ease"
    >
      <Container maxW="4xl" py={8}>
        <VStack gap={8} alignItems="stretch">
          {/* パンくずナビゲーション */}
          <HStack gap={2} fontSize="sm" color="gray.600">
            <Link href="/">
              <Text color="brand.600" _hover={{ color: "brand.700" }}>
                Home
              </Text>
            </Link>
            <Text>/</Text>
            <Link href="/blog">
              <Text color="brand.600" _hover={{ color: "brand.700" }}>
                Blog
              </Text>
            </Link>
            <Text>/</Text>
            <Text>{post.title}</Text>
          </HStack>

          <Box as="article">
            <VStack gap={6} alignItems="stretch">
              {/* カバー画像 */}
              {post.coverUrl && (
                <Image
                  src={post.coverUrl}
                  alt={post.title}
                  borderRadius="lg"
                  w="full"
                  h="400px"
                  objectFit="cover"
                />
              )}

              {/* 記事タイトル */}
              <Heading
                as="h1"
                size="4xl"
                color="brand.700"
                textAlign="center"
                lineHeight="shorter"
              >
                {post.title}
              </Heading>

              {/* メタデータ */}
              <VStack gap={4}>
                <HStack gap={6} fontSize="md" color="gray.600" justify="center">
                  {post.authorName && (
                    <Text>
                      <Text as="span" fontWeight="semibold">
                        By:
                      </Text>{" "}
                      {post.authorName}
                    </Text>
                  )}
                  {post.publishDate && (
                    <Text>
                      <Text as="span" fontWeight="semibold">
                        Published:
                      </Text>{" "}
                      {new Date(post.publishDate).toLocaleDateString()}
                    </Text>
                  )}
                </HStack>
                <Separator />
              </VStack>

              {/* タグ */}
              {post.tags && post.tags.length > 0 && (
                <HStack gap={2} flexWrap="wrap" justify="center">
                  {post.tags.map((tag) => (
                    <Box
                      key={tag}
                      px={4}
                      py={2}
                      bg="brand.100"
                      color="brand.700"
                      fontSize="sm"
                      borderRadius="full"
                      fontWeight="medium"
                    >
                      #{tag}
                    </Box>
                  ))}
                </HStack>
              )}

              {/* 概要 */}
              {post.excerpt && (
                <Box
                  p={6}
                  bg="brand.50"
                  borderLeft="4px solid"
                  borderLeftColor="brand.500"
                  borderRadius="md"
                  fontStyle="italic"
                  fontSize="lg"
                  color="gray.700"
                >
                  {post.excerpt}
                </Box>
              )}

              {/* 記事本文（Rich Text） */}
              <Box
                fontSize="lg"
                lineHeight="tall"
                color="gray.800"
                css={{
                  "& h1, & h2, & h3": {
                    color: "var(--brand-600)",
                    fontWeight: "bold",
                    marginTop: "2rem",
                    marginBottom: "1rem",
                  },
                  "& a": {
                    color: "var(--brand-500)",
                    textDecoration: "underline",
                  },
                  "& a:hover": {
                    color: "var(--brand-600)",
                  },
                }}
              >
                {post.body ? (
                  <RichTextRenderer document={post.body as Document} />
                ) : (
                  <Text>記事の本文がありません。</Text>
                )}
              </Box>
            </VStack>
          </Box>

          {/* フッター */}
          <Box
            pt={8}
            borderTop="1px solid"
            borderTopColor="gray.200"
            textAlign="center"
          >
            <Link href="/blog">
              <Text
                color="brand.600"
                fontSize="lg"
                fontWeight="semibold"
                _hover={{ color: "brand.700", textDecoration: "underline" }}
              >
                ← ブログ一覧に戻る
              </Text>
            </Link>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
