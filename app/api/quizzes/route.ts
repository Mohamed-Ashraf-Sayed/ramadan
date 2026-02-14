import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

// GET /api/quizzes - Get all quizzes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all") === "true";

    // Auto-deactivate expired quizzes
    const activeQuizzes = await prisma.quiz.findMany({
      where: { isActive: true, startedAt: { not: null }, timeLimit: { not: null } },
      select: { id: true, startedAt: true, timeLimit: true },
    });

    const now = new Date();
    const expiredIds: number[] = [];
    for (const q of activeQuizzes) {
      if (q.startedAt && q.timeLimit) {
        const endsAt = new Date(q.startedAt);
        endsAt.setHours(endsAt.getHours() + q.timeLimit);
        if (now > endsAt) expiredIds.push(q.id);
      }
    }
    if (expiredIds.length > 0) {
      await prisma.quiz.updateMany({
        where: { id: { in: expiredIds } },
        data: { isActive: false },
      });
    }

    const quizzes = await prisma.quiz.findMany({
      where: all ? {} : { isActive: true },
      include: {
        _count: {
          select: {
            questions: true,
            submissions: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(quizzes);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return NextResponse.json(
      { error: "Failed to fetch quizzes" },
      { status: 500 }
    );
  }
}

// POST /api/quizzes - Create a new quiz (Admin only)
export async function POST(request: NextRequest) {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;

  try {
    const body = await request.json();
    const { title, description, timeLimit, isActive = false } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const quiz = await prisma.quiz.create({
      data: {
        title,
        description,
        timeLimit,
        isActive,
      },
    });

    return NextResponse.json(quiz, { status: 201 });
  } catch (error) {
    console.error("Error creating quiz:", error);
    return NextResponse.json(
      { error: "Failed to create quiz" },
      { status: 500 }
    );
  }
}
