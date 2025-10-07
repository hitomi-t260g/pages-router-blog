import { Box, Heading } from "@chakra-ui/react";
import type { GetStaticProps } from "next";
import Head from "next/head";
import type { BlogData } from "../features/blog/types/BlogData";
import { getBlogPosts } from "../infra/contentful/repository";
import VideoBackground from "../features/blog/components/VideoBackground";
import BlogList from "../features/blog/components/BlogList";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import sidebarStyles from "../components/layout/Sidebar.module.css";

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
        {/* 背景動画 */}
        <VideoBackground />

        {/* ヘッダー (モバイルのみ表示) */}
        <Header />

        {/* サイドバー (デスクトップのみ表示) */}
        <Sidebar />

        {/* メインコンテンツ */}
        <Box className={sidebarStyles.mainContent}>
          {/* Blog タイトル */}
          <Box as="header" textAlign="center" py={8} mb={4}>
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

          <BlogList initialPosts={posts} />
        </Box>
      </Box>
    </>
  );
}
