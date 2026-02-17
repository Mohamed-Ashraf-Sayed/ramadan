import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/submissions/check?quizId=X&fingerprint=Y - Check if device already completed a quiz
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const quizId = searchParams.get("quizId");
  const fingerprint = searchParams.get("fingerprint");

  if (!quizId) {
    return NextResponse.json({ completed: false });
  }

  // Check cookie first
  const cookie = request.cookies.get("completed_quizzes")?.value;
  if (cookie) {
    try {
      const completedIds = JSON.parse(cookie) as number[];
      if (completedIds.includes(parseInt(quizId))) {
        return NextResponse.json({ completed: true });
      }
    } catch { /* ignore */ }
  }

  // Check fingerprint in database
  if (fingerprint) {
    try {
      const existing = await prisma.submission.findFirst({
        where: {
          quizId: parseInt(quizId),
          fingerprint,
        },
      });
      if (existing) {
        return NextResponse.json({ completed: true });
      }
    } catch { /* ignore */ }
  }

  return NextResponse.json({ completed: false });
}
