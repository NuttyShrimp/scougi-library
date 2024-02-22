import { boolean, datetime, int, longtext, mysqlTableCreator, primaryKey, unique, varchar } from "drizzle-orm/mysql-core";

const mysqlTable = mysqlTableCreator(n => `scougi_${n}`);

export const userTable = mysqlTable("user", {
  id: varchar("id", {
    length: 255
  }).primaryKey(),
  dropboxId: varchar("dropbox_id", {
    length: 255
  }).unique(),
  email: varchar("email", {
    length: 255
  }).unique(),
  name: varchar("name", {
    length: 255
  }),
  approved: boolean("approved").notNull()
});

export type User = typeof userTable.$inferSelect;

export const sessionTable = mysqlTable("session", {
  id: varchar("id", {
    length: 255
  }).primaryKey(),
  userId: varchar("user_id", {
    length: 255
  })
    .notNull()
    .references(() => userTable.id),
  expiresAt: datetime("expires_at").notNull()
});

export const ScougiTable = mysqlTable("scougi", {
  id: int("id").primaryKey().autoincrement(),
  year: varchar("year", {
    length: 255
  }).notNull(),
  trim: int("trim").notNull(),
  pages: int("pages").notNull(),
  hidden: boolean("hidden"),
}, t => ({
  unqiue: unique().on(t.year, t.trim)
}));

export const ScougiPageTable = mysqlTable("scougi_page", {
  id: int("scougi_id").notNull().references(() => ScougiTable.id),
  number: int("number").notNull(),
  data: longtext("data").notNull(),
}, t => ({
  pk: primaryKey({ columns: [t.id, t.number] })
}));

export type ScougiPage = typeof ScougiPageTable.$inferSelect;
