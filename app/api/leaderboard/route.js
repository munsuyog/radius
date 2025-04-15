import { db } from "@/configs/db";
import { STUDY_MATERIAL_TABLE, USER_TABLE } from "@/configs/schema";
import { count, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    // Get top 10 users based on number of courses completed
    const leaderboard = await db
      .select({
        userId: USER_TABLE.id,
        name: USER_TABLE.name,
        email: USER_TABLE.email,
        courseCount: count(STUDY_MATERIAL_TABLE.id)
      })
      .from(USER_TABLE)
      .leftJoin(
        STUDY_MATERIAL_TABLE,
        eq(USER_TABLE.email, STUDY_MATERIAL_TABLE.createdBy)
      )
      .where(eq(STUDY_MATERIAL_TABLE.status, "ready"))
      .groupBy(USER_TABLE.id)
      .orderBy(({ courseCount }) => courseCount, 'desc')
      .limit(10);

    return NextResponse.json({ result: leaderboard });
  } catch (error) {
    console.error("Leaderboard fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}