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
      <body style={{ backgroundColor: "#1a1a2e", color: "white", fontFamily: "sans-serif", padding: "2rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>حدث خطأ</h1>
        <p style={{ marginBottom: "1rem", color: "#ff6b6b" }}>{error.message}</p>
        {error.digest && <p style={{ color: "#999", fontSize: "0.875rem" }}>Digest: {error.digest}</p>}
        <button
          onClick={reset}
          style={{
            marginTop: "1rem",
            padding: "0.75rem 2rem",
            backgroundColor: "#d4af37",
            color: "#1a1a2e",
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
