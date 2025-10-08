import { useCallback, useEffect, useState } from "react";
import { getBlogPost } from "../../../infra/contentful/repository";
import type { BlogData } from "../types/BlogData";
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
  const { slug, enabled = true, refetchOnMount = true } = options;

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

      // Fetch specific blog post by slug using repository
      const post = await getBlogPost(slug);

      if (!post) {
        setError("Post not found");
        setPost(null);
      } else {
        setPost(post);
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
  }, [enabled, slug]);

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
