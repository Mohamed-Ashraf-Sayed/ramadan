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
  weekNumber: number | null;
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
            السحب اليومي
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
function PhoneCell({ phone, id }: { phone: string | null; id: number }) {
  const [visible, setVisible] = useState(false);
  if (!phone) return <span>-</span>;
  if (visible) return <button onClick={() => setVisible(false)} className="text-white/60 hover:text-white transition-colors">{phone}</button>;
  return <button onClick={() => setVisible(true)} className="text-ramadan-gold/70 hover:text-ramadan-gold text-xs font-medium transition-colors">عرض</button>;
}

function QuizDrawTab() {
  const { toast } = useToast();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<string>("");
  const [submissions, setSubmissions] = useState<(Submission & { quiz: Quiz })[]>([]);
  const [savedWinners, setSavedWinners] = useState<SavedDrawWinner[]>([]);
  const [loading, setLoading] = useState(false);

  const topScorers = useMemo(() => {
    if (submissions.length === 0) return [];
    return submissions
      .filter((s) => s.percentage > 60)
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
                  المؤهلين للسحب (أعلى من 60%): <strong className="text-ramadan-gold">{topScorers.length}</strong>
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
                  <th className="text-right text-white/60 text-sm font-medium p-3">الجوال</th>
                  <th className="text-right text-white/60 text-sm font-medium p-3">النتيجة</th>
                  <th className="text-right text-white/60 text-sm font-medium p-3">حذف</th>
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
                      <td className="p-3 text-sm" dir="ltr"><PhoneCell phone={w.phone} id={w.id} /></td>
                      <td className="p-3">
                        <span className="inline-block px-3 py-1 bg-ramadan-gold/20 text-ramadan-gold rounded-full text-sm font-bold">
                          {Math.round(w.percentage)}%
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={async () => {
                            if (!confirm("هل أنت متأكد من حذف هذا الفائز؟")) return;
                            try {
                              const res = await fetch(`/api/draw-winners?id=${w.id}`, { method: "DELETE" });
                              if (res.ok) {
                                toast("تم حذف الفائز", "success");
                                fetchSavedWinners(selectedQuiz);
                              } else {
                                toast("حدث خطأ أثناء الحذف", "error");
                              }
                            } catch {
                              toast("حدث خطأ أثناء الحذف", "error");
                            }
                          }}
                          className="text-error hover:text-red-400 transition-colors p-1"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Max winners warning */}
      {selectedQuiz && !loading && submissions.length > 0 && savedWinners.length >= 3 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-center">
          <p className="text-amber-400 font-bold">تم الوصول للحد الأقصى (3 فائزين) لهذا الاختبار</p>
        </div>
      )}

      {/* Draw Machine */}
      {selectedQuiz && !loading && submissions.length > 0 && (
        <DrawMachine
          candidates={topScorers}
          title={`المؤهلين للسحب (${topScorers.length} مشارك أعلى من 60%)`}
          totalParticipants={submissions.length}
          showConfirmButton={savedWinners.length < 3}
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
const WEEK_OPTIONS = [
  { value: 1, label: "الأسبوع الأول" },
  { value: 2, label: "الأسبوع الثاني" },
  { value: 3, label: "الأسبوع الثالث" },
  { value: 4, label: "الأسبوع الرابع" },
  { value: 5, label: "الأسبوع الخامس" },
];

function WeeklyDrawTab() {
  const { toast } = useToast();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuizIds, setSelectedQuizIds] = useState<Set<number>>(new Set());
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [passedSubmissions, setPassedSubmissions] = useState<(Submission & { quiz: Quiz })[]>([]);
  const [quizDrawWinners, setQuizDrawWinners] = useState<SavedDrawWinner[]>([]);
  const [savedWeeklyWinners, setSavedWeeklyWinners] = useState<SavedDrawWinner[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    fetch("/api/quizzes?all=true")
      .then((r) => (r.ok ? r.json() : []))
      .then(setQuizzes);
  }, []);

  function toggleQuiz(id: number) {
    setSelectedQuizIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectAll() {
    if (selectedQuizIds.size === quizzes.length) {
      setSelectedQuizIds(new Set());
    } else {
      setSelectedQuizIds(new Set(quizzes.map((q) => q.id)));
    }
  }

  function fetchData() {
    if (selectedQuizIds.size === 0) return;
    setLoading(true);
    setFetched(true);

    // Fetch submissions for each selected quiz
    const quizIdArr = Array.from(selectedQuizIds);
    const submissionsPromises = quizIdArr.map((qid) =>
      fetch(`/api/submissions?quizId=${qid}`).then((r) => (r.ok ? r.json() : []))
    );
    // Fetch all quiz draw winners (to exclude them)
    const quizWinnersPromise = fetch(`/api/draw-winners?drawType=quiz`)
      .then((r) => (r.ok ? r.json() : []));
    // Fetch all weekly draw winners
    const weeklyWinnersPromise = fetch(`/api/draw-winners?drawType=weekly`)
      .then((r) => (r.ok ? r.json() : []));

    Promise.all([Promise.all(submissionsPromises), quizWinnersPromise, weeklyWinnersPromise])
      .then(([subsArrays, quizW, weeklyW]) => {
        const allSubs = subsArrays.flat();
        setPassedSubmissions(allSubs.filter((s: Submission) => s.percentage > 60));
        setQuizDrawWinners(quizW);
        setSavedWeeklyWinners(weeklyW);
      })
      .catch(() => { setPassedSubmissions([]); setQuizDrawWinners([]); setSavedWeeklyWinners([]); })
      .finally(() => setLoading(false));
  }

  // Build candidates: passed submissions minus quiz draw winners
  const drawCandidates = useMemo(() => {
    const winnerKeys = new Set(
      quizDrawWinners.map((w) => `${w.name}||${w.phone || ""}`)
    );

    return passedSubmissions
      .filter((s) => !winnerKeys.has(`${s.name}||${s.phone || ""}`))
      .map((s) => {
        const d = new Date(s.createdAt);
        const dayLabel = `${DAY_NAMES[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1}`;
        return {
          name: s.name,
          phone: s.phone || undefined,
          percentage: s.percentage,
          score: s.score,
          totalPoints: s.totalPoints,
          extra: `${dayLabel} - ${s.quiz.title} - ${Math.round(s.percentage)}%`,
        };
      });
  }, [passedSubmissions, quizDrawWinners]);

  return (
    <div className="space-y-6">
      {/* Quiz Selector */}
      <div className="bg-ramadan-purple/50 border border-ramadan-gold/20 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-ramadan-gold">اختر المسابقات</h3>
          <button
            onClick={selectAll}
            className="text-xs text-ramadan-gold/70 hover:text-ramadan-gold transition-colors px-3 py-1 border border-ramadan-gold/20 rounded-lg"
          >
            {selectedQuizIds.size === quizzes.length ? "إلغاء الكل" : "تحديد الكل"}
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
          {quizzes.map((q) => {
            const selected = selectedQuizIds.has(q.id);
            return (
              <button
                key={q.id}
                onClick={() => toggleQuiz(q.id)}
                className={`text-right px-4 py-3 rounded-xl border transition-all duration-200 ${
                  selected
                    ? "bg-ramadan-gold/20 border-ramadan-gold/50 text-ramadan-gold"
                    : "bg-ramadan-purple/30 border-white/10 text-white/60 hover:border-ramadan-gold/30 hover:text-white/80"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                    selected ? "border-ramadan-gold bg-ramadan-gold" : "border-white/30"
                  }`}>
                    {selected && (
                      <svg className="w-3 h-3 text-ramadan-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm font-medium truncate">{q.title}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Week Selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-white/60 mb-2">رقم الأسبوع</label>
          <div className="flex gap-2 flex-wrap">
            {WEEK_OPTIONS.map((w) => (
              <button
                key={w.value}
                onClick={() => setSelectedWeek(w.value)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 border ${
                  selectedWeek === w.value
                    ? "bg-ramadan-gold/20 border-ramadan-gold/50 text-ramadan-gold"
                    : "bg-ramadan-purple/30 border-white/10 text-white/50 hover:border-ramadan-gold/30"
                }`}
              >
                {w.label}
              </button>
            ))}
          </div>
        </div>

        <Button onClick={fetchData} disabled={selectedQuizIds.size === 0}>
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          عرض المشاركين ({selectedQuizIds.size} مسابقة)
        </Button>

        {fetched && !loading && (
          <div className="mt-4 flex items-center gap-6 text-sm flex-wrap">
            <span className="text-white/60">
              الناجحين (أعلى من 60%): <strong className="text-ramadan-gold">{passedSubmissions.length}</strong>
            </span>
            <span className="text-white/60">
              فائزين السحب اليومي (مستبعدين): <strong className="text-error">{quizDrawWinners.length}</strong>
            </span>
            <span className="text-white/60">
              المؤهلين للسحب الأسبوعي: <strong className="text-success">{drawCandidates.length}</strong>
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-white/40 text-lg">حدد المسابقات واضغط &quot;عرض المشاركين&quot;</p>
        </div>
      )}

      {/* No passed submissions */}
      {fetched && !loading && drawCandidates.length === 0 && (
        <div className="bg-ramadan-purple/20 border border-ramadan-gold/10 rounded-xl py-20 text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-ramadan-gold/10 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-ramadan-gold/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-white/40 text-lg">لا يوجد مشاركين مؤهلين للسحب الأسبوعي</p>
          <p className="text-white/30 text-sm mt-2">يجب أن يكون هناك مشاركين ناجحين (أعلى من 60%) ولم يفوزوا في السحب اليومي</p>
        </div>
      )}

      {/* Candidates Table + Draw */}
      {fetched && !loading && drawCandidates.length > 0 && (
        <>
          {/* Draw Machine */}
          <DrawMachine
            candidates={drawCandidates}
            title={`${WEEK_OPTIONS.find(w => w.value === selectedWeek)?.label} - ${drawCandidates.length} مشارك ناجح`}
            totalParticipants={drawCandidates.length}
            showConfirmButton
            onWinnerConfirmed={async (winner) => {
              // Find the original submission to get the quizId
              const originalSub = passedSubmissions.find(
                (s) => s.name === winner.name && (s.phone || "") === (winner.phone || "")
              );
              if (!originalSub) {
                toast("حدث خطأ - لم يتم العثور على بيانات المشارك", "error");
                return;
              }
              try {
                const res = await fetch("/api/draw-winners", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    quizId: originalSub.quizId,
                    name: winner.name,
                    phone: winner.phone || null,
                    score: winner.score,
                    totalPoints: winner.totalPoints,
                    percentage: winner.percentage,
                    drawType: "weekly",
                    weekNumber: selectedWeek,
                  }),
                });
                if (res.ok) {
                  toast("تم حفظ فائز السحب الأسبوعي بنجاح", "success");
                  fetchData();
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
                      <th className="text-right text-white/60 text-sm font-medium p-3">الأسبوع</th>
                      <th className="text-right text-white/60 text-sm font-medium p-3">الاسم</th>
                      <th className="text-right text-white/60 text-sm font-medium p-3">الجوال</th>
                      <th className="text-right text-white/60 text-sm font-medium p-3">الاختبار الأصلي</th>
                      <th className="text-right text-white/60 text-sm font-medium p-3">النتيجة</th>
                      <th className="text-right text-white/60 text-sm font-medium p-3">حذف</th>
                    </tr>
                  </thead>
                  <tbody>
                    {savedWeeklyWinners.map((w) => {
                      const weekLabel = w.weekNumber ? WEEK_OPTIONS.find(o => o.value === w.weekNumber)?.label || `أسبوع ${w.weekNumber}` : "-";
                      return (
                        <tr key={w.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="p-3 text-amber-400 text-sm font-bold whitespace-nowrap">{weekLabel}</td>
                          <td className="p-3 text-ramadan-gold font-bold">{w.name}</td>
                          <td className="p-3 text-sm" dir="ltr"><PhoneCell phone={w.phone} id={w.id} /></td>
                          <td className="p-3 text-white/60 text-sm">{w.quiz.title}</td>
                          <td className="p-3">
                            <span className="inline-block px-3 py-1 bg-ramadan-gold/20 text-ramadan-gold rounded-full text-sm font-bold">
                              {Math.round(w.percentage)}%
                            </span>
                          </td>
                          <td className="p-3">
                            <button
                              onClick={async () => {
                                if (!confirm("هل أنت متأكد من حذف هذا الفائز؟")) return;
                                try {
                                  const res = await fetch(`/api/draw-winners?id=${w.id}`, { method: "DELETE" });
                                  if (res.ok) {
                                    toast("تم حذف الفائز", "success");
                                    fetchData();
                                  } else {
                                    toast("حدث خطأ أثناء الحذف", "error");
                                  }
                                } catch {
                                  toast("حدث خطأ أثناء الحذف", "error");
                                }
                              }}
                              className="text-error hover:text-red-400 transition-colors p-1"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
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
  const { toast } = useToast();
  const [allWinners, setAllWinners] = useState<DrawWinnerWithType[]>([]);
  const [loading, setLoading] = useState(true);

  // Manual winner form state
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<"manual" | "participant">("manual");
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuizId, setSelectedQuizId] = useState("");
  const [participants, setParticipants] = useState<(Submission & { quiz: Quiz })[]>([]);
  const [selectedParticipant, setSelectedParticipant] = useState("");
  const [manualName, setManualName] = useState("");
  const [manualPhone, setManualPhone] = useState("");
  const [drawType, setDrawType] = useState<"quiz" | "weekly">("quiz");
  const [submitting, setSubmitting] = useState(false);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const [participantSearch, setParticipantSearch] = useState("");

  function fetchAllWinners() {
    setLoading(true);
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
  }

  useEffect(() => { fetchAllWinners(); }, []);

  // Fetch quizzes when form is opened
  useEffect(() => {
    if (showForm && quizzes.length === 0) {
      fetch("/api/quizzes?all=true")
        .then((r) => r.ok ? r.json() : [])
        .then(setQuizzes)
        .catch(() => {});
    }
  }, [showForm, quizzes.length]);

  // Fetch participants when quiz is selected in participant mode
  useEffect(() => {
    if (formMode === "participant" && selectedQuizId) {
      setLoadingParticipants(true);
      setSelectedParticipant("");
      setParticipantSearch("");
      fetch(`/api/submissions?quizId=${selectedQuizId}`)
        .then((r) => r.ok ? r.json() : [])
        .then(setParticipants)
        .catch(() => setParticipants([]))
        .finally(() => setLoadingParticipants(false));
    }
  }, [formMode, selectedQuizId]);

  async function handleAddWinner() {
    if (!selectedQuizId) {
      toast("اختر الاختبار أولاً", "error");
      return;
    }

    let name = "";
    let phone = "";
    let score = 0;
    let totalPoints = 0;
    let percentage = 0;

    if (formMode === "manual") {
      if (!manualName.trim()) {
        toast("أدخل اسم الفائز", "error");
        return;
      }
      name = manualName.trim();
      phone = manualPhone.trim();
    } else {
      if (!selectedParticipant) {
        toast("اختر مشارك من القائمة", "error");
        return;
      }
      const p = participants.find((s) => String(s.id) === selectedParticipant);
      if (!p) return;
      name = p.name;
      phone = p.phone || "";
      score = p.score;
      totalPoints = p.totalPoints;
      percentage = p.percentage;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/draw-winners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizId: parseInt(selectedQuizId),
          name,
          phone: phone || null,
          score,
          totalPoints,
          percentage,
          drawType,
        }),
      });
      if (res.ok) {
        toast("تم إضافة الفائز بنجاح", "success");
        fetchAllWinners();
        // Reset form
        setManualName("");
        setManualPhone("");
        setSelectedParticipant("");
        setShowForm(false);
      } else {
        const data = await res.json().catch(() => ({}));
        toast(data.error || "حدث خطأ أثناء إضافة الفائز", "error");
      }
    } catch {
      toast("حدث خطأ أثناء إضافة الفائز", "error");
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteWinner(id: number) {
    if (!confirm("هل أنت متأكد من حذف هذا الفائز؟")) return;
    try {
      const res = await fetch(`/api/draw-winners?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast("تم حذف الفائز", "success");
        fetchAllWinners();
      } else {
        toast("حدث خطأ أثناء الحذف", "error");
      }
    } catch {
      toast("حدث خطأ أثناء الحذف", "error");
    }
  }

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

  if (allWinners.length === 0 && !showForm) {
    return (
      <div className="space-y-6">
        {/* Add Winner Button */}
        <div className="flex justify-end">
          <Button onClick={() => setShowForm(true)}>
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            إضافة فائز يدوي
          </Button>
        </div>
        <div className="bg-ramadan-purple/20 border border-ramadan-gold/10 rounded-xl py-20 text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-ramadan-gold/10 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-ramadan-gold/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-white/40 text-lg">لا يوجد فائزين محفوظين بعد</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add Winner Button & Form */}
      <div className="flex justify-end">
        <Button
          onClick={() => setShowForm(!showForm)}
          className={showForm ? "bg-white/10 text-white border border-white/20" : ""}
        >
          {showForm ? (
            <>
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              إلغاء
            </>
          ) : (
            <>
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              إضافة فائز يدوي
            </>
          )}
        </Button>
      </div>

      {showForm && (
        <div className="bg-ramadan-purple/50 border border-ramadan-gold/20 rounded-xl p-6 space-y-5">
          <h3 className="text-lg font-bold text-ramadan-gold">إضافة فائز</h3>

          {/* Mode Toggle */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setFormMode("manual")}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all border-2 ${
                formMode === "manual"
                  ? "bg-ramadan-gold/20 text-ramadan-gold border-ramadan-gold/50"
                  : "text-white/50 border-white/10 hover:border-white/20"
              }`}
            >
              إدخال يدوي
            </button>
            <button
              type="button"
              onClick={() => setFormMode("participant")}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all border-2 ${
                formMode === "participant"
                  ? "bg-ramadan-gold/20 text-ramadan-gold border-ramadan-gold/50"
                  : "text-white/50 border-white/10 hover:border-white/20"
              }`}
            >
              اختيار من المشاركين
            </button>
          </div>

          {/* Quiz Selection */}
          <Select
            label="الاختبار"
            options={[
              { value: "", label: "-- اختر اختبار --" },
              ...quizzes.map((q) => ({ value: String(q.id), label: q.title })),
            ]}
            value={selectedQuizId}
            onChange={(e) => setSelectedQuizId(e.target.value)}
          />

          {/* Draw Type */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/60">نوع السحب</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDrawType("quiz")}
                className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all border ${
                  drawType === "quiz"
                    ? "bg-ramadan-gold/20 text-ramadan-gold border-ramadan-gold/50"
                    : "text-white/50 border-white/10 hover:border-white/20"
                }`}
              >
                سحب اختبار
              </button>
              <button
                type="button"
                onClick={() => setDrawType("weekly")}
                className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all border ${
                  drawType === "weekly"
                    ? "bg-ramadan-gold/20 text-ramadan-gold border-ramadan-gold/50"
                    : "text-white/50 border-white/10 hover:border-white/20"
                }`}
              >
                سحب أسبوعي
              </button>
            </div>
          </div>

          {/* Manual Entry Fields */}
          {formMode === "manual" && (
            <div className="space-y-4">
              <Input
                label="اسم الفائز"
                placeholder="أدخل الاسم الكامل"
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
              />
              <Input
                label="رقم الجوال (اختياري)"
                placeholder="05xxxxxxxx"
                type="tel"
                value={manualPhone}
                onChange={(e) => setManualPhone(e.target.value)}
              />
            </div>
          )}

          {/* Participant Selection */}
          {formMode === "participant" && selectedQuizId && (
            <div className="space-y-3">
              {loadingParticipants ? (
                <div className="flex items-center justify-center py-6">
                  <div className="w-8 h-8 border-3 border-ramadan-gold border-t-transparent rounded-full animate-spin" />
                </div>
              ) : participants.length === 0 ? (
                <p className="text-white/40 text-sm text-center py-4">لا يوجد مشاركين في هذا الاختبار</p>
              ) : (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white/60">اختر المشارك</label>
                  {/* Search Input */}
                  <div className="relative">
                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="ابحث بالاسم أو رقم الجوال..."
                      value={participantSearch}
                      onChange={(e) => setParticipantSearch(e.target.value)}
                      className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-ramadan-purple/50 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-ramadan-gold/30 focus:border-ramadan-gold/30"
                    />
                  </div>
                  <div className="max-h-60 overflow-y-auto rounded-xl border border-white/10 divide-y divide-white/5">
                    {participants
                      .filter((p) => {
                        if (!participantSearch.trim()) return true;
                        const q = participantSearch.trim().toLowerCase();
                        return p.name.toLowerCase().includes(q) || (p.phone && p.phone.includes(q));
                      })
                      .map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelectedParticipant(String(p.id))}
                        className={`w-full flex items-center justify-between px-4 py-3 text-right transition-all ${
                          selectedParticipant === String(p.id)
                            ? "bg-ramadan-gold/20"
                            : "hover:bg-white/5"
                        }`}
                      >
                        <div>
                          <p className={`font-medium ${selectedParticipant === String(p.id) ? "text-ramadan-gold" : "text-white"}`}>
                            {p.name}
                          </p>
                          <p className="text-white/40 text-xs" dir="ltr">{p.phone || "-"}</p>
                        </div>
                        <span className={`text-sm font-bold px-2 py-1 rounded-full ${
                          p.percentage > 60 ? "bg-success/20 text-success" : "bg-white/10 text-white/50"
                        }`}>
                          {Math.round(p.percentage)}%
                        </span>
                      </button>
                    ))}
                    {participants.filter((p) => {
                      if (!participantSearch.trim()) return true;
                      const q = participantSearch.trim().toLowerCase();
                      return p.name.toLowerCase().includes(q) || (p.phone && p.phone.includes(q));
                    }).length === 0 && (
                      <p className="text-white/30 text-sm text-center py-4">لا توجد نتائج</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Submit */}
          <Button
            onClick={handleAddWinner}
            disabled={submitting || !selectedQuizId}
            isLoading={submitting}
            className="w-full"
          >
            إضافة الفائز
          </Button>
        </div>
      )}

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
                      <th className="text-right text-white/60 text-sm font-medium p-3">الجوال</th>
                      <th className="text-right text-white/60 text-sm font-medium p-3">النتيجة</th>
                      <th className="text-right text-white/60 text-sm font-medium p-3">حذف</th>
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
                          <td className="p-3 text-sm" dir="ltr"><PhoneCell phone={w.phone} id={w.id} /></td>
                          <td className="p-3">
                            <span className="inline-block px-3 py-1 bg-success/20 text-success rounded-full text-sm font-bold">
                              {Math.round(w.percentage)}%
                            </span>
                          </td>
                          <td className="p-3">
                            <button onClick={() => deleteWinner(w.id)} className="text-error hover:text-red-400 transition-colors p-1">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
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
                    <th className="text-right text-white/60 text-sm font-medium p-3">حذف</th>
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
                        <td className="p-3">
                          <button onClick={() => deleteWinner(w.id)} className="text-error hover:text-red-400 transition-colors p-1">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
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
