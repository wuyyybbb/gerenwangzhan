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
    // SEO 优化必填字段
    author: z.string(), // 作者：吴叶贝 (Wu Yebei)
    summary: z.string(), // 论文摘要
    topic: z.string(), // 主题分类
    audience: z.string(), // 目标读者
    tools: z.string(), // 相关工具/技术
    updated: z.string(), // 更新时间，格式："2024-02"
    category: z.string().default('Papers / 论文'), // 分类标签
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
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    // SEO 优化必填字段
    author: z.string(), // 作者：吴叶贝 (Wu Yebei)
    summary: z.string(), // 课程摘要，包含实战场景和痛点
    topic: z.string(), // 主题分类，如"AI 工作流 / 图像生成"
    audience: z.string(), // 目标受众，如"AI 创作者 / 设计师"
    tools: z.string(), // 使用工具，如"ComfyUI / Stable Diffusion"
    updated: z.string(), // 更新时间，格式："2024-02"
    category: z.string().default('Courses / 课程'), // 分类标签
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
    // SEO 优化必填字段
    author: z.string(), // 作者：吴叶贝 (Wu Yebei)
    summary: z.string(), // 反思总结
    topic: z.string(), // 主题分类
    audience: z.string(), // 目标读者
    tools: z.string().optional(), // 相关工具（可选）
    updated: z.string(), // 更新时间，格式："2024-02"
    category: z.string().default('Reflections / 思考'), // 分类标签
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
    // SEO 优化必填字段
    author: z.string(), // 作者：吴叶贝 (Wu Yebei)
    summary: z.string(), // 内容摘要
    topic: z.string(), // 主题分类
    audience: z.string(), // 目标读者
    tools: z.string().optional(), // 相关工具（可选）
    updated: z.string(), // 更新时间，格式："2024-02"
    category: z.string().default('Misc / 杂项'), // 分类标签
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
    // SEO 优化必填字段
    author: z.string(), // 作者：吴叶贝 (Wu Yebei)
    topic: z.string(), // 主题分类
    audience: z.string(), // 目标读者
    tools: z.string().optional(), // 相关工具（可选）
    updated: z.string(), // 更新时间，格式："2025-01"
    category: z.string().default('Command Center / 指挥中心'), // 分类标签
  }),
});

export const collections = {
  'papers': papersCollection,
  'courses': coursesCollection,
  'reflections': reflectionsCollection,
  'misc': miscCollection,
  'command-center': commandCenterCollection,
};
