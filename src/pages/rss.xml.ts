import rss from '@astrojs/rss';
import { getCollection, type CollectionEntry } from 'astro:content';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async (context) => {
  const posts = await getCollection('blog', ({ data }: CollectionEntry<'blog'>) => !data.draft);
  const sortedPosts = posts.sort((a: CollectionEntry<'blog'>, b: CollectionEntry<'blog'>) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: 'fahreziblog',
    description: 'A minimalist personal blog for tips, tricks, and tech notes.',
    site: context.site || 'https://blog.fahrezi.tech',
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/blog/${post.slug}/`,
    })),
    customData: `<language>en-us</language>`,
  });
};
