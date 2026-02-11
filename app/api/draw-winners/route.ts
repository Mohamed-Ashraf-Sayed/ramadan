import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/draw-winners - Get draw winners (optionally filtered by date range)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fromDate = searchParams.get("fromDate");
    const toDate = searchParams.get("toDate");

    const where: Record<string, unknown> = {};
    if (fromDate || toDate) {
      where.createdAt = {
        ...(fromDate ? { gte: new Date(fromDate) } : {}),
        ...(toDate ? { lte: new Date(toDate + "T23:59:59.999Z") } : {}),
      };
    }

    const winners = await prisma.drawWinner.findMany({
      where,
      include: {
        quiz: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(winners);
  } catch (error) {
    console.error("Error fetching draw winners:", error);
    return NextResponse.json(
      { error: "Failed to fetch draw winners" },
      { status: 500 }
    );
  }
}

// POST /api/draw-winners - Save a draw winner
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { quizId, name, phone, score, totalPoints, percentage } = body;

    if (!quizId || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const winner = await prisma.drawWinner.create({
      data: {
        quizId,
        name,
        phone: phone || null,
        score: score || 0,
        totalPoints: totalPoints || 0,
        percentage: percentage || 0,
      },
      include: {
        quiz: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return NextResponse.json(winner, { status: 201 });
  } catch (error) {
    console.error("Error saving draw winner:", error);
    return NextResponse.json(
      { error: "Failed to save draw winner" },
      { status: 500 }
    );
  }
}
