import { NextRequest, NextResponse } from "next/server";

// GET /api/submissions/check?quizId=X - Check if device already completed a quiz (via cookie)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const quizId = searchParams.get("quizId");

  if (!quizId) {
    return NextResponse.json({ completed: false });
  }

  const cookie = request.cookies.get("completed_quizzes")?.value;
  if (!cookie) {
    return NextResponse.json({ completed: false });
  }

  try {
    const completedIds = JSON.parse(cookie) as number[];
    return NextResponse.json({ completed: completedIds.includes(parseInt(quizId)) });
  } catch {
    return NextResponse.json({ completed: false });
  }
}
