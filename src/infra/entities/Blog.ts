// ContentfulのEntry型を直接使用する代わりにカスタム型を定義
export interface BlogEntity {
  sys: {
    id: string;
    contentType: {
      sys: {
        id: string;
      };
    };
  };
  fields: {
    title: string;
    slug: string;
    excerpt?: string;
    body?: unknown; // Contentful rich text
    coverImage?: {
      fields: {
        file: {
          url: string;
        };
      };
    };
    author?: {
      fields: {
        name: string;
      };
    };
    tags?: string[];
    publishDate?: string;
  };
}
