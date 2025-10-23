import {
  pgTable,
  integer,
  text,
  varchar,
  pgEnum,
  timestamp,
} from "drizzle-orm/pg-core";

export const userStatusEnum = pgEnum("user_status", [
  "active",
  "inactive",
  "banned",
]);
export const chatTypeEnum = pgEnum("chat_type", ["private", "group"]);
export const participantRoleEnum = pgEnum("participant_role", [
  "admin",
  "user",
]);

export const userTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  profile_image: text("profile_image"),
  status: userStatusEnum("status").notNull().default("active"),
  last_seen: timestamp("last_seen", { mode: "date" }).defaultNow(),
  created_at: timestamp("created_at", { mode: "date" }).defaultNow(),
  updated_at: timestamp("updated_at", { mode: "date" })
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const chatTable = pgTable("chats", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  type: chatTypeEnum("type").notNull().default("private"),
  name: text("name").notNull(),
  description: text("description"),
  last_message_at: timestamp("last_message_at", { mode: "date" }),
  image: text("image"),
  created_by: integer("created_by")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  created_at: timestamp("created_at", { mode: "date" }).defaultNow(),
});

export const chatParticipantTable = pgTable("chat_participants", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  chat_id: integer("chat_id")
    .notNull()
    .references(() => chatTable.id, { onDelete: "cascade" }),
  user_id: integer("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  role: participantRoleEnum("role").notNull().default("user"),
  joined_at: timestamp("joined_at", { mode: "date" }).defaultNow(),
  created_at: timestamp("created_at", { mode: "date" }).defaultNow(),
});

export const messageTable = pgTable("messages", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  chat_id: integer("chat_id")
    .notNull()
    .references(() => chatTable.id, { onDelete: "cascade" }),
  user_id: integer("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  created_at: timestamp("created_at", { mode: "date" }).defaultNow(),
});
