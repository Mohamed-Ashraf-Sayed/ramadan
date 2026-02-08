"use client";

import type { Question } from "@/types";
import MultipleChoice from "./MultipleChoice";
import TrueFalse from "./TrueFalse";
import Ordering from "./Ordering";
import ImageText from "./ImageText";

interface QuestionRendererProps {
  question: Question;
  answer: string | string[] | boolean | null;
  onAnswer: (questionId: number, answer: string | string[] | boolean) => void;
  disabled?: boolean;
  showResult?: boolean;
}

// Helper function to parse JSON safely
function parseJsonField<T>(value: unknown): T {
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return value as T;
    }
  }
  return value as T;
}

export default function QuestionRenderer({
  question,
  answer,
  onAnswer,
  disabled = false,
  showResult = false,
}: QuestionRendererProps) {
  // Parse JSON fields
  const options = parseJsonField<string[]>(question.options);
  const correctAnswer = parseJsonField<string | boolean | string[]>(question.correctAnswer);

  switch (question.type) {
    case "MULTIPLE_CHOICE":
      return (
        <MultipleChoice
          questionId={question.id}
          options={options}
          selectedAnswer={answer as string | null}
          onAnswer={(id, ans) => onAnswer(id, ans)}
          disabled={disabled}
          showResult={showResult}
          correctAnswer={correctAnswer as string}
        />
      );

    case "TRUE_FALSE":
      return (
        <TrueFalse
          questionId={question.id}
          selectedAnswer={answer as boolean | null}
          onAnswer={(id, ans) => onAnswer(id, ans)}
          disabled={disabled}
          showResult={showResult}
          correctAnswer={correctAnswer as boolean}
        />
      );

    case "ORDERING":
      return (
        <Ordering
          questionId={question.id}
          options={options}
          selectedAnswer={answer as string[] | null}
          onAnswer={(id, ans) => onAnswer(id, ans)}
          disabled={disabled}
          showResult={showResult}
          correctAnswer={correctAnswer as string[]}
        />
      );

    case "IMAGE_TEXT":
      return (
        <ImageText
          question={{
            ...question,
            correctAnswer: correctAnswer as string,
          }}
          answer={answer as string | null}
          onAnswer={(id, ans) => onAnswer(id, ans)}
          disabled={disabled}
          showResult={showResult}
        />
      );

    default:
      return <div>نوع السؤال غير معروف</div>;
  }
}
