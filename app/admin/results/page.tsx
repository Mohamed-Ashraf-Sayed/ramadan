"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button, Select } from "@/components/ui";
import type { Submission, Quiz, Question } from "@/types";

interface SubmissionDetails extends Submission {
  quiz: {
    title: string;
    questions: Question[];
  };
}

export default function AdminResultsPage() {
  const [submissions, setSubmissions] = useState<(Submission & { quiz: Quiz })[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [viewingSubmission, setViewingSubmission] = useState<SubmissionDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    fetchQuizzes();
    fetchSubmissions();
  }, []);

  useEffect(() => {
    fetchSubmissions();
  }, [selectedQuiz]);

  async function fetchQuizzes() {
    try {
      const response = await fetch("/api/quizzes");
      if (response.ok) {
        const data = await response.json();
        setQuizzes(data);
      }
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    }
  }

  async function fetchSubmissions() {
    setLoading(true);
    try {
      const url = selectedQuiz === "all"
        ? "/api/submissions"
        : `/api/submissions?quizId=${selectedQuiz}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data);
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setLoading(false);
    }
  }

  async function viewAnswers(submissionId: number) {
    setLoadingDetails(true);
    try {
      const response = await fetch(`/api/submissions/${submissionId}`);
      if (response.ok) {
        const data = await response.json();
        setViewingSubmission(data);
      }
    } catch (error) {
      console.error("Error fetching submission details:", error);
    } finally {
      setLoadingDetails(false);
    }
  }

  async function deleteSubmission(id: number) {
    if (!confirm("هل أنت متأكد من حذف هذه النتيجة؟")) return;

    try {
      const response = await fetch(`/api/submissions/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchSubmissions();
        if (viewingSubmission?.id === id) {
          setViewingSubmission(null);
        }
      }
    } catch (error) {
      console.error("Error deleting submission:", error);
    }
  }

  function exportToCSV() {
    if (submissions.length === 0) return;

    const headers = ["الاسم", "البريد الإلكتروني", "رقم الموبايل", "الاختبار", "النتيجة", "النسبة", "التاريخ"];
    const rows = submissions.map(s => [
      s.name,
      s.email,
      s.phone,
      s.quiz.title,
      `${s.score}/${s.totalPoints}`,
      `${Math.round(s.percentage)}%`,
      new Date(s.createdAt).toLocaleDateString("ar-EG"),
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.join(","))
      .join("\n");

    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `results_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-ramadan-gold">النتائج</h1>
          <p className="text-white/60 mt-1">عرض جميع نتائج المشاركين</p>
        </div>
        <Button variant="outline" onClick={exportToCSV} disabled={submissions.length === 0}>
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          تصدير CSV
        </Button>
      </div>

      {/* Filter */}
      <div className="bg-ramadan-purple/50 border border-ramadan-gold/20 rounded-xl p-4">
        <div className="flex items-center gap-4">
          <div className="w-64">
            <Select
              label="فلترة حسب الاختبار"
              options={[
                { value: "all", label: "جميع الاختبارات" },
                ...quizzes.map(q => ({ value: String(q.id), label: q.title })),
              ]}
              value={selectedQuiz}
              onChange={(e) => setSelectedQuiz(e.target.value)}
            />
          </div>
          <div className="flex-1 text-left">
            <span className="text-sm text-white/60">
              {submissions.length} نتيجة
            </span>
          </div>
        </div>
      </div>

      {/* Results Table */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-ramadan-gold border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : submissions.length > 0 ? (
        <div className="bg-ramadan-purple/30 border border-ramadan-gold/20 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-ramadan-dark/50">
                <tr>
                  <th className="text-right px-6 py-4 text-sm font-medium text-white/60">#</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-white/60">المشارك</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-white/60">الاختبار</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-white/60">النتيجة</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-white/60">النسبة</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-white/60">التاريخ</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-white/60">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {submissions.map((submission, index) => (
                  <tr key={submission.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-sm text-white/50">{index + 1}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-white">{submission.name}</p>
                        <p className="text-sm text-white/50">{submission.email}</p>
                        <p className="text-sm text-white/50">{submission.phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-white/80">{submission.quiz.title}</td>
                    <td className="px-6 py-4 text-sm text-white/80">
                      {submission.score} / {submission.totalPoints}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          submission.percentage >= 60
                            ? "bg-success/20 text-success"
                            : "bg-error/20 text-error"
                        }`}
                      >
                        {Math.round(submission.percentage)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-white/50">
                      {new Date(submission.createdAt).toLocaleDateString("ar-EG", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => viewAnswers(submission.id)}
                          className="text-ramadan-gold hover:bg-ramadan-gold/10"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteSubmission(submission.id)}
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
        </div>
      ) : (
        <div className="bg-ramadan-purple/30 border border-ramadan-gold/20 rounded-xl py-16 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-ramadan-dark/50 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-ramadan-gold mb-2">لا توجد نتائج</h2>
          <p className="text-white/50">
            {selectedQuiz === "all"
              ? "لم يشارك أحد في الاختبارات بعد"
              : "لا توجد مشاركات في هذا الاختبار"}
          </p>
        </div>
      )}

      {/* Answers Modal */}
      {(viewingSubmission || loadingDetails) && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-ramadan-navy border border-ramadan-gold/20 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            {loadingDetails ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-ramadan-gold border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : viewingSubmission && (
              <>
                {/* Modal Header */}
                <div className="p-6 border-b border-ramadan-gold/20 flex items-center justify-between shrink-0">
                  <div>
                    <h2 className="text-xl font-bold text-ramadan-gold">إجابات المشارك</h2>
                    <p className="text-white/60 text-sm mt-1">
                      {viewingSubmission.name} - {viewingSubmission.quiz.title}
                    </p>
                  </div>
                  <button
                    onClick={() => setViewingSubmission(null)}
                    className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Score Summary */}
                <div className="p-4 bg-ramadan-dark/30 border-b border-ramadan-gold/10 shrink-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div>
                        <span className="text-white/50 text-sm">النتيجة: </span>
                        <span className="text-white font-bold">{viewingSubmission.score} / {viewingSubmission.totalPoints}</span>
                      </div>
                      <div>
                        <span className="text-white/50 text-sm">النسبة: </span>
                        <span className={`font-bold ${viewingSubmission.percentage >= 60 ? "text-success" : "text-error"}`}>
                          {Math.round(viewingSubmission.percentage)}%
                        </span>
                      </div>
                    </div>
                    <div className="text-white/40 text-sm">
                      {new Date(viewingSubmission.createdAt).toLocaleDateString("ar-EG", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>

                {/* Questions & Answers */}
                <div className="overflow-y-auto flex-1 p-6">
                  <div className="space-y-4">
                    {viewingSubmission.quiz.questions.map((question, index) => {
                      const userAnswer = viewingSubmission.answers[question.id];
                      const correctAnswer = parseJsonField(question.correctAnswer);
                      const isCorrect = checkAnswer(userAnswer, correctAnswer, question.type);

                      return (
                        <div
                          key={question.id}
                          className={`p-4 rounded-xl border ${
                            isCorrect
                              ? "bg-success/5 border-success/20"
                              : userAnswer === undefined || userAnswer === null
                              ? "bg-white/5 border-white/10"
                              : "bg-error/5 border-error/20"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <span
                              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                                isCorrect
                                  ? "bg-success"
                                  : userAnswer === undefined || userAnswer === null
                                  ? "bg-white/20"
                                  : "bg-error"
                              }`}
                            >
                              {isCorrect ? "✓" : userAnswer === undefined || userAnswer === null ? "-" : "✗"}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-white mb-1">
                                {index + 1}. {question.text}
                              </p>
                              <p className="text-xs text-white/40 mb-2">
                                {question.type === "MULTIPLE_CHOICE" && "اختيار من متعدد"}
                                {question.type === "TRUE_FALSE" && "صح أو خطأ"}
                                {question.type === "ORDERING" && "ترتيب"}
                                {question.type === "IMAGE_TEXT" && "صورة + إجابة نصية"}
                                {" • "}{question.points} {question.points === 1 ? "نقطة" : "نقاط"}
                              </p>

                              {/* Media for IMAGE_TEXT */}
                              {question.type === "IMAGE_TEXT" && question.mediaUrl && (
                                <div className="mb-3 rounded-lg overflow-hidden border border-white/10 max-w-sm">
                                  {question.mediaType === "video" ? (
                                    <video
                                      src={question.mediaUrl}
                                      controls
                                      className="w-full max-h-48 object-contain bg-black/30"
                                    />
                                  ) : (
                                    <div className="relative w-full h-40">
                                      <Image
                                        src={question.mediaUrl}
                                        alt={question.text}
                                        fill
                                        className="object-contain"
                                      />
                                    </div>
                                  )}
                                </div>
                              )}

                              <div className="space-y-1">
                                <p className="text-sm">
                                  <span className="text-white/50">إجابة المشارك: </span>
                                  {userAnswer === undefined || userAnswer === null ? (
                                    <span className="text-white/30">لم يجب</span>
                                  ) : (
                                    <span className={isCorrect ? "text-success" : "text-error"}>
                                      {formatAnswer(userAnswer, question.type)}
                                    </span>
                                  )}
                                </p>
                                <p className="text-sm">
                                  <span className="text-white/50">الإجابة الصحيحة: </span>
                                  <span className="text-success">
                                    {formatAnswer(correctAnswer, question.type)}
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-4 border-t border-ramadan-gold/20 shrink-0">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setViewingSubmission(null)}
                  >
                    إغلاق
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

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

function formatAnswer(answer: unknown, type: string): string {
  const parsed = typeof answer === "string" ? parseJsonField(answer) : answer;
  if (type === "TRUE_FALSE") {
    return parsed === true || parsed === "true" ? "صحيح" : "خطأ";
  }
  if (Array.isArray(parsed)) {
    return parsed.join(" → ");
  }
  if (parsed === undefined || parsed === null) return "لم يجب";
  return String(parsed);
}

function checkAnswer(userAnswer: unknown, correctAnswer: unknown, type: string): boolean {
  if (userAnswer === undefined || userAnswer === null) return false;

  if (type === "TRUE_FALSE") {
    const userBool = userAnswer === true || userAnswer === "true";
    const correctBool = correctAnswer === true || correctAnswer === "true";
    return userBool === correctBool;
  }

  if (type === "ORDERING") {
    return JSON.stringify(userAnswer) === JSON.stringify(correctAnswer);
  }

  if (type === "IMAGE_TEXT") {
    return normalizeArabic(String(userAnswer)) === normalizeArabic(String(correctAnswer)) ||
      fuzzyMatch(String(userAnswer), String(correctAnswer));
  }

  return userAnswer === correctAnswer;
}

function normalizeArabic(text: string): string {
  return text
    .replace(/[\u064B-\u065F\u0670]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/^ال/, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function fuzzyMatch(a: string, b: string): boolean {
  const na = normalizeArabic(a);
  const nb = normalizeArabic(b);
  if (na === nb) return true;
  const maxLen = Math.max(na.length, nb.length);
  if (maxLen === 0) return true;
  const matrix: number[][] = [];
  for (let i = 0; i <= na.length; i++) matrix[i] = [i];
  for (let j = 0; j <= nb.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= na.length; i++) {
    for (let j = 1; j <= nb.length; j++) {
      const cost = na[i - 1] === nb[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + cost);
    }
  }
  return 1 - matrix[na.length][nb.length] / maxLen >= 0.8;
}
