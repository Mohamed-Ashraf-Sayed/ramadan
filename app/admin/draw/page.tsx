"use client";

import { useState, useEffect, useMemo } from "react";
import { Button, Select } from "@/components/ui";
import DrawMachine from "@/components/admin/DrawMachine";
import type { Quiz, Submission } from "@/types";

type Tab = "quiz" | "weekly";

// Arabic day names
const DAY_NAMES = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

function formatDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function getWeekRange(offset: number): { start: Date; end: Date } {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=Sun
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - dayOfWeek + offset * 7);
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  return { start: startOfWeek, end: endOfWeek };
}

function formatWeekLabel(start: Date, end: Date): string {
  const fmt = (d: Date) => `${d.getDate()}/${d.getMonth() + 1}`;
  return `${fmt(start)} - ${fmt(end)}`;
}

interface SavedDrawWinner {
  id: number;
  quizId: number;
  name: string;
  phone: string | null;
  score: number;
  totalPoints: number;
  percentage: number;
  createdAt: string;
  quiz: { id: number; title: string };
}

export default function DrawPage() {
  const [activeTab, setActiveTab] = useState<Tab>("quiz");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-ramadan-gold">السحب العشوائي</h1>
        <p className="text-white/60 mt-1">اختيار فائز عشوائي من المتصدرين</p>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1 bg-ramadan-purple/30 border border-ramadan-gold/20 rounded-xl p-1.5">
        <button
          onClick={() => setActiveTab("quiz")}
          className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all duration-200 ${
            activeTab === "quiz"
              ? "bg-ramadan-gold text-ramadan-dark shadow-lg"
              : "text-white/60 hover:text-white hover:bg-white/5"
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            سحب الاختبار
          </span>
        </button>
        <button
          onClick={() => setActiveTab("weekly")}
          className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all duration-200 ${
            activeTab === "weekly"
              ? "bg-ramadan-gold text-ramadan-dark shadow-lg"
              : "text-white/60 hover:text-white hover:bg-white/5"
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            السحب الأسبوعي
          </span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "quiz" ? <QuizDrawTab /> : <WeeklyDrawTab />}
    </div>
  );
}

// =====================================================
// Quiz Draw Tab (existing functionality)
// =====================================================
function QuizDrawTab() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<string>("");
  const [submissions, setSubmissions] = useState<(Submission & { quiz: Quiz })[]>([]);
  const [loading, setLoading] = useState(false);

  const topScorers = useMemo(() => {
    if (submissions.length === 0) return [];
    const maxScore = Math.max(...submissions.map((s) => s.percentage));
    return submissions
      .filter((s) => s.percentage === maxScore)
      .map((s) => ({
        name: s.name,
        phone: s.phone,
        score: s.score,
        totalPoints: s.totalPoints,
        percentage: s.percentage,
      }));
  }, [submissions]);

  useEffect(() => {
    fetch("/api/quizzes?all=true")
      .then((r) => r.ok ? r.json() : [])
      .then(setQuizzes)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedQuiz) return;
    setLoading(true);
    fetch(`/api/submissions?quizId=${selectedQuiz}`)
      .then((r) => r.ok ? r.json() : [])
      .then(setSubmissions)
      .catch(() => setSubmissions([]))
      .finally(() => setLoading(false));
  }, [selectedQuiz]);

  return (
    <div className="space-y-6">
      {/* Quiz Selection */}
      <div className="bg-ramadan-purple/50 border border-ramadan-gold/20 rounded-xl p-6">
        <div className="max-w-md">
          <Select
            label="اختر الاختبار"
            options={[
              { value: "", label: "-- اختر اختبار --" },
              ...quizzes.map((q) => ({ value: String(q.id), label: q.title })),
            ]}
            value={selectedQuiz}
            onChange={(e) => setSelectedQuiz(e.target.value)}
          />
        </div>

        {selectedQuiz && !loading && (
          <div className="mt-4 flex items-center gap-6 text-sm flex-wrap">
            <span className="text-white/60">
              إجمالي المشاركين: <strong className="text-white">{submissions.length}</strong>
            </span>
            {topScorers.length > 0 && (
              <>
                <span className="text-white/60">
                  أعلى نتيجة: <strong className="text-ramadan-gold">{Math.round(topScorers[0].percentage)}%</strong>
                </span>
                <span className="text-white/60">
                  المتصدرين بنفس النتيجة: <strong className="text-ramadan-gold">{topScorers.length}</strong>
                </span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-ramadan-gold border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* No quiz selected */}
      {!selectedQuiz && !loading && (
        <div className="bg-ramadan-purple/20 border border-ramadan-gold/10 rounded-xl py-20 text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-ramadan-gold/10 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-ramadan-gold/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-white/40 text-lg">اختر اختبار للبدء</p>
        </div>
      )}

      {/* No submissions */}
      {selectedQuiz && !loading && submissions.length === 0 && (
        <div className="bg-ramadan-purple/20 border border-ramadan-gold/10 rounded-xl py-20 text-center">
          <p className="text-white/40 text-lg">لا توجد مشاركات في هذا الاختبار</p>
        </div>
      )}

      {/* Draw Machine */}
      {selectedQuiz && !loading && submissions.length > 0 && (
        <DrawMachine
          candidates={topScorers}
          title={`المتصدرين بنتيجة ${topScorers.length > 0 ? Math.round(topScorers[0].percentage) : 0}%`}
          showConfirmButton
          onWinnerConfirmed={async (winner) => {
            try {
              await fetch("/api/draw-winners", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  quizId: parseInt(selectedQuiz),
                  name: winner.name,
                  phone: winner.phone,
                  score: winner.score,
                  totalPoints: winner.totalPoints,
                  percentage: winner.percentage,
                }),
              });
            } catch (err) {
              console.error("Failed to save draw winner:", err);
            }
          }}
        />
      )}
    </div>
  );
}

