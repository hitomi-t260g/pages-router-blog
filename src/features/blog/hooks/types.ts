import type { BlogData } from "../types/BlogData";

// Hook State Management Types
export interface BlogHookState<T> {
  data: T;
  loading: boolean;
  error: string | null;
}

// Base Hook Options
export interface BaseHookOptions {
  enabled?: boolean;
  refetchOnMount?: boolean;
}

// useGetBlog Hook Types
export interface UseGetBlogOptions extends BaseHookOptions {
  limit?: number;
  skip?: number;
  order?: string;
  contentType?: string;
  tags?: string[];
}

export interface UseGetBlogReturn {
  posts: BlogData[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// useGetBlogPost Hook Types
export interface UseGetBlogPostOptions extends BaseHookOptions {
  slug: string;
  include?: number;
}

export interface UseGetBlogPostReturn {
  post: BlogData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Extended Blog Data for Hooks
export interface BlogDataWithMeta extends BlogData {
  fetchedAt?: Date;
  fromCache?: boolean;
}

// Error Types
export type BlogHookError =
  | "NETWORK_ERROR"
  | "API_ERROR"
  | "PARSING_ERROR"
  | "NOT_FOUND"
  | "RATE_LIMITED";

// Hook Utilities
export interface CacheEntry<T> {
  data: T;
  timestamp: Date;
  ttl: number;
}
