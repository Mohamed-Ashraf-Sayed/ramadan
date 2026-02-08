"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button, Card, CardContent, useToast } from "@/components/ui";
import QuestionRenderer from "@/components/quiz/QuestionRenderer";
import type { Quiz, Question, ParticipantInfo } from "@/types";

export default function QuizStartPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const quizId = params.id as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | string[] | boolean>>({});
  const [participant, setParticipant] = useState<ParticipantInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null); // Time left in seconds
  const hasAutoSubmitted = useRef(false);

  useEffect(() => {
    // Check if participant info exists
    const participantData = sessionStorage.getItem(`quiz_${quizId}_participant`);
    if (!participantData) {
      router.push(`/quiz/${quizId}`);
      return;
    }
    setParticipant(JSON.parse(participantData));

    async function fetchQuiz() {
      try {
        const response = await fetch(`/api/quizzes/${quizId}?includeQuestions=true`);
        if (response.ok) {
          const data = await response.json();
          setQuiz(data);
          setQuestions(data.questions || []);
          // Set initial time if quiz has time limit
          if (data.timeLimit) {
            setTimeLeft(data.timeLimit * 60); // Convert minutes to seconds
          }
        }
      } catch (error) {
        console.error("Error fetching quiz:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchQuiz();
  }, [quizId, router]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Get timer color based on remaining time
  const getTimerColor = () => {
    if (timeLeft === null) return "text-muted-foreground";
    if (timeLeft <= 60) return "text-error"; // Last minute - red
    if (timeLeft <= 180) return "text-yellow-500"; // Last 3 minutes - yellow
    return "text-primary";
  };

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const answeredCount = Object.keys(answers).length;
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  const handleAnswer = (questionId: number, answer: string | string[] | boolean) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = useCallback(async (isAutoSubmit = false) => {
    if (!participant || submitting) return;

    setSubmitting(true);

    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizId: parseInt(quizId),
          ...participant,
          answers,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        // Clear participant data
        sessionStorage.removeItem(`quiz_${quizId}_participant`);
        // Navigate to result page
        router.push(`/result/${result.id}`);
      } else {
        if (!isAutoSubmit) {
          toast("حدث خطأ أثناء إرسال الإجابات", "error");
        }
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      if (!isAutoSubmit) {
        toast("حدث خطأ أثناء إرسال الإجابات", "error");
      }
    } finally {
      setSubmitting(false);
    }
  }, [participant, submitting, quizId, answers, router]);

  // Auto-submit when time runs out
  useEffect(() => {
    if (timeLeft === 0 && !hasAutoSubmitted.current && participant) {
      hasAutoSubmitted.current = true;
      handleSubmit(true);
    }
  }, [timeLeft, participant, handleSubmit]);

  if (loading) {
    return (
      <div className="min-h-screen islamic-pattern flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري تحميل الأسئلة...</p>
        </div>
      </div>
    );
  }

  if (!quiz || questions.length === 0) {
    return (
      <div className="min-h-screen islamic-pattern flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary-dark mb-4">
            لا توجد أسئلة في هذا الاختبار
          </h1>
          <Link href="/quiz">
            <Button>العودة للاختبارات</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen islamic-pattern py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h1 className="text-2xl font-bold text-primary-dark">
              {quiz.title}
            </h1>
            {/* Timer */}
            {timeLeft !== null && (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-white shadow-md ${getTimerColor()}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-bold text-lg font-mono">{formatTime(timeLeft)}</span>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>السؤال {currentQuestionIndex + 1} من {questions.length}</span>
            <span>{answeredCount} إجابة من {questions.length}</span>
          </div>
          {/* Progress Bar */}
          <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          {/* Time warning */}
          {timeLeft !== null && timeLeft <= 60 && timeLeft > 0 && (
            <p className="text-center text-sm text-error mt-2 animate-pulse">
              تبقى أقل من دقيقة! سيتم إرسال الإجابات تلقائياً
            </p>
          )}
        </div>

        {/* Question Card */}
        <Card variant="elevated" className="mb-6">
          <CardContent className="py-6">
            {/* Question Number Badge */}
            <div className="flex items-center gap-3 mb-4">
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                {currentQuestionIndex + 1}
              </span>
              <span className="text-sm text-muted-foreground">
                {currentQuestion.type === "MULTIPLE_CHOICE" && "اختيار من متعدد"}
                {currentQuestion.type === "TRUE_FALSE" && "صح أو خطأ"}
                {currentQuestion.type === "ORDERING" && "ترتيب"}
              </span>
              <span className="mr-auto text-sm text-accent font-medium">
                {currentQuestion.points} {currentQuestion.points === 1 ? "نقطة" : "نقاط"}
              </span>
            </div>

            {/* Question Text */}
            <h2 className="text-xl font-medium text-foreground mb-6">
              {currentQuestion.text}
            </h2>

            {/* Answer Options */}
            <QuestionRenderer
              question={currentQuestion}
              answer={answers[currentQuestion.id] ?? null}
              onAnswer={handleAnswer}
            />
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            السابق
          </Button>

          {/* Question Dots */}
          <div className="flex-1 flex justify-center gap-1 flex-wrap max-w-xs">
            {questions.map((q, index) => (
              <button
                key={q.id}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentQuestionIndex
                    ? "bg-primary scale-125"
                    : answers[q.id] !== undefined
                    ? "bg-success"
                    : "bg-muted hover:bg-brown-300"
                }`}
                title={`السؤال ${index + 1}`}
              />
            ))}
          </div>

          {isLastQuestion ? (
            <Button
              onClick={() => handleSubmit(false)}
              isLoading={submitting}
              disabled={answeredCount < questions.length}
            >
              إرسال الإجابات
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </Button>
          ) : (
            <Button onClick={handleNext}>
              التالي
              <svg className="w-5 h-5 mr-2 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Button>
          )}
        </div>

        {/* Warning if not all answered */}
        {isLastQuestion && answeredCount < questions.length && (
          <p className="text-center text-sm text-error mt-4">
            يرجى الإجابة على جميع الأسئلة قبل الإرسال
          </p>
        )}
      </div>
    </main>
  );
}
