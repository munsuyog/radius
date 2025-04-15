import { db } from "@/configs/db";
import { SHARED_COURSES_TABLE, STUDY_MATERIAL_TABLE } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get all courses shared with the user
    const sharedCourses = await db
      .select({
        courseId: SHARED_COURSES_TABLE.courseId,
        sharedAt: SHARED_COURSES_TABLE.sharedAt,
        sharedBy: SHARED_COURSES_TABLE.sharedBy,
        course: STUDY_MATERIAL_TABLE
      })
      .from(SHARED_COURSES_TABLE)
      .innerJoin(
        STUDY_MATERIAL_TABLE,
        eq(SHARED_COURSES_TABLE.courseId, STUDY_MATERIAL_TABLE.courseId)
      )
      .where(eq(SHARED_COURSES_TABLE.sharedWith, userId));

    return NextResponse.json({ result: sharedCourses });
  } catch (error) {
    console.error("Failed to fetch shared courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch shared courses" },
      { status: 500 }
    );
  }
}