import { z } from 'zod';

const envSchema = z.object({
  MODE: z.enum(['production', 'development', 'msw4dev']),
  BASE_URL: z.string().startsWith('/'),
  PROD: z.boolean(),
  DEV: z.boolean(),
  SSR: z.boolean(),
  // `http://` or `https://` の部分は今のところハードコード
  VITE_BEP_HOST: z.union([z.string().ip(), z.literal('localhost')]),
  VITE_BEP_PORT: z.coerce.number().min(1024).max(65535),
});

type Env = z.infer<typeof envSchema>;

const env: Env = envSchema.parse(import.meta.env);

export default env;
