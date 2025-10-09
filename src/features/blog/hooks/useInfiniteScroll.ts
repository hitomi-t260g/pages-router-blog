import { useCallback, useEffect, useRef, useState } from "react";

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
  const [isClient, setIsClient] = useState(false);

  // マウント時にクライアントサイドかどうかを設定
  // see: https://nextjs.org/docs/messages/react-hydration-error
  useEffect(() => {
    setIsClient(true);
  }, []);

  const lastElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (!isClient || loading) return;
      if (observer.current) observer.current.disconnect();

      if (typeof window !== "undefined" && "IntersectionObserver" in window) {
        observer.current = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting && hasMore) {
              onLoadMore();
            }
          },
          {
            threshold,
            rootMargin: "100px",
          },
        );

        if (node) observer.current.observe(node);
      }
    },
    [isClient, loading, hasMore, onLoadMore, threshold],
  );

  return { lastElementRef };
}
