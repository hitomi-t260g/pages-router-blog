import { useCallback, useEffect, useState } from "react";
import { getBlogPosts } from "../../../infra/contentful/repository";
import type { BlogData } from "../types/BlogData";
import type { UseGetBlogOptions, UseGetBlogReturn } from "./types";

/**
 * Custom hook for fetching blog posts from Contentful
 *
 * @param options Configuration options for the blog query
 * @returns Object containing posts data, loading state, error state, and refetch function
 *
 * @example
 * ```tsx
 * function BlogList() {
 *   const { posts, loading, error, refetch } = useGetBlog({ limit: 5 });
 *
 *   if (loading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error}</div>;
 *
 *   return (
 *     <div>
 *       {posts.map(post => (
 *         <article key={post.id}>
 *           <h2>{post.title}</h2>
 *           <p>{post.excerpt}</p>
 *         </article>
 *       ))}
 *       <button onClick={refetch}>Refresh</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useGetBlog(options: UseGetBlogOptions = {}): UseGetBlogReturn {
  const {
    limit = 10,
    skip = 0,
    order = "-fields.publishDate",
    tags = [],
    enabled = true,
    refetchOnMount = true,
  } = options;

  const [posts, setPosts] = useState<BlogData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogPosts = useCallback(async () => {
    if (!enabled) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch data using repository
      const response = await getBlogPosts({
        limit,
        skip,
        order,
        tags,
      });

      setPosts(response.items);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch blog posts";
      setError(errorMessage);
      console.error("useGetBlog error:", err);
    } finally {
      setLoading(false);
    }
  }, [enabled, order, limit, skip, tags]);

  const refetch = useCallback(() => {
    fetchBlogPosts();
  }, [fetchBlogPosts]);

  // Initial fetch on mount or when dependencies change
  useEffect(() => {
    if (refetchOnMount) {
      fetchBlogPosts();
    }
  }, [fetchBlogPosts, refetchOnMount]);

  return {
    posts,
    loading,
    error,
    refetch,
  };
}
