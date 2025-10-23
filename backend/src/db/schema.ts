import {
  pgTable,
  integer,
  text,
  varchar,
  pgEnum,
  timestamp,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("role", ["admin", "user"]);
export const userStatusEnum = pgEnum("status", [
  "active",
  "inactive",
  "banned",
]);
export const chatTypeEnum = pgEnum("chat_type", ["private", "group"]);
export const participantsRoleEnum = pgEnum("role", ["admin", "user"]);

export const userTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: varchar({ length: 255 }).notNull().unique(),
  name: varchar({ length: 255 }).notNull(),
  user_name: varchar({ length: 255 }).notNull().unique(),
  password: text().notNull(),
  role: userRoleEnum().notNull().default("user"),
  profile_image: text(),
  status: userStatusEnum().notNull().default("active"),
  last_seen: timestamp({ mode: "date" }).defaultNow(),
  created_at: timestamp({ mode: "date" }).defaultNow(),
  updated_at: timestamp({ mode: "date" })
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const chatTable = pgTable("chats", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  type: chatTypeEnum().notNull().default("private"),
  name: text().notNull(),
  description: text(),
  last_message_at: timestamp({ mode: "date" }),
  image: text(),
  created_by: integer()
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
});

export const chatParticipantTable = pgTable("chat_participants", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  chat_id: integer()
    .notNull()
    .references(() => chatTable.id, { onDelete: "cascade" }),
  user_id: integer()
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  role: participantsRoleEnum().notNull().default("user"),
  joined_at: timestamp({ mode: "date" }).defaultNow(),
  created_at: timestamp({ mode: "date" }).defaultNow(),
});

export const messageTable = pgTable("message", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  chat_id: integer()
    .notNull()
    .references(() => chatTable.id, { onDelete: "cascade" }),
  user_id: integer()
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  content: text().notNull(),
});
