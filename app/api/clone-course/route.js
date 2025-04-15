import { db } from "@/configs/db";
import { STUDY_MATERIAL_TABLE, CHAPTER_NOTES_NAME, STUDY_TYPE_CONTENT_TABLE } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
  try {
    const { courseId, email } = await req.json();
    
    if (!courseId || !email) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Get the original course
    const originalCourse = await db
      .select()
      .from(STUDY_MATERIAL_TABLE)
      .where(eq(STUDY_MATERIAL_TABLE.courseId, courseId));

    if (!originalCourse || originalCourse.length === 0) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // Generate a new courseId for the cloned course
    const newCourseId = uuidv4();
    
    // Clone the course in the study material table
    const clonedCourse = await db
      .insert(STUDY_MATERIAL_TABLE)
      .values({
        courseId: newCourseId,
        courseType: originalCourse[0].courseType,
        topic: originalCourse[0].topic,
        difficultyLevel: originalCourse[0].difficultyLevel,
        courseLayout: originalCourse[0].courseLayout,
        createdBy: email,
        status: "ready", // Set as ready since we're cloning
      })
      .returning({ id: STUDY_MATERIAL_TABLE.id });

    // Clone chapter notes if they exist
    const originalNotes = await db
      .select()
      .from(CHAPTER_NOTES_NAME)
      .where(eq(CHAPTER_NOTES_NAME.courseId, courseId));

    if (originalNotes && originalNotes.length > 0) {
      const notesValues = originalNotes.map(note => ({
        courseId: newCourseId,
        chapterId: note.chapterId,
        notes: note.notes
      }));
      
      await db.insert(CHAPTER_NOTES_NAME).values(notesValues);
    }

    // Clone study type content if it exists
    const originalContent = await db
      .select()
      .from(STUDY_TYPE_CONTENT_TABLE)
      .where(eq(STUDY_TYPE_CONTENT_TABLE.courseId, courseId));

    if (originalContent && originalContent.length > 0) {
      const contentValues = originalContent.map(content => ({
        courseId: newCourseId,
        content: content.content,
        type: content.type,
        status: content.status
      }));
      
      await db.insert(STUDY_TYPE_CONTENT_TABLE).values(contentValues);
    }

    return NextResponse.json({ 
      success: true, 
      courseId: newCourseId 
    });
  } catch (error) {
    console.error("Course cloning error:", error);
    return NextResponse.json(
      { error: "Failed to clone course" },
      { status: 500 }
    );
  }
}