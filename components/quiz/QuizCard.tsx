"use client";

import Link from "next/link";
import type { Quiz } from "@/types";

interface QuizCardProps {
  quiz: Quiz & { _count?: { questions: number; submissions: number } };
}

export default function QuizCard({ quiz }: QuizCardProps) {
  return (
    <div className="group bg-ramadan-navy rounded-2xl shadow-md hover:shadow-xl hover:shadow-ramadan-gold/10 transition-all duration-300 hover:-translate-y-2 overflow-hidden border border-ramadan-gold/20 relative">
      {/* Top Accent Bar */}
      <div className="h-1.5 bg-gradient-to-l from-ramadan-gold to-ramadan-amber"></div>

      {/* Card Content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white group-hover:text-ramadan-gold transition-colors line-clamp-1">
              {quiz.title}
            </h3>
          </div>
          <div className="flex items-center gap-1 bg-ramadan-gold/10 text-ramadan-gold px-3 py-1.5 rounded-full mr-3 border border-ramadan-gold/20">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-semibold">{quiz._count?.questions || 0}</span>
          </div>
        </div>

        {/* Description */}
        {quiz.description && (
          <p className="text-white/60 text-sm line-clamp-2 mb-4 leading-relaxed">
            {quiz.description}
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-white/60 mb-6">
          <div className="flex items-center gap-1.5">
            <div className="w-8 h-8 rounded-lg bg-ramadan-gold/10 flex items-center justify-center">
              <svg className="w-4 h-4 text-ramadan-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="font-medium">{quiz._count?.submissions || 0} مشارك</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-8 h-8 rounded-lg bg-ramadan-orange/10 flex items-center justify-center">
              <svg className="w-4 h-4 text-ramadan-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="font-medium">
              {quiz.timeLimit ? `${quiz.timeLimit} دقيقة` : "بدون وقت"}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <Link
          href={`/quiz/${quiz.id}`}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-l from-ramadan-gold to-ramadan-amber text-ramadan-dark rounded-xl font-semibold hover:from-ramadan-gold-light hover:to-ramadan-gold transition-all duration-300 shadow-lg shadow-ramadan-gold/20 hover:shadow-xl hover:shadow-ramadan-gold/30 group-hover:-translate-y-0.5"
        >
          <span>ابدأ المسابقة</span>
          <svg className="w-5 h-5 rotate-180 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>

      {/* Decorative Lantern Icon */}
      <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <svg className="w-6 h-6 text-ramadan-gold/30" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L9 5H15L12 2ZM8 6V18C8 19.1 8.9 20 10 20H14C15.1 20 16 19.1 16 18V6H8ZM10 8H14V16H10V8Z"/>
        </svg>
      </div>
    </div>
  );
}
