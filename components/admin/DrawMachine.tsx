"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui";

interface Candidate {
  name: string;
  phone?: string;
  score?: number;
  totalPoints?: number;
  percentage?: number;
  extra?: string;
}

interface DrawMachineProps {
  candidates: Candidate[];
  title?: string;
  totalParticipants?: number;
  onWinnerConfirmed?: (winner: Candidate) => void;
  showConfirmButton?: boolean;
}

  // Show last 4 digits of phone as identifier
function phoneTag(phone?: string) {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  const last4 = digits.slice(-4);
  return (
    <span className="text-white/40 text-sm font-normal mr-2" dir="ltr">
      (****{last4})
    </span>
  );
}

export default function DrawMachine({ candidates, title, totalParticipants, onWinnerConfirmed, showConfirmButton }: DrawMachineProps) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentName, setCurrentName] = useState<string>("");
  const [winner, setWinner] = useState<Candidate | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const stageRef = useRef<"idle" | "fast" | "slowing" | "done">("idle");

  useEffect(() => {
    setWinner(null);
    setCurrentName("");
    stageRef.current = "idle";
    setIsDrawing(false);
    setShowConfetti(false);
    setConfirmed(false);
    if (animationRef.current) clearTimeout(animationRef.current);
  }, [candidates]);

  useEffect(() => {
    return () => {
      if (animationRef.current) clearTimeout(animationRef.current);
    };
  }, []);

  // Close fullscreen on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsFullscreen(false);
    }
    if (isFullscreen) {
      document.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isFullscreen]);

  const startDraw = useCallback(() => {
    if (candidates.length < 2) return;

    setWinner(null);
    setShowConfetti(false);
    setIsDrawing(true);
    setIsFullscreen(true);
    stageRef.current = "fast";

    const winnerIndex = Math.floor(Math.random() * candidates.length);
    const selectedWinner = candidates[winnerIndex];

    let iteration = 0;
    let delay = 50;
    const totalIterations = 40 + Math.floor(Math.random() * 20);

    function tick() {
      iteration++;
      const randomIndex = Math.floor(Math.random() * candidates.length);
      setCurrentName(candidates[randomIndex].name);

      if (iteration < totalIterations * 0.6) {
        delay = 50;
        stageRef.current = "fast";
      } else if (iteration < totalIterations) {
        stageRef.current = "slowing";
        const progress = (iteration - totalIterations * 0.6) / (totalIterations * 0.4);
        delay = 50 + progress * 450;
      }

      if (iteration >= totalIterations) {
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
  }, [candidates]);

  if (candidates.length === 0) {
    return (
      <div className="bg-ramadan-purple/20 border border-ramadan-gold/10 rounded-xl py-16 text-center">
        <p className="text-white/40 text-lg">لا يوجد مرشحين للسحب</p>
      </div>
    );
  }

  if (candidates.length === 1) {
    const solo = candidates[0];
    return (
      <div className="bg-ramadan-purple/30 border border-ramadan-gold/20 rounded-2xl p-8 text-center">
        <div className="w-24 h-24 mx-auto mb-6 bg-ramadan-gold/20 rounded-full flex items-center justify-center border-2 border-ramadan-gold/40">
          <svg className="w-12 h-12 text-ramadan-gold" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-ramadan-gold mb-2">الفائز الوحيد!</h2>
        <p className="text-3xl font-bold text-white mb-2">{solo.name}</p>
        {solo.phone && (
          <p className="text-white/50 text-base mb-2" dir="ltr">****{solo.phone.replace(/\D/g, "").slice(-4)}</p>
        )}
        {solo.extra && <p className="text-white/40 text-sm mb-4">{solo.extra}</p>}
        {solo.percentage !== undefined && (
          <span className="inline-block px-6 py-2 bg-ramadan-gold/20 text-ramadan-gold rounded-full text-lg font-bold">
            {Math.round(solo.percentage)}% - {solo.score}/{solo.totalPoints}
          </span>
        )}
        <p className="text-white/40 text-sm mt-4">لا يوجد متصدرين آخرين</p>

        {showConfirmButton && !confirmed && (
          <div className="mt-6">
            <Button
              onClick={() => {
                setConfirmed(true);
                onWinnerConfirmed?.(solo);
              }}
              variant="secondary"
              className="px-8 py-4 text-lg font-bold !bg-success !text-white !border-success hover:!bg-success/80"
            >
              تأكيد الفائز
            </Button>
          </div>
        )}
        {showConfirmButton && confirmed && (
          <div className="mt-6">
            <span className="px-6 py-3 bg-ramadan-gold/20 text-ramadan-gold rounded-xl font-bold inline-flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              تم تأكيد الفائز
            </span>
          </div>
        )}
      </div>
    );
  }

  // Fullscreen draw overlay
  const fullscreenOverlay = isFullscreen ? (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-b from-[#0a1929] via-[#0f2b46] to-[#0a1929] flex flex-col">
      {/* Close button */}
      {!isDrawing && (
        <button
          onClick={() => setIsFullscreen(false)}
          className="absolute top-6 left-6 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      {/* Stats bar at top */}
      <div className="flex justify-center gap-8 pt-8 pb-4">
        {totalParticipants !== undefined && (
          <div className="text-center px-6 py-3 bg-white/5 border border-white/10 rounded-2xl">
            <p className="text-3xl font-bold text-white">{totalParticipants}</p>
            <p className="text-sm text-white/50">إجمالي المشاركين</p>
          </div>
        )}
        <div className="text-center px-6 py-3 bg-ramadan-gold/10 border border-ramadan-gold/20 rounded-2xl">
          <p className="text-3xl font-bold text-ramadan-gold">{candidates.length}</p>
          <p className="text-sm text-ramadan-gold/70">المؤهلين للسحب</p>
        </div>
      </div>

      {/* Main draw area */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 relative">
        {showConfetti && <Confetti />}

        {/* Decorative corners */}
        <div className="absolute top-8 left-8 w-32 h-32 border-t-2 border-l-2 border-ramadan-gold/20 rounded-tl-3xl" />
        <div className="absolute top-8 right-8 w-32 h-32 border-t-2 border-r-2 border-ramadan-gold/20 rounded-tr-3xl" />
        <div className="absolute bottom-8 left-8 w-32 h-32 border-b-2 border-l-2 border-ramadan-gold/20 rounded-bl-3xl" />
        <div className="absolute bottom-8 right-8 w-32 h-32 border-b-2 border-r-2 border-ramadan-gold/20 rounded-br-3xl" />

        {/* Star */}
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-8 transition-all duration-500 ${
          winner ? "bg-ramadan-gold/30 scale-125" : isDrawing ? "bg-ramadan-gold/10 animate-pulse" : "bg-ramadan-gold/10"
        }`}>
          <svg className={`w-12 h-12 transition-colors duration-500 ${winner ? "text-ramadan-gold" : "text-ramadan-gold/50"}`} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
        </div>

        {/* Name display */}
        <div className="min-h-[120px] flex items-center justify-center mb-8">
          {(isDrawing || currentName) && !winner && (
            <div className="relative">
              <p className={`text-6xl md:text-8xl font-bold text-white transition-all ${
                stageRef.current === "fast" ? "blur-[2px]" : stageRef.current === "slowing" ? "blur-[1px]" : ""
              }`}>
                {currentName}
              </p>
              {isDrawing && (
                <div className="absolute -inset-6 border-2 border-ramadan-gold/20 rounded-2xl animate-pulse" />
              )}
            </div>
          )}
          {winner && (
            <div className="animate-winner-reveal text-center">
              <p className="text-6xl md:text-8xl font-bold text-ramadan-gold mb-4 animate-bounce-slow">
                {winner.name}
              </p>
              {winner.phone && (
                <p className="text-white/50 text-xl" dir="ltr">****{winner.phone.replace(/\D/g, "").slice(-4)}</p>
              )}
              {winner.extra && <p className="text-white/40 text-lg mt-2">{winner.extra}</p>}
              {winner.percentage !== undefined && (
                <div className="mt-6">
                  <span className="inline-block px-8 py-3 bg-ramadan-gold/20 text-ramadan-gold rounded-full text-xl font-bold">
                    {Math.round(winner.percentage)}% - {winner.score}/{winner.totalPoints}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-center gap-4 flex-wrap">
          {!isDrawing && !winner && (
            <p className="text-white/30 text-lg mb-4">جاري السحب...</p>
          )}

          {winner && (
            <>
              <Button
                onClick={() => {
                  setConfirmed(false);
                  startDraw();
                }}
                disabled={isDrawing}
                className="px-10 py-4 text-lg font-bold"
              >
                إعادة السحب
              </Button>

              {showConfirmButton && !confirmed && (
                <Button
                  onClick={() => {
                    setConfirmed(true);
                    onWinnerConfirmed?.(winner);
                  }}
                  variant="secondary"
                  className="px-8 py-4 text-lg font-bold !bg-success !text-white !border-success hover:!bg-success/80"
                >
                  تأكيد الفائز
                </Button>
              )}

              {showConfirmButton && confirmed && (
                <span className="px-6 py-3 bg-ramadan-gold/20 text-ramadan-gold rounded-xl font-bold flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  تم تأكيد الفائز
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      {fullscreenOverlay}

      <div className="space-y-6">
        {/* Draw Box */}
        <div className="relative">
          {showConfetti && !isFullscreen && <Confetti />}

          <div className="bg-gradient-to-b from-ramadan-dark to-ramadan-purple border-2 border-ramadan-gold/30 rounded-2xl p-10 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-ramadan-gold/30 rounded-tl-2xl" />
            <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-ramadan-gold/30 rounded-tr-2xl" />
            <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-ramadan-gold/30 rounded-bl-2xl" />
            <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-ramadan-gold/30 rounded-br-2xl" />

            <div className="flex justify-center mb-6">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ${
                winner ? "bg-ramadan-gold/30 scale-110" : "bg-ramadan-gold/10"
              }`}>
                <svg className={`w-8 h-8 transition-colors duration-500 ${winner ? "text-ramadan-gold" : "text-ramadan-gold/50"}`} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
              </div>
            </div>

            {/* Name display */}
            <div className="min-h-[100px] flex items-center justify-center mb-6">
              {!winner && !currentName && (
                <p className="text-white/30 text-xl">اضغط &quot;ابدأ السحب&quot; لاختيار الفائز</p>
              )}
              {winner && !isFullscreen && (
                <div className="animate-winner-reveal">
                  <p className="text-5xl md:text-6xl font-bold text-ramadan-gold mb-3 animate-bounce-slow">
                    {winner.name}
                  </p>
                  {winner.phone && (
                    <p className="text-white/50 text-base" dir="ltr">****{winner.phone.replace(/\D/g, "").slice(-4)}</p>
                  )}
                  {winner.extra && <p className="text-white/40 text-sm mt-1">{winner.extra}</p>}
                  {winner.percentage !== undefined && (
                    <div className="mt-4">
                      <span className="inline-block px-6 py-2 bg-ramadan-gold/20 text-ramadan-gold rounded-full font-bold">
                        {Math.round(winner.percentage)}% - {winner.score}/{winner.totalPoints}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Button
                onClick={() => {
                  setConfirmed(false);
                  startDraw();
                }}
                disabled={isDrawing || candidates.length < 2}
                className={`px-10 py-4 text-lg font-bold transition-all duration-300 ${
                  isDrawing ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {winner ? "إعادة السحب" : "ابدأ السحب"}
              </Button>

              {showConfirmButton && winner && !confirmed && !isFullscreen && (
                <Button
                  onClick={() => {
                    setConfirmed(true);
                    onWinnerConfirmed?.(winner);
                  }}
                  variant="secondary"
                  className="px-8 py-4 text-lg font-bold !bg-success !text-white !border-success hover:!bg-success/80"
                >
                  تأكيد الفائز
                </Button>
              )}

              {showConfirmButton && confirmed && !isFullscreen && (
                <span className="px-6 py-3 bg-ramadan-gold/20 text-ramadan-gold rounded-xl font-bold flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  تم تأكيد الفائز
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

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
