"use client";

interface TrueFalseProps {
  questionId: number;
  selectedAnswer: boolean | null;
  onAnswer: (questionId: number, answer: boolean) => void;
  disabled?: boolean;
  showResult?: boolean;
  correctAnswer?: boolean;
}

export default function TrueFalse({
  questionId,
  selectedAnswer,
  onAnswer,
  disabled = false,
  showResult = false,
  correctAnswer,
}: TrueFalseProps) {
  const getButtonStyle = (value: boolean) => {
    if (!showResult) {
      return selectedAnswer === value
        ? "border-primary bg-primary/10 ring-2 ring-primary"
        : "border-border hover:border-primary/50 hover:bg-brown-50";
    }

    if (value === correctAnswer) {
      return "border-success bg-success/10 ring-2 ring-success";
    }

    if (selectedAnswer === value && value !== correctAnswer) {
      return "border-error bg-error/10 ring-2 ring-error";
    }

    return "border-border opacity-50";
  };

  return (
    <div className="flex gap-4">
      <button
        onClick={() => !disabled && onAnswer(questionId, true)}
        disabled={disabled}
        className={`
          flex-1 p-6 rounded-xl border-2 transition-all duration-200
          ${getButtonStyle(true)}
          ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
        `}
      >
        <div className="flex flex-col items-center gap-2">
          <svg className="w-10 h-10 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-lg font-bold text-foreground">صحيح</span>
        </div>
      </button>

      <button
        onClick={() => !disabled && onAnswer(questionId, false)}
        disabled={disabled}
        className={`
          flex-1 p-6 rounded-xl border-2 transition-all duration-200
          ${getButtonStyle(false)}
          ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
        `}
      >
        <div className="flex flex-col items-center gap-2">
          <svg className="w-10 h-10 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span className="text-lg font-bold text-foreground">خطأ</span>
        </div>
      </button>
    </div>
  );
}
