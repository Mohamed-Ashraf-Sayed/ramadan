import Link from "next/link";
import { Button } from "@/components/ui";
import Header from "@/components/Header";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [
    quizCount,
    submissionCount,
    maleCount,
    femaleCount,
    highestDayResult,
    drawWinners,
    weeklyDrawWinners,
  ] = await Promise.all([
    prisma.quiz.count(),
    prisma.submission.count(),
    prisma.submission.count({ where: { gender: "male" } }),
    prisma.submission.count({ where: { gender: "female" } }),
    prisma.$queryRaw<{ cnt: bigint }[]>`
      SELECT COUNT(*) as cnt FROM Submission
      GROUP BY DATE(createdAt)
      ORDER BY cnt DESC
      LIMIT 1
    `,
    prisma.drawWinner.findMany({
      where: { drawType: "quiz" },
      include: { quiz: { select: { id: true, title: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.drawWinner.findMany({
      where: { drawType: "weekly" },
      include: { quiz: { select: { id: true, title: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  // Group winners by quiz
  const winnersByQuiz: Record<number, { title: string; winners: { name: string; createdAt: Date }[] }> = {};
  for (const w of drawWinners) {
    if (!winnersByQuiz[w.quizId]) {
      winnersByQuiz[w.quizId] = { title: w.quiz.title, winners: [] };
    }
    winnersByQuiz[w.quizId].winners.push({ name: w.name, createdAt: w.createdAt });
  }

  // Group weekly winners by weekNumber field
  const weekNames: Record<number, string> = { 1: "الأسبوع الأول", 2: "الأسبوع الثاني", 3: "الأسبوع الثالث", 4: "الأسبوع الرابع", 5: "الأسبوع الخامس" };
  const weeklyByWeek: { weekLabel: string; winners: { name: string }[] }[] = [];
  if (weeklyDrawWinners.length > 0) {
    const weekMap = new Map<number, { name: string }[]>();
    for (const w of weeklyDrawWinners) {
      const wn = w.weekNumber || 1;
      if (!weekMap.has(wn)) weekMap.set(wn, []);
      weekMap.get(wn)!.push({ name: w.name });
    }
    // Sort by week number
    const sortedKeys = [...weekMap.keys()].sort((a, b) => a - b);
    for (const wn of sortedKeys) {
      weeklyByWeek.push({ weekLabel: weekNames[wn] || `الأسبوع ${wn}`, winners: weekMap.get(wn)! });
    }
  }

  const avgPerQuiz = quizCount > 0 ? Math.round(submissionCount / quizCount) : 0;
  const highestDay = highestDayResult.length > 0 ? Number(highestDayResult[0].cnt) : 0;
  const malePercent = submissionCount > 0 ? ((maleCount / submissionCount) * 100).toFixed(2) : "0";
  const femalePercent = submissionCount > 0 ? ((femaleCount / submissionCount) * 100).toFixed(2) : "0";
  return (
    <>
      <Header />
      <main className="min-h-screen bg-ramadan-navy">

        {/* ===== HERO BANNER ===== */}
        <section className="relative w-full">
          <img
            src="/hero-banner.png"
            alt="سنا الرمضانية - اشراقات تجمع الأسرة"
            className="w-full h-auto object-cover"
          />
        </section>

        {/* ===== CTA SECTION BELOW HERO ===== */}
        <section className="bg-ramadan-navy py-10 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-lg md:text-xl mb-8 text-gray-600 leading-relaxed">
              رحلة في بحور المعرفة بمختلف العلوم والمعارف، تهدف لإثراء الثقافة والمتعة التنافسية بين أفراد الأسرة
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/quiz">
                <Button size="lg" className="bg-ramadan-gold text-white hover:bg-ramadan-gold-light text-lg px-10 py-6 shadow-2xl shadow-ramadan-gold/30 w-full sm:w-auto font-bold">
                  ابدأ المسابقة الآن
                  <svg className="w-5 h-5 mr-2 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Button>
              </Link>
              <Link href="/quiz">
                <Button variant="outline" size="lg" className="border-2 border-ramadan-gold/50 text-ramadan-gold hover:bg-ramadan-gold/10 text-lg px-10 py-6 w-full sm:w-auto">
                  تصفح المسابقات
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ===== ABOUT SECTION ===== */}
        <section className="py-24 px-4 bg-ramadan-purple relative overflow-hidden">
          {/* Decorative pattern */}
          <div className="absolute inset-0 opacity-5">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="islamicPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M20 0L40 20L20 40L0 20Z" fill="none" stroke="#2e7dba" strokeWidth="0.5"/>
                  <circle cx="20" cy="20" r="8" fill="none" stroke="#2e7dba" strokeWidth="0.3"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#islamicPattern)"/>
            </svg>
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <svg className="w-6 h-6 text-ramadan-gold" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3C7.03 3 3 7.03 3 12S7.03 21 12 21C9.5 19 8 16 8 12S9.5 5 12 3Z"/>
                  </svg>
                  <span className="text-ramadan-gold text-sm font-medium">من نحن</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight" style={{ color: "#00416f" }}>
                  سنا الرمضانية
                </h2>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  رحلة في بحور المعرفة بمختلف العلوم والمعارف، تهدف لإثراء الثقافة والمتعة التنافسية بين أفراد الأسرة - اشراقات تجمع الأسرة.
                </p>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  تبدأ المسابقة يومياً من بعد صلاة المغرب مباشرة لمدة ٥ ساعات.
                </p>
                <div className="flex flex-wrap gap-4">
                  {[
                    { text: "تفاعلية", icon: "✓" },
                    { text: "لجميع أفراد الأسرة", icon: "✓" },
                    { text: "نتائج فورية", icon: "✓" },
                    { text: "3 فائزين يومياً (300 ريال)", icon: "✓" },
                    { text: "iPad + جوال أسبوعياً", icon: "✓" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 bg-ramadan-gold/10 border border-ramadan-gold/20 px-4 py-2 rounded-lg">
                      <span className="text-ramadan-gold">{item.icon}</span>
                      <span className="text-sm font-medium text-foreground">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats Card */}
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-ramadan-gold/20 to-transparent rounded-3xl blur-xl"></div>
                <div className="relative bg-white rounded-3xl p-8 border border-gray-200 shadow-xl">
                  {/* Lantern decoration */}
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                    <svg className="w-12 h-24 lantern-glow" viewBox="0 0 40 80" fill="none">
                      <path d="M20 0 L20 10" stroke="#2e7dba" strokeWidth="2"/>
                      <path d="M12 10 L28 10 L26 15 L14 15 Z" fill="#2e7dba"/>
                      <path d="M14 15 L14 55 Q14 65 20 65 Q26 65 26 55 L26 15 Z" fill="#5ba3d9" fillOpacity="0.3" stroke="#2e7dba" strokeWidth="1.5"/>
                      <ellipse cx="20" cy="40" rx="4" ry="12" fill="#5ba3d9" fillOpacity="0.6"/>
                      <circle cx="20" cy="70" r="3" fill="#2e7dba"/>
                    </svg>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-8">
                    {[
                      { number: submissionCount.toLocaleString("ar-EG"), label: "إجمالي المشاركات", icon: "👥" },
                      { number: quizCount.toLocaleString("ar-EG"), label: "أعداد المسابقات", icon: "📋" },
                      { number: avgPerQuiz.toLocaleString("ar-EG"), label: "متوسط المشاركات", icon: "📊" },
                      { number: highestDay.toLocaleString("ar-EG"), label: "أعلى يوم مشاركات", icon: "🏆" },
                      { number: `${malePercent}%`, label: "نسبة الذكور", icon: "👨" },
                      { number: `${femalePercent}%`, label: "نسبة الإناث", icon: "👩" },
                    ].map((stat, i) => (
                      <div key={i} className="bg-[#eef4fa] rounded-2xl p-4 text-center border border-[#d0dbe6]">
                        <span className="text-2xl mb-1 block">{stat.icon}</span>
                        <p className="text-2xl font-bold text-[#1a5c94] mb-1">{stat.number}</p>
                        <p className="text-xs text-gray-600 font-medium">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== WINNERS SECTION ===== */}
        {Object.keys(winnersByQuiz).length > 0 && (
          <section className="py-24 px-4 bg-gradient-to-b from-[#0a1929] via-[#0f2b46] to-[#0a1929] relative overflow-hidden">
            {/* Decorative stars */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-ramadan-gold rounded-full animate-twinkle"
                  style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 3}s`, opacity: 0.4 }}
                />
              ))}
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
              <div className="text-center mb-16">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <svg className="w-8 h-8 text-ramadan-gold" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-ramadan-gold mb-6">
                  فائزين المسابقات
                </h2>
                <p className="text-lg text-white/70">
                  الفائزين في سحوبات مسابقات سنا الرمضانية
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(winnersByQuiz).map(([quizId, group]) => (
                  <div key={quizId} className="bg-gradient-to-br from-[#1a3a5c] to-[#0f2b46] border-2 border-ramadan-gold/30 rounded-2xl overflow-hidden shadow-xl shadow-ramadan-gold/10">
                    <div className="bg-gradient-to-r from-ramadan-gold/20 to-ramadan-gold/10 border-b-2 border-ramadan-gold/30 px-6 py-4">
                      <h3 className="font-bold text-ramadan-gold text-xl">{group.title}</h3>
                    </div>
                    <div className="p-6 space-y-4">
                      {group.winners.map((w, i) => (
                        <div key={i} className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 border border-white/10">
                          <div className="w-10 h-10 rounded-full bg-ramadan-gold/20 flex items-center justify-center flex-shrink-0 border border-ramadan-gold/40">
                            <svg className="w-5 h-5 text-ramadan-gold" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                            </svg>
                          </div>
                          <span className="text-white text-lg font-bold">{w.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ===== WEEKLY WINNERS SECTION ===== */}
        {weeklyByWeek.length > 0 && (
          <section className="py-24 px-4 bg-gradient-to-b from-[#0f2b46] via-[#122a44] to-[#0a1929] relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(15)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-amber-400 rounded-full animate-twinkle"
                  style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 3}s`, opacity: 0.3 }}
                />
              ))}
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
              <div className="text-center mb-16">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <svg className="w-8 h-8 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-amber-400 mb-6">
                  فائزين السحب الأسبوعي
                </h2>
                <p className="text-lg text-white/70">
                  الفائزين في السحوبات الأسبوعية لمسابقات سنا الرمضانية
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {weeklyByWeek.map((week, idx) => (
                  <div key={idx} className="bg-gradient-to-br from-[#1a3a5c] to-[#0f2b46] border-2 border-amber-400/30 rounded-2xl overflow-hidden shadow-xl shadow-amber-500/10">
                    <div className="bg-gradient-to-r from-amber-400/20 to-amber-400/10 border-b-2 border-amber-400/30 px-6 py-4">
                      <h3 className="font-bold text-amber-400 text-xl">{week.weekLabel}</h3>
                    </div>
                    <div className="p-6 space-y-4">
                      {week.winners.map((w, i) => (
                        <div key={i} className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 border border-white/10">
                          <div className="w-10 h-10 rounded-full bg-amber-400/20 flex items-center justify-center flex-shrink-0 border border-amber-400/40">
                            <svg className="w-5 h-5 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                            </svg>
                          </div>
                          <span className="text-white text-lg font-bold">{w.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ===== HOW IT WORKS ===== */}
        <section className="py-24 px-4 bg-ramadan-purple">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-3 mb-6">
                <svg className="w-5 h-5 text-ramadan-gold" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3C7.03 3 3 7.03 3 12S7.03 21 12 21C9.5 19 8 16 8 12S9.5 5 12 3Z"/>
                </svg>
                <span className="text-ramadan-gold text-sm font-medium">خطوات بسيطة</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                كيف تشارك في المسابقة؟
              </h2>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                ثلاث خطوات بسيطة فقط للمشاركة في مسابقات سنا الرمضانية
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connection line */}
              <div className="hidden md:block absolute top-20 left-1/4 right-1/4 h-0.5 bg-gradient-to-l from-ramadan-gold via-ramadan-gold/50 to-ramadan-gold"></div>

              {[
               { step: "01", title: "اختر المسابقة", description: "تصفح المسابقات المتاحة اليوميه" },

                { step: "02", title: "أدخل بياناتك", description: "سجل اسمك رباعي، وبالنسبة لزوجات الأبناء تكتب حرم / اسم الزوج رباعي" },
                { step: "03", title: "ابدأ ", description: "أجب على الأسئلة وادخل السحب على الإجابات الصحيحة" },
              ].map((item, index) => (
                <div key={index} className="relative text-center">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-ramadan-gold to-ramadan-amber text-ramadan-dark rounded-full flex items-center justify-center text-2xl font-bold mb-6 shadow-xl shadow-ramadan-gold/30 relative z-10">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                  <p className="text-gray-500">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* ===== IMPORTANT NOTICES ===== */}
        <section className="py-16 px-4 bg-ramadan-purple">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-ramadan-gold/10 to-ramadan-gold/5 border-2 border-ramadan-gold/30 rounded-3xl p-8 md:p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-ramadan-gold/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-ramadan-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-ramadan-gold">تنبيهات مهمة للفوز</h3>
              </div>
              <div className="space-y-4">
                {[
                  "المسابقة حصرياً لأفراد الأسرة وزوجات الأبناء فقط.",
                  "يحق لكل فرد في العائلة التسجيل باسمه، لكن يمنع تكرار الاسم لكي لا يُلغى سحبك!",
                  "يجب الدقة في تعبئة البيانات للدخول في السحب.",
                  "بالنسبة لزوجات الأبناء تكتب: حرم / اسم الزوج رباعي.",
                ].map((notice, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-ramadan-gold/20 flex items-center justify-center mt-0.5">
                      <span className="text-ramadan-gold text-xs font-bold">{i + 1}</span>
                    </span>
                    <p className="text-gray-600 text-lg">{notice}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== FAQ SECTION ===== */}
        <section className="py-24 px-4 bg-ramadan-purple">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-3 mb-6">
                <svg className="w-6 h-6 text-ramadan-gold" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                </svg>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                الأسئلة الشائعة
              </h2>
              <p className="text-lg text-gray-500">
                إليك إجابات على أكثر الأسئلة شيوعاً
              </p>
            </div>

            <div className="space-y-4">
              {[
                { q: "هل المشاركة خاصة؟", a: "نعم، المسابقة حصرياً لأفراد الأسرة وزوجات الأبناء فقط." },
                { q: "ما هي جوائز المسابقة؟", a: "3 فائزين يومياً: سحوبات نقدية بقيمة (300) ريال لكل فائز. بالإضافة إلى مفاجآت نهاية الأسبوع: جهاز iPad وجهاز جوال عبر السحب على جميع إجابات المشاركين خلال الأسبوع." },
                { q: "ما هو موعد المسابقة اليومي؟", a: "تبدأ من بعد صلاة المغرب مباشرة لمدة ٥ ساعات." },
                { q: "ما هي آلية الدخول في السحب الأسبوعي؟", a: "جميع المشاركين بالإجابات الصحيحة خلال الأسبوع يتم دخولهم ضمن السحب الأسبوعي." },
                { q: "هل يمكن المشاركة من الهاتف؟", a: "بالتأكيد! المنصة متوافقة مع جميع الأجهزة - هواتف، تابلت، وأجهزة الكمبيوتر." },
              ].map((faq, index) => (
                <div key={index} className="bg-ramadan-navy/50 border border-ramadan-gold/10 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-foreground mb-2">{faq.q}</h3>
                  <p className="text-gray-500">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== FOOTER ===== */}
        <footer className="bg-[#0f2b46] text-white relative overflow-hidden">
          {/* Mosque silhouette at top */}
          <div className="absolute top-0 left-0 right-0 rotate-180">
            <svg viewBox="0 0 1200 40" className="w-full" fill="#0f2b46" preserveAspectRatio="xMidYMin slice">
              <path d="M0 40 L0 30 L100 30 L100 20 L110 10 L120 20 L120 30 L300 30 L300 15 L320 15 L330 0 L340 15 L360 15 L360 30 L500 30 L500 20 L510 10 L520 20 L520 30 L700 30 L700 15 L720 15 L730 0 L740 15 L760 15 L760 30 L900 30 L900 20 L910 10 L920 20 L920 30 L1100 30 L1100 15 L1120 15 L1130 0 L1140 15 L1160 15 L1160 30 L1200 30 L1200 40 Z"/>
            </svg>
          </div>

          <div className="max-w-7xl mx-auto px-4 py-16 relative z-10">
            <div className="grid md:grid-cols-4 gap-12 mb-12">
              {/* Brand */}
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-ramadan-gold to-ramadan-amber rounded-xl flex items-center justify-center">
                    <svg className="w-7 h-7 text-ramadan-dark" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 3C7.03 3 3 7.03 3 12S7.03 21 12 21C9.5 19 8 16 8 12S9.5 5 12 3Z"/>
                      <path d="M18 8L18.7 10L21 10L19.2 11.5L19.9 14L18 12.5L16.1 14L16.8 11.5L15 10L17.3 10Z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-ramadan-gold">سنا الرمضانية</h3>
                    <p className="text-sm text-white/60">اشراقات تجمع الأسرة</p>
                  </div>
                </div>
                <p className="text-white/60 leading-relaxed max-w-md">
                  رحلة في بحور المعرفة بمختلف العلوم والمعارف، تهدف لإثراء الثقافة والمتعة التنافسية بين أفراد الأسرة.
                </p>
              </div>

              {/* Links */}
              <div>
                <h4 className="font-bold text-ramadan-gold mb-4">روابط سريعة</h4>
                <ul className="space-y-2 text-white/60">
                  <li><Link href="/" className="hover:text-ramadan-gold transition-colors">الرئيسية</Link></li>
                  <li><Link href="/quiz" className="hover:text-ramadan-gold transition-colors">المسابقات</Link></li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h4 className="font-bold text-ramadan-gold mb-4">تواصل معنا</h4>
                <ul className="space-y-2 text-white/60">
                  <li>سنا الرمضانية</li>
                  <li>المملكة العربية السعودية</li>
                </ul>
              </div>
            </div>

            {/* Bottom */}
            <div className="pt-8 border-t border-ramadan-gold/10 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-white/40 text-sm">
                جميع الحقوق محفوظة © {new Date().getFullYear()} سنا الرمضانية
              </p>
              <div className="flex items-center gap-2">
                <span className="text-white/40 text-sm">صنع بـ</span>
                <svg className="w-4 h-4 text-error" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                <span className="text-white/40 text-sm">في السعودية</span>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
