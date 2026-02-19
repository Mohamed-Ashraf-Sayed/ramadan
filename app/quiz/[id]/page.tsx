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
    gender: "" as "" | "male" | "female",
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
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
    } else {
      const nameParts = formData.name.trim().split(/\s+/);
      const isHarm = /^حرم[/\s]/.test(formData.name.trim()) || nameParts[0] === "حرم";
      if (isHarm) {
        // حرم + اسم رباعي = 5 أجزاء على الأقل
        const nameAfterHarm = nameParts.slice(1).filter(p => p !== "/" && p !== "-");
        if (nameAfterHarm.length < 4) {
          newErrors.name = "يرجى كتابة: حرم / اسم الزوج رباعي";
        }
      } else if (nameParts.length < 4) {
        newErrors.name = "يرجى كتابة الاسم رباعي";
      }
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "رقم الجوال مطلوب";
    } else if (!/^[0-9+]{10,15}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "رقم الجوال غير صالح";
    }

    if (!formData.gender) {
      newErrors.gender = "يرجى اختيار الجنس";
    }

    if (!agreedToTerms) {
      newErrors.terms = "يجب الموافقة على شروط المشاركة";
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

              {/* Gender Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">الجنس</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, gender: "male" })}
                    className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all border-2 ${
                      formData.gender === "male"
                        ? "bg-primary/10 text-primary border-primary"
                        : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    ذكر
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, gender: "female" })}
                    className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all border-2 ${
                      formData.gender === "female"
                        ? "bg-primary/10 text-primary border-primary"
                        : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    أنثى
                  </button>
                </div>
                {errors.gender && <p className="text-error text-xs mt-1">{errors.gender}</p>}
              </div>

              {/* Terms & Conditions */}
              <div className="space-y-3 mt-4">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
                  <h4 className="font-bold text-amber-800 text-sm">شروط المشاركة :</h4>
                  <ul className="space-y-1.5 text-sm text-amber-700">
                    <li className="flex items-start gap-2">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0"></span>
                      المسابقة حصرياً لـ أفراد الأسرة وزوجات الأبناء فقط.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0"></span>
                      يحق لكل فرد في العائلة التسجيل باسمه، لكن يمنع تكرار الاسم لكي لا يُلغى سحبك!
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0"></span>
                      يجب الدقة في تعبئة البيانات للدخول في السحب.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0"></span>
                      بالنسبة لزوجات الأبناء تكتب: حرم / اسم الزوج رباعي.
                    </li>
                  </ul>
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm font-medium text-foreground">قرأت جميع شروط المسابقة وأوافق عليها</span>
                </label>
                {errors.terms && <p className="text-error text-xs">{errors.terms}</p>}
              </div>
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
