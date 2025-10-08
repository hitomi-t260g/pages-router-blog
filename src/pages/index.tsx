import { Box, Heading } from "@chakra-ui/react";
import type { GetStaticProps } from "next";
import Head from "next/head";
import Header from "../commons/layout/Header";
import Sidebar from "../commons/layout/Sidebar";
import sidebarStyles from "../components/layout/Sidebar.module.css";
import BlogList from "../features/blog/components/BlogList";
import VideoBackground from "../features/blog/components/VideoBackground";
import type { BlogData } from "../features/blog/types/BlogData";
import { getBlogPosts } from "../infra/contentful/repository";

type Props = {
  posts: BlogData[];
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  try {
    const response = await getBlogPosts({
      limit: 20,
      order: "-fields.publishDate",
    });
    return {
      props: { posts: response.items },
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

export default function Home({ posts }: Props) {
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

      <Box position="relative" h="100vh" w="100%">
        {/* ヘッダー (モバイルのみ表示) */}
        <Header />

        {/* サイドバー (デスクトップのみ表示) */}
        <Sidebar />

        {/* メインコンテンツ */}
        <Box
          className={sidebarStyles.mainContent}
          position="relative"
          h="100vh"
          overflow="hidden"
          display="flex"
          flexDirection="column"
        >
          {/* 背景動画 */}
          <VideoBackground />

          {/* Blog タイトル */}
          <Box
            as="header"
            textAlign="center"
            py={8}
            position="relative"
            zIndex={1}
            flexShrink={0}
          >
            <Heading
              as="h1"
              fontSize="6xl"
              fontFamily="serif"
              color="white"
              textShadow="0 4px 8px rgba(0,0,0,0.7)"
              lineHeight="1.2"
            >
              Blog
            </Heading>
          </Box>

          {/* ブログ一覧スクロール領域 */}
          <Box position="relative" zIndex={1} flex={1} overflow="auto">
            <BlogList initialPosts={posts} />
          </Box>
        </Box>
      </Box>
    </>
  );
}
