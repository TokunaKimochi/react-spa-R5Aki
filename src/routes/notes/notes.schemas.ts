import { z } from 'zod';

export const notesTbSchemas = z
  .object({
    customer_id: z.number().int().positive(),
    rank: z.number().int().positive(),
    body: z.string().min(1),
    created_at: z.string().max(40),
    updated_at: z.string().max(40),
  })
  .partial();

export const notesTbRowSchemas = notesTbSchemas.required();