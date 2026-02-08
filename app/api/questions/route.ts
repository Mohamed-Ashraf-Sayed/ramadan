import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

// GET /api/questions - Get questions for a quiz
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const quizId = searchParams.get("quizId");

    if (!quizId) {
      return NextResponse.json(
        { error: "Quiz ID is required" },
        { status: 400 }
      );
    }

    const questions = await prisma.question.findMany({
      where: { quizId: parseInt(quizId) },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}

// POST /api/questions - Create a new question (Admin only)
export async function POST(request: NextRequest) {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;

  try {
    const body = await request.json();
    const { quizId, type, text, options, correctAnswer, points = 1, order, mediaUrl, mediaType } = body;

    if (!quizId || !type || !text || correctAnswer === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get the next order if not provided
    let questionOrder = order;
    if (questionOrder === undefined) {
      const lastQuestion = await prisma.question.findFirst({
        where: { quizId },
        orderBy: { order: "desc" },
      });
      questionOrder = lastQuestion ? lastQuestion.order + 1 : 1;
    }

    const question = await prisma.question.create({
      data: {
        quizId,
        type,
        text,
        options,
        correctAnswer,
        mediaUrl: mediaUrl || null,
        mediaType: mediaType || null,
        points,
        order: questionOrder,
      },
    });

    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    console.error("Error creating question:", error);
    return NextResponse.json(
      { error: "Failed to create question" },
      { status: 500 }
    );
  }
}
