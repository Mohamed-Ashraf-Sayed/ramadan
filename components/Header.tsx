"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-ramadan-dark/95 backdrop-blur-sm shadow-lg sticky top-0 z-50 border-b border-ramadan-gold/20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            {/* Crescent Moon Icon */}
            <div className="w-10 h-10 bg-gradient-to-br from-ramadan-gold to-ramadan-amber rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-ramadan-dark" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3C7.03 3 3 7.03 3 12S7.03 21 12 21C9.5 19 8 16 8 12S9.5 5 12 3Z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-ramadan-gold leading-tight">أسداف</h1>
              <p className="text-xs text-white/60 leading-tight">أكاديمية المهيدب</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-white/80 hover:text-ramadan-gold transition-colors font-medium"
            >
              الرئيسية
            </Link>
            <Link
              href="/quiz"
              className="text-white/80 hover:text-ramadan-gold transition-colors font-medium"
            >
              المسابقات
            </Link>
            <Link
              href="/quiz"
              className="bg-ramadan-gold text-ramadan-dark px-5 py-2 rounded-lg hover:bg-ramadan-gold-light transition-colors font-medium"
            >
              ابدأ الآن
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-white hover:bg-ramadan-gold/10 rounded-lg transition-colors"
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-ramadan-gold/20">
            <div className="flex flex-col gap-2">
              <Link
                href="/"
                className="px-4 py-3 text-white hover:bg-ramadan-gold/10 rounded-lg transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                الرئيسية
              </Link>
              <Link
                href="/quiz"
                className="px-4 py-3 text-white hover:bg-ramadan-gold/10 rounded-lg transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                المسابقات
              </Link>
              <Link
                href="/quiz"
                className="mx-4 mt-2 bg-ramadan-gold text-ramadan-dark px-5 py-3 rounded-lg hover:bg-ramadan-gold-light transition-colors font-medium text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                ابدأ الآن
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
