import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

// GET /api/admin/stats - Get dashboard statistics
export async function GET() {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;

  try {
    const [
      totalQuizzes,
      activeQuizzes,
      totalSubmissions,
      totalQuestions,
      recentSubmissions,
      topQuizzes,
    ] = await Promise.all([
      prisma.quiz.count(),
      prisma.quiz.count({ where: { isActive: true } }),
      prisma.submission.count(),
      prisma.question.count(),
      prisma.submission.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          quiz: {
            select: { title: true },
          },
        },
      }),
      prisma.quiz.findMany({
        take: 5,
        include: {
          _count: {
            select: { submissions: true },
          },
        },
        orderBy: {
          submissions: {
            _count: "desc",
          },
        },
      }),
    ]);

    // Calculate average score
    const avgScoreResult = await prisma.submission.aggregate({
      _avg: {
        percentage: true,
      },
    });

    return NextResponse.json({
      totalQuizzes,
      activeQuizzes,
      totalSubmissions,
      totalQuestions,
      averageScore: avgScoreResult._avg.percentage || 0,
      recentSubmissions,
      topQuizzes,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
