"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import SessionProvider from "@/components/admin/SessionProvider";

function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("حدث خطأ أثناء تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ramadan-dark islamic-pattern flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-ramadan-navy/90 backdrop-blur-sm border border-ramadan-gold/20 rounded-2xl p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-ramadan-gold/20 border border-ramadan-gold/30 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-ramadan-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-ramadan-gold">تسجيل دخول الأدمن</h1>
          <p className="text-white/60 mt-2">أدخل بياناتك للوصول للوحة التحكم</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-lg text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">البريد الإلكتروني</label>
            <input
              type="email"
              placeholder="admin@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full px-4 py-3 bg-ramadan-dark border border-ramadan-gold/30 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-ramadan-gold"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">كلمة المرور</label>
            <input
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              className="w-full px-4 py-3 bg-ramadan-dark border border-ramadan-gold/30 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-ramadan-gold"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-ramadan-gold text-ramadan-dark font-bold rounded-lg hover:bg-ramadan-gold-light transition-colors disabled:opacity-50"
          >
            {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <SessionProvider>
      <LoginForm />
    </SessionProvider>
  );
}
