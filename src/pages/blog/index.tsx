import type { GetStaticProps } from "next";
import Image from "next/image";
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
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Blog</h1>
      {posts.length === 0 ? (
        <p>No blog posts found.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {posts.map((post) => (
            <li
              key={post.id}
              style={{
                marginBottom: "2rem",
                padding: "1rem",
                border: "1px solid #eee",
                borderRadius: "8px",
              }}
            >
              <Link
                href={`/blog/${post.slug}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <article>
                  {post.coverUrl && (
                    <Image
                      src={post.coverUrl}
                      alt={post.title}
                      width={800}
                      height={200}
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                        borderRadius: "4px",
                        marginBottom: "1rem",
                      }}
                    />
                  )}
                  <h2 style={{ marginBottom: "0.5rem", color: "#0066cc" }}>
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p style={{ color: "#666", marginBottom: "0.5rem" }}>
                      {post.excerpt}
                    </p>
                  )}
                  <div style={{ fontSize: "0.9em", color: "#888" }}>
                    {post.authorName && <span>By {post.authorName}</span>}
                    {post.publishDate && post.authorName && <span> • </span>}
                    {post.publishDate && (
                      <span>
                        {new Date(post.publishDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  {post.tags && post.tags.length > 0 && (
                    <div style={{ marginTop: "0.5rem" }}>
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            display: "inline-block",
                            backgroundColor: "#f0f0f0",
                            color: "#666",
                            padding: "0.2rem 0.5rem",
                            borderRadius: "4px",
                            fontSize: "0.8em",
                            marginRight: "0.5rem",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
