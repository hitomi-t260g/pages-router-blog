import { useCallback, useRef } from "react";

interface UseInfiniteScrollOptions {
  onLoadMore: () => void;
  hasMore: boolean;
  loading: boolean;
  threshold?: number;
}

interface UseInfiniteScrollReturn {
  lastElementRef: (node: HTMLElement | null) => void;
}

export function useInfiniteScroll({
  onLoadMore,
  hasMore,
  loading,
  threshold = 1.0,
}: UseInfiniteScrollOptions): UseInfiniteScrollReturn {
  const observer = useRef<IntersectionObserver | null>(null);

  const lastElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            onLoadMore();
          }
        },
        {
          threshold,
          rootMargin: "100px", // Start loading 100px before reaching the element
        },
      );

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, onLoadMore, threshold],
  );

  return { lastElementRef };
}
