import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async (context) => {
  const posts = await getCollection('blog', ({ data }: { data: any }) => !data.draft);
  const sortedPosts = posts.sort((a: any, b: any) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: 'fahreziblog',
    description: 'A minimalist personal blog for tips, tricks, and tech notes.',
    site: context.site || 'https://fahreziblog.dev',
    items: sortedPosts.map((post: any) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/blog/${post.slug}/`,
    })),
    customData: `<language>en-us</language>`,
  });
};
