"use client";

import { useState, useEffect } from "react";

interface OrderingProps {
  questionId: number;
  options: string[];
  selectedAnswer: string[] | null;
  onAnswer: (questionId: number, answer: string[]) => void;
  disabled?: boolean;
  showResult?: boolean;
  correctAnswer?: string[];
}

export default function Ordering({
  questionId,
  options,
  selectedAnswer,
  onAnswer,
  disabled = false,
  showResult = false,
  correctAnswer,
}: OrderingProps) {
  const [items, setItems] = useState<string[]>(selectedAnswer || [...options].sort(() => Math.random() - 0.5));
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (selectedAnswer) {
      setItems(selectedAnswer);
    }
  }, [selectedAnswer]);

  const handleDragStart = (index: number) => {
    if (disabled) return;
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (disabled || draggedIndex === null || draggedIndex === index) return;

    const newItems = [...items];
    const draggedItem = newItems[draggedIndex];
    newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, draggedItem);
    setItems(newItems);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    if (disabled) return;
    setDraggedIndex(null);
    onAnswer(questionId, items);
  };

  const moveItem = (fromIndex: number, direction: "up" | "down") => {
    if (disabled) return;
    const toIndex = direction === "up" ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= items.length) return;

    const newItems = [...items];
    [newItems[fromIndex], newItems[toIndex]] = [newItems[toIndex], newItems[fromIndex]];
    setItems(newItems);
    onAnswer(questionId, newItems);
  };

  const getItemStyle = (item: string, index: number) => {
    if (!showResult) {
      return draggedIndex === index
        ? "border-primary bg-primary/10 scale-105"
        : "border-border hover:border-primary/50";
    }

    if (correctAnswer && correctAnswer[index] === item) {
      return "border-success bg-success/10";
    }

    return "border-error bg-error/10";
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground mb-4">
        اسحب العناصر لترتيبها أو استخدم الأسهم
      </p>
      {items.map((item, index) => (
        <div
          key={item}
          draggable={!disabled}
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragEnd={handleDragEnd}
          className={`
            flex items-center gap-3 p-4 rounded-lg border-2 transition-all duration-200
            ${getItemStyle(item, index)}
            ${disabled ? "cursor-not-allowed" : "cursor-grab active:cursor-grabbing"}
          `}
        >
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-primary">
            {index + 1}
          </span>
          <span className="flex-1 text-foreground">{item}</span>
          {!disabled && !showResult && (
            <div className="flex flex-col gap-1">
              <button
                onClick={() => moveItem(index, "up")}
                disabled={index === 0}
                className="p-1 hover:bg-muted rounded disabled:opacity-30"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <button
                onClick={() => moveItem(index, "down")}
                disabled={index === items.length - 1}
                className="p-1 hover:bg-muted rounded disabled:opacity-30"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          )}
          {showResult && correctAnswer && (
            correctAnswer[index] === item ? (
              <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-error" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )
          )}
        </div>
      ))}
    </div>
  );
}
