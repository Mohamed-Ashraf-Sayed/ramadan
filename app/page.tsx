import Link from "next/link";
import { Button } from "@/components/ui";
import Header from "@/components/Header";

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-ramadan-navy">

        {/* ===== HERO SECTION ===== */}
        <section className="relative min-h-screen flex items-center overflow-hidden ramadan-sky">
          {/* Stars Background */}
          <div className="absolute inset-0">
            {/* Stars */}
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
                style={{
                  top: `${Math.random() * 60}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  opacity: Math.random() * 0.5 + 0.3,
                }}
              />
            ))}
            {/* Larger stars */}
            {[...Array(15)].map((_, i) => (
              <div
                key={`large-${i}`}
                className="absolute w-2 h-2 bg-ramadan-gold rounded-full animate-twinkle"
                style={{
                  top: `${Math.random() * 50}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
          </div>

          {/* Crescent Moon */}
          <div className="absolute top-20 left-1/4 animate-glow">
            <svg className="w-32 h-32 md:w-48 md:h-48 text-ramadan-gold" viewBox="0 0 100 100" fill="currentColor">
              <path d="M50 5 C25 5 5 30 5 55 C5 80 25 95 50 95 C30 85 20 70 20 50 C20 30 35 12 50 5 Z" />
              {/* Star next to moon */}
              <path d="M75 20 L78 28 L87 28 L80 34 L83 42 L75 36 L67 42 L70 34 L63 28 L72 28 Z" />
            </svg>
          </div>

          {/* Hanging Lanterns */}
          <div className="absolute top-0 left-[10%] animate-lantern" style={{ animationDelay: '0s' }}>
            <svg className="w-16 h-32 md:w-20 md:h-40 lantern-glow" viewBox="0 0 60 120" fill="none">
              {/* Chain */}
              <path d="M30 0 L30 20" stroke="#d4af37" strokeWidth="2"/>
              {/* Top cap */}
              <path d="M20 20 L40 20 L38 25 L22 25 Z" fill="#d4af37"/>
              {/* Lantern body */}
              <path d="M22 25 L22 85 Q22 95 30 95 Q38 95 38 85 L38 25 Z" fill="#d4af37" fillOpacity="0.3" stroke="#d4af37" strokeWidth="2"/>
              {/* Decorative lines */}
              <path d="M26 30 L26 90 M30 30 L30 90 M34 30 L34 90" stroke="#d4af37" strokeWidth="1" strokeOpacity="0.5"/>
              {/* Inner glow */}
              <ellipse cx="30" cy="60" rx="8" ry="25" fill="#ff6b35" fillOpacity="0.6"/>
              {/* Bottom */}
              <path d="M25 95 L35 95 L32 105 L28 105 Z" fill="#d4af37"/>
            </svg>
          </div>

          <div className="absolute top-0 right-[10%] animate-lantern" style={{ animationDelay: '1s' }}>
            <svg className="w-16 h-32 md:w-20 md:h-40 lantern-glow" viewBox="0 0 60 120" fill="none">
              <path d="M30 0 L30 15" stroke="#d4af37" strokeWidth="2"/>
              <path d="M18 15 L42 15 L40 22 L20 22 Z" fill="#d4af37"/>
              <path d="M20 22 L20 80 Q20 92 30 92 Q40 92 40 80 L40 22 Z" fill="#ff6b35" fillOpacity="0.2" stroke="#d4af37" strokeWidth="2"/>
              <path d="M25 28 L25 85 M30 28 L30 85 M35 28 L35 85" stroke="#d4af37" strokeWidth="1" strokeOpacity="0.5"/>
              <ellipse cx="30" cy="55" rx="10" ry="20" fill="#ff6b35" fillOpacity="0.5"/>
              <path d="M24 92 L36 92 L33 102 L27 102 Z" fill="#d4af37"/>
            </svg>
          </div>

          <div className="absolute top-0 left-[30%] animate-lantern hidden md:block" style={{ animationDelay: '0.5s' }}>
            <svg className="w-14 h-28 lantern-glow" viewBox="0 0 60 120" fill="none">
              <path d="M30 0 L30 25" stroke="#d4af37" strokeWidth="2"/>
              <ellipse cx="30" cy="28" rx="12" ry="4" fill="#d4af37"/>
              <path d="M18 28 L18 88 Q18 100 30 100 Q42 100 42 88 L42 28 Z" fill="#d4af37" fillOpacity="0.25" stroke="#d4af37" strokeWidth="2"/>
              <ellipse cx="30" cy="60" rx="6" ry="18" fill="#ff6b35" fillOpacity="0.6"/>
              <circle cx="30" cy="108" r="4" fill="#d4af37"/>
            </svg>
          </div>

          <div className="absolute top-0 right-[30%] animate-lantern hidden md:block" style={{ animationDelay: '1.5s' }}>
            <svg className="w-14 h-28 lantern-glow" viewBox="0 0 60 120" fill="none">
              <path d="M30 0 L30 20" stroke="#d4af37" strokeWidth="2"/>
              <path d="M22 20 L38 20 L36 26 L24 26 Z" fill="#d4af37"/>
              <path d="M24 26 L24 90 Q24 98 30 98 Q36 98 36 90 L36 26 Z" fill="#ff6b35" fillOpacity="0.2" stroke="#d4af37" strokeWidth="2"/>
              <ellipse cx="30" cy="58" rx="5" ry="16" fill="#ff6b35" fillOpacity="0.5"/>
              <path d="M27 98 L33 98 L31 106 L29 106 Z" fill="#d4af37"/>
            </svg>
          </div>

          {/* Mosque Silhouette at Bottom */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg className="w-full h-48 md:h-64" viewBox="0 0 1200 200" preserveAspectRatio="xMidYMax slice" fill="#0f0f23">
              {/* Main mosque with domes and minarets */}
              <path d="M0 200 L0 180 L100 180 L100 140 L110 140 L115 100 L120 80 L125 100 L130 140 L140 140 L140 180
                       L200 180 L200 120 L220 120 Q250 60 280 120 L300 120 L300 180
                       L350 180 L350 140 L360 140 L365 100 L370 80 L375 100 L380 140 L390 140 L390 180
                       L500 180 L500 100 L530 100 Q580 30 630 100 L660 100 L660 180
                       L750 180 L750 140 L760 140 L765 100 L770 70 L775 100 L780 140 L790 140 L790 180
                       L900 180 L900 120 L920 120 Q950 60 980 120 L1000 120 L1000 180
                       L1060 180 L1060 140 L1070 140 L1075 100 L1080 80 L1085 100 L1090 140 L1100 140 L1100 180
                       L1200 180 L1200 200 Z" />
              {/* Crescent decorations on top of domes */}
              <circle cx="250" cy="55" r="8" fill="#d4af37"/>
              <circle cx="580" cy="25" r="10" fill="#d4af37"/>
              <circle cx="950" cy="55" r="8" fill="#d4af37"/>
            </svg>
          </div>

          {/* Main Content */}
          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-20">
            <div className="text-center">
              {/* Decorative top element */}
              <div className="flex justify-center mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-px bg-gradient-to-r from-transparent to-ramadan-gold"></div>
                  <svg className="w-8 h-8 text-ramadan-gold animate-pulse" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                  </svg>
                  <div className="w-16 h-px bg-gradient-to-l from-transparent to-ramadan-gold"></div>
                </div>
              </div>

              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-ramadan-gold/10 border border-ramadan-gold/30 backdrop-blur-sm px-6 py-3 rounded-full mb-8">
                <span className="w-2 h-2 bg-ramadan-gold rounded-full animate-pulse"></span>
                <span className="text-ramadan-gold text-sm font-medium">اشراقات تجمع الأسرة</span>
              </div>

              {/* Main Title */}
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-6 text-gold-gradient">
                سَــنَــا
              </h1>

              <p className="text-2xl md:text-3xl mb-4 text-ramadan-gold tracking-widest">
                الرمضانية
              </p>

              {/* Ramadan Greeting */}
              <div className="flex justify-center items-center gap-4 mb-8">
                <svg className="w-6 h-6 text-ramadan-gold" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3C7.03 3 3 7.03 3 12S7.03 21 12 21C9.5 19 8 16 8 12S9.5 5 12 3Z"/>
                </svg>
                <p className="text-xl md:text-2xl text-white/90">رمضان كريم</p>
                <svg className="w-6 h-6 text-ramadan-gold" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                </svg>
              </div>

              <p className="text-lg md:text-xl mb-10 text-white/70 leading-relaxed max-w-2xl mx-auto">
                مسابقة تنافسية ثقافية متنوعة في مجالات متعددة مختارة من صنوف العلوم والمعارف لكل أفراد الأسرة
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link href="/quiz">
                  <Button size="lg" className="bg-ramadan-gold text-ramadan-dark hover:bg-ramadan-gold-light text-lg px-10 py-6 shadow-2xl shadow-ramadan-gold/30 w-full sm:w-auto font-bold">
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
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-32 left-1/2 -translate-x-1/2 text-ramadan-gold/60 animate-bounce">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </section>

        {/* ===== ABOUT SECTION ===== */}
        <section className="py-24 px-4 bg-ramadan-purple relative overflow-hidden">
          {/* Decorative pattern */}
          <div className="absolute inset-0 opacity-5">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="islamicPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M20 0L40 20L20 40L0 20Z" fill="none" stroke="#d4af37" strokeWidth="0.5"/>
                  <circle cx="20" cy="20" r="8" fill="none" stroke="#d4af37" strokeWidth="0.3"/>
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
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  سنا الرمضانية
                </h2>
                <p className="text-lg text-white/70 mb-6 leading-relaxed">
                  نقدم لكم منصة سنا الرمضانية للمسابقات الثقافية، حيث نجمع بين المتعة والفائدة في تجربة تعليمية فريدة - اشراقات تجمع الأسرة.
                </p>
                <p className="text-lg text-white/70 mb-8 leading-relaxed">
                  في هذا الشهر الفضيل، نتشارك معكم روحانية رمضان من خلال مسابقات متنوعة تناسب جميع الأعمار.
                </p>
                <div className="flex flex-wrap gap-4">
                  {[
                    { text: " تفاعليه", icon: "✓" },
                    { text: "لجميع الأعمار", icon: "✓" },
                    { text: "نتائج فورية", icon: "✓" },
                    { text: "سحب علي جوائز يوميه واسبوعيه", icon: "✓" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 bg-ramadan-gold/10 border border-ramadan-gold/20 px-4 py-2 rounded-lg">
                      <span className="text-ramadan-gold">{item.icon}</span>
                      <span className="text-sm font-medium text-white">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats Card */}
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-ramadan-gold/20 to-transparent rounded-3xl blur-xl"></div>
                <div className="relative bg-gradient-to-br from-ramadan-navy to-ramadan-dark rounded-3xl p-8 border border-ramadan-gold/20">
                  {/* Lantern decoration */}
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                    <svg className="w-12 h-24 lantern-glow" viewBox="0 0 40 80" fill="none">
                      <path d="M20 0 L20 10" stroke="#d4af37" strokeWidth="2"/>
                      <path d="M12 10 L28 10 L26 15 L14 15 Z" fill="#d4af37"/>
                      <path d="M14 15 L14 55 Q14 65 20 65 Q26 65 26 55 L26 15 Z" fill="#ff6b35" fillOpacity="0.3" stroke="#d4af37" strokeWidth="1.5"/>
                      <ellipse cx="20" cy="40" rx="4" ry="12" fill="#ff6b35" fillOpacity="0.6"/>
                      <circle cx="20" cy="70" r="3" fill="#d4af37"/>
                    </svg>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mt-8">
                    {[
                      { number: "+1000", label: "مشارك نشط" },
                      { number: "+50", label: "مسابقة" },
                      { number: "+500", label: "سؤال متنوع" },
                      { number: "98%", label: "رضا المشاركين" },
                    ].map((stat, i) => (
                      <div key={i} className="bg-ramadan-gold/10 rounded-2xl p-6 text-center border border-ramadan-gold/20">
                        <p className="text-3xl font-bold text-ramadan-gold mb-2">{stat.number}</p>
                        <p className="text-sm text-white/70">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== FEATURES SECTION ===== */}
        <section className="py-24 px-4 bg-ramadan-navy">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-12 h-px bg-ramadan-gold/50"></div>
                <svg className="w-6 h-6 text-ramadan-gold" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                </svg>
                <div className="w-12 h-px bg-ramadan-gold/50"></div>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                لماذا تختار سنا الرمضانية؟
              </h2>
              <p className="text-lg text-white/60 max-w-2xl mx-auto">
                نوفر لك تجربة مسابقات فريدة ومميزة بمعايير عالية الجودة
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: "📚",
                  title: "محتوى متنوع",
                  description: " أسئلة من مجالات متعددة تشمل الشريعة والثقافة والعلوم والتاريخ و الطب وغيرها",
                },
                {
                  icon: "⚡",
                  title: "جوائز يوميه واسبوعيه",
                  description: "سحب يومي وسحب كبير نهايه كل اسبوع",
                },
                {
                  icon: "👨‍👩‍👧‍👦",
                  title: "للعائلة كاملة",
                  description: "مسابقات مناسبة لجميع أفراد الأسرة بمستويات مختلفة",
                },
                {
                  icon: "✨",
                  title: "جودة عالية",
                  description: "أسئلة مراجعة ومدققة من متخصصين لضمان الدقة",
                },
                {
                  icon: "📱",
                  title: "تصميم متجاوب",
                  description: "شارك من أي جهاز بنفس التجربة الرائعة",
                },
                {
                  icon: "🕐",
                  title: "متاح دائماً",
                  description: "شارك في أي وقت يناسبك على مدار الساعات المحدده",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group bg-ramadan-purple/50 border border-ramadan-gold/10 rounded-2xl p-8 hover:border-ramadan-gold/30 transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="w-16 h-16 rounded-2xl bg-ramadan-gold/10 flex items-center justify-center mb-6 text-3xl group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-white/60 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

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
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                كيف تشارك في المسابقة؟
              </h2>
              <p className="text-lg text-white/60 max-w-2xl mx-auto">
                ثلاث خطوات بسيطة فقط للمشاركة في مسابقات سنا الرمضانية
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connection line */}
              <div className="hidden md:block absolute top-20 left-1/4 right-1/4 h-0.5 bg-gradient-to-l from-ramadan-gold via-ramadan-gold/50 to-ramadan-gold"></div>

              {[
               { step: "01", title: "اختر المسابقة", description: "تصفح المسابقات المتاحة اليوميه" },

                { step: "02", title: "أدخل بياناتك", description: "سجل اسمك رباعي، وبالنسبة لزوجات الأبناء تكتب حرم / اسم الزوج رباعي" },
                { step: "03", title: "ابدأ واستمتع", description: "أجب على الأسئلة وادخل السحب على الإجابات الصحيحة" },
              ].map((item, index) => (
                <div key={index} className="relative text-center">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-ramadan-gold to-ramadan-amber text-ramadan-dark rounded-full flex items-center justify-center text-2xl font-bold mb-6 shadow-xl shadow-ramadan-gold/30 relative z-10">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-white/60">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CTA SECTION ===== */}
        <section className="py-24 px-4 bg-ramadan-navy relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0">
            {/* Stars */}
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-ramadan-gold rounded-full animate-twinkle"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  opacity: 0.3,
                }}
              />
            ))}
          </div>

          <div className="max-w-5xl mx-auto relative z-10">
            <div className="relative overflow-hidden rounded-3xl border border-ramadan-gold/20">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-ramadan-purple via-ramadan-navy to-ramadan-dark"></div>

              {/* Lanterns on sides */}
              <div className="absolute top-0 left-8 opacity-30">
                <svg className="w-10 h-20" viewBox="0 0 40 80" fill="none">
                  <path d="M20 0 L20 10" stroke="#d4af37" strokeWidth="2"/>
                  <path d="M12 10 L28 10 L26 15 L14 15 Z" fill="#d4af37"/>
                  <path d="M14 15 L14 55 Q14 65 20 65 Q26 65 26 55 L26 15 Z" fill="#ff6b35" fillOpacity="0.3" stroke="#d4af37" strokeWidth="1"/>
                  <ellipse cx="20" cy="40" rx="4" ry="12" fill="#ff6b35" fillOpacity="0.5"/>
                </svg>
              </div>
              <div className="absolute top-0 right-8 opacity-30">
                <svg className="w-10 h-20" viewBox="0 0 40 80" fill="none">
                  <path d="M20 0 L20 10" stroke="#d4af37" strokeWidth="2"/>
                  <path d="M12 10 L28 10 L26 15 L14 15 Z" fill="#d4af37"/>
                  <path d="M14 15 L14 55 Q14 65 20 65 Q26 65 26 55 L26 15 Z" fill="#ff6b35" fillOpacity="0.3" stroke="#d4af37" strokeWidth="1"/>
                  <ellipse cx="20" cy="40" rx="4" ry="12" fill="#ff6b35" fillOpacity="0.5"/>
                </svg>
              </div>

              {/* Content */}
              <div className="relative z-10 py-16 px-8 md:px-16 text-center">
                {/* Crescent icon */}
                <div className="w-24 h-24 mx-auto mb-8 bg-ramadan-gold/10 rounded-full flex items-center justify-center border border-ramadan-gold/30">
                  <svg className="w-14 h-14 text-ramadan-gold animate-pulse" viewBox="0 0 50 50" fill="currentColor">
                    <path d="M25 5 C12 5 5 18 5 28 C5 40 15 45 25 45 C15 40 12 32 12 25 C12 15 18 8 25 5 Z" />
                    <path d="M38 12 L39.5 16 L44 16 L40.5 19 L42 23 L38 20 L34 23 L35.5 19 L32 16 L36.5 16 Z" />
                  </svg>
                </div>

                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                  جاهز للتحدي؟
                </h2>
                <p className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl mx-auto">
                  انضم الآن إلى المشاركين واختبر معلوماتك في مسابقات سنا الرمضانية الثقافية المتنوعة
                </p>
                <Link href="/quiz">
                  <Button size="lg" className="bg-ramadan-gold text-ramadan-dark hover:bg-ramadan-gold-light text-lg px-12 py-6 shadow-xl shadow-ramadan-gold/30 font-bold">
                    ابدأ المسابقة الان
                  </Button>
                </Link>
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
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                الأسئلة الشائعة
              </h2>
              <p className="text-lg text-white/60">
                إليك إجابات على أكثر الأسئلة شيوعاً
              </p>
            </div>

            <div className="space-y-4">
              {[
                { q: "هل المشاركة خاصة؟", a: "نعم، المشاركة خاصة لأفراد الأسرة فقط." },
                { q: "هل يمكن المشاركة من الهاتف؟", a: "بالتأكيد! المنصة متوافقة مع جميع الأجهزة - هواتف، تابلت، وأجهزة الكمبيوتر." },
                { q: "ما هي جوائز المسابقة؟", a: "٣ جوائز يوميًا بقيمة (200) ريال لكل فائز، بالإضافة إلى جوائز قيّمة (جوال + ايباد) خلال السحب الأسبوعي الكبير كل أسبوع." },
                { q: "ما هي آلية الدخول في السحب الأسبوعي؟", a: "جميع المشاركين بالإجابات الصحيحة خلال الأسبوع يتم دخولهم ضمن السحب الأسبوعي." },
              ].map((faq, index) => (
                <div key={index} className="bg-ramadan-navy/50 border border-ramadan-gold/10 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-2">{faq.q}</h3>
                  <p className="text-white/60">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== FOOTER ===== */}
        <footer className="bg-ramadan-dark text-white relative overflow-hidden">
          {/* Mosque silhouette at top */}
          <div className="absolute top-0 left-0 right-0 rotate-180">
            <svg viewBox="0 0 1200 40" className="w-full" fill="#16213e" preserveAspectRatio="xMidYMin slice">
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
                  مسابقة تنافسية ثقافية متنوعة في مجالات متعددة مختارة من صنوف العلوم والمعارف لكل أفراد الأسرة.
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
