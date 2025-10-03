import type { Document } from "@contentful/rich-text-types";
import type { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
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
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      {/* パンくずナビゲーション */}
      <nav style={{ marginBottom: "2rem", fontSize: "0.9em" }}>
        <Link href="/" style={{ color: "#0066cc", textDecoration: "none" }}>
          Home
        </Link>
        <span style={{ margin: "0 0.5rem", color: "#666" }}>/</span>
        <Link href="/blog" style={{ color: "#0066cc", textDecoration: "none" }}>
          Blog
        </Link>
        <span style={{ margin: "0 0.5rem", color: "#666" }}>/</span>
        <span style={{ color: "#666" }}>{post.title}</span>
      </nav>

      <article>
        {/* カバー画像 */}
        {post.coverUrl && (
          <Image
            src={post.coverUrl}
            alt={post.title}
            width={800}
            height={400}
            style={{
              width: "100%",
              height: "400px",
              objectFit: "cover",
              borderRadius: "8px",
              marginBottom: "2rem",
            }}
            priority
          />
        )}

        {/* 記事タイトル */}
        <h1
          style={{
            fontSize: "2.5em",
            fontWeight: "bold",
            marginBottom: "1rem",
            lineHeight: "1.2",
          }}
        >
          {post.title}
        </h1>

        {/* メタデータ */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "2rem",
            padding: "1rem 0",
            borderBottom: "1px solid #eee",
            fontSize: "0.95em",
            color: "#666",
          }}
        >
          {post.authorName && (
            <span style={{ marginRight: "1rem" }}>
              <strong>By:</strong> {post.authorName}
            </span>
          )}
          {post.publishDate && (
            <span style={{ marginRight: "1rem" }}>
              <strong>Published:</strong>{" "}
              {new Date(post.publishDate).toLocaleDateString()}
            </span>
          )}
        </div>

        {/* タグ */}
        {post.tags && post.tags.length > 0 && (
          <div style={{ marginBottom: "2rem" }}>
            {post.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  display: "inline-block",
                  backgroundColor: "#f0f0f0",
                  color: "#666",
                  padding: "0.3rem 0.8rem",
                  borderRadius: "20px",
                  fontSize: "0.85em",
                  marginRight: "0.5rem",
                  marginBottom: "0.5rem",
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* 概要 */}
        {post.excerpt && (
          <div
            style={{
              fontSize: "1.1em",
              fontStyle: "italic",
              color: "#555",
              marginBottom: "2rem",
              padding: "1rem",
              backgroundColor: "#f9f9f9",
              borderLeft: "4px solid #0066cc",
              borderRadius: "4px",
            }}
          >
            {post.excerpt}
          </div>
        )}

        {/* 記事本文（Rich Text） */}
        <div
          style={{
            lineHeight: "1.8",
            fontSize: "1.1em",
            color: "#333",
          }}
        >
          {post.body ? (
            <RichTextRenderer document={post.body as Document} />
          ) : (
            <p>記事の本文がありません。</p>
          )}
        </div>
      </article>

      {/* フッター */}
      <footer
        style={{
          marginTop: "3rem",
          paddingTop: "2rem",
          borderTop: "1px solid #eee",
          textAlign: "center",
        }}
      >
        <Link
          href="/blog"
          style={{
            color: "#0066cc",
            textDecoration: "none",
            fontSize: "1.1em",
          }}
        >
          ← ブログ一覧に戻る
        </Link>
      </footer>
    </div>
  );
}
