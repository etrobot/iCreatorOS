import { defineConfig } from 'drizzle-kit';
export default defineConfig({
  schema: './app/db/schema-sqlite.ts',
  out: './app/db/migrations',
  dialect: 'sqlite',
  driver: 'd1-http',
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
    databaseId: process.env.CLOUDFLARE_DATABASE_ID!,
    token: process.env.CLOUDFLARE_D1_TOKEN!,
  },
  tablesFilter: ['/^(?!.*_cf_KV).*$/']
});