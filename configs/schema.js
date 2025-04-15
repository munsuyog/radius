import {
  pgTable,
  serial,
  varchar,
  boolean,
  json,
  integer,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const USER_TABLE = pgTable("users", {
  id: serial().primaryKey(),
  name: varchar().notNull(),
  email: varchar().unique().notNull(),
  isMember: boolean().default(false),
  customerId: varchar(),
  clerkId: varchar().unique(), // Add Clerk user ID for reference
});

export const STUDY_MATERIAL_TABLE = pgTable("studyMaterial", {
  id: serial().primaryKey(),
  courseId: varchar().notNull(),
  courseType: varchar().notNull(),
  topic: varchar().notNull(),
  difficultyLevel: varchar().default("Easy"),
  courseLayout: json(),
  createdBy: varchar().notNull(),
  status: varchar().default("Generating"),
  createdAt: timestamp().defaultNow(),
  isPublic: boolean().default(false),
});

export const CHAPTER_NOTES_NAME = pgTable("chapterNotes", {
  id: serial().primaryKey(),
  courseId: varchar().notNull(),
  chapterId: integer().notNull(),
  notes: text(),
});

export const STUDY_TYPE_CONTENT_TABLE = pgTable("studyTypeContent", {
  id: serial().primaryKey(),
  courseId: varchar().notNull(),
  content: json(),
  type: varchar().notNull(),
  status: varchar().default("Generating"),
});

export const PAYMENT_RECORD_TABLE = pgTable("paymentRecord", {
  id: serial().primaryKey(),
  customerId: varchar(),
  sessionId: varchar(),
});

// New table for shared courses
export const SHARED_COURSES_TABLE = pgTable("sharedCourses", {
  id: serial().primaryKey(),
  courseId: varchar().notNull(),
  sharedBy: varchar().notNull(), // Clerk user ID of the sender
  sharedWith: varchar().notNull(), // Clerk user ID of the recipient
  sharedVia: varchar().default("link"), // link, email, etc.
  sharedAt: timestamp().defaultNow(),
  accessGranted: boolean().default(true),
});

// Table for user progress tracking
export const USER_PROGRESS_TABLE = pgTable("userProgress", {
  id: serial().primaryKey(),
  userId: varchar().notNull(),
  courseId: varchar().notNull(),
  progress: integer().default(0), // Percentage of completion
  lastAccessed: timestamp().defaultNow(),
  chaptersCompleted: json().default([]), // Array of completed chapter IDs
  quizScores: json().default({}), // Object with quiz scores
});