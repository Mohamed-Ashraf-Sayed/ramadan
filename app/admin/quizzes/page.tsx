"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button, Card, CardContent } from "@/components/ui";
import type { Quiz } from "@/types";

export default function AdminQuizzesPage() {
  const [quizzes, setQuizzes] = useState<(Quiz & { _count: { questions: number; submissions: number } })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  async function fetchQuizzes() {
    try {
      const response = await fetch("/api/quizzes");
      if (response.ok) {
        const data = await response.json();
        setQuizzes(data);
      }
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    } finally {
      setLoading(false);
    }
  }

  async function toggleQuizStatus(quiz: Quiz) {
    try {
      const response = await fetch(`/api/quizzes/${quiz.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !quiz.isActive }),
      });

      if (response.ok) {
        fetchQuizzes();
      }
    } catch (error) {
      console.error("Error updating quiz:", error);
    }
  }

  async function deleteQuiz(id: number) {
    if (!confirm("هل أنت متأكد من حذف هذا الاختبار؟")) return;

    try {
      const response = await fetch(`/api/quizzes/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchQuizzes();
      }
    } catch (error) {
      console.error("Error deleting quiz:", error);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary-dark">الاختبارات</h1>
          <p className="text-muted-foreground mt-1">إدارة جميع الاختبارات</p>
        </div>
        <Link href="/admin/quizzes/new">
          <Button>
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            إنشاء اختبار جديد
          </Button>
        </Link>
      </div>

      {/* Quizzes Table */}
      {quizzes.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">#</th>
                    <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">العنوان</th>
                    <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">الأسئلة</th>
                    <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">المشاركات</th>
                    <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">الحالة</th>
                    <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {quizzes.map((quiz, index) => (
                    <tr key={quiz.id} className="hover:bg-muted/50">
                      <td className="px-6 py-4 text-sm text-muted-foreground">{index + 1}</td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-foreground">{quiz.title}</p>
                          {quiz.description && (
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {quiz.description}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">{quiz._count.questions}</td>
                      <td className="px-6 py-4 text-sm">{quiz._count.submissions}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleQuizStatus(quiz)}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            quiz.isActive
                              ? "bg-success/10 text-success"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {quiz.isActive ? "نشط" : "متوقف"}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link href={`/admin/quizzes/${quiz.id}`}>
                            <Button variant="ghost" size="sm">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteQuiz(quiz.id)}
                            className="text-error hover:bg-error/10"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-16 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-primary-dark mb-2">لا توجد اختبارات</h2>
            <p className="text-muted-foreground mb-6">ابدأ بإنشاء اختبارك الأول</p>
            <Link href="/admin/quizzes/new">
              <Button>إنشاء اختبار جديد</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
