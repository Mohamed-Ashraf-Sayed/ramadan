import { prisma } from "@/lib/prisma";
import QuizCard from "@/components/quiz/QuizCard";
import Header from "@/components/Header";
import Link from "next/link";
import type { Quiz } from "@/types";

export const dynamic = "force-dynamic";

type QuizWithCount = Quiz & {
  _count: {
    questions: number;
    submissions: number;
  };
};

async function getQuizzes(): Promise<QuizWithCount[]> {
  const quizzes = await prisma.quiz.findMany({
    where: { isActive: true },
    include: {
      _count: {
        select: {
          questions: true,
          submissions: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return quizzes as QuizWithCount[];
}

export default async function QuizzesPage() {
  const quizzes = await getQuizzes();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-ramadan-navy">
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-ramadan-dark via-ramadan-navy to-ramadan-purple"></div>

          {/* Stars */}
          <div className="absolute inset-0">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  opacity: Math.random() * 0.5 + 0.3,
                }}
              />
            ))}
          </div>

          {/* Islamic pattern */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23d4af37' stroke-width='0.5'%3E%3Cpath d='M30 0L60 30L30 60L0 30Z'/%3E%3Cpath d='M30 15L45 30L30 45L15 30Z'/%3E%3Ccircle cx='30' cy='30' r='10'/%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>

          {/* Mosque silhouette */}
          <div className="absolute bottom-0 left-0 right-0 opacity-20">
            <svg viewBox="0 0 1200 100" className="w-full" fill="#0f0f23" preserveAspectRatio="xMidYMax slice">
              <path d="M0 100 L0 70 L100 70 L100 50 L120 30 L140 50 L140 70 L300 70 L300 40 L330 40 L350 10 L370 40 L400 40 L400 70 L550 70 L550 50 L570 30 L590 50 L590 70 L750 70 L750 40 L780 40 L800 10 L820 40 L850 40 L850 70 L1000 70 L1000 50 L1020 30 L1040 50 L1040 70 L1200 70 L1200 100 Z"/>
            </svg>
          </div>

          {/* Lanterns */}
          <div className="absolute top-0 left-[15%] animate-lantern hidden md:block" style={{ animationDelay: '0s' }}>
            <svg className="w-10 h-20 lantern-glow" viewBox="0 0 40 80" fill="none">
              <path d="M20 0 L20 10" stroke="#d4af37" strokeWidth="2"/>
              <path d="M12 10 L28 10 L26 15 L14 15 Z" fill="#d4af37"/>
              <path d="M14 15 L14 55 Q14 65 20 65 Q26 65 26 55 L26 15 Z" fill="#ff6b35" fillOpacity="0.3" stroke="#d4af37" strokeWidth="1.5"/>
              <ellipse cx="20" cy="40" rx="4" ry="12" fill="#ff6b35" fillOpacity="0.6"/>
            </svg>
          </div>
          <div className="absolute top-0 right-[15%] animate-lantern hidden md:block" style={{ animationDelay: '1s' }}>
            <svg className="w-10 h-20 lantern-glow" viewBox="0 0 40 80" fill="none">
              <path d="M20 0 L20 10" stroke="#d4af37" strokeWidth="2"/>
              <path d="M12 10 L28 10 L26 15 L14 15 Z" fill="#d4af37"/>
              <path d="M14 15 L14 55 Q14 65 20 65 Q26 65 26 55 L26 15 Z" fill="#ff6b35" fillOpacity="0.3" stroke="#d4af37" strokeWidth="1.5"/>
              <ellipse cx="20" cy="40" rx="4" ry="12" fill="#ff6b35" fillOpacity="0.6"/>
            </svg>
          </div>

          <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
            {/* Icon */}
            <div className="w-20 h-20 mx-auto mb-6 bg-ramadan-gold/10 border border-ramadan-gold/30 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <svg className="w-10 h-10 text-ramadan-gold" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gold-gradient">
              مسابقات أسداف
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
              اختر مسابقة من المسابقات المتاحة وابدأ التحدي الآن
            </p>

            {/* Stats */}
            <div className="flex justify-center gap-8 mt-8">
              <div className="text-center">
                <p className="text-3xl font-bold text-ramadan-gold">{quizzes.length}</p>
                <p className="text-sm text-white/60">مسابقة متاحة</p>
              </div>
              <div className="w-px bg-ramadan-gold/30"></div>
              <div className="text-center">
                <p className="text-3xl font-bold text-ramadan-gold">
                  {quizzes.reduce((acc, q) => acc + (q._count?.questions || 0), 0)}
                </p>
                <p className="text-sm text-white/60">سؤال</p>
              </div>
              <div className="w-px bg-ramadan-gold/30"></div>
              <div className="text-center">
                <p className="text-3xl font-bold text-ramadan-gold">
                  {quizzes.reduce((acc, q) => acc + (q._count?.submissions || 0), 0)}
                </p>
                <p className="text-sm text-white/60">مشارك</p>
              </div>
            </div>
          </div>
        </section>

        {/* Quizzes Section */}
        <section className="py-16 px-4 relative bg-ramadan-purple">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="quizPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M20 0L40 20L20 40L0 20Z" fill="none" stroke="#d4af37" strokeWidth="0.3"/>
                  <circle cx="20" cy="20" r="8" fill="none" stroke="#d4af37" strokeWidth="0.2"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#quizPattern)"/>
            </svg>
          </div>

          <div className="max-w-6xl mx-auto relative z-10">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white">المسابقات المتاحة</h2>
                <p className="text-white/60 mt-1">اختر المسابقة التي تناسبك</p>
              </div>
              <Link
                href="/"
                className="flex items-center gap-2 text-ramadan-gold hover:text-ramadan-gold-light transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="font-medium">الرئيسية</span>
              </Link>
            </div>

            {/* Quizzes Grid */}
            {quizzes.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quizzes.map((quiz, index) => (
                  <div
                    key={quiz.id}
                    className="animate-fadeIn"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <QuizCard quiz={quiz} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-32 h-32 mx-auto mb-8 bg-ramadan-gold/10 border border-ramadan-gold/20 rounded-3xl flex items-center justify-center">
                  <svg className="w-16 h-16 text-ramadan-gold/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  لا توجد مسابقات حالياً
                </h2>
                <p className="text-lg text-white/60 mb-8 max-w-md mx-auto">
                  سيتم إضافة مسابقات جديدة قريباً، ترقبوا المزيد من التحديات المثيرة!
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 bg-ramadan-gold text-ramadan-dark px-6 py-3 rounded-xl font-medium hover:bg-ramadan-gold-light transition-all hover:-translate-y-0.5 shadow-lg shadow-ramadan-gold/25"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  العودة للرئيسية
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
