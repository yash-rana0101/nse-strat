// src/pages/blog/[slug].md.ts
/**
 * Markdown twins for blog posts at /blog/<slug>.md.
 *
 * Agents read markdown at a fraction of the noise of rendered HTML. Post bodies
 * are already authored in markdown, so the twin is the source content plus a
 * frontmatter block carrying document metadata.
 */
import type { APIRoute, GetStaticPaths } from 'astro';
import { fetchBlogs } from '@/services/content';
import type { DbBlog } from '@/services/content';
import { SITE_URL } from '@/constants/agent';

export const getStaticPaths: GetStaticPaths = async () => {
  const blogs = await fetchBlogs();
  return blogs.map((blog) => ({
    params: { slug: blog.slug },
    props: { blog },
  }));
};

/** Frontmatter values are unquoted, so line breaks and quotes must go. */
function scalar(value: string): string {
  return value.replace(/\s+/g, ' ').replace(/"/g, "'").trim();
}

function buildDocument(blog: DbBlog): string {
  const tags = Array.isArray(blog.tags) ? blog.tags : [];

  return `---
title: ${scalar(blog.title)}
description: ${scalar(blog.excerpt || '')}
canonical: ${SITE_URL}/blog/${blog.slug}
author: ${scalar(blog.author || 'Trading & Research Wing')}
category: ${scalar(blog.category || '')}
published: ${(blog.publishedAt || '').slice(0, 10)}
last-updated: ${(blog.updatedAt || blog.publishedAt || '').slice(0, 10)}
${tags.length > 0 ? `tags: [${tags.map(scalar).join(', ')}]` : ''}---

# ${blog.title}

${blog.excerpt ? `> ${scalar(blog.excerpt)}\n` : ''}
${blog.content || ''}

---

Canonical HTML version: ${SITE_URL}/blog/${blog.slug}
Published by Trading & Research Wing — ${SITE_URL}
`;
}

export const GET: APIRoute = async ({ props }) => {
  const blog = props.blog as DbBlog | undefined;

  if (!blog) {
    return new Response('Not found', {
      status: 404,
      headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
    });
  }

  return new Response(buildDocument(blog), {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