// =====================================================
// Weekly Draw Tab - uses saved draw winners from API
// =====================================================
function WeeklyDrawTab() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [winners, setWinners] = useState<SavedDrawWinner[]>([]);
  const [loading, setLoading] = useState(false);

  const { start, end } = useMemo(() => getWeekRange(weekOffset), [weekOffset]);

  // Fetch saved draw winners for the week
  useEffect(() => {
    setLoading(true);
    const fromDate = formatDate(start);
    const toDate = formatDate(end);
    fetch(`/api/draw-winners?fromDate=${fromDate}&toDate=${toDate}`)
      .then((r) => (r.ok ? r.json() : []))
      .then(setWinners)
      .catch(() => setWinners([]))
      .finally(() => setLoading(false));
  }, [start, end]);

  // Convert to DrawMachine candidates
  const drawCandidates = useMemo(() => {
    return winners.map((w) => {
      const d = new Date(w.createdAt);
      const dayLabel = `${DAY_NAMES[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1}`;
      return {
        name: w.name,
        phone: w.phone || undefined,
        percentage: w.percentage,
        score: w.score,
        totalPoints: w.totalPoints,
        extra: `${dayLabel} - ${w.quiz.title}`,
      };
    });
  }, [winners]);

  const isCurrentWeek = weekOffset === 0;

  return (
    <div className="space-y-6">
      {/* Week Selector */}
      <div className="bg-ramadan-purple/50 border border-ramadan-gold/20 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <Button
            variant="secondary"
            onClick={() => setWeekOffset((o) => o - 1)}
            className="!px-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>

          <div className="text-center">
            <p className="text-white/60 text-sm mb-1">
              {isCurrentWeek ? "الأسبوع الحالي" : `قبل ${Math.abs(weekOffset)} ${Math.abs(weekOffset) === 1 ? "أسبوع" : "أسابيع"}`}
            </p>
            <p className="text-xl font-bold text-white">
              {formatWeekLabel(start, end)}
            </p>
          </div>

          <Button
            variant="secondary"
            onClick={() => setWeekOffset((o) => o + 1)}
            disabled={isCurrentWeek}
            className="!px-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Button>
        </div>

        {!loading && (
          <div className="mt-4 flex items-center justify-center gap-6 text-sm flex-wrap">
            <span className="text-white/60">
              فائزين السحوبات: <strong className="text-ramadan-gold">{winners.length}</strong>
            </span>
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-ramadan-gold border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* No winners this week */}
      {!loading && winners.length === 0 && (
        <div className="bg-ramadan-purple/20 border border-ramadan-gold/10 rounded-xl py-20 text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-ramadan-gold/10 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-ramadan-gold/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-white/40 text-lg">لا يوجد فائزين محفوظين في هذا الأسبوع</p>
          <p className="text-white/30 text-sm mt-2">قم بعمل سحب في تاب &quot;سحب الاختبار&quot; وتأكيد الفائز أولاً</p>
        </div>
      )}

      {/* Winners Table + Draw */}
      {!loading && winners.length > 0 && (
        <>
          <div className="bg-ramadan-purple/30 border border-ramadan-gold/20 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-ramadan-gold/10">
              <h3 className="text-lg font-bold text-ramadan-gold">فائزين السحوبات اليومية</h3>
              <p className="text-white/40 text-sm mt-1">الفائزين المؤكدين من سحوبات الاختبارات</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-right text-white/60 text-sm font-medium p-3">التاريخ</th>
                    <th className="text-right text-white/60 text-sm font-medium p-3">الاسم</th>
                    <th className="text-right text-white/60 text-sm font-medium p-3">الجوال</th>
                    <th className="text-right text-white/60 text-sm font-medium p-3">الاختبار</th>
                    <th className="text-right text-white/60 text-sm font-medium p-3">النتيجة</th>
                  </tr>
                </thead>
                <tbody>
                  {winners.map((w) => {
                    const d = new Date(w.createdAt);
                    const dayLabel = `${DAY_NAMES[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1}`;
                    return (
                      <tr key={w.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="p-3 text-white/80 text-sm whitespace-nowrap">{dayLabel}</td>
                        <td className="p-3 text-white font-medium">{w.name}</td>
                        <td className="p-3 text-white/60 text-sm" dir="ltr">{w.phone || "-"}</td>
                        <td className="p-3 text-white/60 text-sm">{w.quiz.title}</td>
                        <td className="p-3">
                          <span className="inline-block px-3 py-1 bg-success/20 text-success rounded-full text-sm font-bold">
                            {Math.round(w.percentage)}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Draw Machine */}
          <DrawMachine
            candidates={drawCandidates}
            title={`السحب الأسبوعي بين ${drawCandidates.length} فائز`}
          />
        </>
      )}
    </div>
  );
}
