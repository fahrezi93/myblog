import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import GithubSlugger from 'github-slugger';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const blogDir = path.join(__dirname, '../src/content/blog');
const slugger = new GithubSlugger();

// Validasi API Key
if (!process.env.GEMINI_API_KEY) {
  console.error('Error: GEMINI_API_KEY is not set in environment variables.');
  process.exit(1);
}

// Inisialisasi SDK Gemini (pakai versi 2.5 Flash yang sangat cepat)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generatePost() {
  console.log('Generating new blog post with Gemini...');

  // Dapatkan tanggal hari ini untuk disisipkan ke prompt
  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];

  // Ini adalah prompt inti atau "roh" dari artikel yang akan dibuat
  const prompt = `
You are Mohammad Fahrezi, an expert Fullstack Developer and Graphic Designer from Indonesia.
Your task is to write a short, concise, and highly technical blog post about a very recent, trending topic in Frontend Development, AI Coding Tools, Web Performance, or UI/UX Design from the last 7 days.
The article must be written in good, accessible Indonesian (Bahasa Indonesia) suitable for a professional software engineer's blog. Keep the tone calm, minimalist, and to the point (do not use excessive slang or overly exaggerated words).
Limit the content length. Make it a quick read (around 3 to 5 short paragraphs) and include relevant code snippets if applicable.

IMPORTANT RULES:
1. Output MUST be ONLY raw Markdown text. Do NOT wrap the entire output in markdown code blocks like \`\`\`markdown.
2. The output MUST start with valid Astro MDX frontmatter between --- lines.
3. The frontmatter MUST include: title, description, pubDate (MUST BE EXACTLY "${formattedDate}"), tags (array of strings), featured (boolean), and draft (false).

Example of correct format:
---
title: "Tren Framework UI di Tahun 2026"
description: "Melihat bagaimana React 19 dan SolidJS mendominasi pasar."
pubDate: "${formattedDate}"
tags: ["frontend", "react", "ui"]
featured: false
draft: false
---

Halo, ini Fahrezi! Hari ini kita akan bahas...
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: prompt,
      config: {
        temperature: 0.7 // Membuat gaya bahasa lebih kreatif dan natural
      }
    });

    let rawMarkdown = response.text;

    // Bersihkan pembungkus markdown (kalau AI tidak sengaja memberikannya)
    if (rawMarkdown.startsWith('```markdown')) {
      rawMarkdown = rawMarkdown.replace(/^```markdown\n/, '').replace(/\n```$/, '');
    } else if (rawMarkdown.startsWith('```')) {
      rawMarkdown = rawMarkdown.replace(/^```\n/, '').replace(/\n```$/, '');
    }

    // Ambil judul dari frontmatter untuk dijadikan format nama file (slug)
    const titleMatch = rawMarkdown.match(/title:\s*"([^"]+)"/);
    let title = 'AI Generated Post';
    if (titleMatch && titleMatch[1]) {
      title = titleMatch[1];
    }
    
    const rawSlug = slugger.slug(title);

    // Cari tahu nomor urut artikel terakhir di folder blog
    const existingFiles = fs.readdirSync(blogDir).filter(f => f.endsWith('.mdx'));
    let maxNumber = 0;
    
    existingFiles.forEach(file => {
      const match = file.match(/^(\d+)-/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNumber) {
          maxNumber = num;
        }
      }
    });

    // Buat nomor urut baru (misal: 12- -> 13-)
    const nextNumber = maxNumber + 1;
    const prefix = nextNumber.toString().padStart(2, '0');
    const fileName = `${prefix}-${rawSlug}.mdx`;
    const filePath = path.join(blogDir, fileName);

    // Simpan artikel baru
    fs.writeFileSync(filePath, rawMarkdown, 'utf-8');
    console.log(`Successfully generated and saved new post: ${fileName}`);

  } catch (error) {
    console.error('Failed to generate post:', error);
    process.exit(1);
  }
}

generatePost();
