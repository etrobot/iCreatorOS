import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './app/db/schema.ts',
  out: './app/db/migrations',
  dialect: 'sqlite',
  driver: 'd1-http',
  dbCredentials: {
    accountId: env.CLOUDFLARE_ACCOUNT_ID!,
    databaseId: env.CLOUDFLARE_DATABASE_ID!,
    token: env.CLOUDFLARE_D1_TOKEN!,
  },
  tablesFilter: ['/^(?!.*_cf_KV).*$/'],
  // 添加本地开发配置
  ...(env.NODE_ENV === 'development' && {
    driver: 'better-sqlite3',
    dbCredentials: {
      url: './.wrangler/state/v3/d1/miniflare-D1DatabaseObject/15f5707c-277c-4a8d-ab44-601d35c22b93.sqlite'
    }
  })
});