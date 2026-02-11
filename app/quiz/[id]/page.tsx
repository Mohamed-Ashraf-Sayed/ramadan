"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button, Input, Card, CardContent, CardHeader, CardFooter } from "@/components/ui";
import type { Quiz } from "@/types";

export default function QuizRegistrationPage() {
  const router = useRouter();
  const params = useParams();
  const quizId = params.id as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    async function fetchQuiz() {
      try {
        const response = await fetch(`/api/quizzes/${quizId}`);
        if (response.ok) {
          const data = await response.json();
          setQuiz(data);
        }
      } catch (error) {
        console.error("Error fetching quiz:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchQuiz();
  }, [quizId]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "الاسم مطلوب";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "الاسم يجب أن يكون 3 أحرف على الأقل";
    }

    if (formData.phone.trim() && !/^[0-9+]{10,15}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "رقم الجوال غير صالح";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);

    // Store participant info in sessionStorage
    sessionStorage.setItem(
      `quiz_${quizId}_participant`,
      JSON.stringify(formData)
    );

    // Navigate to quiz start page
    router.push(`/quiz/${quizId}/start`);
  };

  if (loading) {
    return (
      <div className="min-h-screen islamic-pattern flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen islamic-pattern flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary-dark mb-4">
            الاختبار غير موجود
          </h1>
          <Link href="/quiz">
            <Button>العودة للاختبارات</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen islamic-pattern py-12 px-4">
      <div className="max-w-lg mx-auto">
        <Link
          href="/quiz"
          className="inline-flex items-center text-primary hover:text-primary-dark mb-6 transition-colors"
        >
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          العودة للاختبارات
        </Link>

        <Card variant="elevated">
          <CardHeader>
            <h1 className="text-2xl font-bold text-primary-dark">
              {quiz.title}
            </h1>
            {quiz.description && (
              <p className="text-muted-foreground mt-2">{quiz.description}</p>
            )}
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                أدخل بياناتك للمشاركة في الاختبار
              </p>

              <Input
                label="الاسم الكامل"
                placeholder="أدخل اسمك"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                error={errors.name}
              />

              <Input
                label="رقم الجوال"
                type="tel"
                placeholder="05xxxxxxxx"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                error={errors.phone}
              />
            </CardContent>

            <CardFooter>
              <Button
                type="submit"
                className="w-full"
                size="lg"
                isLoading={submitting}
              >
                ابدأ الاختبار
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  );
}
