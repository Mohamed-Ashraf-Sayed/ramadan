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

export default function ResultPage() {
  const params = useParams();
  const submissionId = params.id as string;

  const [submission, setSubmission] = useState<SubmissionWithDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResult() {
      try {
        const response = await fetch(`/api/submissions/${submissionId}`);
        if (response.ok) {
          const data = await response.json();
          setSubmission(data);
        }
      } catch (error) {
        console.error("Error fetching result:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchResult();
  }, [submissionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-ramadan-dark via-ramadan-navy to-ramadan-purple flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-ramadan-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">جاري تحميل النتيجة...</p>
        </div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-ramadan-dark via-ramadan-navy to-ramadan-purple flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-ramadan-gold mb-4">
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

  return (
    <main className="min-h-screen bg-gradient-to-b from-ramadan-dark via-ramadan-navy to-ramadan-purple py-12 px-4 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        {/* Result Card */}
        <div className="bg-ramadan-navy/80 border border-ramadan-gold/20 rounded-2xl mb-6 overflow-hidden shadow-xl">
          {/* Header with gradient */}
          <div className="bg-gradient-to-l from-ramadan-gold/20 to-ramadan-purple text-white p-8 text-center border-b border-ramadan-gold/20">
            <h1 className="text-2xl font-bold mb-2 text-ramadan-gold">نتيجة الاختبار</h1>
            <p className="text-white/80">{submission.quiz.title}</p>
          </div>

          <div className="p-8">
            {/* Score Circle */}
            <div className="text-center mb-8">
              <div className="relative inline-flex items-center justify-center w-40 h-40">
                <svg className="w-40 h-40 transform -rotate-90">
                  <circle
                    className="text-white/10"
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

              <p className="text-white/60 mt-2">
                حصلت على {submission.score} من {submission.totalPoints} نقطة
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 bg-ramadan-purple/50 rounded-xl border border-ramadan-gold/10">
                <p className="text-2xl font-bold text-ramadan-gold">
                  {submission.totalPoints}
                </p>
                <p className="text-sm text-white/60">إجمالي النقاط</p>
              </div>
              <div className="text-center p-4 bg-success/10 rounded-xl border border-success/20">
                <p className="text-2xl font-bold text-success">
                  {submission.score}
                </p>
                <p className="text-sm text-white/60">نقاطك</p>
              </div>
              <div className="text-center p-4 bg-error/10 rounded-xl border border-error/20">
                <p className="text-2xl font-bold text-error">
                  {submission.totalPoints - submission.score}
                </p>
                <p className="text-sm text-white/60">خسرت</p>
              </div>
            </div>

            {/* Participant Info */}
            <div className="bg-ramadan-purple/30 p-4 rounded-xl mb-6 border border-ramadan-gold/10">
              <h3 className="font-bold text-ramadan-gold mb-2">بيانات المشترك</h3>
              <p className="text-sm text-white/70">
                <span className="font-medium text-white/90">الاسم:</span> {submission.name}
              </p>
              <p className="text-sm text-white/70">
                <span className="font-medium text-white/90">البريد:</span> {submission.email}
              </p>
              <p className="text-sm text-white/70">
                <span className="font-medium text-white/90">الموبايل:</span> {submission.phone}
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
