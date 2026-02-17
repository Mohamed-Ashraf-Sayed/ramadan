"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body style={{ backgroundColor: "#f5f8fc", color: "#1a2e3f", fontFamily: "sans-serif", padding: "2rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>حدث خطأ</h1>
        <p style={{ marginBottom: "1rem", color: "#ef4444" }}>{error.message}</p>
        {error.digest && <p style={{ color: "#5a7a94", fontSize: "0.875rem" }}>Digest: {error.digest}</p>}
        <button
          onClick={reset}
          style={{
            marginTop: "1rem",
            padding: "0.75rem 2rem",
            backgroundColor: "#2e7dba",
            color: "#ffffff",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
          إعادة المحاولة
        </button>
      </body>
    </html>
  );
}
