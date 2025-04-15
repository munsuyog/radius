import { db } from "@/configs/db";
import { USER_PROGRESS_TABLE } from "@/configs/schema";
import { and, eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// GET progress for a specific course
export async function GET(req) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const url = new URL(req.url);
    const courseId = url.searchParams.get("courseId");

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    const progress = await db
      .select()
      .from(USER_PROGRESS_TABLE)
      .where(
        and(
          eq(USER_PROGRESS_TABLE.userId, userId),
          eq(USER_PROGRESS_TABLE.courseId, courseId)
        )
      );

    // If no progress record exists yet, return default values
    if (progress.length === 0) {
      return NextResponse.json({
        result: {
          progress: 0,
          chaptersCompleted: [],
          quizScores: {},
        },
      });
    }

    return NextResponse.json({ result: progress[0] });
  } catch (error) {
    console.error("Failed to fetch progress:", error);
    return NextResponse.json(
      { error: "Failed to fetch progress" },
      { status: 500 }
    );
  }
}

// POST/update progress for a course
export async function POST(req) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { courseId, progress, chaptersCompleted, quizScores } = await req.json();

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    // Check if a progress record already exists
    const existingProgress = await db
      .select({ id: USER_PROGRESS_TABLE.id })
      .from(USER_PROGRESS_TABLE)
      .where(
        and(
          eq(USER_PROGRESS_TABLE.userId, userId),
          eq(USER_PROGRESS_TABLE.courseId, courseId)
        )
      );

    let result;

    if (existingProgress.length > 0) {
      // Update existing record
      result = await db
        .update(USER_PROGRESS_TABLE)
        .set({
          progress: progress !== undefined ? progress : undefined,
          chaptersCompleted: chaptersCompleted !== undefined ? chaptersCompleted : undefined,
          quizScores: quizScores !== undefined ? quizScores : undefined,
          lastAccessed: new Date(),
        })
        .where(eq(USER_PROGRESS_TABLE.id, existingProgress[0].id))
        .returning();
    } else {
      // Create new record
      result = await db
        .insert(USER_PROGRESS_TABLE)
        .values({
          userId,
          courseId,
          progress: progress || 0,
          chaptersCompleted: chaptersCompleted || [],
          quizScores: quizScores || {},
        })
        .returning();
    }

    return NextResponse.json({ result: result[0] });
  } catch (error) {
    console.error("Failed to update progress:", error);
    return NextResponse.json(
      { error: "Failed to update progress" },
      { status: 500 }
    );
  }
}