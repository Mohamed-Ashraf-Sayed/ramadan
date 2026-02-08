"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button, Select } from "@/components/ui";
import type { Quiz, Submission } from "@/types";

interface Winner {
  name: string;
  email: string;
  phone: string;
  score: number;
  totalPoints: number;
  percentage: number;
}

export default function DrawPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<string>("");
  const [submissions, setSubmissions] = useState<(Submission & { quiz: Quiz })[]>([]);
  const [topScorers, setTopScorers] = useState<Winner[]>([]);
  const [loading, setLoading] = useState(false);

  // Draw animation state
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentName, setCurrentName] = useState<string>("");
  const [winner, setWinner] = useState<Winner | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const stageRef = useRef<"idle" | "fast" | "slowing" | "done">("idle");

  useEffect(() => {
    fetchQuizzes();
  }, []);

  useEffect(() => {
    if (selectedQuiz) {
      fetchSubmissions();
      setWinner(null);
      setCurrentName("");
      stageRef.current = "idle";
    }
  }, [selectedQuiz]);

  async function fetchQuizzes() {
    try {
      const response = await fetch("/api/quizzes");
      if (response.ok) {
        const data = await response.json();
        setQuizzes(data);
      }
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    }
  }

  async function fetchSubmissions() {
    setLoading(true);
    try {
      const response = await fetch(`/api/submissions?quizId=${selectedQuiz}`);
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data);

        if (data.length > 0) {
          const maxScore = Math.max(...data.map((s: Submission) => s.percentage));
          const top = data
            .filter((s: Submission) => s.percentage === maxScore)
            .map((s: Submission) => ({
              name: s.name,
              email: s.email,
              phone: s.phone,
              score: s.score,
              totalPoints: s.totalPoints,
              percentage: s.percentage,
            }));
          setTopScorers(top);
        } else {
          setTopScorers([]);
        }
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setLoading(false);
    }
  }

  const startDraw = useCallback(() => {
    if (topScorers.length < 2) return;

    setWinner(null);
    setShowConfetti(false);
    setIsDrawing(true);
    stageRef.current = "fast";

    const winnerIndex = Math.floor(Math.random() * topScorers.length);
    const selectedWinner = topScorers[winnerIndex];

    let iteration = 0;
    let delay = 50;
    const totalIterations = 40 + Math.floor(Math.random() * 20);

    function tick() {
      iteration++;
      const randomIndex = Math.floor(Math.random() * topScorers.length);
      setCurrentName(topScorers[randomIndex].name);

      if (iteration < totalIterations * 0.6) {
        // Fast phase
        delay = 50;
        stageRef.current = "fast";
      } else if (iteration < totalIterations) {
        // Slowing phase
        stageRef.current = "slowing";
        const progress = (iteration - totalIterations * 0.6) / (totalIterations * 0.4);
        delay = 50 + progress * 450;
      }

      if (iteration >= totalIterations) {
        // Done - show winner
        setCurrentName(selectedWinner.name);
        stageRef.current = "done";
        setTimeout(() => {
          setWinner(selectedWinner);
          setIsDrawing(false);
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 5000);
        }, 500);
        return;
      }

      animationRef.current = setTimeout(tick, delay);
    }

    tick();
  }, [topScorers]);

  useEffect(() => {
    return () => {
      if (animationRef.current) clearTimeout(animationRef.current);
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-ramadan-gold">السحب العشوائي</h1>
        <p className="text-white/60 mt-1">اختيار فائز عشوائي من المتصدرين بنفس النتيجة</p>
      </div>

      {/* Quiz Selection */}
      <div className="bg-ramadan-purple/50 border border-ramadan-gold/20 rounded-xl p-6">
        <div className="max-w-md">
          <Select
            label="اختر الاختبار"
            options={[
              { value: "", label: "-- اختر اختبار --" },
              ...quizzes.map(q => ({ value: String(q.id), label: q.title })),
            ]}
            value={selectedQuiz}
            onChange={(e) => setSelectedQuiz(e.target.value)}
          />
        </div>

        {selectedQuiz && !loading && (
          <div className="mt-4 flex items-center gap-6 text-sm">
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
          <div className="w-12 h-12 border-4 border-ramadan-gold border-t-transparent rounded-full animate-spin"></div>
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

      {/* Only one top scorer - no need for draw */}
      {selectedQuiz && !loading && topScorers.length === 1 && (
        <div className="bg-ramadan-purple/30 border border-ramadan-gold/20 rounded-2xl p-8 text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-ramadan-gold/20 rounded-full flex items-center justify-center border-2 border-ramadan-gold/40">
            <svg className="w-12 h-12 text-ramadan-gold" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-ramadan-gold mb-2">الفائز الوحيد!</h2>
          <p className="text-3xl font-bold text-white mb-2">{topScorers[0].name}</p>
          <p className="text-white/60 mb-1">{topScorers[0].email}</p>
          <p className="text-white/60 mb-4">{topScorers[0].phone}</p>
          <span className="inline-block px-6 py-2 bg-success/20 text-success rounded-full text-lg font-bold">
            {Math.round(topScorers[0].percentage)}% - {topScorers[0].score}/{topScorers[0].totalPoints}
          </span>
          <p className="text-white/40 text-sm mt-4">لا يوجد متصدرين آخرين بنفس النتيجة</p>
        </div>
      )}

      {/* Draw Area - multiple top scorers */}
      {selectedQuiz && !loading && topScorers.length >= 2 && (
        <div className="space-y-6">
          {/* Top Scorers List */}
          <div className="bg-ramadan-purple/30 border border-ramadan-gold/20 rounded-xl p-6">
            <h3 className="text-lg font-bold text-ramadan-gold mb-4">
              المتصدرين بنتيجة {Math.round(topScorers[0].percentage)}%
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {topScorers.map((scorer, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-lg border transition-all duration-300 ${
                    winner && winner.name === scorer.name && winner.email === scorer.email
                      ? "bg-ramadan-gold/20 border-ramadan-gold/50 scale-105"
                      : "bg-white/5 border-white/10"
                  }`}
                >
                  <p className="font-medium text-white">{scorer.name}</p>
                  <p className="text-xs text-white/40">{scorer.phone}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Animated Draw Box */}
          <div className="relative">
            {/* Confetti */}
            {showConfetti && <Confetti />}

            <div className="bg-gradient-to-b from-ramadan-dark to-ramadan-purple border-2 border-ramadan-gold/30 rounded-2xl p-10 text-center relative overflow-hidden">
              {/* Decorative corners */}
              <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-ramadan-gold/30 rounded-tl-2xl" />
              <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-ramadan-gold/30 rounded-tr-2xl" />
              <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-ramadan-gold/30 rounded-bl-2xl" />
              <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-ramadan-gold/30 rounded-br-2xl" />

              {/* Star decoration */}
              <div className="flex justify-center mb-6">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ${
                  winner ? "bg-ramadan-gold/30 scale-110" : isDrawing ? "bg-ramadan-gold/10 animate-pulse" : "bg-ramadan-gold/10"
                }`}>
                  <svg className={`w-8 h-8 transition-colors duration-500 ${winner ? "text-ramadan-gold" : "text-ramadan-gold/50"}`} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                </div>
              </div>

              {/* Name display */}
              <div className="min-h-[100px] flex items-center justify-center mb-6">
                {!isDrawing && !winner && !currentName && (
                  <p className="text-white/30 text-xl">اضغط &quot;ابدأ السحب&quot; لاختيار الفائز</p>
                )}
                {(isDrawing || currentName) && !winner && (
                  <div className="relative">
                    <p className={`text-4xl md:text-5xl font-bold text-white transition-all ${
                      stageRef.current === "fast" ? "blur-[1px]" : stageRef.current === "slowing" ? "blur-[0.5px]" : ""
                    }`}>
                      {currentName}
                    </p>
                    {isDrawing && (
                      <div className="absolute -inset-4 border-2 border-ramadan-gold/20 rounded-xl animate-pulse" />
                    )}
                  </div>
                )}
                {winner && (
                  <div className="animate-winner-reveal">
                    <p className="text-5xl md:text-6xl font-bold text-ramadan-gold mb-3 animate-bounce-slow">
                      {winner.name}
                    </p>
                    <p className="text-white/60 text-lg">{winner.email}</p>
                    <p className="text-white/60">{winner.phone}</p>
                    <div className="mt-4">
                      <span className="inline-block px-6 py-2 bg-success/20 text-success rounded-full font-bold">
                        {Math.round(winner.percentage)}% - {winner.score}/{winner.totalPoints}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Draw button */}
              <Button
                onClick={startDraw}
                disabled={isDrawing || topScorers.length < 2}
                className={`px-10 py-4 text-lg font-bold transition-all duration-300 ${
                  isDrawing ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isDrawing ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    جاري السحب...
                  </span>
                ) : winner ? (
                  "إعادة السحب"
                ) : (
                  "ابدأ السحب"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Confetti component
function Confetti() {
  const colors = ["#d4af37", "#f0d060", "#c9a030", "#e8c547", "#ff6b6b", "#51cf66", "#339af0", "#ffd43b"];
  const particles = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 2,
    color: colors[Math.floor(Math.random() * colors.length)],
    size: 6 + Math.random() * 8,
    rotation: Math.random() * 360,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-confetti-fall"
          style={{
            left: `${p.left}%`,
            top: "-20px",
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
}
