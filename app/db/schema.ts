import { sqliteTable, text, integer, blob, real, primaryKey } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import { type D1Database } from '@cloudflare/workers-types';
import { drizzle } from 'drizzle-orm/d1';

declare global {
  var DB: D1Database | undefined;
}

export const users = sqliteTable("user", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: integer("emailVerified", { mode: "timestamp" }),
  image: text("image"),
});

export const accounts = sqliteTable("account", {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    primaryKey({
      columns: [account.provider, account.providerAccountId],
    })
  ],
);
// NextAuth.js 会话表
export const sessions = sqliteTable('session', {
  sessionToken: text('sessionToken').notNull().primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: integer('expires', { mode: 'timestamp' }).notNull(),
});

// NextAuth.js 验证令牌表
export const verificationTokens = sqliteTable('verificationToken', {
  identifier: text('identifier').notNull(),
  token: text('token').notNull(),
  expires: integer('expires', { mode: 'timestamp' }).notNull(),
});

// Webhook事件表
export const webhookEvents = sqliteTable('webhookEvent', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  eventName: text('eventName').notNull(),
  processed: integer('processed', { mode: 'boolean' }).default(false),
  body: text('body').notNull(), // JSON string in SQLite
  processingError: text('processingError'),
});

// 付费计划表
export const plans = sqliteTable('plan', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  productId: integer('productId').notNull(),
  productName: text('productName'),
  variantId: integer('variantId').notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
  price: text('price').notNull(),
  isUsageBased: integer('isUsageBased', { mode: 'boolean' }).default(false),
  interval: text('interval'),
  intervalCount: integer('intervalCount'),
  trialInterval: text('trialInterval'),
  trialIntervalCount: integer('trialIntervalCount'),
  sort: integer('sort'),
});

// 订阅表
export const subscriptions = sqliteTable('subscription', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  lemonSqueezyId: text('lemonSqueezyId').unique().notNull(),
  orderId: integer('orderId').notNull(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  status: text('status').notNull(),
  statusFormatted: text('statusFormatted').notNull(),
  renewsAt: text('renewsAt'),
  endsAt: text('endsAt'),
  trialEndsAt: text('trialEndsAt'),
  price: text('price').notNull(),
  isUsageBased: integer('isUsageBased', { mode: 'boolean' }).default(false),
  isPaused: integer('isPaused', { mode: 'boolean' }).default(false),
  subscriptionItemId: integer('subscriptionItemId'),
  userId: text('userId')
    .notNull()
    .references(() => users.id),
  planId: integer('planId')
    .notNull()
    .references(() => plans.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
});

// 分类表
export const category = sqliteTable('category', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
});

// 主题表 - 属于某个分类
export const topics = sqliteTable('topics', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  categoryId: integer('category_id').notNull().references(() => category.id),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
});

// 评估标准表 - 属于某个主题
export const evaluation = sqliteTable('evaluation', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  topicId: integer('topic_id').notNull().references(() => topics.id),
  topic: text('topic').notNull(), // 评估项目名称
  description: text('description'), // 总体描述
  std1Desc: text('std_1_desc'), // 1分标准描述
  std2Desc: text('std_2_desc'), // 2分标准描述
  std3Desc: text('std_3_desc'), // 3分标准描述
  std4Desc: text('std_4_desc'), // 4分标准描述
  std5Desc: text('std_5_desc'), // 5分标准描述
  weight: real('weight').default(1.0), // 权重
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
});

// 项目表 - 属于某个主题
export const project = sqliteTable('project', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  topicId: integer('topic_id').notNull().references(() => topics.id),
  userId: text('user_id').notNull().references(() => users.id),
  name: text('name').notNull(),
  description: text('description'),
  content: text('content'), // 项目内容或文件路径
  status: text('status').default('draft'), // 'draft', 'submitted', 'evaluated'
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
});

// 评估结果表
export const evlResult = sqliteTable('evl_result', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  projectId: integer('project_id').notNull().references(() => project.id),
  evaluationId: integer('evaluation_id').notNull().references(() => evaluation.id),
  evaluatorId: text('evaluator_id').notNull().references(() => users.id), // 评估者
  score: integer('score').notNull(), // 1-5分
  comment: text('comment'), // 评估意见
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
});

// 模板表 - 包含分类和价格
export const template = sqliteTable('template', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  categoryId: integer('category_id').notNull().references(() => category.id),
  name: text('name').notNull(),
  description: text('description'),
  content: text('content'), // 模板内容
  price: real('price').notNull().default(0), // 价格
  isPublic: integer('is_public', { mode: 'boolean' }).default(true),
  createdBy: text('created_by').notNull().references(() => users.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
});

