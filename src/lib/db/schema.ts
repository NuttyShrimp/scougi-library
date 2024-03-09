import { integer, primaryKey, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";

export const userTable = sqliteTable("user", {
  id: text("id").primaryKey(),
  dropboxId: text("dropbox_id").unique(),
  email: text("email").unique(),
  name: text("name"),
  approved: integer("approved", { mode: "boolean" }).notNull()
});

export type User = typeof userTable.$inferSelect;

export const sessionTable = sqliteTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull()
});

export const ScougiTable = sqliteTable("scougi", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  year: text("year").notNull(),
  trim: integer("trim").notNull(),
  pages: integer("pages").notNull(),
  hidden: integer("hidden", { mode: 'boolean' }),
}, t => ({
  unqiue: unique().on(t.year, t.trim)
}));

export const ScougiPageTable = sqliteTable("scougi_page", {
  id: integer("scougi_id").notNull().references(() => ScougiTable.id),
  number: integer("number").notNull(),
  data: text("data").notNull(),
}, t => ({
  pk: primaryKey({ columns: [t.id, t.number] })
}));

export type ScougiPage = typeof ScougiPageTable.$inferSelect;
