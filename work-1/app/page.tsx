"use client";

import Link from "next/link";

export default function HomePage() {
  const apps = [
    {
      href: "/co-minh",
      emoji: "🇬🇧",
      title: "Cô Minh English",
      description: "Chatbot học tiếng Anh với giáo viên AI vui nhộn",
      color: "#1677ff",
      bg: "#e6f4ff",
    },
    {
      href: "/co-lanh",
      emoji: "📖",
      title: "Từ Điển Cô Lành",
      description: "Tra cứu từ vựng với phiên âm, ví dụ và ghi chú ngữ pháp",
      color: "#52c41a",
      bg: "#f6ffed",
    },
  ];

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0f5ff 0%, #ffffff 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Inter', sans-serif",
        padding: "40px 20px",
      }}
    >
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8, color: "#141414" }}>
        🏠 Home Work Apps
      </h1>
      <p style={{ fontSize: 16, color: "#8c8c8c", marginBottom: 48 }}>
        Chọn ứng dụng bạn muốn sử dụng
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 24,
          maxWidth: 900,
          width: "100%",
        }}
      >
        {apps.map((app) => (
          <Link
            key={app.href}
            href={app.href}
            style={{
              textDecoration: "none",
              background: "#ffffff",
              borderRadius: 16,
              padding: "28px 24px",
              boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
              border: "1px solid #f0f0f0",
              transition: "transform 0.2s, box-shadow 0.2s",
              display: "block",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-4px)";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.12)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 24px rgba(0,0,0,0.07)";
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 14,
                background: app.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                marginBottom: 16,
              }}
            >
              {app.emoji}
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: app.color, margin: "0 0 6px" }}>
              {app.title}
            </h2>
            <p style={{ fontSize: 14, color: "#595959", margin: 0, lineHeight: 1.5 }}>
              {app.description}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