// 编辑权限表 - 管理 category, evaluation, topics 的编辑权限
export const editor = sqliteTable('editor', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().references(() => users.id),
  resourceType: text('resource_type').notNull(), // 'category', 'topics', 'evaluation'
  resourceId: integer('resource_id').notNull(), // 对应资源的ID
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
});

// 查看权限表 - 管理 category, evaluation, topics 的查看权限
export const viewer = sqliteTable('viewer', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().references(() => users.id),
  resourceType: text('resource_type').notNull(), // 'category', 'topics', 'evaluation'
  resourceId: integer('resource_id').notNull(), // 对应资源的ID
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
});

// 定义表关系
export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  subscriptions: many(subscriptions),
  projects: many(project),
  templates: many(template),
  evaluations: many(evlResult),
  editorPermissions: many(editor),
  viewerPermissions: many(viewer)
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id]
  })
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id]
  })
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id]
  }),
  plan: one(plans, {
    fields: [subscriptions.planId],
    references: [plans.id]
  })
}));

export const plansRelations = relations(plans, ({ many }) => ({
  subscriptions: many(subscriptions)
}));

export const categoryRelations = relations(category, ({ many }) => ({
  topics: many(topics),
  templates: many(template)
}));

export const topicsRelations = relations(topics, ({ one, many }) => ({
  category: one(category, {
    fields: [topics.categoryId],
    references: [category.id]
  }),
  evaluations: many(evaluation),
  projects: many(project)
}));

export const evaluationRelations = relations(evaluation, ({ one, many }) => ({
  topic: one(topics, {
    fields: [evaluation.topicId],
    references: [topics.id]
  }),
  results: many(evlResult)
}));

export const projectRelations = relations(project, ({ one, many }) => ({
  topic: one(topics, {
    fields: [project.topicId],
    references: [topics.id]
  }),
  user: one(users, {
    fields: [project.userId],
    references: [users.id]
  }),
  evaluationResults: many(evlResult)
}));

export const evlResultRelations = relations(evlResult, ({ one }) => ({
  project: one(project, {
    fields: [evlResult.projectId],
    references: [project.id]
  }),
  evaluation: one(evaluation, {
    fields: [evlResult.evaluationId],
    references: [evaluation.id]
  }),
  evaluator: one(users, {
    fields: [evlResult.evaluatorId],
    references: [users.id]
  })
}));

export const templateRelations = relations(template, ({ one }) => ({
  category: one(category, {
    fields: [template.categoryId],
    references: [category.id]
  }),
  creator: one(users, {
    fields: [template.createdBy],
    references: [users.id]
  })
}));

export const editorRelations = relations(editor, ({ one }) => ({
  user: one(users, {
    fields: [editor.userId],
    references: [users.id]
  })
}));

export const viewerRelations = relations(viewer, ({ one }) => ({
  user: one(users, {
    fields: [viewer.userId],
    references: [users.id]
  })
}));

// 导出所有表的类型
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
export type VerificationToken = typeof verificationTokens.$inferSelect;
export type NewVerificationToken = typeof verificationTokens.$inferInsert;
export type WebhookEvent = typeof webhookEvents.$inferSelect;
export type NewWebhookEvent = typeof webhookEvents.$inferInsert;
export type Plan = typeof plans.$inferSelect;
export type NewPlan = typeof plans.$inferInsert;
export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;
export type Category = typeof category.$inferSelect;
export type NewCategory = typeof category.$inferInsert;
export type Topics = typeof topics.$inferSelect;
export type NewTopics = typeof topics.$inferInsert;
export type Evaluation = typeof evaluation.$inferSelect;
export type NewEvaluation = typeof evaluation.$inferInsert;
export type Project = typeof project.$inferSelect;
export type NewProject = typeof project.$inferInsert;
export type EvlResult = typeof evlResult.$inferSelect;
export type NewEvlResult = typeof evlResult.$inferInsert;
export type Template = typeof template.$inferSelect;
export type NewTemplate = typeof template.$inferInsert;
export type Editor = typeof editor.$inferSelect;
export type NewEditor = typeof editor.$inferInsert;
export type Viewer = typeof viewer.$inferSelect;
export type NewViewer = typeof viewer.$inferInsert;

// 数据库连接 (Cloudflare D1)
if (!context.env.MY_DB) {
  throw new Error('Database connection (MY_DB) is not configured');
}
