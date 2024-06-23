//import {integer, text, pgTable, timestamp, bigint, serial} from "drizzle-orm/pg-core";
//
//export const discussion_abstract = pgTable("discussion_abstract", {
//    id: serial("id").primaryKey(),
//    channel_id: text("channel_id").notNull(),
//    message_id: text("message_id").notNull(),
//    speaker_name: text("speaker_name").notNull(),
//    content: text("content"),
//    created_at: timestamp("created_at").notNull(),
//    updated_at: timestamp("updated_at").notNull(),
//    UNIQUE: ["channel_id", "message_id", "speaker_name"],
//});
//
//export const discussion_detail = pgTable("discussion_detail", {
//    id: serial("id").primaryKey(),
//    discussion_id: integer("discussion_id").notNull(),
//    key: bigint("key").notNull(),
//    speaker_name: text("speaker_name").notNull(),
//    content: text("content"),
//    UNIQUE: ["discussion_id", "key", "speaker_name"],
//});
//
//
import {
    integer,
    text,
    pgTable,
    timestamp,
    bigint,
    serial,
    uniqueIndex,
} from "drizzle-orm/pg-core";

export const discussion_abstracts = pgTable(
    "discussion_abstracts",
    {
        id: serial("id").primaryKey(),
        channel_id: text("channel_id").notNull(),
        message_id: text("message_id").notNull(),
        speaker_name: text("speaker_name").notNull(),
        content: text("content"),
        created_at: timestamp("created_at").notNull(),
        updated_at: timestamp("updated_at").notNull(),
    },
    table => {
        return {
            uniqueConstraint: uniqueIndex("unique_discussion_abstracts").on(
                table.channel_id,
                table.message_id,
                table.speaker_name,
            ),
        };
    },
);

export const discussion_details = pgTable(
    "discussion_details",
    {
        id: serial("id").primaryKey(),
        discussion_id: integer("discussion_id").notNull(),
        key: bigint("key").notNull(),
        speaker_name: text("speaker_name").notNull(),
        content: text("content"),
    },
    table => {
        return {
            uniqueConstraint: uniqueIndex("unique_discussion_detail").on(
                table.discussion_id,
                table.key,
                table.speaker_name,
            ),
        };
    },
);
