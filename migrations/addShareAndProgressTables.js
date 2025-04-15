// migrations/addShareAndProgressTables.js
import { drizzle } from "drizzle-orm/neon-http";
import { sql } from "drizzle-orm";
import dotenv from 'dotenv';

// Load environment variables just in case this is run directly
dotenv.config();

// Create the migration function
async function runMigration() {
  // Connect to the database
  const db = drizzle(process.env.NEXT_PUBLIC_DATABASE_CONNECTION_STRING);
  
  console.log("Starting migration...");
  
  try {
    // Create the SHARED_COURSES_TABLE if it doesn't exist
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "sharedCourses" (
        "id" SERIAL PRIMARY KEY,
        "courseId" VARCHAR NOT NULL,
        "sharedBy" VARCHAR NOT NULL,
        "sharedWith" VARCHAR NOT NULL,
        "sharedVia" VARCHAR DEFAULT 'link',
        "sharedAt" TIMESTAMP DEFAULT NOW(),
        "accessGranted" BOOLEAN DEFAULT TRUE
      );
    `);
    
    console.log("Created sharedCourses table");
    
    // Create the USER_PROGRESS_TABLE if it doesn't exist
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "userProgress" (
        "id" SERIAL PRIMARY KEY,
        "userId" VARCHAR NOT NULL,
        "courseId" VARCHAR NOT NULL,
        "progress" INTEGER DEFAULT 0,
        "lastAccessed" TIMESTAMP DEFAULT NOW(),
        "chaptersCompleted" JSONB DEFAULT '[]',
        "quizScores" JSONB DEFAULT '{}'
      );
    `);
    
    console.log("Created userProgress table");
    
    // Add isPublic column to STUDY_MATERIAL_TABLE if it doesn't exist
    await db.execute(sql`
      ALTER TABLE "studyMaterial"
      ADD COLUMN IF NOT EXISTS "isPublic" BOOLEAN DEFAULT FALSE;
    `);
    
    console.log("Added isPublic column to studyMaterial table");
    
    // Add clerkId column to USER_TABLE if it doesn't exist
    await db.execute(sql`
      ALTER TABLE "users"
      ADD COLUMN IF NOT EXISTS "clerkId" VARCHAR UNIQUE;
    `);
    
    console.log("Added clerkId column to users table");
    
    // Add createdAt column to STUDY_MATERIAL_TABLE if it doesn't exist
    await db.execute(sql`
      ALTER TABLE "studyMaterial"
      ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP DEFAULT NOW();
    `);
    
    console.log("Added createdAt column to studyMaterial table");
    
    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
}

// Run the migration if this file is executed directly
if (import.meta.url === import.meta.resolve('./addShareAndProgressTables.js')) {
  runMigration()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Migration failed:", err);
      process.exit(1);
    });
}

export default runMigration;