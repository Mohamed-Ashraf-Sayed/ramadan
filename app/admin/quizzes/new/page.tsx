"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Input, Textarea, Card, CardContent, CardHeader, CardFooter, useToast } from "@/components/ui";

export default function NewQuizPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    timeLimit: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "عنوان الاختبار مطلوب";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const dataToSend = {
        ...formData,
        timeLimit: formData.timeLimit ? parseInt(formData.timeLimit) : null,
      };

      const response = await fetch("/api/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        const quiz = await response.json();
        router.push(`/admin/quizzes/${quiz.id}`);
      } else {
        toast("حدث خطأ أثناء إنشاء الاختبار", "error");
      }
    } catch (error) {
      console.error("Error creating quiz:", error);
      toast("حدث خطأ أثناء إنشاء الاختبار", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href="/admin/quizzes"
        className="inline-flex items-center text-primary hover:text-primary-dark mb-6 transition-colors"
      >
        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        العودة للاختبارات
      </Link>

      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold text-primary-dark">إنشاء اختبار جديد</h1>
          <p className="text-muted-foreground mt-1">
            أدخل معلومات الاختبار الأساسية ثم أضف الأسئلة
          </p>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <Input
              label="عنوان الاختبار"
              placeholder="مثال: اختبار السيرة النبوية"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              error={errors.title}
            />

            <Textarea
              label="وصف الاختبار (اختياري)"
              placeholder="وصف مختصر للاختبار..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
            />

            <div>
              <Input
                type="number"
                label="مدة الاختبار بالدقائق (اختياري)"
                placeholder="مثال: 15"
                value={formData.timeLimit}
                onChange={(e) =>
                  setFormData({ ...formData, timeLimit: e.target.value })
                }
                min={1}
                helperText="اتركه فارغاً إذا كنت لا تريد تحديد وقت"
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-3">
            <Link href="/admin/quizzes">
              <Button variant="outline" type="button">
                إلغاء
              </Button>
            </Link>
            <Button type="submit" isLoading={loading}>
              إنشاء وإضافة الأسئلة
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
