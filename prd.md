📄 SECTION 1: Product Requirements Document (PRD)
1. Project Overview
Project Name: Minimalist Personal Engineering & Tips Blog

Tech Stack: Astro v4+, Tailwind CSS v3+, MDX, TypeScript, Lucide Icons.

Hosting / Deployment: Vercel / Netlify.

Design Philosophy: Minimalist, typography-first, high contrast, zero-AI-slop (no gradients, no 3D illustrations, no thick glassmorphism, no neon glows). Rely on 1px subtle borders, clean monospaced accents, and instant performance.

2. Core Pages & Architecture
Home (/): Minimalist Hero Statement, Live Status Indicator, Featured Articles (1-2 item), and Recent Articles List.

Blog Index (/blog): Complete list of articles with client-side real-time search (Fuse.js) and category/tag filter.

Article Detail (/blog/[slug]): MDX Article Layout, Table of Contents (ToC), Syntax Highlighting via Shiki, Estimated Reading Time, Copy Code Button, and Giscus Comments.

Tags (/tags & /tags/[tag]): Filtered article directory based on topic taxonomy.

About (/about): Direct personal background, primary tech stack/tools list, and social links.

System Routes: sitemap-index.xml and rss.xml generated build-time.

3. Design System & UI Tokens
Color Palette:

Light Mode: Background #FBFBFB, Card BG #FFFFFF, Text Primary #111111, Text Muted #71717A, Border #E4E4E7.

Dark Mode: Background #09090B, Card BG #121215, Text Primary #FAFAFA, Text Muted #A1A1AA, Border #27272A.

Accent Color (1 Color Only): International Klein Blue #2563EB (Dark: #60A5FA) — strictly for hover states and active links.

Typography:

Sans-Serif: Inter or Geist Sans (Body text, Titles).

Monospace: JetBrains Mono or Geist Mono (Dates, Read times, Tags, Code blocks, KBD indicators).

🛠️ SECTION 2: Project Structure & File Map
AI Agent harus membuat struktur berkas sebagai berikut:

Plaintext
.
├── public/
│   ├── favicon.svg
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── BlogCard.astro
│   │   ├── TableOfContents.astro
│   │   ├── SearchBar.tsx
│   │   ├── CopyCodeButton.astro
│   │   └── GiscusComments.astro
│   ├── content/
│   │   ├── config.ts
│   │   └── blog/
│   │       ├── 01-css-grid-tricks.mdx
│   │       └── 02-astro-performance.mdx
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── BlogPostLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── blog/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   ├── tags/
│   │   │   ├── index.astro
│   │   │   └── [tag].astro
│   │   └── rss.xml.ts
│   └── styles/
│       └── global.css
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
└── package.json
🤖 SECTION 3: Agent Prompt Master (Copy-Paste Ready)
PETUNJUK: Salin seluruh isi di dalam kotak di bawah ini dan tempelkan langsung ke AI Agent / Coding Assistant kamu.

Markdown
You are an expert Frontend Architect specializing in Astro, Tailwind CSS, TypeScript, and minimalist UI engineering. You strictly build high-performance, accessible, and clean web applications that reject "AI Slop" visual tropes (no heavy glassmorphism, no purple/pink mesh gradients, no floating 3D icons, no neon glows).

Your task is to build a complete, production-ready Personal Blog for tips, tricks, and tech notes.

### Core Guidelines & Rules:
1. Tech Stack: Astro (latest), Tailwind CSS, MDX, TypeScript.
2. Aesthetic: High-contrast, typography-driven, subtle 1px borders (`zinc-200` / `zinc-800`), monospaced details (`Geist Mono` or `JetBrains Mono`), and minimal neutral colors (`zinc-900` / `zinc-50`).
3. Responsiveness: Fully mobile-responsive using semantic HTML.
4. Content Handling: Use Astro Content Collections with Zod validation in `src/content/config.ts`.

---

### STEP 1: Dependencies & Configuration
Generate `package.json` with required dependencies: `@astrojs/mdx`, `@astrojs/tailwind`, `@astrojs/sitemap`, `@astrojs/rss`, `lucide-astro`, `fuse.js`, `clsx`, `tailwind-merge`.

Create `astro.config.mjs`:
```javascript
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: '[https://myblog.dev](https://myblog.dev)',
  integrations: [mdx(), tailwind(), sitemap()],
  markdown: {
    shikiConfig: {
      theme: 'github-dark-dimmed',
      wrap: true,
    },
  },
});
Create src/content/config.ts:

TypeScript
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
STEP 2: Minimalist Global Layout (src/layouts/BaseLayout.astro)
Build a master layout with:

Dark/Light mode support using Tailwind class strategy.

Clean sticky navigation bar with 1px bottom border.

Container constrained to max-w-3xl for high readability.

Clean typography settings.

Navbar Requirements:

Logo / Name on the left (Mono font, bold).

Nav Links on the right: /blog, /tags, /about.

Subtle theme toggle icon button.

Footer Requirements:

Simple copyright notice with Current Year.

RSS link and GitHub link in muted mono text.

STEP 3: Article Card Component (src/components/BlogCard.astro)
Build a list-style article row component (NOT a heavy card grid):

Code snippet
---
interface Props {
  title: string;
  description: string;
  pubDate: Date;
  slug: string;
  tags: string[];
  readingTime?: string;
}

const { title, description, pubDate, slug, tags } = Astro.props;
const formattedDate = new Intl.DateTimeFormat('id-ID', {
  day: '2-digit',
  month: 'short',
  year: 'numeric'
}).format(pubDate);
---

<article class="group relative py-5 border-b border-zinc-200 dark:border-zinc-800/60 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors -mx-4 px-4 rounded-lg">
  <div class="flex items-center justify-between gap-2 font-mono text-xs text-zinc-500 dark:text-zinc-400">
    <time datetime={pubDate.toISOString()}>{formattedDate}</time>
    <div class="flex gap-1.5">
      {tags.map(tag => (
        <span class="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200/80 dark:border-zinc-700/50">
          #{tag}
        </span>
      ))}
    </div>
  </div>
  
  <h3 class="mt-2 text-base font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
    <a href={`/blog/${slug}`}>
      <span class="absolute inset-0"></span>
      {title}
    </a>
  </h3>
  
  <p class="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
    {description}
  </p>
</article>
STEP 4: Article Detail Page & Layout (src/layouts/BlogPostLayout.astro)
Build a reading layout featuring:

Back button to /blog.

Title, date, tags, and reading time indicator in font-mono.

Table of Contents (TableOfContents.astro) extracted from headings.

Prose styling for entry.render() content with clean syntax highlighting and copy code snippet button.

Giscus comment system placeholder at the bottom.

STEP 5: Pages Implementation
src/pages/index.astro:

Hero section with direct bio and status dot (relative flex h-2 w-2 with pulse).

"Featured Writing" section.

"Recent Tips & Notes" list using BlogCard.astro.

src/pages/blog/index.astro:

Real-time search using Fuse.js (SearchBar.tsx or client JS).

Complete list of non-draft posts sorted by date descending.

src/pages/tags/index.astro and src/pages/tags/[tag].astro:

Taxonomy breakdown.

src/content/blog/01-sample-tips.mdx:

Create 2 realistic dummy MDX articles in Indonesian with frontmatter, code blocks, and headings to demonstrate functionality.

Execute the build step by step. Create all necessary files cleanly.