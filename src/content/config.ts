import { defineCollection, z } from 'astro:content';

// Papers collection schema
const papersCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title_en: z.string(),
    title_zh: z.string(),
    type: z.literal('paper'),
    date: z.date(),
    status: z.enum(['published', 'draft']),
    tags: z.array(z.string()),
  }),
});

// Courses collection schema
const coursesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title_en: z.string(),
    title_zh: z.string(),
    type: z.literal('course'),
    lesson_number: z.number(),
    date: z.date(),
    status: z.enum(['published', 'draft']),
    tags: z.array(z.string()),
    duration: z.string().optional(),
  }),
});

// Reflections collection schema
const reflectionsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title_en: z.string(),
    title_zh: z.string(),
    type: z.literal('reflection'),
    date: z.date(),
    status: z.enum(['published', 'draft']),
    tags: z.array(z.string()),
  }),
});

// Misc collection schema
const miscCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title_en: z.string(),
    title_zh: z.string(),
    type: z.literal('misc'),
    date: z.date(),
    status: z.enum(['published', 'draft']),
    tags: z.array(z.string()),
  }),
});

// Command Center collection schema
const commandCenterCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title_en: z.string(),
    title_zh: z.string(),
    date: z.date(),
    type: z.enum(['decision-log', 'trade-offs', 'system-thinking', 'direction-notes']),
    status: z.enum(['draft', 'published']),
    tags: z.array(z.string()),
    summary: z.string(),
    cover: z.string().optional(),
    featured: z.boolean().optional(),
  }),
});

export const collections = {
  'papers': papersCollection,
  'courses': coursesCollection,
  'reflections': reflectionsCollection,
  'misc': miscCollection,
  'command-center': commandCenterCollection,
};
