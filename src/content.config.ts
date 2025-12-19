import { defineCollection, z } from 'astro:content';

// 定义共享的 schema
const baseSchema = z.object({
  title_en: z.string(),
  title_zh: z.string(),
  date: z.coerce.date(),
  tags: z.array(z.string()).default([]),
  status: z.enum(['draft', 'published']).default('published'),
  cover: z.string().optional(),
  summary: z.string().optional(),
});

// Papers & Experiments 集合
const papersCollection = defineCollection({
  type: 'content',
  schema: baseSchema.extend({
    type: z.literal('paper'),
    venue: z.string().optional(), // 发表场所
    authors: z.array(z.string()).optional(),
  }),
});

// ComfyUI Course 集合
const coursesCollection = defineCollection({
  type: 'content',
  schema: baseSchema.extend({
    type: z.literal('course'),
    lesson_number: z.number(), // 第几课
    duration: z.string().optional(), // 时长
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  }),
});

// Life Reflections 集合
const reflectionsCollection = defineCollection({
  type: 'content',
  schema: baseSchema.extend({
    type: z.literal('reflection'),
    mood: z.string().optional(), // 情绪标签
  }),
});

// Misc 集合
const miscCollection = defineCollection({
  type: 'content',
  schema: baseSchema.extend({
    type: z.literal('misc'),
    category: z.string().optional(),
  }),
});

// Command Center 集合
const commandCenterCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title_en: z.string(),
    title_zh: z.string(),
    date: z.coerce.date(),
    type: z.enum(['decision-log', 'trade-offs', 'system-thinking', 'direction-notes']),
    status: z.enum(['draft', 'published']).default('published'),
    tags: z.array(z.string()).default([]),
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
