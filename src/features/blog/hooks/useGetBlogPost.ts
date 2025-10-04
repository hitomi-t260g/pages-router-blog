import { useCallback, useEffect, useState } from "react";
import { contentfulClient } from "../../../infra/contentful/client";
import type { BlogEntity } from "../../../infra/entities/Blog";
import type { BlogData } from "../types/BlogData";
import { mapEntryToBlogData } from "../utils/getBlogData";
import type { UseGetBlogPostOptions, UseGetBlogPostReturn } from "./types";

/**
 * Custom hook for fetching a single blog post from Contentful by slug
 *
 * @param options Configuration options for the blog post query
 * @returns Object containing post data, loading state, error state, and refetch function
 *
 * @example
 * ```tsx
 * function BlogPostPage({ slug }: { slug: string }) {
 *   const { post, loading, error, refetch } = useGetBlogPost({ slug });
 *
 *   if (loading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error}</div>;
 *   if (!post) return <div>Post not found</div>;
 *
 *   return (
 *     <article>
 *       <h1>{post.title}</h1>
 *       <p>{post.excerpt}</p>
 *       {post.body && <div>{post.body}</div>}
 *       <button onClick={refetch}>Refresh</button>
 *     </article>
 *   );
 * }
 * ```
 */
export function useGetBlogPost(
  options: UseGetBlogPostOptions,
): UseGetBlogPostReturn {
  const { slug, include = 10, enabled = true, refetchOnMount = true } = options;

  const [post, setPost] = useState<BlogData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogPost = useCallback(async () => {
    if (!enabled || !slug) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch specific blog post by slug
      const response = await contentfulClient.getEntries({
        content_type: "blogPost",
        "fields.slug": slug,
        limit: 1,
        include: Math.min(Math.max(0, include), 10) as
          | 0
          | 1
          | 2
          | 3
          | 4
          | 5
          | 6
          | 7
          | 8
          | 9
          | 10,
      });

      if (response.items.length === 0) {
        setError("Post not found");
        setPost(null);
      } else {
        // Transform data using existing mapper
        const transformedPost = mapEntryToBlogData(
          response.items[0] as unknown as BlogEntity,
        );
        setPost(transformedPost);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch blog post";
      setError(errorMessage);
      setPost(null);
      console.error("useGetBlogPost error:", err);
    } finally {
      setLoading(false);
    }
  }, [enabled, slug, include]);

  const refetch = useCallback(() => {
    fetchBlogPost();
  }, [fetchBlogPost]);

  // Initial fetch on mount or when dependencies change
  useEffect(() => {
    if (refetchOnMount) {
      fetchBlogPost();
    }
  }, [fetchBlogPost, refetchOnMount]);

  // Reset state when slug changes
  useEffect(() => {
    if (slug) {
      setPost(null);
      setError(null);
      if (enabled && refetchOnMount) {
        setLoading(true);
      }
    }
  }, [slug, enabled, refetchOnMount]);

  return {
    post,
    loading,
    error,
    refetch,
  };
}
