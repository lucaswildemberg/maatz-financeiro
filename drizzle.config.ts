import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: './database.db',
  },
} satisfies Config;