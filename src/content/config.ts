import { defineCollection, z } from 'astro:content'

const postsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.number(),
    title: z.string(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    published: z.boolean().default(false),
    deprecated: z.boolean().default(false),
    isNotice: z.boolean().default(false),
    cover: z.string().optional(),
  }),
})

export const collections = {
  posts: postsCollection,
}
