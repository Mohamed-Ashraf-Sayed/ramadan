import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/submissions - Get all submissions (Admin only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const quizId = searchParams.get("quizId");

    const fromDate = searchParams.get("fromDate");
    const toDate = searchParams.get("toDate");

    const phone = searchParams.get("phone");

    const where: Record<string, unknown> = {};
    if (quizId) where.quizId = parseInt(quizId);
    if (phone) where.phone = phone;
    if (fromDate || toDate) {
      where.createdAt = {
        ...(fromDate ? { gte: new Date(fromDate) } : {}),
        ...(toDate ? { lte: new Date(toDate + "T23:59:59.999Z") } : {}),
      };
    }

    const submissions = await prisma.submission.findMany({
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

    return NextResponse.json(submissions);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json(
      { error: "Failed to fetch submissions" },
      { status: 500 }
    );
  }
}

// POST /api/submissions - Submit quiz answers
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { quizId, name, phone, answers } = body;

    if (!quizId || !name || !answers) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get quiz with questions
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: true,
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    // Check for duplicate submission by device cookie
    const completedCookie = request.cookies.get("completed_quizzes")?.value;
    if (completedCookie) {
      try {
        const completedIds = JSON.parse(completedCookie) as number[];
        if (completedIds.includes(quizId)) {
          return NextResponse.json(
            { error: "لقد شاركت في هذا الاختبار من قبل" },
            { status: 409 }
          );
        }
      } catch { /* ignore malformed cookie */ }
    }

    // Check for duplicate submission by phone number
    if (phone) {
      const existing = await prisma.submission.findFirst({
        where: { quizId, phone },
      });
      if (existing) {
        return NextResponse.json(
          { error: "لقد شاركت في هذا الاختبار من قبل" },
          { status: 409 }
        );
      }
    }

    // Helper function to parse JSON field
    function parseJsonField<T>(value: unknown): T {
      if (typeof value === "string") {
        try {
          return JSON.parse(value) as T;
        } catch {
          return value as T;
        }
      }
      return value as T;
    }

    // Normalize Arabic text for fuzzy matching
    function normalizeArabicText(text: string): string {
      return text
        .trim()
        .replace(/[\u064B-\u065F\u0670]/g, "") // Remove diacritics
        .replace(/\s+/g, " ")                    // Normalize whitespace
        .replace(/[أإآٱ]/g, "ا")                 // Normalize alef variants
        .replace(/ة/g, "ه")                      // Ta marbuta -> Ha
        .replace(/ى/g, "ي")                      // Alef maqsura -> Ya
        .replace(/^(ال)/g, "")                   // Remove leading "ال"
        .toLowerCase()
        .trim();
    }

    // Levenshtein distance for fuzzy matching
    function levenshtein(a: string, b: string): number {
      const matrix: number[][] = [];
      for (let i = 0; i <= a.length; i++) matrix[i] = [i];
      for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
      for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
          const cost = a[i - 1] === b[j - 1] ? 0 : 1;
          matrix[i][j] = Math.min(
            matrix[i - 1][j] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j - 1] + cost
          );
        }
      }
      return matrix[a.length][b.length];
    }

    // Fuzzy match for text answers
    function fuzzyMatch(userAnswer: string, correctAnswer: string): boolean {
      const normalizedUser = normalizeArabicText(String(userAnswer));
      const normalizedCorrect = normalizeArabicText(String(correctAnswer));

      // Exact match after normalization
      if (normalizedUser === normalizedCorrect) return true;

      // Check with "ال" prefix tolerance
      if (normalizedUser === "ال" + normalizedCorrect || "ال" + normalizedUser === normalizedCorrect) return true;

      // Levenshtein distance - allow small errors based on length
      const maxLen = Math.max(normalizedUser.length, normalizedCorrect.length);
      if (maxLen === 0) return false;
      const distance = levenshtein(normalizedUser, normalizedCorrect);
      const similarity = 1 - distance / maxLen;

      // Accept if 80% similar or more
      return similarity >= 0.8;
    }

    // Calculate score
    let score = 0;
    let totalPoints = 0;

    console.log("=== SCORING DEBUG ===");
    console.log("answers keys:", Object.keys(answers));
    console.log("questions ids:", quiz.questions.map(q => q.id));

    for (const question of quiz.questions) {
      totalPoints += question.points;
      const userAnswer = answers[question.id];
      // Parse the correct answer from JSON
      const correctAnswer = parseJsonField(question.correctAnswer);

      console.log(`Q${question.id} (${question.type}):`, {
        rawCorrectAnswer: question.correctAnswer,
        parsedCorrectAnswer: correctAnswer,
        correctType: typeof correctAnswer,
        userAnswer,
        userType: typeof userAnswer,
        keyLookup: `answers[${question.id}] = ${JSON.stringify(answers[question.id])}`,
        stringKeyLookup: `answers["${question.id}"] = ${JSON.stringify(answers[String(question.id)])}`,
      });

      if (userAnswer !== undefined) {
        // Compare answers based on type
        if (question.type === "ORDERING") {
          // For ordering, compare arrays
          const parsedCorrect = Array.isArray(correctAnswer) ? correctAnswer : parseJsonField<string[]>(correctAnswer);
          if (
            Array.isArray(userAnswer) &&
            Array.isArray(parsedCorrect) &&
            JSON.stringify(userAnswer) === JSON.stringify(parsedCorrect)
          ) {
            score += question.points;
          }
        } else if (question.type === "TRUE_FALSE") {
          // For true/false - handle both boolean and string comparison
          const parsedCorrect = typeof correctAnswer === "boolean" ? correctAnswer : correctAnswer === true || correctAnswer === "true";
          const parsedUser = typeof userAnswer === "boolean" ? userAnswer : userAnswer === true || userAnswer === "true";
          if (parsedUser === parsedCorrect) {
            score += question.points;
          }
        } else if (question.type === "IMAGE_TEXT") {
          // For image+text - fuzzy string matching
          if (fuzzyMatch(String(userAnswer), String(correctAnswer))) {
            score += question.points;
          }
        } else {
          // For multiple choice - direct string comparison
          if (userAnswer === correctAnswer) {
            score += question.points;
          }
        }
      }
    }

    console.log(`=== FINAL SCORE: ${score}/${totalPoints} ===`);

    const percentage = totalPoints > 0 ? (score / totalPoints) * 100 : 0;

    // Create submission
    const submission = await prisma.submission.create({
      data: {
        quizId,
        name,
        phone,
        answers,
        score,
        totalPoints,
        percentage,
      },
    });

    // Set cookie to mark quiz as completed on this device
    const prevCompleted = completedCookie ? JSON.parse(completedCookie) as number[] : [];
    prevCompleted.push(quizId);
    const response = NextResponse.json(submission, { status: 201 });
    response.cookies.set("completed_quizzes", JSON.stringify(prevCompleted), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 120, // 120 days
      path: "/",
    });
    return response;
  } catch (error) {
    console.error("Error creating submission:", error);
    return NextResponse.json(
      { error: "Failed to submit quiz" },
      { status: 500 }
    );
  }
}
