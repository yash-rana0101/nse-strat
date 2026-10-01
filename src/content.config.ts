import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const blogCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    author: z.string().default('Trading & Research Wing'),
    category: z.enum([
      'AI & Machine Learning',
      'Market Research',
      'Product Updates',
      'Trading Insights',
      'Engineering',
    ]),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

const docsCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    section: z.enum([
      'Getting Started',
      'Core Concepts',
      'Risk & Strategy',
      'Integration Resources',
    ]),
    order: z.number().default(0),
    badge: z.string().optional(),
    badgeVariant: z
      .enum(['emerald', 'violet', 'orange', 'default'])
      .default('default'),
    draft: z.boolean().default(false),
  }),
});

const featuresCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/features' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    badge: z.string(),
    badgeVariant: z.string().default('emerald'),
    subtitleBadge: z.string(),
    headline: z.string(),
    introText: z.string(),
    mockupTitle: z.string().optional(),
    mockupDesc: z.string().optional(),
    mockupIcon: z.string().optional(),
    keyHighlights: z
      .array(
        z.object({
          icon: z.string(),
          text: z.string(),
        })
      )
      .default([]),
    specsBadge: z.string(),
    specsHeadline: z.string(),
    specItems: z
      .array(
        z.object({
          icon: z.string(),
          title: z.string(),
          desc: z.string(),
          variant: z.string().optional(),
        })
      )
      .default([]),
    draft: z.boolean().default(false),
    order: z.number().default(0),
  }),
});

export const collections = {
  blog: blogCollection,
  docs: docsCollection,
  features: featuresCollection,
};
