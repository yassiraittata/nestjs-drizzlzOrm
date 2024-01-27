import type { Config } from 'drizzle-kit';

export default {
  schema: './src/drizzle/schema.ts',
  out: './drizzle',
  driver: 'better-sqlite',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
} satisfies Config;
