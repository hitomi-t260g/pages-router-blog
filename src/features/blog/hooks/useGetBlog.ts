import { useCallback, useEffect, useState } from "react";
import { contentfulClient } from "../../../infra/contentful/client";
import type { BlogEntity } from "../../../infra/entities/Blog";
import type { BlogData } from "../types/BlogData";
import { mapEntryToBlogData } from "../utils/getBlogData";
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
    contentType = "blogPost",
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

      // Build query parameters
      const queryParams: Record<string, string | number> = {
        content_type: contentType,
        order,
        limit,
        skip,
      };

      // Add tag filtering if specified
      if (tags.length > 0) {
        queryParams["fields.tags[in]"] = tags.join(",");
      }

      // Fetch data from Contentful
      const response = await contentfulClient.getEntries(queryParams);

      // Transform data using existing mapper
      const transformedPosts = response.items.map((item) =>
        mapEntryToBlogData(item as unknown as BlogEntity),
      );

      setPosts(transformedPosts);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch blog posts";
      setError(errorMessage);
      console.error("useGetBlog error:", err);
    } finally {
      setLoading(false);
    }
  }, [enabled, contentType, order, limit, skip, tags]);

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
