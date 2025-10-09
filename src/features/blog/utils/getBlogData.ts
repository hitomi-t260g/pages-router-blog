import type { BlogEntity } from "../../../infra/entities/Blog";
import type { BlogData } from "../types/BlogData";

export function mapEntryToBlogData(entry: BlogEntity): BlogData {
  const f = entry.fields;

  const formattedPublishDate = f.publishDate
    ? new Date(f.publishDate).toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return {
    id: entry.sys.id,
    title: f.title,
    slug: f.slug,
    excerpt: f.excerpt ?? null,
    body: f.body ?? null,
    coverUrl: f.coverImage?.fields?.file?.url
      ? `https:${f.coverImage.fields.file.url}`
      : null,
    authorName: f.author?.fields?.name ?? null,
    tags: f.tags ?? null,
    publishDate: f.publishDate ?? null,
    formattedPublishDate,
  };
}
