import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const muxData = await db.muxData.findFirst({
      where: {
        chapterId: params.chapterId,
      },
    });

    if (!muxData) {
      return NextResponse.json({ error: "MuxData not found" }, { status: 404 });
    }

    return NextResponse.json({ status: muxData.status });
  } catch (error) {
    console.error("Error fetching video status:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
