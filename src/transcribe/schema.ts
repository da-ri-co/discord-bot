import {integer, text, pgTable} from "drizzle-orm/pg-core";

const discussion_abstract = pgTable("discussion_abstract", {
    id: serial("id").primaryKey(),
    channel_id: text("channel_id").notNull(),
    message_id: text("message_id").notNull(),
    speaker_name: text("speaker_name").notNull(),
    content: text("content"),
    created_at: timestamp("created_at").notNull(),
    updated_at: timestamp("updated_at").notNull(),
    UNIQUE: ["channel_id", "message_id", "speaker_name"],
});

const discussion_detail = pgTable("discussion_detail", {
    id: serial("id").primaryKey(),
    discussion_id: integer("discussion_id").notNull(),
    key: bigint("key").notNull(),
    speaker_name: text("speaker_name").notNull(),
    content: text("content"),
    UNIQUE: ["discussion_id", "key", "speaker_name"],
});

export {discussion_abstract, discussion_detail};
