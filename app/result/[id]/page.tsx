"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui";
import type { Submission } from "@/types";

interface SubmissionWithDetails extends Omit<Submission, 'quiz'> {
  quiz: {
    title: string;
  };
}

type Step = "notes" | "farewell" | "result";

export default function ResultPage() {
  const params = useParams();
  const submissionId = params.id as string;

  const [submission, setSubmission] = useState<SubmissionWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<Step>("notes");
  const [notes, setNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  useEffect(() => {
    async function fetchResult() {
      try {
        const response = await fetch(`/api/submissions/${submissionId}`);
        if (response.ok) {
          const data = await response.json();
          setSubmission(data);
          // If notes already exist, skip to farewell
          if (data.notes) {
            setStep("farewell");
          }
        }
      } catch (error) {
        console.error("Error fetching result:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchResult();
  }, [submissionId]);

  async function handleSaveNotes() {
    if (!notes.trim()) return;
    setSavingNotes(true);
    try {
      await fetch(`/api/submissions/${submissionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: notes.trim() }),
      });
    } catch {
      // Continue even if save fails
    } finally {
      setSavingNotes(false);
      setStep("farewell");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a1929] via-[#122a44] to-[#0a1929] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/50">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a1929] via-[#122a44] to-[#0a1929] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-amber-400 mb-4">
            النتيجة غير موجودة
          </h1>
          <Link href="/quiz">
            <Button>العودة للاختبارات</Button>
          </Link>
        </div>
      </div>
    );
  }

  const getScoreColor = () => {
    if (submission.percentage >= 80) return "text-success";
    if (submission.percentage >= 60) return "text-accent";
    if (submission.percentage >= 40) return "text-yellow-500";
    return "text-error";
  };

  const getScoreMessage = () => {
    if (submission.percentage >= 80) return "ممتاز! أحسنت";
    if (submission.percentage >= 60) return "جيد جداً";
    if (submission.percentage >= 40) return "جيد، يمكنك التحسن";
    return "حاول مرة أخرى";
  };

  const getScoreEmoji = () => {
    if (submission.percentage >= 80) return "🌟";
    if (submission.percentage >= 60) return "👏";
    if (submission.percentage >= 40) return "💪";
    return "🔄";
  };

  // ===== STEP 1: Notes =====
  if (step === "notes") {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#0a1929] via-[#122a44] to-[#0a1929] flex items-center justify-center px-4 relative overflow-hidden">
        {/* Decorative stars */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-amber-400 rounded-full animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                opacity: 0.2 + Math.random() * 0.4,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-lg w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-amber-400/20 to-amber-400/5 rounded-full flex items-center justify-center border border-amber-400/30 mb-6">
              <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-amber-400 mb-3">
              تم إرسال إجاباتك بنجاح
            </h1>
          </div>

          {/* Notes Card */}
          <div className="bg-white/5 backdrop-blur-sm border border-amber-400/20 rounded-2xl p-6 shadow-xl">
            <div className="bg-amber-400/10 border border-amber-400/20 rounded-xl p-4 mb-5">
              <p className="text-sm text-amber-400/90 leading-relaxed text-center">
                ختاماً .. أبناء وبنات العم الأكارم ،، بفيض من الامتنان يُحييكم فريق العمل بمسابقة سنا الرمضانية ويثمّن تفاعلكم الرائع ، وبما أن بصمتكم هي الأهم؛ ما هي الرسالة التي تودون إيصالها لفريق العمل؟
              </p>
            </div>

            <label className="block text-sm font-medium text-white/70 mb-2">
              رسالتك لفريق العمل <span className="text-amber-400">*</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="اكتب رسالتك هنا..."
              className="w-full px-4 py-3 rounded-xl bg-white/10 border-2 border-white/10 focus:border-amber-400/50 focus:outline-none text-white text-sm resize-none transition-colors placeholder:text-white/30"
              rows={4}
              dir="rtl"
            />

            <button
              onClick={handleSaveNotes}
              disabled={!notes.trim() || savingNotes}
              className="w-full mt-4 px-6 py-3 bg-gradient-to-l from-amber-500 to-amber-400 text-[#0a1929] rounded-xl font-bold text-base hover:from-amber-400 hover:to-amber-300 transition-all duration-300 shadow-lg shadow-amber-400/20 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {savingNotes ? "جاري الإرسال..." : "إرسال"}
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ===== STEP 2: Farewell =====
  if (step === "farewell") {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#0a1929] via-[#122a44] to-[#0a1929] flex items-center justify-center px-4 relative overflow-hidden">
        {/* Decorative stars */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-amber-400 rounded-full animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
                opacity: 0.2 + Math.random() * 0.5,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center max-w-xl mx-auto">
          {/* Crescent Moon */}
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-amber-400/20 to-amber-400/5 rounded-full flex items-center justify-center border border-amber-400/30 shadow-lg shadow-amber-400/10">
              <svg className="w-12 h-12 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3C7.03 3 3 7.03 3 12S7.03 21 12 21C9.5 19 8 16 8 12S9.5 5 12 3Z"/>
              </svg>
            </div>
          </div>

          {/* Main farewell text */}
          <h1 className="text-3xl md:text-4xl font-bold text-amber-400 mb-6 leading-relaxed">
            نلقاكم رمضان القادم بإذن الله تعالى
            <br />
            في مسابقة سنا الرمضانية
          </h1>

          <div className="w-24 h-0.5 bg-gradient-to-l from-transparent via-amber-400 to-transparent mx-auto mb-6" />

          <p className="text-white/50 text-base max-w-md mx-auto leading-relaxed mb-10">
            شكراً لمشاركتكم وتفاعلكم الرائع
            <br />
            نسأل الله أن يتقبل منا ومنكم صالح الأعمال
          </p>

          {/* Decorative stars row */}
          <div className="flex items-center justify-center gap-3 mb-10">
            <svg className="w-4 h-4 text-amber-400/40" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
            <span className="text-amber-400/30 text-sm font-medium">سنا الرمضانية</span>
            <svg className="w-4 h-4 text-amber-400/40" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </div>

          {/* View result button */}
          <button
            onClick={() => setStep("result")}
            className="inline-flex flex-col items-center gap-2 text-amber-400/60 hover:text-amber-400 transition-colors"
          >
            <span className="text-sm font-medium">عرض النتيجة</span>
            <svg className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
      </main>
    );
  }

  // ===== STEP 3: Result =====
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#e8f1fa] via-[#f0f5fa] to-[#e4edf5] py-12 px-4 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <div className="bg-white border border-ramadan-gold/20 rounded-2xl overflow-hidden shadow-xl">
          {/* Header with gradient */}
          <div className="bg-gradient-to-l from-ramadan-gold/20 to-ramadan-purple text-foreground p-8 text-center border-b border-ramadan-gold/20">
            <h2 className="text-2xl font-bold mb-2 text-ramadan-gold">نتيجة الاختبار</h2>
            <p className="text-gray-700">{submission.quiz.title}</p>
          </div>

          <div className="p-8">
            {/* Score Circle */}
            <div className="text-center mb-8">
              <div className="relative inline-flex items-center justify-center w-40 h-40">
                <svg className="w-40 h-40 transform -rotate-90">
                  <circle
                    className="text-gray-200"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r="62"
                    cx="80"
                    cy="80"
                  />
                  <circle
                    className={getScoreColor()}
                    strokeWidth="8"
                    strokeDasharray={`${submission.percentage * 3.89} 389`}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="62"
                    cx="80"
                    cy="80"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-4xl">{getScoreEmoji()}</span>
                  <span className={`text-3xl font-bold ${getScoreColor()}`}>
                    {Math.round(submission.percentage)}%
                  </span>
                </div>
              </div>

              <h2 className={`text-2xl font-bold mt-4 ${getScoreColor()}`}>
                {getScoreMessage()}
              </h2>

              <p className="text-gray-500 mt-2">
                حصلت على {submission.score} من {submission.totalPoints} نقطة
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 bg-ramadan-purple/50 rounded-xl border border-ramadan-gold/10">
                <p className="text-2xl font-bold text-ramadan-gold">
                  {submission.totalPoints}
                </p>
                <p className="text-sm text-gray-500">إجمالي النقاط</p>
              </div>
              <div className="text-center p-4 bg-success/10 rounded-xl border border-success/20">
                <p className="text-2xl font-bold text-success">
                  {submission.score}
                </p>
                <p className="text-sm text-gray-500">نقاطك</p>
              </div>
              <div className="text-center p-4 bg-error/10 rounded-xl border border-error/20">
                <p className="text-2xl font-bold text-error">
                  {submission.totalPoints - submission.score}
                </p>
                <p className="text-sm text-gray-500">خسرت</p>
              </div>
            </div>

            {/* Participant Info */}
            <div className="bg-ramadan-purple/30 p-4 rounded-xl mb-6 border border-ramadan-gold/10">
              <h3 className="font-bold text-ramadan-gold mb-2">بيانات المشترك</h3>
              <p className="text-sm text-gray-600">
                <span className="font-medium text-gray-800">الاسم:</span> {submission.name}
              </p>
            </div>

            {/* Action */}
            <Link href="/quiz">
              <Button className="w-full">اختبار آخر</Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
