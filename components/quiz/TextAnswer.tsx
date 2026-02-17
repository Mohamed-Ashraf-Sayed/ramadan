"use client";

import { useState } from "react";

interface TextAnswerProps {
  questionId: number;
  answer: string | null;
  onAnswer: (questionId: number, answer: string) => void;
  disabled?: boolean;
  showResult?: boolean;
  correctAnswer?: string;
  matchedCount?: number;
  totalKeywords?: number;
}

export default function TextAnswer({
  questionId,
  answer,
  onAnswer,
  disabled = false,
  showResult = false,
  correctAnswer,
}: TextAnswerProps) {
  const [textAnswer, setTextAnswer] = useState<string>(answer || "");

  const handleChange = (value: string) => {
    setTextAnswer(value);
    onAnswer(questionId, value);
  };

  return (
    <div className="space-y-4">
      {/* Text Input */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-foreground">
          اكتب إجابتك هنا
        </label>
        <textarea
          value={textAnswer}
          onChange={(e) => handleChange(e.target.value)}
          disabled={disabled}
          placeholder="اكتب الإجابة..."
          rows={3}
          className={`
            w-full px-5 py-4 rounded-xl border-2 text-lg transition-all duration-200
            bg-white text-foreground placeholder-gray-400 resize-none
            focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-white
            ${disabled ? "opacity-70 cursor-not-allowed" : ""}
            ${
              showResult
                ? "border-primary bg-primary/5"
                : "border-ramadan-gold/30 focus:border-ramadan-gold focus:ring-ramadan-gold/30"
            }
          `}
          dir="rtl"
        />
      </div>

      {/* Result Feedback */}
      {showResult && correctAnswer && (
        <div className="p-4 rounded-xl bg-primary/10 border border-primary/30">
          <p className="text-gray-600 text-sm">
            الكلمات المفتاحية: <span className="text-primary font-bold">{correctAnswer}</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            التقييم بنسبة الكلمات المتطابقة مع إجابتك
          </p>
        </div>
      )}
    </div>
  );
}
