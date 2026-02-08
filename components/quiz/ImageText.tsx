"use client";

import { useState } from "react";
import type { Question } from "@/types";
import { getMediaUrl } from "@/lib/media";

interface ImageTextProps {
  question: Question;
  answer: string | null;
  onAnswer: (questionId: number, answer: string) => void;
  disabled?: boolean;
  showResult?: boolean;
}

export default function ImageText({
  question,
  answer,
  onAnswer,
  disabled = false,
  showResult = false,
}: ImageTextProps) {
  const [textAnswer, setTextAnswer] = useState<string>((answer as string) || "");

  const correctAnswer = typeof question.correctAnswer === "string"
    ? question.correctAnswer
    : String(question.correctAnswer);

  const isCorrect = showResult && answer
    ? normalizeText(String(answer)) === normalizeText(correctAnswer)
    : false;

  function normalizeText(text: string): string {
    return text
      .trim()
      .replace(/[\u064B-\u065F\u0670]/g, "") // Remove Arabic diacritics
      .replace(/\s+/g, " ") // Normalize whitespace
      .replace(/[أإآٱ]/g, "ا") // Normalize alef
      .replace(/ة/g, "ه") // Ta marbuta -> Ha
      .replace(/ى/g, "ي") // Alef maqsura -> Ya
      .toLowerCase();
  }

  const handleChange = (value: string) => {
    setTextAnswer(value);
    onAnswer(question.id, value);
  };

  return (
    <div className="space-y-6">
      {/* Media Display */}
      {question.mediaUrl && (
        <div className="rounded-2xl overflow-hidden border border-ramadan-gold/20">
          {question.mediaType === "video" ? (
            <video
              src={getMediaUrl(question.mediaUrl)}
              controls
              className="w-full max-h-[400px] object-contain bg-black"
              playsInline
            />
          ) : (
            <div className="relative w-full" style={{ minHeight: "200px", maxHeight: "400px" }}>
              <img
                src={getMediaUrl(question.mediaUrl)}
                alt={question.text || "صورة السؤال"}
                className="w-full h-auto max-h-[400px] object-contain"
              />
            </div>
          )}
        </div>
      )}

      {/* Text Input */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-white/80">
          اكتب إجابتك هنا
        </label>
        <input
          type="text"
          value={textAnswer}
          onChange={(e) => handleChange(e.target.value)}
          disabled={disabled}
          placeholder="اكتب الإجابة..."
          className={`
            w-full px-5 py-4 rounded-xl border-2 text-lg transition-all duration-200
            bg-ramadan-navy text-white placeholder-white/40
            focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-ramadan-navy
            ${disabled ? "opacity-70 cursor-not-allowed" : ""}
            ${
              showResult
                ? isCorrect
                  ? "border-success bg-success/10 text-success"
                  : "border-error bg-error/10 text-error"
                : "border-ramadan-gold/30 focus:border-ramadan-gold focus:ring-ramadan-gold/30"
            }
          `}
          dir="rtl"
        />
      </div>

      {/* Result Feedback */}
      {showResult && (
        <div className={`flex items-center gap-3 p-4 rounded-xl ${
          isCorrect
            ? "bg-success/10 border border-success/30"
            : "bg-error/10 border border-error/30"
        }`}>
          {isCorrect ? (
            <>
              <svg className="w-6 h-6 text-success flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-success font-medium">إجابة صحيحة!</span>
            </>
          ) : (
            <>
              <svg className="w-6 h-6 text-error flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <span className="text-error font-medium">إجابة خاطئة</span>
                <p className="text-white/70 text-sm mt-1">
                  الإجابة الصحيحة: <span className="text-success font-bold">{correctAnswer}</span>
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
