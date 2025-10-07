import type { BlogData } from "../../features/blog/types/BlogData";
import { mapEntryToBlogData } from "../../features/blog/utils/getBlogData";
import type { BlogEntity } from "../entities/Blog";
import { contentfulClient } from "./client";

export interface GetBlogPostsOptions {
  limit?: number;
  skip?: number;
  order?: string;
  tags?: string[];
}

export interface GetBlogPostsResponse {
  items: BlogData[];
  total: number;
  skip: number;
  limit: number;
}

/**
 * Contentfulからブログ記事一覧を取得する
 */
export const getBlogPosts = async (
  options: GetBlogPostsOptions = {},
): Promise<GetBlogPostsResponse> => {
  const {
    limit = 10,
    skip = 0,
    order = "-fields.publishDate",
    tags = [],
  } = options;

  // Build query parameters
  const queryParams: Record<string, string | number> = {
    content_type: "blogPost",
    order,
    limit,
    skip,
  };

  // Add tag filtering if specified
  if (tags.length > 0) {
    queryParams["fields.tags[in]"] = tags.join(",");
  }

  const response = await contentfulClient.getEntries(queryParams);

  // Transform data using existing mapper
  const items = response.items.map((item) =>
    mapEntryToBlogData(item as unknown as BlogEntity),
  );

  return {
    items,
    total: response.total,
    skip: response.skip,
    limit: response.limit,
  };
};

/**
 * Contentfulから単一のブログ記事を取得する
 */
export const getBlogPost = async (slug: string): Promise<BlogData | null> => {
  const response = await contentfulClient.getEntries({
    content_type: "blogPost",
    "fields.slug": slug,
    limit: 1,
  });

  if (response.items.length === 0) {
    return null;
  }

  const item = response.items[0] as unknown as BlogEntity;
  return mapEntryToBlogData(item);
};

/**
 * Contentfulからブログ記事のスラッグ一覧を取得する（静的生成用）
 */
export const getBlogSlugs = async (): Promise<string[]> => {
  const response = await contentfulClient.getEntries({
    content_type: "blogPost",
    select: ["fields.slug"],
  });

  return response.items
    .map((item) => (item.fields as { slug?: string }).slug)
    .filter((slug): slug is string => Boolean(slug));
};
