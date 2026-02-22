"use client";

import { useState, useEffect } from "react";

interface Suggestion {
  id: number;
  name: string;
  phone: string | null;
  notes: string;
  createdAt: string;
  quiz: {
    id: number;
    title: string;
  };
}

export default function SuggestionsPage() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchSuggestions();
  }, []);

  async function fetchSuggestions() {
    try {
      setLoading(true);
      const res = await fetch("/api/submissions");
      const data = await res.json();
      const withNotes = data.filter(
        (s: Suggestion) => s.notes && s.notes.trim()
      );
      setSuggestions(withNotes);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setLoading(false);
    }
  }

  const filtered = suggestions.filter(
    (s) =>
      s.notes.includes(search) ||
      s.name.includes(search) ||
      s.quiz.title.includes(search)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ramadan-gold">
            الاقتراحات والملاحظات
          </h1>
          <p className="text-white/50 text-sm mt-1">
            ملاحظات واقتراحات المشاركين
          </p>
        </div>
        <span className="text-sm bg-ramadan-gold/20 text-ramadan-gold px-4 py-2 rounded-full font-bold">
          {filtered.length} اقتراح
        </span>
      </div>

      {/* Search */}
      <div className="relative">
        <svg
          className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="بحث في الاقتراحات..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pr-10 pl-4 py-3 bg-ramadan-dark border border-ramadan-gold/20 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-ramadan-gold/50"
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-ramadan-gold border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Empty State */}
      {!loading && filtered.length === 0 && (
        <div className="text-center py-20">
          <svg
            className="w-16 h-16 text-white/20 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
            />
          </svg>
          <h2 className="text-xl font-bold text-ramadan-gold mb-2">
            لا توجد اقتراحات
          </h2>
          <p className="text-white/50">لم يقدم أحد اقتراحات بعد</p>
        </div>
      )}

      {/* Suggestions List */}
      {!loading && filtered.length > 0 && (
        <div className="bg-ramadan-purple/30 border border-ramadan-gold/20 rounded-xl overflow-hidden">
          <div className="divide-y divide-white/5">
            {filtered.map((s) => (
              <div
                key={s.id}
                className="px-5 py-4 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-white/90 text-sm whitespace-pre-wrap leading-relaxed">
                      {s.notes}
                    </p>
                  </div>
                  <div className="text-left flex-shrink-0 space-y-1">
                    <p className="text-white/50 text-xs">{s.name}</p>
                    <p className="text-white/30 text-xs">{s.quiz.title}</p>
                    <p className="text-white/20 text-xs" dir="ltr">
                      {new Date(s.createdAt).toLocaleDateString("ar-EG")}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
