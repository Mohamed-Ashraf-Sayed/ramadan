import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/quizzes/[id] - Get a single quiz
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const includeQuestions = searchParams.get("includeQuestions") === "true";

    const quiz = await prisma.quiz.findUnique({
      where: { id: parseInt(id) },
      include: {
        questions: includeQuestions
          ? {
              orderBy: { order: "asc" },
              select: {
                id: true,
                type: true,
                text: true,
                options: true,
                points: true,
                order: true,
                quizId: true,
                mediaUrl: true,
                mediaType: true,
              },
            }
          : false,
        _count: {
          select: {
            questions: true,
            submissions: true,
          },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    return NextResponse.json(quiz);
  } catch (error) {
    console.error("Error fetching quiz:", error);
    return NextResponse.json(
      { error: "Failed to fetch quiz" },
      { status: 500 }
    );
  }
}

// PUT /api/quizzes/[id] - Update a quiz (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, timeLimit, isActive } = body;

    const quiz = await prisma.quiz.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        timeLimit,
        isActive,
      },
    });

    return NextResponse.json(quiz);
  } catch (error) {
    console.error("Error updating quiz:", error);
    return NextResponse.json(
      { error: "Failed to update quiz" },
      { status: 500 }
    );
  }
}

// DELETE /api/quizzes/[id] - Delete a quiz (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.quiz.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting quiz:", error);
    return NextResponse.json(
      { error: "Failed to delete quiz" },
      { status: 500 }
    );
  }
}
