export type ContentfulSys = {
  id: string;
};

export type BlogEntity = {
  sys: ContentfulSys;
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
};
