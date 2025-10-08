# Blog Hooks

React Hooks for fetching blog data from Contentful CMS.

## Available Hooks

### `useGetBlog`

Fetches a list of blog posts with customizable options.

```tsx
import { useGetBlog } from '../hooks';

function BlogList() {
  const { posts, loading, error, refetch } = useGetBlog({
    limit: 10,
    order: '-fields.publishDate',
    tags: ['technology', 'react'],
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <button onClick={refetch}>Refresh</button>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </div>
  );
}
```

#### Options

- `limit` (number): Number of posts to fetch (default: 10)
- `order` (string): Sort order (default: '-fields.publishDate')
- `tags` (string[]): Filter by tags (default: [])
- `enabled` (boolean): Enable/disable the hook (default: true)
- `refetchOnMount` (boolean): Refetch data on component mount (default: true)

### `useGetBlogPost`

Fetches a single blog post by slug.

```tsx
import { useGetBlogPost } from '../hooks';

function BlogPostPage({ slug }: { slug: string }) {
  const { post, loading, error, refetch } = useGetBlogPost({ 
    slug,
    include: 10,
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.excerpt}</p>
      {post.body && <div>{/* Render rich text */}</div>}
      <button onClick={refetch}>Refresh</button>
    </article>
  );
}
```

#### Options

- `slug` (string): Post slug (required)
- `include` (number): Include depth for linked entries (default: 10)
- `enabled` (boolean): Enable/disable the hook (default: true)
- `refetchOnMount` (boolean): Refetch data on component mount (default: true)

## Return Values

Both hooks return an object with:

- `loading` (boolean): Loading state
- `error` (string | null): Error message or null
- `refetch` (): Function to manually refetch data
- `posts` (BlogData[]): Array of blog posts (useGetBlog only)
- `post` (BlogData | null): Single blog post (useGetBlogPost only)

## Best Practices

1. **Use with existing SSG/SSR**: These hooks complement the existing static generation, don't replace it
2. **Enable/disable wisely**: Use the `enabled` option to prevent unnecessary API calls
3. **Handle errors gracefully**: Always provide error handling UI
4. **Consider caching**: The hooks include basic caching to prevent duplicate requests

## Type Definitions

```tsx
interface UseGetBlogOptions {
  limit?: number;
  order?: string;
  tags?: string[];
  enabled?: boolean;
  refetchOnMount?: boolean;
}

interface UseGetBlogPostOptions {
  slug: string;
  include?: number;
  enabled?: boolean;
  refetchOnMount?: boolean;
}
```