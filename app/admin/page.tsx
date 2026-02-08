"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui";

interface Stats {
  totalQuizzes: number;
  activeQuizzes: number;
  totalSubmissions: number;
  totalQuestions: number;
  averageScore: number;
  recentSubmissions: Array<{
    id: number;
    name: string;
    percentage: number;
    createdAt: string;
    quiz: { title: string };
  }>;
  topQuizzes: Array<{
    id: number;
    title: string;
    _count: { submissions: number };
  }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/admin/stats");
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-ramadan-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-ramadan-gold">لوحة التحكم</h1>
          <p className="text-white/60 mt-1">مرحباً بك في لوحة تحكم المسابقات</p>
        </div>
        <Link href="/admin/quizzes/new">
          <Button className="bg-ramadan-gold text-ramadan-dark hover:bg-ramadan-gold-light">
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            إنشاء اختبار
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-ramadan-purple rounded-xl p-6 border border-ramadan-gold/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/60">إجمالي الاختبارات</p>
              <p className="text-3xl font-bold text-ramadan-gold">{stats?.totalQuizzes || 0}</p>
            </div>
            <div className="w-12 h-12 bg-ramadan-gold/10 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-ramadan-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-white/40 mt-2">
            {stats?.activeQuizzes || 0} اختبار نشط
          </p>
        </div>

        <div className="bg-ramadan-purple rounded-xl p-6 border border-ramadan-gold/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/60">إجمالي المشاركات</p>
              <p className="text-3xl font-bold text-success">{stats?.totalSubmissions || 0}</p>
            </div>
            <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-ramadan-purple rounded-xl p-6 border border-ramadan-gold/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/60">إجمالي الأسئلة</p>
              <p className="text-3xl font-bold text-ramadan-orange">{stats?.totalQuestions || 0}</p>
            </div>
            <div className="w-12 h-12 bg-ramadan-orange/10 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-ramadan-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-ramadan-purple rounded-xl p-6 border border-ramadan-gold/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/60">متوسط الدرجات</p>
              <p className="text-3xl font-bold text-blue-400">
                {Math.round(stats?.averageScore || 0)}%
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity & Top Quizzes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Submissions */}
        <div className="bg-ramadan-purple rounded-xl border border-ramadan-gold/20 overflow-hidden">
          <div className="px-6 py-4 border-b border-ramadan-gold/20 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">آخر المشاركات</h2>
            <Link href="/admin/results" className="text-sm text-ramadan-gold hover:text-ramadan-gold-light">
              عرض الكل
            </Link>
          </div>
          <div className="px-6 py-4">
            {stats?.recentSubmissions && stats.recentSubmissions.length > 0 ? (
              <div className="space-y-4">
                {stats.recentSubmissions.slice(0, 5).map((submission) => (
                  <div key={submission.id} className="flex items-center justify-between py-2 border-b border-ramadan-gold/10 last:border-0">
                    <div>
                      <p className="font-medium text-white">{submission.name}</p>
                      <p className="text-sm text-white/50">{submission.quiz.title}</p>
                    </div>
                    <div className="text-left">
                      <p className={`font-bold ${submission.percentage >= 60 ? "text-success" : "text-error"}`}>
                        {Math.round(submission.percentage)}%
                      </p>
                      <p className="text-xs text-white/40">
                        {new Date(submission.createdAt).toLocaleDateString("ar-EG")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-white/50 py-8">لا توجد مشاركات بعد</p>
            )}
          </div>
        </div>

        {/* Top Quizzes */}
        <div className="bg-ramadan-purple rounded-xl border border-ramadan-gold/20 overflow-hidden">
          <div className="px-6 py-4 border-b border-ramadan-gold/20 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">أكثر الاختبارات مشاركة</h2>
            <Link href="/admin/quizzes" className="text-sm text-ramadan-gold hover:text-ramadan-gold-light">
              عرض الكل
            </Link>
          </div>
          <div className="px-6 py-4">
            {stats?.topQuizzes && stats.topQuizzes.length > 0 ? (
              <div className="space-y-4">
                {stats.topQuizzes.map((quiz, index) => (
                  <div key={quiz.id} className="flex items-center gap-4 py-2 border-b border-ramadan-gold/10 last:border-0">
                    <span className="w-8 h-8 rounded-full bg-ramadan-gold/20 flex items-center justify-center text-sm font-bold text-ramadan-gold">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium text-white">{quiz.title}</p>
                    </div>
                    <span className="text-sm text-white/50">
                      {quiz._count.submissions} مشارك
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-white/50 py-8">لا توجد اختبارات بعد</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
