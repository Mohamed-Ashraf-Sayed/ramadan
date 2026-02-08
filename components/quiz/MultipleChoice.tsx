"use client";

import { useState } from "react";

interface MultipleChoiceProps {
  questionId: number;
  options: string[];
  selectedAnswer: string | null;
  onAnswer: (questionId: number, answer: string) => void;
  disabled?: boolean;
  showResult?: boolean;
  correctAnswer?: string;
}

export default function MultipleChoice({
  questionId,
  options,
  selectedAnswer,
  onAnswer,
  disabled = false,
  showResult = false,
  correctAnswer,
}: MultipleChoiceProps) {
  const getOptionStyle = (option: string) => {
    if (!showResult) {
      return selectedAnswer === option
        ? "border-primary bg-primary/10 ring-2 ring-primary"
        : "border-border hover:border-primary/50 hover:bg-brown-50";
    }

    if (option === correctAnswer) {
      return "border-success bg-success/10 ring-2 ring-success";
    }

    if (selectedAnswer === option && option !== correctAnswer) {
      return "border-error bg-error/10 ring-2 ring-error";
    }

    return "border-border opacity-50";
  };

  return (
    <div className="space-y-3">
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => !disabled && onAnswer(questionId, option)}
          disabled={disabled}
          className={`
            w-full text-right p-4 rounded-lg border-2 transition-all duration-200
            ${getOptionStyle(option)}
            ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
          `}
        >
          <div className="flex items-center gap-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-primary">
              {String.fromCharCode(1571 + index)}
            </span>
            <span className="text-foreground">{option}</span>
            {showResult && option === correctAnswer && (
              <svg className="w-5 h-5 text-success mr-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
            {showResult && selectedAnswer === option && option !== correctAnswer && (
              <svg className="w-5 h-5 text-error mr-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
