import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';
import type { AppLoadContext } from '@remix-run/cloudflare';

export function initDbConnection(d1Database: D1Database) {
  return drizzle(d1Database, { schema });
}
export type DB = ReturnType<typeof initDbConnection>;
// 从 Remix 的 context 中获取数据库连接
export function getDb(context: AppLoadContext): DB {
  const env = context.cloudflare?.env as any;
  
  if (!env?.MY_DB) {
    throw new Error('MY_DB is not available in the environment');
  }
  
  return initDbConnection(env.MY_DB);
}