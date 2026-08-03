import { getCollection } from "astro:content";

export async function GET() {
  // Ambil semua post yang bukan draft
  const posts = await getCollection("blog", ({ data }) => {
    return data.draft !== true;
  });

  // Urutkan dari yang terbaru
  const sortedPosts = posts.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );

  // Ambil data yang penting saja (misal: 3 post terbaru) untuk ditampilkan di portofolio
  const apiData = sortedPosts.slice(0, 3).map((post) => ({
    title: post.data.title,
    description: post.data.description,
    pubDate: post.data.pubDate,
    slug: post.slug,
    tags: post.data.tags,
    url: `https://blog.fahrezi.tech/blog/${post.slug}`, // Ganti domain ini nanti saat deploy
  }));

  return new Response(JSON.stringify(apiData), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      // Izinkan CORS agar website portofolio Anda bisa mengambil data ini tanpa diblokir browser
      "Access-Control-Allow-Origin": "*",
    },
  });
}
