export type BlogData = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: unknown | null;
  coverUrl: string | null;
  authorName: string | null;
  tags: string[] | null;
  publishDate: string | null;
  formattedPublishDate: string | null;
};
