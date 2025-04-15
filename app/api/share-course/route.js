import { db } from "@/configs/db";
import { SHARED_COURSES_TABLE, STUDY_MATERIAL_TABLE } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { courseId, recipientEmail, shareType } = await req.json();
    
    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    // Verify the course exists and belongs to the current user
    const courseCheck = await db
      .select({ createdBy: STUDY_MATERIAL_TABLE.createdBy })
      .from(STUDY_MATERIAL_TABLE)
      .where(eq(STUDY_MATERIAL_TABLE.courseId, courseId));

    if (courseCheck.length === 0) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // Set course to public
    await db
      .update(STUDY_MATERIAL_TABLE)
      .set({ isPublic: true })
      .where(eq(STUDY_MATERIAL_TABLE.courseId, courseId));

    // If sharing directly with a recipient
    if (recipientEmail) {
      // Lookup the recipient's Clerk user ID
      const recipientUser = await db
        .select({ clerkId: USER_TABLE.clerkId })
        .from(USER_TABLE)
        .where(eq(USER_TABLE.email, recipientEmail));

      if (recipientUser.length > 0) {
        // Record the share in the database
        await db.insert(SHARED_COURSES_TABLE).values({
          courseId: courseId,
          sharedBy: userId,
          sharedWith: recipientUser[0].clerkId,
          sharedVia: shareType || "direct",
        });
      }
    }

    return NextResponse.json({ 
      success: true,
      shareUrl: `${process.env.NEXT_PUBLIC_BASE_URL || "https://radius-gamma.vercel.app"}/shared/${courseId}`
    });
  } catch (error) {
    console.error("Failed to share course:", error);
    return NextResponse.json(
      { error: "Failed to share course" },
      { status: 500 }
    );
  }
}