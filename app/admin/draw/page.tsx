"use client";

import { useState, useEffect, useMemo } from "react";
import { Button, Select, Input, useToast } from "@/components/ui";
import DrawMachine from "@/components/admin/DrawMachine";
import type { Quiz, Submission } from "@/types";

type Tab = "quiz" | "weekly" | "winners";

// Arabic day names
const DAY_NAMES = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

function formatDateStr(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
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
        <button
          onClick={() => setActiveTab("winners")}
          className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all duration-200 ${
            activeTab === "winners"
              ? "bg-ramadan-gold text-ramadan-dark shadow-lg"
              : "text-white/60 hover:text-white hover:bg-white/5"
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            قائمة الفائزين
          </span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "quiz" ? <QuizDrawTab /> : activeTab === "weekly" ? <WeeklyDrawTab /> : <WinnersListTab />}
    </div>
  );
}

// =====================================================
// Quiz Draw Tab (existing functionality)
// =====================================================
function QuizDrawTab() {
  const { toast } = useToast();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<string>("");
  const [submissions, setSubmissions] = useState<(Submission & { quiz: Quiz })[]>([]);
  const [savedWinners, setSavedWinners] = useState<SavedDrawWinner[]>([]);
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

  function fetchSavedWinners(quizId: string) {
    fetch(`/api/draw-winners?drawType=quiz`)
      .then((r) => r.ok ? r.json() : [])
      .then((all: SavedDrawWinner[]) => setSavedWinners(all.filter((w) => w.quizId === parseInt(quizId))))
      .catch(() => setSavedWinners([]));
  }

  useEffect(() => {
    if (!selectedQuiz) return;
    setLoading(true);
    fetch(`/api/submissions?quizId=${selectedQuiz}`)
      .then((r) => r.ok ? r.json() : [])
      .then(setSubmissions)
      .catch(() => setSubmissions([]))
      .finally(() => setLoading(false));
    fetchSavedWinners(selectedQuiz);
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

      {/* Saved Winners */}
      {savedWinners.length > 0 && (
        <div className="bg-gradient-to-br from-ramadan-gold/10 to-transparent border border-ramadan-gold/30 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-ramadan-gold/20">
            <h3 className="text-lg font-bold text-ramadan-gold flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              الفائزين المحفوظين
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-ramadan-gold/10">
                  <th className="text-right text-white/60 text-sm font-medium p-3">التاريخ</th>
                  <th className="text-right text-white/60 text-sm font-medium p-3">الاسم</th>
                  <th className="text-right text-white/60 text-sm font-medium p-3">النتيجة</th>
                </tr>
              </thead>
              <tbody>
                {savedWinners.map((w) => {
                  const d = new Date(w.createdAt);
                  const dayLabel = `${DAY_NAMES[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1}`;
                  return (
                    <tr key={w.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-3 text-white/80 text-sm whitespace-nowrap">{dayLabel}</td>
                      <td className="p-3 text-ramadan-gold font-bold">{w.name}</td>
                      <td className="p-3">
                        <span className="inline-block px-3 py-1 bg-ramadan-gold/20 text-ramadan-gold rounded-full text-sm font-bold">
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
      )}

      {/* Draw Machine */}
      {selectedQuiz && !loading && submissions.length > 0 && (
        <DrawMachine
          candidates={topScorers}
          title={`المتصدرين بنتيجة ${topScorers.length > 0 ? Math.round(topScorers[0].percentage) : 0}%`}
          showConfirmButton
          onWinnerConfirmed={async (winner) => {
            try {
              const res = await fetch("/api/draw-winners", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  quizId: parseInt(selectedQuiz),
                  name: winner.name,
                  phone: winner.phone || null,
                  score: winner.score,
                  totalPoints: winner.totalPoints,
                  percentage: winner.percentage,
                }),
              });
              if (res.ok) {
                toast("تم حفظ الفائز بنجاح", "success");
                fetchSavedWinners(selectedQuiz);
                // Stop the quiz automatically
                try {
                  await fetch(`/api/quizzes/${selectedQuiz}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ action: "stop" }),
                  });
                  toast("تم إيقاف المسابقة تلقائياً", "success");
                } catch {
                  // Quiz stop failed but winner was saved
                }
              } else {
                const data = await res.json().catch(() => ({}));
                toast(data.error || "حدث خطأ أثناء حفظ الفائز", "error");
              }
            } catch (err) {
              console.error("Failed to save draw winner:", err);
              toast("حدث خطأ أثناء حفظ الفائز", "error");
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
  const { toast } = useToast();
  const [fromDate, setFromDate] = useState(() => formatDateStr(new Date()));
  const [toDate, setToDate] = useState(() => formatDateStr(new Date()));
  const [winners, setWinners] = useState<SavedDrawWinner[]>([]);
  const [savedWeeklyWinners, setSavedWeeklyWinners] = useState<SavedDrawWinner[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  function fetchWinners() {
    if (!fromDate || !toDate) return;
    setLoading(true);
    setFetched(true);
    // Fetch quiz draw winners (candidates for weekly draw)
    const quizWinnersPromise = fetch(`/api/draw-winners?fromDate=${fromDate}&toDate=${toDate}&drawType=quiz`)
      .then((r) => (r.ok ? r.json() : []));
    // Fetch already saved weekly draw winners
    const weeklyWinnersPromise = fetch(`/api/draw-winners?fromDate=${fromDate}&toDate=${toDate}&drawType=weekly`)
      .then((r) => (r.ok ? r.json() : []));

    Promise.all([quizWinnersPromise, weeklyWinnersPromise])
      .then(([quizW, weeklyW]) => {
        setWinners(quizW);
        setSavedWeeklyWinners(weeklyW);
      })
      .catch(() => { setWinners([]); setSavedWeeklyWinners([]); })
      .finally(() => setLoading(false));
  }

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

  return (
    <div className="space-y-6">
      {/* Date Range Selector */}
      <div className="bg-ramadan-purple/50 border border-ramadan-gold/20 rounded-xl p-6">
        <h3 className="text-lg font-bold text-ramadan-gold mb-4">تحديد فترة السحب</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">من تاريخ</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-ramadan-purple/50 border border-ramadan-gold/20 text-white focus:outline-none focus:ring-2 focus:ring-ramadan-gold/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">إلى تاريخ</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-ramadan-purple/50 border border-ramadan-gold/20 text-white focus:outline-none focus:ring-2 focus:ring-ramadan-gold/50"
            />
          </div>
        </div>
        <Button onClick={fetchWinners} disabled={!fromDate || !toDate}>
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          عرض الفائزين
        </Button>

        {fetched && !loading && (
          <div className="mt-4 flex items-center gap-6 text-sm flex-wrap">
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

      {/* Not fetched yet */}
      {!fetched && !loading && (
        <div className="bg-ramadan-purple/20 border border-ramadan-gold/10 rounded-xl py-20 text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-ramadan-gold/10 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-ramadan-gold/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-white/40 text-lg">حدد فترة السحب واضغط &quot;عرض الفائزين&quot;</p>
        </div>
      )}

      {/* No winners in range */}
      {fetched && !loading && winners.length === 0 && (
        <div className="bg-ramadan-purple/20 border border-ramadan-gold/10 rounded-xl py-20 text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-ramadan-gold/10 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-ramadan-gold/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-white/40 text-lg">لا يوجد فائزين محفوظين في هذه الفترة</p>
          <p className="text-white/30 text-sm mt-2">قم بعمل سحب في تاب &quot;سحب الاختبار&quot; وتأكيد الفائز أولاً</p>
        </div>
      )}

      {/* Winners Table + Draw */}
      {fetched && !loading && winners.length > 0 && (
        <>
          <div className="bg-ramadan-purple/30 border border-ramadan-gold/20 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-ramadan-gold/10">
              <h3 className="text-lg font-bold text-ramadan-gold">فائزين السحوبات</h3>
              <p className="text-white/40 text-sm mt-1">الفائزين المؤكدين من سحوبات الاختبارات في الفترة المحددة</p>
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
            showConfirmButton
            onWinnerConfirmed={async (winner) => {
              // Find the original winner record to get the quizId
              const originalWinner = winners.find(
                (w) => w.name === winner.name && w.phone === (winner.phone || null)
              );
              if (!originalWinner) {
                toast("حدث خطأ - لم يتم العثور على بيانات الفائز", "error");
                return;
              }
              try {
                const res = await fetch("/api/draw-winners", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    quizId: originalWinner.quizId,
                    name: winner.name,
                    phone: winner.phone || null,
                    score: winner.score,
                    totalPoints: winner.totalPoints,
                    percentage: winner.percentage,
                    drawType: "weekly",
                  }),
                });
                if (res.ok) {
                  toast("تم حفظ فائز السحب الأسبوعي بنجاح", "success");
                  // Refresh weekly winners
                  fetch(`/api/draw-winners?fromDate=${fromDate}&toDate=${toDate}&drawType=weekly`)
                    .then((r) => (r.ok ? r.json() : []))
                    .then(setSavedWeeklyWinners)
                    .catch(() => {});
                } else {
                  const data = await res.json().catch(() => ({}));
                  toast(data.error || "حدث خطأ أثناء حفظ الفائز", "error");
                }
              } catch (err) {
                console.error("Failed to save weekly draw winner:", err);
                toast("حدث خطأ أثناء حفظ الفائز", "error");
              }
            }}
          />

          {/* Saved Weekly Winners */}
          {savedWeeklyWinners.length > 0 && (
            <div className="bg-gradient-to-br from-ramadan-gold/10 to-transparent border border-ramadan-gold/30 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-ramadan-gold/20">
                <h3 className="text-lg font-bold text-ramadan-gold flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  فائزين السحب الأسبوعي المحفوظين
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-ramadan-gold/10">
                      <th className="text-right text-white/60 text-sm font-medium p-3">التاريخ</th>
                      <th className="text-right text-white/60 text-sm font-medium p-3">الاسم</th>
                      <th className="text-right text-white/60 text-sm font-medium p-3">الجوال</th>
                      <th className="text-right text-white/60 text-sm font-medium p-3">الاختبار الأصلي</th>
                      <th className="text-right text-white/60 text-sm font-medium p-3">النتيجة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {savedWeeklyWinners.map((w) => {
                      const d = new Date(w.createdAt);
                      const dayLabel = `${DAY_NAMES[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1}`;
                      return (
                        <tr key={w.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="p-3 text-white/80 text-sm whitespace-nowrap">{dayLabel}</td>
                          <td className="p-3 text-ramadan-gold font-bold">{w.name}</td>
                          <td className="p-3 text-white/60 text-sm" dir="ltr">{w.phone || "-"}</td>
                          <td className="p-3 text-white/60 text-sm">{w.quiz.title}</td>
                          <td className="p-3">
                            <span className="inline-block px-3 py-1 bg-ramadan-gold/20 text-ramadan-gold rounded-full text-sm font-bold">
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
          )}
        </>
      )}
    </div>
  );
}

// =====================================================
// Winners List Tab - shows all saved winners
// =====================================================
interface DrawWinnerWithType extends SavedDrawWinner {
  drawType: string;
}

function WinnersListTab() {
  const [allWinners, setAllWinners] = useState<DrawWinnerWithType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/draw-winners?drawType=quiz").then((r) => r.ok ? r.json() : []),
      fetch("/api/draw-winners?drawType=weekly").then((r) => r.ok ? r.json() : []),
    ])
      .then(([quiz, weekly]) => {
        const quizWithType = quiz.map((w: SavedDrawWinner) => ({ ...w, drawType: "quiz" }));
        const weeklyWithType = weekly.map((w: SavedDrawWinner) => ({ ...w, drawType: "weekly" }));
        setAllWinners([...quizWithType, ...weeklyWithType]);
      })
      .catch(() => setAllWinners([]))
      .finally(() => setLoading(false));
  }, []);

  // Group quiz winners by quiz
  const quizWinnersGrouped = useMemo(() => {
    const quizWinners = allWinners.filter((w) => w.drawType === "quiz");
    const grouped: Record<number, { title: string; winners: DrawWinnerWithType[] }> = {};
    for (const w of quizWinners) {
      if (!grouped[w.quizId]) {
        grouped[w.quizId] = { title: w.quiz.title, winners: [] };
      }
      grouped[w.quizId].winners.push(w);
    }
    return grouped;
  }, [allWinners]);

  const weeklyWinners = useMemo(() => allWinners.filter((w) => w.drawType === "weekly"), [allWinners]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-ramadan-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (allWinners.length === 0) {
    return (
      <div className="bg-ramadan-purple/20 border border-ramadan-gold/10 rounded-xl py-20 text-center">
        <div className="w-20 h-20 mx-auto mb-4 bg-ramadan-gold/10 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-ramadan-gold/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-white/40 text-lg">لا يوجد فائزين محفوظين بعد</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quiz Winners - grouped by quiz */}
      {Object.keys(quizWinnersGrouped).length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-ramadan-gold flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            فائزين سحب الاختبارات
          </h2>
          {Object.entries(quizWinnersGrouped).map(([quizId, group]) => (
            <div key={quizId} className="bg-ramadan-purple/30 border border-ramadan-gold/20 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-ramadan-gold/10 flex items-center justify-between">
                <h3 className="font-bold text-white">{group.title}</h3>
                <span className="text-xs bg-ramadan-gold/20 text-ramadan-gold px-3 py-1 rounded-full font-bold">
                  {group.winners.length} فائز
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-right text-white/60 text-sm font-medium p-3">التاريخ</th>
                      <th className="text-right text-white/60 text-sm font-medium p-3">الاسم</th>
                      <th className="text-right text-white/60 text-sm font-medium p-3">النتيجة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.winners.map((w) => {
                      const d = new Date(w.createdAt);
                      const dayLabel = `${DAY_NAMES[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1}`;
                      return (
                        <tr key={w.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="p-3 text-white/80 text-sm whitespace-nowrap">{dayLabel}</td>
                          <td className="p-3 text-white font-medium">{w.name}</td>
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
          ))}
        </div>
      )}

      {/* Weekly Winners */}
      {weeklyWinners.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-ramadan-gold flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            فائزين السحب الأسبوعي
          </h2>
          <div className="bg-gradient-to-br from-ramadan-gold/10 to-transparent border border-ramadan-gold/30 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-ramadan-gold/10">
                    <th className="text-right text-white/60 text-sm font-medium p-3">التاريخ</th>
                    <th className="text-right text-white/60 text-sm font-medium p-3">الاسم</th>
                    <th className="text-right text-white/60 text-sm font-medium p-3">الاختبار</th>
                    <th className="text-right text-white/60 text-sm font-medium p-3">النتيجة</th>
                  </tr>
                </thead>
                <tbody>
                  {weeklyWinners.map((w) => {
                    const d = new Date(w.createdAt);
                    const dayLabel = `${DAY_NAMES[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1}`;
                    return (
                      <tr key={w.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="p-3 text-white/80 text-sm whitespace-nowrap">{dayLabel}</td>
                        <td className="p-3 text-ramadan-gold font-bold">{w.name}</td>
                        <td className="p-3 text-white/60 text-sm">{w.quiz.title}</td>
                        <td className="p-3">
                          <span className="inline-block px-3 py-1 bg-ramadan-gold/20 text-ramadan-gold rounded-full text-sm font-bold">
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
        </div>
      )}
    </div>
  );
}
