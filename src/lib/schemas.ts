import z from "zod";

export const createScougiReq = z.object({
  year: z.string(),
  trim: z.number(),
  pages: z.number(),
})

export type CreateScougiReq = z.infer<typeof createScougiReq>

export const createPageReq = z.object({
  data: z.base64(),
  page: z.number(),
})

export type CreatePageReq = z.infer<typeof createPageReq>
